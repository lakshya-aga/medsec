export interface Patient {
  id: number;
  full_name: string;
  phone: string;
  email?: string;
  age: number;
  gender: string;
  queue_number: number;
  created_at: string;
  is_completed: boolean;
}

export interface PatientCreate {
  full_name: string;
  phone: string;
  email?: string;
  age: number;
  gender: string;
}