import { redirect } from "next/navigation"
import DoctorDashboard from "@/components/doctor-dashboard"

export default function Home() {
  // Na versão completa, verificaríamos a autenticação aqui
  // Se não estiver autenticado, redirecionaria para login
  const isAuthenticated = true

  if (!isAuthenticated) {
    redirect("/login")
  }

  return <DoctorDashboard />
}
