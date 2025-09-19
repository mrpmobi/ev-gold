import { User } from "@/types/profile";

const API_BASE_URL = "https://ti.mrpmobi.com.br/api/v1";

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  mobile: string;
  device_token: string;
  login_by: string;
  country: string;
  lang: string;
  uuid: string;
  pai: number;
}

interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  access_token?: string;
}

class ApiService {
  private getHeaders(includeAuth = false, token?: string) {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    if (includeAuth && token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }

  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    try {
      const response = await fetch(`${API_BASE_URL}/user/login`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Erro HTTP: ${response.status}`);
      }

      return {
        success: true,
        data: data,
        access_token: data.access_token,
      };
    } catch (error) {
      //console.error("Erro no login:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Erro no login",
      };
    }
  }

  async register(userData: RegisterRequest): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/user/register`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Erro HTTP: ${response.status}`);
      }

      return {
        success: true,
        data: data,
        access_token: data.access_token,
      };
    } catch (error) {
      //console.error("Erro no cadastro:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Erro no cadastro",
      };
    }
  }

  async getUserById(id: number, token: string): Promise<ApiResponse<User>> {
    try {
      const response = await fetch(`${API_BASE_URL}/user/${id}`, {
        method: "GET",
        headers: this.getHeaders(true, token),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Erro HTTP: ${response.status}`);
      }

      return {
        success: true,
        data: data.user || data,
      };
    } catch (error) {
      //console.error("Erro ao buscar usuário:", error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Erro ao buscar usuário",
      };
    }
  }

  async getUserPai(userId: number, token: string): Promise<ApiResponse<User>> {
    try {
      const response = await fetch(`${API_BASE_URL}/user/${userId}/pai`, {
        method: "GET",
        headers: this.getHeaders(true, token),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Erro HTTP: ${response.status}`);
      }

      return {
        success: true,
        data: data.pai || data,
      };
    } catch (error) {
      //console.error("Erro ao buscar patrocinador:", error);
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Erro ao buscar patrocinador",
      };
    }
  }

  async getUserDownlines(
    userId: number,
    token: string
  ): Promise<ApiResponse<User[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/user/${userId}/downlines`, {
        method: "GET",
        headers: this.getHeaders(true, token),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Erro HTTP: ${response.status}`);
      }

      return {
        success: true,
        data: data.downlines || data,
      };
    } catch (error) {
      //console.error("Erro ao buscar rede:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Erro ao buscar rede",
      };
    }
  }

  async getAllUsers(token: string): Promise<ApiResponse<User[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/user/all`, {
        method: "GET",
        headers: this.getHeaders(true, token),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Erro HTTP: ${response.status}`);
      }

      return {
        success: true,
        data: data.users || data,
      };
    } catch (error) {
      //console.error("Erro ao buscar usuários:", error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Erro ao buscar usuários",
      };
    }
  }

  async findUserByEmail(
    email: string,
    token: string
  ): Promise<ApiResponse<User>> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/user/findByEmail/${encodeURIComponent(email)}`,
        {
          method: "GET",
          headers: this.getHeaders(true, token),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Erro HTTP: ${response.status}`);
      }

      // AQUI ESTÁ A CORREÇÃO: Acessar data.usuario conforme o retorno da API
      if (data && data.usuario) {
        return {
          success: true,
          data: data.usuario,
        };
      } else {
        throw new Error("Formato de resposta inesperado para findUserByEmail");
      }
    } catch (error) {
      //console.error("API: Erro ao buscar usuário por email:", error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Usuário não encontrado",
      };
    }
  }
}

export const apiService = new ApiService();
export type { User, LoginRequest, RegisterRequest, ApiResponse, LoginResponse };
