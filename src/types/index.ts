export type UserRole = 'USER' | 'ADMIN' | 'MODERATOR';

export type MembershipTier = 'FREE' | 'GOLD' | 'PLATINUM';

export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'BANNED';

export type PhotoModerationStatus = 'APPROVED' | 'PENDING' | 'FLAGGED';

export type PreferredExperience = 'DATING' | 'MATCHMAKING' | 'BLIND_MATCHMAKING' | 'ALL';

export type Gender = 'WOMAN' | 'MAN' | 'NON_BINARY' | 'OTHER';

export type InterestedIn = 'WOMEN' | 'MEN' | 'EVERYONE';

export type RelationshipGoal =
  | 'MARRIAGE'
  | 'SERIOUS_RELATIONSHIP'
  | 'LONG_TERM_DATING'
  | 'CASUAL_DATING'
  | 'NOT_SURE_YET';

export interface UserLifestyle {
  smoking: 'NEVER' | 'OCCASIONALLY' | 'SOCIALLY' | 'REGULARLY';
  drinking: 'NEVER' | 'OCCASIONALLY' | 'SOCIALLY' | 'REGULARLY';
  diet: 'OMNIVORE' | 'VEGETARIAN' | 'VEGAN' | 'PESCATARIAN' | 'HALAL' | 'KOSHER';
  exercise: 'DAILY' | 'FEW_TIMES_A_WEEK' | 'OCCASIONALLY' | 'RARELY';
  pets?: string;
  astrologySign?: string;
}

export interface UserPreferences {
  minAge: number;
  maxAge: number;
  maxDistanceKm: number;
  citiesPreferred: string[];
  relationshipGoals: RelationshipGoal[];
  educationMin?: string;
}

export interface UserPrivacy {
  showProfile: boolean;
  showAge: boolean;
  showDistance: boolean;
  incognitoMode: boolean;
}

export interface BlindProfile {
  joinedPool: boolean;
  pseudonym: string;
  avatarIcon: string;
  colorTheme: string;
  quizAnswers: Record<string, string | number>;
  soulmateSummary?: string;
}

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  membershipTier: MembershipTier;
  membershipExpiresAt: string | null;
  verified: boolean;
  status: UserStatus;
  name: string;
  age: number;
  dateOfBirth: string; // YYYY-MM-DD (must be 18+)
  gender: Gender;
  interestedIn: InterestedIn;
  preferredExperience: PreferredExperience;
  location: {
    city: string;
    country: string;
    latitude?: number;
    longitude?: number;
  };
  photos: string[];
  photoStatus: PhotoModerationStatus;
  bio: string;
  profession: string;
  education: string;
  heightCm?: number;
  interests: string[];
  lifestyle: UserLifestyle;
  relationshipGoals: RelationshipGoal;
  personalityTraits: string[];
  preferences: UserPreferences;
  privacy: UserPrivacy;
  blindProfile: BlindProfile;
  likesRemainingToday: number;
  superLikesRemainingToday: number;
  lastActiveAt: string;
  createdAt: string;
}

// Sanitized profile for public view (dating/matchmaking)
export type PublicProfile = Omit<User, 'passwordHash' | 'email' | 'privacy'> & {
  distanceKm?: number;
};

// Anonymous profile for blind matchmaking (STRICTLY sanitizes photos, real name, email, exact location)
export interface AnonymousBlindProfile {
  blindMatchId: string;
  pseudonym: string;
  avatarIcon: string;
  colorTheme: string;
  age: number;
  gender: Gender;
  city: string; // General area or region only
  interests: string[];
  personalityTraits: string[];
  relationshipGoals: RelationshipGoal;
  soulmateSummary?: string;
  quizHighlights: string[];
  isRevealed: boolean;
  hasUserConsented: boolean;
  hasPartnerConsented: boolean;
  realProfile?: PublicProfile; // Only included if BOTH have consented!
}

export interface Swipe {
  id: string;
  senderId: string;
  receiverId: string;
  type: 'LIKE' | 'PASS' | 'SUPER_LIKE';
  createdAt: string;
}

export interface MatchCompatibilityBreakdown {
  overall: number;
  values: number;
  lifestyle: number;
  interests: number;
  ageLocation: number;
  aiAnalysis: string;
}

export interface Match {
  id: string;
  type: 'DATING' | 'MATCHMAKING';
  user1Id: string;
  user2Id: string;
  compatibilityScore: number;
  compatibilityBreakdown: MatchCompatibilityBreakdown;
  status: 'ACTIVE' | 'UNMATCHED';
  createdAt: string;
  lastMessageAt: string;
}

export type BlindMatchStatus =
  | 'ANONYMOUS_ACTIVE'
  | 'USER1_CONSENTED'
  | 'USER2_CONSENTED'
  | 'MUTUAL_REVEALED'
  | 'ENDED'
  | 'REPORTED';

export interface BlindMatch {
  id: string;
  user1Id: string;
  user2Id: string;
  compatibilityScore: number;
  quizScoreBreakdown: {
    personalityHarmony: number;
    valuesAlignment: number;
    relationshipVision: number;
    humorLifeStyle: number;
    aiSummary: string;
  };
  status: BlindMatchStatus;
  user1Consent: boolean;
  user2Consent: boolean;
  revealedAt: string | null;
  createdAt: string;
  lastMessageAt: string;
}

export interface ChatMessage {
  id: string;
  conversationType: 'DIRECT_MATCH' | 'BLIND_MATCH';
  matchId: string;
  senderId: string;
  content: string;
  read: boolean;
  readAt: string | null;
  createdAt: string;
}

export interface UserReport {
  id: string;
  reporterId: string;
  reportedUserId: string;
  context: 'PROFILE' | 'CHAT' | 'BLIND_MATCH';
  matchId?: string;
  reason: string;
  details: string;
  status: 'PENDING' | 'RESOLVED_WARNED' | 'RESOLVED_BANNED' | 'DISMISSED';
  createdAt: string;
}

export interface BlockRecord {
  id: string;
  blockerId: string;
  blockedUserId: string;
  createdAt: string;
}

export interface PaymentTransaction {
  id: string;
  userId: string;
  plan: 'GOLD' | 'PLATINUM';
  amount: number;
  currency: string;
  interval: 'MONTHLY' | 'YEARLY';
  status: 'SUCCEEDED' | 'PENDING' | 'REFUNDED';
  paymentMethod: string;
  transactionRef: string;
  createdAt: string;
}

export interface AdminSettings {
  siteName: string;
  allowRegistrations: boolean;
  requirePhotoVerification: boolean;
  prices: {
    goldMonthly: number;
    goldYearly: number;
    platinumMonthly: number;
    platinumYearly: number;
  };
  tierFeatures: {
    free: { likesPerDay: number; superLikesPerDay: number; blindMatchesPerWeek: number };
    gold: { likesPerDay: number; superLikesPerDay: number; blindMatchesPerWeek: number };
    platinum: { likesPerDay: number; superLikesPerDay: number; blindMatchesPerWeek: number };
  };
  matchingWeights: {
    ageWeight: number;
    locationWeight: number;
    valuesWeight: number;
    interestsWeight: number;
    quizWeight: number;
  };
  announcement: string;
}

export interface PersonalityQuizQuestion {
  id: string;
  category: 'VALUES' | 'PERSONALITY' | 'ROMANCE' | 'LIFESTYLE' | 'FUTURE';
  question: string;
  description?: string;
  options: {
    value: string;
    label: string;
    archetypeTag?: string;
  }[];
}
