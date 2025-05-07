"use client"

import { useState, useEffect } from "react"
import { Bell, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { useSocket } from "@/hooks/use-socket"
import { toast } from "@/components/ui/use-toast"

interface Alert {
  id: number
  patientId: number
  patientName: string
  type: "warning" | "critical"
  message: string
  timestamp: string
  acknowledged: boolean
}

export default function NotificationCenter() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const { socket, isConnected } = useSocket()

  // Carregar alertas existentes
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const token = localStorage.getItem("authToken")
        if (!token) return

        const response = await fetch("/api/alerts", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Falha ao carregar alertas")
        }

        const data = await response.json()
        setAlerts(data)
        setUnreadCount(data.filter((alert: Alert) => !alert.acknowledged).length)
      } catch (error) {
        console.error("Erro ao carregar alertas:", error)
      }
    }

    fetchAlerts()
  }, [])

  // Configurar ouvintes de socket
  useEffect(() => {
    if (!socket || !isConnected) return

    // Entrar na sala do médico
    const userType = localStorage.getItem("userType")
    const userId = localStorage.getItem("userId")

    if (userType === "doctor" && userId) {
      socket.emit("join-doctor-room", Number.parseInt(userId))
    }

    // Ouvir novos alertas
    socket.on("vital-alert", (data) => {
      const newAlert: Alert = {
        ...data,
        acknowledged: false,
      }

      setAlerts((prev) => [newAlert, ...prev])
      setUnreadCount((prev) => prev + 1)

      // Mostrar toast para alertas críticos
      if (data.type === "critical") {
        toast({
          title: "Alerta Crítico!",
          description: `${data.patientName}: ${data.message}`,
          variant: "destructive",
        })
      }
    })

    return () => {
      socket.off("vital-alert")
    }
  }, [socket, isConnected])

  // Função para confirmar um alerta
  const acknowledgeAlert = async (alertId: number) => {
    try {
      const token = localStorage.getItem("authToken")
      if (!token) return

      const response = await fetch(`/api/alerts/${alertId}/acknowledge`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Falha ao confirmar alerta")
      }

      // Atualizar estado local
      setAlerts((prev) => prev.map((alert) => (alert.id === alertId ? { ...alert, acknowledged: true } : alert)))
      setUnreadCount((prev) => prev - 1)

      // Emitir evento de socket
      if (socket && isConnected) {
        socket.emit("acknowledge-alert", alertId)
      }
    } catch (error) {
      console.error("Erro ao confirmar alerta:", error)
    }
  }

  // Função para formatar a data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Função para obter a cor do alerta
  const getAlertColor = (type: string) => {
    return type === "critical"
      ? "bg-red-100 text-red-800 border-red-200"
      : "bg-amber-100 text-amber-800 border-amber-200"
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-medium">Notificações</h3>
          <Badge variant="outline" className="ml-2">
            {alerts.length} {alerts.length === 1 ? "alerta" : "alertas"}
          </Badge>
        </div>
        <ScrollArea className="h-[300px]">
          {alerts.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">Nenhuma notificação</div>
          ) : (
            <div className="space-y-1 p-1">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-md border ${
                    alert.acknowledged ? "opacity-60" : ""
                  } ${getAlertColor(alert.type)}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{alert.patientName}</p>
                      <p className="text-sm mt-1">{alert.message}</p>
                      <p className="text-xs mt-1">{formatDate(alert.timestamp)}</p>
                    </div>
                    {!alert.acknowledged && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 px-2 text-xs"
                        onClick={() => acknowledgeAlert(alert.id)}
                      >
                        <Check className="h-3 w-3 mr-1" />
                        OK
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
