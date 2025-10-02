"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, Loader2, AlertCircle } from "lucide-react"
import { useState } from "react"

export function AIInsightsCard() {
  const [insights, setInsights] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<{ message: string; details?: string } | null>(null)

  const generateInsights = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/ai-insights", {
        method: "POST",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.details || data.error || "Failed to generate insights")
      }

      setInsights(data.insights)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to generate AI insights. Please try again."
      setError({
        message: "Failed to generate AI insights",
        details: errorMessage,
      })
      console.error("[v0] AI Insights error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          <Sparkles className="h-5 w-5 text-purple-600" />
          AI-Powered Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!insights && !isLoading && !error && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Get AI-powered analysis of your classroom attendance patterns, identify students who need attention, and
              receive actionable recommendations.
            </p>
            <Button
              onClick={generateInsights}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Insights
            </Button>
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            <p className="mt-4 text-sm text-muted-foreground">Analyzing attendance data...</p>
            <p className="mt-2 text-xs text-muted-foreground">This may take a few moments</p>
          </div>
        )}

        {error && (
          <div className="space-y-3 rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600 mt-0.5" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium text-red-900">{error.message}</p>
                {error.details && <p className="text-xs text-red-700">{error.details}</p>}
              </div>
            </div>
            <Button
              onClick={generateInsights}
              variant="outline"
              size="sm"
              className="w-full border-red-200 bg-white hover:bg-red-50"
            >
              Try Again
            </Button>
          </div>
        )}

        {insights && (
          <div className="space-y-4">
            <div className="prose prose-sm max-w-none rounded-lg bg-white p-4 shadow-sm">
              <div className="whitespace-pre-wrap text-sm leading-relaxed">{insights}</div>
            </div>
            <Button
              onClick={generateInsights}
              variant="outline"
              size="sm"
              className="w-full border-purple-200 bg-transparent hover:bg-purple-50"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Regenerate Insights
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
