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
import { PlusCircle, Video } from 'lucide-react'
import { createAssignment, createDummyCourse } from './actions'

type Worker = {
    id: string
    first_name: string
    last_name: string
    dni: string
    companies: any
}
type Course = { id: string, title: string }

export function AssignForm({ workers, courses }: { workers: Worker[], courses: Course[] }) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [selectedWorker, setSelectedWorker] = useState<string>('')
    const [selectedCourse, setSelectedCourse] = useState<string>('')

    async function action(formData: FormData) {
        if (!selectedWorker || !selectedCourse) {
            setError('Debes seleccionar un trabajador y un curso')
            return
        }

        setLoading(true)
        setError(null)

        formData.append('workerId', selectedWorker)
        formData.append('courseId', selectedCourse)

        const result = await createAssignment(formData)

        if (result?.error) {
            setError(result.error)
            setLoading(false)
        } else {
            setOpen(false)
            setLoading(false)
            setSelectedWorker('')
            setSelectedCourse('')

            // Optionally format a modern Toast instead of an alert
            alert('¡Curso asignado correctamente!')
        }
    }

    return (
        <div className="flex gap-4">
            {/* Utility Button for MVP to seed courses */}
            <Button
                variant="outline"
                onClick={async () => {
                    await createDummyCourse();
                    alert('Curso de prueba generado. Al actualizar, aparecerá en las opciones de asignar.')
                }}
            >
                <Video className="mr-2 h-4 w-4" /> Generar Curso Mock
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button className="bg-[#000080] text-white hover:bg-[#000060] shadow-sm">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Nueva Asignación
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="font-heading text-xl font-bold text-slate-900">Asignar Capacitación</DialogTitle>
                        <DialogDescription>
                            Selecciona un trabajador y el curso a asignar, además de una fecha límite (Due Date).
                        </DialogDescription>
                    </DialogHeader>
                    <form action={action} className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <Label className="font-medium text-slate-700">Trabajador</Label>
                            <Select value={selectedWorker} onValueChange={setSelectedWorker}>
                                <SelectTrigger className="shadow-sm">
                                    <SelectValue placeholder="Busca o selecciona un trabajador..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {workers.map((w) => (
                                        <SelectItem key={w.id} value={w.id}>
                                            {w.first_name} {w.last_name} ({w.companies?.name})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="font-medium text-slate-700">Curso</Label>
                            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                                <SelectTrigger className="shadow-sm">
                                    <SelectValue placeholder="Selecciona un curso..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {courses.map((c) => (
                                        <SelectItem key={c.id} value={c.id}>
                                            {c.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="dueDate" className="font-medium text-slate-700">Fecha de Vencimiento</Label>
                            <Input id="dueDate" name="dueDate" type="date" required className="shadow-sm" />
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
                                {loading ? 'Asignando...' : 'Asignar Curso'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
