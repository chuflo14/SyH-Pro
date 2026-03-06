'use client'

import { useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { deleteCompany } from './actions'

export function DeleteCompanyButton({ id }: { id: string }) {
    const [isPending, startTransition] = useTransition()

    return (
        <Button
            variant="ghost"
            size="icon"
            className="text-slate-400 hover:text-red-500 hover:bg-red-50"
            disabled={isPending}
            onClick={() => {
                if (confirm('¿Estás seguro de eliminar esta empresa? Esto eliminará todos sus trabajadores y asignaciones (acción irreversible).')) {
                    startTransition(async () => {
                        await deleteCompany(id)
                    })
                }
            }}
            title="Eliminar Empresa"
        >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Eliminar {id}</span>
        </Button>
    )
}
