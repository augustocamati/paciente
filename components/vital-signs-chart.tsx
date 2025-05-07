"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Activity, Droplet, Thermometer } from "lucide-react"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface VitalSignsChartProps {
  patientId: number
}

interface VitalRecord {
  id: number
  patient_id: number
  spo2: number
  bpm: number
  temperature: number
  recorded_at: string
}

export default function VitalSignsChart({ patientId }: VitalSignsChartProps) {
  const [vitalHistory, setVitalHistory] = useState<VitalRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState("24h")

  useEffect(() => {
    if (!patientId) return

    const fetchVitalHistory = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const token = localStorage.getItem("authToken")
        if (!token) {
          throw new Error("Não autorizado")
        }

        const response = await fetch(`/api/patients/${patientId}/vitals?timeRange=${timeRange}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Falha ao carregar histórico de sinais vitais")
        }

        const data = await response.json()
        setVitalHistory(data)
      } catch (err) {
        console.error("Erro ao buscar histórico:", err)
        setError(err instanceof Error ? err.message : "Erro ao carregar dados")
      } finally {
        setIsLoading(false)
      }
    }

    fetchVitalHistory()
  }, [patientId, timeRange])

  // Formatar dados para o gráfico
  const formatChartData = (data: VitalRecord[]) => {
    return data.map((record) => ({
      time: new Date(record.recorded_at).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      date: new Date(record.recorded_at).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      }),
      spo2: record.spo2,
      bpm: record.bpm,
      temperature: record.temperature,
      fullDate: new Date(record.recorded_at),
    }))
  }

  const chartData = formatChartData(vitalHistory)

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>Histórico de Sinais Vitais</CardTitle>
            <CardDescription>Visualize a evolução dos sinais vitais ao longo do tempo</CardDescription>
          </div>
          <div className="w-full sm:w-48">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6h">Últimas 6 horas</SelectItem>
                <SelectItem value="12h">Últimas 12 horas</SelectItem>
                <SelectItem value="24h">Últimas 24 horas</SelectItem>
                <SelectItem value="48h">Últimas 48 horas</SelectItem>
                <SelectItem value="7d">Últimos 7 dias</SelectItem>
                <SelectItem value="30d">Últimos 30 dias</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">Todos os Sinais</TabsTrigger>
            <TabsTrigger value="spo2">Saturação de O₂</TabsTrigger>
            <TabsTrigger value="bpm">Freq. Cardíaca</TabsTrigger>
            <TabsTrigger value="temperature">Temperatura</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            {isLoading ? (
              <div className="h-[400px] flex items-center justify-center">
                <p className="text-muted-foreground">Carregando dados...</p>
              </div>
            ) : error ? (
              <div className="h-[400px] flex items-center justify-center">
                <p className="text-red-500">{error}</p>
              </div>
            ) : vitalHistory.length === 0 ? (
              <div className="h-[400px] flex items-center justify-center">
                <p className="text-muted-foreground">Nenhum dado disponível para o período selecionado</p>
              </div>
            ) : (
              <ChartContainer
                config={{
                  spo2: {
                    label: "Saturação de O₂ (%)",
                    color: "hsl(var(--chart-1))",
                  },
                  bpm: {
                    label: "Freq. Cardíaca (BPM)",
                    color: "hsl(var(--chart-2))",
                  },
                  temperature: {
                    label: "Temperatura (°C)",
                    color: "hsl(var(--chart-3))",
                  },
                }}
                className="h-[400px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey={timeRange.includes("d") ? "date" : "time"}
                      label={{ value: "Horário", position: "insideBottomRight", offset: -10 }}
                    />
                    <YAxis yAxisId="left" orientation="left" domain={[85, 100]} />
                    <YAxis yAxisId="right" orientation="right" domain={[40, 140]} />
                    <YAxis yAxisId="right2" orientation="right" domain={[35, 40]} hide />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="spo2"
                      stroke="var(--color-spo2)"
                      name="Saturação de O₂ (%)"
                      dot={{ r: 2 }}
                      activeDot={{ r: 5 }}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="bpm"
                      stroke="var(--color-bpm)"
                      name="Freq. Cardíaca (BPM)"
                      dot={{ r: 2 }}
                      activeDot={{ r: 5 }}
                    />
                    <Line
                      yAxisId="right2"
                      type="monotone"
                      dataKey="temperature"
                      stroke="var(--color-temperature)"
                      name="Temperatura (°C)"
                      dot={{ r: 2 }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </TabsContent>

          <TabsContent value="spo2">
            {isLoading ? (
              <div className="h-[400px] flex items-center justify-center">
                <p className="text-muted-foreground">Carregando dados...</p>
              </div>
            ) : error ? (
              <div className="h-[400px] flex items-center justify-center">
                <p className="text-red-500">{error}</p>
              </div>
            ) : vitalHistory.length === 0 ? (
              <div className="h-[400px] flex items-center justify-center">
                <p className="text-muted-foreground">Nenhum dado disponível para o período selecionado</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Droplet className="h-5 w-5 text-blue-600" />
                  <h3 className="font-medium">Saturação de Oxigênio (SpO₂)</h3>
                </div>
                <ChartContainer
                  config={{
                    spo2: {
                      label: "Saturação de O₂ (%)",
                      color: "hsl(221, 83%, 53%)",
                    },
                  }}
                  className="h-[400px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={chartData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey={timeRange.includes("d") ? "date" : "time"}
                        label={{ value: "Horário", position: "insideBottomRight", offset: -10 }}
                      />
                      <YAxis domain={[85, 100]} label={{ value: "SpO₂ (%)", angle: -90, position: "insideLeft" }} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="spo2"
                        stroke="#3b82f6"
                        name="Saturação de O₂ (%)"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            )}
          </TabsContent>

          <TabsContent value="bpm">
            {isLoading ? (
              <div className="h-[400px] flex items-center justify-center">
                <p className="text-muted-foreground">Carregando dados...</p>
              </div>
            ) : error ? (
              <div className="h-[400px] flex items-center justify-center">
                <p className="text-red-500">{error}</p>
              </div>
            ) : vitalHistory.length === 0 ? (
              <div className="h-[400px] flex items-center justify-center">
                <p className="text-muted-foreground">Nenhum dado disponível para o período selecionado</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-rose-600" />
                  <h3 className="font-medium">Frequência Cardíaca (BPM)</h3>
                </div>
                <ChartContainer
                  config={{
                    bpm: {
                      label: "Freq. Cardíaca (BPM)",
                      color: "hsl(346, 84%, 61%)",
                    },
                  }}
                  className="h-[400px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={chartData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey={timeRange.includes("d") ? "date" : "time"}
                        label={{ value: "Horário", position: "insideBottomRight", offset: -10 }}
                      />
                      <YAxis domain={[40, 140]} label={{ value: "BPM", angle: -90, position: "insideLeft" }} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="bpm"
                        stroke="#e11d48"
                        name="Freq. Cardíaca (BPM)"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            )}
          </TabsContent>

          <TabsContent value="temperature">
            {isLoading ? (
              <div className="h-[400px] flex items-center justify-center">
                <p className="text-muted-foreground">Carregando dados...</p>
              </div>
            ) : error ? (
              <div className="h-[400px] flex items-center justify-center">
                <p className="text-red-500">{error}</p>
              </div>
            ) : vitalHistory.length === 0 ? (
              <div className="h-[400px] flex items-center justify-center">
                <p className="text-muted-foreground">Nenhum dado disponível para o período selecionado</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Thermometer className="h-5 w-5 text-orange-600" />
                  <h3 className="font-medium">Temperatura (°C)</h3>
                </div>
                <ChartContainer
                  config={{
                    temperature: {
                      label: "Temperatura (°C)",
                      color: "hsl(24, 90%, 50%)",
                    },
                  }}
                  className="h-[400px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={chartData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey={timeRange.includes("d") ? "date" : "time"}
                        label={{ value: "Horário", position: "insideBottomRight", offset: -10 }}
                      />
                      <YAxis
                        domain={[35, 40]}
                        label={{ value: "Temperatura (°C)", angle: -90, position: "insideLeft" }}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="temperature"
                        stroke="#f97316"
                        name="Temperatura (°C)"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
