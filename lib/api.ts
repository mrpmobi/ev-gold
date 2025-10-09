import { User } from "@/types/profile";
import { FilterParams } from "@/types/withdrawals";

export const API_BASE_URL = "https://app.mrpgold.com.br/api";
//export const API_BASE_URL = "http://127.0.0.1:8000/api/v1"

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  nome: string;
  email: string;
  senha: string;
  patrocinador_id: number;
}

interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

interface ExtratoResponse {
  saldo: { total: string; pendente: string; moeda: string };
  extrato: [];
  resumo: { total_transacoes: number; ultima_atualizacao: string };
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  access_token?: string;
}

interface ContagemPorNivel {
  [nivel: number]: number;
}

interface DownlinesResponse {
  contagem_por_nivel: ContagemPorNivel;
  downlines: Downline[];
}

interface UserDataResponse {
  message: ContagemPorNivel;
  data: UserData;
}

interface UserData {
  id: number;
  name: string;
  email: string;
  cpf: string;
  email_verified_at: string;
  data_ativavao: string;
  created_at: string;
  updated_at: string;
  patrocinador_id: string;
}

interface Downline {
  id: number;
  nome: string;
  nivel_relativo: number;
  created_at: string;
  ganhos: number;
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
      const response = await fetch(`${API_BASE_URL}/user/cadastro`, {
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

  async getUserDownlines(
    token: string,
    queryParams?: URLSearchParams
  ): Promise<ApiResponse<DownlinesResponse>> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/user/downlines?${queryParams?.toString()}`,
        {
          method: "GET",
          headers: this.getHeaders(true, token),
        }
      );

      if (!response.ok) {
        const msg = `Erro HTTP: ${response.status}`;
        throw new Error(msg);
      }

      const data = await response.json();

      if (data && data.contagem_por_nivel && data.downlines) {
        return {
          success: true,
          data: data,
        };
      } else {
        throw new Error("Estrutura de dados inválida na resposta da API");
      }
    } catch (error) {
      //console.error(`API: Erro ao buscar rede para ${userId}:`, error);
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Erro desconhecido ao buscar rede",
        data: undefined,
      };
    }
  }

  async getUserData(token: string): Promise<ApiResponse<UserDataResponse>> {
    try {
      const response = await fetch(`${API_BASE_URL}/user/me`, {
        method: "GET",
        headers: this.getHeaders(true, token),
      });

      const data = await response.json();

      if (!response.ok) {
        const msg = `Erro HTTP: ${response.status}`;
        throw new Error(msg);
      }

      if (data && data.message && data.data) {
        return {
          success: true,
          data: data,
        };
      } else {
        throw new Error("Estrutura de dados inválida na resposta da API");
      }
    } catch (error) {
      //console.error(`API: Erro ao buscar rede para ${userId}:`, error);
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Erro desconhecido ao buscar rede",
        data: undefined,
      };
    }
  }

  async refresh(token: string): Promise<ApiResponse<string>> {
    try {
      const response = await fetch(`${API_BASE_URL}/user/refresh`, {
        method: "POST",
        headers: this.getHeaders(true, token),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Erro HTTP: ${response.status}`);
      }

      if (data && data.access_token) {
        return {
          success: true,
          data: data.access_token,
        };
      } else {
        throw new Error("Formato de resposta inesperado para refresh");
      }
    } catch (error) {
      //console.error("API: Erro ao buscar usuário por email:", error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Falha ao atualizar token",
      };
    }
  }

  async getTotalPatrocinios(token: string): Promise<ApiResponse<string>> {
    try {
      const response = await fetch(`${API_BASE_URL}/user/matriz/contagem`, {
        method: "GET",
        headers: this.getHeaders(true, token),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Erro HTTP: ${response.status}`);
      }

      if (data && data.data && data.data.total_patrocinio) {
        return {
          success: true,
          data: data.data.total_patrocinio,
        };
      } else {
        throw new Error(
          "Formato de resposta inesperado para total de patrocinios"
        );
      }
    } catch (error) {
      //console.error("API: Erro ao buscar usuário por email:", error);
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Falha ao obter total de patrocinios",
      };
    }
  }

  async logout(token: string): Promise<ApiResponse<boolean>> {
    try {
      const response = await fetch(`${API_BASE_URL}/user/logout`, {
        method: "POST",
        headers: this.getHeaders(true, token),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Erro HTTP: ${response.status}`);
      }

      if (data && data.message) {
        return {
          success: true,
          data: data.message,
        };
      } else {
        throw new Error("Formato de resposta inesperado para logout");
      }
    } catch (error) {
      //console.error("API: Erro ao buscar usuário por email:", error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Falha ao realizar logout",
      };
    }
  }

  async getSaldo(token: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/user/wallet/saldo`, {
        method: "GET",
        headers: this.getHeaders(true, token),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Erro HTTP: ${response.status}`);
      }

      if (data && data.balance) {
        return {
          success: true,
          data: data,
        };
      } else {
        throw new Error("Formato de resposta inesperado para Extrato");
      }
    } catch (error) {
      //console.error("API: Erro ao buscar usuário por email:", error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Falha ao obter extrato",
      };
    }
  }

  async getExtrato(token: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/user/wallet/extrato`, {
        method: "GET",
        headers: this.getHeaders(true, token),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Erro HTTP: ${response.status}`);
      }

      if (data) {
        return {
          success: true,
          data: data,
        };
      } else {
        throw new Error("Formato de resposta inesperado para Extrato");
      }
    } catch (error) {
      //console.error("API: Erro ao buscar usuário por email:", error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Falha ao obter extrato",
      };
    }
  }

  async getGanhos(token: string): Promise<ApiResponse<ExtratoResponse>> {
    try {
      const response = await fetch(`${API_BASE_URL}/saldo/extrato`, {
        method: "GET",
        headers: this.getHeaders(true, token),
      });

      const res = await response.json();

      if (!response.ok) {
        throw new Error(res.message || `Erro HTTP: ${response.status}`);
      }

      if (
        res &&
        res.success &&
        res.data &&
        res.data.extrato &&
        res.data.resumo
      ) {
        return {
          success: true,
          data: res.data,
        };
      } else {
        throw new Error("Formato de resposta inesperado para Extrato");
      }
    } catch (error) {
      //console.error("API: Erro ao buscar usuário por email:", error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Falha ao obter extrato",
      };
    }
  }

  async getSaques(
    token: string,
    params?: FilterParams
  ): Promise<ApiResponse<any>> {
    try {
      // Converter o body em query parameters
      const queryParams = new URLSearchParams();

      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== null && value !== undefined && value !== "") {
            queryParams.append(key, value.toString());
          }
        });
      }

      const url = `${API_BASE_URL}/user/withdrawals${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;

      const response = await fetch(url, {
        method: "GET",
        headers: this.getHeaders(true, token),
      });

      const res = await response.json();

      if (!response.ok) {
        throw new Error(res.message || `Erro HTTP: ${response.status}`);
      }

      if (res) {
        return {
          success: true,
          data: res,
        };
      } else {
        throw new Error("Formato de resposta inesperado para Saques");
      }
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Falha ao obter saques",
      };
    }
  }

  async getAtivo(token: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/user/ativo`, {
        method: "GET",
        headers: this.getHeaders(true, token),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Erro HTTP: ${response.status}`);
      }

      if (data) {
        return {
          success: true,
          data: data,
        };
      } else {
        throw new Error("Formato de resposta inesperado para getAtivo");
      }
    } catch (error) {
      //console.error("API: Erro ao buscar usuário por email:", error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Falha ao obter getAtivo",
      };
    }
  }

  async saque(token: string, amount: number): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/user/withdrawals`, {
        method: "POST",
        headers: this.getHeaders(true, token),
        body: JSON.stringify({
          amount: amount,
          status_description: "Solicitação de saque de R$ " + amount,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Erro HTTP: ${response.status}`);
      }

      return {
        success: true,
        data: data,
      };
    } catch (error) {
      //console.error("Erro no cadastro:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Erro ao sacar",
      };
    }
  }

  async ativarLicenca(token: string, id: number): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/checkout/preference`, {
        method: "POST",
        headers: this.getHeaders(true, token),
        body: JSON.stringify({ usuario_id: id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Erro HTTP: ${response.status}`);
      }

      return {
        success: true,
        data: data,
      };
    } catch (error) {
      //console.error("Erro no cadastro:", error);
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Erro ao buscar link de ativação",
      };
    }
  }
}

export const apiService = new ApiService();
export type {
  User,
  Downline,
  LoginRequest,
  RegisterRequest,
  ApiResponse,
  LoginResponse,
  ContagemPorNivel,
};
