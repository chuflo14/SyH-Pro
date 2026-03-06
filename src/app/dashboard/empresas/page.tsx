import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Building2 } from 'lucide-react'
import { CompanyForm } from './CompanyForm'
import { DeleteCompanyButton } from './DeleteCompanyButton'

export const metadata = {
    title: 'Empresas - SyH Pro',
}

export default async function EmpresasPage() {
    const supabase = await createClient()

    // Fetch companies for the logged in consultant
    const { data: companies } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Empresas Clientes</h2>
                    <p className="text-slate-500">
                        Gestiona las empresas a las que brindas servicio.
                    </p>
                </div>
                <CompanyForm />
            </div>

            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-medium text-slate-900 flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-emerald-600" />
                        Nómina de Empresas
                    </CardTitle>
                    <CardDescription>
                        {companies?.length === 0
                            ? 'Aún no has registrado ninguna empresa.'
                            : `Total: ${companies?.length} empresa(s)`}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border border-slate-200">
                        <Table>
                            <TableHeader className="bg-slate-50">
                                <TableRow>
                                    <TableHead className="font-semibold text-slate-900">Razón Social</TableHead>
                                    <TableHead className="font-semibold text-slate-900">CUIT</TableHead>
                                    <TableHead className="font-semibold text-slate-900 text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {companies?.map((company) => (
                                    <TableRow key={company.id}>
                                        <TableCell className="font-medium text-slate-900">{company.name}</TableCell>
                                        <TableCell className="text-slate-500">{company.cuit}</TableCell>
                                        <TableCell className="text-right">
                                            <DeleteCompanyButton id={company.id} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {(!companies || companies.length === 0) && (
                                    <TableRow>
                                        <TableCell colSpan={3} className="h-24 text-center text-slate-500">
                                            No hay datos para mostrar. Usa el botón "Nueva Empresa" para empezar.
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
