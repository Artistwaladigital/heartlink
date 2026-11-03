import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const reports = db.getAllReports();
    return NextResponse.json({ reports });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { reportId, action } = await req.json();

    if (!reportId || !action) {
      return NextResponse.json({ error: 'Report ID and action required' }, { status: 400 });
    }

    const reports = db.getAllReports();
    const report = reports.find((r) => r.id === reportId);
    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    if (action === 'DISMISS') {
      db.updateReport(reportId, { status: 'DISMISSED' });
    } else if (action === 'WARN') {
      db.updateReport(reportId, { status: 'RESOLVED_WARNED' });
    } else if (action === 'BAN_USER') {
      db.updateReport(reportId, { status: 'RESOLVED_BANNED' });
      db.updateUser(report.reportedUserId, { status: 'BANNED' });
    }

    return NextResponse.json({ success: true, message: `Report updated to ${action}` });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to update report' }, { status: 500 });
  }
}
