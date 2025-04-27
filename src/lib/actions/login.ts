'use server';

import { signIn } from '@/auth';
import { redirect } from 'next/navigation';
import * as z from 'zod';

const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

export async function loginAction(formData: FormData) {
    const validatedFields = formSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
    });

    if (!validatedFields.success) {
        return { error: 'Email atau password tidak valid.' };
    }

    const { email, password } = validatedFields.data;

    const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
    });

    if (result?.error) {
        return { error: 'Login gagal. Email atau password salah.' };
    }

    // Login berhasil, redirect ke dashboard
    redirect('/dashboard');
}
