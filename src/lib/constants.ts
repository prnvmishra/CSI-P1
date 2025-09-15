import { Badge, Preset } from './types';
import { UnderwaterIcon } from '@/components/icons/underwater-icon';
import { CyberpunkIcon } from '@/components/icons/cyberpunk-icon';
import { RetroIcon } from '@/components/icons/retro-icon';
import { ZeroGravityIcon } from '@/components/icons/zero-gravity-icon';
import { DystopianIcon } from '@/components/icons/dystopian-icon';
import { JungleIcon } from '@/components/icons/jungle-icon';
import { RainIcon } from '@/components/icons/rain-icon';
import { MatrixIcon } from '@/components/icons/matrix-icon';
import { FireballIcon } from '@/components/icons/fireball-icon';
import { SnowIcon } from '@/components/icons/snow-icon';

export const THEME_PRESETS = [
  {
    id: 'underwater',
    name: 'Underwater',
    commands: ['apply-theme:underwater', 'underwater-bubbles'],
    icon: UnderwaterIcon,
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    commands: ['apply-theme:cyberpunk', 'cyberpunk-glitch'],
    icon: CyberpunkIcon,
  },
  {
    id: 'retro',
    name: 'Retro',
    commands: ['apply-theme:retro', 'retro-scanlines'],
    icon: RetroIcon,
  },
  {
    id: 'zero-gravity',
    name: 'Zero Gravity',
    commands: ['apply-theme:zero-gravity', 'zero-gravity'],
    icon: ZeroGravityIcon,
  },
  {
    id: 'dystopian',
    name: 'Dystopian',
    commands: ['apply-theme:dystopian', 'dystopian-fog'],
    icon: DystopianIcon,
  },
  {
    id: 'jungle',
    name: 'Jungle',
    commands: ['apply-theme:jungle', 'jungle-floating'],
    icon: JungleIcon,
  },
  {
    id: 'rain',
    name: 'Rain',
    commands: ['apply-theme:rain', 'rain-drops'],
    icon: RainIcon,
  },
  {
    id: 'matrix',
    name: 'Matrix',
    commands: ['apply-theme:matrix', 'matrix-code'],
    icon: MatrixIcon,
  },
  {
    id: 'fireball',
    name: 'Fireball',
    commands: ['apply-theme:fireball', 'fire-animation'],
    icon: FireballIcon,
  },
  {
    id: 'snow',
    name: 'Snow',
    commands: ['apply-theme:snow', 'snow-flakes'],
    icon: SnowIcon,
  },
];

export const ALL_ACHIEVEMENTS: Record<string, Omit<Badge, 'id' | 'achieved'>> = {
    'PROMPT_NOVICE': {
        name: 'Prompt Novice',
        description: 'Used your first prompt!',
    },
    'PROMPT_EXPLORER': {
        name: 'Prompt Explorer',
        description: 'Used 5 unique prompts.',
    },
    'PROMPT_MASTER': {
        name: 'Prompt Master',
        description: 'Used 15 unique prompts.',
    },
    'VOICE_COMMANDER': {
        name: 'Voice Commander',
        description: 'Used voice input for a prompt.',
    },
    'GRAVITY_TAMER': {
        name: 'Gravity Tamer',
        description: 'Toggled zero gravity mode.',
    },
    'THEME_MASTER': {
        name: 'Theme Master',
        description: 'Tried all preset themes.',
    },
};
