import { Platform } from 'react-native';

// In Android emulator, localhost is 10.0.2.2. On iOS or Web, localhost is localhost.
export const BASE_URL =
  Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';

class ApiClient {
  private cookie: string = '';

  setCookie(cookie: string) {
    this.cookie = cookie;
  }

  getCookie(): string {
    return this.cookie;
  }

  async request(path: string, options: RequestInit = {}): Promise<any> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.cookie) {
      headers['Cookie'] = this.cookie;
    }

    const url = `${BASE_URL}${path}`;
    const res = await fetch(url, {
      ...options,
      headers,
    });

    const setCookie = res.headers.get('set-cookie');
    if (setCookie) {
      this.cookie = setCookie.split(';')[0];
    }

    try {
      return await res.json();
    } catch (e) {
      return { ok: res.ok, status: res.status };
    }
  }

  // Auth
  async getMe() {
    return this.request('/api/auth/me');
  }

  async login(email: string, pass: string) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password: pass }),
    });
  }

  async switchDemo(userId: string) {
    return this.request('/api/auth/switch-demo', {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  }

  // Dating
  async getDiscover() {
    return this.request('/api/dating/discover');
  }

  async swipe(receiverId: string, type: 'LIKE' | 'PASS' | 'SUPER_LIKE') {
    return this.request('/api/dating/swipe', {
      method: 'POST',
      body: JSON.stringify({ receiverId, type }),
    });
  }

  // Matchmaking
  async searchMatchmaking(query: string) {
    return this.request('/api/matchmaking/search', {
      method: 'POST',
      body: JSON.stringify({ query }),
    });
  }

  // Blind Matchmaking
  async getBlindMatches() {
    return this.request('/api/blind/matches');
  }

  async createBlindMatch() {
    return this.request('/api/blind/matches', { method: 'POST' });
  }

  async submitQuiz(answers: Record<string, string>) {
    return this.request('/api/blind/quiz', {
      method: 'POST',
      body: JSON.stringify({ answers }),
    });
  }

  async consentReveal(matchId: string) {
    return this.request('/api/blind/reveal', {
      method: 'POST',
      body: JSON.stringify({ matchId }),
    });
  }

  // Chat
  async getMessages(matchId: string) {
    return this.request(`/api/chat/messages?matchId=${matchId}`);
  }

  async sendMessage(matchId: string, content: string, conversationType = 'DIRECT_MATCH') {
    return this.request('/api/chat/messages', {
      method: 'POST',
      body: JSON.stringify({ matchId, content, conversationType }),
    });
  }

  // Payments / VIP
  async checkout(plan: 'GOLD' | 'PLATINUM', interval = 'MONTHLY') {
    return this.request('/api/payment/checkout', {
      method: 'POST',
      body: JSON.stringify({ plan, interval, paymentMethod: 'Test Card (•••• 4242)' }),
    });
  }
}

export const api = new ApiClient();
