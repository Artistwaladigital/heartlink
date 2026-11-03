import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { createToken, COOKIE_NAME } from '@/lib/auth';
import { User } from '@/types';
import { generateRandomPseudonym } from '@/lib/quiz-data';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name, dateOfBirth, gender, interestedIn, city, country, preferredExperience } = body;

    if (!email || !password || !name || !dateOfBirth) {
      return NextResponse.json({ error: 'Missing required registration fields' }, { status: 400 });
    }

    // Strict 18+ verification
    const dob = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    if (age < 18) {
      return NextResponse.json(
        { error: 'Strict Age Restriction: HEARTLINK is strictly for adults aged 18 and above.' },
        { status: 403 }
      );
    }

    // Check existing email
    const existing = db.getUserByEmail(email);
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
    }

    const pseudo = generateRandomPseudonym();
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser: User = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      email,
      passwordHash,
      role: 'USER',
      membershipTier: 'FREE',
      membershipExpiresAt: null,
      verified: false,
      status: 'ACTIVE',
      name,
      age,
      dateOfBirth,
      gender: gender || 'OTHER',
      interestedIn: interestedIn || 'EVERYONE',
      preferredExperience: preferredExperience || 'ALL',
      location: {
        city: city || 'Global',
        country: country || 'International',
      },
      photos: [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      ],
      photoStatus: 'APPROVED',
      bio: `Hello! I am ${name}. Excited to meet authentic people on HeartLink.`,
      profession: 'Professional',
      education: 'University Graduate',
      interests: ['Travel', 'Art', 'Music', 'Reading', 'Coffee'],
      lifestyle: {
        smoking: 'NEVER',
        drinking: 'OCCASIONALLY',
        diet: 'OMNIVORE',
        exercise: 'FEW_TIMES_A_WEEK',
      },
      relationshipGoals: 'SERIOUS_RELATIONSHIP',
      personalityTraits: ['Warm', 'Curious', 'Honest'],
      preferences: {
        minAge: Math.max(18, age - 5),
        maxAge: age + 8,
        maxDistanceKm: 150,
        citiesPreferred: [city || 'Global'],
        relationshipGoals: ['SERIOUS_RELATIONSHIP', 'MARRIAGE'],
      },
      privacy: {
        showProfile: true,
        showAge: true,
        showDistance: true,
        incognitoMode: false,
      },
      blindProfile: {
        joinedPool: true,
        pseudonym: pseudo.pseudonym,
        avatarIcon: pseudo.avatarIcon,
        colorTheme: pseudo.colorTheme,
        quizAnswers: {},
      },
      likesRemainingToday: 15,
      superLikesRemainingToday: 1,
      lastActiveAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    db.createUser(newUser);
    const token = createToken(newUser);

    const { passwordHash: _, ...publicUserData } = newUser;
    const res = NextResponse.json({ success: true, user: publicUserData }, { status: 201 });
    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return res;
  } catch (err: any) {
    console.error('Registration error:', err);
    return NextResponse.json({ error: 'Internal server error during registration' }, { status: 500 });
  }
}
