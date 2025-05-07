import { NextResponse } from "next/server"
// Substituir a importação do bcrypt por bcryptjs
import { compare } from "bcryptjs"
import { sign } from "jsonwebtoken"
import { db } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { medicalRecord, password } = body

    // Validação básica
    if (!medicalRecord || !password) {
      return NextResponse.json({ message: "Número do prontuário e senha são obrigatórios" }, { status: 400 })
    }

    // Buscar paciente pelo número do prontuário
    const result = await db.query("SELECT * FROM patients WHERE medical_record = $1", [medicalRecord])

    if (result.rows.length === 0) {
      return NextResponse.json({ message: "Credenciais inválidas" }, { status: 401 })
    }

    const patient = result.rows[0]

    // Verificar senha (assumindo que há um campo password_hash na tabela patients)
    const passwordMatch = await compare(password, patient.password_hash)

    if (!passwordMatch) {
      return NextResponse.json({ message: "Credenciais inválidas" }, { status: 401 })
    }

    // Gerar token JWT
    const token = sign(
      {
        id: patient.id,
        medicalRecord: patient.medical_record,
        role: "patient",
      },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "24h" },
    )

    return NextResponse.json({
      message: "Login realizado com sucesso",
      token,
      patient: {
        id: patient.id,
        name: patient.name,
        medicalRecord: patient.medical_record,
      },
    })
  } catch (error) {
    console.error("Erro ao fazer login:", error)
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
  }
}
