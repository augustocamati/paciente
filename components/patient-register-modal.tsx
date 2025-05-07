"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Loader2, Plus } from "lucide-react"

export default function PatientRegisterModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    medicalRecord: "",
    roomNumber: "",
    condition: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Obter token do localStorage
      const token = localStorage.getItem("authToken")

      if (!token) {
        throw new Error("Você precisa estar autenticado para registrar um paciente")
      }

      // Chamada à API
      const response = await fetch("/api/patients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          age: Number.parseInt(formData.age),
          gender: formData.gender,
          medical_record: formData.medicalRecord,
          room_number: formData.roomNumber,
          condition: formData.condition,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Erro ao registrar paciente")
      }

      toast({
        title: "Paciente registrado com sucesso",
        description: `O paciente ${formData.name} foi registrado com sucesso.`,
      })

      // Limpar formulário e fechar modal
      setFormData({
        name: "",
        age: "",
        gender: "",
        medicalRecord: "",
        roomNumber: "",
        condition: "",
      })
      setIsOpen(false)
    } catch (error) {
      console.error("Erro ao registrar paciente:", error)
      toast({
        title: "Erro ao registrar paciente",
        description: error instanceof Error ? error.message : "Tente novamente mais tarde",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Paciente
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Registrar Novo Paciente</DialogTitle>
          <DialogDescription>Preencha os dados do paciente para registrá-lo no sistema.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input id="name" placeholder="João Silva" required value={formData.name} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Idade</Label>
              <Input id="age" type="number" placeholder="65" required value={formData.age} onChange={handleChange} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gender">Gênero</Label>
              <Select onValueChange={(value) => handleSelectChange("gender", value)} value={formData.gender}>
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Masculino">Masculino</SelectItem>
                  <SelectItem value="Feminino">Feminino</SelectItem>
                  <SelectItem value="Outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="medicalRecord">Número do Prontuário</Label>
              <Input
                id="medicalRecord"
                placeholder="12345"
                required
                value={formData.medicalRecord}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="roomNumber">Número do Quarto</Label>
              <Input id="roomNumber" placeholder="101" value={formData.roomNumber} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="condition">Condição</Label>
              <Input
                id="condition"
                placeholder="Hipertensão e Diabetes"
                value={formData.condition}
                onChange={handleChange}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registrando...
                </>
              ) : (
                "Registrar Paciente"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
