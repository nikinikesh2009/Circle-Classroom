"use client"

import { Suspense } from "react"
import type React from "react"
import { ThemeProvider } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import { theme } from "@/lib/theme"

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Suspense fallback={<div style={{ minHeight: "100vh", background: "#f5f7fa" }} />}>{children}</Suspense>
    </ThemeProvider>
  )
}
