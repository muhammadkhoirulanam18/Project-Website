import { Elysia } from 'elysia';
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
  })
  .delete('/users/logout', async ({ headers, set }) => {
    const authHeader = headers['authorization'];

    if (!authHeader) {
      set.status = 401;
      return { message: 'unauthorized' };
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
      set.status = 401;
      return { message: 'unauthorized' };
    }

    const token = parts[1];

    try {
      await UserService.logoutUser(token);
      return { data: 'OK' };
    } catch (error: any) {
      if (error.message === 'unauthorized') {
        set.status = 401;
        return { message: 'unauthorized' };
      }
      set.status = 500;
      return { message: 'Internal Server Error' };
    }
  });
