export interface ProfileData {
  owner_id: number | null;
  personal: {
    name: string;
    username: string | null;
    date_of_birth: Date | null;
    gender: string | null;
    profession: string;
    tax_id: string;
  };
}

export interface ApiError {
  success: boolean;
  message: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  mobile: string;
  pai?: number;
  downlines?: User[];
  totalConsultores?: number;
  diretos?: number;
  profundidade?: number;
  nivel?: number;
}
