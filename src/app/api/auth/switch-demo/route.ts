import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createToken, COOKIE_NAME } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const user = db.getUserById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    db.updateUser(user.id, { lastActiveAt: new Date().toISOString() });

    const token = createToken(user);
    const { passwordHash: _, ...publicUserData } = user;

    const res = NextResponse.json({
      success: true,
      message: `Switched account to ${user.name}`,
      user: publicUserData,
    });

    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to switch demo user' }, { status: 500 });
  }
}
