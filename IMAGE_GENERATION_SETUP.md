# Image Generation Setup (Nano Banana)

This document explains how to set up automatic image generation for events using Nano Banana (Google's Gemini 2.5 Flash Image model).

## Overview

When admins create events with descriptions, the system can automatically generate images using Nano Banana AI. The generated images are saved and attached to events automatically.

## Configuration

### Environment Variables

Add the following to your `.env` file:

```env
# Image Generation Proxy URL (Required)
# This should point to your server-side endpoint that handles Nano Banana API calls
VITE_IMAGE_GENERATION_PROXY_URL=http://localhost:3001/api/generate-image

# Alternative: Direct API Key (Not Recommended for Production)
# Only use this if you have a secure way to handle API keys client-side
# VITE_GOOGLE_AI_API_KEY=your-api-key-here
```

## Server-Side Proxy Endpoint

Since API keys should not be exposed in client-side code, you need to create a server-side proxy endpoint. Here's an example structure:

### Example Proxy Endpoint (Node.js/Express)

```javascript
// server/api/generate-image.js
const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

router.post('/generate-image', async (req, res) => {
  try {
    const { prompt, style, aspectRatio, safetyFilter, quality, model } = req.body;
    
    // Use Nano Banana model (Gemini 2.5 Flash Image)
    const modelName = model || 'gemini-2.0-flash-exp';
    
    // Configure image generation parameters
    const generationConfig = {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1024,
    };
    
    // Add style and aspect ratio to prompt
    const enhancedPrompt = `${prompt} Style: ${style}. Aspect ratio: ${aspectRatio}. Safety filter: ${safetyFilter}. Quality: ${quality}.`;
    
    // Generate image using Nano Banana
    const model_instance = genAI.getGenerativeModel({ model: modelName });
    const result = await model_instance.generateContent(enhancedPrompt);
    const response = await result.response;
    
    // Extract image URL from response
    // Note: Actual response structure may vary
    const imageUrl = response.candidates?.[0]?.content?.parts?.[0]?.imageUrl || 
                     response.imageUrl || 
                     response.url;
    
    if (!imageUrl) {
      return res.status(500).json({ 
        error: 'Image URL not found in API response' 
      });
    }
    
    res.json({ 
      imageUrl,
      success: true 
    });
  } catch (error) {
    console.error('Error generating image:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to generate image' 
    });
  }
});

module.exports = router;
```

## Features

### Configurable Options

1. **Style**: Choose from:
   - `photorealistic` - High-quality realistic images
   - `digital-art` - Digital art style
   - `anime` - Anime/manga style
   - `illustration` - Professional illustrations
   - `cinematic` - Cinematic and dramatic

2. **Aspect Ratio**: 
   - `16:9` - Widescreen (default)
   - `4:3` - Standard
   - `1:1` - Square
   - `3:4` - Portrait
   - `9:16` - Vertical

3. **Safety Filter**:
   - `strict` - Maximum content filtering
   - `moderate` - Balanced filtering (default)
   - `permissive` - Minimal filtering

## Usage

1. **Automatic Generation**: When creating a new event, check "Auto-generate image from description" and the system will generate an image when you save the event.

2. **Manual Generation**: Click "Generate Image Now" to generate an image immediately and add it to the event.

3. **Manual Override**: You can still add images manually via URL even if auto-generation is enabled.

## Notes

- Image generation requires a valid Google AI API key with access to Gemini models
- The proxy endpoint is required for security (API keys should not be in client code)
- Generated images are automatically set as the cover image (first in the array)
- If generation fails, you'll be prompted to add images manually

## Troubleshooting

- **"Image generation service not configured"**: Set `VITE_IMAGE_GENERATION_PROXY_URL` in your `.env` file
- **"API error"**: Check your server-side proxy endpoint and API key
- **"Image URL not found"**: The API response structure may have changed - update your proxy endpoint

