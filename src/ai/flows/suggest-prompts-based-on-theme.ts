'use server';

/**
 * @fileOverview A flow to suggest relevant prompts based on a selected theme.
 *
 * - suggestPromptsBasedOnTheme - A function that suggests prompts based on the selected theme.
 * - SuggestPromptsInput - The input type for the suggestPromptsBasedOnTheme function.
 * - SuggestPromptsOutput - The return type for the suggestPromptsBasedOnTheme function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestPromptsInputSchema = z.object({
  theme: z.string().describe('The selected theme (e.g., Underwater, Cyberpunk, Retro, Zero Gravity).'),
});
export type SuggestPromptsInput = z.infer<typeof SuggestPromptsInputSchema>;

const SuggestPromptsOutputSchema = z.object({
  suggestedPrompts: z.array(z.string()).describe('An array of suggested prompts relevant to the selected theme.'),
});
export type SuggestPromptsOutput = z.infer<typeof SuggestPromptsOutputSchema>;

export async function suggestPromptsBasedOnTheme(input: SuggestPromptsInput): Promise<SuggestPromptsOutput> {
  return suggestPromptsBasedOnThemeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestPromptsBasedOnThemePrompt',
  input: {schema: SuggestPromptsInputSchema},
  output: {schema: SuggestPromptsOutputSchema},
  prompt: `You are an expert in suggesting prompts for a dynamic website generator.

  The user has selected the following theme: {{{theme}}}

  Suggest 5 prompts that the user could use to enhance this theme. The prompts should be creative and specific, and related to website styling, animations, or behavior.
  Return the prompts as a JSON array of strings.
  `,
});

const suggestPromptsBasedOnThemeFlow = ai.defineFlow(
  {
    name: 'suggestPromptsBasedOnThemeFlow',
    inputSchema: SuggestPromptsInputSchema,
    outputSchema: SuggestPromptsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
