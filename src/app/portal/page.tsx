import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Clock, PlayCircle } from 'lucide-react'
import Link from 'next/link'
import { workerLogout } from './login/actions'

export const metadata = {
    title: 'Mi Portal - SyH Pro',
}

export default async function PortalPage() {
    const cookieStore = await cookies()
    const worker_id = cookieStore.get('worker_session')?.value

    if (!worker_id) {
        redirect('/portal/login')
    }

    const supabase = await createClient()

    // Fetch worker info
    const { data: worker } = await supabase
        .from('workers')
        .select('first_name, last_name, companies(name)')
        .eq('id', worker_id)
        .single()

    // Fetch assignments with course details
    const { data: assignments } = await supabase
        .from('assignments')
        .select(`
      id,
      status,
      due_date,
      course_id,
      courses ( title, description, duration_minutes )
    `)
        .eq('worker_id', worker_id)
        .order('due_date', { ascending: true })

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Mobile Topbar */}
            <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm">
                <div>
                    <img
                        src="/logo.png"
                        alt="SyH Pro Logo"
                        className="h-8 w-auto object-contain"
                    />
                </div>
                <form action={workerLogout}>
                    <Button variant="ghost" size="sm" type="submit" className="text-slate-600">
                        Salir
                    </Button>
                </form>
            </header>

            <main className="p-4 pb-20 max-w-lg mx-auto space-y-6">
                <div>
                    <h2 className="font-heading text-2xl font-bold tracking-tight text-slate-900">
                        Hola, {worker?.first_name}
                    </h2>
                    <p className="text-slate-500">
                        {Array.isArray(worker?.companies) ? (worker?.companies[0] as any)?.name : (worker?.companies as any)?.name}
                    </p>
                </div>

                <div className="space-y-4">
                    <h3 className="font-heading text-lg font-bold text-slate-900 uppercase tracking-wide">Mis Capacitaciones</h3>

                    {assignments?.map((a: any) => {
                        const isCompleted = a.status === 'completed'
                        const isOverdue = !isCompleted && new Date(a.due_date) < new Date()

                        return (
                            <Card key={a.id} className={`border-slate-200 shadow-sm relative overflow-hidden ${isCompleted ? 'opacity-80' : ''}`}>
                                {/* Visual Status Indicator Strip */}
                                <div className={`absolute left-0 top-0 bottom-0 w-1 ${isCompleted ? 'bg-emerald-500' : isOverdue ? 'bg-red-500' : 'bg-amber-500'
                                    }`} />

                                <CardHeader className="pl-5 pb-2">
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="font-heading text-base font-bold text-slate-900 leading-tight">
                                            {a.courses?.title}
                                        </CardTitle>
                                        {isCompleted ? (
                                            <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                                        ) : (
                                            <Clock className={`h-5 w-5 flex-shrink-0 ${isOverdue ? 'text-red-500' : 'text-amber-500'}`} />
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="pl-5 space-y-4">
                                    <p className="text-sm text-slate-500 line-clamp-2">
                                        {a.courses?.description}
                                    </p>

                                    <div className="flex items-center justify-between text-xs font-medium">
                                        <span className="text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
                                            {a.courses?.duration_minutes} min
                                        </span>
                                        <span className={isCompleted ? 'text-emerald-600' : isOverdue ? 'text-red-600' : 'text-slate-500'}>
                                            {isCompleted ? 'Completado' : `Vence: ${new Date(a.due_date).toLocaleDateString()}`}
                                        </span>
                                    </div>

                                    {!isCompleted && (
                                        <Button asChild className="w-full mt-2 bg-slate-900 text-white hover:bg-slate-800">
                                            <Link href={`/portal/curso/${a.course_id}`}>
                                                <PlayCircle className="mr-2 h-4 w-4" />
                                                Iniciar Curso
                                            </Link>
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        )
                    })}

                    {(!assignments || assignments.length === 0) && (
                        <div className="text-center py-10 bg-white rounded-lg border border-slate-200">
                            <p className="text-slate-500">No tienes capacitaciones asignadas en este momento.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
