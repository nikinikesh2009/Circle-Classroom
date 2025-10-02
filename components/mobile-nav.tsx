"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Users, Calendar, BarChart3, CalendarDays } from "lucide-react"
import { cn } from "@/lib/utils"

export function MobileNav() {
  const pathname = usePathname()

  const navItems = [
    { href: "/dashboard/timetable", label: "Timetable", icon: CalendarDays },
    { href: "/dashboard/attendance", label: "Attendance", icon: Calendar },
    { href: "/dashboard", label: "Home", icon: Home },
    { href: "/dashboard/students", label: "Students", icon: Users },
    { href: "/dashboard/reports", label: "Analyze", icon: BarChart3 },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white/95 backdrop-blur-lg md:hidden safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-3">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive =
            pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href + "/"))

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 rounded-xl px-3 py-2 text-xs font-medium transition-all duration-200 active:scale-95",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground active:text-primary",
              )}
            >
              <Icon
                className={cn("h-5 w-5 transition-all duration-200", isActive && "scale-110")}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className={cn("transition-all duration-200", isActive && "font-semibold")}>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
