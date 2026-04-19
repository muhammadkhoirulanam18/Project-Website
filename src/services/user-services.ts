import { eq } from 'drizzle-orm';
import { db } from '../db';
import { users, type NewUser } from '../db/schema';
import hash from 'bcryptjs';

export class UserService {
  static async registerUser(data: NewUser) {
    // 1. Check if email already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, data.email))
      .limit(1);

    if (existingUser.length > 0) {
      throw new Error('Email sudah terdaftar');
    }

    // 2. Hash password
    const hashedPassword = await hash.hash(data.password, 10);

    // 3. Save user
    const [result] = await db.insert(users).values({
      ...data,
      password: hashedPassword,
    });

    // 4. Return user data (without password)
    const newUser = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
      })
      .from(users)
      .where(eq(users.id, result.insertId))
      .limit(1);

    return newUser[0];
  }

  static async getAllUsers() {
    return await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      createdAt: users.createdAt
    }).from(users);
  }
}
