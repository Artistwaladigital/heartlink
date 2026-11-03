import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { calculateCompatibility } from '@/lib/matching';
import { PublicProfile } from '@/types';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const allUsers = db.getAllUsers();
    const existingSwipes = db.getSwipesForUser(user.id);
    const swipedUserIds = new Set(existingSwipes.map((s) => s.receiverId));
    const blockedUserIds = new Set(db.getBlockedUserIds(user.id));

    // Filter candidates
    const candidates = allUsers.filter((u) => {
      if (u.id === user.id) return false;
      if (u.status !== 'ACTIVE') return false;
      if (swipedUserIds.has(u.id)) return false;
      if (blockedUserIds.has(u.id)) return false;
      if (!u.privacy.showProfile) return false;

      // Gender preference matching
      if (user.interestedIn === 'WOMEN' && u.gender !== 'WOMAN') return false;
      if (user.interestedIn === 'MEN' && u.gender !== 'MAN') return false;

      // Reverse check (does the candidate accept user's gender?)
      if (u.interestedIn === 'WOMEN' && user.gender !== 'WOMAN') return false;
      if (u.interestedIn === 'MEN' && user.gender !== 'MAN') return false;

      return true;
    });

    // Score candidates and sanitize
    const scoredDeck = candidates.map((candidate) => {
      const compatibility = calculateCompatibility(user, candidate);
      const { passwordHash: _, email: __, privacy: ___, ...publicProfile } = candidate;

      return {
        ...publicProfile,
        compatibilityScore: compatibility.overall,
        compatibilityBreakdown: compatibility,
      };
    });

    // Sort by compatibility score
    scoredDeck.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

    return NextResponse.json({
      profiles: scoredDeck,
      likesRemainingToday: user.likesRemainingToday,
      superLikesRemainingToday: user.superLikesRemainingToday,
      membershipTier: user.membershipTier,
    });
  } catch (err: any) {
    console.error('Discover error:', err);
    return NextResponse.json({ error: 'Failed to fetch discovery profiles' }, { status: 500 });
  }
}
