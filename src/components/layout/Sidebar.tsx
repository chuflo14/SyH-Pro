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
        <div className="flex h-full w-64 flex-col bg-slate-950 border-r border-slate-800">
            <div className="flex h-20 shrink-0 items-center justify-center border-b border-slate-800/50">
                {/* Logo Image */}
                <img
                    src="/logo.png"
                    alt="SyH Pro Logo"
                    className="h-12 w-auto object-contain"
                    onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                            const fallback = document.createElement('div');
                            fallback.className = "text-xl font-heading font-black tracking-tighter text-white flex items-center justify-center gap-1";
                            fallback.innerHTML = '<span>SyH</span><span class="text-[#50C878]">Pro</span>';
                            parent.appendChild(fallback);
                        }
                    }}
                />
            </div>
            <div className="flex flex-1 flex-col overflow-y-auto">
                <nav className="flex-1 space-y-1 px-4 py-4">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`) && item.href !== '/dashboard'
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`group flex items-center rounded-sm px-3 py-2.5 text-sm font-medium transition-all duration-200 ${isActive
                                    ? 'bg-slate-800/80 text-emerald-400 shadow-sm'
                                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100'
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
