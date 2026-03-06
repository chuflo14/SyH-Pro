'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function markCourseAsCompleted(courseId: string) {
    const cookieStore = await cookies()
    const worker_id = cookieStore.get('worker_session')?.value

    if (!worker_id) {
        redirect('/portal/login')
    }

    const supabase = await createClient()

    const { error } = await supabase
        .from('assignments')
        .update({ status: 'completed', completed_at: new Date().toISOString() })
        .eq('course_id', courseId)
        .eq('worker_id', worker_id)

    if (error) {
        throw new Error('No se pudo completar el curso.')
    }

    revalidatePath('/portal')
    revalidatePath('/dashboard/asignar') // Consultant's view updates
    redirect('/portal')
}
