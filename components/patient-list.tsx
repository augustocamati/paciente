"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Plus } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { randomInt } from "crypto"

interface PatientListProps {
  onSelectPatient: (patient: any) => void
  selectedPatientId?: number
}

export default function PatientList({
  onSelectPatient,
  selectedPatientId,
}: PatientListProps) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002"
  
  const [searchTerm, setSearchTerm] = useState("")
  const [patients, setPatients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [newPatient, setNewPatient] = useState({
    name: "",
    age: "",
    gender: "MALE",
    room: "",
    medicalRecord: "",
  })
   

  

  useEffect(() => {
    const fetchPatients = async () => {
      try {
         const response = await fetch(`${API_URL}/patients`)
        if (!response.ok) throw new Error("Erro ao carregar pacientes")
        const data = await response.json()
        setPatients(data)
      } catch (err) {
        setError("Falha ao buscar pacientes")
      } finally {
        setLoading(false)
      }
    }
    fetchPatients()
  }, [])

  const handleCreatePatient = async () => {
    try {
     const response = await fetch(`${API_URL}/patients`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newPatient,
          age: parseInt(newPatient.age),
          status: "STABLE",
    
          doctorId: 2, // ID do médico associado (ajuste conforme necessário)
        }),
      })
console.log('response', response)
      if (!response.ok) throw new Error("Erro ao criar paciente")
      const result = await response.json()
      setPatients([...patients, result])
      setIsCreating(false)
      setNewPatient({
        name: "",
        age: "",
        gender: "",
        room: "",
        medicalRecord: "",
      })
    } catch (error) {
      console.error("Erro:", error)
    }
  }

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.medicalRecord.includes(searchTerm)
  )

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
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
    switch (status.toLowerCase()) {
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

  if (loading)
    return (
      <div className="p-4 text-muted-foreground">Carregando pacientes...</div>
    )
  if (error) return <div className="p-4 text-red-500">{error}</div>

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>Pacientes</CardTitle>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsCreating(!isCreating)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Novo
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {isCreating && (
          <div className="mb-4 space-y-2 p-2 bg-gray-50 rounded-lg">
            <Input
              placeholder="Nome completo"
              value={newPatient.name}
              onChange={(e) =>
                setNewPatient({ ...newPatient, name: e.target.value })
              }
            />
            <Input
              placeholder="Idade"
              type="number"
              value={newPatient.age}
              onChange={(e) =>
                setNewPatient({ ...newPatient, age: e.target.value })
              }
            />
           
            <select
              className="w-full px-3 py-2 border rounded-md"
              value={newPatient.gender}
              onChange={(e) =>
                setNewPatient({ ...newPatient, gender: e.target.value })
              }
            >
              <option value="MALE">Masculino</option>
              <option value="FEMALE">Feminino</option>
              
            </select>
            <Input
              placeholder="Quarto"
              value={newPatient.room}
              onChange={(e) =>
                setNewPatient({ ...newPatient, room: e.target.value })
              }
            />
            <Input
              placeholder="Prontuário"
              value={newPatient.medicalRecord}
              onChange={(e) =>
                setNewPatient({ ...newPatient, medicalRecord: e.target.value })
              }
            />
            <Button className="w-full" onClick={handleCreatePatient}>
              Cadastrar Paciente
            </Button>
          </div>
        )}

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
                      {/* <Badge className={getStatusColor(patient.status)}>
                        {getStatusText(patient.status)}
                      </Badge> */}
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
  )
}
