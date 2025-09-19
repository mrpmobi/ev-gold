import { User } from "@/types/profile";

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

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  access_token?: string;
}

interface Downline {
  id: number;
  name: string; // Propriedade esperada para o nome
  email: string;
  mobile: string;
  pai: number;
  nivel: number;
  created_at: string;
  total_valor: number;
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

      // A API pode retornar { user: {...} } ou o objeto user direto
      // Mapeia 'nome' para 'name' se presente
      const userData = data.user || data;
      if (userData && userData.nome && !userData.name) {
        userData.name = userData.nome;
      }

      return {
        success: true,
        data: userData,
      };
    } catch (error) {
      //console.error(`API: Erro ao buscar usuário ${id}:`, error);
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

      let paiData: any = null;
      // Verifica se a resposta contém a chave 'upline' e se é um array não vazio
      if (data.upline && Array.isArray(data.upline) && data.upline.length > 0) {
        paiData = data.upline[0]; // Pega o primeiro elemento do array upline
      } else if (data.pai) {
        paiData = data.pai;
      } else if (data.user) {
        paiData = data.user;
      } else if (data.usuario) {
        paiData = data.usuario;
      } else {
        paiData = data; // Fallback para o próprio objeto data
      }

      // Mapeia 'nome' para 'name' se presente
      if (paiData && paiData.nome && !paiData.name) {
        paiData.name = paiData.nome;
      }

      if (paiData && paiData.id) {
        return {
          success: true,
          data: paiData,
        };
      } else {
        //console.error(
        //  `API: Patrocinador para ${userId} não possui ID ou é nulo/indefinido após extração. Objeto:`,
        //  paiData
        //);
        throw new Error(
          "Formato de resposta inesperado para getUserPai ou dados incompletos."
        );
      }
    } catch (error) {
      //console.error(`API: Erro ao buscar patrocinador para ${userId}:`, error);
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
      const response = await fetch(
        `${API_BASE_URL}/user/${userId}/downlinesOptimized`,
        {
          method: "GET",
          headers: this.getHeaders(true, token),
        }
      );

      let data: any;
      try {
        data = await response.json();
      } catch (parseError) {
        //console.error(
          //`API: Não foi possível fazer parse do JSON dos downlines para ${userId}:`,
          //parseError
        //);
        throw new Error(
          `Erro ao processar a resposta da API (JSON inválido). Status: ${response.status}`
        );
      }

      if (!response.ok) {
        const msg =
          data?.message ||
          JSON.stringify(data) ||
          `Erro HTTP: ${response.status}`;
        throw new Error(msg);
      }

      // Verifica se a resposta contém a chave 'downlines' ou se é o array direto
      const downlinesData = data.downlines || data;

      if (!Array.isArray(downlinesData)) {
        //console.error(
          //`API: Resposta inesperada para getUserDownlines de ${userId}:`,
          //data
        //);
        throw new Error(
          "Formato de resposta inesperado: esperado array de downlines ou objeto com chave 'downlines'."
        );
      }

      // Mapeia cada item para garantir que 'nome' seja transformado em 'name'
      const formattedDownlines: User[] = downlinesData.map((item: any) => ({
        ...item,
        name: item.nome || item.name,
      }));

      return {
        success: true,
        data: formattedDownlines,
      };
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

      // Acessar data.usuario conforme o retorno da API
      if (data && data.usuario) {
        // Mapeia 'nome' para 'name' se presente
        if (data.usuario.nome && !data.usuario.name) {
          data.usuario.name = data.usuario.nome;
        }
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
export type { User, Downline, LoginRequest, RegisterRequest, ApiResponse, LoginResponse };
