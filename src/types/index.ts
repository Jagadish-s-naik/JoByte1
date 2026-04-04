export interface Mission {
  id?: string;
  title?: string;
  company?: string;
  type?: string;
  location?: string;
}

export interface Report {
  id?: string;
  total_score: number;
  technical_score: number;
  logic_score: number;
  integrity_score: number;
  strikes: number;
  ai_analysis?: string;
  mission?: Mission;
  candidate_id?: string;
}

export interface Candidate {
  id?: string;
  full_name: string;
  email?: string;
  created_at: string;
  status?: string;
  mission?: Mission;
  report?: Report[];
}

export interface JobPosting {
  id: string;
  title: string;
  type: string;
  location: string;
  candidates?: { count: number }[];
}
