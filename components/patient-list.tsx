"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Plus } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

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
  },
  {
    id: 2,
    name: "Maria Oliveira",
    age: 42,
    gender: "Feminino",
    room: "102",
    status: "stable",
    medicalRecord: "12346",
  },
  {
    id: 3,
    name: "Pedro Santos",
    age: 58,
    gender: "Masculino",
    room: "103",
    status: "warning",
    medicalRecord: "12347",
  },
  {
    id: 4,
    name: "Ana Costa",
    age: 35,
    gender: "Feminino",
    room: "104",
    status: "stable",
    medicalRecord: "12348",
  },
  {
    id: 5,
    name: "Carlos Ferreira",
    age: 70,
    gender: "Masculino",
    room: "105",
    status: "stable",
    medicalRecord: "12349",
  },
]

interface PatientListProps {
  onSelectPatient: (patient: any) => void
  selectedPatientId?: number
}

export default function PatientList({ onSelectPatient, selectedPatientId }: PatientListProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredPatients = patientsData.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) || patient.medicalRecord.includes(searchTerm),
  )

  const getStatusColor = (status: string) => {
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

  const getStatusText = (status: string) => {
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

  return (
    <Card className="h-full">
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
                  selectedPatientId === patient.id
                    ? "bg-blue-100 border border-blue-300"
                    : "hover:bg-gray-100 border border-transparent"
                }`}
                onClick={() => onSelectPatient(patient)}
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
                      <Badge className={getStatusColor(patient.status)}>{getStatusText(patient.status)}</Badge>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <span className="truncate">
                        {patient.age} anos • Quarto {patient.room}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">Prontuário: {patient.medicalRecord}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
