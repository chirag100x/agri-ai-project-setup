"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Leaf, Droplets, Thermometer, Calendar, TrendingUp, Info } from "lucide-react"

interface CropRecommendation {
  name: string
  variety: string
  suitabilityScore: number
  plantingWindow: string
  expectedYield: string
  waterRequirement: "Low" | "Medium" | "High"
  temperature: string
  marketDemand: "Low" | "Medium" | "High"
  reasons: string[]
  tips: string[]
}

interface CropRecommendationCardProps {
  recommendation: CropRecommendation
  onLearnMore?: () => void
}

export function CropRecommendationCard({ recommendation, onLearnMore }: CropRecommendationCardProps) {
  const getWaterColor = (level: string) => {
    switch (level) {
      case "Low":
        return "text-blue-400"
      case "Medium":
        return "text-blue-600"
      case "High":
        return "text-blue-800"
      default:
        return "text-muted-foreground"
    }
  }

  const getMarketColor = (demand: string) => {
    switch (demand) {
      case "Low":
        return "bg-red-100 text-red-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "High":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getSuitabilityColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-secondary/10 rounded-lg">
              <Leaf className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <CardTitle className="text-lg">{recommendation.name}</CardTitle>
              <CardDescription>{recommendation.variety}</CardDescription>
            </div>
          </div>
          <Badge variant="secondary" className={getMarketColor(recommendation.marketDemand)}>
            {recommendation.marketDemand} Demand
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Suitability Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Suitability Score</span>
            <span className={`text-sm font-bold ${getSuitabilityColor(recommendation.suitabilityScore)}`}>
              {recommendation.suitabilityScore}%
            </span>
          </div>
          <Progress value={recommendation.suitabilityScore} className="h-2" />
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Planting Window</p>
              <p className="text-sm font-medium">{recommendation.plantingWindow}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Expected Yield</p>
              <p className="text-sm font-medium">{recommendation.expectedYield}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Droplets className={`h-4 w-4 ${getWaterColor(recommendation.waterRequirement)}`} />
            <div>
              <p className="text-xs text-muted-foreground">Water Need</p>
              <p className="text-sm font-medium">{recommendation.waterRequirement}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Thermometer className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Temperature</p>
              <p className="text-sm font-medium">{recommendation.temperature}</p>
            </div>
          </div>
        </div>

        {/* Reasons */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Why this crop?</h4>
          <ul className="space-y-1">
            {recommendation.reasons.map((reason, index) => (
              <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-secondary mt-1">•</span>
                {reason}
              </li>
            ))}
          </ul>
        </div>

        {/* Tips */}
        {recommendation.tips.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Growing Tips</h4>
            <ul className="space-y-1">
              {recommendation.tips.map((tip, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-secondary mt-1">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Button */}
        {onLearnMore && (
          <Button variant="outline" className="w-full bg-transparent" onClick={onLearnMore}>
            <Info className="h-4 w-4 mr-2" />
            Learn More
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
