export interface Session {
  id: number;
  patient_id: number;
  doctor_id: number;
  audio_file_path?: string;
  transcription?: string;
  report_path?: string;
  created_at: string;
}

export interface Report {
  id: number;
  created_at: string;
  doctor_name: string;
  report_available: boolean;
}
