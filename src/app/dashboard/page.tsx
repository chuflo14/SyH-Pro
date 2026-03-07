import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2, Users, BookOpenCheck } from 'lucide-react'

export default async function DashboardOverview() {
    const supabase = await createClient()

    // Fetch metrics based on RLS
    const [{ count: companiesCount }, { count: workersCount }, { count: assignmentsCount }] = await Promise.all([
        supabase.from('companies').select('*', { count: 'exact', head: true }),
        supabase.from('workers').select('*', { count: 'exact', head: true }),
        supabase.from('assignments').select('*', { count: 'exact', head: true }),
    ])

    // Custom fetch to calc completion rate
    const { data: assignments } = await supabase.from('assignments').select('status')

    let complianceRate = 0
    if (assignments && assignments.length > 0) {
        const completed = assignments.filter((a) => a.status === 'completed').length
        complianceRate = Math.round((completed / assignments.length) * 100)
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="font-heading text-2xl font-bold tracking-tight text-slate-900">Resumen General</h2>
                <p className="text-slate-500">
                    Métricas clave de las capacitaciones de tus clientes.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-slate-200 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="font-heading text-sm font-semibold text-slate-600">Total Empresas</CardTitle>
                        <Building2 className="h-4 w-4 text-emerald-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{companiesCount || 0}</div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="font-heading text-sm font-semibold text-slate-600">Total Trabajadores</CardTitle>
                        <Users className="h-4 w-4 text-emerald-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{workersCount || 0}</div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="font-heading text-sm font-semibold text-slate-600">Asignaciones Obra</CardTitle>
                        <BookOpenCheck className="h-4 w-4 text-emerald-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{assignmentsCount || 0}</div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="font-heading text-sm font-semibold text-slate-600">% Cumplimiento</CardTitle>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            className="h-4 w-4 text-emerald-600"
                        >
                            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                        </svg>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{complianceRate}%</div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
