'use client'

import { LayoutDashboard, Box, Play, BarChart } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Models', href: '/dashboard/models', icon: Box },
  { name: 'Training', href: '/dashboard/training', icon: Play },
  { name: 'Evaluation', href: '/dashboard/evaluation', icon: BarChart },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-[#0A0B1A] border-r border-gray-800">
      <div className="px-4 py-6">
        <span className="text-xl font-bold text-white">Neural Connect</span>
      </div>
      <div className="px-2">
        <div className="space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md",
                pathname === item.href
                  ? "bg-purple-600 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

