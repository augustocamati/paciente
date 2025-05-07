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

// POST - Confirmar um alerta
export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const alertId = Number.parseInt(params.id)
    if (isNaN(alertId)) {
      return NextResponse.json({ message: "ID de alerta inválido" }, { status: 400 })
    }

    const authHeader = request.headers.get("Authorization")
    const user = getUserFromToken(authHeader)

    if (!user) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 })
    }

    // Verificar se o usuário tem acesso a este alerta
    let canAcknowledge = false

    if (user.role === "doctor") {
      // Verificar se o alerta pertence a um paciente deste médico
      const checkResult = await db.query(
        `SELECT a.id 
         FROM alerts a
         JOIN patients p ON a.patient_id = p.id
         WHERE a.id = $1 AND p.doctor_id = $2`,
        [alertId, user.id],
      )
      canAcknowledge = checkResult.rows.length > 0
    } else if (user.role === "patient") {
      // Verificar se o alerta pertence a este paciente
      const checkResult = await db.query(`SELECT id FROM alerts WHERE id = $1 AND patient_id = $2`, [alertId, user.id])
      canAcknowledge = checkResult.rows.length > 0
    }

    if (!canAcknowledge) {
      return NextResponse.json({ message: "Acesso negado a este alerta" }, { status: 403 })
    }

    // Atualizar o alerta para confirmado
    await db.query(
      `UPDATE alerts 
       SET acknowledged = true, acknowledged_at = NOW(), acknowledged_by = $1
       WHERE id = $2`,
      [user.id, alertId],
    )

    return NextResponse.json({ message: "Alerta confirmado com sucesso" })
  } catch (error) {
    console.error("Erro ao confirmar alerta:", error)
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
  }
}
