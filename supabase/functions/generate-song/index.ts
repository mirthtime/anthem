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
    const { stopName, people, stories, genre, duration } = await req.json();
    
    // Build ElevenLabs prompt
    const prompt = `Create an upbeat ${genre} song about ${stories} at ${stopName}${people ? ` with ${people}` : ''}, capturing an adventurous road trip vibe. Duration: ${duration} seconds.`;
    
    // TODO: Integrate with ElevenLabs Music API when user provides API key
    
    return new Response(JSON.stringify({ 
      message: "Song generation ready - ElevenLabs API key needed",
      prompt,
      metadata: { stopName, people, stories, genre, duration }
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