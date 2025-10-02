"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { QrCode, X, Clock, CheckCircle } from "lucide-react"
import QRCodeLib from "qrcode"
import type { AttendanceSession } from "@/lib/types"

export function QrAttendanceGenerator() {
  const [sessionName, setSessionName] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [duration, setDuration] = useState("30")
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentSession, setCurrentSession] = useState<AttendanceSession | null>(null)
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (currentSession) {
      const interval = setInterval(() => {
        const now = new Date()
        const endTime = new Date(currentSession.end_time)
        const remaining = Math.max(0, Math.floor((endTime.getTime() - now.getTime()) / 1000))

        setTimeRemaining(remaining)

        if (remaining === 0) {
          handleDeactivateSession()
        }
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [currentSession])

  useEffect(() => {
    if (currentSession && canvasRef.current) {
      generateQRCode(currentSession.qr_code_data)
    }
  }, [currentSession])

  const generateQRCode = async (data: string) => {
    try {
      // Generate scan URL
      const scanUrl = `${window.location.origin}/scan?code=${encodeURIComponent(data)}`

      // Generate QR code as data URL
      const url = await QRCodeLib.toDataURL(scanUrl, {
        width: 300,
        margin: 2,
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

  const handleGenerateQR = async () => {
    if (!sessionName.trim()) {
      alert("Please enter a session name")
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch("/api/attendance/qr-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionName,
          date,
          durationMinutes: Number.parseInt(duration),
        }),
      })

      const data = await response.json()
      if (data.session) {
        setCurrentSession(data.session)
      }
    } catch (error) {
      console.error("Error generating QR code:", error)
      alert("Failed to generate QR code")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDeactivateSession = async () => {
    if (!currentSession) return

    try {
      await fetch("/api/attendance/deactivate-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: currentSession.id }),
      })

      setCurrentSession(null)
      setQrCodeUrl("")
      setTimeRemaining(null)
      setSessionName("")
    } catch (error) {
      console.error("Error deactivating session:", error)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (currentSession) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                <CheckCircle className="h-6 w-6 text-green-600" />
                Active QR Session
              </CardTitle>
              <CardDescription className="mt-2">
                Students can scan this QR code to mark their attendance
              </CardDescription>
            </div>
            <Button variant="destructive" size="sm" onClick={handleDeactivateSession}>
              <X className="mr-2 h-4 w-4" />
              End Session
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg border-2 border-green-200 bg-green-50 p-4">
            <h3 className="mb-2 text-lg font-semibold">{currentSession.session_name}</h3>
            <p className="text-sm text-muted-foreground">Date: {new Date(currentSession.date).toLocaleDateString()}</p>
            {timeRemaining !== null && (
              <div className="mt-3 flex items-center gap-2 text-lg font-bold text-green-600">
                <Clock className="h-5 w-5" />
                Time Remaining: {formatTime(timeRemaining)}
              </div>
            )}
          </div>

          <div className="flex justify-center">
            <div className="rounded-lg border-4 border-gray-300 bg-white p-4 shadow-lg">
              {qrCodeUrl && <img src={qrCodeUrl || "/placeholder.svg"} alt="QR Code" className="h-[300px] w-[300px]" />}
              <canvas ref={canvasRef} className="hidden" />
            </div>
          </div>

          <div className="rounded-lg bg-blue-50 p-4 text-center">
            <p className="text-sm font-medium text-blue-900">
              📱 Students: Scan this QR code with your phone camera to mark attendance
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          <QrCode className="h-6 w-6 text-blue-600" />
          Generate QR Code for Attendance
        </CardTitle>
        <CardDescription>Create a time-limited QR code that students can scan to mark their attendance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="session-name">Session Name</Label>
          <Input
            id="session-name"
            placeholder="e.g., Morning Class, Period 1, etc."
            value={sessionName}
            onChange={(e) => setSessionName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration">QR Code Valid For</Label>
          <Select value={duration} onValueChange={setDuration}>
            <SelectTrigger id="duration">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15">15 minutes</SelectItem>
              <SelectItem value="30">30 minutes</SelectItem>
              <SelectItem value="45">45 minutes</SelectItem>
              <SelectItem value="60">1 hour</SelectItem>
              <SelectItem value="90">1.5 hours</SelectItem>
              <SelectItem value="120">2 hours</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleGenerateQR}
          disabled={isGenerating}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          {isGenerating ? "Generating..." : "Generate QR Code"}
        </Button>
      </CardContent>
    </Card>
  )
}
