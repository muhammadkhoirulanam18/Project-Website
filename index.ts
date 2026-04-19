import { Elysia } from 'elysia';
import { userRouter } from './src/routes/user-router';
import { UserService } from './src/services/user-services';

const app = new Elysia()
  .get('/', () => 'Hello Elysia')
  .use(userRouter)
  .get('/users', async () => {
    return await UserService.getAllUsers();
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);