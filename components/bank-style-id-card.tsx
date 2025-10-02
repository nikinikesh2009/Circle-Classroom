"use client"

import type { Student } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Printer, Download } from "lucide-react"
import { useEffect, useState } from "react"
import QRCodeLib from "qrcode"

interface BankStyleIdCardProps {
  student: Student
  schoolName: string
}

export function BankStyleIdCard({ student, schoolName }: BankStyleIdCardProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState("")

  useEffect(() => {
    generateQRCode()
  }, [student.id])

  const generateQRCode = async () => {
    try {
      const studentData = JSON.stringify({
        id: student.id,
        studentId: student.student_id,
        name: student.name,
        type: "student_id_card",
      })

      const url = await QRCodeLib.toDataURL(studentData, {
        width: 200,
        margin: 1,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      })

      setQrCodeUrl(url)
    } catch (error) {
      console.error("Error generating QR code:", error)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    const link = document.createElement("a")
    link.download = `${student.name.replace(/\s+/g, "_")}_ID_Card.png`
    link.href = qrCodeUrl
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
          Download
        </Button>
      </div>

      <div className="flex justify-center">
        <Card
          id="id-card"
          className="w-[400px] h-[250px] relative overflow-hidden border-0 shadow-2xl"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          }}
        >
          {/* Decorative circles */}
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
          <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-white/10" />

          <div className="relative z-10 flex h-full flex-col justify-between p-6 text-white">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider opacity-90">{schoolName}</h3>
                <p className="text-xs opacity-75">Student ID Card</p>
              </div>
              {student.photo_url ? (
                <img
                  src={student.photo_url || "/placeholder.svg"}
                  alt={student.name}
                  className="h-16 w-16 rounded-lg border-2 border-white/50 object-cover shadow-lg"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-lg border-2 border-white/50 bg-white/20 text-2xl font-bold shadow-lg">
                  {student.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Student Info */}
            <div className="space-y-1">
              <h2 className="text-2xl font-bold">{student.name}</h2>
              <div className="flex items-center gap-4 text-sm">
                <div>
                  <p className="opacity-75">ID</p>
                  <p className="font-mono font-semibold">{student.student_id}</p>
                </div>
                {student.class_grade && (
                  <div>
                    <p className="opacity-75">Class</p>
                    <p className="font-semibold">{student.class_grade}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer with QR */}
            <div className="flex items-end justify-between">
              <div className="text-xs space-y-0.5">
                {student.guardian_contact && (
                  <p className="opacity-90">
                    <span className="opacity-75">Guardian:</span> {student.guardian_contact}
                  </p>
                )}
                {student.blood_group && (
                  <p className="opacity-90">
                    <span className="opacity-75">Blood:</span> {student.blood_group}
                  </p>
                )}
              </div>
              {qrCodeUrl && (
                <div className="rounded-lg bg-white p-2 shadow-lg">
                  <img src={qrCodeUrl || "/placeholder.svg"} alt="Student QR Code" className="h-16 w-16" />
                </div>
              )}
            </div>
          </div>
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
