import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verify } from "jsonwebtoken"

// Rotas que não precisam de autenticação
const publicRoutes = ["/", "/login", "/register", "/forgot-password"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Verificar se a rota é pública
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // Verificar se é uma rota de API
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next()
  }

  // Obter token do cookie ou do header Authorization
  const token = request.cookies.get("token")?.value || request.headers.get("Authorization")?.split(" ")[1]

  // Se não houver token, redirecionar para login
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  try {
    // Verificar token
    const decoded = verify(token, process.env.JWT_SECRET || "fallback_secret")

    // Verificar se o usuário está acessando a rota correta
    const { role } = decoded as { role: string }

    if (pathname.startsWith("/doctor") && role !== "doctor") {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    if (pathname.startsWith("/patient") && role !== "patient") {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    return NextResponse.next()
  } catch (error) {
    // Token inválido, redirecionar para login
    return NextResponse.redirect(new URL("/login", request.url))
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public assets)
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
}
