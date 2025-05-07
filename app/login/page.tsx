"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [userType, setUserType] = useState("doctor")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    medicalRecord: "",
    patientPassword: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Aqui você usaria sua API real
      const endpoint = userType === "doctor" ? "/api/auth/doctor/login" : "/api/auth/patient/login"

      const payload =
        userType === "doctor"
          ? { email: formData.email, password: formData.password }
          : { medicalRecord: formData.medicalRecord, password: formData.patientPassword }

      // const response = await fetch(endpoint, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(payload),
      // })

      // const data = await response.json()

      // if (!response.ok) {
      //   throw new Error(data.message || "Erro ao fazer login")
      // }

      // Armazenar token e redirecionar
      // localStorage.setItem("authToken", data.token)
      // localStorage.setItem("userType", userType)

      toast({
        title: "Login realizado com sucesso",
        description: "Redirecionando para o dashboard...",
      })

      // Redirecionar para o dashboard apropriado
      if (userType === "doctor") {
        router.push("/doctor/dashboard")
      } else {
        router.push("/patient/dashboard")
      }
    } catch (error) {
      console.error("Erro de login:", error)
      toast({
        title: "Erro ao fazer login",
        description: error instanceof Error ? error.message : "Verifique suas credenciais e tente novamente",
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
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-2">
              <div className="w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold">
                MC
              </div>
            </div>
            <CardTitle className="text-2xl">Entrar no MediCare</CardTitle>
            <CardDescription>Escolha seu tipo de usuário e faça login</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs defaultValue="doctor" className="w-full" onValueChange={setUserType}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="doctor">Médico</TabsTrigger>
                <TabsTrigger value="patient">Paciente</TabsTrigger>
              </TabsList>
              <TabsContent value="doctor">
                <form onSubmit={handleLogin} className="space-y-4 mt-4">
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
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Senha</Label>
                      <Link href="/forgot-password" className="text-sm text-emerald-600 hover:text-emerald-800">
                        Esqueceu a senha?
                      </Link>
                    </div>
                    <Input id="password" type="password" required value={formData.password} onChange={handleChange} />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Entrando...
                      </>
                    ) : (
                      "Entrar como Médico"
                    )}
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="patient">
                <form onSubmit={handleLogin} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="medicalRecord">Número do Prontuário</Label>
                    <Input
                      id="medicalRecord"
                      placeholder="Ex: 12345"
                      required
                      value={formData.medicalRecord}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="patientPassword">Senha</Label>
                      <Link href="/forgot-password" className="text-sm text-emerald-600 hover:text-emerald-800">
                        Esqueceu a senha?
                      </Link>
                    </div>
                    <Input
                      id="patientPassword"
                      type="password"
                      required
                      value={formData.patientPassword}
                      onChange={handleChange}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Entrando...
                      </>
                    ) : (
                      "Entrar como Paciente"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm text-gray-600">
              {userType === "doctor" ? (
                <>
                  Não tem uma conta?{" "}
                  <Link href="/register" className="text-emerald-600 hover:text-emerald-800 font-medium">
                    Cadastre-se como médico
                  </Link>
                </>
              ) : (
                <>
                  Seu médico deve fornecer suas credenciais de acesso.
                  <br />
                  Em caso de dúvidas, entre em contato com seu médico.
                </>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
