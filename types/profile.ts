export interface ProfileData {
  owner_id: number | null;
  personal: {
    id: number;
    name: string;
    username: string | null;
    date_of_birth: Date | null;
    gender: string | null;
    profession: string;
    tax_id: string;
  };
  contact: {
    email: string;
    phone_number: string;
  };
  address: {
    postal_code: string | null;
    address: string | null;
    number: string | null;
    state: string | null;
    complement: string | null;
    city: string | null;
    country: string | null;
    neighborhood: string | null;
  };
}

export interface ApiError {
  success: boolean;
  message: string;
}