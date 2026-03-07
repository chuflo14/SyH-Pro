'use client'

import { logout } from '@/app/dashboard/actions'
import { Button } from '@/components/ui/button'
import { LogOut, Menu } from 'lucide-react'

export function Topbar() {
    return (
        <header className="sticky top-0 z-10 flex h-20 shrink-0 items-center gap-x-4 border-b border-slate-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8 transition-all">
            {/* Mobile menu button (MVP mostly desktop but good practice) */}
            <button type="button" className="-m-2.5 p-2.5 text-slate-700 lg:hidden">
                <span className="sr-only">Open sidebar</span>
                <Menu className="h-6 w-6" aria-hidden="true" />
            </button>

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                <div className="flex flex-1"></div>
                <div className="flex items-center gap-x-4 lg:gap-x-6">
                    <div className="flex items-center gap-x-4 lg:gap-x-6">
                        <Button
                            variant="ghost"
                            className="text-slate-600 hover:text-slate-900 font-medium rounded-sm transition-all"
                            onClick={() => logout()}
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Cerrar Sesión
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    )
}
