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
        <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
            <Card className="w-full max-w-md border-slate-200 shadow-sm">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
                        {isLogin ? 'Ingresar a SyH Pro' : 'Crear cuenta Consultor'}
                    </CardTitle>
                    <CardDescription>
                        {isLogin
                            ? 'Ingresa tu email y contraseña para acceder al panel'
                            : 'Completa tus datos para registrarte como Consultor'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={onSubmit} className="space-y-4">
                        {!isLogin && (
                            <div className="space-y-2">
                                <Label htmlFor="fullName" className="text-slate-900">
                                    Nombre Completo
                                </Label>
                                <Input
                                    id="fullName"
                                    name="fullName"
                                    placeholder="Juan Pérez"
                                    required={!isLogin}
                                />
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-slate-900">
                                Email
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-slate-900">
                                Contraseña
                            </Label>
                            <Input id="password" name="password" type="password" required />
                        </div>

                        {error && <p className="text-sm font-medium text-red-500">{error}</p>}

                        <Button
                            className="w-full bg-slate-900 text-white hover:bg-slate-800"
                            type="submit"
                            disabled={loading}
                        >
                            {loading
                                ? 'Procesando...'
                                : isLogin
                                    ? 'Ingresar'
                                    : 'Crear Cuenta'}
                        </Button>
                    </form>

                    <div className="mt-4 text-center text-sm">
                        <button
                            onClick={() => {
                                setIsLogin(!isLogin)
                                setError(null)
                            }}
                            className="text-emerald-600 hover:text-emerald-700 hover:underline"
                        >
                            {isLogin
                                ? '¿No tienes cuenta? Regístrate aquí'
                                : '¿Ya tienes cuenta? Ingresa aquí'}
                        </button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
