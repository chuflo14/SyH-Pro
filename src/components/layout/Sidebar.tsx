'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Building2, Users, BookOpenCheck } from 'lucide-react'

const navigation = [
    { name: 'Resumen', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Empresas', href: '/dashboard/empresas', icon: Building2 },
    { name: 'Trabajadores', href: '/dashboard/trabajadores', icon: Users },
    { name: 'Asignaciones', href: '/dashboard/asignar', icon: BookOpenCheck },
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <div className="flex h-full w-64 flex-col bg-slate-900 border-r border-slate-800">
            <div className="flex h-16 shrink-0 items-center px-6">
                <h1 className="text-xl font-bold text-white tracking-tight">
                    SyH <span className="text-emerald-500">Pro</span>
                </h1>
            </div>
            <div className="flex flex-1 flex-col overflow-y-auto">
                <nav className="flex-1 space-y-1 px-4 py-4">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`) && item.href !== '/dashboard'
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${isActive
                                        ? 'bg-slate-800 text-emerald-400'
                                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                    }`}
                            >
                                <item.icon
                                    className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors ${isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-emerald-400'
                                        }`}
                                    aria-hidden="true"
                                />
                                {item.name}
                            </Link>
                        )
                    })}
                </nav>
            </div>
        </div>
    )
}
