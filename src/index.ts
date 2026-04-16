import { Elysia } from 'elysia';
import { db } from './db';
import { users } from './db/schema';

const app = new Elysia()
  .get('/', () => ({
    message: 'Welcome to Elysia + Drizzle + MySQL!',
    status: 'online'
  }))
  .get('/users', async () => {
    try {
      const allUsers = await db.select().from(users);
      return allUsers;
    } catch (error) {
      return { error: 'Failed to fetch users', details: error };
    }
  })
  .post('/users', async ({ body }: { body: any }) => {
    try {
      const newUser = await db.insert(users).values({
        name: body.name,
        email: body.email,
        bio: body.bio
      });
      return { message: 'User created successfully', user: newUser };
    } catch (error) {
      return { error: 'Failed to create user', details: error };
    }
  })
  .listen(process.env.PORT || 3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
