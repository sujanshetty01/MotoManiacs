/**
 * Image Generation Service using Nano Banana (Gemini 2.5 Flash Image)
 * Auto-generates event images based on event descriptions
 */

export interface ImageGenerationConfig {
  style?: 'photorealistic' | 'digital-art' | 'anime' | 'illustration' | 'cinematic';
  aspectRatio?: '16:9' | '4:3' | '1:1' | '3:4' | '9:16';
  safetyFilter?: 'strict' | 'moderate' | 'permissive';
  quality?: 'standard' | 'high';
}

export interface ImageGenerationResponse {
  imageUrl: string;
  success: boolean;
  error?: string;
}

/**
 * Generate a structured prompt for event image generation
 */
const generateImagePrompt = (
  title: string,
  description: string,
  eventType: string,
  venue: string,
  config: ImageGenerationConfig = {}
): string => {
  const style = config.style || 'photorealistic';
  const styleDescriptions: Record<string, string> = {
    photorealistic: 'high-quality photorealistic',
    'digital-art': 'stunning digital art',
    anime: 'anime style',
    illustration: 'professional illustration',
    cinematic: 'cinematic and dramatic',
  };

  const styleDesc = styleDescriptions[style] || 'high-quality';

  // Build a comprehensive prompt
  let prompt = `Create a ${styleDesc} image for a motorsport event: "${title}". `;
  
  // Add event type context
  if (eventType === 'Car') {
    prompt += 'Focus on cars, racing, automotive culture. ';
  } else if (eventType === 'Bike') {
    prompt += 'Focus on motorcycles, bikes, two-wheeled vehicles. ';
  }
  
  // Add description details
  if (description) {
    prompt += `Event details: ${description}. `;
  }
  
  // Add venue context if available
  if (venue) {
    prompt += `Location: ${venue}. `;
  }
  
  // Add style-specific instructions
  prompt += `The image should be visually striking, professional, and suitable for event promotion. `;
  prompt += `Include dynamic action, vibrant colors, and an energetic atmosphere that captures the excitement of motorsport events.`;
  
  return prompt;
};

/**
 * Generate image using Nano Banana API (Gemini 2.5 Flash Image)
 * Note: This requires a Google AI API key with access to Gemini models
 * 
 * Since Nano Banana is accessed through Google's services, we'll use a proxy endpoint
 * for security (API keys should not be exposed in client-side code)
 */
export const generateEventImage = async (
  title: string,
  description: string,
  eventType: string,
  venue: string,
  config: ImageGenerationConfig = {}
): Promise<ImageGenerationResponse> => {
  try {
    const prompt = generateImagePrompt(title, description, eventType, venue, config);
    
    // Try proxy endpoint first (preferred for production)
    const proxyUrl = import.meta.env.VITE_IMAGE_GENERATION_PROXY_URL;
    const apiKey = import.meta.env.VITE_GOOGLE_AI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY;
    
    // Use proxy if available
    if (proxyUrl) {
      try {
        const response = await fetch(proxyUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt,
            style: config.style || 'photorealistic',
            aspectRatio: config.aspectRatio || '16:9',
            safetyFilter: config.safetyFilter || 'moderate',
            quality: config.quality || 'high',
            model: 'nano-banana',
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const imageUrl = data.imageUrl || data.url || data.image?.url;
          if (imageUrl) {
            return { imageUrl, success: true };
          }
        }
      } catch (proxyError) {
        console.warn('Proxy endpoint failed, trying direct API:', proxyError);
        // Fall through to direct API
      }
    }
    
    // Fallback to direct API key (for development/testing)
    if (apiKey) {
      try {
        // Use Google's Generative AI API
        // Note: Nano Banana image generation may require a specific endpoint
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`;
        
        const requestBody = {
          contents: [{
            parts: [{
              text: `${prompt} Style: ${config.style || 'photorealistic'}. Aspect ratio: ${config.aspectRatio || '16:9'}.`,
            }],
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        };

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorMessage = errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`;
          throw new Error(errorMessage);
        }

        const data = await response.json();
        
        // Extract image from response
        // Note: Actual response structure depends on Nano Banana API
        const imageUrl = data.candidates?.[0]?.content?.parts?.[0]?.imageUrl || 
                         data.imageUrl || 
                         data.url;
        
        // Check for base64 inline data
        const inlineData = data.candidates?.[0]?.content?.parts?.[0]?.inlineData;
        if (inlineData?.data) {
          const mimeType = inlineData.mimeType || 'image/png';
          return {
            imageUrl: `data:${mimeType};base64,${inlineData.data}`,
            success: true,
          };
        }

        if (imageUrl) {
          return { imageUrl, success: true };
        }
        
        throw new Error('Image URL not found in API response. The API may not support image generation or the response structure has changed.');
      } catch (apiError: any) {
        throw new Error(`Direct API call failed: ${apiError.message}`);
      }
    }
    
    // No configuration found
    return {
      imageUrl: '',
      success: false,
      error: 'Image generation not configured. Please set either:\n' +
             '1. VITE_IMAGE_GENERATION_PROXY_URL (for production)\n' +
             '2. VITE_GOOGLE_AI_API_KEY or VITE_GEMINI_API_KEY (for development)\n' +
             'See IMAGE_GENERATION_SETUP.md for setup instructions.',
    };

  } catch (error: any) {
    console.error('Error generating image:', error);
    return {
      imageUrl: '',
      success: false,
      error: error.message || 'Failed to generate image. Please check your network connection and server configuration.',
    };
  }
};

/**
 * Alternative: Generate image using a proxy service or direct image generation API
 * This is a more flexible approach that can work with various image generation services
 */
export const generateEventImageWithProxy = async (
  title: string,
  description: string,
  eventType: string,
  venue: string,
  config: ImageGenerationConfig = {}
): Promise<ImageGenerationResponse> => {
  try {
    // Use a proxy endpoint that handles Nano Banana API calls
    // This allows for server-side API key management
    const proxyUrl = import.meta.env.VITE_IMAGE_GENERATION_PROXY_URL || '/api/generate-image';
    
    const prompt = generateImagePrompt(title, description, eventType, venue, config);
    
    const response = await fetch(proxyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        style: config.style || 'photorealistic',
        aspectRatio: config.aspectRatio || '16:9',
        safetyFilter: config.safetyFilter || 'moderate',
        quality: config.quality || 'high',
      }),
    });

    if (!response.ok) {
      throw new Error(`Proxy error: ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      imageUrl: data.imageUrl || data.url || '',
      success: !!data.imageUrl || !!data.url,
      error: data.error,
    };
  } catch (error: any) {
    console.error('Error generating image via proxy:', error);
    return {
      imageUrl: '',
      success: false,
      error: error.message || 'Failed to generate image',
    };
  }
};

/**
 * Main function to generate event image automatically
 * This is the primary function to use for auto-generating event images
 */
export const generateEventImageAuto = async (
  title: string,
  description: string,
  eventType: string,
  venue: string,
  config: ImageGenerationConfig = {}
): Promise<ImageGenerationResponse> => {
  // Use the main generation function (which uses proxy)
  return generateEventImage(title, description, eventType, venue, config);
};

