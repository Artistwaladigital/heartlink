import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { User, PublicProfile } from '@/types';
import { db } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'heartlink-ultra-secure-jwt-secret-key-2026';
const COOKIE_NAME = 'heartlink_token';

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export function createToken(user: User): string {
  const payload: TokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (err) {
    return null;
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const payload = verifyToken(token);
    if (!payload?.userId) return null;

    const user = db.getUserById(payload.userId);
    if (!user || user.status === 'BANNED') return null;

    return user;
  } catch (err) {
    return null;
  }
}

export function getPublicProfile(user: User): PublicProfile {
  const { passwordHash, email, privacy, ...publicData } = user;
  return publicData;
}

export { COOKIE_NAME };
