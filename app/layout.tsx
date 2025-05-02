import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Pacientes com doencas cronicas',
  description: 'criado por Augusto Camati',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
