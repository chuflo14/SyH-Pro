import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { Button } from '@/components/ui/button'
import { ChevronLeft, Info, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { markCourseAsCompleted } from './actions'

export const metadata = {
    title: 'Capacitación - SyH Pro',
}

export default async function CursoPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params

    const cookieStore = await cookies()
    const worker_id = cookieStore.get('worker_session')?.value

    if (!worker_id) {
        redirect('/portal/login')
    }

    const supabase = await createClient()

    // Verify the assignment exists and get its status
    const { data: assignment } = await supabase
        .from('assignments')
        .select('status')
        .eq('worker_id', worker_id)
        .eq('course_id', id)
        .single()

    if (!assignment) {
        redirect('/portal')
    }

    // Fetch course details
    const { data: course } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .single()

    if (!course) {
        redirect('/portal')
    }

    const isCompleted = assignment.status === 'completed'

    return (
        <div className="min-h-screen bg-black sm:bg-slate-50 flex flex-col">
            {/* Mobile Topbar for Navigation */}
            <header className="sticky top-0 z-10 flex h-14 items-center gap-4 bg-slate-900 px-4 text-white shadow-md sm:h-16">
                <Button variant="ghost" size="icon" asChild className="text-white hover:bg-slate-800 rounded-full h-8 w-8 hover:text-white">
                    <Link href="/portal">
                        <ChevronLeft className="h-5 w-5" />
                        <span className="sr-only">Volver</span>
                    </Link>
                </Button>
                <h1 className="font-heading text-lg font-semibold truncate">
                    {course.title}
                </h1>
            </header>

            <main className="flex-1 max-w-2xl sm:mx-auto w-full sm:mt-6 sm:bg-white sm:rounded-sm sm:shadow-sm sm:overflow-hidden">
                {/* Video Player Container */}
                <div className="w-full aspect-video bg-black relative">
                    {course.video_url ? (
                        <video
                            src={course.video_url}
                            controls
                            controlsList="nodownload"
                            className="w-full h-full object-contain"
                            playsInline
                        // poster="/path/to/poster-if-provided"
                        >
                            Tu navegador no soporta reproducción de video.
                        </video>
                    ) : (
                        <div className="flex items-center justify-center w-full h-full text-slate-500">
                            <span className="text-sm">Video no disponible</span>
                        </div>
                    )}
                </div>

                {/* Content & Actions Container */}
                <div className="p-5 sm:p-6 bg-white sm:bg-transparent rounded-t-sm -mt-4 relative sm:mt-0 sm:rounded-none flex-1 flex flex-col">
                    <h2 className="font-heading text-xl font-bold text-slate-900 mb-2">{course.title}</h2>

                    <div className="flex items-center gap-2 mb-6 text-sm text-slate-500">
                        <span className="flex items-center bg-slate-100 px-2 py-1 rounded-md text-slate-700">
                            <Info className="h-4 w-4 mr-1 text-slate-400" />
                            Duración: {course.duration_minutes} min
                        </span>
                        {isCompleted && (
                            <span className="flex items-center text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md font-medium">
                                <CheckCircle2 className="h-4 w-4 mr-1" />
                                Completado
                            </span>
                        )}
                    </div>

                    <div className="prose prose-sm text-slate-600 mb-8 max-w-none flex-1">
                        <p>{course.description}</p>
                    </div>

                    {!isCompleted ? (
                        <form action={markCourseAsCompleted.bind(null, course.id)} className="mt-auto pt-4 border-t border-slate-100">
                            <Button type="submit" size="lg" className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-lg font-bold shadow-sm">
                                Marcar como Completado
                            </Button>
                            <p className="mt-3 text-xs text-center text-slate-400">
                                Al marcar como completado, confirmas haber visualizado y entendido todo el material de la capacitación.
                            </p>
                        </form>
                    ) : (
                        <div className="mt-auto pt-4 border-t border-slate-100 pb-2">
                            <Button asChild size="lg" variant="outline" className="w-full h-14 border-slate-200 text-slate-700">
                                <Link href="/portal">Volver al Inicio</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
