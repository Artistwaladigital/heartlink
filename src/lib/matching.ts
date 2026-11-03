import { User, MatchCompatibilityBreakdown, RelationshipGoal } from '@/types';
import { db } from './db';

export function calculateCompatibility(userA: User, userB: User): MatchCompatibilityBreakdown {
  const settings = db.getAdminSettings();
  const weights = settings.matchingWeights;

  // 1. Age & Location Score (0 - 100)
  let ageScore = 80;
  const inRangeA = userB.age >= userA.preferences.minAge && userB.age <= userA.preferences.maxAge;
  const inRangeB = userA.age >= userB.preferences.minAge && userA.age <= userB.preferences.maxAge;
  if (inRangeA && inRangeB) {
    ageScore = 100;
  } else if (inRangeA || inRangeB) {
    ageScore = 75;
  } else {
    const diff = Math.min(
      Math.abs(userB.age - userA.preferences.minAge),
      Math.abs(userB.age - userA.preferences.maxAge)
    );
    ageScore = Math.max(30, 80 - diff * 10);
  }

  let locationScore = 60;
  if (userA.location.city.toLowerCase() === userB.location.city.toLowerCase()) {
    locationScore = 100;
  } else if (userA.location.country.toLowerCase() === userB.location.country.toLowerCase()) {
    locationScore = 80;
  } else {
    locationScore = 55;
  }

  const ageLocation = Math.round(ageScore * 0.5 + locationScore * 0.5);

  // 2. Values & Relationship Goals Score (0 - 100)
  let valuesScore = 70;
  if (userA.relationshipGoals === userB.relationshipGoals) {
    valuesScore = 100;
  } else if (
    (userA.relationshipGoals === 'MARRIAGE' && userB.relationshipGoals === 'SERIOUS_RELATIONSHIP') ||
    (userA.relationshipGoals === 'SERIOUS_RELATIONSHIP' && userB.relationshipGoals === 'MARRIAGE')
  ) {
    valuesScore = 90;
  } else if (
    (userA.relationshipGoals === 'CASUAL_DATING' && userB.relationshipGoals === 'MARRIAGE') ||
    (userA.relationshipGoals === 'MARRIAGE' && userB.relationshipGoals === 'CASUAL_DATING')
  ) {
    valuesScore = 30;
  } else {
    valuesScore = 70;
  }

  // 3. Lifestyle Synergy (0 - 100)
  let lifestyleScore = 80;
  let matches = 0;
  let total = 3;

  if (userA.lifestyle.smoking === userB.lifestyle.smoking) matches++;
  if (userA.lifestyle.drinking === userB.lifestyle.drinking) matches++;
  if (userA.lifestyle.diet === userB.lifestyle.diet) matches++;

  lifestyleScore = Math.round(60 + (matches / total) * 40);

  // 4. Interests Overlap (0 - 100)
  const setA = new Set(userA.interests.map((i) => i.toLowerCase()));
  const setB = new Set(userB.interests.map((i) => i.toLowerCase()));
  const sharedInterests = Array.from(setA).filter((x) => setB.has(x));

  let interestsScore = 65;
  if (sharedInterests.length >= 3) {
    interestsScore = 98;
  } else if (sharedInterests.length === 2) {
    interestsScore = 90;
  } else if (sharedInterests.length === 1) {
    interestsScore = 80;
  }

  // 5. Personality / Quiz Alignment (0 - 100)
  let quizScore = 80;
  const answersA = userA.blindProfile.quizAnswers || {};
  const answersB = userB.blindProfile.quizAnswers || {};
  const commonQuestions = Object.keys(answersA).filter((k) => k in answersB);

  if (commonQuestions.length > 0) {
    let same = 0;
    for (const q of commonQuestions) {
      if (answersA[q] === answersB[q]) same++;
    }
    quizScore = Math.round(50 + (same / commonQuestions.length) * 50);
  }

  // Weighted Overall
  const overall = Math.min(
    99,
    Math.max(
      45,
      Math.round(
        ageLocation * weights.locationWeight +
          valuesScore * weights.valuesWeight +
          lifestyleScore * 0.15 +
          interestsScore * weights.interestsWeight +
          quizScore * weights.quizWeight
      )
    )
  );

  // Generate dynamic analysis description
  let aiAnalysis = '';
  if (overall >= 90) {
    aiAnalysis = `Exceptional resonance (${overall}%): Highly compatible life goals (${userA.relationshipGoals.replace(/_/g, ' ')}), complementary values, and strong shared lifestyle preferences.`;
    if (sharedInterests.length > 0) {
      aiAnalysis += ` You both bond over ${sharedInterests.slice(0, 2).join(' & ')}.`;
    }
  } else if (overall >= 80) {
    aiAnalysis = `Strong synergy (${overall}%): Great alignment in relationship vision and communication style with positive lifestyle compatibility.`;
  } else {
    aiAnalysis = `Promising match (${overall}%): Diverse personalities with intriguing areas of mutual curiosity.`;
  }

  return {
    overall,
    values: valuesScore,
    lifestyle: lifestyleScore,
    interests: interestsScore,
    ageLocation,
    aiAnalysis,
  };
}

export interface NaturalLanguageSearchFilters {
  minAge?: number;
  maxAge?: number;
  city?: string;
  relationshipGoal?: RelationshipGoal;
  interests?: string[];
  lifestyleTraits?: string[];
  educationKeyword?: string;
  professionKeyword?: string;
  rawQuery: string;
}

export function parseNaturalLanguageQuery(query: string): NaturalLanguageSearchFilters {
  const q = query.toLowerCase();
  const filters: NaturalLanguageSearchFilters = { rawQuery: query };

  // 1. Age detection (e.g. "between 25 and 30", "aged 25 to 32", "25-30", "under 30", "above 28")
  const rangeMatch =
    q.match(/(?:between|aged|age)\s+(\d{2})\s*(?:and|to|-)\s*(\d{2})/i) ||
    q.match(/(\d{2})\s*(?:to|-)\s*(\d{2})\s*years?/i);

  if (rangeMatch) {
    filters.minAge = parseInt(rangeMatch[1], 10);
    filters.maxAge = parseInt(rangeMatch[2], 10);
  } else {
    const singleUnder = q.match(/(?:under|below|less than)\s+(\d{2})/i);
    if (singleUnder) {
      filters.minAge = 18;
      filters.maxAge = parseInt(singleUnder[1], 10);
    }
    const singleOver = q.match(/(?:over|above|older than)\s+(\d{2})/i);
    if (singleOver) {
      filters.minAge = parseInt(singleOver[1], 10);
      filters.maxAge = 65;
    }
  }

  // 2. City detection
  const commonCities = [
    'kolkata',
    'new york',
    'london',
    'mumbai',
    'san francisco',
    'paris',
    'toronto',
    'bengaluru',
    'delhi',
    'tokyo',
    'berlin',
    'sydney',
    'chicago',
    'boston',
    'pune',
    'dubai',
  ];

  for (const city of commonCities) {
    if (q.includes(city)) {
      filters.city = city;
      break;
    }
  }

  // 3. Relationship Goal detection
  if (q.includes('marriage') || q.includes('matrimon') || q.includes('settle down') || q.includes('family-oriented')) {
    filters.relationshipGoal = 'MARRIAGE';
  } else if (q.includes('serious') || q.includes('long term') || q.includes('committed') || q.includes('soulmate')) {
    filters.relationshipGoal = 'SERIOUS_RELATIONSHIP';
  } else if (q.includes('casual') || q.includes('fun') || q.includes('dating')) {
    filters.relationshipGoal = 'CASUAL_DATING';
  }

  // 4. Interests / Keywords
  const possibleInterests = [
    'travel',
    'books',
    'literature',
    'art',
    'music',
    'fitness',
    'yoga',
    'hiking',
    'cooking',
    'food',
    'coffee',
    'design',
    'architecture',
    'piano',
    'guitar',
    'cinema',
    'science',
    'tech',
  ];

  const matchedInterests: string[] = [];
  for (const interest of possibleInterests) {
    if (q.includes(interest)) {
      matchedInterests.push(interest);
    }
  }
  if (matchedInterests.length > 0) {
    filters.interests = matchedInterests;
  }

  // 5. Education & Profession Keywords
  if (q.includes('doctor') || q.includes('surgeon') || q.includes('physician')) {
    filters.professionKeyword = 'doctor';
  } else if (q.includes('engineer') || q.includes('tech') || q.includes('developer') || q.includes('founder')) {
    filters.professionKeyword = 'engineer';
  } else if (q.includes('architect')) {
    filters.professionKeyword = 'architect';
  }

  if (q.includes('educated') || q.includes('master') || q.includes('phd') || q.includes('degree')) {
    filters.educationKeyword = 'educated';
  }

  return filters;
}

export function searchProfilesWithNaturalLanguage(
  currentUser: User,
  query: string
): { user: User; matchScore: number; matchReasons: string[] }[] {
  const filters = parseNaturalLanguageQuery(query);
  const allUsers = db.getAllUsers().filter((u) => u.id !== currentUser.id && u.status === 'ACTIVE');

  const results: { user: User; matchScore: number; matchReasons: string[] }[] = [];

  for (const candidate of allUsers) {
    let score = 50;
    const reasons: string[] = [];

    // Age check
    if (filters.minAge && filters.maxAge) {
      if (candidate.age >= filters.minAge && candidate.age <= filters.maxAge) {
        score += 20;
        reasons.push(`Aged ${candidate.age} (fits your ${filters.minAge}-${filters.maxAge} criteria)`);
      } else {
        score -= 15;
      }
    }

    // City check
    if (filters.city) {
      if (candidate.location.city.toLowerCase().includes(filters.city)) {
        score += 25;
        reasons.push(`Lives in ${candidate.location.city}`);
      } else {
        score -= 10;
      }
    }

    // Relationship Goal
    if (filters.relationshipGoal) {
      if (candidate.relationshipGoals === filters.relationshipGoal) {
        score += 20;
        reasons.push(`Seeking ${filters.relationshipGoal.replace(/_/g, ' ').toLowerCase()}`);
      } else if (
        filters.relationshipGoal === 'MARRIAGE' &&
        candidate.relationshipGoals === 'SERIOUS_RELATIONSHIP'
      ) {
        score += 12;
        reasons.push(`Open to serious long-term commitment`);
      }
    }

    // Interests
    if (filters.interests && filters.interests.length > 0) {
      const candidateInterestsLower = candidate.interests.map((i) => i.toLowerCase());
      const hits = filters.interests.filter((target) =>
        candidateInterestsLower.some((ci) => ci.includes(target))
      );
      if (hits.length > 0) {
        score += hits.length * 10;
        reasons.push(`Shared passion for ${hits.join(', ')}`);
      }
    }

    // Profession / Education
    if (filters.professionKeyword) {
      if (candidate.profession.toLowerCase().includes(filters.professionKeyword)) {
        score += 15;
        reasons.push(`Works as ${candidate.profession}`);
      }
    }

    if (filters.educationKeyword) {
      if (candidate.education.length > 5) {
        score += 10;
        reasons.push(`Educated at ${candidate.education}`);
      }
    }

    // Base compatibility booster
    const baseCompatibility = calculateCompatibility(currentUser, candidate);
    const finalScore = Math.min(99, Math.max(40, Math.round(score * 0.45 + baseCompatibility.overall * 0.55)));

    if (reasons.length === 0) {
      reasons.push(`${baseCompatibility.overall}% natural personality & lifestyle alignment`);
    }

    results.push({
      user: candidate,
      matchScore: finalScore,
      matchReasons: reasons,
    });
  }

  // Sort descending by matchScore
  results.sort((a, b) => b.matchScore - a.matchScore);
  return results;
}
