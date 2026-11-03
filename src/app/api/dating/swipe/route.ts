import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { Swipe } from '@/types';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { receiverId, type } = await req.json();

    if (!receiverId || !type || !['LIKE', 'PASS', 'SUPER_LIKE'].includes(type)) {
      return NextResponse.json({ error: 'Invalid swipe payload' }, { status: 400 });
    }

    // Check tier limits for likes
    if (type === 'LIKE') {
      if (user.membershipTier === 'FREE' && user.likesRemainingToday <= 0) {
        return NextResponse.json(
          {
            limitReached: true,
            error: 'You have used all 15 free daily likes. Upgrade to Gold for unlimited likes!',
          },
          { status: 429 }
        );
      }
      if (user.membershipTier === 'FREE') {
        db.updateUser(user.id, { likesRemainingToday: Math.max(0, user.likesRemainingToday - 1) });
      }
    } else if (type === 'SUPER_LIKE') {
      if (user.superLikesRemainingToday <= 0) {
        return NextResponse.json(
          {
            limitReached: true,
            error: 'You have used your Super Likes for today. Upgrade to Platinum for 20 Super Likes daily!',
          },
          { status: 429 }
        );
      }
      db.updateUser(user.id, {
        superLikesRemainingToday: Math.max(0, user.superLikesRemainingToday - 1),
      });
    }

    const swipe: Swipe = {
      id: `sw_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      senderId: user.id,
      receiverId,
      type,
      createdAt: new Date().toISOString(),
    };

    const result = db.createSwipe(swipe);

    let partnerPublicProfile = null;
    if (result.match) {
      const partner = db.getUserById(receiverId);
      if (partner) {
        const { passwordHash: _, email: __, privacy: ___, ...pub } = partner;
        partnerPublicProfile = pub;
      }
    }

    return NextResponse.json({
      success: true,
      matched: !!result.match,
      match: result.match,
      partner: partnerPublicProfile,
      likesRemainingToday: user.likesRemainingToday - (type === 'LIKE' && user.membershipTier === 'FREE' ? 1 : 0),
      superLikesRemainingToday:
        user.superLikesRemainingToday - (type === 'SUPER_LIKE' ? 1 : 0),
    });
  } catch (err: any) {
    console.error('Swipe error:', err);
    return NextResponse.json({ error: 'Failed to record swipe' }, { status: 500 });
  }
}
