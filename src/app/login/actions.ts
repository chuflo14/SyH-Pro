'use server'

import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}

async function getAuthCallbackUrl(nextPath: string) {
    const headersList = await headers()

    let origin = headersList.get('origin')

    if (!origin) {
        const forwardedHost = headersList.get('x-forwarded-host')
        const host = forwardedHost ?? headersList.get('host')
        const protocol = headersList.get('x-forwarded-proto') ?? 'http'

        if (host) {
            origin = `${protocol}://${host}`
        }
    }

    const baseUrl = origin ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
    return new URL(`/auth/callback?next=${encodeURIComponent(nextPath)}`, baseUrl).toString()
}

async function signInWithOAuthProvider(provider: 'google' | 'apple') {
    const supabase = await createClient()
    const redirectTo = await getAuthCallbackUrl('/dashboard')

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo },
    })

    if (error) {
        return { error: error.message }
    }

    if (!data.url) {
        return { error: 'No se pudo iniciar la autenticación social.' }
    }

    redirect(data.url)
}

export async function signInWithGoogle() {
    return signInWithOAuthProvider('google')
}

export async function signInWithApple() {
    return signInWithOAuthProvider('apple')
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        options: {
            data: {
                full_name: formData.get('fullName') as string,
                role: 'consultant',
            }
        }
    }

    const { error } = await supabase.auth.signUp(data)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}
