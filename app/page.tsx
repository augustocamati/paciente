import PatientMonitor from "@/components/patient-monitor"

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Monitoramento de Paciente</h1>
        <PatientMonitor />
      </div>
    </main>
  )
}
