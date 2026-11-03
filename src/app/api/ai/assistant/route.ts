import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { searchProfilesWithNaturalLanguage } from '@/lib/matching';
import { PublicProfile } from '@/types';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { message } = await req.json();
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const lower = message.toLowerCase().trim();

    // Check if this is a search intent (e.g. "Find me...", "Looking for...", "Search for...", or contains age/city)
    const isSearchIntent =
      lower.includes('find') ||
      lower.includes('looking for') ||
      lower.includes('search') ||
      lower.includes('someone') ||
      lower.includes('kolkata') ||
      lower.includes('new york') ||
      lower.includes('london') ||
      lower.includes('mumbai') ||
      lower.includes('travel') ||
      lower.includes('marriage') ||
      lower.includes('serious');

    // 1. Blind matchmaking guidance intent
    if (lower.includes('blind') || lower.includes('anonymous')) {
      return NextResponse.json({
        reply: `Blind Matchmaking is HEARTLINK's signature experience! 💫 In the Blind Pool, your photographs and real identity remain 100% anonymous. We match you purely on values, emotional depth, and personality harmony through an 8-question soulmate quiz.\n\nYou can chat anonymously, and when both of you feel a mutual spark, simply tap "Request Reveal" to unveil each other's profiles!`,
        actionSuggestion: {
          label: 'Go to Blind Matchmaking',
          href: '/blind',
        },
      });
    }

    // 2. Profile improvement advice
    if (lower.includes('bio') || lower.includes('profile') || lower.includes('improve')) {
      const tips: string[] = [];
      if (user.bio.length < 50) {
        tips.push('• Expand your bio: Add a specific story or detail that shows your unique humor and everyday rituals.');
      }
      if (user.interests.length < 4) {
        tips.push('• Add more passions: Adding 5+ interests boosts your compatibility scoring accuracy by 35%.');
      }
      if (!user.lifestyle.pets) {
        tips.push('• Mention your pets or dream home vibes in your lifestyle settings.');
      }
      tips.push('• Pro-tip: Authentic vulnerability always attracts more genuine matches than generic lists.');

      return NextResponse.json({
        reply: `Here are personalized recommendations to elevate your HeartLink presence:\n\n${tips.join('\n')}`,
        actionSuggestion: {
          label: 'Edit My Profile',
          href: '/profile',
        },
      });
    }

    // 3. Date ideas & Icebreaker generation
    if (lower.includes('icebreaker') || lower.includes('date idea') || lower.includes('what to say')) {
      return NextResponse.json({
        reply: `Here are 3 thoughtful, high-engagement opening lines tailored to deep connection:\n\n1. *"I noticed you love acoustic music and design — if you could score the soundtrack to your ideal Sunday, what would track 1 be?"*\n2. *"Honest question: Are you team spontaneous weekend getaway or team meticulously researched itinerary?"*\n3. *"What is something you are passionately curious about right now that most people don't ask you about?"*`,
      });
    }

    // 4. Search intent: Find candidate profiles
    if (isSearchIntent) {
      const matchResults = searchProfilesWithNaturalLanguage(user, message);
      const topPicks = matchResults.slice(0, 3).map((r) => {
        const { passwordHash: _, email: __, privacy: ___, ...pub } = r.user;
        return {
          profile: pub as PublicProfile,
          matchScore: r.matchScore,
          matchReasons: r.matchReasons,
        };
      });

      if (topPicks.length > 0) {
        const names = topPicks.map((p) => `${p.profile.name} (${p.profile.age}, ${p.profile.location.city} — ${p.matchScore}% Match)`).join(', ');
        return NextResponse.json({
          reply: `I analyzed your preferences: "${message}". I found ${matchResults.length} compatible candidates on HeartLink! Top matches: ${names}. Check out their profiles below:`,
          recommendedProfiles: topPicks,
          actionSuggestion: {
            label: 'Open Matchmaker',
            href: '/matchmaking',
          },
        });
      }
    }

    // Default conversational AI response
    return NextResponse.json({
      reply: `Hello ${user.name}! I am HeartLink Cupid, your AI Matchmaking Concierge. I can help you find compatible partners using natural language, give personalized dating advice, or guide you through our Blind Matchmaking experience.\n\nTry asking me:\n• "Find me someone aged 25 to 30 from Kolkata who wants a serious relationship"\n• "Find an architect or creative mind in New York"\n• "How do I join Blind Matchmaking?"\n• "Give me an icebreaker for my new match"`,
    });
  } catch (err: any) {
    console.error('AI Assistant error:', err);
    return NextResponse.json({ error: 'AI Assistant failed' }, { status: 500 });
  }
}
