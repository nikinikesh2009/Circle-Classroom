import type React from "react"
import type { Metadata } from "next"
import { IBM_Plex_Mono, Montserrat } from "next/font/google"
import "./globals.css"
import ClientLayout from "./client-layout"

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
})

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
})

export const metadata: Metadata = {
  title: "Circle Classroom - Your Learning Platform",
  description: "Modern education platform connecting students and educators",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-mono ${ibmPlexMono.variable} ${montserrat.variable}`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
