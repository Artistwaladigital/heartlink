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

    const success = db.leaveBlindMatch(matchId);
    return NextResponse.json({ success, message: 'You have left this blind match.' });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to leave match' }, { status: 500 });
  }
}
