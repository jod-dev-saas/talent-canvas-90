export interface CandidateProfile {
  // Basic Info
  name: string;
  email: string;
  role: string;
  customRole?: string;
  
  // Skills
  skills: string[];
  
  // Experience
  bio: string;
  
  // Projects
  projects: Project[];
  
  // Resume
  resumeFile?: File | null;
  resumeFileUrl?: string;

  // Job preferences
  jobSeekingType: string;
  jobPreference: string;
  expectedSalary?: string;
  preferredLocations: string[];
  noticePeriod?: string;

  // Additional info
  linkedin?: string;
  github?: string;
  portfolio?: string;
  openToRelocate?: boolean | 'maybe';
  education?: string;
  customEducation?: string;
  graduationYear?: string;
  additionalNotes?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image?: string;
}