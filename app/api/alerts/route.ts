import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { verify } from "jsonwebtoken"

// Função para verificar o token e extrair o ID do usuário e seu papel
function getUserFromToken(authHeader: string | null) {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null
  }

  const token = authHeader.split(" ")[1]

  try {
    const decoded = verify(token, process.env.JWT_SECRET || "fallback_secret") as { id: number; role: string }
    return decoded
  } catch (error) {
    return null
  }
}

// GET - Obter alertas
export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization")
    const user = getUserFromToken(authHeader)

    if (!user) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 })
    }

    let query = ""
    let params: any[] = []

    if (user.role === "doctor") {
      // Médicos veem alertas de todos os seus pacientes
      query = `
        SELECT a.*, p.name as patient_name 
        FROM alerts a
        JOIN patients p ON a.patient_id = p.id
        WHERE p.doctor_id = $1
        ORDER BY a.created_at DESC
        LIMIT 50
      `
      params = [user.id]
    } else if (user.role === "patient") {
      // Pacientes veem apenas seus próprios alertas
      query = `
        SELECT a.*, p.name as patient_name 
        FROM alerts a
        JOIN patients p ON a.patient_id = p.id
        WHERE a.patient_id = $1
        ORDER BY a.created_at DESC
        LIMIT 50
      `
      params = [user.id]
    } else {
      return NextResponse.json({ message: "Tipo de usuário não suportado" }, { status: 403 })
    }

    const result = await db.query(query, params)

    // Formatar os alertas para o cliente
    const alerts = result.rows.map((alert) => ({
      id: alert.id,
      patientId: alert.patient_id,
      patientName: alert.patient_name,
      type: alert.type,
      message: alert.message,
      timestamp: alert.created_at,
      acknowledged: alert.acknowledged,
    }))

    return NextResponse.json(alerts)
  } catch (error) {
    console.error("Erro ao obter alertas:", error)
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
  }
}
