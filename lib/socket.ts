import type { Server as NetServer } from "http"
import { Server as SocketIOServer } from "socket.io"
import type { NextApiRequest } from "next"
import { verify } from "jsonwebtoken"

export type NextApiResponseWithSocket = {
  socket: {
    server: NetServer & {
      io?: SocketIOServer
    }
  }
}

// Tipos para os eventos de socket
export interface ServerToClientEvents {
  "vital-alert": (data: {
    patientId: number
    patientName: string
    type: "warning" | "critical"
    message: string
    timestamp: string
    id: number
  }) => void
  "vital-update": (data: {
    patientId: number
    spo2: number
    bpm: number
    temperature: number
    timestamp: string
  }) => void
}

export interface ClientToServerEvents {
  "join-doctor-room": (doctorId: number) => void
  "join-patient-room": (patientId: number) => void
  "acknowledge-alert": (alertId: number) => void
}

// Função para inicializar o servidor Socket.IO
export const initSocket = (req: NextApiRequest, res: NextApiResponseWithSocket) => {
  if (!res.socket.server.io) {
    console.log("Inicializando Socket.IO")
    const io = new SocketIOServer<ClientToServerEvents, ServerToClientEvents>(res.socket.server, {
      path: "/api/socket",
      addTrailingSlash: false,
    })

    // Middleware para autenticação
    io.use((socket, next) => {
      const token = socket.handshake.auth.token
      if (!token) {
        return next(new Error("Autenticação necessária"))
      }

      try {
        const decoded = verify(token, process.env.JWT_SECRET || "fallback_secret") as {
          id: number
          role: string
        }
        socket.data.user = decoded
        next()
      } catch (error) {
        next(new Error("Token inválido"))
      }
    })

    // Gerenciamento de conexões
    io.on("connection", (socket) => {
      console.log(`Novo cliente conectado: ${socket.id}`)

      // Entrar na sala do médico
      socket.on("join-doctor-room", (doctorId) => {
        if (socket.data.user?.role === "doctor" && socket.data.user?.id === doctorId) {
          socket.join(`doctor:${doctorId}`)
          console.log(`Médico ${doctorId} entrou na sala`)
        }
      })

      // Entrar na sala do paciente
      socket.on("join-patient-room", (patientId) => {
        if (
          (socket.data.user?.role === "patient" && socket.data.user?.id === patientId) ||
          socket.data.user?.role === "doctor"
        ) {
          socket.join(`patient:${patientId}`)
          console.log(`Cliente entrou na sala do paciente ${patientId}`)
        }
      })

      // Confirmar recebimento de alerta
      socket.on("acknowledge-alert", (alertId) => {
        // Aqui você implementaria a lógica para marcar o alerta como confirmado no banco de dados
        console.log(`Alerta ${alertId} confirmado por ${socket.data.user?.id}`)
      })

      socket.on("disconnect", () => {
        console.log(`Cliente desconectado: ${socket.id}`)
      })
    })

    res.socket.server.io = io
  }
  return res.socket.server.io
}
