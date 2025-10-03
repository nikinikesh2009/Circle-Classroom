"use client"

import { Suspense } from "react"
import type React from "react"

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <Suspense fallback={<div className="min-h-screen bg-background" />}>{children}</Suspense>
}
