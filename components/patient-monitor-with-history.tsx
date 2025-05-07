"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Activity, Thermometer, Droplet, AlertTriangle, History, Settings } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import ThresholdSettings from "@/components/threshold-settings"
import VitalSignsChart from "@/components/vital-signs-chart"

// Função para gerar valores aleatórios dentro de um intervalo
const getRandomValue = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

interface PatientMonitorWithHistoryProps {
  patient: any
}

export default function PatientMonitorWithHistory({ patient }: PatientMonitorWithHistoryProps) {
  // Estado inicial para os sinais vitais
  const [vitals, setVitals] = useState({
    spo2: 98,
    bpm: 75,
    temperature: 36.5,
  })

  // Estado para os limites personalizados
  const [thresholds, setThresholds] = useState({
    spo2: { min: 95, max: 100 },
    bpm: { min: 60, max: 100 },
    temperature: { min: 36.0, max: 37.5 },
  })

  // Simular mudanças nos sinais vitais a cada 3 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      // Gerar valores aleatórios, mas com maior probabilidade de estar dentro dos limites
      const newSpo2 = getRandomValue(patient.status === "critical" ? 88 : 94, patient.status === "critical" ? 94 : 100)

      const newBpm = getRandomValue(patient.status === "critical" ? 50 : 60, patient.status === "critical" ? 120 : 100)

      const newTemp = Number(
        (
          getRandomValue(patient.status === "critical" ? 350 : 360, patient.status === "critical" ? 385 : 375) / 10
        ).toFixed(1),
      )

      setVitals({
        spo2: newSpo2,
        bpm: newBpm,
        temperature: newTemp,
      })

      // Enviar dados para a API (em produção, isso viria de dispositivos reais)
      sendVitalData(newSpo2, newBpm, newTemp)
    }, 3000)

    return () => clearInterval(interval)
  }, [patient])

  // Função para enviar dados de sinais vitais para a API
  const sendVitalData = async (spo2: number, bpm: number, temperature: number) => {
    try {
      const token = localStorage.getItem("authToken")
      if (!token) return

      await fetch(`/api/patients/${patient.id}/vitals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ spo2, bpm, temperature }),
      })
    } catch (error) {
      console.error("Erro ao enviar dados vitais:", error)
    }
  }

  // Função para determinar a cor baseada no valor e nos limites
  const getStatusColor = (type: string, value: number) => {
    switch (type) {
      case "spo2":
        return value < thresholds.spo2.min ? "text-amber-500" : value < 90 ? "text-red-500" : "text-emerald-500"
      case "bpm":
        return value < thresholds.bpm.min
          ? "text-amber-500"
          : value > thresholds.bpm.max
            ? "text-red-500"
            : "text-emerald-500"
      case "temperature":
        return value < thresholds.temperature.min
          ? "text-amber-500"
          : value > thresholds.temperature.max
            ? "text-red-500"
            : "text-emerald-500"
      default:
        return "text-emerald-500"
    }
  }

  // Função para determinar o background baseado no valor
  const getCardBackground = (type: string, value: number) => {
    switch (type) {
      case "spo2":
        return value < thresholds.spo2.min
          ? "bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200"
          : value < 90
            ? "bg-gradient-to-br from-red-50 to-red-100 border-red-200"
            : "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200"
      case "bpm":
        return value < thresholds.bpm.min
          ? "bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200"
          : value > thresholds.bpm.max
            ? "bg-gradient-to-br from-red-50 to-red-100 border-red-200"
            : "bg-gradient-to-br from-rose-50 to-rose-100 border-rose-200"
      case "temperature":
        return value < thresholds.temperature.min
          ? "bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200"
          : value > thresholds.temperature.max
            ? "bg-gradient-to-br from-red-50 to-red-100 border-red-200"
            : "bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200"
      default:
        return "bg-gradient-to-br from-gray-50 to-gray-100"
    }
  }

  // Verificar se algum valor está fora do normal
  const hasAlert =
    vitals.spo2 < thresholds.spo2.min ||
    vitals.bpm < thresholds.bpm.min ||
    vitals.bpm > thresholds.bpm.max ||
    vitals.temperature < thresholds.temperature.min ||
    vitals.temperature > thresholds.temperature.max

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">{patient.name}</CardTitle>
              <div className="text-sm text-muted-foreground mt-1">
                {patient.age} anos • {patient.gender} • Quarto {patient.room} • Prontuário: {patient.medicalRecord}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Configurar Limites
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Configurar Limites de Monitoramento</DialogTitle>
                    <DialogDescription>
                      Defina os limites personalizados para os sinais vitais deste paciente.
                    </DialogDescription>
                  </DialogHeader>
                  <ThresholdSettings
                    thresholds={thresholds}
                    onSave={(newThresholds) => {
                      setThresholds(newThresholds)
                      // Aqui enviaria para a API
                    }}
                  />
                </DialogContent>
              </Dialog>

              <Button variant="outline" size="sm">
                <History className="h-4 w-4 mr-2" />
                Histórico
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {hasAlert && (
        <div className="p-4 bg-red-100 border border-red-300 rounded-lg flex items-center gap-3 animate-pulse">
          <AlertTriangle className="h-6 w-6 text-red-500" />
          <span className="font-medium text-red-700">
            Alerta: Um ou mais sinais vitais estão fora dos limites definidos!
          </span>
        </div>
      )}

      <Tabs defaultValue="realtime">
        <TabsList className="mb-4">
          <TabsTrigger value="realtime">Tempo Real</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="realtime">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* SPO2 Card */}
            <Card
              className={`shadow-lg border-2 transition-all duration-500 ${getCardBackground("spo2", vitals.spo2)}`}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium text-gray-800">Saturação de Oxigênio</CardTitle>
                <div className="p-2 bg-white rounded-full shadow-sm">
                  <Droplet className="h-5 w-5 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-6">
                  <div
                    className="w-24 h-24 rounded-full bg-white shadow-inner flex items-center justify-center mb-3 border-4 border-opacity-50"
                    style={{
                      borderColor:
                        vitals.spo2 < thresholds.spo2.min ? "#f59e0b" : vitals.spo2 < 90 ? "#ef4444" : "#10b981",
                    }}
                  >
                    <span className={`text-5xl font-bold ${getStatusColor("spo2", vitals.spo2)}`}>{vitals.spo2}</span>
                  </div>
                  <span className="text-2xl font-semibold text-gray-700">%</span>
                  <div className="text-xs text-center text-gray-600 mt-4 bg-white px-3 py-1 rounded-full shadow-sm">
                    Limite: {thresholds.spo2.min}-{thresholds.spo2.max}%
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* BPM Card */}
            <Card className={`shadow-lg border-2 transition-all duration-500 ${getCardBackground("bpm", vitals.bpm)}`}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium text-gray-800">Frequência Cardíaca</CardTitle>
                <div className="p-2 bg-white rounded-full shadow-sm">
                  <Activity className="h-5 w-5 text-rose-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-6">
                  <div
                    className="w-24 h-24 rounded-full bg-white shadow-inner flex items-center justify-center mb-3 border-4 border-opacity-50"
                    style={{
                      borderColor:
                        vitals.bpm < thresholds.bpm.min
                          ? "#f59e0b"
                          : vitals.bpm > thresholds.bpm.max
                            ? "#ef4444"
                            : "#10b981",
                    }}
                  >
                    <span className={`text-5xl font-bold ${getStatusColor("bpm", vitals.bpm)}`}>{vitals.bpm}</span>
                  </div>
                  <span className="text-2xl font-semibold text-gray-700">BPM</span>
                  <div className="text-xs text-center text-gray-600 mt-4 bg-white px-3 py-1 rounded-full shadow-sm">
                    Limite: {thresholds.bpm.min}-{thresholds.bpm.max} BPM
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Temperature Card */}
            <Card
              className={`shadow-lg border-2 transition-all duration-500 ${getCardBackground("temperature", vitals.temperature)}`}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium text-gray-800">Temperatura</CardTitle>
                <div className="p-2 bg-white rounded-full shadow-sm">
                  <Thermometer className="h-5 w-5 text-orange-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-6">
                  <div
                    className="w-24 h-24 rounded-full bg-white shadow-inner flex items-center justify-center mb-3 border-4 border-opacity-50"
                    style={{
                      borderColor:
                        vitals.temperature < thresholds.temperature.min
                          ? "#f59e0b"
                          : vitals.temperature > thresholds.temperature.max
                            ? "#ef4444"
                            : "#10b981",
                    }}
                  >
                    <span className={`text-5xl font-bold ${getStatusColor("temperature", vitals.temperature)}`}>
                      {vitals.temperature}
                    </span>
                  </div>
                  <span className="text-2xl font-semibold text-gray-700">°C</span>
                  <div className="text-xs text-center text-gray-600 mt-4 bg-white px-3 py-1 rounded-full shadow-sm">
                    Limite: {thresholds.temperature.min}-{thresholds.temperature.max} °C
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history">
          {patient && patient.id ? (
            <VitalSignsChart patientId={patient.id} />
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="h-64 flex items-center justify-center">
                  <p className="text-muted-foreground">Selecione um paciente para visualizar o histórico</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
