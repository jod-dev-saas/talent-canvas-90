export interface CandidateProfile {
  // Basic Info
  name: string;
  email: string;
  role: string;
  
  // Skills
  skills: string[];
  
  // Experience
  bio: string;
  
  // Projects
  projects: Project[];
  
  // Resume
  resumeFile?: File | null;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image?: string;
}