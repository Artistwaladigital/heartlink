import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { PaymentTransaction } from '@/types';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { plan, interval, paymentMethod } = await req.json();

    if (!plan || !['GOLD', 'PLATINUM'].includes(plan)) {
      return NextResponse.json({ error: 'Invalid plan selected' }, { status: 400 });
    }

    const settings = db.getAdminSettings();
    const prices = settings.prices;

    let amount = 29.99;
    if (plan === 'GOLD') {
      amount = interval === 'YEARLY' ? prices.goldYearly : prices.goldMonthly;
    } else if (plan === 'PLATINUM') {
      amount = interval === 'YEARLY' ? prices.platinumYearly : prices.platinumMonthly;
    }

    const transaction: PaymentTransaction = {
      id: `pay_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: user.id,
      plan,
      amount,
      currency: 'USD',
      interval: interval || 'MONTHLY',
      status: 'SUCCEEDED',
      paymentMethod: paymentMethod || 'Test Visa (•••• 4242)',
      transactionRef: `HL_TX_${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toISOString(),
    };

    db.createPayment(transaction);

    // Refresh user's quota immediately
    const tierFeatures = settings.tierFeatures[plan.toLowerCase() as 'gold' | 'platinum'];
    db.updateUser(user.id, {
      likesRemainingToday: tierFeatures.likesPerDay,
      superLikesRemainingToday: tierFeatures.superLikesPerDay,
    });

    const updatedUser = db.getUserById(user.id);
    const { passwordHash: _, ...publicUserData } = updatedUser!;

    return NextResponse.json({
      success: true,
      message: `Congratulations! Your account has been upgraded to ${plan} tier!`,
      transaction,
      user: publicUserData,
    });
  } catch (err: any) {
    console.error('Checkout error:', err);
    return NextResponse.json({ error: 'Payment processing failed' }, { status: 500 });
  }
}
