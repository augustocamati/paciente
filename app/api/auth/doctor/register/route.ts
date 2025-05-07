import { NextResponse } from "next/server"
import { hash } from "bcrypt"
import { db } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, specialty, crm, password } = body

    // Validação básica
    if (!name || !email || !specialty || !crm || !password) {
      return NextResponse.json({ message: "Todos os campos são obrigatórios" }, { status: 400 })
    }

    // Verificar se o email já está em uso
    const existingDoctor = await db.query("SELECT * FROM doctors WHERE email = $1", [email])

    if (existingDoctor.rows.length > 0) {
      return NextResponse.json({ message: "Este email já está em uso" }, { status: 409 })
    }

    // Hash da senha
    const hashedPassword = await hash(password, 10)

    // Inserir novo médico
    const result = await db.query(
      `INSERT INTO doctors (name, email, password_hash, specialty, created_at) 
       VALUES ($1, $2, $3, $4, NOW()) 
       RETURNING id, name, email, specialty, created_at`,
      [name, email, hashedPassword, specialty],
    )

    const newDoctor = result.rows[0]

    return NextResponse.json(
      {
        message: "Médico registrado com sucesso",
        doctor: {
          id: newDoctor.id,
          name: newDoctor.name,
          email: newDoctor.email,
          specialty: newDoctor.specialty,
          created_at: newDoctor.created_at,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Erro ao registrar médico:", error)
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
  }
}
