import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Use Google Gemini API key
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY') || 'AIzaSyB_FOQ5x8P5gLe3wWLNDeYKT5PNqZ36eyU';
    
    const { prompt, width = 1024, height = 1024, type = 'song' } = await req.json();
    
    if (!prompt) {
      return new Response(JSON.stringify({ error: "Prompt is required" }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Generating ${type} artwork with prompt:`, prompt);

    // Enhanced prompt for better image generation
    const enhancedPrompt = `Create a beautiful album cover artwork: ${prompt}. Style: Professional album cover art, vibrant colors, high quality, artistic, no text or words.`;

    try {
      // Try using Gemini's image generation API (if available)
      const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Generate an image: ${enhancedPrompt}`
            }]
          }],
          generationConfig: {
            temperature: 0.9,
            topK: 32,
            topP: 1,
            maxOutputTokens: 4096,
          },
        }),
      });

      if (geminiResponse.ok) {
        const data = await geminiResponse.json();
        // Check if response contains image data
        if (data.candidates?.[0]?.content?.parts?.[0]?.inlineData) {
          const imageData = data.candidates[0].content.parts[0].inlineData;
          const imageUrl = `data:${imageData.mimeType};base64,${imageData.data}`;
          
          // Store in Supabase storage
          const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
          const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
          const supabase = createClient(supabaseUrl, supabaseServiceKey);
          
          // Convert base64 to blob
          const base64Response = await fetch(imageUrl);
          const blob = await base64Response.blob();
          
          // Upload to storage
          const fileName = `artwork/${Date.now()}-${type}.png`;
          const { data: uploadData, error: uploadError } = await supabase
            .storage
            .from('artwork')
            .upload(fileName, blob, {
              contentType: 'image/png',
              upsert: true,
            });
          
          if (uploadError) {
            throw uploadError;
          }
          
          // Get public URL
          const { data: { publicUrl } } = supabase
            .storage
            .from('artwork')
            .getPublicUrl(fileName);
          
          return new Response(JSON.stringify({ 
            imageUrl: publicUrl,
            status: 'completed'
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
      }
    } catch (geminiError) {
      console.log('Gemini image generation not available, falling back to placeholder');
    }

    // Fallback: Generate a placeholder image URL using a free service
    const placeholderServices = [
      `https://source.unsplash.com/${width}x${height}/?${encodeURIComponent(type === 'song' ? 'music,album' : 'road,trip')}`,
      `https://picsum.photos/${width}/${height}?random=${Date.now()}`,
      `https://via.placeholder.com/${width}x${height}/FF6B6B/FFFFFF?text=${encodeURIComponent(type === 'song' ? 'Album Art' : 'Trip Photo')}`
    ];

    // Try fetching from placeholder service
    for (const serviceUrl of placeholderServices) {
      try {
        const imageResponse = await fetch(serviceUrl);
        if (imageResponse.ok) {
          const imageBlob = await imageResponse.blob();
          
          // Store in Supabase
          const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
          const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
          const supabase = createClient(supabaseUrl, supabaseServiceKey);
          
          const fileName = `artwork/${Date.now()}-${type}.jpg`;
          const { data: uploadData, error: uploadError } = await supabase
            .storage
            .from('artwork')
            .upload(fileName, imageBlob, {
              contentType: 'image/jpeg',
              upsert: true,
            });
          
          if (uploadError) {
            console.error('Upload error:', uploadError);
            continue;
          }
          
          const { data: { publicUrl } } = supabase
            .storage
            .from('artwork')
            .getPublicUrl(fileName);
          
          console.log('Artwork generation completed with placeholder:', publicUrl);
          
          return new Response(JSON.stringify({ 
            imageUrl: publicUrl,
            status: 'completed',
            isPlaceholder: true
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
      } catch (error) {
        console.error(`Failed to fetch from ${serviceUrl}:`, error);
        continue;
      }
    }

    // If all else fails, return a default gradient image URL
    const colors = ['FF6B6B', '4ECDC4', 'A8E6CF', 'FFD93D', '6C5CE7', 'FDA7DF'];
    const randomColor1 = colors[Math.floor(Math.random() * colors.length)];
    const randomColor2 = colors[Math.floor(Math.random() * colors.length)];
    const defaultImageUrl = `https://via.placeholder.com/${width}x${height}/${randomColor1}/${randomColor2}?text=🎵`;
    
    return new Response(JSON.stringify({ 
      imageUrl: defaultImageUrl,
      status: 'completed',
      isPlaceholder: true,
      message: 'Using placeholder artwork'
    }), {
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