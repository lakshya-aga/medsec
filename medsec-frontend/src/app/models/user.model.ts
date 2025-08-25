export interface User {
  id: number;
  email: string;
  phone: string;
  full_name: string;
  user_type: 'doctor' | 'patient';
  created_at: string;
}

export interface UserCreate {
  email: string;
  phone: string;
  password: string;
  user_type: 'doctor' | 'patient';
  full_name: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface Token {
  access_token: string;
  token_type: string;
  user_type: string;
}
