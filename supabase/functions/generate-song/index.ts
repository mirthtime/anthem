import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { getCorsHeaders } from '../_shared/cors.ts';
import { checkRateLimit, RATE_LIMITS } from '../_shared/rate-limit.ts';
import { validateSongGenerationRequest, sanitizeString } from '../_shared/validation.ts';

const ELEVENLABS_MUSIC_API_URL = 'https://api.elevenlabs.io/v1/music';

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check for API key at runtime
    const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');
    if (!ELEVENLABS_API_KEY) {
      console.error('ELEVENLABS_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'Music generation service not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 503 }
      );
    }
    const requestData = await req.json();
    
    // Validate input
    const validation = validateSongGenerationRequest(requestData);
    if (!validation.isValid) {
      return new Response(
        JSON.stringify({ error: 'Invalid input', details: validation.errors }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    // Sanitize string inputs
    const stopName = sanitizeString(requestData.stopName);
    const people = requestData.people ? sanitizeString(requestData.people) : null;
    const stories = requestData.stories ? sanitizeString(requestData.stories) : null;
    const genre = requestData.genre;
    const mood = requestData.mood ? sanitizeString(requestData.mood) : null;
    const customStyle = requestData.customStyle ? sanitizeString(requestData.customStyle) : null;
    const customLyrics = requestData.customLyrics ? sanitizeString(requestData.customLyrics) : null;
    const userId = requestData.userId;
    const songId = requestData.songId;
    
    // Check rate limit
    const { allowed, remainingRequests } = await checkRateLimit(
      userId,
      RATE_LIMITS.songGeneration
    );
    
    if (!allowed) {
      return new Response(
        JSON.stringify({ 
          error: 'Rate limit exceeded. Please try again later.',
          retryAfter: 3600 // 1 hour in seconds
        }),
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Limit': String(RATE_LIMITS.songGeneration.maxRequests)
          }, 
          status: 429 
        }
      );
    }
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Build ElevenLabs prompt with genre-specific style
    const genreStyles: Record<string, string> = {
      rock: 'energetic rock with electric guitars, powerful drums, and driving bass',
      pop: 'catchy pop with memorable hooks, modern production, and upbeat rhythm',
      country: 'authentic country with acoustic guitar, fiddle, and heartfelt vocals',
      electronic: 'electronic dance music with synthesizers, beats, and dynamic drops',
      folk: 'acoustic folk with storytelling lyrics, gentle guitar, and warm vocals',
      'hip-hop': 'hip-hop with rhythmic flow, strong beats, and creative wordplay',
      jazz: 'smooth jazz with sophisticated harmonies, improvisation, and soulful melody',
      indie: 'indie alternative with unique vocals, creative instrumentation, and emotional depth',
      blues: 'soulful blues with expressive guitar, walking bass, and emotional vocals'
    };

    // Mood descriptions for the AI
    const moodDescriptions: Record<string, string> = {
      upbeat: 'upbeat, energetic, and celebratory with a fast tempo',
      chill: 'relaxed, laid-back, and mellow with a smooth groove',
      nostalgic: 'nostalgic, reflective, and bittersweet with emotional depth',
      adventurous: 'bold, exciting, and triumphant with building energy',
      romantic: 'tender, sweet, and heartfelt with gentle melodies',
      funny: 'playful, lighthearted, and humorous with a fun vibe'
    };

    // Use custom style if provided, otherwise use genre preset
    let styleGuide: string;
    if (genre.toLowerCase() === 'custom' && customStyle) {
      styleGuide = customStyle;
    } else {
      styleGuide = genreStyles[genre.toLowerCase()] || genreStyles.pop;
    }

    // Add mood to style guide if provided
    const moodGuide = mood ? moodDescriptions[mood.toLowerCase()] || mood : null;

    // Build the prompt
    let prompt = `Create a ${styleGuide} song`;

    if (moodGuide) {
      prompt += ` that feels ${moodGuide}`;
    }

    prompt += ` about "${stories}" at ${stopName}`;

    if (people) {
      prompt += ` with ${people}`;
    }

    prompt += `. The song should capture the adventurous spirit of a road trip, with vivid imagery and emotional connection to the place and moment.`;

    // If custom lyrics are provided, include them in the prompt
    if (customLyrics) {
      prompt += `

IMPORTANT: Use these specific lyrics for the song:

${customLyrics}

Follow this lyric structure exactly, matching the verses, chorus, and bridge as written.`;
    } else {
      // Default song structure guidance
      prompt += `

Song structure:
- Intro: Set the mood
- Verse 1: Paint the scene of arriving at ${stopName}
- Chorus: Express the main feeling of this stop
- Verse 2: Tell the story: ${stories}
- Chorus: Repeat with more emotion
- Bridge: Reflect on the journey and this moment
- Final Chorus: Bring it home with the memory that will last`;
    }

    prompt += `

Make it authentic, memorable, and emotionally resonant.`;
    
    // Call ElevenLabs Music API
    // API returns binary audio directly, not JSON
    console.log('Calling ElevenLabs Music API with prompt:', prompt.substring(0, 100) + '...');

    const response = await fetch(ELEVENLABS_MUSIC_API_URL, {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt,
        music_length_ms: 180000, // 3-minute song (180 seconds * 1000)
        output_format: 'mp3_44100_128',
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('ElevenLabs API Error:', response.status, errorData);

      // Parse error message if JSON
      let errorMessage = `Music generation failed: ${response.status}`;
      try {
        const errorJson = JSON.parse(errorData);
        if (errorJson.detail?.message) {
          errorMessage = errorJson.detail.message;
        } else if (errorJson.message) {
          errorMessage = errorJson.message;
        }
      } catch {
        // Use raw error text if not JSON
        if (errorData) {
          errorMessage = errorData;
        }
      }

      throw new Error(errorMessage);
    }

    // ElevenLabs returns binary audio directly
    const audioBlob = await response.blob();

    if (audioBlob.size === 0) {
      throw new Error('Received empty audio file from ElevenLabs');
    }

    console.log('Received audio blob, size:', audioBlob.size, 'bytes');
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

    return new Response(JSON.stringify({
      error: error.message,
      details: 'Music generation failed. Please try again.'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});