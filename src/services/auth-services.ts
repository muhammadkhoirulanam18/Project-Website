import { eq } from 'drizzle-orm';
import { db } from '../db';
import { users, sessions } from '../db/schema';
import bcrypt from 'bcryptjs';

export class AuthService {
  static async loginUser(data: { email: string; password: string }) {
    // 1. Find user by email
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, data.email))
      .limit(1);

    if (!user) {
      throw new Error('Email atau password salah');
    }

    // 2. Verify password
    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Email atau password salah');
    }

    // 3. Generate UUID Token
    const token = crypto.randomUUID();

    // 4. Save session
    await db.insert(sessions).values({
      userId: user.id,
      token: token,
    });

    return token;
  }
}
