/**
 * Generate Anthem favicon using Gemini 2.0 Flash image generation
 *
 * Usage: GEMINI_API_KEY=your_key node scripts/generate-favicon.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error('Error: GEMINI_API_KEY environment variable is required');
  process.exit(1);
}

const API_BASE = 'https://generativelanguage.googleapis.com/v1beta';
const MODEL = 'gemini-2.0-flash-exp';

const FAVICON_PROMPT = `Generate an app icon: a golden vinyl record disc on a deep charcoal black background. The vinyl should be warm amber gold color. Simple, minimalist, iconic design. Square format. No text.`;

async function generateFavicon() {
  console.log('Generating Anthem favicon with Gemini 2.0 Flash...');
  console.log('Prompt:', FAVICON_PROMPT);
  console.log('');

  const response = await fetch(
    `${API_BASE}/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: FAVICON_PROMPT }]
        }],
        generationConfig: {
          responseModalities: ['image', 'text'],
          responseMimeType: 'text/plain'
        }
      })
    }
  );

  if (!response.ok) {
    const error = await response.text();
    console.error('Failed to generate favicon:', error);
    process.exit(1);
  }

  const result = await response.json();
  console.log('Generation complete!');

  // Find image part in response
  let imageData = null;
  for (const candidate of result.candidates || []) {
    for (const part of candidate.content?.parts || []) {
      if (part.inlineData?.mimeType?.startsWith('image/')) {
        imageData = part.inlineData.data;
        break;
      }
    }
    if (imageData) break;
  }

  if (!imageData) {
    console.log('Response structure:', JSON.stringify(result, null, 2));
    console.error('Could not find image data in response');
    process.exit(1);
  }

  // Save as PNG
  const pngPath = path.join(__dirname, '..', 'public', 'favicon.png');
  fs.writeFileSync(pngPath, Buffer.from(imageData, 'base64'));
  console.log('Saved PNG to:', pngPath);

  // Also save PWA icons
  const pwa192Path = path.join(__dirname, '..', 'public', 'pwa-192x192.png');
  const pwa512Path = path.join(__dirname, '..', 'public', 'pwa-512x512.png');
  fs.writeFileSync(pwa192Path, Buffer.from(imageData, 'base64'));
  fs.writeFileSync(pwa512Path, Buffer.from(imageData, 'base64'));
  console.log('Saved PWA icons');

  console.log('');
  console.log('Done! Update index.html to use favicon.png');
}

generateFavicon().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
