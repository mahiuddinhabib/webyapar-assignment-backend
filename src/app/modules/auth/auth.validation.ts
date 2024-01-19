import { z } from 'zod';
import { userRole } from '../user/user.constant';

const createUserZodSchema = z.object({
  body: z.object({
    userId: z.string({
      required_error: 'User ID is required',
    }),
    name: z.string().optional(),
    role: z.enum([...userRole] as [string, ...string[]]).optional(),
    password: z.string({
      required_error: 'Password is required',
    }),
    profileImg: z.string().optional(),
  }),
});

const loginZodSchema = z.object({
  body: z.object({
    userId: z.string({
      required_error: 'User ID is required',
    }),
    password: z.string({
      required_error: 'Password is required',
    }),
  }),
});

const refreshTokenZodSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'Refresh Token is required',
    }),
  }),
});

export const AuthValidation = {
  createUserZodSchema,
  loginZodSchema,
  refreshTokenZodSchema,
};
