'use client'

import { useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { deleteWorker } from './actions'

export function DeleteWorkerButton({ id }: { id: string }) {
    const [isPending, startTransition] = useTransition()

    return (
        <Button
            variant="ghost"
            size="icon"
            className="text-slate-400 hover:text-red-500 hover:bg-red-50"
            disabled={isPending}
            onClick={() => {
                if (confirm('¿Estás seguro de eliminar este trabajador? Sus asignaciones también se borrarán.')) {
                    startTransition(async () => {
                        await deleteWorker(id)
                    })
                }
            }}
            title="Eliminar Trabajador"
        >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Eliminar {id}</span>
        </Button>
    )
}
