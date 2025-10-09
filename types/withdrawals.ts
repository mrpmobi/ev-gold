import { LucideIcon } from "lucide-react";

export interface FilterParams {
  status: string;
  user_id: string;
  min_amount: string;
  max_amount: string;
  created_from: string;
  created_to: string;
  approved_from: string;
  approved_to: string;
  limit: number;
  offset: number;
}

export interface StatCard {
  title: string;
  value: string;
  change: string;
  trend: string;
  icon: LucideIcon;
  color: string;
  description: string;
}

export interface WithdrawalRequest {
  id: string;
  userName: string;
  userType: string;
  amount: string;
  requestDate: string;
  bankAccount: string;
  status: string;
  priority: string;
  avatar: string;
}

export interface WithdrawalStatsT {
  pendentes: {
    quantidade: number;
    valor: string;
  };
  movimentados: {
    hoje: {
      aprovados: {
        quantidade: number;
        valor: number;
      };
      rejeitados: {
        quantidade: number;
        valor: number;
      };
    };
    semana: {
      aprovados: {
        quantidade: number;
        valor: number;
      };
      rejeitados: {
        quantidade: number;
        valor: number;
      };
    };
    mes: {
      aprovados: {
        quantidade: number;
        valor: number;
      };
      rejeitados: {
        quantidade: number;
        valor: number;
      };
    };
  };
}
