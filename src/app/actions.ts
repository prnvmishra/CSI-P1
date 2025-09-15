'use server';

import { interpretUserPrompt } from '@/ai/flows/interpret-user-prompts';
import { suggestPromptsBasedOnTheme } from '@/ai/flows/suggest-prompts-based-on-theme';
import { z } from 'zod';

const promptSchema = z.object({
  prompt: z.string().min(1, 'Prompt cannot be empty.'),
});

interface FormState {
  commands?: string[];
  error?: string;
}

export async function getCommandsForPrompt(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = promptSchema.safeParse({
    prompt: formData.get('prompt'),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors.prompt?.[0] || 'Invalid prompt.',
    };
  }

  try {
    const result = await interpretUserPrompt({ prompt: validatedFields.data.prompt });
    if (result && result.commands) {
      return { commands: result.commands };
    }
    return { error: 'Could not interpret the prompt.' };
  } catch (error) {
    console.error('AI Error:', error);
    // Return fallback effects based on the prompt
    const prompt = validatedFields.data.prompt.toLowerCase();
    let fallbackCommands = ['run-effect:floating-particles', 'run-effect:neon-glow'];
    
    if (prompt.includes('bounce') || prompt.includes('jump')) {
      fallbackCommands = ['run-effect:floating-particles'];
    } else if (prompt.includes('space') || prompt.includes('cosmic')) {
      fallbackCommands = ['run-effect:zero-gravity'];
    } else if (prompt.includes('rain') || prompt.includes('storm')) {
      fallbackCommands = ['run-effect:rain-drops'];
    } else if (prompt.includes('snow') || prompt.includes('winter')) {
      fallbackCommands = ['run-effect:snow-flakes'];
    } else if (prompt.includes('fire') || prompt.includes('flame')) {
      fallbackCommands = ['run-effect:fire-animation'];
    } else if (prompt.includes('matrix') || prompt.includes('code')) {
      fallbackCommands = ['run-effect:matrix-code'];
    } else if (prompt.includes('bubble') || prompt.includes('underwater')) {
      fallbackCommands = ['run-effect:underwater-bubbles'];
    } else if (prompt.includes('glow') || prompt.includes('neon')) {
      fallbackCommands = ['run-effect:neon-glow'];
    } else if (prompt.includes('sparkle') || prompt.includes('particle')) {
      fallbackCommands = ['run-effect:sparkle-effect'];
    }
    
    return { 
      commands: fallbackCommands,
      error: 'AI service unavailable, using fallback effects.'
    };
  }
}

export async function getSuggestedPrompts(theme: string) {
    if (!theme) return [];
    try {
        const result = await suggestPromptsBasedOnTheme({ theme });
        return result.suggestedPrompts || [];
    } catch (error) {
        console.error('AI Suggestion Error:', error);
        // Return fallback prompts based on theme
        const fallbackPrompts: Record<string, string[]> = {
            'underwater': ['Add bubble effects', 'Create wave animations', 'Make elements float', 'Add ocean sounds', 'Create underwater glow'],
            'cyberpunk': ['Add neon glow', 'Create glitch effects', 'Add electric animations', 'Make elements pulse', 'Add tech vibes'],
            'matrix': ['Add code rain', 'Create digital effects', 'Make elements code', 'Add matrix style', 'Create green glow'],
            'rain': ['Add rain drops', 'Create water effects', 'Make elements drip', 'Add storm effects', 'Create rainy atmosphere'],
            'fireball': ['Add fire particles', 'Create heat effects', 'Make elements burn', 'Add flame animations', 'Create fire glow'],
            'jungle': ['Add leaf particles', 'Create nature effects', 'Make elements grow', 'Add jungle sounds', 'Create forest vibes'],
            'retro': ['Add scanlines', 'Create CRT effects', 'Make elements pixelate', 'Add retro vibes', 'Create vintage glow'],
            'dystopian': ['Add fog effects', 'Create shadow effects', 'Make elements fade', 'Add gloomy atmosphere', 'Create dark vibes'],
            'zero-gravity': ['Make elements float', 'Add space effects', 'Create floating particles', 'Add cosmic glow', 'Create zero-gravity vibes'],
            'snow': ['Add snowflakes', 'Create winter effects', 'Make elements freeze', 'Add cold atmosphere', 'Create winter wonderland']
        };
        return fallbackPrompts[theme.toLowerCase()] || ['Add floating effects', 'Create animations', 'Make elements move', 'Add visual effects', 'Create dynamic behavior'];
    }
}
