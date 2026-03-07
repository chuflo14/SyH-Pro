'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PlusCircle } from 'lucide-react'
import { createCompany } from './actions'

export function CompanyForm() {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function action(formData: FormData) {
        setLoading(true)
        setError(null)

        const result = await createCompany(formData)

        if (result?.error) {
            setError(result.error)
            setLoading(false)
        } else {
            setOpen(false)
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-[#000080] text-white hover:bg-[#000060] shadow-sm">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Nueva Empresa
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="font-heading text-xl font-bold text-slate-900">Registrar Empresa</DialogTitle>
                    <DialogDescription>
                        Añade una nueva empresa cliente para comenzar a gestionar sus trabajadores y capacitaciones.
                    </DialogDescription>
                </DialogHeader>
                <form action={action} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="font-medium text-slate-700">Razón Social o Nombre</Label>
                        <Input id="name" name="name" placeholder="Acme S.A" required className="shadow-sm" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="cuit" className="font-medium text-slate-700">CUIT</Label>
                        <Input id="cuit" name="cuit" placeholder="30-12345678-9" required className="shadow-sm" />
                    </div>

                    {error && (
                        <div className="rounded-md border border-red-200 bg-red-50 p-2 text-sm font-medium text-red-600">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-end space-x-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={loading}
                            className="border-slate-200"
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={loading} className="bg-[#000080] text-white hover:bg-[#000060] shadow-sm px-6">
                            {loading ? 'Guardando...' : 'Guardar Empresa'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
