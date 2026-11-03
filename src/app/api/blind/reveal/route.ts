import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { matchId } = await req.json();
    if (!matchId) {
      return NextResponse.json({ error: 'Match ID is required' }, { status: 400 });
    }

    const result = db.consentToBlindReveal(matchId, user.id);
    if (!result) {
      return NextResponse.json({ error: 'Blind match not found or access denied' }, { status: 404 });
    }

    let partnerRealProfile = null;
    if (result.isNowRevealed) {
      const partnerId =
        result.blindMatch.user1Id === user.id ? result.blindMatch.user2Id : result.blindMatch.user1Id;
      const partner = db.getUserById(partnerId);
      if (partner) {
        const { passwordHash: _, email: __, privacy: ___, ...pub } = partner;
        partnerRealProfile = pub;
      }
    }

    return NextResponse.json({
      success: true,
      isNowRevealed: result.isNowRevealed,
      blindMatch: result.blindMatch,
      partnerProfile: partnerRealProfile,
      message: result.isNowRevealed
        ? 'Mutual consent granted! Profiles are now revealed!'
        : 'Reveal request sent. Waiting for your match to accept!',
    });
  } catch (err: any) {
    console.error('Blind reveal consent error:', err);
    return NextResponse.json({ error: 'Failed to consent to reveal' }, { status: 500 });
  }
}
