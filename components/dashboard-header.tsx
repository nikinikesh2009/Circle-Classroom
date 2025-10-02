"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Users, Calendar, FileText, LogOut, LayoutDashboard, Bell, Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

export function DashboardHeader() {
  const router = useRouter()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/students", label: "Students", icon: Users },
    { href: "/dashboard/attendance", label: "Attendance", icon: Calendar },
    { href: "/dashboard/reports", label: "Reports", icon: FileText },
  ]

  return (
    <>
      <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur-lg shadow-sm">
        <div className="flex h-16 items-center gap-4 px-4 md:px-6">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary text-white shadow-lg">
              <span className="text-lg">C</span>
            </div>
            <span className="hidden md:inline bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Circle
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex flex-1 items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/")

              return (
                <Button
                  key={item.href}
                  variant={isActive ? "secondary" : "ghost"}
                  asChild
                  className={cn("transition-all duration-200", isActive && "bg-primary/10 text-primary font-semibold")}
                >
                  <Link href={item.href}>
                    <Icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Link>
                </Button>
              )
            })}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            <Button variant="ghost" onClick={handleSignOut} className="hidden md:flex">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-white p-4 animate-slide-up">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/")

                return (
                  <Button
                    key={item.href}
                    variant={isActive ? "secondary" : "ghost"}
                    asChild
                    className={cn("justify-start", isActive && "bg-primary/10 text-primary font-semibold")}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Link href={item.href}>
                      <Icon className="mr-2 h-4 w-4" />
                      {item.label}
                    </Link>
                  </Button>
                )
              })}
              <Button variant="ghost" onClick={handleSignOut} className="justify-start">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        )}
      </header>
    </>
  )
}
