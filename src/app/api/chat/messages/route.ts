import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { ChatMessage } from '@/types';

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const matchId = searchParams.get('matchId');

    if (!matchId) {
      return NextResponse.json({ error: 'matchId is required' }, { status: 400 });
    }

    // Verify user belongs to this match
    const directMatch = db.getMatchesForUser(user.id).find((m) => m.match.id === matchId);
    const blindMatch = db.getBlindMatchesForUser(user.id).find((bm) => bm.blindMatch.id === matchId);

    if (!directMatch && !blindMatch) {
      return NextResponse.json({ error: 'Match not found or access denied' }, { status: 403 });
    }

    const messages = db.getMessages(matchId);

    // If blind match and unrevealed, mask sender information
    const isBlindMatch = !!blindMatch;
    const isRevealed = blindMatch?.blindMatch.status === 'MUTUAL_REVEALED';

    const formattedMessages = messages.map((m) => {
      const isMine = m.senderId === user.id;
      return {
        id: m.id,
        matchId: m.matchId,
        isMine,
        senderName: isMine
          ? 'You'
          : isBlindMatch && !isRevealed
          ? blindMatch?.partnerAnonymousProfile.pseudonym || 'Anonymous Partner'
          : directMatch?.partner.name || blindMatch?.partnerAnonymousProfile.realProfile?.name || 'Partner',
        content: m.content,
        read: m.read,
        readAt: m.readAt,
        createdAt: m.createdAt,
      };
    });

    // Automatically mark unread messages as read
    db.markMessagesAsRead(matchId, user.id);

    return NextResponse.json({
      messages: formattedMessages,
      isBlindMatch,
      isRevealed,
      partnerConsent: isBlindMatch ? blindMatch?.partnerAnonymousProfile.hasPartnerConsented : false,
      userConsent: isBlindMatch ? blindMatch?.partnerAnonymousProfile.hasUserConsented : false,
    });
  } catch (err: any) {
    console.error('Fetch messages error:', err);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { matchId, content, conversationType } = await req.json();

    if (!matchId || !content || !content.trim()) {
      return NextResponse.json({ error: 'matchId and content are required' }, { status: 400 });
    }

    // Verification
    const directMatch = db.getMatchesForUser(user.id).find((m) => m.match.id === matchId);
    const blindMatch = db.getBlindMatchesForUser(user.id).find((bm) => bm.blindMatch.id === matchId);

    if (!directMatch && !blindMatch) {
      return NextResponse.json({ error: 'Match not found or access denied' }, { status: 403 });
    }

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      conversationType: conversationType || (blindMatch ? 'BLIND_MATCH' : 'DIRECT_MATCH'),
      matchId,
      senderId: user.id,
      content: content.trim(),
      read: false,
      readAt: null,
      createdAt: new Date().toISOString(),
    };

    db.createMessage(newMsg);

    return NextResponse.json({
      success: true,
      message: {
        id: newMsg.id,
        matchId: newMsg.matchId,
        isMine: true,
        senderName: 'You',
        content: newMsg.content,
        read: newMsg.read,
        readAt: newMsg.readAt,
        createdAt: newMsg.createdAt,
      },
    });
  } catch (err: any) {
    console.error('Send message error:', err);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
