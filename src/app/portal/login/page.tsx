'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { workerLogin } from './actions'

export default function WorkerLoginPage() {
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    async function onSubmit(formData: FormData) {
        setLoading(true)
        setError(null)

        const result = await workerLogin(formData)

        if (result?.error) {
            setError(result.error)
        }

        setLoading(false)
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4">
            {/* Brand logo space for MVP */}
            <div className="mb-8 text-center">
                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
                    SyH <span className="text-emerald-600">Pro</span>
                </h1>
                <p className="mt-2 text-sm text-slate-500">Portal del Trabajador</p>
            </div>

            <Card className="w-full max-w-sm border-slate-200 shadow-sm">
                <CardHeader className="space-y-1 pb-4">
                    <CardTitle className="text-xl font-semibold text-slate-900">
                        Ingreso Seguro
                    </CardTitle>
                    <CardDescription>
                        Ingresá tu DNI y tu N° de Legajo para ver tus capacitaciones.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={onSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="dni" className="text-slate-900">
                                Documento (DNI)
                            </Label>
                            <Input
                                id="dni"
                                name="dni"
                                type="number"
                                placeholder="Ej: 30123456"
                                required
                                className="h-12 text-lg"
                                autoComplete="off"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="legajo" className="text-slate-900">
                                N° de Legajo
                            </Label>
                            <Input
                                id="legajo"
                                name="legajo"
                                type="text"
                                placeholder="Ingresá tu número o código"
                                required
                                className="h-12 text-lg"
                                autoComplete="off"
                            />
                        </div>

                        {error && (
                            <div className="rounded-md bg-red-50 p-3 text-sm font-medium text-red-600">
                                {error}
                            </div>
                        )}

                        <Button
                            className="mt-2 h-14 w-full bg-emerald-600 text-lg font-semibold text-white hover:bg-emerald-700"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? 'Verificando...' : 'Ingresar al Portal'}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <p className="mt-8 text-center text-xs text-slate-400">
                Si no conocés tu legajo, solicitalo a tu área de Recursos Humanos o a tu Consultor de SyH.
            </p>
        </div>
    )
}
