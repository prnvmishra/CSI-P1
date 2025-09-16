// src/ai/flows/interpret-user-prompts.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow that interprets user prompts and converts them into actionable frontend commands.
 *
 * - interpretUserPrompt - A function that takes a user prompt as input and returns a set of commands.
 * - InterpretUserPromptInput - The input type for the interpretUserPrompt function.
 * - InterpretUserPromptOutput - The return type for the interpretUserPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InterpretUserPromptInputSchema = z.object({
  prompt: z.string().describe('The user-provided prompt to interpret.'),
});
export type InterpretUserPromptInput = z.infer<typeof InterpretUserPromptInputSchema>;

const InterpretUserPromptOutputSchema = z.object({
  commands: z
    .array(z.string())
    .describe('An array of actionable frontend commands derived from the prompt.'),
});
export type InterpretUserPromptOutput = z.infer<typeof InterpretUserPromptOutputSchema>;

export async function interpretUserPrompt(input: InterpretUserPromptInput): Promise<InterpretUserPromptOutput> {
  return interpretUserPromptFlow(input);
}

const interpretUserPromptPrompt = ai.definePrompt({
  name: 'interpretUserPromptPrompt',
  input: {schema: InterpretUserPromptInputSchema},
  output: {schema: InterpretUserPromptOutputSchema},
  prompt: `You are an AI assistant that translates user prompts into actionable frontend commands.

  User Prompt: {{{prompt}}}

  Commands:`,
});

const interpretUserPromptFlow = ai.defineFlow(
  {
    name: 'interpretUserPromptFlow',
    inputSchema: InterpretUserPromptInputSchema,
    outputSchema: InterpretUserPromptOutputSchema,
  },
  async input => {
    const {output} = await interpretUserPromptPrompt(input);
    return output!;
  }
);
