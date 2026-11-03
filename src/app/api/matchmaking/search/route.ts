import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { searchProfilesWithNaturalLanguage, calculateCompatibility } from '@/lib/matching';
import { db } from '@/lib/db';
import { PublicProfile } from '@/types';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { query, structuredFilters } = await req.json();

    if (query && typeof query === 'string' && query.trim().length > 0) {
      // Natural Language Search
      const searchResults = searchProfilesWithNaturalLanguage(user, query.trim());
      const sanitized = searchResults.map((r) => {
        const { passwordHash: _, email: __, privacy: ___, ...pub } = r.user;
        const comp = calculateCompatibility(user, r.user);
        return {
          profile: pub as PublicProfile,
          matchScore: r.matchScore,
          matchReasons: r.matchReasons,
          compatibilityBreakdown: comp,
        };
      });

      return NextResponse.json({
        success: true,
        mode: 'NATURAL_LANGUAGE',
        query,
        count: sanitized.length,
        results: sanitized,
      });
    }

    // Structured Filters Search
    const allUsers = db
      .getAllUsers()
      .filter((u) => u.id !== user.id && u.status === 'ACTIVE' && u.privacy.showProfile);

    const minAge = structuredFilters?.minAge || 18;
    const maxAge = structuredFilters?.maxAge || 60;
    const city = structuredFilters?.city?.trim().toLowerCase();
    const relationshipGoal = structuredFilters?.relationshipGoal;
    const profession = structuredFilters?.profession?.trim().toLowerCase();

    const filtered = allUsers.filter((u) => {
      if (u.age < minAge || u.age > maxAge) return false;
      if (city && !u.location.city.toLowerCase().includes(city)) return false;
      if (relationshipGoal && u.relationshipGoals !== relationshipGoal) return false;
      if (profession && !u.profession.toLowerCase().includes(profession)) return false;
      return true;
    });

    const results = filtered.map((candidate) => {
      const comp = calculateCompatibility(user, candidate);
      const { passwordHash: _, email: __, privacy: ___, ...pub } = candidate;
      const reasons: string[] = [
        `${comp.overall}% Compatibility score`,
        `Lives in ${candidate.location.city}`,
        `Goal: ${candidate.relationshipGoals.replace(/_/g, ' ')}`,
      ];

      return {
        profile: pub as PublicProfile,
        matchScore: comp.overall,
        matchReasons: reasons,
        compatibilityBreakdown: comp,
      };
    });

    results.sort((a, b) => b.matchScore - a.matchScore);

    return NextResponse.json({
      success: true,
      mode: 'STRUCTURED',
      count: results.length,
      results,
    });
  } catch (err: any) {
    console.error('Matchmaking search error:', err);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
