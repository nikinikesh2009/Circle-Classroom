"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, Loader2 } from "lucide-react"
import { useState } from "react"

export function AIInsightsCard() {
  const [insights, setInsights] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateInsights = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/ai-insights", {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to generate insights")
      }

      const data = await response.json()
      setInsights(data.insights)
    } catch (err) {
      setError("Failed to generate AI insights. Please try again.")
      console.error(err)
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
        {!insights && !isLoading && (
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
          </div>
        )}

        {error && (
          <div className="rounded-lg bg-red-50 p-4">
            <p className="text-sm text-red-600">{error}</p>
            <Button onClick={generateInsights} variant="outline" size="sm" className="mt-2 bg-transparent">
              Try Again
            </Button>
          </div>
        )}

        {insights && (
          <div className="space-y-4">
            <div className="prose prose-sm max-w-none rounded-lg bg-white p-4">
              <div className="whitespace-pre-wrap text-sm">{insights}</div>
            </div>
            <Button
              onClick={generateInsights}
              variant="outline"
              size="sm"
              className="w-full border-purple-200 hover:bg-purple-50 bg-transparent"
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
