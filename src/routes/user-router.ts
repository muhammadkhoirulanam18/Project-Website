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
  });
