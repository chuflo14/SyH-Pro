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
                <Button className="bg-emerald-600 text-white hover:bg-emerald-700">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Registrar Trabajador
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Nuevo Trabajador</DialogTitle>
                    <DialogDescription>
                        Agrega un empleado a una empresa existente. Necesitará su DNI y Legajo para ingresar al portal.
                    </DialogDescription>
                </DialogHeader>
                <form action={action} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label>Empresa Cliente</Label>
                        <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                            <SelectTrigger>
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
                            <Label htmlFor="firstName">Nombre</Label>
                            <Input id="firstName" name="firstName" placeholder="Juan" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Apellido</Label>
                            <Input id="lastName" name="lastName" placeholder="Pérez" required />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="dni">DNI</Label>
                            <Input id="dni" name="dni" type="number" placeholder="Sin puntos" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="legajo">N° Legajo</Label>
                            <Input id="legajo" name="legajo" placeholder="1001" required />
                        </div>
                    </div>

                    {error && <p className="text-sm font-medium text-red-500">{error}</p>}

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
                        <Button type="submit" disabled={loading} className="bg-slate-900 text-white hover:bg-slate-800">
                            {loading ? 'Guardando...' : 'Registrar'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
