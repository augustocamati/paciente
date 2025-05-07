import { NextResponse } from "next/server"
// Substituir a importação do bcrypt por bcryptjs
import { compare } from "bcryptjs"
import { sign } from "jsonwebtoken"
import { db } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validação básica
    if (!email || !password) {
      return NextResponse.json({ message: "Email e senha são obrigatórios" }, { status: 400 })
    }

    // Buscar médico pelo email
    const result = await db.query("SELECT * FROM doctors WHERE email = $1", [email])

    if (result.rows.length === 0) {
      return NextResponse.json({ message: "Credenciais inválidas" }, { status: 401 })
    }

    const doctor = result.rows[0]

    // Verificar senha
    const passwordMatch = await compare(password, doctor.password_hash)

    if (!passwordMatch) {
      return NextResponse.json({ message: "Credenciais inválidas" }, { status: 401 })
    }

    // Gerar token JWT
    const token = sign(
      {
        id: doctor.id,
        email: doctor.email,
        role: "doctor",
      },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "24h" },
    )

    return NextResponse.json({
      message: "Login realizado com sucesso",
      token,
      doctor: {
        id: doctor.id,
        name: doctor.name,
        email: doctor.email,
        specialty: doctor.specialty,
      },
    })
  } catch (error) {
    console.error("Erro ao fazer login:", error)
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
  }
}
