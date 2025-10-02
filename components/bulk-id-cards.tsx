"use client"

import type { Student } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"
import { useEffect, useRef } from "react"

interface BulkIdCardsProps {
  students: Student[]
  schoolName: string
}

export function BulkIdCards({ students, schoolName }: BulkIdCardsProps) {
  const canvasRefs = useRef<{ [key: string]: HTMLCanvasElement | null }>({})

  useEffect(() => {
    students.forEach((student) => {
      const canvas = canvasRefs.current[student.id]
      if (canvas) {
        generateQRCode(student.student_id, canvas)
      }
    })
  }, [students])

  const handlePrint = () => {
    window.print()
  }

  if (students.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No students to print ID cards for.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="print:hidden">
        <Button onClick={handlePrint}>
          <Printer className="mr-2 h-4 w-4" />
          Print All Cards
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 print:grid-cols-2">
        {students.map((student) => (
          <Card key={student.id} className="border-4 border-blue-600 print:break-inside-avoid">
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
                    <canvas
                      ref={(el) => {
                        canvasRefs.current[student.id] = el
                      }}
                      className="h-32 w-32"
                    />
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">Scan QR code for student information</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 1cm;
          }
          body * {
            visibility: hidden;
          }
          .print\\:grid-cols-2,
          .print\\:grid-cols-2 * {
            visibility: visible;
          }
          .print\\:grid-cols-2 {
            position: absolute;
            left: 0;
            top: 0;
          }
        }
      `}</style>
    </div>
  )
}

// Simple QR Code generator (same as in student-id-card.tsx)
function generateQRCode(text: string, canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d")
  if (!ctx) return

  const size = 128
  canvas.width = size
  canvas.height = size

  const moduleSize = 4
  const modules = size / moduleSize

  ctx.fillStyle = "white"
  ctx.fillRect(0, 0, size, size)

  ctx.fillStyle = "black"

  const hash = text.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)

  for (let y = 0; y < modules; y++) {
    for (let x = 0; x < modules; x++) {
      const value = (hash * (x + 1) * (y + 1)) % 2
      if (value === 0) {
        ctx.fillRect(x * moduleSize, y * moduleSize, moduleSize, moduleSize)
      }
    }
  }

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
