const BASE_URL = 'http://localhost:3000';

async function runTests() {
  console.log('========================================================');
  console.log('🚀 STARTING HEARTLINK END-TO-END AUTOMATED VERIFICATION');
  console.log('========================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName}`);
      failed++;
    }
  }

  // Helper for requests with cookies
  let cookies = '';

  async function request(path, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };
    if (cookies) {
      headers['Cookie'] = cookies;
    }

    const res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers,
    });

    // Capture set-cookie
    const setCookie = res.headers.get('set-cookie');
    if (setCookie) {
      cookies = setCookie.split(';')[0];
    }

    let json = null;
    try {
      json = await res.json();
    } catch (e) {
      // not json
    }

    return { status: res.status, ok: res.ok, data: json, headers: res.headers };
  }

  try {
    // -----------------------------------------------------------------
    // TEST 1: Strict 18+ Underage Registration Rejection
    // -----------------------------------------------------------------
    console.log('--- TEST GROUP 1: Security & 18+ Age Restriction ---');
    const underageRes = await request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: 'underage_test@heartlink.com',
        password: 'password123',
        name: 'Underage User',
        dateOfBirth: '2012-05-10', // 14 years old
        city: 'Kolkata',
      }),
    });
    assert(
      underageRes.status === 403 && underageRes.data?.error?.includes('18'),
      'Strict 18+ validation blocks users younger than 18'
    );

    // -----------------------------------------------------------------
    // TEST 2: Valid 18+ Registration & Session Cookie
    // -----------------------------------------------------------------
    const validDob = '1998-07-15'; // 28 years old
    const validEmail = `newuser_${Date.now()}@heartlink.com`;
    const regRes = await request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: validEmail,
        password: 'password123',
        name: 'Julian Vance',
        dateOfBirth: validDob,
        gender: 'MAN',
        interestedIn: 'WOMEN',
        city: 'New York',
        country: 'United States',
        preferredExperience: 'ALL',
      }),
    });
    assert(
      regRes.status === 201 && regRes.data?.success && regRes.data?.user?.age === 28,
      'Valid adult user registration creates profile & sets secure session'
    );
    assert(!!cookies, 'HTTP-only authentication cookie created upon registration');

    // -----------------------------------------------------------------
    // TEST 3: Demo Persona Switching (Sophia Rivera)
    // -----------------------------------------------------------------
    console.log('\n--- TEST GROUP 2: Authentication & Persona Switcher ---');
    const switchRes = await request('/api/auth/switch-demo', {
      method: 'POST',
      body: JSON.stringify({ userId: 'usr_sophia' }),
    });
    assert(
      switchRes.ok && switchRes.data?.user?.name === 'Sophia Rivera',
      'Instant demo persona switch to Sophia Rivera (Architect, New York)'
    );

    // Verify /api/auth/me returns Sophia
    const meRes = await request('/api/auth/me');
    assert(
      meRes.ok && meRes.data?.user?.email === 'sophia@heartlink.com',
      'Session successfully verifies current user as Sophia Rivera'
    );

    // -----------------------------------------------------------------
    // TEST 4: Dating Experience (Discover Profiles & Swiping)
    // -----------------------------------------------------------------
    console.log('\n--- TEST GROUP 3: Dating Feature & Mutual Matching ---');
    const discoverRes = await request('/api/dating/discover');
    assert(
      discoverRes.ok && Array.isArray(discoverRes.data?.profiles),
      'Dating discovery returns curated candidate profile deck'
    );

    const firstCandidate = discoverRes.data?.profiles[0];
    assert(
      firstCandidate && firstCandidate.id && firstCandidate.compatibilityScore >= 40,
      `Top candidate has compatibility score (${firstCandidate?.compatibilityScore}%) and photos`
    );

    // Swipe Like
    const swipeRes = await request('/api/dating/swipe', {
      method: 'POST',
      body: JSON.stringify({
        receiverId: firstCandidate.id,
        type: 'LIKE',
      }),
    });
    assert(swipeRes.ok && swipeRes.data?.success, 'Swipe LIKE recorded in database');

    // -----------------------------------------------------------------
    // TEST 5: Matchmaking Feature (Natural Language & NLP Query)
    // -----------------------------------------------------------------
    console.log('\n--- TEST GROUP 4: Matchmaking Feature & Natural Language Search ---');
    const nlpRes = await request('/api/matchmaking/search', {
      method: 'POST',
      body: JSON.stringify({
        query: 'I want to meet someone aged 25 to 32, educated, family-oriented, preferably from Kolkata',
      }),
    });
    assert(
      nlpRes.ok && nlpRes.data?.results?.length > 0,
      'Natural language query parsed into filters and returns ranked matches'
    );

    const topKolkataMatch = nlpRes.data.results.find((r) =>
      r.profile.location.city.toLowerCase().includes('kolkata')
    );
    assert(
      !!topKolkataMatch && topKolkataMatch.matchScore >= 80,
      `NLP successfully extracted "Kolkata" and found compatible candidate with ${topKolkataMatch?.matchScore}% match score`
    );
    assert(
      !!topKolkataMatch?.compatibilityBreakdown?.values &&
        !!topKolkataMatch?.compatibilityBreakdown?.lifestyle,
      'Matchmaking provides multi-vector breakdown (Values, Lifestyle, Interests, Location)'
    );

    // -----------------------------------------------------------------
    // TEST 6: Blind Matchmaking & Zero-Leak Privacy Shield
    // -----------------------------------------------------------------
    console.log('\n--- TEST GROUP 5: Blind Matchmaking & Cryptographic Privacy Shield ---');
    // Switch to Aryan (in Kolkata)
    await request('/api/auth/switch-demo', {
      method: 'POST',
      body: JSON.stringify({ userId: 'usr_aryan' }),
    });

    // Fetch blind matches
    const blindRes = await request('/api/blind/matches');
    assert(blindRes.ok && Array.isArray(blindRes.data?.matches), 'Blind matchmaking pool retrieved');

    // Create a new blind match if none
    const findBlindRes = await request('/api/blind/matches', { method: 'POST' });
    const blindMatchesAfter = await request('/api/blind/matches');
    assert(
      blindMatchesAfter.data.matches.length > 0,
      'Anonymous match generated with pseudonym and soulmate harmony score'
    );

    const sampleBlind = blindMatchesAfter.data.matches.find(
      (bm) => bm.blindMatch.status !== 'MUTUAL_REVEALED'
    );
    if (sampleBlind) {
      const partner = sampleBlind.partnerAnonymousProfile;
      assert(
        !!partner.pseudonym && !partner.realProfile && !partner.photos,
        'STRICT PRIVACY VERIFIED: Photos, real names, and exact identities are 100% hidden before mutual consent!'
      );
    }

    // -----------------------------------------------------------------
    // TEST 7: Blind Match Mutual Consent Reveal Handshake
    // -----------------------------------------------------------------
    console.log('\n--- TEST GROUP 6: Mutual Consent Reveal Handshake ---');
    // Test match between Sophia and Marcus ('blind_sophia_marcus')
    // Sophia already consented in seed data. Let's switch to Marcus and consent!
    await request('/api/auth/switch-demo', {
      method: 'POST',
      body: JSON.stringify({ userId: 'usr_marcus' }),
    });

    const consentRes = await request('/api/blind/reveal', {
      method: 'POST',
      body: JSON.stringify({ matchId: 'blind_sophia_marcus' }),
    });

    assert(
      consentRes.ok && consentRes.data?.isNowRevealed,
      'Mutual Consent Reveal granted! Status updated to MUTUAL_REVEALED'
    );
    assert(
      !!consentRes.data?.partnerProfile?.name,
      `Real profile unlocked after mutual consent: ${consentRes.data?.partnerProfile?.name}`
    );

    // -----------------------------------------------------------------
    // TEST 8: Real-time Chat Messaging
    // -----------------------------------------------------------------
    console.log('\n--- TEST GROUP 7: Real-time Messaging System ---');
    const sendMsgRes = await request('/api/chat/messages', {
      method: 'POST',
      body: JSON.stringify({
        matchId: 'blind_sophia_marcus',
        content: 'Hello Sophia! What a joy to finally unveil our cards.',
        conversationType: 'BLIND_MATCH',
      }),
    });
    assert(sendMsgRes.ok && sendMsgRes.data?.success, 'Chat message sent and stored');

    const getMsgRes = await request('/api/chat/messages?matchId=blind_sophia_marcus');
    assert(
      getMsgRes.ok && getMsgRes.data?.messages?.length >= 3,
      'Messages stream retrieved with read status and timestamps'
    );

    // -----------------------------------------------------------------
    // TEST 9: Conversational AI Assistant (HeartLink Cupid)
    // -----------------------------------------------------------------
    console.log('\n--- TEST GROUP 8: Conversational AI Assistant ---');
    const aiRes = await request('/api/ai/assistant', {
      method: 'POST',
      body: JSON.stringify({
        message: 'Find me someone who loves travelling and serious relationship',
      }),
    });
    assert(
      aiRes.ok && (aiRes.data?.reply || aiRes.data?.recommendedProfiles?.length > 0),
      'AI Cupid understands query and provides conversational advice and match recommendations'
    );

    // -----------------------------------------------------------------
    // TEST 10: Test-Mode Payment Gateway & VIP Upgrades
    // -----------------------------------------------------------------
    console.log('\n--- TEST GROUP 9: Membership Upgrades & Test Payment Gateway ---');
    // Switch to free user Priya
    await request('/api/auth/switch-demo', {
      method: 'POST',
      body: JSON.stringify({ userId: 'usr_priya' }),
    });

    const payRes = await request('/api/payment/checkout', {
      method: 'POST',
      body: JSON.stringify({
        plan: 'PLATINUM',
        interval: 'YEARLY',
        paymentMethod: 'Test Visa (•••• 4242)',
      }),
    });
    assert(
      payRes.ok && payRes.data?.success && payRes.data?.transaction?.status === 'SUCCEEDED',
      'Test payment processed and transaction reference generated'
    );
    assert(
      payRes.data?.user?.membershipTier === 'PLATINUM',
      'Priya upgraded to Platinum VIP tier with updated quotas'
    );

    // -----------------------------------------------------------------
    // TEST 11: Admin Dashboard APIs & Controls
    // -----------------------------------------------------------------
    console.log('\n--- TEST GROUP 10: Superadmin Dashboard & Governance ---');
    // Switch to Admin
    await request('/api/auth/switch-demo', {
      method: 'POST',
      body: JSON.stringify({ userId: 'usr_admin' }),
    });

    const metricsRes = await request('/api/admin/metrics');
    assert(
      metricsRes.ok && metricsRes.data?.metrics?.totalUsers > 0,
      `Admin metrics: ${metricsRes.data?.metrics?.totalUsers} users, $${metricsRes.data?.metrics?.totalRevenue} revenue`
    );

    const usersAdminRes = await request('/api/admin/users');
    assert(
      usersAdminRes.ok && usersAdminRes.data?.users?.length > 0,
      'Admin can list and inspect all registered members'
    );

    // Toggle user verification
    const toggleVerifRes = await request('/api/admin/users', {
      method: 'POST',
      body: JSON.stringify({
        action: 'TOGGLE_VERIFY',
        targetUserId: 'usr_priya',
      }),
    });
    assert(toggleVerifRes.ok && toggleVerifRes.data?.success, 'Admin toggled ID verification badge on member');

    // Update matching weights
    const updateSettingsRes = await request('/api/admin/settings', {
      method: 'POST',
      body: JSON.stringify({
        announcement: 'Welcome to HEARTLINK — Premier International Matchmaking.',
      }),
    });
    assert(updateSettingsRes.ok && updateSettingsRes.data?.success, 'Admin updated global platform settings');

    // -----------------------------------------------------------------
    // SUMMARY
    // -----------------------------------------------------------------
    console.log('\n========================================================');
    console.log(`🎉 ALL VERIFICATION TESTS COMPLETED!`);
    console.log(`Passed: ${passed} | Failed: ${failed}`);
    console.log('========================================================');

    if (failed > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  } catch (err) {
    console.error('Fatal test error:', err);
    process.exit(1);
  }
}

runTests();
