import React, { useState, useCallback, useRef, useMemo } from 'react';
import { 
  Upload, FileText, CheckCircle, AlertCircle, XCircle, Target, 
  TrendingUp, Zap, User, Plus, Briefcase, Settings, Download, 
  Share2, Eye, Trash2, AlertTriangle, RefreshCw, Info, Clock,
  BarChart3, FileCheck, Star, BookOpen, Lightbulb
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { CandidateHeader } from '@/components/CandidateHeader';

// Enhanced types and interfaces
type ATSResult = {
  score: number;
  issues: Array<{
    type: 'critical' | 'warning' | 'suggestion';
    title: string;
    description: string;
    fix: string;
    priority: number;
  }>;
  strengths: string[];
  keywords: {
    found: string[];
    missing: string[];
    roleSpecific: string[];
    jobDescriptionMatch: number;
  };
  sections: {
    contact: boolean;
    experience: boolean;
    education: boolean;
    skills: boolean;
    summary: boolean;
  };
  matchPercentage: number;
  recommendations: string[];
  technicalDetails: {
    wordCount: number;
    readabilityScore: number;
    atsCompatibility: number;
    formatScore: number;
  };
  detailedAnalysis?: {
    industrySpecificKeywords: string[];
    experienceLevel: 'entry' | 'mid' | 'senior' | 'executive';
    improvementPriority: Array<{
      area: string;
      impact: 'high' | 'medium' | 'low';
      effort: 'high' | 'medium' | 'low';
      suggestion: string;
    }>;
  };
};

type Role = {
  id: string;
  title: string;
  keywords: string[];
  description?: string;
  level?: 'entry' | 'mid' | 'senior' | 'executive';
  category?: string;
  requiredSections?: string[];
  weightings?: {
    keywords: number;
    experience: number;
    education: number;
    skills: number;
  };
};

type CustomRole = {
  id: string;
  title: string;
  keywords: string[];
  description?: string;
  isCustom: true;
};

type JobDescription = {
  id: string;
  title: string;
  company: string;
  description: string;
  requirements: string[];
  keywords: string[];
  createdAt: Date;
  estimatedSalary?: string;
  location?: string;
};

type FileProcessingError = {
  type: 'size' | 'format' | 'extraction' | 'network' | 'unknown';
  message: string;
  suggestion?: string;
};

type AnalysisHistory = {
  id: string;
  score: number;
  roleTitle: string;
  timestamp: Date;
  wordCount: number;
  keywordMatch: number;
};

// Enhanced predefined roles with more details
const PREDEFINED_ROLES: Role[] = [
  {
    id: 'frontend',
    title: 'Frontend Developer',
    keywords: ['React', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'Next.js', 'Tailwind', 'Accessibility', 'Performance', 'GraphQL', 'REST', 'Vue', 'Angular', 'Webpack', 'Sass', 'Redux', 'Jest', 'Cypress'],
    category: 'Development',
    level: 'mid',
    description: 'Builds user-facing web applications with modern frameworks',
    requiredSections: ['experience', 'skills', 'contact'],
    weightings: { keywords: 0.4, experience: 0.3, education: 0.1, skills: 0.2 }
  },
  {
    id: 'backend',
    title: 'Backend Developer',
    keywords: ['Node.js', 'Python', 'Java', 'REST', 'GraphQL', 'SQL', 'PostgreSQL', 'MongoDB', 'Docker', 'Kubernetes', 'Express', 'FastAPI', 'Spring', 'Microservices', 'Redis', 'AWS', 'API Design', 'Database Design'],
    category: 'Development',
    level: 'mid',
    description: 'Develops server-side applications and APIs',
    requiredSections: ['experience', 'skills', 'contact'],
    weightings: { keywords: 0.4, experience: 0.3, education: 0.1, skills: 0.2 }
  },
  {
    id: 'fullstack',
    title: 'Full Stack Developer',
    keywords: ['React', 'Node.js', 'TypeScript', 'SQL', 'Docker', 'AWS', 'CI/CD', 'GraphQL', 'Python', 'JavaScript', 'MongoDB', 'PostgreSQL', 'Express', 'Next.js', 'API Development', 'System Design'],
    category: 'Development',
    level: 'mid',
    description: 'Works on both frontend and backend technologies',
    requiredSections: ['experience', 'skills', 'contact'],
    weightings: { keywords: 0.35, experience: 0.35, education: 0.1, skills: 0.2 }
  },
  {
    id: 'data-scientist',
    title: 'Data Scientist',
    keywords: ['Python', 'Pandas', 'NumPy', 'Machine Learning', 'TensorFlow', 'PyTorch', 'SQL', 'Feature Engineering', 'Scikit-learn', 'Statistics', 'R', 'Jupyter', 'Data Visualization', 'A/B Testing', 'Deep Learning'],
    category: 'Data',
    level: 'mid',
    description: 'Analyzes data to extract insights and build predictive models',
    requiredSections: ['experience', 'skills', 'education', 'contact'],
    weightings: { keywords: 0.3, experience: 0.3, education: 0.2, skills: 0.2 }
  },
  {
    id: 'devops',
    title: 'DevOps Engineer',
    keywords: ['Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'AWS', 'Monitoring', 'Ansible', 'Jenkins', 'Git', 'Linux', 'Cloud', 'Infrastructure', 'Prometheus', 'Grafana', 'Helm', 'GitLab', 'Security'],
    category: 'Operations',
    level: 'mid',
    description: 'Manages infrastructure and deployment pipelines',
    requiredSections: ['experience', 'skills', 'contact'],
    weightings: { keywords: 0.4, experience: 0.3, education: 0.1, skills: 0.2 }
  },
  {
    id: 'mobile',
    title: 'Mobile Developer',
    keywords: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'iOS', 'Android', 'Performance', 'Store', 'UI/UX', 'Firebase', 'Push Notifications', 'App Store', 'Play Store', 'Mobile Architecture'],
    category: 'Development',
    level: 'mid',
    description: 'Develops mobile applications for iOS and Android',
    requiredSections: ['experience', 'skills', 'contact'],
    weightings: { keywords: 0.4, experience: 0.3, education: 0.1, skills: 0.2 }
  },
  {
    id: 'product-manager',
    title: 'Product Manager',
    keywords: ['Product Strategy', 'Roadmap', 'A/B Testing', 'User Research', 'Analytics', 'SQL', 'Agile', 'Scrum', 'Stakeholder Management', 'KPI', 'User Stories', 'Market Research', 'Competitive Analysis'],
    category: 'Management',
    level: 'senior',
    description: 'Defines product strategy and manages product lifecycle',
    requiredSections: ['experience', 'skills', 'contact', 'education'],
    weightings: { keywords: 0.25, experience: 0.4, education: 0.15, skills: 0.2 }
  },
  {
    id: 'ui-ux-designer',
    title: 'UI/UX Designer',
    keywords: ['Figma', 'User Research', 'Prototyping', 'Design Systems', 'Accessibility', 'Wireframes', 'User Testing', 'Adobe', 'Sketch', 'InVision', 'Information Architecture', 'Usability Testing'],
    category: 'Design',
    level: 'mid',
    description: 'Designs user interfaces and experiences',
    requiredSections: ['experience', 'skills', 'contact'],
    weightings: { keywords: 0.3, experience: 0.35, education: 0.15, skills: 0.2 }
  }
];

// Enhanced utility functions
const EMAIL_RE = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
const PHONE_RE = /(\+\d{1,3}[-.\s]?)?(\d{10}|\d{3}[-.\s]\d{3}[-.\s]\d{4})/i;
const LINKEDIN_RE = /linkedin\.com\/in\/[a-zA-Z0-9-]+/i;
const GITHUB_RE = /github\.com\/[a-zA-Z0-9-]+/i;

const normalize = (s = '') => {
  return s
    .replace(/\r\n/g, ' ')
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
};

const getFileType = (file: File): 'pdf' | 'docx' | 'doc' | 'txt' | 'unknown' => {
  const extension = file.name.split('.').pop()?.toLowerCase();
  const mimeType = file.type.toLowerCase();
  
  if (mimeType === 'application/pdf' || extension === 'pdf') return 'pdf';
  if (mimeType.includes('wordprocessingml') || extension === 'docx') return 'docx';
  if (mimeType.includes('msword') || extension === 'doc') return 'doc';
  if (mimeType === 'text/plain' || extension === 'txt') return 'txt';
  
  return 'unknown';
};

// Enhanced keyword extraction
function extractKeywordsFromJobDescription(text: string): string[] {
  if (!text || text.trim().length === 0) return [];
  
  const stopWords = new Set([
    'the', 'and', 'for', 'with', 'that', 'this', 'are', 'is', 'in', 'on', 'to', 'of', 'a', 'an',
    'will', 'be', 'have', 'has', 'can', 'must', 'should', 'would', 'could', 'may', 'might',
    'our', 'we', 'you', 'your', 'they', 'their', 'who', 'what', 'when', 'where', 'why', 'how',
    'job', 'position', 'role', 'candidate', 'company', 'team', 'work', 'experience', 'years',
    'looking', 'seeking', 'hiring', 'opportunity', 'join', 'about', 'from', 'at', 'by', 'up'
  ]);
  
  // Extract multi-word technical terms first
  const technicalTerms: string[] = [];
  const technicalPatterns = [
    /\b[A-Z][a-z]+\s[A-Z][a-z]+\b/g, // CamelCase terms like "React Native"
    /\b[A-Z]{2,}\b/g, // Acronyms like "SQL", "API"
    /\b\w+\.\w+\b/g, // Dotted terms like "Node.js"
    /\b\w+[-_]\w+\b/g // Hyphenated/underscore terms
  ];
  
  technicalPatterns.forEach(pattern => {
    const matches = text.match(pattern) || [];
    technicalTerms.push(...matches.map(term => term.toLowerCase()));
  });
  
  // Extract individual words
  const words = text
    .replace(/[^\w\s.-]/g, ' ')
    .toLowerCase()
    .split(/\s+/)
    .filter(word => 
      word.length > 2 && 
      !stopWords.has(word) && 
      !/^\d+$/.test(word) &&
      /[a-zA-Z]/.test(word) // Must contain at least one letter
    );
  
  const allTerms = [...technicalTerms, ...words];
  const termCounts: Record<string, number> = {};
  
  allTerms.forEach(term => {
    termCounts[term] = (termCounts[term] || 0) + 1;
  });
  
  // Return top 40 terms, prioritizing technical terms and frequency
  return (Object.entries(termCounts) as Array<[string, number]>)
    .sort((a, b) => {
      // Boost technical terms
      const aIsTechnical = technicalTerms.includes(a[0]);
      const bIsTechnical = technicalTerms.includes(b[0]);
      
      if (aIsTechnical && !bIsTechnical) return -1;
      if (!aIsTechnical && bIsTechnical) return 1;
      
      // Then sort by frequency
      return b[1] - a[1];
    })
    .slice(0, 40)
    .map(([term]) => term);
}

// Enhanced section analysis
type Sections = {
  contact: boolean;
  experience: boolean;
  education: boolean;
  skills: boolean;
  summary: boolean;
};

function analyzeSections(text: string): Sections {
  const lowerText = text.toLowerCase();
  
  const sectionPatterns = {
    contact: {
      keywords: /contact|email|phone|linkedin|github/,
      content: () => EMAIL_RE.test(text) || PHONE_RE.test(text) || LINKEDIN_RE.test(text)
    },
    experience: {
      keywords: /(?:work\s+)?experience|professional\s+experience|employment|career|roles?|positions?|job\s+history/,
      content: () => /\d{4}|\d{1,2}\/\d{4}|present|current/.test(lowerText) && /\w+\s+(developer|engineer|manager|analyst|designer|specialist)/.test(lowerText)
    },
    education: {
      keywords: /education|university|college|degree|bachelor|master|mba|phd|certification|diploma|graduate|undergraduate/,
      content: () => /(bachelor|master|phd|degree|university|college)/.test(lowerText)
    },
    skills: {
      keywords: /skills|technical\s+skills|skillset|technologies|competencies|proficiencies|expertise/,
      content: () => {
        const skillIndicators = ['javascript', 'python', 'java', 'react', 'angular', 'vue', 'sql', 'aws', 'docker', 'kubernetes'];
        return skillIndicators.some(skill => lowerText.includes(skill));
      }
    },
    summary: {
      keywords: /summary|objective|profile|about|overview|introduction|professional\s+summary/,
      content: () => lowerText.includes('summary') || lowerText.includes('objective') || lowerText.includes('profile')
    }
  };
  
  const results: Sections = {
    contact: false,
    experience: false,
    education: false,
    skills: false,
    summary: false,
  };
  
  Object.entries(sectionPatterns).forEach(([section, patterns]) => {
    const hasKeywords = patterns.keywords.test(lowerText);
    const hasContent = patterns.content();
    results[section] = hasKeywords || hasContent;
  });
  
  return results;
}

// Enhanced readability calculation
function calculateReadability(text: string): number {
  if (!text || text.trim().length === 0) return 0;
  
  const words = text.split(/\s+/).filter(Boolean);
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const syllables = words.reduce((total, word) => {
    const cleanWord = word.replace(/[^a-zA-Z]/g, '');
    const syllableCount = Math.max(1, cleanWord.replace(/[^aeiouAEIOU]/g, '').length);
    return total + syllableCount;
  }, 0);
  
  if (sentences.length === 0 || words.length === 0) return 0;
  
  const avgWordsPerSentence = words.length / sentences.length;
  const avgSyllablesPerWord = syllables / words.length;
  
  // Flesch Reading Ease Score
  const score = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);
  
  return Math.max(0, Math.min(100, Math.round(score)));
}

// Enhanced error handling
function handleFileError(error: unknown): FileProcessingError {
  const message = (error as { message?: string })?.message || 'Unknown error occurred';
  
  if (message.includes('size') || message.includes('large')) {
    return {
      type: 'size',
      message: 'File is too large',
      suggestion: 'Try uploading a smaller file (under 10MB) or copy-paste the text directly'
    };
  }
  
  if (message.includes('format') || message.includes('type')) {
    return {
      type: 'format',
      message: 'Unsupported file format',
      suggestion: 'Please upload a PDF, DOCX, DOC, or TXT file'
    };
  }
  
  if (message.includes('network') || message.includes('fetch')) {
    return {
      type: 'network',
      message: 'Network error occurred',
      suggestion: 'Check your internet connection and try again'
    };
  }
  
  if (message.includes('extraction') || message.includes('readable')) {
    return {
      type: 'extraction',
      message: 'Could not extract text from file',
      suggestion: 'The file might be corrupted or password-protected. Try copy-pasting the text directly'
    };
  }
  
  return {
    type: 'unknown',
    message: 'An unexpected error occurred',
    suggestion: 'Please try again or contact support if the problem persists'
  };
}

// Mock file processing functions
const extractTextFromPDF = async (file: File): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return `JOHN SMITH
Email: john.smith@email.com | Phone: (555) 123-4567
LinkedIn: linkedin.com/in/johnsmith

PROFESSIONAL SUMMARY
Experienced software developer with 5+ years building scalable web applications using React, Node.js, and cloud technologies.

EXPERIENCE
Senior Frontend Developer | Tech Corp | 2020-Present
• Developed React applications serving 100K+ users with 99.9% uptime
• Improved application performance by 40% through code optimization
• Led team of 3 junior developers and mentored new hires

Frontend Developer | StartupXYZ | 2018-2020
• Built responsive web applications using React and TypeScript
• Implemented CI/CD pipelines reducing deployment time by 50%

EDUCATION
Bachelor of Science in Computer Science | University of Tech | 2018

SKILLS
• Frontend: React, TypeScript, JavaScript, HTML5, CSS3, Next.js
• Backend: Node.js, Express, Python, REST APIs
• Tools: Git, Docker, AWS, Jenkins, Webpack`;
};

const extractTextFromDOCX = async (file: File): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return `JANE DOE
jane.doe@email.com | (555) 987-6543 | linkedin.com/in/janedoe

SUMMARY
Results-driven Product Manager with 7+ years of experience leading cross-functional teams to deliver innovative products that drive business growth and enhance user experience.

PROFESSIONAL EXPERIENCE
Senior Product Manager | InnovateTech | 2021-Present
• Led product strategy for B2B SaaS platform serving 50,000+ users
• Increased user engagement by 35% through data-driven feature optimization
• Managed roadmap and collaborated with engineering, design, and marketing teams

Product Manager | GrowthCorp | 2019-2021
• Launched 3 major product features that generated $2M+ in additional revenue
• Conducted user research and A/B testing to validate product hypotheses
• Worked closely with stakeholders to define product requirements and KPIs

EDUCATION
MBA in Business Administration | Business School | 2019
BS in Marketing | State University | 2017

SKILLS
Product Strategy, Roadmap Planning, User Research, A/B Testing, SQL, Analytics, Agile, Scrum, Stakeholder Management, Market Research`;
};

const extractTextFromDOC = async (file: File): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  return await extractTextFromDOCX(file); // Similar extraction
};

const extractTextFromTXT = async (file: File): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(String(e.target?.result || ''));
    reader.onerror = () => reject(new Error('Failed to read text file'));
    reader.readAsText(file);
  });
};

// Main analysis function
function analyzeResume(text, role, jobDescText = '') {
  const normalizedText = normalize(text);
  const sections = analyzeSections(text);
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const readabilityScore = calculateReadability(text);
  
  // Combine role keywords with job description keywords
  const roleKeywords = role.keywords.map(k => k.toLowerCase());
  const jobDescKeywords = jobDescText ? extractKeywordsFromJobDescription(jobDescText) : [];
  const allTargetKeywords = [...new Set([...roleKeywords, ...jobDescKeywords])];
  
  // Find keywords in resume
  const foundKeywords = allTargetKeywords.filter(keyword => 
    normalizedText.includes(keyword.toLowerCase())
  );
  
  const missingKeywords = allTargetKeywords.filter(keyword => 
    !normalizedText.includes(keyword.toLowerCase())
  );
  
  const keywordMatchPercentage = allTargetKeywords.length > 0 
    ? Math.round((foundKeywords.length / allTargetKeywords.length) * 100)
    : 0;
  
  // Calculate base score
  let score = 0;
  const weightings = role.weightings || { keywords: 0.4, experience: 0.3, education: 0.15, skills: 0.15 };
  
  // Keyword score
  score += keywordMatchPercentage * weightings.keywords;
  
  // Section completeness score
  const requiredSections = role.requiredSections || ['contact', 'experience', 'skills'];
  const sectionScore = requiredSections.reduce((acc, section) => {
    return acc + (sections[section] ? 1 : 0);
  }, 0) / requiredSections.length * 100;
  
  score += sectionScore * (weightings.experience + weightings.education + weightings.skills);
  
  // Format and readability adjustments
  const formatScore = Math.min(100, Math.max(0, 
    (wordCount >= 200 ? 1 : wordCount / 200) * 
    (readabilityScore >= 30 ? 1 : readabilityScore / 30) * 100
  ));
  
  score = Math.round(Math.min(100, score));
  
  // Generate issues and recommendations
  const issues = [];
  const recommendations = [];
  const strengths = [];
  
  // Critical issues
  if (!sections.contact) {
    issues.push({
      type: 'critical',
      title: 'Missing Contact Information',
      description: 'No email, phone, or LinkedIn found',
      fix: 'Add your email address, phone number, and LinkedIn profile URL',
      priority: 1
    });
  }
  
  if (!sections.experience) {
    issues.push({
      type: 'critical',
      title: 'No Work Experience Section',
      description: 'Could not identify work experience section',
      fix: 'Add a clear "Experience" or "Work History" section with your roles',
      priority: 1
    });
  }
  
  if (wordCount < 200) {
    issues.push({
      type: 'critical',
      title: 'Resume Too Short',
      description: `Only ${wordCount} words - resumes should be 300-800 words`,
      fix: 'Expand on your experience, skills, and achievements',
      priority: 2
    });
  }
  
  // Warnings
  if (missingKeywords.length > allTargetKeywords.length * 0.6) {
    issues.push({
      type: 'warning',
      title: 'Low Keyword Match',
      description: `Missing ${missingKeywords.length} important keywords`,
      fix: `Include relevant keywords like: ${missingKeywords.slice(0, 5).join(', ')}`,
      priority: 3
    });
  }
  
  if (!sections.skills) {
    issues.push({
      type: 'warning',
      title: 'No Skills Section',
      description: 'Could not identify a dedicated skills section',
      fix: 'Add a "Skills" or "Technical Skills" section',
      priority: 4
    });
  }
  
  if (readabilityScore < 30) {
    issues.push({
      type: 'warning',
      title: 'Poor Readability',
      description: 'Text may be too complex or poorly structured',
      fix: 'Use shorter sentences and clearer language',
      priority: 5
    });
  }
  
  // Suggestions
  if (!sections.summary) {
    issues.push({
      type: 'suggestion',
      title: 'Consider Adding Summary',
      description: 'A professional summary can help highlight key qualifications',
      fix: 'Add a 2-3 sentence summary at the top of your resume',
      priority: 6
    });
  }
  
  if (!sections.education && role.requiredSections?.includes('education')) {
    issues.push({
      type: 'suggestion',
      title: 'Missing Education Section',
      description: 'Education section not clearly identified',
      fix: 'Add your educational background and relevant certifications',
      priority: 7
    });
  }
  
  // Generate strengths
  if (sections.contact) strengths.push('Clear contact information provided');
  if (sections.experience) strengths.push('Work experience section present');
  if (keywordMatchPercentage > 50) strengths.push(`Good keyword match (${keywordMatchPercentage}%)`);
  if (wordCount >= 300 && wordCount <= 800) strengths.push('Appropriate resume length');
  if (readabilityScore >= 50) strengths.push('Good readability score');
  if (foundKeywords.length > 5) strengths.push(`Contains ${foundKeywords.length} relevant keywords`);
  
  // Generate recommendations
  recommendations.push('Tailor your resume for each specific job application');
  recommendations.push('Use action verbs to describe your accomplishments');
  recommendations.push('Quantify your achievements with specific numbers and metrics');
  
  if (missingKeywords.length > 0) {
    recommendations.push(`Consider including these keywords: ${missingKeywords.slice(0, 3).join(', ')}`);
  }
  
  const improvementPriority = [
    {
      area: 'Keyword Optimization',
      impact: keywordMatchPercentage < 40 ? 'high' : 'medium',
      effort: 'medium',
      suggestion: 'Review job descriptions and incorporate relevant technical terms and skills'
    },
    {
      area: 'Section Completeness',
      impact: Object.values(sections).filter(Boolean).length < 4 ? 'high' : 'low',
      effort: 'low',
      suggestion: 'Ensure all standard resume sections are present and clearly labeled'
    },
    {
      area: 'Content Length',
      impact: wordCount < 300 || wordCount > 1000 ? 'medium' : 'low',
      effort: 'medium',
      suggestion: 'Optimize content length - aim for 300-800 words for most roles'
    }
  ];
  
  return {
    score,
    issues: issues.sort((a, b) => a.priority - b.priority),
    strengths,
    keywords: {
      found: foundKeywords,
      missing: missingKeywords.slice(0, 10), // Limit to top 10
      roleSpecific: roleKeywords,
      jobDescriptionMatch: keywordMatchPercentage
    },
    sections,
    matchPercentage: keywordMatchPercentage,
    recommendations,
    technicalDetails: {
      wordCount,
      readabilityScore,
      atsCompatibility: Math.round((score + formatScore) / 2),
      formatScore: Math.round(formatScore)
    },
    detailedAnalysis: {
      industrySpecificKeywords: foundKeywords.slice(0, 10),
      experienceLevel: role.level || 'mid',
      improvementPriority
    }
  };
}

// Main component
export default function ATSChecker() {
  const [selectedRole, setSelectedRole] = useState(PREDEFINED_ROLES[0]);
  const [customRoles, setCustomRoles] = useState([]);
  const [file, setFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [savedJobDescriptions, setSavedJobDescriptions] = useState([]);
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [isCreateRoleOpen, setIsCreateRoleOpen] = useState(false);
  const [isJobDescOpen, setIsJobDescOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [processingError, setProcessingError] = useState(null);

  // Form states
  const [newRoleTitle, setNewRoleTitle] = useState('');
  const [newRoleKeywords, setNewRoleKeywords] = useState('');
  const [newRoleDescription, setNewRoleDescription] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [companyInput, setCompanyInput] = useState('');

  const fileRef = useRef(null);
  const { toast } = useToast();

  const allRoles = useMemo(() => [...PREDEFINED_ROLES, ...customRoles], [customRoles]);

  // File processing
  const processFile = useCallback(async (file: File) => {
    setProcessingError(null);
    setUploadProgress(0);
    
    try {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        throw new Error('File size too large');
      }
      
      const fileType = getFileType(file);
      if (fileType === 'unknown') {
        throw new Error('Unsupported file format');
      }
      
      setUploadProgress(20);
      
      let extractedText: string = '';
      
      switch (fileType) {
        case 'pdf':
          extractedText = await extractTextFromPDF(file);
          break;
        case 'docx':
          extractedText = await extractTextFromDOCX(file);
          break;
        case 'doc':
          extractedText = await extractTextFromDOC(file);
          break;
        case 'txt':
          extractedText = await extractTextFromTXT(file);
          break;
        default:
          throw new Error('Unsupported file type');
      }
      
      setUploadProgress(100);
      
      if (!extractedText || extractedText.trim().length === 0) {
        throw new Error('No readable text found in file');
      }
      
      setResumeText(extractedText);
      toast({
        title: 'File processed successfully',
        description: `Extracted ${extractedText.split(/\s+/).length} words from ${file.name}`
      });
      
    } catch (error) {
      const processedError = handleFileError(error);
      setProcessingError(processedError);
      toast({
        title: 'Error processing file',
        description: processedError.message,
        variant: 'destructive'
      });
    } finally {
      setTimeout(() => setUploadProgress(0), 1000);
    }
  }, [toast]);

  // File upload handler
  const handleFileUpload = useCallback((event) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
      processFile(file);
    }
  }, [processFile]);

  // Drag and drop handlers
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setFile(file);
      processFile(file);
    }
  }, [processFile]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  // Analysis function
  const performAnalysis = useCallback(async () => {
    if (!resumeText.trim()) {
      toast({
        title: 'No resume content',
        description: 'Please upload a file or paste your resume text',
        variant: 'destructive'
      });
      return;
    }

    setAnalyzing(true);
    
    try {
      // Simulate analysis delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const analysisResult = analyzeResume(resumeText, selectedRole, jobDescription);
      setResults(analysisResult);
      
      // Add to history
      const historyEntry = {
        id: Date.now().toString(),
        score: analysisResult.score,
        roleTitle: selectedRole.title,
        timestamp: new Date(),
        wordCount: analysisResult.technicalDetails.wordCount,
        keywordMatch: analysisResult.matchPercentage
      };
      
      setAnalysisHistory(prev => [historyEntry, ...prev.slice(0, 9)]); // Keep last 10
      
      toast({
        title: 'Analysis complete',
        description: `Your ATS score is ${analysisResult.score}/100`
      });
      
    } catch (error) {
      toast({
        title: 'Analysis failed',
        description: 'Please try again',
        variant: 'destructive'
      });
    } finally {
      setAnalyzing(false);
    }
  }, [resumeText, selectedRole, jobDescription, toast]);

  // Create custom role
  const createCustomRole = useCallback(() => {
    if (!newRoleTitle.trim() || !newRoleKeywords.trim()) {
      toast({
        title: 'Missing information',
        description: 'Please fill in role title and keywords',
        variant: 'destructive'
      });
      return;
    }

    const keywords = newRoleKeywords
      .split(',')
      .map(k => k.trim())
      .filter(Boolean);

    const newRole = {
      id: `custom-${Date.now()}`,
      title: newRoleTitle.trim(),
      keywords,
      description: newRoleDescription.trim() || undefined,
      isCustom: true
    };

    setCustomRoles(prev => [...prev, newRole]);
    setSelectedRole(newRole);
    
    // Reset form
    setNewRoleTitle('');
    setNewRoleKeywords('');
    setNewRoleDescription('');
    setIsCreateRoleOpen(false);
    
    toast({
      title: 'Custom role created',
      description: `"${newRole.title}" has been added`
    });
  }, [newRoleTitle, newRoleKeywords, newRoleDescription, toast]);

  // Save job description
  const saveJobDescription = useCallback(() => {
    if (!jobTitle.trim() || !jobDescription.trim()) {
      toast({
        title: 'Missing information',
        description: 'Please fill in job title and description',
        variant: 'destructive'
      });
      return;
    }

    const newJobDesc = {
      id: Date.now().toString(),
      title: jobTitle.trim(),
      company: companyInput.trim() || 'Unknown Company',
      description: jobDescription.trim(),
      requirements: [],
      keywords: extractKeywordsFromJobDescription(jobDescription),
      createdAt: new Date()
    };

    setSavedJobDescriptions(prev => [newJobDesc, ...prev.slice(0, 4)]); // Keep last 5
    
    // Reset form
    setJobTitle('');
    setCompanyInput('');
    setIsJobDescOpen(false);
    
    toast({
      title: 'Job description saved',
      description: `"${newJobDesc.title}" has been saved`
    });
  }, [jobTitle, companyInput, jobDescription, toast]);

  // Load saved job description
  const loadJobDescription = useCallback((jobDesc) => {
    setJobDescription(jobDesc.description);
    setIsJobDescOpen(false);
    toast({
      title: 'Job description loaded',
      description: `Loaded "${jobDesc.title}"`
    });
  }, [toast]);

  // Delete custom role
  const deleteCustomRole = useCallback((roleId) => {
    setCustomRoles(prev => prev.filter(role => role.id !== roleId));
    
    // If deleted role was selected, switch to first predefined role
    if (selectedRole.id === roleId) {
      setSelectedRole(PREDEFINED_ROLES[0]);
    }
    
    toast({
      title: 'Role deleted',
      description: 'Custom role has been removed'
    });
  }, [selectedRole, toast]);

  // Clear all data
  const clearAllData = useCallback(() => {
    setResumeText('');
    setJobDescription('');
    setFile(null);
    setResults(null);
    setProcessingError(null);
    if (fileRef.current) {
      fileRef.current.value = '';
    }
    toast({
      title: 'Data cleared',
      description: 'All input data has been reset'
    });
  }, [toast]);

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeVariant = (score) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  return (
    <div className="min-h-screen bg-background align-middle">
      <CandidateHeader/>
      <main className="pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="container mx-auto px-4 py-12"
        >
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="text-center space-y-4 animate-fade-in">
              <div className="flex items-center justify-center space-x-2">
                <Target className="h-8 w-8 text-primary" />
                <h1 className="text-4xl font-bold text-foreground">ATS Resume Checker</h1>
              </div>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Optimize your resume for Applicant Tracking Systems and increase your chances of landing interviews
              </p>
            </div>
{/* Main Content */}
<div className="flex justify-center w-full">
              <div className="w-full max-w-5xl mx-auto">
                <div className="grid gap-6 lg:grid-cols-1">
                  {/* Left Column - Input */}
                  <div className="space-y-6">
                    {/* Role Selection */}
                    <Card className="animate-fade-in">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Briefcase className="h-5 w-5" />
                          <span>Target Role</span>
                        </CardTitle>
                        <CardDescription>
                          Select the role you're applying for to get targeted recommendations
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex flex-wrap gap-2">
                            {allRoles.map((role) => (
                              <Button
                                key={role.id}
                                variant={selectedRole.id === role.id ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setSelectedRole(role)}
                                className="relative"
                              >
                                {role.title}
                                {role.isCustom && selectedRole.id !== role.id && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteCustomRole(role.id);
                                    }}
                                    className="ml-1 text-red-500 hover:text-red-700"
                                  >
                                    <XCircle className="h-3 w-3" />
                                  </button>
                                )}
                              </Button>
                            ))}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setIsCreateRoleOpen(true)}
                              className="border-dashed border-2"
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Custom Role
                            </Button>
                          </div>
                          
                          {selectedRole && (
                            <div className="bg-accent p-3 rounded-md">
                              <p className="text-sm text-accent-foreground font-medium">
                                {selectedRole.title}
                                {selectedRole.category && (
                                  <Badge variant="secondary" className="ml-2">
                                    {selectedRole.category}
                                  </Badge>
                                )}
                              </p>
                              {selectedRole.description && (
                                <p className="text-sm text-muted-foreground mt-1">{selectedRole.description}</p>
                              )}
                              <div className="mt-2">
                                <p className="text-xs text-muted-foreground">Key skills:</p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {selectedRole.keywords.slice(0, 8).map((keyword, idx) => (
                                    <Badge key={idx} variant="outline" className="text-xs">
                                      {keyword}
                                    </Badge>
                                  ))}
                                  {selectedRole.keywords.length > 8 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{selectedRole.keywords.length - 8} more
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* File Upload */}
                    <Card className="animate-fade-in">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Upload className="h-5 w-5" />
                          <span>Upload Resume</span>
                        </CardTitle>
                        <CardDescription>
                          Upload your resume or paste the text directly. Supports PDF, DOCX, DOC, and TXT files.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Tabs defaultValue="upload" className="w-full">
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="upload">Upload File</TabsTrigger>
                            <TabsTrigger value="text">Paste Text</TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="upload" className="space-y-4">
                            <div
                              className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer"
                              onDrop={handleDrop}
                              onDragOver={handleDragOver}
                              onClick={() => fileRef.current?.click()}
                            >
                              {uploadProgress > 0 ? (
                                <div className="space-y-2">
                                  <RefreshCw className="h-8 w-8 text-primary mx-auto animate-spin" />
                                  <Progress value={uploadProgress} className="w-full" />
                                  <p className="text-sm text-muted-foreground">Processing file...</p>
                                </div>
                              ) : file ? (
                                <div className="space-y-2">
                                  <FileCheck className="h-8 w-8 text-green-500 mx-auto" />
                                  <p className="text-sm text-foreground">{file.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {(file.size / 1024).toFixed(1)} KB
                                  </p>
                                </div>
                              ) : (
                                <div className="space-y-2">
                                  <Upload className="h-8 w-8 text-muted-foreground mx-auto" />
                                  <p className="text-sm text-foreground">
                                    Click to upload or drag and drop your resume
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    PDF, DOCX, DOC, TXT up to 10MB
                                  </p>
                                </div>
                              )}
                            </div>
                            
                            <input
                              ref={fileRef}
                              type="file"
                              accept=".pdf,.docx,.doc,.txt"
                              onChange={handleFileUpload}
                              className="hidden"
                            />
                            
                            {processingError && (
                              <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
                                <div className="flex items-start space-x-2">
                                  <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                                  <div>
                                    <p className="text-sm font-medium text-destructive">
                                      {processingError.message}
                                    </p>
                                    {processingError.suggestion && (
                                      <p className="text-sm text-destructive/80 mt-1">
                                        {processingError.suggestion}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </TabsContent>
                          
                          <TabsContent value="text" className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="resume-text">Paste your resume text here:</Label>
                              <Textarea
                                id="resume-text"
                                placeholder="Copy and paste your resume content here..."
                                value={resumeText}
                                onChange={(e) => setResumeText(e.target.value)}
                                className="min-h-[200px]"
                              />
                            </div>
                            {resumeText && (
                              <p className="text-sm text-muted-foreground">
                                Word count: {resumeText.split(/\s+/).filter(Boolean).length}
                              </p>
                            )}
                          </TabsContent>
                        </Tabs>
                      </CardContent>
                    </Card>

                    {/* Job Description */}
                    <Card className="animate-fade-in">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <FileText className="h-5 w-5" />
                            <span>Job Description (Optional)</span>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setIsJobDescOpen(true)}
                            >
                              <Briefcase className="h-4 w-4 mr-1" />
                              Saved Jobs
                            </Button>
                          </div>
                        </CardTitle>
                        <CardDescription>
                          Paste the job description to get more targeted keyword analysis
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Textarea
                          placeholder="Paste the job description here to improve keyword matching..."
                          value={jobDescription}
                          onChange={(e) => setJobDescription(e.target.value)}
                          className="min-h-[120px]"
                        />
                        {jobDescription && (
                          <div className="mt-2 flex justify-between items-center">
                            <p className="text-sm text-muted-foreground">
                              Characters: {jobDescription.length}
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setJobTitle('');
                                setCompanyInput('');
                                setIsJobDescOpen(true);
                              }}
                            >
                              Save Job Description
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-4">
                      <Button
                        onClick={performAnalysis}
                        disabled={!resumeText.trim() || analyzing}
                        size="lg"
                        className="flex-1 min-w-[200px]"
                      >
                        {analyzing ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Target className="h-4 w-4 mr-2" />
                            Analyze Resume
                          </>
                        )}
                      </Button>
                      
                      <Button
                        variant="outline"
                        onClick={() => setIsHistoryOpen(true)}
                        disabled={analysisHistory.length === 0}
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        History ({analysisHistory.length})
                      </Button>
                      
                      <Button
                        variant="ghost"
                        onClick={clearAllData}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Clear All
                      </Button>
                    </div>
                  </div>

                  {/* Results Section */}
                  <div className="space-y-6">
                    {results ? (
                      <>
                        {/* Score Overview */}
                        <Card className="animate-fade-in">
                          <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                              <span>ATS Score</span>
                              <Badge variant={getScoreBadgeVariant(results.score)}>
                                {results.score}/100
                              </Badge>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div>
                                <div className="flex justify-between mb-2">
                                  <span className="text-sm font-medium">Overall Score</span>
                                  <span className={`text-sm font-bold ${getScoreColor(results.score)}`}>
                                    {results.score}%
                                  </span>
                                </div>
                                <Progress value={results.score} className="h-3" />
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-3 bg-accent rounded-lg">
                                  <div className="text-2xl font-bold text-primary">
                                    {results.matchPercentage}%
                                  </div>
                                  <div className="text-sm text-accent-foreground">Keyword Match</div>
                                </div>
                                <div className="text-center p-3 bg-green-50 rounded-lg">
                                  <div className="text-2xl font-bold text-green-600">
                                    {Object.values(results.sections).filter(Boolean).length}/5
                                  </div>
                                  <div className="text-sm text-green-800">Sections Found</div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Quick Stats */}
                        <Card className="animate-fade-in">
                          <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                              <BarChart3 className="h-5 w-5" />
                              <span>Technical Details</span>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-sm">Word Count</span>
                                <span className="font-medium">{results.technicalDetails.wordCount}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm">Readability Score</span>
                                <span className="font-medium">{results.technicalDetails.readabilityScore}/100</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm">ATS Compatibility</span>
                                <span className="font-medium">{results.technicalDetails.atsCompatibility}/100</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm">Format Score</span>
                                <span className="font-medium">{results.technicalDetails.formatScore}/100</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Sections Status */}
                        <Card className="animate-fade-in">
                          <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                              <FileCheck className="h-5 w-5" />
                              <span>Resume Sections</span>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              {Object.entries(results.sections).map(([section, found]) => (
                                <div key={section} className="flex items-center justify-between">
                                  <span className="text-sm capitalize">{section}</span>
                                  {found ? (
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                  ) : (
                                    <XCircle className="h-4 w-4 text-red-500" />
                                  )}
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>

                        {/* Issues & Recommendations */}
                        <Card className="animate-fade-in">
                          <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                              <AlertCircle className="h-5 w-5" />
                              <span>Issues Found</span>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            {results.issues.length > 0 ? (
                              <div className="space-y-3">
                                {results.issues.slice(0, 5).map((issue, idx) => (
                                  <div key={idx} className="flex items-start space-x-2">
                                    {issue.type === 'critical' && <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />}
                                    {issue.type === 'warning' && <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />}
                                    {issue.type === 'suggestion' && <Info className="h-4 w-4 text-blue-500 mt-0.5" />}
                                    <div className="flex-1">
                                      <p className="text-sm font-medium">{issue.title}</p>
                                      <p className="text-xs text-muted-foreground mt-1">{issue.fix}</p>
                                    </div>
                                  </div>
                                ))}
                                {results.issues.length > 5 && (
                                  <p className="text-xs text-muted-foreground text-center">
                                    +{results.issues.length - 5} more issues
                                  </p>
                                )}
                              </div>
                            ) : (
                              <div className="text-center py-4">
                                <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                                <p className="text-sm text-foreground">No critical issues found!</p>
                              </div>
                            )}
                          </CardContent>
                        </Card>

                        {/* Keywords */}
                        <Card className="animate-fade-in">
                          <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                              <Target className="h-5 w-5" />
                              <span>Keywords</span>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <Tabs defaultValue="found" className="w-full">
                              <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="found">
                                  Found ({results.keywords.found.length})
                                </TabsTrigger>
                                <TabsTrigger value="missing">
                                  Missing ({results.keywords.missing.length})
                                </TabsTrigger>
                              </TabsList>
                              
                              <TabsContent value="found" className="mt-4">
                                {results.keywords.found.length > 0 ? (
                                  <div className="flex flex-wrap gap-1">
                                    {results.keywords.found.slice(0, 15).map((keyword, idx) => (
                                      <Badge key={idx} variant="default" className="text-xs">
                                        {keyword}
                                      </Badge>
                                    ))}
                                    {results.keywords.found.length > 15 && (
                                      <Badge variant="outline" className="text-xs">
                                        +{results.keywords.found.length - 15}
                                      </Badge>
                                    )}
                                  </div>
                                ) : (
                                  <p className="text-sm text-muted-foreground">No keywords found</p>
                                )}
                              </TabsContent>
                              
                              <TabsContent value="missing" className="mt-4">
                                {results.keywords.missing.length > 0 ? (
                                  <div className="flex flex-wrap gap-1">
                                    {results.keywords.missing.slice(0, 15).map((keyword, idx) => (
                                      <Badge key={idx} variant="outline" className="text-xs">
                                        {keyword}
                                      </Badge>
                                    ))}
                                    {results.keywords.missing.length > 15 && (
                                      <Badge variant="secondary" className="text-xs">
                                        +{results.keywords.missing.length - 15}
                                      </Badge>
                                    )}
                                  </div>
                                ) : (
                                  <div className="text-center py-2">
                                    <Star className="h-6 w-6 text-green-500 mx-auto mb-1" />
                                    <p className="text-sm text-green-600">All keywords found!</p>
                                  </div>
                                )}
                              </TabsContent>
                            </Tabs>
                          </CardContent>
                        </Card>

                        {/* Strengths */}
                        {results.strengths.length > 0 && (
                          <Card className="animate-fade-in">
                            <CardHeader>
                              <CardTitle className="flex items-center space-x-2">
                                <Star className="h-5 w-5" />
                                <span>Strengths</span>
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2">
                                {results.strengths.map((strength, idx) => (
                                  <div key={idx} className="flex items-center space-x-2">
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                    <span className="text-sm">{strength}</span>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        )}

                        {/* Recommendations */}
                        <Card className="animate-fade-in">
                          <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                              <Lightbulb className="h-5 w-5" />
                              <span>Recommendations</span>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              {results.recommendations.map((rec, idx) => (
                                <div key={idx} className="flex items-start space-x-2">
                                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                                  <span className="text-sm">{rec}</span>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
            {/* Dialogs */}
            
            {/* Create Custom Role Dialog */}
            <Dialog open={isCreateRoleOpen} onOpenChange={setIsCreateRoleOpen}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create Custom Role</DialogTitle>
                  <DialogDescription>
                    Define a custom role with specific keywords for targeted analysis
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="role-title">Role Title</Label>
                    <Input
                      id="role-title"
                      placeholder="e.g., Senior React Developer"
                      value={newRoleTitle}
                      onChange={(e) => setNewRoleTitle(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="role-keywords">Keywords (comma-separated)</Label>
                    <Textarea
                      id="role-keywords"
                      placeholder="e.g., React, TypeScript, Node.js, AWS, Docker"
                      value={newRoleKeywords}
                      onChange={(e) => setNewRoleKeywords(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="role-description">Description (optional)</Label>
                    <Textarea
                      id="role-description"
                      placeholder="Brief description of the role..."
                      value={newRoleDescription}
                      onChange={(e) => setNewRoleDescription(e.target.value)}
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateRoleOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={createCustomRole}>
                    Create Role
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Job Description Dialog */}
            <Dialog open={isJobDescOpen} onOpenChange={setIsJobDescOpen}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Manage Job Descriptions</DialogTitle>
                  <DialogDescription>
                    Save job descriptions for future use or load previously saved ones
                  </DialogDescription>
                </DialogHeader>
                
                <Tabs defaultValue="save" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="save">Save New</TabsTrigger>
                    <TabsTrigger value="load">Load Saved ({savedJobDescriptions.length})</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="save" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="job-title">Job Title</Label>
                        <Input
                          id="job-title"
                          placeholder="e.g., Senior Frontend Developer"
                          value={jobTitle}
                          onChange={(e) => setJobTitle(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company">Company (optional)</Label>
                        <Input
                          id="company"
                          placeholder="e.g., TechCorp Inc."
                          value={companyInput}
                          onChange={(e) => setCompanyInput(e.target.value)}
                        />
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Current job description ({jobDescription.length} characters)
                    </p>
                    <div className="bg-muted p-3 rounded-md max-h-32 overflow-y-auto">
                      <p className="text-sm text-foreground">
                        {jobDescription.slice(0, 200)}{jobDescription.length > 200 ? '...' : ''}
                      </p>
                    </div>
                    <Button 
                      onClick={saveJobDescription}
                      disabled={!jobTitle.trim() || !jobDescription.trim()}
                      className="w-full"
                    >
                      Save Job Description
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="load" className="space-y-4">
                    {savedJobDescriptions.length > 0 ? (
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {savedJobDescriptions.map((jobDesc) => (
                          <div key={jobDesc.id} className="border rounded-lg p-3">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h4 className="font-medium">{jobDesc.title}</h4>
                                <p className="text-sm text-muted-foreground">{jobDesc.company}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Saved {jobDesc.createdAt.toLocaleDateString()}
                                </p>
                              </div>
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => loadJobDescription(jobDesc)}
                                >
                                  Load
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSavedJobDescriptions(prev => 
                                      prev.filter(j => j.id !== jobDesc.id)
                                    );
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <BookOpen className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-foreground">No saved job descriptions</p>
                        <p className="text-xs text-muted-foreground">Save job descriptions to reuse them later</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>

            {/* Analysis History Dialog */}
            <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Analysis History</DialogTitle>
                  <DialogDescription>
                    View your previous resume analysis results
                  </DialogDescription>
                </DialogHeader>
                
                {analysisHistory.length > 0 ? (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {analysisHistory.map((entry) => (
                      <div key={entry.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-medium">{entry.roleTitle}</h4>
                              <Badge variant={getScoreBadgeVariant(entry.score)}>
                                {entry.score}/100
                              </Badge>
                            </div>
                            <div className="grid grid-cols-3 gap-4 mt-2 text-sm text-muted-foreground">
                              <div>
                                <span className="text-xs text-muted-foreground">Word Count</span>
                                <p className="font-medium">{entry.wordCount}</p>
                              </div>
                              <div>
                                <span className="text-xs text-muted-foreground">Keywords</span>
                                <p className="font-medium">{entry.keywordMatch}%</p>
                              </div>
                              <div>
                                <span className="text-xs text-muted-foreground">Date</span>
                                <p className="font-medium">
                                  {entry.timestamp.toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setAnalysisHistory(prev => 
                                prev.filter(h => h.id !== entry.id)
                              );
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-foreground">No analysis history</p>
                    <p className="text-xs text-muted-foreground">Your analysis results will appear here</p>
                  </div>
                )}
                
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setAnalysisHistory([]);
                      toast({
                        title: 'History cleared',
                        description: 'All analysis history has been removed'
                      });
                    }}
                    disabled={analysisHistory.length === 0}
                  >
                    Clear All History
                  </Button>
                  <Button onClick={() => setIsHistoryOpen(false)}>
                    Close
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>
      </main>
    </div>
  );
}