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

// Função para calcular a data de início com base no intervalo de tempo
function getStartDate(timeRange: string) {
  const now = new Date()

  switch (timeRange) {
    case "6h":
      return new Date(now.getTime() - 6 * 60 * 60 * 1000)
    case "12h":
      return new Date(now.getTime() - 12 * 60 * 60 * 1000)
    case "24h":
      return new Date(now.getTime() - 24 * 60 * 60 * 1000)
    case "48h":
      return new Date(now.getTime() - 48 * 60 * 60 * 1000)
    case "7d":
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    case "30d":
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    default:
      return new Date(now.getTime() - 24 * 60 * 60 * 1000) // Padrão: 24h
  }
}

// GET - Obter histórico de sinais vitais de um paciente
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const patientId = Number.parseInt(params.id)
    if (isNaN(patientId)) {
      return NextResponse.json({ message: "ID de paciente inválido" }, { status: 400 })
    }

    const authHeader = request.headers.get("Authorization")
    const user = getUserFromToken(authHeader)

    if (!user) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 })
    }

    // Verificar se o usuário tem acesso a este paciente
    if (user.role === "doctor") {
      // Verificar se o paciente pertence a este médico
      const patientCheck = await db.query("SELECT * FROM patients WHERE id = $1 AND doctor_id = $2", [
        patientId,
        user.id,
      ])

      if (patientCheck.rows.length === 0) {
        return NextResponse.json({ message: "Acesso negado a este paciente" }, { status: 403 })
      }
    } else if (user.role === "patient") {
      // Verificar se o paciente está acessando seus próprios dados
      if (user.id !== patientId) {
        return NextResponse.json({ message: "Acesso negado a este paciente" }, { status: 403 })
      }
    }

    // Obter o intervalo de tempo da query string
    const url = new URL(request.url)
    const timeRange = url.searchParams.get("timeRange") || "24h"
    const startDate = getStartDate(timeRange)

    // Buscar os registros de sinais vitais
    const result = await db.query(
      `SELECT * FROM vital_records 
       WHERE patient_id = $1 AND recorded_at >= $2
       ORDER BY recorded_at ASC`,
      [patientId, startDate.toISOString()],
    )

    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Erro ao obter histórico de sinais vitais:", error)
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
  }
}

// POST - Registrar novos sinais vitais
export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const patientId = Number.parseInt(params.id)
    if (isNaN(patientId)) {
      return NextResponse.json({ message: "ID de paciente inválido" }, { status: 400 })
    }

    const authHeader = request.headers.get("Authorization")
    const user = getUserFromToken(authHeader)

    if (!user) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 })
    }

    // Apenas médicos ou o próprio paciente podem registrar sinais vitais
    if (user.role === "doctor") {
      // Verificar se o paciente pertence a este médico
      const patientCheck = await db.query("SELECT * FROM patients WHERE id = $1 AND doctor_id = $2", [
        patientId,
        user.id,
      ])

      if (patientCheck.rows.length === 0) {
        return NextResponse.json({ message: "Acesso negado a este paciente" }, { status: 403 })
      }
    } else if (user.role === "patient") {
      // Verificar se o paciente está acessando seus próprios dados
      if (user.id !== patientId) {
        return NextResponse.json({ message: "Acesso negado a este paciente" }, { status: 403 })
      }
    }

    const body = await request.json()
    const { spo2, bpm, temperature } = body

    // Validação básica
    if (spo2 === undefined || bpm === undefined || temperature === undefined) {
      return NextResponse.json({ message: "Todos os sinais vitais são obrigatórios" }, { status: 400 })
    }

    // Inserir novo registro de sinais vitais
    const result = await db.query(
      `INSERT INTO vital_records (patient_id, spo2, bpm, temperature, recorded_at) 
       VALUES ($1, $2, $3, $4, NOW()) 
       RETURNING *`,
      [patientId, spo2, bpm, temperature],
    )

    // Verificar se os sinais vitais estão fora dos limites
    const thresholds = await db.query(`SELECT * FROM vital_thresholds WHERE patient_id = $1`, [patientId])

    let alertMessage = null
    let alertType = null

    if (thresholds.rows.length > 0) {
      const threshold = thresholds.rows[0]

      if (spo2 < threshold.spo2_min) {
        alertMessage = `Saturação de oxigênio abaixo do limite (${spo2}%)`
        alertType = spo2 < 90 ? "critical" : "warning"
      } else if (bpm < threshold.bpm_min) {
        alertMessage = `Frequência cardíaca abaixo do limite (${bpm} BPM)`
        alertType = "warning"
      } else if (bpm > threshold.bpm_max) {
        alertMessage = `Frequência cardíaca acima do limite (${bpm} BPM)`
        alertType = bpm > 120 ? "critical" : "warning"
      } else if (temperature < threshold.temperature_min) {
        alertMessage = `Temperatura abaixo do limite (${temperature}°C)`
        alertType = "warning"
      } else if (temperature > threshold.temperature_max) {
        alertMessage = `Temperatura acima do limite (${temperature}°C)`
        alertType = temperature > 38.5 ? "critical" : "warning"
      }
    }

    // Se houver alerta, registrá-lo
    if (alertMessage && alertType) {
      const patientInfo = await db.query("SELECT name FROM patients WHERE id = $1", [patientId])
      const patientName = patientInfo.rows[0]?.name || `Paciente #${patientId}`

      await db.query(
        `INSERT INTO alerts (patient_id, type, message, created_at, acknowledged) 
         VALUES ($1, $2, $3, NOW(), false)`,
        [patientId, alertType, alertMessage],
      )

      // Retornar o registro com informação de alerta
      return NextResponse.json({
        record: result.rows[0],
        alert: {
          type: alertType,
          message: alertMessage,
          patientName,
        },
      })
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("Erro ao registrar sinais vitais:", error)
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
  }
}
