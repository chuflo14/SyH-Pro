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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PlusCircle } from 'lucide-react'
import { createWorker } from './actions'

type Company = { id: string; name: string }

export function WorkerForm({ companies }: { companies: Company[] }) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [selectedCompany, setSelectedCompany] = useState<string>('')

    async function action(formData: FormData) {
        if (!selectedCompany) {
            setError('Debes seleccionar una empresa')
            return
        }

        setLoading(true)
        setError(null)

        formData.append('companyId', selectedCompany)
        const result = await createWorker(formData)

        if (result?.error) {
            setError(result.error)
            setLoading(false)
        } else {
            setOpen(false)
            setLoading(false)
            setSelectedCompany('')
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-[#000080] text-white hover:bg-[#000060] shadow-sm">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Registrar Trabajador
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="font-heading text-xl font-bold text-slate-900">Nuevo Trabajador</DialogTitle>
                    <DialogDescription>
                        Agrega un empleado a una empresa existente. Necesitará su DNI y Legajo para ingresar al portal.
                    </DialogDescription>
                </DialogHeader>
                <form action={action} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label className="font-medium text-slate-700">Empresa Cliente</Label>
                        <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                            <SelectTrigger className="shadow-sm">
                                <SelectValue placeholder="Selecciona una empresa" />
                            </SelectTrigger>
                            <SelectContent>
                                {companies.map((c) => (
                                    <SelectItem key={c.id} value={c.id}>
                                        {c.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName" className="font-medium text-slate-700">Nombre</Label>
                            <Input id="firstName" name="firstName" placeholder="Juan" required className="shadow-sm" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName" className="font-medium text-slate-700">Apellido</Label>
                            <Input id="lastName" name="lastName" placeholder="Pérez" required className="shadow-sm" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="dni" className="font-medium text-slate-700">DNI</Label>
                            <Input id="dni" name="dni" type="number" placeholder="Sin puntos" required className="shadow-sm" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="legajo" className="font-medium text-slate-700">N° Legajo</Label>
                            <Input id="legajo" name="legajo" placeholder="1001" required className="shadow-sm" />
                        </div>
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
                        <Button type="submit" disabled={loading} className="bg-[#000080] text-white hover:bg-[#000060] shadow-sm px-6 font-bold">
                            {loading ? 'Guardando...' : 'Registrar'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
