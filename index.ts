import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { userRouter } from './src/routes/user-router';
import { authRouter } from './src/routes/auth-routes';
import { UserService } from './src/services/user-services';

export const app = new Elysia()
  .use(swagger())
  .get('/', () => 'Hello Elysia')
  .use(userRouter)
  .use(authRouter)
  .get('/users', async () => {
    return await UserService.getAllUsers();
  })
  .listen(3005);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);