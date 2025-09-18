import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BarChart3, Droplets, Zap, Leaf, AlertTriangle, CheckCircle, XCircle } from "lucide-react"

interface SoilData {
  location: string
  testDate: string
  ph: {
    value: number
    status: "low" | "optimal" | "high"
    recommendation: string
  }
  nutrients: {
    nitrogen: { value: number; status: "low" | "medium" | "high"; unit: string }
    phosphorus: { value: number; status: "low" | "medium" | "high"; unit: string }
    potassium: { value: number; status: "low" | "medium" | "high"; unit: string }
  }
  organicMatter: {
    value: number
    status: "low" | "medium" | "high"
    unit: string
  }
  moisture: {
    value: number
    status: "low" | "optimal" | "high"
    unit: string
  }
  recommendations: string[]
}

interface SoilAnalysisDisplayProps {
  data: SoilData
}

export function SoilAnalysisDisplay({ data }: SoilAnalysisDisplayProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "low":
        return "text-red-600"
      case "medium":
        return "text-yellow-600"
      case "high":
        return "text-blue-600"
      case "optimal":
        return "text-green-600"
      default:
        return "text-muted-foreground"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "low":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "medium":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "high":
        return <AlertTriangle className="h-4 w-4 text-blue-500" />
      case "optimal":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      low: "bg-red-100 text-red-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-blue-100 text-blue-800",
      optimal: "bg-green-100 text-green-800",
    }
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const getNutrientProgress = (status: string) => {
    switch (status) {
      case "low":
        return 25
      case "medium":
        return 65
      case "high":
        return 90
      default:
        return 0
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-secondary" />
          Soil Analysis Report
        </CardTitle>
        <CardDescription>
          {data.location} • Tested on {new Date(data.testDate).toLocaleDateString()}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* pH Level */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Soil pH Level</h4>
            <div className="flex items-center gap-2">
              {getStatusIcon(data.ph.status)}
              <Badge variant="outline" className={getStatusBadge(data.ph.status)}>
                {data.ph.status.charAt(0).toUpperCase() + data.ph.status.slice(1)}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-2xl font-bold">{data.ph.value}</div>
            <div className="flex-1">
              <Progress value={(data.ph.value / 14) * 100} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Acidic (0)</span>
                <span>Neutral (7)</span>
                <span>Alkaline (14)</span>
              </div>
            </div>
          </div>
          <Alert>
            <AlertDescription>{data.ph.recommendation}</AlertDescription>
          </Alert>
        </div>

        {/* Nutrients */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Nutrient Levels</h4>
          <div className="grid gap-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Leaf className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Nitrogen (N)</p>
                  <p className="text-sm text-muted-foreground">
                    {data.nutrients.nitrogen.value} {data.nutrients.nitrogen.unit}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(data.nutrients.nitrogen.status)}
                <Badge variant="outline" className={getStatusBadge(data.nutrients.nitrogen.status)}>
                  {data.nutrients.nitrogen.status}
                </Badge>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Zap className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium">Phosphorus (P)</p>
                  <p className="text-sm text-muted-foreground">
                    {data.nutrients.phosphorus.value} {data.nutrients.phosphorus.unit}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(data.nutrients.phosphorus.status)}
                <Badge variant="outline" className={getStatusBadge(data.nutrients.phosphorus.status)}>
                  {data.nutrients.phosphorus.status}
                </Badge>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <BarChart3 className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">Potassium (K)</p>
                  <p className="text-sm text-muted-foreground">
                    {data.nutrients.potassium.value} {data.nutrients.potassium.unit}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(data.nutrients.potassium.status)}
                <Badge variant="outline" className={getStatusBadge(data.nutrients.potassium.status)}>
                  {data.nutrients.potassium.status}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Organic Matter & Moisture */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Leaf className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Organic Matter</span>
            </div>
            <div className="text-lg font-bold">
              {data.organicMatter.value}
              {data.organicMatter.unit}
            </div>
            <Badge variant="outline" className={getStatusBadge(data.organicMatter.status)}>
              {data.organicMatter.status}
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Droplets className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Soil Moisture</span>
            </div>
            <div className="text-lg font-bold">
              {data.moisture.value}
              {data.moisture.unit}
            </div>
            <Badge variant="outline" className={getStatusBadge(data.moisture.status)}>
              {data.moisture.status}
            </Badge>
          </div>
        </div>

        {/* Recommendations */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Recommendations</h4>
          <div className="space-y-2">
            {data.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
                <CheckCircle className="h-4 w-4 text-secondary mt-0.5 flex-shrink-0" />
                <p className="text-sm">{recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
