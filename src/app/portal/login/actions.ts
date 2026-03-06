'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function workerLogin(formData: FormData) {
    const supabase = await createClient()

    const dni = formData.get('dni') as string
    const legajo = formData.get('legajo') as string

    // Simple validation
    if (!dni || !legajo) {
        return { error: 'DNI y Legajo son requeridos' }
    }

    // Look up the worker in the database
    const { data: worker, error } = await supabase
        .from('workers')
        .select('id, first_name, last_name, company_id')
        .eq('dni', dni)
        .eq('legajo', legajo)
        .single()

    if (error || !worker) {
        return { error: 'Credenciales inválidas. Revisa tu DNI o Legajo.' }
    }

    // Create a custom session cookie
    // For MVP purposes, we're storing the ID directly. 
    // For production, this should be a signed JWT to prevent tampering.
    const cookieStore = await cookies()
    cookieStore.set('worker_session', worker.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/',
    })

    redirect('/portal')
}

export async function workerLogout() {
    const cookieStore = await cookies()
    cookieStore.delete('worker_session')
    redirect('/portal/login')
}
