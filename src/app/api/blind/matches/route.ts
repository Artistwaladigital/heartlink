import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { BlindMatch } from '@/types';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const blindMatches = db.getBlindMatchesForUser(user.id);
    return NextResponse.json({
      matches: blindMatches,
      hasJoinedPool: user.blindProfile?.joinedPool ?? false,
      myPseudonym: user.blindProfile?.pseudonym ?? 'Anonymous Heart',
      myAvatarIcon: user.blindProfile?.avatarIcon ?? 'sparkles',
    });
  } catch (err: any) {
    console.error('Blind matches fetch error:', err);
    return NextResponse.json({ error: 'Failed to fetch blind matches' }, { status: 500 });
  }
}

export async function POST() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!user.blindProfile?.joinedPool) {
      return NextResponse.json(
        { error: 'Please take the Personality Quiz first before matching in the blind pool.' },
        { status: 400 }
      );
    }

    // Find all users in the pool who are not current user and not already matched with user
    const existingBlindMatches = db.getBlindMatchesForUser(user.id);
    const matchedPartnerIds = new Set(
      existingBlindMatches.map((bm) =>
        bm.blindMatch.user1Id === user.id ? bm.blindMatch.user2Id : bm.blindMatch.user1Id
      )
    );
    const blockedIds = new Set(db.getBlockedUserIds(user.id));

    const poolCandidates = db.getAllUsers().filter((u) => {
      if (u.id === user.id) return false;
      if (u.status !== 'ACTIVE') return false;
      if (!u.blindProfile?.joinedPool) return false;
      if (matchedPartnerIds.has(u.id)) return false;
      if (blockedIds.has(u.id)) return false;

      // Gender preference check
      if (user.interestedIn === 'WOMEN' && u.gender !== 'WOMAN') return false;
      if (user.interestedIn === 'MEN' && u.gender !== 'MAN') return false;
      return true;
    });

    if (poolCandidates.length === 0) {
      return NextResponse.json(
        {
          error:
            'No new candidates currently available in the Blind Pool. New anonymous members join every hour!',
        },
        { status: 404 }
      );
    }

    // Pick best match based on quiz answers
    let bestCandidate = poolCandidates[0];
    let highestQuizScore = 0;

    for (const candidate of poolCandidates) {
      let matches = 0;
      const myAnswers = user.blindProfile.quizAnswers || {};
      const theirAnswers = candidate.blindProfile.quizAnswers || {};
      for (const [key, val] of Object.entries(myAnswers)) {
        if (theirAnswers[key] === val) matches++;
      }
      if (matches > highestQuizScore) {
        highestQuizScore = matches;
        bestCandidate = candidate;
      }
    }

    const calculatedScore = Math.min(98, Math.max(82, 75 + highestQuizScore * 5));

    const newBlindMatch: BlindMatch = {
      id: `blind_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      user1Id: user.id,
      user2Id: bestCandidate.id,
      compatibilityScore: calculatedScore,
      quizScoreBreakdown: {
        personalityHarmony: calculatedScore,
        valuesAlignment: Math.min(99, calculatedScore + 3),
        relationshipVision: Math.min(99, calculatedScore - 2),
        humorLifeStyle: Math.min(99, calculatedScore + 1),
        aiSummary: `Matched based on ${highestQuizScore} common core personality archetypes and aligned relationship expectations.`,
      },
      status: 'ANONYMOUS_ACTIVE',
      user1Consent: false,
      user2Consent: false,
      revealedAt: null,
      createdAt: new Date().toISOString(),
      lastMessageAt: new Date().toISOString(),
    };

    db.createBlindMatch(newBlindMatch);

    // Initial icebreaker greeting
    db.createMessage({
      id: `msg_icebreaker_${Date.now()}`,
      conversationType: 'BLIND_MATCH',
      matchId: newBlindMatch.id,
      senderId: bestCandidate.id,
      content: `Hello! Our soulmate archetypes matched with a ${calculatedScore}% compatibility score. Excited to get to know the mind behind the avatar!`,
      read: false,
      readAt: null,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: 'New anonymous match created!',
      matchId: newBlindMatch.id,
      compatibilityScore: calculatedScore,
    });
  } catch (err: any) {
    console.error('Blind match creation error:', err);
    return NextResponse.json({ error: 'Failed to match in blind pool' }, { status: 500 });
  }
}
