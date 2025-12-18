/**
 * Generate a cinematic hero video for Anthem landing page using Veo 3
 *
 * Usage: GEMINI_API_KEY=your_key node scripts/generate-hero-video.js
 */

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error('Error: GEMINI_API_KEY environment variable is required');
  console.log('Usage: GEMINI_API_KEY=your_key node scripts/generate-hero-video.js');
  process.exit(1);
}

const MODEL = 'veo-3.0-generate-001'; // Using Veo 3 for better pricing
const API_BASE = 'https://generativelanguage.googleapis.com/v1beta';

// Cinematic prompt for Golden Hour Cinema aesthetic
const VIDEO_PROMPT = `Cinematic slow-motion aerial shot following a vintage car driving on an empty desert highway at golden hour. Warm amber and orange sunset light bathes the landscape. Dramatic clouds streak across the sky. The camera slowly pulls back to reveal vast open terrain. Nostalgic road trip atmosphere. Shot on 35mm film with natural grain. Shallow depth of field. No text or people visible. Peaceful, contemplative mood.`;

const NEGATIVE_PROMPT = 'text, words, letters, logos, watermarks, people faces, modern cars, night time, rain, snow, urban, city';

async function generateVideo() {
  console.log('Starting video generation with Veo 3...');
  console.log('Prompt:', VIDEO_PROMPT);
  console.log('');

  // Step 1: Start the video generation
  const startResponse = await fetch(
    `${API_BASE}/models/${MODEL}:predictLongRunning?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        instances: [{
          prompt: VIDEO_PROMPT
        }],
        parameters: {
          aspectRatio: '16:9',
          durationSeconds: 8,
          negativePrompt: NEGATIVE_PROMPT,
          sampleCount: 1
        }
      })
    }
  );

  if (!startResponse.ok) {
    const error = await startResponse.text();
    console.error('Failed to start video generation:', error);
    process.exit(1);
  }

  const operation = await startResponse.json();
  console.log('Generation started. Operation:', operation.name);

  // Step 2: Poll for completion
  const operationName = operation.name;
  let result = null;
  let attempts = 0;
  const maxAttempts = 60; // 10 minutes max (10 second intervals)

  console.log('Polling for completion...');

  while (attempts < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds
    attempts++;

    const pollResponse = await fetch(
      `${API_BASE}/${operationName}?key=${GEMINI_API_KEY}`
    );

    if (!pollResponse.ok) {
      console.error('Poll failed:', await pollResponse.text());
      continue;
    }

    const pollResult = await pollResponse.json();
    console.log(`Poll attempt ${attempts}: done=${pollResult.done}`);

    if (pollResult.done) {
      result = pollResult;
      break;
    }
  }

  if (!result) {
    console.error('Video generation timed out after', maxAttempts * 10, 'seconds');
    process.exit(1);
  }

  if (result.error) {
    console.error('Video generation failed:', result.error);
    process.exit(1);
  }

  // Step 3: Extract video URL
  console.log('');
  console.log('Generation complete!');
  console.log('Result:', JSON.stringify(result, null, 2));

  // The video URL should be in the response
  if (result.response?.generatedVideos?.[0]?.video?.uri) {
    const videoUrl = result.response.generatedVideos[0].video.uri;
    console.log('');
    console.log('Video URL:', videoUrl);
    console.log('');
    console.log('Download the video and save it to: public/hero-video.mp4');
  } else if (result.response?.predictions?.[0]?.video) {
    console.log('');
    console.log('Video data received. Check result structure above.');
  } else {
    console.log('');
    console.log('Check the result structure above for video location.');
  }
}

generateVideo().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
