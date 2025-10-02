"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Download } from "lucide-react"

export function BulkImportForm() {
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [importResults, setImportResults] = useState<{ success: number; failed: number } | null>(null)
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setError(null)
      setImportResults(null)
    }
  }

  const downloadTemplate = () => {
    const csvContent = "name,student_id\nJohn Doe,S12345\nJane Smith,S12346"
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "student_import_template.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      setError("Please select a file")
      return
    }

    setIsLoading(true)
    setError(null)

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setError("You must be logged in")
      setIsLoading(false)
      return
    }

    try {
      const text = await file.text()
      const lines = text.split("\n").filter((line) => line.trim())
      const headers = lines[0].split(",").map((h) => h.trim())

      if (!headers.includes("name") || !headers.includes("student_id")) {
        throw new Error("CSV must have 'name' and 'student_id' columns")
      }

      const nameIndex = headers.indexOf("name")
      const idIndex = headers.indexOf("student_id")

      let successCount = 0
      let failedCount = 0

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(",").map((v) => v.trim())
        const name = values[nameIndex]
        const studentId = values[idIndex]

        if (!name || !studentId) {
          failedCount++
          continue
        }

        const { error: insertError } = await supabase.from("students").insert({
          teacher_id: user.id,
          name,
          student_id: studentId,
          photo_url: null,
        })

        if (insertError) {
          failedCount++
        } else {
          successCount++
        }
      }

      setImportResults({ success: successCount, failed: failedCount })
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl">
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="rounded-lg bg-blue-50 p-4">
            <h3 className="font-semibold text-blue-900">CSV Format Instructions</h3>
            <p className="mt-2 text-sm text-blue-800">
              Your CSV file must include columns: <code className="rounded bg-blue-100 px-1">name</code> and{" "}
              <code className="rounded bg-blue-100 px-1">student_id</code>
            </p>
            <Button variant="outline" size="sm" className="mt-3 bg-transparent" onClick={downloadTemplate}>
              <Download className="mr-2 h-4 w-4" />
              Download Template
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="csvFile">Select CSV File</Label>
              <Input id="csvFile" type="file" accept=".csv" onChange={handleFileChange} />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            {importResults && (
              <div className="rounded-lg bg-green-50 p-4">
                <p className="text-sm text-green-800">
                  Import complete: {importResults.success} students added successfully
                  {importResults.failed > 0 && `, ${importResults.failed} failed`}
                </p>
              </div>
            )}

            <div className="flex gap-2">
              <Button type="submit" disabled={isLoading || !file}>
                {isLoading ? "Importing..." : "Import Students"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  )
}
