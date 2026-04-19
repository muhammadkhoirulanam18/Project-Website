import { Elysia, t } from 'elysia';
import { AuthService } from '../services/auth-services';
import { UserService } from '../services/user-services';

export const authRouter = new Elysia({ prefix: '/auth' })
  .post('/register', async ({ body, set }) => {
    try {
      const newUser = await UserService.registerUser(body);
      return {
        success: true,
        message: 'User created successfully',
        data: newUser,
      };
    } catch (error: any) {
      set.status = 400;
      return { message: error.message };
    }
  }, {
    body: t.Object({
      name: t.String(),
      email: t.String({ format: 'email' }),
      password: t.String(),
    })
  })
  .post('/users/login', async ({ body, set }) => {
    try {
      const token = await AuthService.loginUser(body);
      return {
        data: token
      };
    } catch (error: any) {
      set.status = 401;
      return {
        error: error.message
      };
    }
  }, {
    body: t.Object({
      email: t.String({ format: 'email' }),
      password: t.String(),
    })
  });
