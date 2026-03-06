'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createAssignment(formData: FormData) {
    const supabase = await createClient()

    // Currently expecting a single form logic, but scalable.
    const worker_id = formData.get('workerId') as string
    const course_id = formData.get('courseId') as string
    const due_date = formData.get('dueDate') as string

    if (!worker_id || !course_id || !due_date) {
        return { error: 'Trabajador, Curso y Fecha Límite son requeridos' }
    }

    // To check if assignment already exists
    const { data: existing } = await supabase
        .from('assignments')
        .select('id')
        .eq('worker_id', worker_id)
        .eq('course_id', course_id)
        .single()

    if (existing) {
        return { error: 'Este trabajador ya tiene asignado este curso' }
    }

    const { error } = await supabase.from('assignments').insert({
        worker_id,
        course_id,
        due_date,
        status: 'pending' // Default from DB schema anyway
    })

    if (error) {
        return { error: 'Error al asignar el curso' }
    }

    revalidatePath('/dashboard/asignar')
    return { success: true }
}

export async function createDummyCourse() {
    // Utility for testing Phase 1 MVP. Creates a sample course so there's something to assign.
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'No autorizado' }

    const { error } = await supabase.from('courses').insert({
        consultant_id: user.id,
        title: 'Inducción de Seguridad',
        description: 'Curso básico de seguridad e higiene industrial.',
        duration_minutes: 30,
        video_url: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4'
    })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/dashboard/asignar')
    return { success: true }
}
