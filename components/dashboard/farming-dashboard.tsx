"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WeatherWidget } from "@/components/weather/weather-widget"
import { CropRecommendationCard } from "@/components/crop/crop-recommendation-card"
import { SoilAnalysisDisplay } from "@/components/soil/soil-analysis-display"
import { Calendar, Droplets, Leaf, TrendingUp, AlertTriangle, CheckCircle, Clock } from "lucide-react"

// Mock data
const mockWeatherData = {
  location: "Punjab, India",
  current: {
    temperature: 24,
    condition: "Partly Cloudy",
    humidity: 65,
    windSpeed: 12,
    visibility: 10,
    pressure: 1013,
    uvIndex: 6,
  },
  forecast: [
    { date: "2024-01-20", high: 26, low: 18, condition: "Sunny", precipitation: 0 },
    { date: "2024-01-21", high: 24, low: 16, condition: "Partly Cloudy", precipitation: 10 },
    { date: "2024-01-22", high: 22, low: 14, condition: "Light Rain", precipitation: 60 },
    { date: "2024-01-23", high: 25, low: 17, condition: "Sunny", precipitation: 0 },
    { date: "2024-01-24", high: 27, low: 19, condition: "Sunny", precipitation: 0 },
    { date: "2024-01-25", high: 23, low: 15, condition: "Cloudy", precipitation: 20 },
    { date: "2024-01-26", high: 21, low: 13, condition: "Light Rain", precipitation: 40 },
  ],
  alerts: [
    {
      type: "Frost Warning",
      message: "Temperatures may drop below 5°C tonight",
      severity: "medium" as const,
    },
  ],
}

const mockCropRecommendation = {
  name: "Winter Wheat",
  variety: "HD-2967",
  suitabilityScore: 85,
  plantingWindow: "Nov 15 - Dec 15",
  expectedYield: "45-50 quintals/hectare",
  waterRequirement: "Medium" as const,
  temperature: "15-25°C",
  marketDemand: "High" as const,
  reasons: [
    "Optimal soil conditions for wheat cultivation",
    "Current weather patterns favor wheat growth",
    "High market demand and good pricing",
    "Suitable for your farm size and location",
  ],
  tips: [
    "Apply pre-sowing irrigation 7 days before planting",
    "Use certified seeds for better yield",
    "Monitor for aphid infestation during flowering",
    "Apply nitrogen fertilizer in split doses",
  ],
}

const mockSoilData = {
  location: "Field A - Punjab, India",
  testDate: "2024-01-15",
  ph: {
    value: 7.2,
    status: "optimal" as const,
    recommendation: "Your soil pH is in the optimal range for most crops. No immediate action needed.",
  },
  nutrients: {
    nitrogen: { value: 280, status: "medium" as const, unit: "kg/ha" },
    phosphorus: { value: 15, status: "low" as const, unit: "ppm" },
    potassium: { value: 320, status: "high" as const, unit: "kg/ha" },
  },
  organicMatter: {
    value: 2.8,
    status: "medium" as const,
    unit: "%",
  },
  moisture: {
    value: 18,
    status: "optimal" as const,
    unit: "%",
  },
  recommendations: [
    "Apply phosphorus-rich fertilizer before next planting season",
    "Consider adding organic compost to improve soil structure",
    "Current moisture levels are ideal for winter crops",
    "Monitor potassium levels as they are slightly elevated",
  ],
}

const mockTasks = [
  {
    id: 1,
    title: "Apply pre-sowing irrigation",
    description: "Water the field 7 days before wheat planting",
    dueDate: "2024-01-25",
    priority: "high" as const,
    status: "pending" as const,
    category: "irrigation",
  },
  {
    id: 2,
    title: "Soil preparation",
    description: "Deep plowing and leveling of Field A",
    dueDate: "2024-01-28",
    priority: "high" as const,
    status: "pending" as const,
    category: "preparation",
  },
  {
    id: 3,
    title: "Purchase certified seeds",
    description: "Buy HD-2967 wheat variety seeds",
    dueDate: "2024-01-30",
    priority: "medium" as const,
    status: "pending" as const,
    category: "procurement",
  },
  {
    id: 4,
    title: "Equipment maintenance",
    description: "Service tractor and planting equipment",
    dueDate: "2024-02-01",
    priority: "medium" as const,
    status: "completed" as const,
    category: "maintenance",
  },
]

export function FarmingDashboard() {
  const [tasks, setTasks] = useState(mockTasks)

  const toggleTaskStatus = (taskId: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, status: task.status === "completed" ? "pending" : "completed" } : task,
      ),
    )
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    return status === "completed" ? (
      <CheckCircle className="h-4 w-4 text-green-600" />
    ) : (
      <Clock className="h-4 w-4 text-yellow-600" />
    )
  }

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Leaf className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Crops</p>
                <p className="text-2xl font-bold">3</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Droplets className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Irrigation Status</p>
                <p className="text-2xl font-bold text-green-600">Good</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Tasks</p>
                <p className="text-2xl font-bold">{tasks.filter((t) => t.status === "pending").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Yield Forecast</p>
                <p className="text-2xl font-bold text-green-600">+12%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="soil">Soil Analysis</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <WeatherWidget data={mockWeatherData} />
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-secondary" />
                  Upcoming Activities
                </CardTitle>
                <CardDescription>Important farming activities for the next 7 days</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {tasks
                  .filter((task) => task.status === "pending")
                  .slice(0, 4)
                  .map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(task.status)}
                        <div>
                          <p className="font-medium">{task.title}</p>
                          <p className="text-sm text-muted-foreground">{task.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <CropRecommendationCard recommendation={mockCropRecommendation} />
        </TabsContent>

        <TabsContent value="soil" className="space-y-4">
          <SoilAnalysisDisplay data={mockSoilData} />
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Farm Tasks</CardTitle>
              <CardDescription>Manage your farming activities and track progress</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {tasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Button variant="ghost" size="sm" onClick={() => toggleTaskStatus(task.id)} className="p-0 h-auto">
                      {getStatusIcon(task.status)}
                    </Button>
                    <div>
                      <p
                        className={`font-medium ${task.status === "completed" ? "line-through text-muted-foreground" : ""}`}
                      >
                        {task.title}
                      </p>
                      <p className="text-sm text-muted-foreground">{task.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
