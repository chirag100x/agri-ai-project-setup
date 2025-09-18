"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CloudRain, Sun, Cloud, CloudSnow, Wind, Droplets, Eye, Gauge, Calendar } from "lucide-react"

interface WeatherData {
  location: string
  current: {
    temperature: number
    condition: string
    humidity: number
    windSpeed: number
    visibility: number
    pressure: number
    uvIndex: number
  }
  forecast: Array<{
    date: string
    high: number
    low: number
    condition: string
    precipitation: number
  }>
  alerts?: Array<{
    type: string
    message: string
    severity: "low" | "medium" | "high"
  }>
}

interface WeatherWidgetProps {
  data: WeatherData
}

export function WeatherWidget({ data }: WeatherWidgetProps) {
  const getWeatherIcon = (condition: string) => {
    const lowerCondition = condition.toLowerCase()
    if (lowerCondition.includes("rain") || lowerCondition.includes("shower")) {
      return <CloudRain className="h-8 w-8 text-blue-500" />
    }
    if (lowerCondition.includes("snow")) {
      return <CloudSnow className="h-8 w-8 text-blue-300" />
    }
    if (lowerCondition.includes("cloud")) {
      return <Cloud className="h-8 w-8 text-gray-500" />
    }
    return <Sun className="h-8 w-8 text-yellow-500" />
  }

  const getSmallWeatherIcon = (condition: string) => {
    const lowerCondition = condition.toLowerCase()
    if (lowerCondition.includes("rain")) {
      return <CloudRain className="h-4 w-4 text-blue-500" />
    }
    if (lowerCondition.includes("snow")) {
      return <CloudSnow className="h-4 w-4 text-blue-300" />
    }
    if (lowerCondition.includes("cloud")) {
      return <Cloud className="h-4 w-4 text-gray-500" />
    }
    return <Sun className="h-4 w-4 text-yellow-500" />
  }

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CloudRain className="h-5 w-5 text-secondary" />
          Weather Conditions
        </CardTitle>
        <CardDescription>{data.location}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Current Weather */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {getWeatherIcon(data.current.condition)}
            <div>
              <div className="text-3xl font-bold">{data.current.temperature}°C</div>
              <div className="text-sm text-muted-foreground">{data.current.condition}</div>
            </div>
          </div>
        </div>

        {/* Current Conditions Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Droplets className="h-4 w-4 text-blue-500" />
            <div>
              <p className="text-xs text-muted-foreground">Humidity</p>
              <p className="text-sm font-medium">{data.current.humidity}%</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Wind className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-xs text-muted-foreground">Wind Speed</p>
              <p className="text-sm font-medium">{data.current.windSpeed} km/h</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-xs text-muted-foreground">Visibility</p>
              <p className="text-sm font-medium">{data.current.visibility} km</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Gauge className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-xs text-muted-foreground">Pressure</p>
              <p className="text-sm font-medium">{data.current.pressure} hPa</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* 7-Day Forecast */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            7-Day Forecast
          </h4>
          <div className="space-y-2">
            {data.forecast.map((day, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  {getSmallWeatherIcon(day.condition)}
                  <span className="text-sm font-medium w-16">
                    {index === 0 ? "Today" : new Date(day.date).toLocaleDateString("en", { weekday: "short" })}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">{day.condition}</span>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">{day.high}°</span>
                    <span className="text-muted-foreground">{day.low}°</span>
                  </div>
                  {day.precipitation > 0 && (
                    <div className="flex items-center gap-1">
                      <Droplets className="h-3 w-3 text-blue-500" />
                      <span className="text-xs text-blue-600">{day.precipitation}%</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weather Alerts */}
        {data.alerts && data.alerts.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Weather Alerts</h4>
              {data.alerts.map((alert, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className={`${getAlertColor(alert.severity)} w-full justify-start`}
                >
                  <span className="font-medium">{alert.type}:</span>
                  <span className="ml-1">{alert.message}</span>
                </Badge>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
