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
            <div className="mb-10 text-center select-none relative group">
                <div className="absolute inset-0 bg-emerald-500/10 blur-3xl rounded-full -z-10 opacity-50 group-hover:opacity-100 transition-opacity" />
                <img
                    src="/logo.png"
                    alt="SyH Pro Logo"
                    className="h-24 w-auto object-contain mx-auto pointer-events-none relative z-10"
                    draggable={false}
                    onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                            const fallback = document.createElement('div');
                            fallback.className = "text-3xl font-heading font-black tracking-tighter text-[#000080] flex items-center justify-center gap-2";
                            fallback.innerHTML = '<span>SyH</span><span class="text-[#50C878]">Pro</span>';
                            parent.appendChild(fallback);
                        }
                    }}
                />
                <p className="mt-6 text-xs font-black text-slate-400 uppercase tracking-[0.3em] relative z-10">Portal del Trabajador</p>
            </div>

            <Card className="w-full max-w-sm border-slate-100 shadow-2xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="space-y-1 pb-4 select-none">
                    <CardTitle className="font-heading text-xl font-bold text-slate-900">
                        Ingreso Seguro
                    </CardTitle>
                    <CardDescription className="text-slate-600 font-medium">
                        Ingresá tu DNI y tu N° de Legajo para ver tus capacitaciones.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={onSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="dni" className="text-slate-900 font-medium">
                                Documento (DNI)
                            </Label>
                            <Input
                                id="dni"
                                name="dni"
                                type="number"
                                placeholder="Ej: 30123456"
                                required
                                autoFocus
                                className="h-12 text-lg shadow-sm placeholder:text-slate-400"
                                autoComplete="off"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="legajo" className="text-slate-900 font-medium">
                                N° de Legajo
                            </Label>
                            <Input
                                id="legajo"
                                name="legajo"
                                type="text"
                                placeholder="Ingresá tu número o código"
                                required
                                className="h-12 text-lg shadow-sm placeholder:text-slate-400"
                                autoComplete="off"
                            />
                        </div>

                        {error && (
                            <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-600">
                                {error}
                            </div>
                        )}

                        <Button
                            className="mt-2 h-14 w-full bg-[#50C878] text-lg font-bold text-white hover:bg-[#40a860] shadow-md transition-all active:scale-[0.98]"
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
