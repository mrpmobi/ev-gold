import type { User } from "./api"

interface AuthData {
  user: User
  token: string
}

class AuthManager {
  private readonly STORAGE_KEY = "mrp_mobi_auth"

  saveAuth(user: User, token: string): void {
    const authData: AuthData = { user, token }
    if (typeof window !== "undefined") {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(authData))
    }
  }

  getAuth(): AuthData | null {
    if (typeof window === "undefined") return null

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (!stored) return null

      return JSON.parse(stored) as AuthData
    } catch (error) {
      //console.error("Erro ao recuperar dados de autenticação:", error)
      return null
    }
  }

  clearAuth(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.STORAGE_KEY)
    }
  }

  isAuthenticated(): boolean {
    return this.getAuth() !== null
  }

  getToken(): string | null {
    const auth = this.getAuth()
    return auth?.token || null
  }

  getUser(): User | null {
    const auth = this.getAuth()
    return auth?.user || null
  }
}

export const authManager = new AuthManager()
export type { AuthData }
