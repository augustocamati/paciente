"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    specialty: "",
    crm: "",
    password: "",
    confirmPassword: "",
    
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      specialty: value,
    }))
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validação básica
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Erro de validação",
        description: "As senhas não coincidem",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Chamada à API
      const response = await fetch("/api/auth/doctor/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          specialty: formData.specialty,
          crm: formData.crm,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Erro ao criar conta")
      }

      toast({
        title: "Conta criada com sucesso",
        description: "Redirecionando para o login...",
      })

      // Redirecionar para o login após registro bem-sucedido
      router.push("/login")
    } catch (error) {
      console.error("Erro de registro:", error)
      toast({
        title: "Erro ao criar conta",
        description: error instanceof Error ? error.message : "Tente novamente mais tarde",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-indigo-100 flex flex-col">
      <div className="container mx-auto px-4 py-4">
        <Link href="/" className="inline-flex items-center text-emerald-600 hover:text-emerald-800 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para a página inicial
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-2">
              <div className="w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold">
                MC
              </div>
            </div>
            <CardTitle className="text-2xl">Cadastro de Médico</CardTitle>
            <CardDescription>Crie sua conta para começar a monitorar seus pacientes</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    placeholder="Dr. João Silva"
                    required
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu.email@exemplo.com"
                    required
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="specialty">Especialidade</Label>
                  <Select onValueChange={handleSelectChange} value={formData.specialty}>
                    <SelectTrigger id="specialty">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cardiologia">Cardiologia</SelectItem>
                      <SelectItem value="endocrinologia">Endocrinologia</SelectItem>
                      <SelectItem value="neurologia">Neurologia</SelectItem>
                      <SelectItem value="pneumologia">Pneumologia</SelectItem>
                      <SelectItem value="geriatria">Geriatria</SelectItem>
                      <SelectItem value="clinica_geral">Clínica Geral</SelectItem>
                      <SelectItem value="outra">Outra</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="crm">CRM</Label>
                  <Input id="crm" placeholder="12345/UF" required value={formData.crm} onChange={handleChange} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input id="password" type="password" required value={formData.password} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
               
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando conta...
                  </>
                ) : (
                  "Criar Conta"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <div className="text-center text-sm text-gray-600">
              Já tem uma conta?{" "}
              <Link href="/login" className="text-emerald-600 hover:text-emerald-800 font-medium">
                Faça login
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
