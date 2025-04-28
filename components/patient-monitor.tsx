"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Thermometer, Droplet } from "lucide-react"

// Função para gerar valores aleatórios dentro de um intervalo
const getRandomValue = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export default function PatientMonitor() {
  // Estado inicial para os sinais vitais
  const [vitals, setVitals] = useState({
    spo2: 98,
    bpm: 75,
    temperature: 36.5,
  })

  // Simular mudanças nos sinais vitais a cada 3 segundos
  useEffect(() => {
    const fetchVitals = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vitals`);
        if (!response.ok) {
          throw new Error("Failed to fetch vitals");
        }
        const data = await response.json();
        console.log('data', data[0])
        setVitals({
          spo2: data[0].spo2,
          bpm: data[0].bpm,
          temperature: data[0].temperature,
        });
      } catch (error) {
        console.error("Error fetching vitals:", error);
      }
    };

    fetchVitals();
    const interval = setInterval(fetchVitals, 1000);

    return () => clearInterval(interval);
  }, []);

  // Função para determinar a cor baseada no valor
  const getStatusColor = (type: string, value: number) => {
    switch (type) {
      case "spo2":
        return value < 95 ? "text-amber-500" : value < 90 ? "text-red-500" : "text-green-500"
      case "bpm":
        return value < 60 ? "text-amber-500" : value > 100 ? "text-red-500" : "text-green-500"
      case "temperature":
        return value < 36 ? "text-amber-500" : value > 37.5 ? "text-red-500" : "text-green-500"
      default:
        return "text-green-500"
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* SPO2 Card */}
      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium">Saturação de Oxigênio</CardTitle>
          <Droplet className="h-5 w-5 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-6">
            <span className={`text-5xl font-bold ${getStatusColor("spo2", vitals.spo2)}`}>{vitals.spo2}%</span>
          </div>
          <div className="text-xs text-center text-muted-foreground mt-2">Normal: 95-100%</div>
        </CardContent>
      </Card>

      {/* BPM Card */}
      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium">Frequência Cardíaca</CardTitle>
          <Activity className="h-5 w-5 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-6">
            <span className={`text-5xl font-bold ${getStatusColor("bpm", vitals.bpm)}`}>{vitals.bpm}</span>
            <span className="text-lg ml-2">BPM</span>
          </div>
          <div className="text-xs text-center text-muted-foreground mt-2">Normal: 60-100 BPM</div>
        </CardContent>
      </Card>

      {/* Temperature Card */}
      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium">Temperatura</CardTitle>
          <Thermometer className="h-5 w-5 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-6">
            <span className={`text-5xl font-bold ${getStatusColor("temperature", vitals.temperature)}`}>
              {vitals.temperature}
            </span>
            <span className="text-lg ml-2">°C</span>
          </div>
          <div className="text-xs text-center text-muted-foreground mt-2">Normal: 36.0-37.5 °C</div>
        </CardContent>
      </Card>
    </div>
  )
}
