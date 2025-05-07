import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { verify } from "jsonwebtoken"
import { hash } from "bcryptjs"

// Função para verificar o token e extrair o ID do médico
function getDoctorIdFromToken(authHeader: string | null) {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null
  }

  const token = authHeader.split(" ")[1]

  try {
    const decoded = verify(token, process.env.JWT_SECRET || "fallback_secret") as { id: number; role: string }

    if (decoded.role !== "doctor") {
      return null
    }

    return decoded.id
  } catch (error) {
    return null
  }
}

// GET - Listar todos os pacientes de um médico
export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization")
    const doctorId = getDoctorIdFromToken(authHeader)

    if (!doctorId) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 })
    }

    const result = await db.query(
      `SELECT p.*, vt.spo2_min, vt.spo2_max, vt.bpm_min, vt.bpm_max, 
              vt.temperature_min, vt.temperature_max
       FROM patients p
       LEFT JOIN vital_thresholds vt ON p.id = vt.patient_id
       WHERE p.doctor_id = $1
       ORDER BY p.name`,
      [doctorId],
    )

    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Erro ao listar pacientes:", error)
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
  }
}

// POST - Registrar novo paciente
export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization")
    const doctorId = getDoctorIdFromToken(authHeader)

    if (!doctorId) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const { name, age, gender, medical_record, room_number, condition } = body

    // Validação básica
    if (!name || !medical_record) {
      return NextResponse.json({ message: "Nome e número do prontuário são obrigatórios" }, { status: 400 })
    }

    // Verificar se o número do prontuário já existe
    const existingPatient = await db.query("SELECT * FROM patients WHERE medical_record = $1", [medical_record])

    if (existingPatient.rows.length > 0) {
      return NextResponse.json({ message: "Este número de prontuário já está em uso" }, { status: 409 })
    }

    // Gerar uma senha padrão para o paciente (pode ser alterada depois)
    const defaultPassword = medical_record // Usando o número do prontuário como senha inicial
    const hashedPassword = await hash(defaultPassword, 10)

    // Inserir novo paciente
    const patientResult = await db.query(
      `INSERT INTO patients (name, age, gender, medical_record, room_number, doctor_id, status, created_at, password_hash, condition) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), $8, $9) 
       RETURNING id`,
      [name, age, gender, medical_record, room_number, doctorId, "active", hashedPassword, condition],
    )

    const patientId = patientResult.rows[0].id

    // Criar limites padrão para os sinais vitais
    await db.query(
      `INSERT INTO vital_thresholds (patient_id, spo2_min, spo2_max, bpm_min, bpm_max, temperature_min, temperature_max, updated_by, updated_at) 
       VALUES ($1, 95, 100, 60, 100, 36.0, 37.5, $2, NOW())`,
      [patientId, doctorId],
    )

    return NextResponse.json(
      {
        message: "Paciente registrado com sucesso",
        patient: {
          id: patientId,
          name,
          medical_record,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Erro ao registrar paciente:", error)
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
  }
}
