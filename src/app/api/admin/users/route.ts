import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const allUsers = db.getAllUsers().map((u) => {
      const { passwordHash: _, ...pub } = u;
      return pub;
    });

    return NextResponse.json({ users: allUsers });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { action, targetUserId, value } = await req.json();

    if (!action || !targetUserId) {
      return NextResponse.json({ error: 'Action and targetUserId are required' }, { status: 400 });
    }

    const targetUser = db.getUserById(targetUserId);
    if (!targetUser) {
      return NextResponse.json({ error: 'Target user not found' }, { status: 404 });
    }

    if (action === 'TOGGLE_VERIFY') {
      db.updateUser(targetUserId, { verified: !targetUser.verified });
    } else if (action === 'CHANGE_STATUS') {
      if (['ACTIVE', 'SUSPENDED', 'BANNED'].includes(value)) {
        db.updateUser(targetUserId, { status: value });
      }
    } else if (action === 'CHANGE_TIER') {
      if (['FREE', 'GOLD', 'PLATINUM'].includes(value)) {
        db.updateUser(targetUserId, { membershipTier: value });
      }
    } else if (action === 'MODERATE_PHOTO') {
      if (['APPROVED', 'PENDING', 'FLAGGED'].includes(value)) {
        db.updateUser(targetUserId, { photoStatus: value });
      }
    } else if (action === 'DELETE_USER') {
      if (targetUser.role === 'ADMIN') {
        return NextResponse.json({ error: 'Cannot delete admin account' }, { status: 400 });
      }
      db.deleteUser(targetUserId);
      return NextResponse.json({ success: true, message: 'User deleted permanently' });
    }

    const updated = db.getUserById(targetUserId);
    const { passwordHash: _, ...pub } = updated!;
    return NextResponse.json({ success: true, user: pub });
  } catch (err: any) {
    return NextResponse.json({ error: 'Admin action failed' }, { status: 500 });
  }
}
