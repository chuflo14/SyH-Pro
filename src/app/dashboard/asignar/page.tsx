import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { BookOpenCheck, CheckCircle2, Clock } from 'lucide-react'
import { AssignForm } from './AssignForm'

export const metadata = {
    title: 'Asignaciones - SyH Pro',
}

export default async function AsignarPage() {
    const supabase = await createClient()

    // 1. Fetch available workers (via RLS)
    const { data: workers } = await supabase
        .from('workers')
        .select('id, first_name, last_name, dni, companies(name)')
        .order('last_name', { ascending: true })

    // 2. Fetch available courses (via RLS)
    const { data: courses } = await supabase
        .from('courses')
        .select('id, title')
        .order('title', { ascending: true })

    // 3. Fetch past/current assignments
    const { data: assignments } = await supabase
        .from('assignments')
        .select(`
      id,
      status,
      due_date,
      workers ( first_name, last_name, companies(name) ),
      courses ( title )
    `)
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="font-heading text-2xl font-bold tracking-tight text-slate-900">Control de Asignaciones</h2>
                    <p className="text-slate-500">
                        Asigna capacitaciones a los trabajadores y monitorea su cumplimiento.
                    </p>
                </div>
                <AssignForm workers={workers || []} courses={courses || []} />
            </div>

            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="font-heading text-lg font-bold text-slate-900 flex items-center gap-2">
                        <BookOpenCheck className="h-5 w-5 text-[#50C878]" />
                        Registro de Cursos
                    </CardTitle>
                    <CardDescription>
                        {assignments?.length === 0
                            ? 'No has realizado ninguna asignación todavía.'
                            : `Viendo ${assignments?.length} asignacion(es) totales.`}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border border-slate-200">
                        <Table>
                            <TableHeader className="bg-slate-50">
                                <TableRow>
                                    <TableHead className="font-semibold text-slate-900">Trabajador</TableHead>
                                    <TableHead className="font-semibold text-slate-900">Empresa</TableHead>
                                    <TableHead className="font-semibold text-slate-900">Curso</TableHead>
                                    <TableHead className="font-semibold text-slate-900">Límite</TableHead>
                                    <TableHead className="font-semibold text-slate-900 text-right">Estado</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {assignments?.map((a: any) => (
                                    <TableRow key={a.id}>
                                        <TableCell className="font-medium text-slate-900">
                                            {a.workers?.first_name} {a.workers?.last_name}
                                        </TableCell>
                                        <TableCell className="text-slate-600">{a.workers?.companies?.name}</TableCell>
                                        <TableCell className="text-slate-900 font-medium">{a.courses?.title}</TableCell>
                                        <TableCell className="text-slate-500">
                                            {new Date(a.due_date).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {a.status === 'completed' ? (
                                                <div className="inline-flex items-center text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded-full text-xs">
                                                    <CheckCircle2 className="mr-1 h-3 w-3" />
                                                    Completado
                                                </div>
                                            ) : (
                                                <div className="inline-flex items-center text-amber-600 font-medium bg-amber-50 px-2 py-1 rounded-full text-xs">
                                                    <Clock className="mr-1 h-3 w-3" />
                                                    Pendiente
                                                </div>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {(!assignments || assignments.length === 0) && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center text-slate-500">
                                            Ninguna asignación en curso. Registra una con el botón de &quot;Nueva Asignación&quot;.
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
