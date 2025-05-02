"use client"
import { useState } from "react"
// ... outros imports
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function DoctorDashboard() {
  const [newDoctor, setNewDoctor] = useState({
    name: "",
    email: "",
    specialty: "",
  })

  const handleCreateDoctor = async () => {
    try {
      const response = await fetch("/api/doctors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newDoctor),
      })

      if (!response.ok) throw new Error("Erro ao criar médico")
      const result = await response.json()
      alert(`Médico criado: ${result.name}`)
    } catch (error) {
      console.error("Erro:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Cabeçalho existente */}

      {/* Formulário de novo médico */}
      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardHeader>
            <CardTitle>Cadastrar Novo Médico</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                placeholder="Nome completo"
                value={newDoctor.name}
                onChange={(e) =>
                  setNewDoctor({ ...newDoctor, name: e.target.value })
                }
              />
              <Input
                placeholder="Email"
                type="email"
                value={newDoctor.email}
                onChange={(e) =>
                  setNewDoctor({ ...newDoctor, email: e.target.value })
                }
              />
              <Input
                placeholder="Especialidade"
                value={newDoctor.specialty}
                onChange={(e) =>
                  setNewDoctor({ ...newDoctor, specialty: e.target.value })
                }
              />
              <Button onClick={handleCreateDoctor}>
                <Plus className="mr-2 h-4 w-4" />
                Cadastrar Médico
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Restante do dashboard */}
    </div>
  )
}
