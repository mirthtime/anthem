import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const leonardoApiKey = Deno.env.get('LEONARDO_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (!leonardoApiKey) {
    return new Response(JSON.stringify({ error: 'Leonardo API key not configured' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const { songId, tripId, type, prompt } = await req.json();
    
    if (!songId && !tripId) {
      return new Response(JSON.stringify({ error: 'Either songId or tripId is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Mark as generating
    if (songId) {
      await supabase
        .from('songs')
        .update({ artwork_generating: true })
        .eq('id', songId);
    } else if (tripId) {
      await supabase
        .from('trips')
        .update({ artwork_generating: true })
        .eq('id', tripId);
    }

    console.log('Generating artwork for:', type, songId || tripId);
    console.log('Prompt:', prompt);

    // Step 1: Create generation request
    const generationResponse = await fetch('https://cloud.leonardo.ai/api/rest/v1/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${leonardoApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        height: 1024,
        modelId: "6bef9f1b-29cb-40c7-b9df-32b51c1f67d3", // Leonardo Phoenix model
        prompt: prompt,
        width: 1024,
        num_images: 1,
        guidance_scale: 7,
        num_inference_steps: 30,
        presetStyle: "DYNAMIC"
      }),
    });

    if (!generationResponse.ok) {
      const errorText = await generationResponse.text();
      console.error('Leonardo generation error:', errorText);
      throw new Error(`Leonardo API error: ${generationResponse.status} ${errorText}`);
    }

    const generationData = await generationResponse.json();
    const generationId = generationData.sdGenerationJob.generationId;

    console.log('Generation started with ID:', generationId);

    // Step 2: Poll for completion
    let attempts = 0;
    const maxAttempts = 30; // 5 minutes max
    let imageUrl = null;

    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds
      
      const statusResponse = await fetch(`https://cloud.leonardo.ai/api/rest/v1/generations/${generationId}`, {
        headers: {
          'Authorization': `Bearer ${leonardoApiKey}`,
        },
      });

      if (statusResponse.ok) {
        const statusData = await statusResponse.json();
        const generation = statusData.generations_by_pk;
        
        console.log('Generation status:', generation.status);
        
        if (generation.status === 'COMPLETE' && generation.generated_images.length > 0) {
          imageUrl = generation.generated_images[0].url;
          console.log('Image generated successfully:', imageUrl);
          break;
        } else if (generation.status === 'FAILED') {
          throw new Error('Image generation failed');
        }
      }
      
      attempts++;
    }

    if (!imageUrl) {
      throw new Error('Image generation timed out');
    }

    // Step 3: Update database with artwork URL
    if (songId) {
      await supabase
        .from('songs')
        .update({ 
          artwork_url: imageUrl,
          artwork_generating: false 
        })
        .eq('id', songId);
    } else if (tripId) {
      await supabase
        .from('trips')
        .update({ 
          artwork_url: imageUrl,
          artwork_generating: false 
        })
        .eq('id', tripId);
    }

    return new Response(JSON.stringify({ 
      success: true,
      artwork_url: imageUrl,
      generation_id: generationId
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error generating artwork:', error);
    
    // Clear generating flag on error
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { songId, tripId } = await req.json().catch(() => ({}));
    
    if (songId) {
      await supabase
        .from('songs')
        .update({ artwork_generating: false })
        .eq('id', songId);
    } else if (tripId) {
      await supabase
        .from('trips')
        .update({ artwork_generating: false })
        .eq('id', tripId);
    }

    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});