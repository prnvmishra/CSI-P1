import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY';
const genAI = new GoogleGenerativeAI(API_KEY);

// Function to get mood-based prompt suggestions
export async function getMoodBasedPrompts(mood: string, theme: string): Promise<string[]> {
  try {
    // Check if API key is available
    if (!API_KEY || API_KEY === 'YOUR_GEMINI_API_KEY') {
      console.log('Gemini API key not configured, using fallback prompts');
      return getFallbackPrompts(mood, theme);
    }

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    // Create prompt for Gemini
    const prompt = `Generate 5 creative website customization prompts based on the mood "${mood}" 
    for a website with the "${theme}" theme. Each prompt should be concise (under 10 words) 
    and should suggest visual or interactive elements that would enhance the user experience 
    while matching both the mood and theme. Return only the list of 5 prompts, one per line, 
    without numbering or additional text.`;
    
    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Split the response into individual prompts
    return text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .slice(0, 5); // Ensure we only return at most 5 prompts
    
  } catch (error) {
    console.error('Error generating mood-based prompts:', error);
    return getFallbackPrompts(mood, theme);
  }
}

// Fallback prompts when API is not available
function getFallbackPrompts(mood: string, theme: string): string[] {
  const moodPrompts: Record<string, string[]> = {
    energetic: ['Add bouncing animations', 'Increase brightness', 'Add sparkle effects', 'Make elements glow', 'Add fast transitions'],
    calm: ['Add gentle floating', 'Use soft colors', 'Add breathing animation', 'Make elements sway', 'Add peaceful particles'],
    creative: ['Add random movements', 'Use vibrant colors', 'Add artistic effects', 'Make elements dance', 'Add creative shapes'],
    focused: ['Add subtle highlights', 'Use clean lines', 'Add concentration effects', 'Make elements stable', 'Add focus indicators'],
    playful: ['Add fun animations', 'Use bright colors', 'Add bouncing effects', 'Make elements wiggle', 'Add playful sounds'],
    mysterious: ['Add fog effects', 'Use dark colors', 'Add shadow effects', 'Make elements fade', 'Add mysterious glow'],
    romantic: ['Add heart particles', 'Use warm colors', 'Add gentle effects', 'Make elements float', 'Add romantic glow'],
    adventurous: ['Add dynamic effects', 'Use bold colors', 'Add movement effects', 'Make elements explore', 'Add adventure vibes']
  };

  const themePrompts: Record<string, string[]> = {
    underwater: ['Add bubble effects', 'Use blue colors', 'Add wave animations', 'Make elements float', 'Add ocean sounds'],
    cyberpunk: ['Add neon glow', 'Use electric colors', 'Add glitch effects', 'Make elements pulse', 'Add tech vibes'],
    matrix: ['Add code rain', 'Use green colors', 'Add digital effects', 'Make elements code', 'Add matrix style'],
    rain: ['Add rain drops', 'Use gray colors', 'Add water effects', 'Make elements drip', 'Add storm effects'],
    fireball: ['Add fire particles', 'Use red colors', 'Add heat effects', 'Make elements burn', 'Add flame animations'],
    jungle: ['Add leaf particles', 'Use green colors', 'Add nature effects', 'Make elements grow', 'Add jungle sounds'],
    retro: ['Add scanlines', 'Use vintage colors', 'Add CRT effects', 'Make elements pixelate', 'Add retro vibes'],
    dystopian: ['Add fog effects', 'Use dark colors', 'Add shadow effects', 'Make elements fade', 'Add gloomy atmosphere']
  };

  const moodBased = moodPrompts[mood.toLowerCase()] || moodPrompts.creative;
  const themeBased = themePrompts[theme.toLowerCase()] || themePrompts.underwater;
  
  return [...moodBased.slice(0, 3), ...themeBased.slice(0, 2)];
}

// Function to convert a user prompt into specific website behaviors/effects
export async function convertPromptToEffects(prompt: string): Promise<string[]> {
  try {
    // Check if API key is available
    if (!API_KEY || API_KEY === 'YOUR_GEMINI_API_KEY') {
      console.log('Gemini API key not configured, using fallback effects');
      return getFallbackEffects(prompt);
    }

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    // Create prompt for Gemini
    const aiPrompt = `Convert the following user prompt into 1-3 specific website visual or 
    interactive effects. Return commands in the format "run-effect:effect-name" where effect-name 
    is one of: zero-gravity, jungle-floating, rain-drops, matrix-code, fire-animation, 
    underwater-bubbles, cyberpunk-glitch, retro-scanlines, dystopian-fog, floating-particles, 
    neon-glow, sparkle-effect, wave-effect, color-shift, snow-flakes.
    
    User prompt: "${prompt}"
    
    Return only the commands, one per line, without numbering or additional text. 
    Example output format:
    run-effect:floating-particles
    run-effect:neon-glow
    run-effect:sparkle-effect`;
    
    // Generate content
    const result = await model.generateContent(aiPrompt);
    const response = await result.response;
    const text = response.text();
    
    // Split the response into individual commands
    return text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0 && line.startsWith('run-effect:'))
      .slice(0, 3); // Ensure we only return at most 3 commands
    
  } catch (error) {
    console.error('Error converting prompt to effects:', error);
    return getFallbackEffects(prompt);
  }
}

// Fallback effects when API is not available
function getFallbackEffects(prompt: string): string[] {
  const lowerPrompt = prompt.toLowerCase();
  
  // Map common prompt words to effects
  if (lowerPrompt.includes('space') || lowerPrompt.includes('cosmic') || lowerPrompt.includes('galaxy')) {
    return ['run-effect:zero-gravity'];
  }
  if (lowerPrompt.includes('bounce') || lowerPrompt.includes('jump') || lowerPrompt.includes('spring')) {
    return ['run-effect:floating-particles'];
  }
  if (lowerPrompt.includes('float') || lowerPrompt.includes('flying') || lowerPrompt.includes('levitate')) {
    return ['run-effect:zero-gravity'];
  }
  if (lowerPrompt.includes('glow') || lowerPrompt.includes('neon') || lowerPrompt.includes('bright')) {
    return ['run-effect:neon-glow'];
  }
  if (lowerPrompt.includes('particle') || lowerPrompt.includes('sparkle') || lowerPrompt.includes('stars')) {
    return ['run-effect:sparkle-effect'];
  }
  if (lowerPrompt.includes('wave') || lowerPrompt.includes('water') || lowerPrompt.includes('ocean')) {
    return ['run-effect:wave-effect'];
  }
  if (lowerPrompt.includes('color') || lowerPrompt.includes('rainbow') || lowerPrompt.includes('vibrant')) {
    return ['run-effect:color-shift'];
  }
  if (lowerPrompt.includes('fire') || lowerPrompt.includes('flame') || lowerPrompt.includes('burn')) {
    return ['run-effect:fire-animation'];
  }
  if (lowerPrompt.includes('rain') || lowerPrompt.includes('drop') || lowerPrompt.includes('storm')) {
    return ['run-effect:rain-drops'];
  }
  if (lowerPrompt.includes('matrix') || lowerPrompt.includes('code') || lowerPrompt.includes('digital')) {
    return ['run-effect:matrix-code'];
  }
  if (lowerPrompt.includes('bubble') || lowerPrompt.includes('underwater') || lowerPrompt.includes('sea')) {
    return ['run-effect:underwater-bubbles'];
  }
  if (lowerPrompt.includes('fog') || lowerPrompt.includes('mist') || lowerPrompt.includes('cloud')) {
    return ['run-effect:dystopian-fog'];
  }
  if (lowerPrompt.includes('jungle') || lowerPrompt.includes('nature') || lowerPrompt.includes('forest')) {
    return ['run-effect:jungle-floating'];
  }
  if (lowerPrompt.includes('cyberpunk') || lowerPrompt.includes('glitch') || lowerPrompt.includes('tech')) {
    return ['run-effect:cyberpunk-glitch'];
  }
  if (lowerPrompt.includes('retro') || lowerPrompt.includes('vintage') || lowerPrompt.includes('old')) {
    return ['run-effect:retro-scanlines'];
  }
  if (lowerPrompt.includes('snow') || lowerPrompt.includes('winter') || lowerPrompt.includes('cold')) {
    return ['run-effect:snow-flakes'];
  }
  if (lowerPrompt.includes('dance') || lowerPrompt.includes('move') || lowerPrompt.includes('animate')) {
    return ['run-effect:floating-particles'];
  }
  if (lowerPrompt.includes('shake') || lowerPrompt.includes('vibrate') || lowerPrompt.includes('tremble')) {
    return ['run-effect:sparkle-effect'];
  }
  
  // Default effects
  return ['run-effect:floating-particles', 'run-effect:neon-glow'];
}