export interface Candidate {
    id: string;
    user_id: string;
    name: string;
    email: string;
    role: string;
    custom_role?: string;
    bio?: string;
    
    // Job preferences
    job_seeking_type: 'Internship' | 'Part-time' | 'Full-time' | 'Freelance';
    job_preference: 'Remote' | 'On-site' | 'Hybrid' | 'Any';
    expected_salary?: string;
    preferred_locations: string[];
    notice_period: 'Immediate' | '15 days' | '1 month' | '2 months' | '3 months' | 'Negotiable';
    
    // Additional info
    linkedin?: string;
    github?: string;
    portfolio?: string;
    open_to_relocate?: boolean | 'maybe';
    education?: string;
    custom_education?: string;
    graduation_year?: string;
    additional_notes?: string;
    
    // Profile metadata
    avatar_url?: string;
    avatar_cloudinary_id?: string;
    visibility: 'public' | 'private';
    
    created_at: string;
    updated_at: string;
  }
  
  export interface CandidateSkill {
    id: string;
    candidate_id: string;
    skill: string;
    created_at: string;
  }
  
  export interface CandidateProject {
    id: string;
    candidate_id: string;
    title: string;
    description?: string;
    url?: string;
    image_url?: string;
    image_cloudinary_id?: string;
    display_order: number;
    created_at: string;
    updated_at: string;
  }
  
  export interface CandidateFile {
    id: string;
    candidate_id: string;
    file_type: 'resume' | 'cover_letter' | string;
    file_name: string;
    file_url: string;
    file_size?: number;
    mime_type?: string;
    storage_path?: string;
    created_at: string;
  }
  
  export interface CandidatePreference {
    id: string;
    candidate_id: string;
    preference_key: string;
    preference_value: any;
    created_at: string;
    updated_at: string;
  }
  
  export interface CandidateWithDetails extends Candidate {
    skills: CandidateSkill[];
    projects: CandidateProject[];
    files: CandidateFile[];
  }
  
  export interface CandidateSearchParams {
    keywords?: string;
    skills?: string[];
    role?: string;
    location?: string;
    salaryRange?: string;
    jobType?: string;
    page?: number;
    limit?: number;
  }
  
  export interface CandidateSearchResult {
    candidate: CandidateWithDetails;
    score: number;
    explanation: {
      keywordsMatched: number;
      skillsMatched: number;
      locationMatch: boolean;
      jobTypeMatch: boolean;
      roleMatch: boolean;
    };
  }