import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { userRouter } from './src/routes/user-router';
import { authRouter } from './src/routes/auth-routes';
import { UserService } from './src/services/user-services';

export const app = new Elysia()
  .use(swagger({
    path: '/swagger',
    documentation: {
      info: {
        title: 'Project Web API Documentation',
        version: '1.0.0',
        description: 'Dokumentasi interaktif untuk REST API Project Web'
      }
    }
  }))
  .get('/', () => 'Hello Elysia')
  .use(userRouter)
  .use(authRouter)
  .get('/users', async () => {
    return await UserService.getAllUsers();
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);