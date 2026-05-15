import { z } from 'zod'

export const loginSchema = z.object({
  identifier: z.string().min(1, 'Email is required').email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const registerSchema = z
  .object({
    firstName: z.string().min(2, 'First name is required'),
    lastName: z.string().min(2, 'Last name is required'),
    email: z.string().email('Enter a valid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    phone: z.string().optional(),
    institution: z.string().min(2, 'Institution is required'),
    country: z.string().min(2, 'Country is required'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export const forgotPasswordSchema = z.object({
  email: z.string().email('Enter a valid email'),
})

export const resetPasswordSchema = z
  .object({
    code: z.string().min(1, 'Reset code is required'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export const abstractSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters').max(200, 'Title too long'),
  abstractText: z
    .string()
    .min(150, 'Abstract must be at least 150 characters')
    .max(3000, 'Abstract must be under 3000 characters'),
  keywords: z.string().min(3, 'Enter at least one keyword'),
  conference: z.number({ message: 'Select a conference' }).positive(),
  presentationType: z.enum(['oral', 'poster', 'workshop', 'virtual'], 'Select a presentation type'),
  subtheme: z.string().optional(),
  coAuthors: z.string().optional(),
  institution: z.string().optional(),
})

export const reviewSchema = z.object({
  score: z.number().int().min(1, 'Score must be 1–10').max(10, 'Score must be 1–10'),
  comments: z.string().min(20, 'Please provide at least 20 characters of feedback'),
  recommendation: z.enum(['accept', 'reject', 'revise'], 'Select a recommendation'),
})

export const registrationSchema = z.object({
  registrationType: z.enum(['in-person', 'virtual', 'hybrid']),
  ticketCategory: z.enum(['standard', 'student', 'early-bird', 'vip']),
})

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    password: z.string().min(8, 'New password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export const profileSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  phone: z.string().optional(),
  institution: z.string().min(2, 'Institution is required'),
  country: z.string().min(2, 'Country is required'),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
export type AbstractInput = z.infer<typeof abstractSchema>
export type ReviewInput = z.infer<typeof reviewSchema>
export type RegistrationInput = z.infer<typeof registrationSchema>
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>
export type ProfileInput = z.infer<typeof profileSchema>
