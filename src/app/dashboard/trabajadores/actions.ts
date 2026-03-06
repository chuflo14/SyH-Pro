'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createWorker(formData: FormData) {
    const supabase = await createClient()

    const company_id = formData.get('companyId') as string
    const first_name = formData.get('firstName') as string
    const last_name = formData.get('lastName') as string
    const dni = formData.get('dni') as string
    const legajo = formData.get('legajo') as string

    if (!company_id || !first_name || !last_name || !dni || !legajo) {
        return { error: 'Todos los campos son obligatorios' }
    }

    const { error } = await supabase.from('workers').insert({
        company_id,
        first_name,
        last_name,
        dni,
        legajo,
    })

    if (error) {
        if (error.code === '23505') {
            return { error: 'El DNI o Legajo ya está registrado para esta empresa' }
        }
        return { error: 'Error al registrar el trabajador' }
    }

    // Revalidate both lists
    revalidatePath('/dashboard/trabajadores')
    revalidatePath('/dashboard/asignar')
    return { success: true }
}

export async function deleteWorker(id: string) {
    const supabase = await createClient()

    const { error } = await supabase.from('workers').delete().eq('id', id)

    if (error) {
        return { error: 'Error al eliminar el trabajador' }
    }

    revalidatePath('/dashboard/trabajadores')
    return { success: true }
}
