import type { User } from "./api"

interface AuthData {
  user: User
  token: string
  expires_in?: number
  token_type?: string
  login_time?: number
}

class AuthManager {
  private readonly STORAGE_KEY = "mrp_mobi_auth"

  saveAuth(user: User, token: string, expires_in?: number, token_type?: string): void {
    const authData: AuthData = {
      user,
      token,
      expires_in,
      token_type: token_type || "Bearer",
      login_time: Date.now(),
    }

    if (typeof window !== "undefined") {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(authData))
    }
  }

  getAuth(): AuthData | null {
    if (typeof window === "undefined") return null

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (!stored) {
        //console.log("AuthManager: Nenhum token encontrado no localStorage")
        return null
      }

      const authData = JSON.parse(stored) as AuthData

      // Verificar se o token expirou
      if (authData.expires_in && authData.login_time) {
        const now = Date.now()
        const expirationTime = authData.login_time + authData.expires_in * 1000

        if (now > expirationTime) {
          //console.log("AuthManager: Token expirado, removendo do localStorage")
          this.clearAuth()
          return null
        }
      }

      return authData
    } catch (error) {
      //console.error("AuthManager: Erro ao recuperar dados de autenticação:", error)
      this.clearAuth() // Limpar dados corrompidos
      return null
    }
  }

  clearAuth(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.STORAGE_KEY)
      //console.log("AuthManager: Token removido do localStorage")
    }
  }

  isAuthenticated(): boolean {
    const auth = this.getAuth()
    return auth !== null && !!auth.token
  }

  getToken(): string | null {
    const auth = this.getAuth()
    return auth?.token || null
  }

  getUser(): User | null {
    const auth = this.getAuth()
    return auth?.user || null
  }

  // Método para verificar se o token está próximo do vencimento
  isTokenExpiringSoon(minutesThreshold = 5): boolean {
    const auth = this.getAuth()
    if (!auth || !auth.expires_in || !auth.login_time) return false

    const now = Date.now()
    const expirationTime = auth.login_time + auth.expires_in * 1000
    const thresholdTime = minutesThreshold * 60 * 1000

    return expirationTime - now < thresholdTime
  }
}

export const authManager = new AuthManager()
export type { AuthData }
