'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { createClient } from '@/utils/supabase/client'
import { login, signup } from './actions'

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [oauthLoading, setOauthLoading] = useState<'google' | 'apple' | null>(null)

    async function onSubmit(formData: FormData) {
        setLoading(true)
        setError(null)

        const action = isLogin ? login : signup
        const result = await action(formData)

        if (result?.error) {
            setError(result.error)
        }

        setLoading(false)
    }

    async function onOAuthSubmit(provider: 'google' | 'apple') {
        setOauthLoading(provider)
        setError(null)

        const supabase = createClient()
        const redirectTo = `${window.location.origin}/auth/callback?next=/dashboard`
        const { error } = await supabase.auth.signInWithOAuth({
            provider,
            options: { redirectTo },
        })

        if (error) {
            setError(getOAuthErrorMessage(provider, error.message))
            setOauthLoading(null)
        }
    }

    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center bg-white px-4 py-10 font-sans">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center select-none">
                    <img
                        src="/syh-pro-logo.svg"
                        alt="Logo SyH Pro"
                        className="mx-auto h-36 w-auto object-contain"
                        draggable={false}
                    />
                </div>

                <Card className="w-full rounded-lg border border-slate-200 bg-white py-6 shadow-[0_24px_60px_-35px_rgba(2,6,23,0.45)]">
                    <CardHeader className="space-y-1.5 px-7 pb-2 text-center">
                        <CardTitle className="font-heading text-[1.8rem] font-semibold tracking-tight text-slate-900 select-none">
                            {isLogin ? 'Ingresar a SyH Pro' : 'Crear cuenta consultor'}
                        </CardTitle>
                        <CardDescription className="mx-auto max-w-[30ch] text-[0.95rem] font-normal text-slate-600">
                            {isLogin
                                ? 'Ingresa tu email y contraseña para acceder al panel.'
                                : 'Completa tus datos para registrarte como consultor.'}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="px-7">
                        <form action={onSubmit} className="space-y-4">
                            {!isLogin && (
                                <div className="space-y-2">
                                    <Label htmlFor="fullName" className="text-slate-900 font-medium">
                                        Nombre completo
                                    </Label>
                                    <Input
                                        id="fullName"
                                        name="fullName"
                                        placeholder="Juan Pérez"
                                        required={!isLogin}
                                        className="login-input h-11 rounded-md border-slate-200 px-3 text-[0.95rem] text-slate-900"
                                    />
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-slate-900 font-medium">
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                    autoFocus
                                    className="login-input h-11 rounded-md border-slate-200 px-3 text-[0.95rem] text-slate-900"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-slate-900 font-medium">
                                    Contraseña
                                </Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Ingresa tu contraseña"
                                    required
                                    className="login-input h-11 rounded-md border-slate-200 px-3 text-[0.95rem] text-slate-900"
                                />
                            </div>

                            {error && (
                                <p
                                    role="alert"
                                    className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700"
                                >
                                    {error}
                                </p>
                            )}

                            <Button
                                className="btn-submit mt-1 h-11 w-full text-[0.95rem] font-semibold tracking-[0.01em] hover:bg-[#000066]"
                                type="submit"
                                disabled={loading || oauthLoading !== null}
                            >
                                {loading ? 'Procesando...' : isLogin ? 'Ingresar' : 'Crear Cuenta'}
                            </Button>
                        </form>

                        <div className="mt-6 space-y-3">
                            <div className="flex items-center gap-3 text-[0.68rem] font-medium uppercase tracking-[0.22em] text-slate-400">
                                <span className="h-px flex-1 bg-slate-200" />
                                <span>{isLogin ? 'o continua con' : 'o registrate con'}</span>
                                <span className="h-px flex-1 bg-slate-200" />
                            </div>

                            <div className="grid gap-2 sm:grid-cols-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="h-11 rounded-md border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                                    disabled={loading || oauthLoading !== null}
                                    onClick={() => onOAuthSubmit('google')}
                                >
                                    <GoogleIcon />
                                    Google
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="h-11 rounded-md border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                                    disabled={loading || oauthLoading !== null}
                                    onClick={() => onOAuthSubmit('apple')}
                                >
                                    <AppleIcon />
                                    Apple (iPhone)
                                </Button>
                            </div>
                        </div>

                        <div className="mt-6 border-t border-slate-100 pt-5 text-center text-sm">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsLogin(!isLogin)
                                    setError(null)
                                }}
                                className="inline-flex min-h-11 items-center justify-center rounded-md px-3 py-2 font-medium text-[#000080] underline decoration-[#50C878]/0 underline-offset-4 transition-colors duration-150 hover:text-[#000080] hover:decoration-[#50C878] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#50C878]/45"
                            >
                                {isLogin ? '¿No tienes cuenta? Regístrate aquí' : '¿Ya tienes cuenta? Ingresa aquí'}
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="pointer-events-none fixed bottom-4 right-4 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
                <span className="h-2.5 w-2.5 rounded-full bg-[#50C878]" />
                Sistema saludable
            </div>
        </div>
    )
}

function GoogleIcon() {
    return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4">
            <path
                fill="#EA4335"
                d="M12 10.2v3.9h5.5c-.2 1.2-.9 2.3-1.9 3v2.5h3.1c1.8-1.7 2.8-4.3 2.8-7.5 0-.7-.1-1.3-.2-1.9z"
            />
            <path
                fill="#34A853"
                d="M12 22c2.7 0 5-.9 6.7-2.4l-3.1-2.5c-.9.6-2.1 1-3.6 1-2.8 0-5.1-1.9-6-4.4H2.8v2.6C4.5 19.8 8 22 12 22z"
            />
            <path
                fill="#FBBC05"
                d="M6 13.7c-.2-.6-.3-1.2-.3-1.8 0-.6.1-1.2.3-1.8V7.5H2.8A10 10 0 0 0 2 12c0 1.6.4 3.2 1.2 4.5z"
            />
            <path
                fill="#4285F4"
                d="M12 5.9c1.5 0 2.8.5 3.8 1.5l2.9-2.9C17 2.9 14.7 2 12 2 8 2 4.5 4.2 2.8 7.5L6 10.1c.9-2.5 3.2-4.2 6-4.2z"
            />
        </svg>
    )
}

function AppleIcon() {
    return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-current">
            <path d="M16.3 12.6c0-2 1.7-3 1.8-3.1-1-1.5-2.5-1.7-3-1.7-1.3-.1-2.5.8-3.1.8-.6 0-1.5-.8-2.5-.8-1.3 0-2.5.8-3.1 1.9-1.3 2.2-.3 5.4.9 7.2.6.9 1.3 1.9 2.3 1.9s1.4-.6 2.7-.6c1.2 0 1.6.6 2.7.6s1.8-1 2.4-1.9c.7-1 1-2 1-2-.1 0-2.1-.8-2.1-3.3zm-2-6c.5-.6.8-1.5.7-2.4-.8 0-1.8.6-2.3 1.2-.5.6-.9 1.5-.8 2.4.9.1 1.8-.5 2.4-1.2z" />
        </svg>
    )
}

function getOAuthErrorMessage(provider: 'google' | 'apple', message: string) {
    if (message.includes('provider is not enabled') || message.includes('Unsupported provider')) {
        const providerLabel = provider === 'google' ? 'Google' : 'Apple'
        return `${providerLabel} no esta habilitado en Supabase. Activalo en Authentication > Providers.`
    }

    return message
}
