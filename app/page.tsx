import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Activity, Heart, ArrowRight, LineChart, Bell } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
              MC
            </div>
            <h1 className="text-xl font-bold text-gray-800">MediCare</h1>
          </div>

          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-6">
              <Link href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">
                Recursos
              </Link>
              <Link href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors">
                Como Funciona
              </Link>
              <Link href="#about" className="text-gray-600 hover:text-blue-600 transition-colors">
                Sobre
              </Link>
            </nav>
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="outline">Entrar</Button>
              </Link>
              <Link href="/register">
                <Button>Cadastrar</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Monitoramento Contínuo para Pacientes com Doenças Crônicas
              </h1>
              <p className="text-lg text-gray-700">
                Uma plataforma completa que conecta médicos e pacientes, permitindo o monitoramento remoto e em tempo
                real de sinais vitais para melhorar o tratamento de doenças crônicas.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register">
                  <Button size="lg" className="w-full sm:w-auto">
                    Começar Agora
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Acessar Conta
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-blue-100 rounded-lg"></div>
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-indigo-100 rounded-lg"></div>
                <div className="relative bg-white p-6 rounded-xl shadow-xl border border-gray-100">
                  <img
                    src="/placeholder.svg?height=300&width=400"
                    alt="Dashboard de monitoramento"
                    className="w-full rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Recursos Principais</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Nossa plataforma oferece ferramentas avançadas para o monitoramento eficiente de pacientes com doenças
              crônicas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                    <Activity className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Monitoramento em Tempo Real</h3>
                  <p className="text-gray-600">
                    Acompanhe os sinais vitais dos pacientes em tempo real, com alertas instantâneos para valores fora
                    dos limites.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                    <Heart className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Limites Personalizados</h3>
                  <p className="text-gray-600">
                    Configure limites personalizados para cada paciente, adaptando o monitoramento às necessidades
                    individuais.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                    <Bell className="h-6 w-6 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Sistema de Alertas</h3>
                  <p className="text-gray-600">
                    Receba notificações imediatas quando os sinais vitais do paciente exigirem atenção médica.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                    <LineChart className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Histórico e Tendências</h3>
                  <p className="text-gray-600">
                    Visualize o histórico completo e analise tendências para tomar decisões médicas mais informadas.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Como Funciona</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Um processo simples e eficiente para médicos e pacientes se conectarem e gerenciarem condições crônicas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Cadastro e Conexão</h3>
              <p className="text-gray-600">
                Médicos se cadastram e conectam seus pacientes à plataforma, configurando os parâmetros de
                monitoramento.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Monitoramento Contínuo</h3>
              <p className="text-gray-600">
                Os dispositivos dos pacientes enviam dados de sinais vitais que são analisados em tempo real pela
                plataforma.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Intervenção Oportuna</h3>
              <p className="text-gray-600">
                Médicos recebem alertas quando necessário e podem intervir rapidamente, ajustando tratamentos à
                distância.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                  MC
                </div>
                <h1 className="text-xl font-bold text-white">MediCare</h1>
              </div>
              <p className="text-gray-400">
                Transformando o cuidado de pacientes com doenças crônicas através da tecnologia.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Links Rápidos</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#features" className="hover:text-blue-400 transition-colors">
                    Recursos
                  </Link>
                </li>
                <li>
                  <Link href="#how-it-works" className="hover:text-blue-400 transition-colors">
                    Como Funciona
                  </Link>
                </li>
                <li>
                  <Link href="#about" className="hover:text-blue-400 transition-colors">
                    Sobre Nós
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Contato</h3>
              <ul className="space-y-2">
                <li>contato@medicare.com</li>
                <li>+55 (11) 1234-5678</li>
                <li>São Paulo, Brasil</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="hover:text-blue-400 transition-colors">
                    Termos de Uso
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-blue-400 transition-colors">
                    Política de Privacidade
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-blue-400 transition-colors">
                    LGPD
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} MediCare. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
