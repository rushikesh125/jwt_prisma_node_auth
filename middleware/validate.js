import { z } from 'zod';

// Define Zod schemas for validation
const registerSchema = z.object({
  email: z.string().email({ message: 'Valid email required' }).trim(),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(/\d/, { message: 'Password must contain a number' })
    .regex(/[a-z]/, { message: 'Password must contain a lowercase letter' })
    .regex(/[A-Z]/, { message: 'Password must contain an uppercase letter' }),
});

const loginSchema = z.object({
  email: z.string().email({ message: 'Valid email required' }).trim(),
  password: z.string().min(1, { message: 'Password required' }),
});

// Middleware to validate using Zod with safe parsing
const validateZod = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body); // Use safeParse for better error handling
  if (!result.success) {
    return res.status(400).json({
      errors: result.error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      })),
    });
  }
  next();
};

// Export validation middlewares
export const validateRegister = validateZod(registerSchema);
export const validateLogin = validateZod(loginSchema);