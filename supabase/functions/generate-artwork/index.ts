import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LEONARDO_API_KEY = Deno.env.get('LEONARDO_API_KEY');
    if (!LEONARDO_API_KEY) {
      throw new Error('LEONARDO_API_KEY is not configured');
    }

    const { prompt, width = 1024, height = 1024, type = 'song' } = await req.json();
    
    if (!prompt) {
      return new Response(JSON.stringify({ error: "Prompt is required" }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Generating ${type} artwork with prompt:`, prompt);

    // Create generation with Leonardo AI - using their documented API format
    const generationResponse = await fetch('https://cloud.leonardo.ai/api/rest/v1/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LEONARDO_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt,
        modelId: "6bef9f1b-29cb-40c7-b9df-32b51c1f67d3", // Leonardo Phoenix model
        width: width,
        height: height,
        num_images: 1
      }),
    });

    if (!generationResponse.ok) {
      const errorText = await generationResponse.text();
      console.error('Leonardo API error:', errorText);
      throw new Error(`Leonardo API error: ${generationResponse.status} - ${errorText}`);
    }

    const generationData = await generationResponse.json();
    const generationId = generationData.sdGenerationJob?.generationId;

    if (!generationId) {
      throw new Error('No generation ID returned from Leonardo API');
    }

    console.log('Generation started with ID:', generationId);

    // Poll for completion
    let attempts = 0;
    const maxAttempts = 30; // 5 minutes max wait time
    
    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds
      attempts++;

      const statusResponse = await fetch(`https://cloud.leonardo.ai/api/rest/v1/generations/${generationId}`, {
        headers: {
          'Authorization': `Bearer ${LEONARDO_API_KEY}`,
        },
      });

      if (!statusResponse.ok) {
        console.error('Status check failed:', statusResponse.status);
        continue;
      }

      const statusData = await statusResponse.json();
      const generation = statusData.generations_by_pk;

      console.log(`Attempt ${attempts}: Status - ${generation.status}`);

      if (generation?.status === 'COMPLETE') {
        const imageUrl = generation.generated_images?.[0]?.url;
        if (!imageUrl) {
          throw new Error('No image URL in completed generation');
        }
        console.log('Artwork generation completed:', imageUrl);
        
        return new Response(JSON.stringify({ 
          imageUrl,
          generationId,
          status: 'completed'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } else if (generation?.status === 'FAILED') {
        throw new Error('Image generation failed');
      }
    }

    // If we get here, generation timed out
    return new Response(JSON.stringify({ 
      error: "Generation timed out",
      generationId,
      status: 'timeout'
    }), {
      status: 408,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-artwork function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});