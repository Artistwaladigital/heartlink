# HEARTLINK — Premium International Dating & Matchmaking Platform

HEARTLINK is an adult-only (18+) international dating, compatibility matchmaking, and soul-first anonymous blind matchmaking platform built with Next.js, React, TypeScript, and Tailwind CSS.

---

## 🌟 The Three Main Pathways

### 1. 🌹 Modern Dating
- **Visual Card Deck & Grid Discovery**: Browse curated high-resolution portraits, lifestyle badges, and compatibility scores.
- **Swipe Gestures**: Like, Pass, and Super Like with keyboard shortcuts (`←`, `→`, `↑`).
- **Mutual Match Celebration**: Real-time mutual interest detection with confetti celebration modal.
- **Direct Messaging**: Instantly connect and chat with mutual matches.
- **Safety**: Built-in reporting and instant user blocking.

### 2. 💍 Compatibility Matchmaking
- **Natural Language Preference Search**: Type what you seek in everyday English (e.g. *"I want to meet someone aged 25 to 32, educated, family-oriented, preferably from Kolkata"*).
- **Multi-Vector Compatibility Scoring (0-100%)**:
  - Core Values & Relationship Intent (Marriage, Long-term, Family)
  - Lifestyle Synergy (Diet, Smoking, Drinking, Exercise)
  - Interests & Passion Overlap (Jaccard similarity)
  - Location & Age Harmony
- **Detailed Radar Breakdown**: Inspect why each candidate is compatible with you.

### 3. 🎭 Blind Matchmaking (Signature Feature)
- **Zero-Leak Cryptographic Privacy Shield**: Photos, real names, and exact identifying details are 100% hidden server-side from network requests, API responses, and the DOM until mutual consent.
- **8-Question Soulmate Quiz**: Explores lifestyle rhythm, conflict communication, love languages, and life trajectory.
- **Anonymous Archetypes**: Users are identified with poetic pseudonyms and glowing avatars (e.g. *Starlit Architect*, *Midnight Philosopher*, *Celestial Muse*).
- **Mutual Consent Reveal Handshake**: Chat anonymously. When both users click "Request Reveal", profiles unlock with a celebration and reveal real names and photographs.

---

## 🤖 Conversational AI Assistant (HeartLink Cupid)
- Accessible anytime from the top navigation bar.
- Natural text advice on improving your bio, generating witty icebreakers, and finding matches.
- Compatible out-of-the-box with built-in heuristic NLP, plus plug-and-play **Google Gemini API** support via `GEMINI_API_KEY`.

---

## 👑 Membership & Payments (Test Mode)
- **Free Tier**: 15 likes/day, 1 super like/day, 1 blind match/week.
- **Gold Tier ($29.99/mo or $199.99/yr)**: Unlimited likes, 5 super likes/day, 5 blind matches/week, advanced filters, read receipts.
- **Platinum VIP Tier ($59.99/mo or $399.99/yr)**: 3x Priority Discovery Deck Visibility, 20 super likes/day, unlimited blind matches, VIP Gold badge, unlimited AI Concierge.
- **Simulated Payment Gateway**: Instant test card checkout (`4242 •••• •••• 4242`) with receipt and invoice generation.

---

## 🛡️ Superadmin Control Center (`/admin`)
- **Executive Metrics**: Total users, active users, revenue, dating matches, marriage matches, blind matches, pending reports.
- **User Management**: Search, toggle ID verified badges, change status (`ACTIVE`, `SUSPENDED`, `BANNED`), upgrade tiers, or delete accounts.
- **Photo Moderation Queue**: Review and approve/flag profile portraits.
- **Safety Reports Queue**: Review reported chatrooms, issue warnings, dismiss, or ban offenders.
- **Algorithm & Pricing Control**: Live sliders to tune matching weights (Values, Location, Interests, Quiz) and update subscription prices.

---

## 🔑 Pre-Seeded Demo Accounts (1-Click Switcher)

You can switch between any demo user instantly using the **"Switch Demo Account"** button in the top navigation bar or login screen:

| Account | Role / Persona | Location | Key Characteristics |
|---|---|---|---|
| `admin@heartlink.com` | **Superadmin** (pass: `admin123`) | New York | Full access to `/admin` panel & metrics |
| `sophia@heartlink.com` | User (pass: `pass123`) | New York | Architect, 26, Dating & Blind Match active |
| `aryan@heartlink.com` | User (pass: `pass123`) | Kolkata | AI Founder, 29, Matchmaking & Marriage seeker |
| `ananya@heartlink.com` | User (pass: `pass123`) | Kolkata | Pediatric Surgeon, 28, 96% Match with Aryan |
| `marcus@heartlink.com` | User (pass: `pass123`) | London | Neuroscientist, 31, Blind match with Sophia |
| `elena@heartlink.com` | User (pass: `pass123`) | London | Concert Pianist, 28, Revealed Blind Match |
| `priya@heartlink.com` | User (pass: `pass123`) | Mumbai | Designer, 27, Dating seeker |
| `leo@heartlink.com` | User (pass: `pass123`) | San Francisco | Marine Biologist, 29, Direct match with Sophia |

---

## 🚀 Running the Project Locally

### 1. Requirements
- Node.js 18+ (tested up to Node 26)
- npm or pnpm

### 2. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build & Start
```bash
npm run build
npm start
```

### 4. Run Automated End-to-End Verification
```bash
node scripts/e2e-test.js
```
Executes 25 comprehensive automated tests verifying registration, 18+ gates, swipe mechanics, NLP searches, blind match privacy, reveals, messaging, test payments, and admin controls.

---

## 🌐 Deployment Instructions

### Deploy to Vercel (Recommended)
1. Push this repository to GitHub or GitLab.
2. Import the project into your [Vercel Dashboard](https://vercel.com).
3. Under Environment Variables, add:
   - `JWT_SECRET`: your secret random string (e.g. `heartlink-production-secret-2026`)
   - `GEMINI_API_KEY`: *(Optional)* Your Google Gemini API key
4. Click **Deploy**. Vercel will automatically build and deploy the Next.js App Router application.

### Deploy with Docker
```dockerfile
FROM node:20-alpine AS runner
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 🔒 Security & Privacy Guarantees
- **Strict 18+ Gate**: Live age calculation prevents underage signups.
- **Password Protection**: Salted password hashing with `bcryptjs`.
- **Zero Identity Leaks**: Server-side masking guarantees that blind matches never transmit photos or real names over the wire until both members consent.
- **Role-Based Access Control**: Route-level checks protect all admin endpoints (`/api/admin/*`).
