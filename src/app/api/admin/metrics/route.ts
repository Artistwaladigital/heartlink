import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const allUsers = db.getAllUsers();
    const allPayments = db.getAllPayments();
    const allReports = db.getAllReports();

    // Calculate metrics
    const totalUsers = allUsers.length;
    const activeUsers = allUsers.filter((u) => u.status === 'ACTIVE').length;
    const verifiedUsers = allUsers.filter((u) => u.verified).length;
    const suspendedUsers = allUsers.filter((u) => u.status === 'SUSPENDED' || u.status === 'BANNED').length;

    const totalRevenue = allPayments.reduce((sum, p) => (p.status === 'SUCCEEDED' ? sum + p.amount : sum), 0);

    const pendingReports = allReports.filter((r) => r.status === 'PENDING').length;

    // Photos pending review
    const pendingPhotos = allUsers.filter((u) => u.photoStatus === 'PENDING').length;

    // Matches
    const datingMatches = db.getAllUsers().reduce((acc, u) => acc + db.getMatchesForUser(u.id).filter(m => m.match.type === 'DATING').length, 0) / 2;
    const matchmakingMatches = db.getAllUsers().reduce((acc, u) => acc + db.getMatchesForUser(u.id).filter(m => m.match.type === 'MATCHMAKING').length, 0) / 2;
    const blindMatches = db.getAllUsers().reduce((acc, u) => acc + db.getBlindMatchesForUser(u.id).length, 0) / 2;

    return NextResponse.json({
      metrics: {
        totalUsers,
        activeUsers,
        verifiedUsers,
        suspendedUsers,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        pendingReports,
        pendingPhotos,
        datingMatches: Math.round(datingMatches),
        matchmakingMatches: Math.round(matchmakingMatches),
        blindMatches: Math.round(blindMatches),
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch admin metrics' }, { status: 500 });
  }
}
