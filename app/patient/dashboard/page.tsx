"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Activity, Thermometer, Droplet, Bell, User, LogOut, FileText, Calendar, Settings } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

// Dados simulados do paciente
const patientData = {
  id: 1,
  name: "João Silva",
  age: 65,
  gender: "Masculino",
  medicalRecord: "12345",
  doctor: "Dra. Ana Silva",
  condition: "Hipertensão e Diabetes",
  lastCheckup: "15/04/2023",
}

// Dados simulados de sinais vitais
const vitalHistory = [
  { date: "2023-05-01", spo2: 98, bpm: 72, temperature: 36.5 },
  { date: "2023-05-02", spo2: 97, bpm: 75, temperature: 36.7 },
  { date: "2023-05-03", spo2: 96, bpm: 78, temperature: 36.8 },
  { date: "2023-05-04", spo2: 95, bpm: 80, temperature: 37.0 },
  { date: "2023-05-05", spo2: 94, bpm: 82, temperature: 37.2 },
  { date: "2023-05-06", spo2: 95, bpm: 79, temperature: 37.0 },
  { date: "2023-05-07", spo2: 96, bpm: 76, temperature: 36.8 },
]

export default function PatientDashboard() {
  const [currentVitals, setCurrentVitals] = useState({
    spo2: 96,
    bpm: 76,
    temperature: 36.8,
  })

  // Limites personalizados para o paciente
  const thresholds = {
    spo2: { min: 94, max: 100 },
    bpm: { min: 60, max: 100 },
    temperature: { min: 36.0, max: 37.5 },
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
            : "bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200"
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-indigo-100">
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold">
              MC
            </div>
            <h1 className="text-xl font-bold text-gray-800">MediCare</h1>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar>
                    <AvatarFallback className="bg-emerald-200 text-emerald-700">
                      {patientData.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configurações</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Olá, {patientData.name}</CardTitle>
                  <CardDescription>Bem-vindo ao seu painel de monitoramento</CardDescription>
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Date().toLocaleDateString("pt-BR", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Informações do Paciente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarFallback className="text-2xl bg-emerald-200 text-emerald-700">
                      {patientData.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-semibold">{patientData.name}</h3>
                  <p className="text-muted-foreground">
                    {patientData.age} anos • {patientData.gender}
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Prontuário:</span>
                    <span className="font-medium">{patientData.medicalRecord}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Médico:</span>
                    <span className="font-medium">{patientData.doctor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Condição:</span>
                    <span className="font-medium">{patientData.condition}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Última Consulta:</span>
                    <span className="font-medium">{patientData.lastCheckup}</span>
                  </div>
                </div>

                <div className="pt-4 space-y-2">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="#">
                      <FileText className="mr-2 h-4 w-4" />
                      Meus Relatórios
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="#">
                      <Calendar className="mr-2 h-4 w-4" />
                      Agendar Consulta
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <Tabs defaultValue="current">
              <TabsList className="mb-4">
                <TabsTrigger value="current">Sinais Vitais Atuais</TabsTrigger>
                <TabsTrigger value="history">Histórico</TabsTrigger>
              </TabsList>

              <TabsContent value="current">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* SPO2 Card */}
                  <Card
                    className={`shadow-lg border-2 transition-all duration-500 ${getCardBackground("spo2", currentVitals.spo2)}`}
                  >
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-lg font-medium text-gray-800">Saturação de Oxigênio</CardTitle>
                      <div className="p-2 bg-white rounded-full shadow-sm">
                        <Droplet className="h-5 w-5 text-emerald-600" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center justify-center py-6">
                        <div
                          className="w-24 h-24 rounded-full bg-white shadow-inner flex items-center justify-center mb-3 border-4 border-opacity-50"
                          style={{
                            borderColor:
                              currentVitals.spo2 < thresholds.spo2.min
                                ? "#f59e0b"
                                : currentVitals.spo2 < 90
                                  ? "#ef4444"
                                  : "#10b981",
                          }}
                        >
                          <span className={`text-5xl font-bold ${getStatusColor("spo2", currentVitals.spo2)}`}>
                            {currentVitals.spo2}
                          </span>
                        </div>
                        <span className="text-2xl font-semibold text-gray-700">%</span>
                        <div className="text-xs text-center text-gray-600 mt-4 bg-white px-3 py-1 rounded-full shadow-sm">
                          Limite: {thresholds.spo2.min}-{thresholds.spo2.max}%
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* BPM Card */}
                  <Card
                    className={`shadow-lg border-2 transition-all duration-500 ${getCardBackground("bpm", currentVitals.bpm)}`}
                  >
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
                              currentVitals.bpm < thresholds.bpm.min
                                ? "#f59e0b"
                                : currentVitals.bpm > thresholds.bpm.max
                                  ? "#ef4444"
                                  : "#10b981",
                          }}
                        >
                          <span className={`text-5xl font-bold ${getStatusColor("bpm", currentVitals.bpm)}`}>
                            {currentVitals.bpm}
                          </span>
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
                    className={`shadow-lg border-2 transition-all duration-500 ${getCardBackground("temperature", currentVitals.temperature)}`}
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
                              currentVitals.temperature < thresholds.temperature.min
                                ? "#f59e0b"
                                : currentVitals.temperature > thresholds.temperature.max
                                  ? "#ef4444"
                                  : "#10b981",
                          }}
                        >
                          <span
                            className={`text-5xl font-bold ${getStatusColor("temperature", currentVitals.temperature)}`}
                          >
                            {currentVitals.temperature}
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
                <Card>
                  <CardHeader>
                    <CardTitle>Histórico de Sinais Vitais</CardTitle>
                    <CardDescription>Últimos 7 dias</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4">Data</th>
                            <th className="text-center py-3 px-4">SPO2 (%)</th>
                            <th className="text-center py-3 px-4">BPM</th>
                            <th className="text-center py-3 px-4">Temperatura (°C)</th>
                            <th className="text-center py-3 px-4">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {vitalHistory.map((record, index) => {
                            const hasAlert =
                              record.spo2 < thresholds.spo2.min ||
                              record.bpm < thresholds.bpm.min ||
                              record.bpm > thresholds.bpm.max ||
                              record.temperature < thresholds.temperature.min ||
                              record.temperature > thresholds.temperature.max

                            return (
                              <tr key={index} className="border-b">
                                <td className="py-3 px-4">{new Date(record.date).toLocaleDateString("pt-BR")}</td>
                                <td className="text-center py-3 px-4">
                                  <span
                                    className={
                                      record.spo2 < thresholds.spo2.min
                                        ? "text-amber-500 font-medium"
                                        : record.spo2 < 90
                                          ? "text-red-500 font-medium"
                                          : ""
                                    }
                                  >
                                    {record.spo2}
                                  </span>
                                </td>
                                <td className="text-center py-3 px-4">
                                  <span
                                    className={
                                      record.bpm < thresholds.bpm.min
                                        ? "text-amber-500 font-medium"
                                        : record.bpm > thresholds.bpm.max
                                          ? "text-red-500 font-medium"
                                          : ""
                                    }
                                  >
                                    {record.bpm}
                                  </span>
                                </td>
                                <td className="text-center py-3 px-4">
                                  <span
                                    className={
                                      record.temperature < thresholds.temperature.min
                                        ? "text-amber-500 font-medium"
                                        : record.temperature > thresholds.temperature.max
                                          ? "text-red-500 font-medium"
                                          : ""
                                    }
                                  >
                                    {record.temperature}
                                  </span>
                                </td>
                                <td className="text-center py-3 px-4">
                                  {hasAlert ? (
                                    <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                                      Alerta
                                    </Badge>
                                  ) : (
                                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                                      Normal
                                    </Badge>
                                  )}
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}
