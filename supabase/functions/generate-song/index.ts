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
    const { stopName, people, stories, genre } = await req.json();
    
    // Build ElevenLabs prompt with proper song structure
    const prompt = `Create a full-length ${genre} song about ${stories} at ${stopName}${people ? ` with ${people}` : ''}, capturing an adventurous road trip vibe. 

Structure the song with:
- Verse 1: Set the scene and introduce the story
- Chorus: Capture the main feeling and memory 
- Verse 2: Develop the story with more details
- Chorus: Repeat the main hook
- Bridge: Reflect on what this moment meant
- Final Chorus: Bring it home with emotion

Make it a complete, radio-ready song with natural pacing and emotional depth.`;
    
    // TODO: Integrate with ElevenLabs Music API when user provides API key
    
    return new Response(JSON.stringify({ 
      message: "Song generation ready - ElevenLabs API key needed",
      prompt,
      metadata: { stopName, people, stories, genre }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});