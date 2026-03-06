'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createCompany(formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'No autorizado' }

    const name = formData.get('name') as string
    const cuit = formData.get('cuit') as string

    if (!name || !cuit) {
        return { error: 'Nombre y CUIT requeridos' }
    }

    const { error } = await supabase.from('companies').insert({
        name,
        cuit,
        consultant_id: user.id
    })

    if (error) {
        if (error.code === '23505') {
            return { error: 'El CUIT ya está registrado' }
        }
        return { error: 'Error al crear la empresa' }
    }

    revalidatePath('/dashboard/empresas')
    return { success: true }
}

export async function deleteCompany(id: string) {
    const supabase = await createClient()

    const { error } = await supabase.from('companies').delete().eq('id', id)

    if (error) {
        return { error: 'Error al eliminar la empresa' }
    }

    revalidatePath('/dashboard/empresas')
    return { success: true }
}
