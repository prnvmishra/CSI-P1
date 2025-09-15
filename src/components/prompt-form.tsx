'use client';

import { useEffect, useRef, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Loader2, Mic, Send, Trash2 } from 'lucide-react';
import { useForm, FormProvider } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { getCommandsForPrompt } from '@/app/actions';
import { useStyleStore } from '@/store/style-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Card } from './ui/card';

const formSchema = z.object({
  prompt: z.string().min(3, {
    message: "Your prompt must be at least 3 characters.",
  }),
});

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="icon" disabled={pending} aria-label="Submit prompt">
      {pending ? <Loader2 className="animate-spin" /> : <Send />}
    </Button>
  );
}

export function PromptForm() {
  const { applyNewCommands, addAchievement } = useStyleStore();
  const [state, formAction] = useActionState(getCommandsForPrompt, { commands: [] });
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { prompt: '' },
  });

  const { reset, getValues } = form;

  useEffect(() => {
    if (state.commands && state.commands.length > 0) {
      const prompt = getValues('prompt');
      applyNewCommands(state.commands, prompt);
      toast({
        title: "Success!",
        description: "Your vision has been materialized.",
      });
      reset();
    }
    if (state.error) {
      // Don't show error toast if it's just AI being unavailable
      if (!state.error.includes('AI service unavailable')) {
        toast({
          title: 'Uh oh!',
          description: state.error,
          variant: 'destructive',
        });
      }
    }
  }, [state, applyNewCommands, reset, toast, getValues]);

  const handleVoiceInput = () => {
    toast({
      title: 'Voice input coming soon!',
      description: 'For now, please type your creative commands.',
    });
    addAchievement('VOICE_COMMANDER');
  };
  
  return (
    <Card className="shadow-2xl">
      <FormProvider {...form}>
        <form
          ref={formRef}
          action={formAction}
          className="relative grid grid-cols-[1fr_auto_auto_auto] items-start gap-2 p-2"
        >
          <FormField
            control={form.control}
            name="prompt"
            render={({ field }) => (
              <FormItem className="col-span-full mb-2">
                <FormMessage className="absolute -top-6 left-2 text-xs" />
                <FormControl>
                  <Input
                    placeholder='e.g., "Make everything bounce" or "Enable cyberpunk theme"'
                    className="pr-24"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 h-full pt-1">
             <Button type="button" variant="ghost" size="icon" onClick={handleVoiceInput} aria-label="Use voice input">
                <Mic />
            </Button>
            <Button type="button" variant="ghost" size="icon" onClick={() => reset()} aria-label="Clear input">
                <Trash2 />
            </Button>
            <SubmitButton />
          </div>
        </form>
      </FormProvider>
    </Card>
  );
}
