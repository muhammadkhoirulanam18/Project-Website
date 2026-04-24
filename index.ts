import { Elysia, t } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { userRouter } from './src/routes/user-router';
import { authRouter } from './src/routes/auth-routes';
import { UserService } from './src/services/user-services';

export const app = new Elysia()
  .get('/', () => 'Hello Elysia')
  .use(userRouter)
  .use(authRouter)
  .get('/users', async () => {
    return await UserService.getAllUsers();
  })
  .use(swagger({
    path: '/swagger',
    documentation: {
      info: {
        title: 'Project Web API Documentation',
        version: '1.0.0',
        description: 'Dokumentasi interaktif untuk REST API Project Web'
      },
      components: {
        securitySchemes: {
          BearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
          }
        }
      }
    }
  }))
  .listen(3006);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);