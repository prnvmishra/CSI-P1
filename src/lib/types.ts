export type Command = string;

export type HistoryItem = Command[];

export type Badge = {
  id: 'PROMPT_NOVICE' | 'PROMPT_EXPLORER' | 'PROMPT_MASTER' | 'VOICE_COMMANDER' | 'GRAVITY_TAMER' | 'THEME_MASTER';
  name: string;
  description: string;
  achieved: boolean;
};

export type Preset = {
  id: 'underwater' | 'cyberpunk' | 'retro' | 'zero-gravity' | 'dystopian' | 'jungle';
  name: string;
  commands: Command[];
  icon: React.ComponentType<{ className?: string }>;
};
