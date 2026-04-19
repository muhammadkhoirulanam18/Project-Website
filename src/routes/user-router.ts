import { Elysia, t } from 'elysia';
import { UserService } from '../services/user-services';

export const userRouter = new Elysia({ prefix: '/api' })
  .post('/users', async ({ body, set }) => {
    try {
      const newUser = await UserService.registerUser(body);
      
      return {
        success: true,
        message: 'User created successfully',
        data: newUser,
      };
    } catch (error: any) {
      if (error.message === 'Email sudah terdaftar') {
        set.status = 400;
        return { message: error.message };
      }
      
      set.status = 500;
      return { message: 'Internal Server Error' };
    }
  }, {
    body: t.Object({
      name: t.String(),
      email: t.String({ format: 'email' }),
      password: t.String(),
    })
  });
