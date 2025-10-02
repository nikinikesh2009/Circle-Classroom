"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, X, AlertCircle } from "lucide-react"
import { toast } from "sonner"

interface QRScannerProps {
  onScan: (data: string) => void
  onClose: () => void
}

export function QRScanner({ onScan, onClose }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [stream])

  const startScanning = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        videoRef.current.play()
      }
      setIsScanning(true)
      scanQRCode()
    } catch (error) {
      console.error("Error accessing camera:", error)
      toast.error("Failed to access camera. Please check permissions.")
    }
  }

  const stopScanning = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
    setIsScanning(false)
  }

  const scanQRCode = () => {
    if (!videoRef.current || !canvasRef.current || !isScanning) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")

    if (!context || video.readyState !== video.HAVE_ENOUGH_DATA) {
      requestAnimationFrame(scanQRCode)
      return
    }

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height)

    // Simple QR detection (in production, use a library like jsQR)
    // For now, we'll use manual input as fallback
    requestAnimationFrame(scanQRCode)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Scan Student ID Card</CardTitle>
            <CardDescription>Point camera at student's QR code</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isScanning ? (
          <div className="space-y-4">
            <div className="flex aspect-video items-center justify-center rounded-lg border-2 border-dashed bg-muted">
              <div className="text-center">
                <Camera className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">Camera preview will appear here</p>
              </div>
            </div>
            <Button onClick={startScanning} className="w-full">
              <Camera className="mr-2 h-4 w-4" />
              Start Camera
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative aspect-video overflow-hidden rounded-lg border-2 border-primary">
              <video ref={videoRef} className="h-full w-full object-cover" playsInline />
              <canvas ref={canvasRef} className="hidden" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-48 w-48 border-4 border-primary rounded-lg" />
              </div>
            </div>
            <Button onClick={stopScanning} variant="destructive" className="w-full">
              Stop Scanning
            </Button>
          </div>
        )}

        <div className="rounded-lg border bg-muted/50 p-4">
          <p className="text-sm text-muted-foreground">
            <AlertCircle className="inline h-4 w-4 mr-1" />
            Position the QR code within the frame for automatic scanning
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
