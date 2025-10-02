"use client"

import type { Student } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Printer, Download } from "lucide-react"
import { useEffect, useRef } from "react"

interface StudentIdCardProps {
  student: Student
  schoolName: string
}

export function StudentIdCard({ student, schoolName }: StudentIdCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (canvasRef.current) {
      generateQRCode(student.student_id, canvasRef.current)
    }
  }, [student.student_id])

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    const card = document.getElementById("id-card")
    if (!card) return

    // Create a temporary canvas to capture the card
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = 400
    canvas.height = 250

    // Draw white background
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw border
    ctx.strokeStyle = "#3b82f6"
    ctx.lineWidth = 4
    ctx.strokeRect(0, 0, canvas.width, canvas.height)

    // Draw school name
    ctx.fillStyle = "#1e40af"
    ctx.font = "bold 20px sans-serif"
    ctx.textAlign = "center"
    ctx.fillText(schoolName.toUpperCase(), canvas.width / 2, 40)

    // Draw student name
    ctx.fillStyle = "#000000"
    ctx.font = "bold 24px sans-serif"
    ctx.fillText(student.name, canvas.width / 2, 100)

    // Draw student ID
    ctx.font = "16px sans-serif"
    ctx.fillStyle = "#666666"
    ctx.fillText(`ID: ${student.student_id}`, canvas.width / 2, 130)

    // Draw QR code
    if (canvasRef.current) {
      const qrCanvas = canvasRef.current
      ctx.drawImage(qrCanvas, canvas.width / 2 - 50, 150, 100, 100)
    }

    // Download
    const link = document.createElement("a")
    link.download = `${student.name.replace(/\s+/g, "_")}_ID_Card.png`
    link.href = canvas.toDataURL()
    link.click()
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2 print:hidden">
        <Button onClick={handlePrint}>
          <Printer className="mr-2 h-4 w-4" />
          Print Card
        </Button>
        <Button variant="outline" onClick={handleDownload}>
          <Download className="mr-2 h-4 w-4" />
          Download PNG
        </Button>
      </div>

      <div className="flex justify-center">
        <Card id="id-card" className="w-[400px] border-4 border-blue-600">
          <CardContent className="p-6">
            <div className="space-y-4 text-center">
              <div className="rounded-lg bg-blue-600 py-3">
                <h2 className="text-xl font-bold text-white">{schoolName.toUpperCase()}</h2>
              </div>

              <div className="flex justify-center">
                {student.photo_url ? (
                  <img
                    src={student.photo_url || "/placeholder.svg"}
                    alt={student.name}
                    className="h-32 w-32 rounded-full border-4 border-blue-200 object-cover"
                  />
                ) : (
                  <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-blue-200 bg-blue-100 text-5xl font-bold text-blue-600">
                    {student.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-2xl font-bold">{student.name}</h3>
                <p className="text-lg text-muted-foreground">ID: {student.student_id}</p>
              </div>

              <div className="flex justify-center">
                <div className="rounded-lg border-2 border-gray-300 bg-white p-2">
                  <canvas ref={canvasRef} className="h-32 w-32" />
                </div>
              </div>

              <p className="text-xs text-muted-foreground">Scan QR code for student information</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #id-card,
          #id-card * {
            visibility: visible;
          }
          #id-card {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
          }
        }
      `}</style>
    </div>
  )
}

// Simple QR Code generator
function generateQRCode(text: string, canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d")
  if (!ctx) return

  const size = 128
  canvas.width = size
  canvas.height = size

  // Simple QR-like pattern (for demo purposes)
  // In production, use a proper QR code library like 'qrcode'
  const moduleSize = 4
  const modules = size / moduleSize

  ctx.fillStyle = "white"
  ctx.fillRect(0, 0, size, size)

  ctx.fillStyle = "black"

  // Create a simple pattern based on the text
  const hash = text.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)

  for (let y = 0; y < modules; y++) {
    for (let x = 0; x < modules; x++) {
      const value = (hash * (x + 1) * (y + 1)) % 2
      if (value === 0) {
        ctx.fillRect(x * moduleSize, y * moduleSize, moduleSize, moduleSize)
      }
    }
  }

  // Add corner markers (like real QR codes)
  const markerSize = moduleSize * 7
  drawQRMarker(ctx, 0, 0, markerSize)
  drawQRMarker(ctx, size - markerSize, 0, markerSize)
  drawQRMarker(ctx, 0, size - markerSize, markerSize)
}

function drawQRMarker(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.fillStyle = "black"
  ctx.fillRect(x, y, size, size)
  ctx.fillStyle = "white"
  ctx.fillRect(x + size / 7, y + size / 7, (size * 5) / 7, (size * 5) / 7)
  ctx.fillStyle = "black"
  ctx.fillRect(x + (size * 2) / 7, y + (size * 2) / 7, (size * 3) / 7, (size * 3) / 7)
}
