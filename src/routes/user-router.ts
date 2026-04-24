import { Elysia, t } from 'elysia';
import { UserService } from '../services/user-services';

export const userRouter = new Elysia({ prefix: '/api' })
  .get('/users/current', async ({ headers, set }) => {
    const authHeader = headers['authorization'];
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      set.status = 401;
      return { message: 'unauthorized' };
    }

    const token = authHeader.substring(7);

    try {
      const user = await UserService.getCurrentUser(token);
      return user;
    } catch (error: any) {
      set.status = 401;
      return { message: 'unauthorized' };
    }
  }, {
    response: {
      200: t.Object({
        id: t.Number(),
        name: t.String(),
        email: t.String(),
        createdAt: t.Any(),
        updatedAt: t.Any(),
      }),
      401: t.Object({
        message: t.String(),
      }),
    },
    detail: {
      summary: 'Get current logged in user',
      tags: ['User'],
      security: [{ BearerAuth: [] }],
    },
  })
  .delete('/users/logout', async ({ headers, set }) => {
    const authHeader = headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      set.status = 401;
      return { message: 'unauthorized' };
    }

    const token = authHeader.substring(7);

    try {
      await UserService.logoutUser(token);
      return { data: 'OK' };
    } catch (error: any) {
      set.status = 401;
      return { message: 'unauthorized' };
    }
  }, {
    response: {
      200: t.Object({
        data: t.String(),
      }),
      401: t.Object({
        message: t.String(),
      }),
    },
    detail: {
      summary: 'Logout user',
      tags: ['User'],
      security: [{ BearerAuth: [] }],
    },
  });
