import { PersonalityQuizQuestion } from '@/types';

export const BLIND_QUIZ_QUESTIONS: PersonalityQuizQuestion[] = [
  {
    id: 'ideal_saturday',
    category: 'LIFESTYLE',
    question: 'How does your ideal, stress-free Saturday look like?',
    description: 'This reveals your energy rhythm and how you recharge.',
    options: [
      {
        value: 'cozy_nest',
        label: 'Curled up with coffee, a book, vinyl music, or binge-watching a favorite show',
        archetypeTag: 'Grounded Anchor',
      },
      {
        value: 'active_adventure',
        label: 'Hiking in nature, cycling, exploring a new neighborhood or road trip',
        archetypeTag: 'Spontaneous Adventurer',
      },
      {
        value: 'cultural_social',
        label: 'Brunch with friends, art gallery, jazz club or trying a new culinary spot',
        archetypeTag: 'Cultural Epicurean',
      },
      {
        value: 'creative_flow',
        label: 'Working on a personal passion project, photography, writing, or cooking a feast',
        archetypeTag: 'Passionate Creative',
      },
    ],
  },
  {
    id: 'conflict_style',
    category: 'VALUES',
    question: 'When a misunderstanding or disagreement happens, you prefer to:',
    description: 'Emotional safety and resolution compatibility.',
    options: [
      {
        value: 'talk_immediately',
        label: 'Discuss it right away with openness, calm dialogue, and complete honesty',
        archetypeTag: 'Open Communicator',
      },
      {
        value: 'cool_down_first',
        label: 'Take 30 minutes to collect my thoughts alone first, then reconnect calmly',
        archetypeTag: 'Reflective Harmony',
      },
      {
        value: 'reassure_touch',
        label: 'First hug/reassure love and safety, then solve the issue as a team',
        archetypeTag: 'Deep Connector',
      },
      {
        value: 'rational_solutions',
        label: 'Focus rationally on what went wrong and build a practical compromise',
        archetypeTag: 'Pragmatic Builder',
      },
    ],
  },
  {
    id: 'love_language',
    category: 'ROMANCE',
    question: 'What makes you feel most genuinely cherished by a partner?',
    description: 'Your primary emotional love language.',
    options: [
      {
        value: 'deep_conversations',
        label: 'Uninterrupted eye contact, heartfelt talks late into the night, undivided presence',
        archetypeTag: 'Deep Connector',
      },
      {
        value: 'physical_warmth',
        label: 'Spontaneous hugs, holding hands, lingering kisses, feeling physically close',
        archetypeTag: 'Passionate Romantic',
      },
      {
        value: 'thoughtful_gestures',
        label: 'Surprise morning coffee, making dinner when I am tired, thoughtful acts of service',
        archetypeTag: 'Devoted Protector',
      },
      {
        value: 'words_affirmation',
        label: 'Unexpected text messages of praise, vocal pride in who I am, genuine compliments',
        archetypeTag: 'Inspiring Muse',
      },
    ],
  },
  {
    id: 'humor_vibe',
    category: 'PERSONALITY',
    question: 'What type of humor makes you laugh until your stomach hurts?',
    description: 'Shared laughter is the greatest bond.',
    options: [
      {
        value: 'witty_banter',
        label: 'Fast, witty banter, playful teasing, and intellectual irony',
        archetypeTag: 'Intellectual Explorer',
      },
      {
        value: 'goofy_silly',
        label: 'Goofy faces, unexpected physical comedy, laughing at life’s absurdities',
        archetypeTag: 'Playful Soul',
      },
      {
        value: 'dark_candid',
        label: 'Dry, deadpan, candid observational humor about the human condition',
        archetypeTag: 'Philosophic Wit',
      },
      {
        value: 'wholesome_warm',
        label: 'Wholesome memes, animal antics, heartwarming everyday situations',
        archetypeTag: 'Warm Empath',
      },
    ],
  },
  {
    id: 'life_vision_5yrs',
    category: 'FUTURE',
    question: 'Where do you envision your life centering over the next 3-5 years?',
    description: 'Aligning your life trajectories.',
    options: [
      {
        value: 'family_home',
        label: 'Building a beautiful, loving home with a life partner and strong family roots',
        archetypeTag: 'Family Builder',
      },
      {
        value: 'global_freedom',
        label: 'Traveling the globe, living flexibly, collecting memories over possessions',
        archetypeTag: 'Free Spirit',
      },
      {
        value: 'career_impact',
        label: 'Scaling meaningful careers or ventures while supporting each other’s ambitions',
        archetypeTag: 'Ambitious Power-Pair',
      },
      {
        value: 'balanced_zen',
        label: 'Quiet simplicity, wellness, work-life balance, and nurturing our inner peace',
        archetypeTag: 'Mindful Sage',
      },
    ],
  },
  {
    id: 'spontaneity_level',
    category: 'PERSONALITY',
    question: 'Your partner calls on a Friday afternoon: "Pack a bag, we are leaving in an hour!"',
    description: 'Spontaneity vs planned comfort.',
    options: [
      {
        value: 'ecstatic_yes',
        label: 'HELL YES! I love surprises and thrills without over-planning!',
        archetypeTag: 'Spontaneous Adventurer',
      },
      {
        value: 'intrigued_with_brief',
        label: 'Excited, but give me 10 minutes to know the weather & pack appropriately',
        archetypeTag: 'Adaptive Explorer',
      },
      {
        value: 'prefer_heads_up',
        label: 'I appreciate the romance, but I truly savor planned anticipation much more',
        archetypeTag: 'Methodical Planner',
      },
    ],
  },
  {
    id: 'emotional_intimacy',
    category: 'ROMANCE',
    question: 'In your eyes, what is true soul-level intimacy?',
    description: 'The core ingredient of an unbreakable relationship.',
    options: [
      {
        value: 'raw_vulnerability',
        label: 'Being able to share your deepest insecurities without fear of judgment',
        archetypeTag: 'Deep Connector',
      },
      {
        value: 'unwavering_loyalty',
        label: 'Knowing without a doubt that we always have each other’s backs in a crisis',
        archetypeTag: 'Devoted Protector',
      },
      {
        value: 'effortless_telepathy',
        label: 'Comfortable silence across a room, understanding each other with just a glance',
        archetypeTag: 'Soulmate Mirror',
      },
      {
        value: 'mutual_growth',
        label: 'Inspiring each other to become the highest, best versions of ourselves',
        archetypeTag: 'Growth Catalyst',
      },
    ],
  },
  {
    id: 'money_mindset',
    category: 'VALUES',
    question: 'How do you approach finances and spending in life?',
    description: 'Financial compatibility.',
    options: [
      {
        value: 'experiences_first',
        label: 'Spend generously on travel, concerts, good food and unforgettable memories',
        archetypeTag: 'Experience Seeker',
      },
      {
        value: 'balanced_mindful',
        label: 'Save and invest prudently for freedom, but treat ourselves comfortably',
        archetypeTag: 'Conscious Steward',
      },
      {
        value: 'high_security',
        label: 'Focus on aggressive saving, real estate, and long-term financial security',
        archetypeTag: 'Fortress Builder',
      },
    ],
  },
];

export const PSEUDONYM_ADJECTIVES = [
  'Celestial',
  'Velvet',
  'Midnight',
  'Golden',
  'Mystic',
  'Whispering',
  'Radiant',
  'Serene',
  'Amber',
  'Noble',
  'Starlit',
  'Gentle',
  'Crimson',
  'Luminous',
  'Cosmic',
  'Silver',
];

export const PSEUDONYM_NOUNS = [
  'Philosopher',
  'Stargazer',
  'Poet',
  'Wanderer',
  'Alchemist',
  'Dreamer',
  'Voyager',
  'Guardian',
  'Muse',
  'Horizon',
  'Seeker',
  'Symphony',
  'Navigator',
  'Eclipse',
  'Harmony',
  'Aurora',
];

export const AVATAR_ICONS = ['sparkles', 'moon', 'lotus', 'feather', 'sun', 'compass', 'heart', 'gem'];
export const COLOR_THEMES = ['rose', 'purple', 'emerald', 'amber', 'cyan', 'indigo'];

export function generateRandomPseudonym(): { pseudonym: string; avatarIcon: string; colorTheme: string } {
  const adj = PSEUDONYM_ADJECTIVES[Math.floor(Math.random() * PSEUDONYM_ADJECTIVES.length)];
  const noun = PSEUDONYM_NOUNS[Math.floor(Math.random() * PSEUDONYM_NOUNS.length)];
  const icon = AVATAR_ICONS[Math.floor(Math.random() * AVATAR_ICONS.length)];
  const theme = COLOR_THEMES[Math.floor(Math.random() * COLOR_THEMES.length)];
  return {
    pseudonym: `${adj} ${noun}`,
    avatarIcon: icon,
    colorTheme: theme,
  };
}
