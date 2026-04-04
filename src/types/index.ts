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

export interface Profile {
  id: string;
  full_name: string;
  avatar_url?: string;
  role: 'applicant' | 'employer';
  updated_at?: string;
  
  // Applicant specific fields
  headline?: string;
  bio?: string;
  skills?: string[];
  experience?: ExperienceItem[];
  education?: EducationItem[];
  social_links?: SocialLinks;
  resume_url?: string;
  phone?: string;

  // Employer specific fields
  company_name?: string;
  company_website?: string;
  company_description?: string;
  company_location?: string;
  company_logo_url?: string;
  industry?: string;
}

export interface ExperienceItem {
  company: string;
  role: string;
  duration: string;
  description: string;
}

export interface EducationItem {
  school: string;
  degree: string;
  year: string;
}

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  portfolio?: string;
  twitter?: string;
}
