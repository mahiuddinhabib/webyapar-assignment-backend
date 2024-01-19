import { z } from 'zod';
import { userRole } from './user.constant';

const updateUserZodSchema = z.object({
  userId: z.string().optional(),
  name: z.string().optional(),
  role: z.enum([...userRole] as [string, ...string[]]).optional(),
  password: z.string().optional(),
  isProfileCompleted: z.boolean().optional(),
  isProfileUpdateRequested: z.boolean().optional(),
});

export const UserValidation = {
  updateUserZodSchema,
};
