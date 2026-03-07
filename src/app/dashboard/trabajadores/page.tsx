import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Users } from 'lucide-react'
import { WorkerForm } from './WorkerForm'
import { DeleteWorkerButton } from './DeleteWorkerButton'

export const metadata = {
    title: 'Trabajadores - SyH Pro',
}

export default async function TrabajadoresPage() {
    const supabase = await createClient()

    // Fetch all companies related to the consultant for the add-worker dropdown
    const { data: companies } = await supabase
        .from('companies')
        .select('id, name')
        .order('name', { ascending: true })

    // Fetch all workers. Due to RLS, it will only return workers linked to companies managed by this consultant.
    const { data: workers } = await supabase
        .from('workers')
        .select(`
      id,
      first_name,
      last_name,
      dni,
      legajo,
      companies ( name )
    `)
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="font-heading text-2xl font-bold tracking-tight text-slate-900">Trabajadores</h2>
                    <p className="text-slate-500">
                        Nómina de personal de tus empresas clientes.
                    </p>
                </div>
                <WorkerForm companies={companies || []} />
            </div>

            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="font-heading text-lg font-bold text-slate-900 flex items-center gap-2">
                        <Users className="h-5 w-5 text-[#50C878]" />
                        Nómina General
                    </CardTitle>
                    <CardDescription>
                        {workers?.length === 0
                            ? 'Aún no has registrado ningún trabajador.'
                            : `Total: ${workers?.length} trabajador(es)`}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border border-slate-200">
                        <Table>
                            <TableHeader className="bg-slate-50">
                                <TableRow>
                                    <TableHead className="font-semibold text-slate-900">Nombre Completo</TableHead>
                                    <TableHead className="font-semibold text-slate-900">Empresa</TableHead>
                                    <TableHead className="font-semibold text-slate-900">DNI</TableHead>
                                    <TableHead className="font-semibold text-slate-900">N° Legajo</TableHead>
                                    <TableHead className="font-semibold text-slate-900 text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {workers?.map((worker: any) => (
                                    <TableRow key={worker.id}>
                                        <TableCell className="font-medium text-slate-900">
                                            {worker.first_name} {worker.last_name}
                                        </TableCell>
                                        <TableCell className="text-slate-600">{worker.companies?.name}</TableCell>
                                        <TableCell className="text-slate-500">{worker.dni}</TableCell>
                                        <TableCell className="text-slate-500">{worker.legajo}</TableCell>
                                        <TableCell className="text-right">
                                            <DeleteWorkerButton id={worker.id} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {(!workers || workers.length === 0) && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center text-slate-500">
                                            No hay datos para mostrar.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
