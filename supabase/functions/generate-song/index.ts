import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY') || 'sk_e28fccc6115f06a4b7f312c13811ced2d588f492e8a58ecd';
const ELEVENLABS_MUSIC_API_URL = 'https://api.elevenlabs.io/v1/music';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { stopName, people, stories, genre, userId, songId } = await req.json();
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Build ElevenLabs prompt with genre-specific style
    const genreStyles = {
      rock: 'energetic rock with electric guitars, powerful drums, and driving bass',
      pop: 'catchy pop with memorable hooks, modern production, and upbeat rhythm',
      country: 'authentic country with acoustic guitar, fiddle, and heartfelt vocals',
      electronic: 'electronic dance music with synthesizers, beats, and dynamic drops',
      folk: 'acoustic folk with storytelling lyrics, gentle guitar, and warm vocals',
      'hip-hop': 'hip-hop with rhythmic flow, strong beats, and creative wordplay',
      jazz: 'smooth jazz with sophisticated harmonies, improvisation, and soulful melody',
      indie: 'indie alternative with unique vocals, creative instrumentation, and emotional depth'
    };
    
    const styleGuide = genreStyles[genre.toLowerCase()] || genreStyles.pop;
    
    const prompt = `Create a ${styleGuide} song about "${stories}" at ${stopName}${people ? ` with ${people}` : ''}. 
    
The song should capture the adventurous spirit of a road trip, with vivid imagery and emotional connection to the place and moment.

Song structure:
- Intro: Set the mood
- Verse 1: Paint the scene of arriving at ${stopName}
- Chorus: Express the main feeling of this stop
- Verse 2: Tell the story: ${stories}
- Chorus: Repeat with more emotion
- Bridge: Reflect on the journey and this moment
- Final Chorus: Bring it home with the memory that will last

Make it authentic, memorable, and emotionally resonant.`;
    
    // Call ElevenLabs Music API
    const response = await fetch(ELEVENLABS_MUSIC_API_URL, {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: prompt,
        duration_seconds: 180, // 3-minute song
        prompt_influence: 0.3,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('ElevenLabs API Error:', errorData);
      throw new Error(`Music generation failed: ${response.status}`);
    }

    const data = await response.json();
    
    // Poll for completion if the API returns a task ID
    let audioUrl = data.audio_url;
    
    if (data.task_id && !audioUrl) {
      // Poll for completion
      let attempts = 0;
      const maxAttempts = 60; // 5 minutes max wait
      
      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
        
        const statusResponse = await fetch(`${ELEVENLABS_MUSIC_API_URL}/status/${data.task_id}`, {
          headers: {
            'xi-api-key': ELEVENLABS_API_KEY,
          },
        });
        
        const statusData = await statusResponse.json();
        
        if (statusData.status === 'completed' && statusData.audio_url) {
          audioUrl = statusData.audio_url;
          break;
        } else if (statusData.status === 'failed') {
          throw new Error('Music generation failed');
        }
        
        attempts++;
      }
      
      if (!audioUrl) {
        throw new Error('Music generation timed out');
      }
    }
    
    // Store the audio file in Supabase storage
    const audioResponse = await fetch(audioUrl);
    const audioBlob = await audioResponse.blob();
    const fileName = `${songId}.mp3`;
    
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('songs')
      .upload(fileName, audioBlob, {
        contentType: 'audio/mpeg',
        upsert: true,
      });
    
    if (uploadError) {
      throw uploadError;
    }
    
    // Get public URL for the uploaded file
    const { data: { publicUrl } } = supabase
      .storage
      .from('songs')
      .getPublicUrl(fileName);
    
    // Update the song record with the audio URL
    const { error: updateError } = await supabase
      .from('songs')
      .update({ 
        audio_url: publicUrl,
        status: 'completed',
        duration: 180
      })
      .eq('id', songId);
    
    if (updateError) {
      throw updateError;
    }
    
    return new Response(JSON.stringify({ 
      success: true,
      audioUrl: publicUrl,
      duration: 180,
      metadata: { stopName, people, stories, genre }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-song function:', error);
    
    // Update song status to failed if we have a songId
    if (req.json && req.json.songId) {
      try {
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        
        await supabase
          .from('songs')
          .update({ status: 'failed', error_message: error.message })
          .eq('id', req.json.songId);
      } catch (updateError) {
        console.error('Failed to update song status:', updateError);
      }
    }
    
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Music generation failed. Please try again.'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});