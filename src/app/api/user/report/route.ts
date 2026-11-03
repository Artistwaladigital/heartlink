import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { UserReport } from '@/types';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { reportedUserId, reason, details, context, blockUser } = await req.json();

    if (!reportedUserId || !reason) {
      return NextResponse.json({ error: 'Reported user ID and reason are required' }, { status: 400 });
    }

    const report: UserReport = {
      id: `rep_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      reporterId: user.id,
      reportedUserId,
      context: context || 'PROFILE',
      reason,
      details: details || '',
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };

    db.createReport(report);

    if (blockUser) {
      db.blockUser(user.id, reportedUserId);
    }

    return NextResponse.json({
      success: true,
      message: 'Report submitted. Our safety team will review it immediately.',
      reportId: report.id,
    });
  } catch (err: any) {
    console.error('Report user error:', err);
    return NextResponse.json({ error: 'Failed to submit report' }, { status: 500 });
  }
}
