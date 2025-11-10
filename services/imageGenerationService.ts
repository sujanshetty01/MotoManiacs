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
    
    // Use proxy endpoint for security (handles API keys server-side)
    // If no proxy is configured, return error
    const proxyUrl = import.meta.env.VITE_IMAGE_GENERATION_PROXY_URL;
    
    if (!proxyUrl) {
      console.warn('Image generation proxy URL not configured');
      return {
        imageUrl: '',
        success: false,
        error: 'Image generation service not configured. Please set VITE_IMAGE_GENERATION_PROXY_URL in your environment variables. See IMAGE_GENERATION_SETUP.md for setup instructions.',
      };
    }
    
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
        model: 'nano-banana', // Specify Nano Banana model
      }),
    }).catch((fetchError) => {
      // Handle network errors (CORS, connection refused, etc.)
      if (fetchError instanceof TypeError && fetchError.message.includes('Failed to fetch')) {
        throw new Error(
          'Unable to connect to image generation service. Please check:\n' +
          '1. The proxy URL is correct in your .env file\n' +
          '2. The server-side proxy endpoint is running\n' +
          '3. There are no CORS issues\n' +
          'See IMAGE_GENERATION_SETUP.md for setup instructions.'
        );
      }
      throw fetchError;
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        error: `HTTP ${response.status}: ${response.statusText}`,
      }));
      throw new Error(errorData.error || errorData.message || `API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Extract image URL from response
    const imageUrl = data.imageUrl || data.url || data.image?.url;

    if (!imageUrl) {
      console.warn('Image URL not found in response');
      return {
        imageUrl: '',
        success: false,
        error: 'Image URL not found in API response. The server may need to be updated.',
      };
    }

    return {
      imageUrl,
      success: true,
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

