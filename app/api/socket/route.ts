import { type NextRequest, NextResponse } from "next/server"
import { initSocket, type NextApiResponseWithSocket } from "@/lib/socket"

export async function GET(req: NextRequest, res: NextApiResponseWithSocket) {
  try {
    // Inicializar o servidor Socket.IO
    const io = initSocket(req as any, res)

    return new NextResponse("Socket.IO server is running", {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
      },
    })
  } catch (error) {
    console.error("Erro ao inicializar Socket.IO:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
