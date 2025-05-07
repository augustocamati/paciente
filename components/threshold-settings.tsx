"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { DialogFooter } from "@/components/ui/dialog"
import { Slider } from "@/components/ui/slider"

interface ThresholdSettingsProps {
  thresholds: {
    spo2: { min: number; max: number }
    bpm: { min: number; max: number }
    temperature: { min: number; max: number }
  }
  onSave: (thresholds: any) => void
}

export default function ThresholdSettings({ thresholds, onSave }: ThresholdSettingsProps) {
  const [newThresholds, setNewThresholds] = useState({ ...thresholds })

  const handleChange = (type: string, minOrMax: "min" | "max", value: number | number[]) => {
    const numValue = Array.isArray(value) ? value[0] : value

    setNewThresholds((prev) => ({
      ...prev,
      [type]: {
        ...prev[type as keyof typeof prev],
        [minOrMax]: numValue,
      },
    }))
  }

  return (
    <div className="space-y-6 py-4">
      {/* SPO2 Settings */}
      <div className="space-y-4">
        <div>
          <Label className="text-base font-medium">Saturação de Oxigênio (SPO2)</Label>
          <p className="text-sm text-muted-foreground">Valores normais: 95-100%</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="spo2-min">Mínimo (%)</Label>
            <div className="flex items-center gap-2">
              <Slider
                id="spo2-min"
                min={85}
                max={100}
                step={1}
                value={[newThresholds.spo2.min]}
                onValueChange={(value) => handleChange("spo2", "min", value)}
              />
              <Input
                type="number"
                id="spo2-min-input"
                className="w-16"
                value={newThresholds.spo2.min}
                onChange={(e) => handleChange("spo2", "min", Number(e.target.value))}
                min={85}
                max={100}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="spo2-max">Máximo (%)</Label>
            <div className="flex items-center gap-2">
              <Slider
                id="spo2-max"
                min={90}
                max={100}
                step={1}
                value={[newThresholds.spo2.max]}
                onValueChange={(value) => handleChange("spo2", "max", value)}
              />
              <Input
                type="number"
                id="spo2-max-input"
                className="w-16"
                value={newThresholds.spo2.max}
                onChange={(e) => handleChange("spo2", "max", Number(e.target.value))}
                min={90}
                max={100}
              />
            </div>
          </div>
        </div>
      </div>

      {/* BPM Settings */}
      <div className="space-y-4">
        <div>
          <Label className="text-base font-medium">Frequência Cardíaca (BPM)</Label>
          <p className="text-sm text-muted-foreground">Valores normais: 60-100 BPM</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="bpm-min">Mínimo (BPM)</Label>
            <div className="flex items-center gap-2">
              <Slider
                id="bpm-min"
                min={40}
                max={100}
                step={1}
                value={[newThresholds.bpm.min]}
                onValueChange={(value) => handleChange("bpm", "min", value)}
              />
              <Input
                type="number"
                id="bpm-min-input"
                className="w-16"
                value={newThresholds.bpm.min}
                onChange={(e) => handleChange("bpm", "min", Number(e.target.value))}
                min={40}
                max={100}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bpm-max">Máximo (BPM)</Label>
            <div className="flex items-center gap-2">
              <Slider
                id="bpm-max"
                min={60}
                max={200}
                step={1}
                value={[newThresholds.bpm.max]}
                onValueChange={(value) => handleChange("bpm", "max", value)}
              />
              <Input
                type="number"
                id="bpm-max-input"
                className="w-16"
                value={newThresholds.bpm.max}
                onChange={(e) => handleChange("bpm", "max", Number(e.target.value))}
                min={60}
                max={200}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Temperature Settings */}
      <div className="space-y-4">
        <div>
          <Label className="text-base font-medium">Temperatura</Label>
          <p className="text-sm text-muted-foreground">Valores normais: 36.0-37.5 °C</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="temp-min">Mínimo (°C)</Label>
            <div className="flex items-center gap-2">
              <Slider
                id="temp-min"
                min={35.0}
                max={37.0}
                step={0.1}
                value={[newThresholds.temperature.min]}
                onValueChange={(value) => handleChange("temperature", "min", value)}
              />
              <Input
                type="number"
                id="temp-min-input"
                className="w-16"
                value={newThresholds.temperature.min}
                onChange={(e) => handleChange("temperature", "min", Number(e.target.value))}
                min={35.0}
                max={37.0}
                step={0.1}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="temp-max">Máximo (°C)</Label>
            <div className="flex items-center gap-2">
              <Slider
                id="temp-max"
                min={37.0}
                max={40.0}
                step={0.1}
                value={[newThresholds.temperature.max]}
                onValueChange={(value) => handleChange("temperature", "max", value)}
              />
              <Input
                type="number"
                id="temp-max-input"
                className="w-16"
                value={newThresholds.temperature.max}
                onChange={(e) => handleChange("temperature", "max", Number(e.target.value))}
                min={37.0}
                max={40.0}
                step={0.1}
              />
            </div>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={() => setNewThresholds({ ...thresholds })}>
          Cancelar
        </Button>
        <Button onClick={() => onSave(newThresholds)}>Salvar Configurações</Button>
      </DialogFooter>
    </div>
  )
}
