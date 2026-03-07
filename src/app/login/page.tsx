'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { login, signup } from './actions'

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

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
                    <CardHeader className="space-y-1.5 px-7 pb-2">
                        <CardTitle className="font-heading text-[1.8rem] font-semibold tracking-tight text-slate-900 select-none">
                            {isLogin ? 'Ingresar a SyH Pro' : 'Crear cuenta consultor'}
                        </CardTitle>
                        <CardDescription className="text-[0.95rem] font-normal text-slate-600">
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
                                disabled={loading}
                            >
                                {loading ? 'Procesando...' : isLogin ? 'Ingresar' : 'Crear Cuenta'}
                            </Button>
                        </form>

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
