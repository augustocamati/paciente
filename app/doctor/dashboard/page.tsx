"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Bell,
  LogOut,
  Settings,
  User,
  Search,
  Plus,
  Activity,
  Thermometer,
  Droplet,
  AlertTriangle,
  History,
  Users,
  FileText,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import ThresholdSettings from "@/components/threshold-settings"

// Dados simulados do médico
const doctorData = {
  id: 1,
  name: "Dra. Ana Silva",
  email: "ana.silva@hospital.com",
  specialty: "Cardiologia",
  avatar: "/placeholder.svg?height=40&width=40",
}

// Dados simulados de pacientes
const patientsData = [
  {
    id: 1,
    name: "João Silva",
    age: 65,
    gender: "Masculino",
    room: "101",
    status: "critical",
    medicalRecord: "12345",
    condition: "Hipertensão e Diabetes",
    lastCheckup: "15/04/2023",
  },
  {
    id: 2,
    name: "Maria Oliveira",
    age: 42,
    gender: "Feminino",
    room: "102",
    status: "stable",
    medicalRecord: "12346",
    condition: "Diabetes Tipo 2",
    lastCheckup: "20/04/2023",
  },
  {
    id: 3,
    name: "Pedro Santos",
    age: 58,
    gender: "Masculino",
    room: "103",
    status: "warning",
    medicalRecord: "12347",
    condition: "DPOC",
    lastCheckup: "18/04/2023",
  },
  {
    id: 4,
    name: "Ana Costa",
    age: 35,
    gender: "Feminino",
    room: "104",
    status: "stable",
    medicalRecord: "12348",
    condition: "Asma",
    lastCheckup: "22/04/2023",
  },
  {
    id: 5,
    name: "Carlos Ferreira",
    age: 70,
    gender: "Masculino",
    room: "105",
    status: "stable",
    medicalRecord: "12349",
    condition: "Insuficiência Cardíaca",
    lastCheckup: "10/04/2023",
  },
]

// Dados simulados de alertas
const alertsData = [
  {
    id: 1,
    patientId: 1,
    patientName: "João Silva",
    type: "critical",
    message: "Saturação de oxigênio abaixo do limite (88%)",
    timestamp: "2023-05-07T08:30:00",
    acknowledged: false,
  },
  {
    id: 2,
    patientId: 3,
    patientName: "Pedro Santos",
    type: "warning",
    message: "Frequência cardíaca elevada (110 BPM)",
    timestamp: "2023-05-07T09:15:00",
    acknowledged: false,
  },
  {
    id: 3,
    patientId: 5,
    patientName: "Carlos Ferreira",
    type: "warning",
    message: "Temperatura acima do limite (37.8°C)",
    timestamp: "2023-05-06T14:45:00",
    acknowledged: true,
  },
]

// Função para gerar valores aleatórios dentro de um intervalo
const getRandomValue = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export default function DoctorDashboard() {
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [vitals, setVitals] = useState({
    spo2: 98,
    bpm: 75,
    temperature: 36.5,
  })
  const [thresholds, setThresholds] = useState({
    spo2: { min: 95, max: 100 },
    bpm: { min: 60, max: 100 },
    temperature: { min: 36.0, max: 37.5 },
  })
  const [alerts, setAlerts] = useState(alertsData)

  const filteredPatients = patientsData.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) || patient.medicalRecord.includes(searchTerm),
  )

  // Simular mudanças nos sinais vitais a cada 3 segundos
  useEffect(() => {
    if (!selectedPatient) return

    const interval = setInterval(() => {
      // Gerar valores aleatórios, mas com maior probabilidade de estar dentro dos limites
      const newSpo2 = getRandomValue(
        selectedPatient.status === "critical" ? 88 : 94,
        selectedPatient.status === "critical" ? 94 : 100,
      )

      const newBpm = getRandomValue(
        selectedPatient.status === "critical" ? 50 : 60,
        selectedPatient.status === "critical" ? 120 : 100,
      )

      const newTemp = Number(
        (
          getRandomValue(
            selectedPatient.status === "critical" ? 350 : 360,
            selectedPatient.status === "critical" ? 385 : 375,
          ) / 10
        ).toFixed(1),
      )

      setVitals({
        spo2: newSpo2,
        bpm: newBpm,
        temperature: newTemp,
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [selectedPatient])

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

  const getPatientStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "bg-red-500 hover:bg-red-600"
      case "warning":
        return "bg-amber-500 hover:bg-amber-600"
      case "stable":
        return "bg-green-500 hover:bg-green-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  const getPatientStatusText = (status: string) => {
    switch (status) {
      case "critical":
        return "Crítico"
      case "warning":
        return "Atenção"
      case "stable":
        return "Estável"
      default:
        return "Desconhecido"
    }
  }

  const getAlertTypeColor = (type: string) => {
    switch (type) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "warning":
        return "bg-amber-100 text-amber-800 border-amber-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const acknowledgeAlert = (alertId: number) => {
    setAlerts(alerts.map((alert) => (alert.id === alertId ? { ...alert, acknowledged: true } : alert)))
  }

  // Verificar se algum valor está fora do normal
  const hasAlert =
    selectedPatient &&
    (vitals.spo2 < thresholds.spo2.min ||
      vitals.bpm < thresholds.bpm.min ||
      vitals.bpm > thresholds.bpm.max ||
      vitals.temperature < thresholds.temperature.min ||
      vitals.temperature > thresholds.temperature.max)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
              MC
            </div>
            <h1 className="text-xl font-bold text-gray-800">MediCare</h1>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {alerts.filter((a) => !a.acknowledged).length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                  {alerts.filter((a) => !a.acknowledged).length}
                </span>
              )}
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar>
                    <AvatarImage src={doctorData.avatar || "/placeholder.svg"} alt={doctorData.name} />
                    <AvatarFallback>
                      {doctorData.name
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
                  <CardTitle>Bem-vindo(a), {doctorData.name}</CardTitle>
                  <CardDescription>{doctorData.specialty}</CardDescription>
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
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>Pacientes</CardTitle>
                  <Button size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-1" />
                    Novo
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative mb-4">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Buscar paciente..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <ScrollArea className="h-[calc(100vh-320px)]">
                  <div className="space-y-2">
                    {filteredPatients.map((patient) => (
                      <div
                        key={patient.id}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedPatient?.id === patient.id
                            ? "bg-blue-100 border border-blue-300"
                            : "hover:bg-gray-100 border border-transparent"
                        }`}
                        onClick={() => setSelectedPatient(patient)}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-blue-200 text-blue-700">
                              {patient.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="font-medium truncate">{patient.name}</p>
                              <Badge className={getPatientStatusColor(patient.status)}>
                                {getPatientStatusText(patient.status)}
                              </Badge>
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground mt-1">
                              <span className="truncate">
                                {patient.age} anos • Quarto {patient.room}
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              Prontuário: {patient.medicalRecord}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alertas Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-3">
                    {alerts.length > 0 ? (
                      alerts.map((alert) => (
                        <div
                          key={alert.id}
                          className={`p-3 rounded-lg border ${
                            alert.acknowledged ? "opacity-60" : ""
                          } ${getAlertTypeColor(alert.type)}`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium">{alert.patientName}</p>
                              <p className="text-sm mt-1">{alert.message}</p>
                              <p className="text-xs mt-1">
                                {new Date(alert.timestamp).toLocaleString("pt-BR", {
                                  day: "2-digit",
                                  month: "2-digit",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                            {!alert.acknowledged && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 px-2 text-xs"
                                onClick={() => acknowledgeAlert(alert.id)}
                              >
                                Confirmar
                              </Button>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground py-4">Nenhum alerta recente</p>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <Tabs defaultValue="monitor">
              <TabsList className="mb-4">
                <TabsTrigger value="monitor">Monitoramento</TabsTrigger>
                <TabsTrigger value="patients">Meus Pacientes</TabsTrigger>
                <TabsTrigger value="reports">Relatórios</TabsTrigger>
              </TabsList>

              <TabsContent value="monitor">
                {selectedPatient ? (
                  <div className="space-y-6">
                    <Card>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-xl">{selectedPatient.name}</CardTitle>
                            <div className="text-sm text-muted-foreground mt-1">
                              {selectedPatient.age} anos • {selectedPatient.gender} • Quarto {selectedPatient.room} •
                              Prontuário: {selectedPatient.medicalRecord}
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              Condição: {selectedPatient.condition}
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
                                  vitals.spo2 < thresholds.spo2.min
                                    ? "#f59e0b"
                                    : vitals.spo2 < 90
                                      ? "#ef4444"
                                      : "#10b981",
                              }}
                            >
                              <span className={`text-5xl font-bold ${getStatusColor("spo2", vitals.spo2)}`}>
                                {vitals.spo2}
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
                        className={`shadow-lg border-2 transition-all duration-500 ${getCardBackground("bpm", vitals.bpm)}`}
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
                                  vitals.bpm < thresholds.bpm.min
                                    ? "#f59e0b"
                                    : vitals.bpm > thresholds.bpm.max
                                      ? "#ef4444"
                                      : "#10b981",
                              }}
                            >
                              <span className={`text-5xl font-bold ${getStatusColor("bpm", vitals.bpm)}`}>
                                {vitals.bpm}
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
                              <span
                                className={`text-5xl font-bold ${getStatusColor("temperature", vitals.temperature)}`}
                              >
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
                  </div>
                ) : (
                  <Card className="h-64 flex items-center justify-center">
                    <CardContent>
                      <p className="text-center text-muted-foreground">
                        Selecione um paciente para visualizar o monitoramento
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="patients">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Lista de Pacientes</CardTitle>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar Paciente
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4">Nome</th>
                            <th className="text-left py-3 px-4">Idade</th>
                            <th className="text-left py-3 px-4">Gênero</th>
                            <th className="text-left py-3 px-4">Prontuário</th>
                            <th className="text-left py-3 px-4">Condição</th>
                            <th className="text-left py-3 px-4">Status</th>
                            <th className="text-left py-3 px-4">Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {patientsData.map((patient) => (
                            <tr key={patient.id} className="border-b">
                              <td className="py-3 px-4">{patient.name}</td>
                              <td className="py-3 px-4">{patient.age} anos</td>
                              <td className="py-3 px-4">{patient.gender}</td>
                              <td className="py-3 px-4">{patient.medicalRecord}</td>
                              <td className="py-3 px-4">{patient.condition}</td>
                              <td className="py-3 px-4">
                                <Badge className={getPatientStatusColor(patient.status)}>
                                  {getPatientStatusText(patient.status)}
                                </Badge>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8 px-2"
                                    onClick={() => setSelectedPatient(patient)}
                                  >
                                    Monitorar
                                  </Button>
                                  <Button size="sm" variant="outline" className="h-8 px-2">
                                    Editar
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reports">
                <Card>
                  <CardHeader>
                    <CardTitle>Relatórios e Estatísticas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <Card>
                        <CardContent className="pt-6">
                          <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                              <Users className="h-6 w-6 text-blue-600" />
                            </div>
                            <h3 className="text-2xl font-semibold mb-1">{patientsData.length}</h3>
                            <p className="text-muted-foreground">Total de Pacientes</p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="pt-6">
                          <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                              <AlertTriangle className="h-6 w-6 text-red-600" />
                            </div>
                            <h3 className="text-2xl font-semibold mb-1">
                              {patientsData.filter((p) => p.status === "critical").length}
                            </h3>
                            <p className="text-muted-foreground">Pacientes Críticos</p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="pt-6">
                          <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                              <FileText className="h-6 w-6 text-green-600" />
                            </div>
                            <h3 className="text-2xl font-semibold mb-1">24</h3>
                            <p className="text-muted-foreground">Relatórios Gerados</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Relatórios Disponíveis</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button variant="outline" className="justify-start h-auto py-3">
                          <div className="flex flex-col items-start text-left">
                            <span className="font-medium">Relatório de Sinais Vitais</span>
                            <span className="text-sm text-muted-foreground">
                              Histórico completo de sinais vitais por paciente
                            </span>
                          </div>
                        </Button>
                        <Button variant="outline" className="justify-start h-auto py-3">
                          <div className="flex flex-col items-start text-left">
                            <span className="font-medium">Relatório de Alertas</span>
                            <span className="text-sm text-muted-foreground">
                              Histórico de alertas gerados por paciente
                            </span>
                          </div>
                        </Button>
                        <Button variant="outline" className="justify-start h-auto py-3">
                          <div className="flex flex-col items-start text-left">
                            <span className="font-medium">Estatísticas de Monitoramento</span>
                            <span className="text-sm text-muted-foreground">
                              Análise estatística dos dados de monitoramento
                            </span>
                          </div>
                        </Button>
                        <Button variant="outline" className="justify-start h-auto py-3">
                          <div className="flex flex-col items-start text-left">
                            <span className="font-medium">Relatório de Tendências</span>
                            <span className="text-sm text-muted-foreground">
                              Análise de tendências de sinais vitais ao longo do tempo
                            </span>
                          </div>
                        </Button>
                      </div>
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
