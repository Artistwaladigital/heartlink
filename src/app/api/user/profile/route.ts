import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { passwordHash: _, ...publicUserData } = user;
    return NextResponse.json({ user: publicUserData });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updates = await req.json();

    // Prevent modifying sensitive fields directly via this endpoint
    delete updates.id;
    delete updates.email;
    delete updates.passwordHash;
    delete updates.role;
    delete updates.membershipTier;
    delete updates.membershipExpiresAt;

    const updated = db.updateUser(user.id, updates);
    if (!updated) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { passwordHash: _, ...publicUserData } = updated;
    return NextResponse.json({ success: true, user: publicUserData });
  } catch (err: any) {
    console.error('Update profile error:', err);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
