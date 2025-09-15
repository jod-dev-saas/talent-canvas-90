import React, { useState, useEffect } from 'react';
import { 
  Save, Upload, Download, Trash2, Plus, X, GripVertical, 
  Phone, Mail, MapPin, Globe, Github, Linkedin, FileText,
  User, Briefcase, GraduationCap, Code, Award, Languages,
  Heart, Users, BookOpen, Trophy, Palette
} from 'lucide-react';
import { CandidateHeader } from '@/components/CandidateHeader';

// Type Definitions
interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
  link?: string;
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  graduationYear: string;
}

interface Project {
  id: string;
  title: string;
  link?: string;
  description: string;
  technologies: string[];
  role?: string;
}

interface Profile {
  id: string;
  platform: string;
  label: string;
  url?: string;
}

interface CustomField {
  id: string;
  label: string;
  value: string;
}

interface CustomSection {
  id: string;
  title: string;
  content: string;
}

interface ResumeData {
  picture: string;
  fullName: string;
  headline: string;
  email: string;
  website: string;
  phone: string;
  location: string;
  customFields: CustomField[];
  summary: string;
  profiles: Profile[];
  experience: Experience[];
  education: Education[];
  skills: string[];
  languages: string[];
  awards: string[];
  certifications: string[];
  interests: string[];
  projects: Project[];
  publications: string[];
  volunteering: string[];
  references: string[];
  customSections: CustomSection[];
}

interface ResumeSettings {
  template: 'classic' | 'blue' | 'photo-left';
  accentColor: string;
  fontFamily: string;
  showIcons: boolean;
}

const STORAGE_KEY = 'jod_resume_draft_v1';

const emptyResume: ResumeData = {
  picture: 'https://lh3.googleusercontent.com/a/ACg8ocI8NFOsWNf4SLxz0RhUvc396v2S_00ky98azXTQ7zd-7a_wlA=s96-c',
  fullName: '',
  headline: '',
  email: '',
  website: '',
  phone: '',
  location: '',
  customFields: [],
  summary: '',
  profiles: [],
  experience: [],
  education: [],
  skills: [],
  languages: [],
  awards: [],
  certifications: [],
  interests: [],
  projects: [],
  publications: [],
  volunteering: [],
  references: [],
  customSections: []
};

const defaultSettings: ResumeSettings = {
  template: 'classic',
  accentColor: '#3b82f6',
  fontFamily: 'Arial',
  showIcons: true
};

// URL Validation Regex
const urlValidators = {
  linkedin: /^https?:\/\/(www\.)?linkedin\.com\/(in|pub)\/[a-zA-Z0-9-]+\/?$/,
  github: /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9-]+\/?$/,
  general: /^https?:\/\/(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/.*)?$/
};

// Sample data for demo
const sampleData: ResumeData = {
  picture: 'https://lh3.googleusercontent.com/a/ACg8ocI8NFOsWNf4SLxz0RhUvc396v2S_00ky98azXTQ7zd-7a_wlA=s96-c',
  fullName: 'Marcus Hall',
  headline: 'Developer',
  email: 'beddylea@gmail.com',
  website: 'https://example.com',
  phone: '+1-555-0100',
  location: 'San Francisco, CA',
  customFields: [],
  summary: 'Resourceful Developer with 11 years of experience in designing and developing user interfaces, testing and training employees. Skilled at utilizing a wide variety of tools and programs to provide effective applications.',
  profiles: [
    { id: '1', platform: 'GitHub', label: 'github.com/bedivere-lea', url: 'https://github.com/bedivere-lea' },
    { id: '2', platform: 'LinkedIn', label: 'linkedin.com/in/bedivere-lea', url: 'https://linkedin.com/in/bedivere-lea' }
  ],
  experience: [
    {
      id: '1',
      company: 'Torph TTC',
      role: 'Developer',
      startDate: '2023-02',
      endDate: '2023-02',
      current: false,
      bullets: [
        'Created and maintained 10 web applications for numerous national and foreign clients.',
        'Ensured that the user interfaces and user experience of the software applications developed by the team met at least 80% of users expectations.',
        'Created and analyzed 500 unit test cases.'
      ]
    }
  ],
  education: [
    {
      id: '1',
      institution: 'New York University',
      degree: 'Bachelor of Computer Science',
      field: 'Computer Science',
      graduationYear: '2024'
    }
  ],
  skills: ['JavaScript', 'Python', 'Web Services', 'C++', 'HTML5', 'CSS', 'SQL'],
  languages: ['English', 'Hindi'],
  awards: ['Certified Web Professional-Web Developer'],
  certifications: ['Java Development Certified Professional'],
  interests: ['Public Speaking', 'Writing', 'Research'],
  projects: [],
  publications: [],
  volunteering: [],
  references: [],
  customSections: []
};

// Components

type ButtonVariant = 'default' | 'outline' | 'destructive' | 'ghost';
type ButtonSize = 'sm' | 'default' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const Button: React.FC<ButtonProps> = ({ children, onClick, variant = 'default', size = 'default', className = '', disabled = false, ...props }) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  const variants: Record<ButtonVariant, string> = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    outline: 'border border-border bg-background text-foreground hover:bg-accent',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    ghost: 'text-foreground hover:bg-accent'
  };
  
  const sizes: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-sm',
    default: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };
  
  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { 
  className?: string;
  error?: string;
}
const Input: React.FC<InputProps> = ({ className = '', error, ...props }) => (
  <div>
    <input
      className={`w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-input'} bg-background rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus:border-transparent ${className}`}
      {...props}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> { className?: string }
const Textarea: React.FC<TextareaProps> = ({ className = '', ...props }) => (
  <textarea
    className={`w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus:border-transparent ${className}`}
    {...props}
  />
);

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-card border border-border rounded-lg shadow-sm ${className}`}>
    {children}
  </div>
);

const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`p-6 pb-4 ${className}`}>
    {children}
  </div>
);

const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`p-6 pt-0 ${className}`}>
    {children}
  </div>
);

const Badge: React.FC<{ children: React.ReactNode; variant?: 'default' | 'secondary'; className?: string }> = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-primary/15 text-primary',
    secondary: 'bg-accent text-accent-foreground'
  } as const;
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

interface SelectProps {
  children: React.ReactNode;
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}
const Select: React.FC<SelectProps> = ({ children, value, onValueChange, className = '' }) => (
  <select
    value={value}
    onChange={(e) => onValueChange(e.target.value)}
    className={`w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${className}`}
  >
    {children}
  </select>
);

// Template Previews
interface TemplatePreviewProps {
  template: 'classic' | 'blue' | 'photo-left';
  selected: boolean;
  onClick: (t: 'classic' | 'blue' | 'photo-left') => void;
  settings: ResumeSettings;
}
const TemplatePreview: React.FC<TemplatePreviewProps> = ({ template, selected, onClick, settings }) => {
  const templates = {
    classic: {
      name: 'Classic Two-column',
      description: 'Professional black & white layout'
    },
    blue: {
      name: 'Blue Header',
      description: 'Modern blue header with photo'
    },
    'photo-left': {
      name: 'Photo Left',
      description: 'Photo left with colored sidebar'
    }
  } as const;
  
  return (
    <div 
      className={`cursor-pointer border-2 rounded-lg p-3 transition-all ${
        selected ? 'border-primary bg-accent' : 'border-border hover:bg-accent'
      }`}
      onClick={() => onClick(template)}
    >
      <div className={`w-full h-24 rounded border mb-2 ${
        template === 'classic' ? 'bg-card border-border' :
        template === 'blue' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
        'bg-gradient-to-r from-orange-400 to-orange-500'
      }`}>
        <div className="p-2 h-full">
          {template === 'classic' && (
            <div className="flex h-full">
              <div className="w-1/3 border-r border-border pr-2">
                <div className="h-2 bg-muted mb-1"></div>
                <div className="h-1 bg-muted mb-1"></div>
                <div className="h-1 bg-muted"></div>
              </div>
              <div className="w-2/3 pl-2">
                <div className="h-2 bg-muted mb-1"></div>
                <div className="h-1 bg-muted mb-1"></div>
                <div className="h-1 bg-muted"></div>
              </div>
            </div>
          )}
          {template === 'blue' && (
            <div className="flex h-full text-white">
              <div className="w-1/4 bg-white/20 rounded mr-2"></div>
              <div className="flex-1">
                <div className="h-2 bg-white/80 mb-1"></div>
                <div className="h-1 bg-white/60"></div>
              </div>
            </div>
          )}
          {template === 'photo-left' && (
            <div className="flex h-full text-white">
              <div className="w-1/3 bg-white/20 rounded mr-2"></div>
              <div className="flex-1">
                <div className="h-2 bg-white/80 mb-1"></div>
                <div className="h-1 bg-white/60"></div>
              </div>
            </div>
          )}
        </div>
      </div>
      <h4 className="font-medium text-sm">{templates[template].name}</h4>
      <p className="text-xs text-muted-foreground">{templates[template].description}</p>
    </div>
  );
};

// Main Resume Builder Component
const ResumeBuilder: React.FC = () => {
  const [resumeData, setResumeData] = useState<ResumeData>(sampleData);
  const [settings, setSettings] = useState<ResumeSettings>(defaultSettings);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Auto-save functionality
  useEffect(() => {
    const interval = setInterval(() => {
      saveToLocalStorage();
    }, 15000);
    return () => clearInterval(interval);
  }, [resumeData, settings]);

  // URL Validation
  const validateUrl = (url: string, platform?: string): string | null => {
    if (!url.trim()) return null;
    
    if (platform === 'LinkedIn' && !urlValidators.linkedin.test(url)) {
      return 'Please enter a valid LinkedIn URL (e.g., https://linkedin.com/in/username)';
    }
    if (platform === 'GitHub' && !urlValidators.github.test(url)) {
      return 'Please enter a valid GitHub URL (e.g., https://github.com/username)';
    }
    if (!platform && !urlValidators.general.test(url)) {
      return 'Please enter a valid URL';
    }
    return null;
  };

  // Helper functions
  const saveToLocalStorage = () => {
    try {
      const dataToSave = {
        data: resumeData,
        template: settings.template,
        customizations: settings,
        lastSavedAt: new Date().toISOString()
      };
      // Using in-memory storage instead of localStorage
      (window as any).resumeDraftData = dataToSave;
    } catch (error) {
      console.error('Failed to save draft:', error);
    }
  };

  const loadDraft = () => {
    try {
      const saved = (window as any).resumeDraftData;
      if (saved) {
        const { data, template, customizations } = saved;
        setResumeData(data || sampleData);
        setSettings(prev => ({ ...prev, template: template || 'classic', ...customizations }));
        alert('Draft loaded successfully!');
      } else {
        alert('No saved draft found.');
      }
    } catch (error) {
      alert('Failed to load draft.');
    }
  };

  const clearDraft = () => {
    delete (window as any).resumeDraftData;
    setResumeData(emptyResume);
    setSettings(defaultSettings);
    setShowClearDialog(false);
    alert('Draft cleared successfully!');
  };

  // Shared CSS used for both live preview and PDF
  const getPreviewCSS = (s: ResumeSettings) => `
    .resume-preview { min-width: 6.5in; min-height: 11in; margin: 0 auto; background: white; font-size: 11px; line-height: 1.4; }
    .template-classic { display: flex; min-height: 11in; }
    .template-classic .sidebar { width: 2.8in; background-color: #f8fafc; padding: 1.2rem; border-right: 1px solid #e2e8f0; }
    .template-classic .main-content { flex: 1; padding: 1.2rem; background: white; }
    .template-blue .blue-header { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 1.5rem; display: flex; align-items: center; gap: 1.5rem; }
    .template-blue .content-wrapper { display: flex; gap: 2rem; padding: 1.5rem; }
    .template-blue .left-sidebar { width: 2.5in; }
    .template-blue .main-content { flex: 1; }
    .template-photo-left { display: flex; min-height: 11in; }
    .template-photo-left .photo-sidebar { width: 2.8in; background-color: #f1f5f9; }
    .template-photo-left .main-wrapper { flex: 1; }
    .template-photo-left .colored-header { background: ${s.accentColor}; color: white; padding: 1.5rem; }
    .template-photo-left .main-content { padding: 1.5rem; }
    h1 { font-size: 24px; font-weight: 700; margin-bottom: 0.5rem; line-height: 1.2; }
    h2 { font-size: 16px; font-weight: 700; margin-bottom: 0.75rem; line-height: 1.3; }
    h3 { font-size: 14px; font-weight: 600; margin-bottom: 0.5rem; line-height: 1.3; }
    h4 { font-size: 12px; font-weight: 600; margin-bottom: 0.25rem; }
    p { margin-bottom: 0.5rem; line-height: 1.4; }
    .profile-image { width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 3px solid white; }
    .profile-image-large { width: 120px; height: 120px; border-radius: 50%; object-fit: cover; border: 4px solid white; }
    .profile-image-full { width: 100%; height: 240px; object-fit: cover; }
    .contact-item { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; font-size: 10px; }
    .contact-icon { width: 12px; height: 12px; flex-shrink: 0; }
    .section { margin-bottom: 1.5rem; break-inside: avoid; }
    .section-title { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.75rem; padding-bottom: 0.25rem; border-bottom: 2px solid #e2e8f0; }
    .section-title-blue { color: #2563eb; border-bottom-color: #2563eb; }
    .section-title-accent { color: ${s.accentColor}; border-bottom-color: ${s.accentColor}; }
    .experience-item { margin-bottom: 1.5rem; break-inside: avoid; }
    .experience-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem; }
    .experience-company { font-weight: 700; font-size: 13px; }
    .experience-role { font-weight: 600; font-size: 12px; color: #4b5563; margin-bottom: 0.25rem; }
    .experience-date { font-size: 10px; color: #6b7280; text-align: right; flex-shrink: 0; }
    .bullet-list { list-style: none; margin: 0; padding: 0; }
    .bullet-item { position: relative; padding-left: 1rem; margin-bottom: 0.25rem; font-size: 10px; line-height: 1.4; }
    .bullet-item:before { content: '•'; position: absolute; left: 0; color: ${s.accentColor}; font-weight: bold; }
    .skills-grid { display: flex; flex-wrap: wrap; gap: 0.25rem; }
    .skill-tag { background: #f1f5f9; color: #475569; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 9px; font-weight: 500; }
  `;

  const downloadPDF = async () => {
    const previewEl = document.getElementById('resume-preview');
    if (!previewEl) return;

    // Create a new window for PDF generation
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    // Generate comprehensive CSS for PDF
    const pdfCSS = `
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: ${settings.fontFamily}, Arial, sans-serif; line-height: 1.4; color: #1f2937; background: white; margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        ${getPreviewCSS(settings)}
        .text-white { color: white; } .text-muted { color: #6b7280; } .text-sm { font-size: 10px; } .text-xs { font-size: 9px; } .font-bold { font-weight: 700; } .font-semibold { font-weight: 600; } .font-medium { font-weight: 500; } .mb-1 { margin-bottom: 0.25rem; } .mb-2 { margin-bottom: 0.5rem; } .mb-3 { margin-bottom: 0.75rem; } .mb-4 { margin-bottom: 1rem; } .mb-6 { margin-bottom: 1.5rem; } .flex { display: flex; } .items-center { align-items: center; } .justify-between { justify-content: space-between; } .gap-1 { gap: 0.25rem; } .gap-2 { gap: 0.5rem; } .gap-4 { gap: 1rem; }
        @page { margin: 0.5in; size: letter; }
        @media print { body { margin: 0; padding: 0; } .resume-preview { box-shadow: none; border: none; page-break-inside: avoid; } .section { page-break-inside: avoid; } .experience-item { page-break-inside: avoid; } }
      </style>
    `;

    // Get clean HTML content
    const resumeHTML = previewEl.innerHTML;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Resume</title>
          ${pdfCSS}
        </head>
        <body>
          <div class="resume-preview">
            ${resumeHTML}
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                window.close();
              }, 500);
            };
          </script>
        </body>
      </html>
    `);
    
    printWindow.document.close();
  };

  // CRUD functions for Experience
  const addExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      company: '',
      role: '',
      startDate: '',
      endDate: '',
      current: false,
      bullets: ['']
    };
    setResumeData(prev => ({ ...prev, experience: [...prev.experience, newExp] }));
  };

  const removeExperience = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };

  const updateExperience = (id: string, field: keyof Experience, value: Experience[keyof Experience]) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp =>
        exp.id === id ? { ...exp, [field]: value } as Experience : exp
      )
    }));
  };

  // CRUD functions for Education
  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      field: '',
      graduationYear: ''
    };
    setResumeData(prev => ({ ...prev, education: [...prev.education, newEdu] }));
  };

  const removeEducation = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  const updateEducation = (id: string, field: keyof Education, value: Education[keyof Education]) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } as Education : edu
      )
    }));
  };

  // CRUD functions for Projects
  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      title: '',
      link: '',
      description: '',
      technologies: []
    };
    setResumeData(prev => ({ ...prev, projects: [...prev.projects, newProject] }));
  };

  const removeProject = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.filter(proj => proj.id !== id)
    }));
  };

  const updateProject = (id: string, field: keyof Project, value: Project[keyof Project]) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.map(proj =>
        proj.id === id ? { ...proj, [field]: value } as Project : proj
      )
    }));
  };

  // Skills functions
  const addSkill = () => {
    if (newSkill.trim() && !resumeData.skills.includes(newSkill.trim())) {
      setResumeData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  // Languages functions  
  const addLanguage = () => {
    if (newLanguage.trim() && !resumeData.languages.includes(newLanguage.trim())) {
      setResumeData(prev => ({
        ...prev,
        languages: [...prev.languages, newLanguage.trim()]
      }));
      setNewLanguage('');
    }
  };

  const removeLanguage = (language: string) => {
    setResumeData(prev => ({
      ...prev,
      languages: prev.languages.filter(l => l !== language)
    }));
  };

  // Generic list functions
  type ListFields = 'awards' | 'certifications' | 'interests' | 'publications' | 'volunteering' | 'references';
  const addToList = (field: ListFields, value: string) => {
    if (value.trim() && !(resumeData as any)[field].includes(value.trim())) {
      setResumeData(prev => ({
        ...prev,
        [field]: ([...((prev as any)[field] as string[]), value.trim()]) as any
      } as ResumeData));
    }
  };

  const removeFromList = (field: ListFields, value: string) => {
    setResumeData(prev => ({
      ...prev,
      [field]: (((prev as any)[field] as string[]).filter((item) => item !== value)) as any
    } as ResumeData));
  };

  // Profile functions with URL validation
  const addProfile = () => {
    const newProfile: Profile = {
      id: Date.now().toString(),
      platform: 'LinkedIn',
      label: '',
      url: ''
    };
    setResumeData(prev => ({ ...prev, profiles: [...prev.profiles, newProfile] }));
  };

  const removeProfile = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      profiles: prev.profiles.filter(profile => profile.id !== id)
    }));
  };

  const updateProfile = (id: string, field: keyof Profile, value: string) => {
    const error = field === 'url' ? validateUrl(value, resumeData.profiles.find(p => p.id === id)?.platform) : null;
    if (error) {
      setErrors(prev => ({ ...prev, [`profile_${id}_${field}`]: error }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`profile_${id}_${field}`];
        return newErrors;
      });
    }

    setResumeData(prev => ({
      ...prev,
      profiles: prev.profiles.map(profile =>
        profile.id === id ? { ...profile, [field]: value } : profile
      )
    }));
  };

  // Template-specific styling
  const getTemplateClasses = () => {
    switch (settings.template) {
      case 'blue':
        return 'template-blue';
      case 'photo-left':
        return 'template-photo-left';
      default:
        return 'template-classic';
    }
  };

  // Render Resume Preview
  const renderResumePreview = () => {
    // Robust data validation with fallbacks
    const safeResumeData = {
      fullName: resumeData?.fullName || '',
      headline: resumeData?.headline || '',
      summary: resumeData?.summary || '',
      phone: resumeData?.phone || '',
      email: resumeData?.email || '',
      location: resumeData?.location || '',
      website: resumeData?.website || '',
      picture: resumeData?.picture || '',
      profiles: Array.isArray(resumeData?.profiles) ? resumeData.profiles : [],
      skills: Array.isArray(resumeData?.skills) ? resumeData.skills : [],
      languages: Array.isArray(resumeData?.languages) ? resumeData.languages : [],
      certifications: Array.isArray(resumeData?.certifications) ? resumeData.certifications : [],
      experience: Array.isArray(resumeData?.experience) ? resumeData.experience : [],
      education: Array.isArray(resumeData?.education) ? resumeData.education : []
    };
  
    // Robust settings validation
    const safeSettings = {
      template: settings?.template || 'classic',
      fontFamily: settings?.fontFamily || 'Arial, sans-serif',
      accentColor: settings?.accentColor || '#3b82f6',
      showIcons: settings?.showIcons !== undefined ? settings.showIcons : true
    };
  
    const templateClasses = getTemplateClasses ? getTemplateClasses() : '';
  
    // Utility functions for safe data handling
    const formatDate = (dateString, defaultText = '') => {
      if (!dateString) return defaultText;
      try {
        return new Date(dateString).toLocaleDateString('en-US', { 
          month: 'short', 
          year: 'numeric' 
        });
      } catch (error) {
        console.warn('Date formatting error:', error);
        return defaultText;
      }
    };
  
    const formatLongDate = (dateString, defaultText = '') => {
      if (!dateString) return defaultText;
      try {
        return new Date(dateString).toLocaleDateString('en-US', { 
          month: 'long', 
          year: 'numeric' 
        });
      } catch (error) {
        console.warn('Date formatting error:', error);
        return defaultText;
      }
    };
  
    const renderContactItem = (icon, text, showIcon = true) => {
      if (!text) return null;
      return (
        <div className="contact-item">
          {showIcon && icon}
          <span className="text-xs break-words">{text}</span>
        </div>
      );
    };
  
    const renderProfileIcon = (platform) => {
      const iconMap = {
        'GitHub': <Github className="contact-icon" />,
        'LinkedIn': <Linkedin className="contact-icon" />,
        'github': <Github className="contact-icon" />,
        'linkedin': <Linkedin className="contact-icon" />
      };
      return iconMap[platform] || <Globe className="contact-icon" />;
    };
  
    const renderClassicTemplate = () => (
      <div className="template-classic">
        {/* Left Sidebar */}
        <div className="sidebar">
          {/* Profile Picture */}
          {safeResumeData.picture && (
            <div className="mb-6 text-center">
              <img 
                src={safeResumeData.picture} 
                alt="Profile" 
                className="profile-image mx-auto"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                  console.warn('Failed to load profile image');
                }}
              />
            </div>
          )}
          
          {/* Contact Info */}
          <div className="section">
            <h3 className="section-title">CONTACT</h3>
            <div className="space-y-2">
              {renderContactItem(
                safeSettings.showIcons && <Phone className="contact-icon" />, 
                safeResumeData.phone
              )}
              {renderContactItem(
                safeSettings.showIcons && <Mail className="contact-icon" />, 
                safeResumeData.email
              )}
              {renderContactItem(
                safeSettings.showIcons && <MapPin className="contact-icon" />, 
                safeResumeData.location
              )}
              {renderContactItem(
                safeSettings.showIcons && <Globe className="contact-icon" />, 
                safeResumeData.website
              )}
            </div>
          </div>
  
          {/* Profiles */}
          {safeResumeData.profiles.length > 0 && (
            <div className="section">
              <h3 className="section-title">PROFILES</h3>
              <div className="space-y-2">
                {safeResumeData.profiles.map((profile, index) => {
                  const profileId = profile?.id || `profile-${index}`;
                  return (
                    <div key={profileId} className="contact-item">
                      {safeSettings.showIcons && renderProfileIcon(profile?.platform)}
                      <span className="text-xs break-words">{profile?.label || profile?.url || ''}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
  
          {/* Skills */}
          {safeResumeData.skills.length > 0 && (
            <div className="section">
              <h3 className="section-title">TECHNICAL SKILLS</h3>
              <div className="text-xs">
                {safeResumeData.skills.filter(skill => skill && skill.trim()).join(', ')}
              </div>
            </div>
          )}
  
          {/* Languages */}
          {safeResumeData.languages.length > 0 && (
            <div className="section">
              <h3 className="section-title">LANGUAGES</h3>
              <div className="text-xs space-y-1">
                {safeResumeData.languages.map((language, index) => (
                  <div key={`lang-${index}`}>{language || ''}</div>
                ))}
              </div>
            </div>
          )}
  
          {/* Certifications */}
          {safeResumeData.certifications.length > 0 && (
            <div className="section">
              <h3 className="section-title">CERTIFICATIONS</h3>
              <div className="text-xs space-y-1">
                {safeResumeData.certifications.map((cert, index) => (
                  <div key={`cert-${index}`}>• {cert || ''}</div>
                ))}
              </div>
            </div>
          )}
        </div>
  
        {/* Right Content */}
        <div className="main-content">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2 uppercase tracking-wide">
              {safeResumeData.fullName || 'YOUR NAME'}
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              {safeResumeData.headline || 'Professional Title'}
            </p>
          </div>
  
          {/* Summary */}
          {safeResumeData.summary && (
            <div className="section">
              <h2 className="section-title">SUMMARY</h2>
              <p className="text-sm leading-relaxed">{safeResumeData.summary}</p>
            </div>
          )}
  
          {/* Experience */}
          {safeResumeData.experience.length > 0 && (
            <div className="section">
              <h2 className="section-title">WORK EXPERIENCE</h2>
              {safeResumeData.experience.map((exp, index) => {
                const expId = exp?.id || `exp-${index}`;
                const validBullets = Array.isArray(exp?.bullets) 
                  ? exp.bullets.filter(b => b && b.trim()) 
                  : [];
  
                return (
                  <div key={expId} className="experience-item">
                    <div className="experience-header">
                      <div>
                        <div className="experience-company">{exp?.company || 'Company Name'}</div>
                        <div className="experience-role">{exp?.role || 'Job Title'}</div>
                      </div>
                      <div className="experience-date">
                        <div className="text-red-600 text-center">•</div>
                        <div>
                          {formatDate(exp?.startDate, 'Start')} — {
                            exp?.current ? 'Present' : formatDate(exp?.endDate, 'End')
                          }
                        </div>
                      </div>
                    </div>
                    {validBullets.length > 0 && (
                      <ul className="bullet-list">
                        {validBullets.map((bullet, bulletIndex) => (
                          <li key={`${expId}-bullet-${bulletIndex}`} className="bullet-item">
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          )}
  
          {/* Education */}
          {safeResumeData.education.length > 0 && (
            <div className="section">
              <h2 className="section-title">EDUCATION</h2>
              {safeResumeData.education.map((edu, index) => {
                const eduId = edu?.id || `edu-${index}`;
                return (
                  <div key={eduId} className="mb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-sm">{edu?.institution || 'Institution'}</h3>
                        <p className="text-sm">
                          {edu?.degree || 'Degree'}
                          {edu?.field ? ` in ${edu.field}` : ''}
                        </p>
                      </div>
                      <div className="text-xs text-gray-600">
                        {edu?.graduationYear || 'Graduation Year'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  
    const renderBlueTemplate = () => (
      <div className="template-blue">
        {/* Blue Header */}
        <div className="blue-header">
          <div className="flex items-center gap-6">
            {safeResumeData.picture && (
              <img 
                src={safeResumeData.picture} 
                alt="Profile" 
                className="profile-image-large"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                  console.warn('Failed to load profile image');
                }}
              />
            )}
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2 text-white">
                {safeResumeData.fullName || 'John Doe'}
              </h1>
              <p className="text-xl text-white/90 mb-4">
                {safeResumeData.headline || 'Creative and Innovative Web Developer'}
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-white/80">
                {renderContactItem(<MapPin className="contact-icon" />, safeResumeData.location)}
                {renderContactItem(<Phone className="contact-icon" />, safeResumeData.phone)}
                {renderContactItem(<Mail className="contact-icon" />, safeResumeData.email)}
                {renderContactItem(<Globe className="contact-icon" />, safeResumeData.website)}
              </div>
            </div>
          </div>
        </div>
  
        <div className="content-wrapper">
          {/* Left Sidebar */}
          <div className="left-sidebar space-y-6">
            {/* Profiles */}
            {safeResumeData.profiles.length > 0 && (
              <div className="section">
                <h3 className="section-title-blue">Profiles</h3>
                <div className="space-y-2">
                  {safeResumeData.profiles.map((profile, index) => {
                    const profileId = profile?.id || `profile-${index}`;
                    return (
                      <div key={profileId} className="contact-item">
                        {renderProfileIcon(profile?.platform)}
                        <div>
                          <div className="font-medium text-xs">
                            {profile?.label || profile?.url || ''}
                          </div>
                          <div className="text-gray-600 text-xs">
                            {profile?.platform || 'Profile'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
  
            {/* Skills */}
            {safeResumeData.skills.length > 0 && (
              <div className="section">
                <h3 className="section-title-blue">Skills</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm">Web Technologies</h4>
                    <p className="text-sm text-gray-600">Advanced</p>
                    <p className="text-xs text-gray-600">
                      {safeResumeData.skills.slice(0, 4).filter(s => s && s.trim()).join(', ')}
                    </p>
                  </div>
                  {safeResumeData.skills.length > 4 && (
                    <div>
                      <h4 className="font-semibold text-sm">Programming</h4>
                      <p className="text-sm text-gray-600">Intermediate</p>
                      <p className="text-xs text-gray-600">
                        {safeResumeData.skills.slice(4).filter(s => s && s.trim()).join(', ')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
  
            {/* Languages */}
            {safeResumeData.languages.length > 0 && (
              <div className="section">
                <h3 className="section-title-blue">Languages</h3>
                <div className="space-y-2">
                  {safeResumeData.languages.map((language, index) => (
                    <div key={`lang-${index}`} className="text-sm">
                      <div className="font-medium">{language || ''}</div>
                      <div className="text-gray-600 text-xs">
                        {index === 0 ? 'Native Speaker' : 'Intermediate'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
  
          {/* Right Content */}
          <div className="main-content space-y-6">
            {/* Summary */}
            {safeResumeData.summary && (
              <div className="section">
                <h2 className="section-title-blue">Summary</h2>
                <p className="text-sm leading-relaxed">{safeResumeData.summary}</p>
              </div>
            )}
  
            {/* Experience */}
            {safeResumeData.experience.length > 0 && (
              <div className="section">
                <h2 className="section-title-blue">Experience</h2>
                {safeResumeData.experience.map((exp, index) => {
                  const expId = exp?.id || `exp-${index}`;
                  const validBullets = Array.isArray(exp?.bullets) 
                    ? exp.bullets.filter(b => b && b.trim()) 
                    : [];
  
                  return (
                    <div key={expId} className="experience-item border-l-4 border-blue-300 pl-4">
                      <div className="experience-header">
                        <div>
                          <div className="experience-company text-lg">
                            {exp?.company || 'Creative Solutions Inc.'}
                          </div>
                          <div className="text-blue-600 font-medium text-sm">
                            {exp?.role || 'Senior Web Developer'}
                          </div>
                        </div>
                        <div className="experience-date">
                          <div className="font-medium">
                            {formatLongDate(exp?.startDate, 'January 2019')} to {
                              exp?.current ? 'Present' : formatLongDate(exp?.endDate, 'Present')
                            }
                          </div>
                          <div className="text-gray-600">
                            {safeResumeData.location || 'San Francisco, CA'}
                          </div>
                        </div>
                      </div>
                      {validBullets.length > 0 && (
                        <ul className="bullet-list mt-2">
                          {validBullets.map((bullet, bulletIndex) => (
                            <li key={`${expId}-bullet-${bulletIndex}`} className="bullet-item text-blue-500">
                              {bullet}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
  
            {/* Education */}
            {safeResumeData.education.length > 0 && (
              <div className="section">
                <h2 className="section-title-blue">Education</h2>
                {safeResumeData.education.map((edu, index) => {
                  const eduId = edu?.id || `edu-${index}`;
                  return (
                    <div key={eduId} className="mb-4 border-l-4 border-blue-300 pl-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold">{edu?.institution || 'University of California'}</h3>
                          <p>{edu?.degree || "Bachelor's in Computer Science"}</p>
                        </div>
                        <div className="text-right text-sm">
                          <div className="font-medium">
                            {edu?.graduationYear || '2016'}
                          </div>
                          <div className="text-gray-600">Berkeley, CA</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  
    const renderPhotoLeftTemplate = () => (
      <div className="template-photo-left">
        {/* Left Photo Section */}
        <div className="photo-sidebar">
          {safeResumeData.picture && (
            <img 
              src={safeResumeData.picture} 
              alt="Profile" 
              className="profile-image-full"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none';
                console.warn('Failed to load profile image');
              }}
            />
          )}
          
          <div className="p-6">
            {/* Skills */}
            {safeResumeData.skills.length > 0 && (
              <div className="section">
                <h3 className="section-title-accent">Skills</h3>
                <div className="skills-grid">
                  {safeResumeData.skills.filter(skill => skill && skill.trim()).map((skill, index) => (
                    <span key={`skill-${index}`} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </div>
            )}
  
            {/* Languages */}
            {safeResumeData.languages.length > 0 && (
              <div className="section">
                <h3 className="section-title-accent">Languages</h3>
                <div className="space-y-2">
                  {safeResumeData.languages.map((language, index) => (
                    <div key={`lang-${index}`} className="text-sm">
                      <div className="font-medium">{language || ''}</div>
                      <div className="text-gray-600 text-xs">
                        {index === 0 ? 'Native Speaker' : 'Intermediate'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
  
        {/* Right Content */}
        <div className="main-wrapper">
          {/* Colored Header */}
          <div className="colored-header">
            <h1 className="text-4xl font-bold mb-2 text-white">
              {safeResumeData.fullName || 'John Doe'}
            </h1>
            <p className="text-xl mb-4 text-white/90">
              {safeResumeData.headline || 'Creative and Innovative Web Developer'}
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-white/80">
              {renderContactItem(<MapPin className="contact-icon" />, safeResumeData.location)}
              {renderContactItem(<Phone className="contact-icon" />, safeResumeData.phone)}
              {renderContactItem(<Mail className="contact-icon" />, safeResumeData.email)}
              {renderContactItem(<Globe className="contact-icon" />, safeResumeData.website)}
            </div>
          </div>
  
          <div className="main-content space-y-6">
            {/* Summary */}
            {safeResumeData.summary && (
              <div className="section">
                <h2 className="section-title-accent">Summary</h2>
                <p className="text-sm leading-relaxed">{safeResumeData.summary}</p>
              </div>
            )}
  
            {/* Experience */}
            {safeResumeData.experience.length > 0 && (
              <div className="section">
                <h2 className="section-title-accent">Experience</h2>
                {safeResumeData.experience.map((exp, index) => {
                  const expId = exp?.id || `exp-${index}`;
                  const validBullets = Array.isArray(exp?.bullets) 
                    ? exp.bullets.filter(b => b && b.trim()) 
                    : [];
  
                  return (
                    <div key={expId} className="experience-item">
                      <div className="experience-header">
                        <div>
                          <div className="experience-company text-lg">
                            {exp?.company || 'Creative Solutions Inc.'}
                          </div>
                          <div 
                            className="font-medium text-sm" 
                            style={{ color: safeSettings.accentColor }}
                          >
                            {exp?.role || 'Senior Web Developer'}
                          </div>
                        </div>
                        <div className="experience-date">
                          <div className="font-medium">
                            {formatLongDate(exp?.startDate, 'January 2019')} to {
                              exp?.current ? 'Present' : formatLongDate(exp?.endDate, 'Present')
                            }
                          </div>
                          <div className="text-gray-600">
                            {safeResumeData.location || 'San Francisco, CA'}
                          </div>
                        </div>
                      </div>
                      {validBullets.length > 0 && (
                        <ul className="bullet-list mt-2">
                          {validBullets.map((bullet, bulletIndex) => (
                            <li key={`${expId}-bullet-${bulletIndex}`} className="bullet-item">
                              {bullet}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
  
            {/* Education */}
            {safeResumeData.education.length > 0 && (
              <div className="section">
                <h2 className="section-title-accent">Education</h2>
                {safeResumeData.education.map((edu, index) => {
                  const eduId = edu?.id || `edu-${index}`;
                  return (
                    <div key={eduId} className="mb-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold">{edu?.institution || 'University of California'}</h3>
                          <p>{edu?.degree || "Bachelor's in Computer Science"}</p>
                        </div>
                        <div className="text-right text-sm">
                          <div className="font-medium">
                            {edu?.graduationYear || '2016'}
                          </div>
                          <div className="text-gray-600">Berkeley, CA</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  
    const renderTemplate = () => {
      switch (safeSettings.template) {
        case 'blue':
          return renderBlueTemplate();
        case 'photo-left':
          return renderPhotoLeftTemplate();
        case 'classic':
        default:
          return renderClassicTemplate();
      }
    };
  
    return (
      <div 
        id="resume-preview"
        className={`resume-preview ${templateClasses} bg-white text-gray-800`}
        style={{ 
          fontFamily: safeSettings.fontFamily,
          fontSize: '11px',
          lineHeight: '1.4'
        }}
      >
        {renderTemplate()}
      </div>
    );
  };
  return (
    <div className="min-h-screen bg-background text-foreground pt-16">
      {/* Header */}
      <CandidateHeader/>
      <div className="bg-card shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Resume Builder</h1>
          <p className="text-muted-foreground">Create a professional resume with live preview</p>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-card border-b border-border px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-3">
          <Button onClick={() => saveToLocalStorage()}>
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </Button>
          <Button onClick={loadDraft} variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Load Draft
          </Button>
          <Button onClick={downloadPDF} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
          <Button onClick={() => setShowClearDialog(true)} variant="destructive">
            <Trash2 className="w-4 h-4 mr-2" />
            Clear Draft
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4">
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Left Column - Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Template Selector */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Templates</h2>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  <TemplatePreview
                    template="classic"
                    selected={settings.template === 'classic'}
                    onClick={(template) => setSettings(prev => ({ ...prev, template }))}
                    settings={settings}
                  />
                  <TemplatePreview
                    template="blue"
                    selected={settings.template === 'blue'}
                    onClick={(template) => setSettings(prev => ({ ...prev, template }))}
                    settings={settings}
                  />
                  <TemplatePreview
                    template="photo-left"
                    selected={settings.template === 'photo-left'}
                    onClick={(template) => setSettings(prev => ({ ...prev, template }))}
                    settings={settings}
                  />
                </div>
                
                {/* Template Customization */}
                <div className="grid grid-col gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Font Family</label>
                    <Select
                      value={settings.fontFamily}
                      onValueChange={(value) => setSettings(prev => ({ ...prev, fontFamily: value }))}
                    >
                      <option value="Arial">Arial</option>
                      <option value="Georgia">Georgia</option>
                      <option value="Inter">Inter</option>
                      <option value="Roboto">Roboto</option>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Basics Section */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Basics
                </h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className=" block text-sm font-medium mb-2">Picture URL</label>
                  <Input
                    placeholder="https://example.com/photo.jpg"
                    value={resumeData.picture}
                    onChange={(e) => setResumeData(prev => ({ ...prev, picture: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <Input
                      placeholder="Full Name"
                      value={resumeData.fullName}
                      onChange={(e) => setResumeData(prev => ({ ...prev, fullName: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Headline</label>
                    <Input
                      placeholder="Professional Title"
                      value={resumeData.headline}
                      onChange={(e) => setResumeData(prev => ({ ...prev, headline: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <Input
                      type="email"
                      placeholder="email@example.com"
                      value={resumeData.email}
                      onChange={(e) => setResumeData(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Website</label>
                    <Input
                      placeholder="https://example.com"
                      value={resumeData.website}
                      onChange={(e) => setResumeData(prev => ({ ...prev, website: e.target.value }))}
                      error={validateUrl(resumeData.website) || undefined}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone</label>
                    <Input
                      placeholder="Phone number"
                      value={resumeData.phone}
                      onChange={(e) => setResumeData(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Location</label>
                    <Input
                      placeholder="City, Country"
                      value={resumeData.location}
                      onChange={(e) => setResumeData(prev => ({ ...prev, location: e.target.value }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profiles Section */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Profiles
                </h2>
                <Button onClick={addProfile} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Profile
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {resumeData.profiles.map((profile, index) => (
                  <div key={profile.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="font-medium">Profile {index + 1}</h3>
                      <Button onClick={() => removeProfile(profile.id)} size="sm" variant="destructive">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Platform</label>
                        <Select
                          value={profile.platform}
                          onValueChange={(value) => updateProfile(profile.id, 'platform', value)}
                        >
                          <option value="LinkedIn">LinkedIn</option>
                          <option value="GitHub">GitHub</option>
                          <option value="Website">Website</option>
                          <option value="Other">Other</option>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Label</label>
                        <Input
                          placeholder="Display text"
                          value={profile.label}
                          onChange={(e) => updateProfile(profile.id, 'label', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium mb-2">URL</label>
                      <Input
                        placeholder={
                          profile.platform === 'LinkedIn' ? 'https://linkedin.com/in/username' :
                          profile.platform === 'GitHub' ? 'https://github.com/username' :
                          'https://example.com'
                        }
                        value={profile.url || ''}
                        onChange={(e) => updateProfile(profile.id, 'url', e.target.value)}
                        error={errors[`profile_${profile.id}_url`]}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Summary Section */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Summary</h2>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Write a brief professional summary..."
                  rows={4}
                  value={resumeData.summary}
                  onChange={(e) => setResumeData(prev => ({ ...prev, summary: e.target.value }))}
                />
              </CardContent>
            </Card>

            {/* Experience Section */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Experience
                </h2>
                <Button onClick={addExperience} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Experience
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {resumeData.experience.map((exp, index) => (
                  <div key={exp.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="font-medium">Experience {index + 1}</h3>
                      <div className="flex items-center gap-2">
                        <GripVertical className="w-4 h-4 text-muted-foreground cursor-move" />
                        <Button onClick={() => removeExperience(exp.id)} size="sm" variant="destructive">
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Company</label>
                        <Input
                          value={exp.company}
                          onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Role</label>
                        <Input
                          value={exp.role}
                          onChange={(e) => updateExperience(exp.id, 'role', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Start Date</label>
                        <Input
                          type="month"
                          value={exp.startDate}
                          onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">End Date</label>
                        <Input
                          type="month"
                          value={exp.endDate}
                          onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                          disabled={exp.current}
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={exp.current}
                          onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                        />
                        <span className="text-sm">Currently working here</span>
                      </label>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium">Bullets</label>
                        <Button
                          onClick={() => {
                            const newBullets = [...exp.bullets, ''];
                            updateExperience(exp.id, 'bullets', newBullets);
                          }}
                          size="sm"
                          variant="outline"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Bullet
                        </Button>
                      </div>
                      {exp.bullets.map((bullet, bulletIndex) => (
                        <div key={bulletIndex} className="flex gap-2 mb-2">
                          <Input
                            placeholder="Describe your achievement..."
                            value={bullet}
                            onChange={(e) => {
                              const newBullets = [...exp.bullets];
                              newBullets[bulletIndex] = e.target.value;
                              updateExperience(exp.id, 'bullets', newBullets);
                            }}
                          />
                          <Button
                            onClick={() => {
                              const newBullets = exp.bullets.filter((_, i) => i !== bulletIndex);
                              updateExperience(exp.id, 'bullets', newBullets);
                            }}
                            size="sm"
                            variant="destructive"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Education Section */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Education
                </h2>
                <Button onClick={addEducation} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Education
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {resumeData.education.map((edu, index) => (
                  <div key={edu.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="font-medium">Education {index + 1}</h3>
                      <div className="flex items-center gap-2">
                        <GripVertical className="w-4 h-4 text-muted-foreground cursor-move" />
                        <Button onClick={() => removeEducation(edu.id)} size="sm" variant="destructive">
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Institution</label>
                        <Input
                          value={edu.institution}
                          onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Degree</label>
                        <Input
                          value={edu.degree}
                          onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Field</label>
                        <Input
                          value={edu.field}
                          onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Graduation Year</label>
                        <Input
                          value={edu.graduationYear}
                          onChange={(e) => updateEducation(edu.id, 'graduationYear', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Projects Section */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Projects
                </h2>
                <Button onClick={addProject} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Project
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {resumeData.projects.map((project, index) => (
                  <div key={project.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="font-medium">Project {index + 1}</h3>
                      <div className="flex items-center gap-2">
                        <GripVertical className="w-4 h-4 text-muted-foreground cursor-move" />
                        <Button onClick={() => removeProject(project.id)} size="sm" variant="destructive">
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Title</label>
                        <Input
                          value={project.title}
                          onChange={(e) => updateProject(project.id, 'title', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Link (optional)</label>
                        <Input
                          value={project.link || ''}
                          onChange={(e) => updateProject(project.id, 'link', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2">Description</label>
                      <Textarea
                        rows={3}
                        value={project.description}
                        onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Technologies</label>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, techIndex) => (
                          <Badge key={techIndex} variant="secondary">
                            {tech}
                            <button
                              onClick={() => {
                                const newTech = project.technologies.filter((_, i) => i !== techIndex);
                                updateProject(project.id, 'technologies', newTech);
                              }}
                              className="ml-1 text-muted-foreground hover:text-foreground"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Skills Section */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Skills
                </h2>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-4">
                  <Input
                    placeholder="Add a skill..."
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                  />
                  <Button onClick={addSkill}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {resumeData.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                      <button
                        onClick={() => removeSkill(skill)}
                        className="ml-2 text-muted-foreground hover:text-foreground"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Languages Section */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Languages className="w-5 h-5" />
                  Languages
                </h2>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-4">
                  <Input
                    placeholder="Add a language..."
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addLanguage()}
                  />
                  <Button onClick={addLanguage}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {resumeData.languages.map((language) => (
                    <div key={language} className="flex items-center justify-between bg-muted p-2 rounded">
                      <span>{language}</span>
                      <Button
                        onClick={() => removeLanguage(language)}
                        size="sm"
                        variant="ghost"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Add Sections */}
            <div className="grid grid-rows-2 gap-4">
              {(['awards', 'certifications', 'interests', 'publications', 'volunteering', 'references'] as ListFields[]).map((section) => (
                <Card key={section}>
                  <CardHeader>
                    <h2 className="text-lg font-semibold flex items-center gap-2 capitalize">
                      {section === 'awards' && <Trophy className="w-5 h-5" />}
                      {section === 'certifications' && <Award className="w-5 h-5" />}
                      {section === 'interests' && <Heart className="w-5 h-5" />}
                      {section === 'publications' && <BookOpen className="w-5 h-5" />}
                      {section === 'volunteering' && <Users className="w-5 h-5" />}
                      {section === 'references' && <User className="w-5 h-5" />}
                      {section}
                    </h2>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2 mb-2">
                      <Input
                        placeholder={`Add ${section.slice(0, -1)}...`}
                        onKeyDown={(e) => {
                          const target = e.target as HTMLInputElement;
                          if (e.key === 'Enter' && target.value.trim()) {
                            addToList(section, target.value);
                            target.value = '';
                          }
                        }}
                      />
                      <Button
                        onClick={(e) => {
                          const input = (e.currentTarget.closest('.flex') as HTMLElement)?.querySelector('input') as HTMLInputElement | null;
                          if (input && input.value.trim()) {
                            addToList(section, input.value);
                            input.value = '';
                          }
                        }}
                        size="sm"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="space-y-1">
                      {(resumeData as any)[section].map((item: string) => (
                        <div key={item} className="flex items-center justify-between text-sm bg-muted p-1 rounded">
                          <span>{item}</span>
                          <Button
                            onClick={() => removeFromList(section, item)}
                            size="sm"
                            variant="ghost"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Right Column - Preview */}
          <div className="lg:col-span-3 lg:sticky lg:top-4 lg:max-h-screen lg:overflow-y-auto">
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Live Preview</h2>
              </CardHeader>
              <CardContent className="p-0">
                <div className="border border-border rounded-lg overflow-hidden bg-white" style={{ minHeight: '800px' }}>
                  <style>{getPreviewCSS(settings)}</style>
                  {renderResumePreview()}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Clear Draft Dialog */}
      {showClearDialog && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-2">Clear Resume Draft?</h3>
            <p className="text-muted-foreground mb-4">
              This will permanently delete your current resume draft. This action cannot be undone.
            </p>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowClearDialog(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={clearDraft}>
                Clear Draft
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #resume-preview, #resume-preview * {
            visibility: visible;
          }
          #resume-preview {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            transform: scale(1);
          }
          .template-classic,
          .template-blue,
          .template-photo-left {
            page-break-inside: avoid;
          }
          .experience-item,
          .section {
            page-break-inside: avoid;
            break-inside: avoid;
          }
        }
        
        .space-y-2 > * + * {
          margin-top: 0.5rem;
        }
        .space-y-3 > * + * {
          margin-top: 0.75rem;
        }
        .space-y-6 > * + * {
          margin-top: 1.5rem;
        }
      `}</style>
    </div>
  );
};

export default ResumeBuilder;