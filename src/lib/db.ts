import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import {
  User,
  Swipe,
  Match,
  BlindMatch,
  ChatMessage,
  UserReport,
  BlockRecord,
  PaymentTransaction,
  AdminSettings,
  PublicProfile,
  AnonymousBlindProfile,
} from '@/types';

const DATA_DIR = path.join(process.cwd(), 'data');

interface DatabaseSchema {
  users: User[];
  swipes: Swipe[];
  matches: Match[];
  blindMatches: BlindMatch[];
  messages: ChatMessage[];
  reports: UserReport[];
  blocks: BlockRecord[];
  payments: PaymentTransaction[];
  settings: AdminSettings;
}

const DB_FILE = path.join(DATA_DIR, 'database.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function getDefaultSettings(): AdminSettings {
  return {
    siteName: 'HEARTLINK',
    allowRegistrations: true,
    requirePhotoVerification: false,
    prices: {
      goldMonthly: 29.99,
      goldYearly: 199.99,
      platinumMonthly: 59.99,
      platinumYearly: 399.99,
    },
    tierFeatures: {
      free: { likesPerDay: 15, superLikesPerDay: 1, blindMatchesPerWeek: 1 },
      gold: { likesPerDay: 100, superLikesPerDay: 5, blindMatchesPerWeek: 5 },
      platinum: { likesPerDay: 9999, superLikesPerDay: 20, blindMatchesPerWeek: 999 },
    },
    matchingWeights: {
      ageWeight: 0.2,
      locationWeight: 0.25,
      valuesWeight: 0.25,
      interestsWeight: 0.15,
      quizWeight: 0.15,
    },
    announcement: 'Welcome to HEARTLINK — Where authentic hearts connect globally.',
  };
}

function getInitialDemoData(): DatabaseSchema {
  const hash = bcrypt.hashSync('pass123', 8);
  const adminHash = bcrypt.hashSync('admin123', 8);

  const users: User[] = [
    {
      id: 'usr_admin',
      email: 'admin@heartlink.com',
      passwordHash: adminHash,
      role: 'ADMIN',
      membershipTier: 'PLATINUM',
      membershipExpiresAt: null,
      verified: true,
      status: 'ACTIVE',
      name: 'HeartLink Concierge',
      age: 33,
      dateOfBirth: '1993-04-12',
      gender: 'WOMAN',
      interestedIn: 'EVERYONE',
      preferredExperience: 'ALL',
      location: { city: 'New York', country: 'United States' },
      photos: [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      ],
      photoStatus: 'APPROVED',
      bio: 'Executive Director of Member Experiences at HeartLink. Passionate about intentional love.',
      profession: 'Platform Curator',
      education: 'Columbia University',
      interests: ['Psychology', 'Fine Arts', 'Travel', 'Jazz', 'Architecture'],
      lifestyle: {
        smoking: 'NEVER',
        drinking: 'OCCASIONALLY',
        diet: 'OMNIVORE',
        exercise: 'DAILY',
        pets: 'Golden Retriever',
        astrologySign: 'Aries',
      },
      relationshipGoals: 'SERIOUS_RELATIONSHIP',
      personalityTraits: ['Visionary', 'Empathetic', 'Articulate', 'Cultured'],
      preferences: {
        minAge: 27,
        maxAge: 42,
        maxDistanceKm: 500,
        citiesPreferred: ['New York', 'London', 'Paris'],
        relationshipGoals: ['SERIOUS_RELATIONSHIP', 'MARRIAGE'],
      },
      privacy: { showProfile: true, showAge: true, showDistance: true, incognitoMode: false },
      blindProfile: {
        joinedPool: true,
        pseudonym: 'Celestial Muse',
        avatarIcon: 'sparkles',
        colorTheme: 'purple',
        quizAnswers: {
          ideal_saturday: 'cultural_social',
          conflict_style: 'talk_immediately',
          love_language: 'deep_conversations',
          humor_vibe: 'witty_banter',
          life_vision_5yrs: 'career_impact',
          spontaneity_level: 'intrigued_with_brief',
          emotional_intimacy: 'mutual_growth',
          money_mindset: 'balanced_mindful',
        },
        soulmateSummary: 'Seeks an intellectual peer with emotional maturity and passion for life.',
      },
      likesRemainingToday: 999,
      superLikesRemainingToday: 20,
      lastActiveAt: new Date().toISOString(),
      createdAt: '2026-01-01T00:00:00Z',
    },
    {
      id: 'usr_sophia',
      email: 'sophia@heartlink.com',
      passwordHash: hash,
      role: 'USER',
      membershipTier: 'PLATINUM',
      membershipExpiresAt: '2027-01-01T00:00:00Z',
      verified: true,
      status: 'ACTIVE',
      name: 'Sophia Rivera',
      age: 26,
      dateOfBirth: '2000-06-18',
      gender: 'WOMAN',
      interestedIn: 'MEN',
      preferredExperience: 'ALL',
      location: { city: 'New York', country: 'United States', latitude: 40.7128, longitude: -74.006 },
      photos: [
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
      ],
      photoStatus: 'APPROVED',
      bio: 'Architect with a passion for sustainable modernism, acoustic guitars, and handwritten postcards. I believe true connection starts in silence and blooms through conversation.',
      profession: 'Senior Architect',
      education: 'Cornell Architecture',
      heightCm: 172,
      interests: ['Architecture', 'Acoustic Guitar', 'Sailing', 'Minimalism', 'Espresso'],
      lifestyle: {
        smoking: 'NEVER',
        drinking: 'OCCASIONALLY',
        diet: 'PESCATARIAN',
        exercise: 'FEW_TIMES_A_WEEK',
        pets: 'Cat named Blueprint',
        astrologySign: 'Gemini',
      },
      relationshipGoals: 'SERIOUS_RELATIONSHIP',
      personalityTraits: ['Creative', 'Empathetic', 'Thoughtful', 'Curious'],
      preferences: {
        minAge: 25,
        maxAge: 35,
        maxDistanceKm: 100,
        citiesPreferred: ['New York', 'Brooklyn', 'Boston'],
        relationshipGoals: ['SERIOUS_RELATIONSHIP', 'MARRIAGE'],
      },
      privacy: { showProfile: true, showAge: true, showDistance: true, incognitoMode: false },
      blindProfile: {
        joinedPool: true,
        pseudonym: 'Starlit Architect',
        avatarIcon: 'compass',
        colorTheme: 'rose',
        quizAnswers: {
          ideal_saturday: 'creative_flow',
          conflict_style: 'talk_immediately',
          love_language: 'deep_conversations',
          humor_vibe: 'witty_banter',
          life_vision_5yrs: 'balanced_zen',
          spontaneity_level: 'intrigued_with_brief',
          emotional_intimacy: 'raw_vulnerability',
          money_mindset: 'experiences_first',
        },
        soulmateSummary: 'Looking for a thoughtful soul who loves long walks, deep architecture discussions, and gentle laughter.',
      },
      likesRemainingToday: 999,
      superLikesRemainingToday: 20,
      lastActiveAt: new Date().toISOString(),
      createdAt: '2026-02-10T12:00:00Z',
    },
    {
      id: 'usr_aryan',
      email: 'aryan@heartlink.com',
      passwordHash: hash,
      role: 'USER',
      membershipTier: 'GOLD',
      membershipExpiresAt: '2026-12-31T00:00:00Z',
      verified: true,
      status: 'ACTIVE',
      name: 'Aryan Sen',
      age: 29,
      dateOfBirth: '1997-09-22',
      gender: 'MAN',
      interestedIn: 'WOMEN',
      preferredExperience: 'MATCHMAKING',
      location: { city: 'Kolkata', country: 'India', latitude: 22.5726, longitude: 88.3639 },
      photos: [
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
      ],
      photoStatus: 'APPROVED',
      bio: 'Tech entrepreneur & literature enthusiast from South Kolkata. Family-oriented, deeply ambitious yet grounded. When not building software, I am exploring old bookshops on College Street or brewing Darjeeling tea.',
      profession: 'AI Startup Founder & Engineer',
      education: 'IIT Kharagpur / M.Tech',
      heightCm: 180,
      interests: ['Literature', 'Artificial Intelligence', 'Rabindra Sangeet', 'Filter Coffee', 'Hiking'],
      lifestyle: {
        smoking: 'NEVER',
        drinking: 'OCCASIONALLY',
        diet: 'OMNIVORE',
        exercise: 'DAILY',
        pets: 'Family Labrador',
        astrologySign: 'Virgo',
      },
      relationshipGoals: 'MARRIAGE',
      personalityTraits: ['Grounded', 'Ambitious', 'Family-Oriented', 'Intellectual'],
      preferences: {
        minAge: 24,
        maxAge: 31,
        maxDistanceKm: 150,
        citiesPreferred: ['Kolkata', 'Bengaluru', 'Mumbai', 'Delhi'],
        relationshipGoals: ['MARRIAGE', 'SERIOUS_RELATIONSHIP'],
        educationMin: 'Masters',
      },
      privacy: { showProfile: true, showAge: true, showDistance: true, incognitoMode: false },
      blindProfile: {
        joinedPool: true,
        pseudonym: 'Midnight Philosopher',
        avatarIcon: 'lotus',
        colorTheme: 'amber',
        quizAnswers: {
          ideal_saturday: 'cozy_nest',
          conflict_style: 'rational_solutions',
          love_language: 'thoughtful_gestures',
          humor_vibe: 'witty_banter',
          life_vision_5yrs: 'family_home',
          spontaneity_level: 'prefer_heads_up',
          emotional_intimacy: 'unwavering_loyalty',
          money_mindset: 'balanced_mindful',
        },
        soulmateSummary: 'Desires a family-minded, educated partner who cherishes warm conversations and shared life values.',
      },
      likesRemainingToday: 88,
      superLikesRemainingToday: 4,
      lastActiveAt: new Date().toISOString(),
      createdAt: '2026-02-14T08:30:00Z',
    },
    {
      id: 'usr_ananya',
      email: 'ananya@heartlink.com',
      passwordHash: hash,
      role: 'USER',
      membershipTier: 'PLATINUM',
      membershipExpiresAt: '2027-02-01T00:00:00Z',
      verified: true,
      status: 'ACTIVE',
      name: 'Dr. Ananya Roy',
      age: 28,
      dateOfBirth: '1998-03-14',
      gender: 'WOMAN',
      interestedIn: 'MEN',
      preferredExperience: 'MATCHMAKING',
      location: { city: 'Kolkata', country: 'India', latitude: 22.5726, longitude: 88.3639 },
      photos: [
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
      ],
      photoStatus: 'APPROVED',
      bio: 'Pediatric specialist with a gentle heart and high emotional quotient. Raised in a loving Bengali household, I cherish cultural traditions, classical music, and intelligent discourse.',
      profession: 'Pediatric Surgeon',
      education: 'Medical College Kolkata / MD Pediatrics',
      heightCm: 165,
      interests: ['Medicine', 'Classical Music', 'Baking', 'Travel Photography', 'Gardening'],
      lifestyle: {
        smoking: 'NEVER',
        drinking: 'NEVER',
        diet: 'VEGETARIAN',
        exercise: 'FEW_TIMES_A_WEEK',
        pets: 'Love birds',
        astrologySign: 'Pisces',
      },
      relationshipGoals: 'MARRIAGE',
      personalityTraits: ['Compassionate', 'Cultured', 'Devoted', 'Patient'],
      preferences: {
        minAge: 27,
        maxAge: 33,
        maxDistanceKm: 100,
        citiesPreferred: ['Kolkata', 'Bengaluru'],
        relationshipGoals: ['MARRIAGE'],
        educationMin: 'Masters',
      },
      privacy: { showProfile: true, showAge: true, showDistance: true, incognitoMode: false },
      blindProfile: {
        joinedPool: true,
        pseudonym: 'Golden Healer',
        avatarIcon: 'lotus',
        colorTheme: 'rose',
        quizAnswers: {
          ideal_saturday: 'cozy_nest',
          conflict_style: 'talk_immediately',
          love_language: 'thoughtful_gestures',
          humor_vibe: 'wholesome_warm',
          life_vision_5yrs: 'family_home',
          spontaneity_level: 'intrigued_with_brief',
          emotional_intimacy: 'unwavering_loyalty',
          money_mindset: 'balanced_mindful',
        },
        soulmateSummary: 'Seeking an educated, kind-hearted gentleman with strong family values and mutual respect.',
      },
      likesRemainingToday: 999,
      superLikesRemainingToday: 20,
      lastActiveAt: new Date().toISOString(),
      createdAt: '2026-02-18T10:15:00Z',
    },
    {
      id: 'usr_marcus',
      email: 'marcus@heartlink.com',
      passwordHash: hash,
      role: 'USER',
      membershipTier: 'PLATINUM',
      membershipExpiresAt: '2026-11-20T00:00:00Z',
      verified: true,
      status: 'ACTIVE',
      name: 'Marcus Vance',
      age: 31,
      dateOfBirth: '1995-11-04',
      gender: 'MAN',
      interestedIn: 'WOMEN',
      preferredExperience: 'BLIND_MATCHMAKING',
      location: { city: 'London', country: 'United Kingdom', latitude: 51.5074, longitude: -0.1278 },
      photos: [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80',
      ],
      photoStatus: 'APPROVED',
      bio: 'Cognitive Neuroscientist researching human empathy and intuition. Fascinated by minds, black-and-white cinema, and wild sea swimming.',
      profession: 'Research Neuroscientist',
      education: 'University of Oxford, PhD',
      heightCm: 185,
      interests: ['Neuroscience', 'Wild Swimming', 'Cinema', 'Philosophy', 'Chess'],
      lifestyle: {
        smoking: 'NEVER',
        drinking: 'OCCASIONALLY',
        diet: 'OMNIVORE',
        exercise: 'DAILY',
        pets: 'Greyhound',
        astrologySign: 'Scorpio',
      },
      relationshipGoals: 'LONG_TERM_DATING',
      personalityTraits: ['Philosophical', 'Quietly Confident', 'Attentive', 'Authentic'],
      preferences: {
        minAge: 25,
        maxAge: 34,
        maxDistanceKm: 300,
        citiesPreferred: ['London', 'Cambridge', 'Edinburgh', 'New York'],
        relationshipGoals: ['LONG_TERM_DATING', 'SERIOUS_RELATIONSHIP'],
      },
      privacy: { showProfile: true, showAge: true, showDistance: true, incognitoMode: false },
      blindProfile: {
        joinedPool: true,
        pseudonym: 'Oceanic Seeker',
        avatarIcon: 'moon',
        colorTheme: 'cyan',
        quizAnswers: {
          ideal_saturday: 'cozy_nest',
          conflict_style: 'reassure_touch',
          love_language: 'deep_conversations',
          humor_vibe: 'dark_candid',
          life_vision_5yrs: 'balanced_zen',
          spontaneity_level: 'intrigued_with_brief',
          emotional_intimacy: 'raw_vulnerability',
          money_mindset: 'experiences_first',
        },
        soulmateSummary: 'Looks for emotional honesty and someone who finds mystery in everyday conversations.',
      },
      likesRemainingToday: 999,
      superLikesRemainingToday: 20,
      lastActiveAt: new Date().toISOString(),
      createdAt: '2026-02-01T15:20:00Z',
    },
    {
      id: 'usr_elena',
      email: 'elena@heartlink.com',
      passwordHash: hash,
      role: 'USER',
      membershipTier: 'GOLD',
      membershipExpiresAt: '2027-03-10T00:00:00Z',
      verified: true,
      status: 'ACTIVE',
      name: 'Elena Rostova',
      age: 28,
      dateOfBirth: '1998-05-12',
      gender: 'WOMAN',
      interestedIn: 'MEN',
      preferredExperience: 'BLIND_MATCHMAKING',
      location: { city: 'London', country: 'United Kingdom', latitude: 51.5074, longitude: -0.1278 },
      photos: [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
      ],
      photoStatus: 'APPROVED',
      bio: 'Classical concert pianist & museum curator. I find solace in Rachmaninoff, midnight walks in Kensington Gardens, and profound dialogues over Earl Grey.',
      profession: 'Museum Curator & Concert Pianist',
      education: 'Royal Academy of Music',
      heightCm: 168,
      interests: ['Classical Piano', 'Art History', 'Antique Books', 'Poetry', 'Ballet'],
      lifestyle: {
        smoking: 'NEVER',
        drinking: 'OCCASIONALLY',
        diet: 'VEGETARIAN',
        exercise: 'FEW_TIMES_A_WEEK',
        pets: 'Persian Cat',
        astrologySign: 'Taurus',
      },
      relationshipGoals: 'SERIOUS_RELATIONSHIP',
      personalityTraits: ['Graceful', 'Deep Thinker', 'Romantic', 'Gentle'],
      preferences: {
        minAge: 27,
        maxAge: 36,
        maxDistanceKm: 150,
        citiesPreferred: ['London', 'Paris', 'Vienna'],
        relationshipGoals: ['SERIOUS_RELATIONSHIP', 'MARRIAGE'],
      },
      privacy: { showProfile: true, showAge: true, showDistance: true, incognitoMode: false },
      blindProfile: {
        joinedPool: true,
        pseudonym: 'Velvet Symphony',
        avatarIcon: 'feather',
        colorTheme: 'purple',
        quizAnswers: {
          ideal_saturday: 'creative_flow',
          conflict_style: 'cool_down_first',
          love_language: 'deep_conversations',
          humor_vibe: 'witty_banter',
          life_vision_5yrs: 'balanced_zen',
          spontaneity_level: 'prefer_heads_up',
          emotional_intimacy: 'effortless_telepathy',
          money_mindset: 'experiences_first',
        },
        soulmateSummary: 'Craves intellectual depth, classical romance, and unspoken understanding.',
      },
      likesRemainingToday: 95,
      superLikesRemainingToday: 5,
      lastActiveAt: new Date().toISOString(),
      createdAt: '2026-02-05T09:40:00Z',
    },
    {
      id: 'usr_priya',
      email: 'priya@heartlink.com',
      passwordHash: hash,
      role: 'USER',
      membershipTier: 'FREE',
      membershipExpiresAt: null,
      verified: true,
      status: 'ACTIVE',
      name: 'Priya Sharma',
      age: 27,
      dateOfBirth: '1999-01-20',
      gender: 'WOMAN',
      interestedIn: 'MEN',
      preferredExperience: 'DATING',
      location: { city: 'Mumbai', country: 'India', latitude: 19.076, longitude: 72.8777 },
      photos: [
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80',
      ],
      photoStatus: 'APPROVED',
      bio: 'Product Designer who loves indie films, sunrise runs at Marine Drive, and spicy street chaat. Looking for someone with genuine laughter and kind eyes.',
      profession: 'Lead Product Designer',
      education: 'National Institute of Design',
      heightCm: 167,
      interests: ['Design', 'Film Festivals', 'Running', 'Street Food', 'Pottery'],
      lifestyle: {
        smoking: 'NEVER',
        drinking: 'SOCIALLY',
        diet: 'VEGAN',
        exercise: 'DAILY',
        pets: 'None yet',
        astrologySign: 'Aquarius',
      },
      relationshipGoals: 'LONG_TERM_DATING',
      personalityTraits: ['Vibrant', 'Playful', 'Empathetic', 'Driven'],
      preferences: {
        minAge: 25,
        maxAge: 33,
        maxDistanceKm: 100,
        citiesPreferred: ['Mumbai', 'Pune', 'Goa'],
        relationshipGoals: ['LONG_TERM_DATING', 'SERIOUS_RELATIONSHIP'],
      },
      privacy: { showProfile: true, showAge: true, showDistance: true, incognitoMode: false },
      blindProfile: {
        joinedPool: true,
        pseudonym: 'Radiant Voyager',
        avatarIcon: 'sun',
        colorTheme: 'rose',
        quizAnswers: {
          ideal_saturday: 'active_adventure',
          conflict_style: 'talk_immediately',
          love_language: 'words_affirmation',
          humor_vibe: 'goofy_silly',
          life_vision_5yrs: 'global_freedom',
          spontaneity_level: 'ecstatic_yes',
          emotional_intimacy: 'raw_vulnerability',
          money_mindset: 'experiences_first',
        },
        soulmateSummary: 'Adventurous creative looking for laughs, sunset runs, and spontaneous weekend escapes.',
      },
      likesRemainingToday: 15,
      superLikesRemainingToday: 1,
      lastActiveAt: new Date().toISOString(),
      createdAt: '2026-02-12T14:10:00Z',
    },
    {
      id: 'usr_leo',
      email: 'leo@heartlink.com',
      passwordHash: hash,
      role: 'USER',
      membershipTier: 'GOLD',
      membershipExpiresAt: '2026-12-15T00:00:00Z',
      verified: true,
      status: 'ACTIVE',
      name: 'Leo Martinez',
      age: 29,
      dateOfBirth: '1997-07-08',
      gender: 'MAN',
      interestedIn: 'WOMEN',
      preferredExperience: 'DATING',
      location: { city: 'San Francisco', country: 'United States', latitude: 37.7749, longitude: -122.4194 },
      photos: [
        'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80',
      ],
      photoStatus: 'APPROVED',
      bio: 'Marine Biologist & ocean conservationist. Spend half my time in wetsuits studying kelp forests, the other half making sourdough bread and reading historical non-fiction.',
      profession: 'Senior Marine Biologist',
      education: 'UC Berkeley / PhD Marine Science',
      heightCm: 182,
      interests: ['Scuba Diving', 'Baking Sourdough', 'Marine Conservation', 'Trail Running', 'Vinyl Records'],
      lifestyle: {
        smoking: 'NEVER',
        drinking: 'OCCASIONALLY',
        diet: 'PESCATARIAN',
        exercise: 'DAILY',
        pets: 'Rescue Border Collie',
        astrologySign: 'Cancer',
      },
      relationshipGoals: 'SERIOUS_RELATIONSHIP',
      personalityTraits: ['Warm', 'Passionate', 'Reliable', 'Adventurous'],
      preferences: {
        minAge: 25,
        maxAge: 32,
        maxDistanceKm: 120,
        citiesPreferred: ['San Francisco', 'Oakland', 'Santa Cruz', 'Monterey'],
        relationshipGoals: ['SERIOUS_RELATIONSHIP', 'LONG_TERM_DATING'],
      },
      privacy: { showProfile: true, showAge: true, showDistance: true, incognitoMode: false },
      blindProfile: {
        joinedPool: true,
        pseudonym: 'Tidal Horizon',
        avatarIcon: 'compass',
        colorTheme: 'cyan',
        quizAnswers: {
          ideal_saturday: 'active_adventure',
          conflict_style: 'reassure_touch',
          love_language: 'physical_warmth',
          humor_vibe: 'wholesome_warm',
          life_vision_5yrs: 'balanced_zen',
          spontaneity_level: 'ecstatic_yes',
          emotional_intimacy: 'unwavering_loyalty',
          money_mindset: 'experiences_first',
        },
        soulmateSummary: 'Passionate about the natural world, honest feelings, and cozy kitchen cooking dates.',
      },
      likesRemainingToday: 95,
      superLikesRemainingToday: 5,
      lastActiveAt: new Date().toISOString(),
      createdAt: '2026-02-15T11:00:00Z',
    },
  ];

  const matches: Match[] = [
    {
      id: 'match_sophia_leo',
      type: 'DATING',
      user1Id: 'usr_sophia',
      user2Id: 'usr_leo',
      compatibilityScore: 92,
      compatibilityBreakdown: {
        overall: 92,
        values: 95,
        lifestyle: 90,
        interests: 88,
        ageLocation: 94,
        aiAnalysis:
          'High synergy in creative appreciation, environmental mindfulness, and complementary communicative styles.',
      },
      status: 'ACTIVE',
      createdAt: '2026-02-16T18:00:00Z',
      lastMessageAt: '2026-02-16T19:30:00Z',
    },
    {
      id: 'match_aryan_ananya',
      type: 'MATCHMAKING',
      user1Id: 'usr_aryan',
      user2Id: 'usr_ananya',
      compatibilityScore: 96,
      compatibilityBreakdown: {
        overall: 96,
        values: 98,
        lifestyle: 95,
        interests: 92,
        ageLocation: 99,
        aiAnalysis:
          'Exceptional harmony: Both reside in Kolkata, hold advanced degrees, value family-centered marriage, and share cultural passions.',
      },
      status: 'ACTIVE',
      createdAt: '2026-02-18T12:00:00Z',
      lastMessageAt: '2026-02-18T14:15:00Z',
    },
  ];

  const blindMatches: BlindMatch[] = [
    {
      id: 'blind_marcus_elena',
      user1Id: 'usr_marcus',
      user2Id: 'usr_elena',
      compatibilityScore: 95,
      quizScoreBreakdown: {
        personalityHarmony: 96,
        valuesAlignment: 94,
        relationshipVision: 95,
        humorLifeStyle: 93,
        aiSummary:
          'Remarkable resonance: Both share intellectual contemplation, appreciation for deep dialogue, and tranquil recharging styles.',
      },
      status: 'MUTUAL_REVEALED',
      user1Consent: true,
      user2Consent: true,
      revealedAt: '2026-02-17T20:00:00Z',
      createdAt: '2026-02-16T10:00:00Z',
      lastMessageAt: '2026-02-17T20:45:00Z',
    },
    {
      id: 'blind_sophia_marcus',
      user1Id: 'usr_sophia',
      user2Id: 'usr_marcus',
      compatibilityScore: 89,
      quizScoreBreakdown: {
        personalityHarmony: 91,
        valuesAlignment: 88,
        relationshipVision: 90,
        humorLifeStyle: 87,
        aiSummary:
          'Thoughtful synergy: Philosophical alignment on vulnerability and creative pursuits. User 1 has requested reveal!',
      },
      status: 'USER1_CONSENTED',
      user1Consent: true,
      user2Consent: false,
      revealedAt: null,
      createdAt: '2026-02-18T09:00:00Z',
      lastMessageAt: '2026-02-18T11:20:00Z',
    },
  ];

  const messages: ChatMessage[] = [
    {
      id: 'msg_1',
      conversationType: 'DIRECT_MATCH',
      matchId: 'match_sophia_leo',
      senderId: 'usr_leo',
      content: 'Hi Sophia! Loved your photos and your note on sustainable modernism. Which acoustic song do you find yourself playing most often?',
      read: true,
      readAt: '2026-02-16T18:45:00Z',
      createdAt: '2026-02-16T18:20:00Z',
    },
    {
      id: 'msg_2',
      conversationType: 'DIRECT_MATCH',
      matchId: 'match_sophia_leo',
      senderId: 'usr_sophia',
      content: 'Hey Leo! Thank you so much! Lately it has been Nick Drake’s "Pink Moon". And kelp forest research sounds mesmerizing — do you dive along Monterey?',
      read: true,
      readAt: '2026-02-16T19:35:00Z',
      createdAt: '2026-02-16T19:30:00Z',
    },
    {
      id: 'msg_3',
      conversationType: 'DIRECT_MATCH',
      matchId: 'match_aryan_ananya',
      senderId: 'usr_aryan',
      content: 'Nomoshkar Ananya. HeartLink suggested our profiles with a 96% compatibility, and reading about your dedication to pediatric surgery truly inspired me.',
      read: true,
      readAt: '2026-02-18T13:00:00Z',
      createdAt: '2026-02-18T12:30:00Z',
    },
    {
      id: 'msg_4',
      conversationType: 'DIRECT_MATCH',
      matchId: 'match_aryan_ananya',
      senderId: 'usr_ananya',
      content: 'Nomoshkar Aryan! Thank you, that is very kind of you. I saw your love for College Street bookshops — my grandfather and I used to spend entire Sundays there. It is rare to meet someone who shares both modern ambition and our cultural roots.',
      read: true,
      readAt: '2026-02-18T14:20:00Z',
      createdAt: '2026-02-18T14:15:00Z',
    },
    {
      id: 'msg_5',
      conversationType: 'BLIND_MATCH',
      matchId: 'blind_sophia_marcus',
      senderId: 'usr_marcus',
      content: 'Greetings anonymous friend. The AI summary mentioned we both value raw vulnerability over polite small talk. How has your week treated your mind?',
      read: true,
      readAt: '2026-02-18T10:15:00Z',
      createdAt: '2026-02-18T09:30:00Z',
    },
    {
      id: 'msg_6',
      conversationType: 'BLIND_MATCH',
      matchId: 'blind_sophia_marcus',
      senderId: 'usr_sophia',
      content: 'It has been full of blueprints and quiet reflection. There is something liberating about chatting without knowing each other’s appearances first. I just clicked the mutual reveal request button — if you feel comfortable, let’s unveil our cards!',
      read: false,
      readAt: null,
      createdAt: '2026-02-18T11:20:00Z',
    },
  ];

  const reports: UserReport[] = [];
  const blocks: BlockRecord[] = [];
  const payments: PaymentTransaction[] = [
    {
      id: 'pay_demo_1',
      userId: 'usr_sophia',
      plan: 'PLATINUM',
      amount: 199.99,
      currency: 'USD',
      interval: 'YEARLY',
      status: 'SUCCEEDED',
      paymentMethod: 'Test Card (•••• 4242)',
      transactionRef: 'HL_TX_987211',
      createdAt: '2026-02-10T12:05:00Z',
    },
    {
      id: 'pay_demo_2',
      userId: 'usr_aryan',
      plan: 'GOLD',
      amount: 29.99,
      currency: 'USD',
      interval: 'MONTHLY',
      status: 'SUCCEEDED',
      paymentMethod: 'Test UPI / Card',
      transactionRef: 'HL_TX_441029',
      createdAt: '2026-02-14T08:35:00Z',
    },
  ];

  return {
    users,
    swipes: [
      { id: 'sw_1', senderId: 'usr_sophia', receiverId: 'usr_leo', type: 'LIKE', createdAt: '2026-02-16T17:50:00Z' },
      { id: 'sw_2', senderId: 'usr_leo', receiverId: 'usr_sophia', type: 'LIKE', createdAt: '2026-02-16T18:00:00Z' },
    ],
    matches,
    blindMatches,
    messages,
    reports,
    blocks,
    payments,
    settings: getDefaultSettings(),
  };
}

class HeartLinkDatabase {
  private cache: DatabaseSchema | null = null;

  private load(): DatabaseSchema {
    if (this.cache) return this.cache;

    if (!fs.existsSync(DB_FILE)) {
      const initial = getInitialDemoData();
      this.save(initial);
      this.cache = initial;
      return initial;
    }

    try {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      this.cache = JSON.parse(raw);
      return this.cache!;
    } catch (err) {
      console.error('Failed reading DB file, recreating default:', err);
      const initial = getInitialDemoData();
      this.save(initial);
      this.cache = initial;
      return initial;
    }
  }

  private save(data: DatabaseSchema): void {
    const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
    this.cache = data;
  }

  // Users
  getAllUsers(): User[] {
    return this.load().users;
  }

  getUserById(id: string): User | null {
    return this.load().users.find((u) => u.id === id) || null;
  }

  getUserByEmail(email: string): User | null {
    return this.load().users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  createUser(user: User): User {
    const db = this.load();
    db.users.push(user);
    this.save(db);
    return user;
  }

  updateUser(id: string, updates: Partial<User>): User | null {
    const db = this.load();
    const index = db.users.findIndex((u) => u.id === id);
    if (index === -1) return null;
    db.users[index] = { ...db.users[index], ...updates };
    this.save(db);
    return db.users[index];
  }

  deleteUser(id: string): boolean {
    const db = this.load();
    const initLen = db.users.length;
    db.users = db.users.filter((u) => u.id !== id);
    db.matches = db.matches.filter((m) => m.user1Id !== id && m.user2Id !== id);
    db.blindMatches = db.blindMatches.filter((bm) => bm.user1Id !== id && bm.user2Id !== id);
    db.swipes = db.swipes.filter((s) => s.senderId !== id && s.receiverId !== id);
    this.save(db);
    return db.users.length < initLen;
  }

  // Swipes & Dating
  getSwipesForUser(userId: string): Swipe[] {
    return this.load().swipes.filter((s) => s.senderId === userId);
  }

  getLikesReceived(userId: string): { user: PublicProfile; swipe: Swipe }[] {
    const db = this.load();
    const swipesReceived = db.swipes.filter(
      (s) => s.receiverId === userId && (s.type === 'LIKE' || s.type === 'SUPER_LIKE')
    );
    const result: { user: PublicProfile; swipe: Swipe }[] = [];
    for (const s of swipesReceived) {
      const u = db.users.find((x) => x.id === s.senderId);
      if (u && u.status === 'ACTIVE') {
        const { passwordHash, email, privacy, ...publicProfile } = u;
        result.push({ user: publicProfile, swipe: s });
      }
    }
    return result;
  }

  createSwipe(swipe: Swipe): { swipe: Swipe; match: Match | null } {
    const db = this.load();
    db.swipes.push(swipe);

    let match: Match | null = null;
    if (swipe.type === 'LIKE' || swipe.type === 'SUPER_LIKE') {
      const mutualSwipe = db.swipes.find(
        (s) =>
          s.senderId === swipe.receiverId &&
          s.receiverId === swipe.senderId &&
          (s.type === 'LIKE' || s.type === 'SUPER_LIKE')
      );

      if (mutualSwipe) {
        // Create mutual match!
        const existingMatch = db.matches.find(
          (m) =>
            (m.user1Id === swipe.senderId && m.user2Id === swipe.receiverId) ||
            (m.user1Id === swipe.receiverId && m.user2Id === swipe.senderId)
        );

        if (!existingMatch) {
          const u1 = db.users.find((u) => u.id === swipe.senderId);
          const u2 = db.users.find((u) => u.id === swipe.receiverId);
          const score = 88 + Math.floor(Math.random() * 10);
          match = {
            id: `match_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            type: 'DATING',
            user1Id: swipe.senderId,
            user2Id: swipe.receiverId,
            compatibilityScore: score,
            compatibilityBreakdown: {
              overall: score,
              values: 90,
              lifestyle: 85,
              interests: 88,
              ageLocation: 90,
              aiAnalysis: `Mutual interest unlocked between ${u1?.name || 'User'} and ${u2?.name || 'User'}!`,
            },
            status: 'ACTIVE',
            createdAt: new Date().toISOString(),
            lastMessageAt: new Date().toISOString(),
          };
          db.matches.push(match);
        }
      }
    }

    this.save(db);
    return { swipe, match };
  }

  // Matches
  getMatchesForUser(userId: string): { match: Match; partner: PublicProfile }[] {
    const db = this.load();
    const userMatches = db.matches.filter(
      (m) => m.status === 'ACTIVE' && (m.user1Id === userId || m.user2Id === userId)
    );

    const result: { match: Match; partner: PublicProfile }[] = [];
    for (const m of userMatches) {
      const partnerId = m.user1Id === userId ? m.user2Id : m.user1Id;
      const partner = db.users.find((u) => u.id === partnerId);
      if (partner && partner.status === 'ACTIVE') {
        const { passwordHash, email, privacy, ...publicProfile } = partner;
        result.push({ match: m, partner: publicProfile });
      }
    }
    return result;
  }

  createMatch(match: Match): Match {
    const db = this.load();
    db.matches.push(match);
    this.save(db);
    return match;
  }

  unmatchUser(matchId: string): boolean {
    const db = this.load();
    const match = db.matches.find((m) => m.id === matchId);
    if (!match) return false;
    match.status = 'UNMATCHED';
    this.save(db);
    return true;
  }

  // Blind Matches
  getBlindMatchesForUser(userId: string): {
    blindMatch: BlindMatch;
    partnerAnonymousProfile: AnonymousBlindProfile;
  }[] {
    const db = this.load();
    const userMatches = db.blindMatches.filter(
      (bm) => bm.status !== 'ENDED' && (bm.user1Id === userId || bm.user2Id === userId)
    );

    const result: {
      blindMatch: BlindMatch;
      partnerAnonymousProfile: AnonymousBlindProfile;
    }[] = [];

    for (const bm of userMatches) {
      const isUser1 = bm.user1Id === userId;
      const partnerId = isUser1 ? bm.user2Id : bm.user1Id;
      const partner = db.users.find((u) => u.id === partnerId);
      if (!partner) continue;

      const isRevealed = bm.status === 'MUTUAL_REVEALED';
      const hasUserConsented = isUser1 ? bm.user1Consent : bm.user2Consent;
      const hasPartnerConsented = isUser1 ? bm.user2Consent : bm.user1Consent;

      const anonymous: AnonymousBlindProfile = {
        blindMatchId: bm.id,
        pseudonym: partner.blindProfile.pseudonym || 'Mystic Heart',
        avatarIcon: partner.blindProfile.avatarIcon || 'sparkles',
        colorTheme: partner.blindProfile.colorTheme || 'rose',
        age: partner.age,
        gender: partner.gender,
        city: partner.location.city,
        interests: partner.interests,
        personalityTraits: partner.personalityTraits,
        relationshipGoals: partner.relationshipGoals,
        soulmateSummary: partner.blindProfile.soulmateSummary,
        quizHighlights: Object.keys(partner.blindProfile.quizAnswers || {}),
        isRevealed,
        hasUserConsented,
        hasPartnerConsented,
      };

      if (isRevealed) {
        const { passwordHash, email, privacy, ...publicProfile } = partner;
        anonymous.realProfile = publicProfile;
      }

      result.push({ blindMatch: bm, partnerAnonymousProfile: anonymous });
    }

    return result;
  }

  getBlindMatchById(id: string): BlindMatch | null {
    return this.load().blindMatches.find((bm) => bm.id === id) || null;
  }

  createBlindMatch(blindMatch: BlindMatch): BlindMatch {
    const db = this.load();
    db.blindMatches.push(blindMatch);
    this.save(db);
    return blindMatch;
  }

  consentToBlindReveal(matchId: string, userId: string): { blindMatch: BlindMatch; isNowRevealed: boolean } | null {
    const db = this.load();
    const bm = db.blindMatches.find((m) => m.id === matchId);
    if (!bm) return null;

    if (bm.user1Id === userId) {
      bm.user1Consent = true;
    } else if (bm.user2Id === userId) {
      bm.user2Consent = true;
    } else {
      return null;
    }

    let isNowRevealed = false;
    if (bm.user1Consent && bm.user2Consent) {
      bm.status = 'MUTUAL_REVEALED';
      bm.revealedAt = new Date().toISOString();
      isNowRevealed = true;
    } else if (bm.user1Consent) {
      bm.status = 'USER1_CONSENTED';
    } else if (bm.user2Consent) {
      bm.status = 'USER2_CONSENTED';
    }

    this.save(db);
    return { blindMatch: bm, isNowRevealed };
  }

  leaveBlindMatch(matchId: string): boolean {
    const db = this.load();
    const bm = db.blindMatches.find((m) => m.id === matchId);
    if (!bm) return false;
    bm.status = 'ENDED';
    this.save(db);
    return true;
  }

  // Messages
  getMessages(matchId: string): ChatMessage[] {
    return this.load().messages.filter((m) => m.matchId === matchId);
  }

  createMessage(msg: ChatMessage): ChatMessage {
    const db = this.load();
    db.messages.push(msg);

    // Update lastMessageAt on match or blindMatch
    const directMatch = db.matches.find((m) => m.id === msg.matchId);
    if (directMatch) {
      directMatch.lastMessageAt = msg.createdAt;
    }
    const blindMatch = db.blindMatches.find((m) => m.id === msg.matchId);
    if (blindMatch) {
      blindMatch.lastMessageAt = msg.createdAt;
    }

    this.save(db);
    return msg;
  }

  markMessagesAsRead(matchId: string, readerUserId: string): void {
    const db = this.load();
    let updated = false;
    for (const m of db.messages) {
      if (m.matchId === matchId && m.senderId !== readerUserId && !m.read) {
        m.read = true;
        m.readAt = new Date().toISOString();
        updated = true;
      }
    }
    if (updated) this.save(db);
  }

  // Reports & Blocks
  createReport(report: UserReport): UserReport {
    const db = this.load();
    db.reports.push(report);
    this.save(db);
    return report;
  }

  getAllReports(): UserReport[] {
    return this.load().reports;
  }

  updateReport(id: string, updates: Partial<UserReport>): UserReport | null {
    const db = this.load();
    const idx = db.reports.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    db.reports[idx] = { ...db.reports[idx], ...updates };
    this.save(db);
    return db.reports[idx];
  }

  blockUser(blockerId: string, blockedUserId: string): BlockRecord {
    const db = this.load();
    const existing = db.blocks.find(
      (b) => b.blockerId === blockerId && b.blockedUserId === blockedUserId
    );
    if (existing) return existing;

    const block: BlockRecord = {
      id: `blk_${Date.now()}`,
      blockerId,
      blockedUserId,
      createdAt: new Date().toISOString(),
    };
    db.blocks.push(block);

    // Disconnect active matches
    db.matches.forEach((m) => {
      if (
        (m.user1Id === blockerId && m.user2Id === blockedUserId) ||
        (m.user1Id === blockedUserId && m.user2Id === blockerId)
      ) {
        m.status = 'UNMATCHED';
      }
    });

    db.blindMatches.forEach((bm) => {
      if (
        (bm.user1Id === blockerId && bm.user2Id === blockedUserId) ||
        (bm.user1Id === blockedUserId && bm.user2Id === blockerId)
      ) {
        bm.status = 'ENDED';
      }
    });

    this.save(db);
    return block;
  }

  getBlockedUserIds(userId: string): string[] {
    const db = this.load();
    const myBlocks = db.blocks.filter((b) => b.blockerId === userId).map((b) => b.blockedUserId);
    const blockedBy = db.blocks.filter((b) => b.blockedUserId === userId).map((b) => b.blockerId);
    return Array.from(new Set([...myBlocks, ...blockedBy]));
  }

  // Payments
  createPayment(payment: PaymentTransaction): PaymentTransaction {
    const db = this.load();
    db.payments.push(payment);
    const user = db.users.find((u) => u.id === payment.userId);
    if (user && payment.status === 'SUCCEEDED') {
      user.membershipTier = payment.plan;
      const expiry = new Date();
      if (payment.interval === 'YEARLY') {
        expiry.setFullYear(expiry.getFullYear() + 1);
      } else {
        expiry.setMonth(expiry.getMonth() + 1);
      }
      user.membershipExpiresAt = expiry.toISOString();
    }
    this.save(db);
    return payment;
  }

  getAllPayments(): PaymentTransaction[] {
    return this.load().payments;
  }

  // Settings
  getAdminSettings(): AdminSettings {
    return this.load().settings || getDefaultSettings();
  }

  updateAdminSettings(updates: Partial<AdminSettings>): AdminSettings {
    const db = this.load();
    db.settings = { ...db.settings, ...updates };
    this.save(db);
    return db.settings;
  }

  resetToDemoData(): void {
    const initial = getInitialDemoData();
    this.save(initial);
  }
}

// Singleton instance
export const db = new HeartLinkDatabase();
