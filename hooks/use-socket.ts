"use client"

import { useEffect, useState } from "react"
import { io, type Socket } from "socket.io-client"
import type { ClientToServerEvents, ServerToClientEvents } from "@/lib/socket"

export function useSocket() {
  const [socket, setSocket] = useState<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("authToken")
    if (!token) {
      setError("Token de autenticação não encontrado")
      return
    }

    // Inicializar socket
    const socketInstance = io({
      path: "/api/socket",
      auth: {
        token,
      },
      autoConnect: true,
    })

    // Eventos de conexão
    socketInstance.on("connect", () => {
      console.log("Socket conectado")
      setIsConnected(true)
      setError(null)
    })

    socketInstance.on("connect_error", (err) => {
      console.error("Erro de conexão:", err.message)
      setIsConnected(false)
      setError(err.message)
    })

    socketInstance.on("disconnect", (reason) => {
      console.log("Socket desconectado:", reason)
      setIsConnected(false)
    })

    setSocket(socketInstance)

    // Limpar ao desmontar
    return () => {
      socketInstance.disconnect()
    }
  }, [])

  return { socket, isConnected, error }
}
