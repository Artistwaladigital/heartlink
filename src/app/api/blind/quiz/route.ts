import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { generateRandomPseudonym } from '@/lib/quiz-data';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { answers } = await req.json();
    if (!answers || typeof answers !== 'object') {
      return NextResponse.json({ error: 'Quiz answers are required' }, { status: 400 });
    }

    let pseudonym = user.blindProfile.pseudonym;
    let avatarIcon = user.blindProfile.avatarIcon;
    let colorTheme = user.blindProfile.colorTheme;

    if (!pseudonym) {
      const generated = generateRandomPseudonym();
      pseudonym = generated.pseudonym;
      avatarIcon = generated.avatarIcon;
      colorTheme = generated.colorTheme;
    }

    // Synthesize soulmate summary
    let soulmateSummary = 'Values genuine connection, thoughtful conversations, and mutual emotional respect.';
    if (answers.love_language === 'deep_conversations') {
      soulmateSummary = 'Seeks a soulmate who cherishes late-night deep conversations and undivided presence.';
    } else if (answers.ideal_saturday === 'active_adventure') {
      soulmateSummary = 'Desires an adventurous companion for weekend explorations and spontaneous laughter.';
    } else if (answers.life_vision_5yrs === 'family_home') {
      soulmateSummary = 'Ready to build a warm, loving home grounded in enduring family values.';
    }

    const updatedBlindProfile = {
      joinedPool: true,
      pseudonym,
      avatarIcon,
      colorTheme,
      quizAnswers: answers,
      soulmateSummary,
    };

    db.updateUser(user.id, {
      blindProfile: updatedBlindProfile,
    });

    return NextResponse.json({
      success: true,
      message: 'Personality quiz completed! You are now in the Blind Matchmaking pool.',
      blindProfile: updatedBlindProfile,
    });
  } catch (err: any) {
    console.error('Quiz submit error:', err);
    return NextResponse.json({ error: 'Failed to save quiz answers' }, { status: 500 });
  }
}
