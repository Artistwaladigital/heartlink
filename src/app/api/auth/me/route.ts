import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const user = await getCurrentUser();
    const allUsers = db.getAllUsers();

    // Prepare demo switcher accounts
    const demoAccounts = allUsers.map((u) => ({
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role,
      membershipTier: u.membershipTier,
      city: u.location.city,
      age: u.age,
      avatar: u.photos[0],
      preferredExperience: u.preferredExperience,
    }));

    if (!user) {
      return NextResponse.json({
        user: null,
        demoAccounts,
      });
    }

    const { passwordHash: _, ...publicUserData } = user;

    // Counts for dashboard badges
    const matches = db.getMatchesForUser(user.id);
    const blindMatches = db.getBlindMatchesForUser(user.id);
    const likesReceived = db.getLikesReceived(user.id);

    return NextResponse.json({
      user: publicUserData,
      metrics: {
        matchesCount: matches.length,
        blindMatchesCount: blindMatches.length,
        likesReceivedCount: likesReceived.length,
      },
      demoAccounts,
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch current user' }, { status: 500 });
  }
}
