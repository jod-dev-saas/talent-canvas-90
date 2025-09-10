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

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { className?: string }
const Input: React.FC<InputProps> = ({ className = '', ...props }) => (
  <input
    className={`w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus:border-transparent ${className}`}
    {...props}
  />
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

const AlertDialog: React.FC<{ children: React.ReactNode; open: boolean; onOpenChange: (open: boolean) => void }> = ({ children, open, onOpenChange }) => {
  if (!open) return <>{children}</>;
  
  return (
    <>
      {children}
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
        <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full">
          <h3 className="text-lg font-semibold mb-2">Clear Resume Draft?</h3>
          <p className="text-muted-foreground mb-4">This will permanently delete your current resume draft. This action cannot be undone.</p>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => { onOpenChange(false); /* clear action */ }}>Clear Draft</Button>
          </div>
        </div>
      </div>
    </>
  );
};

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
        {/* Template preview mockup */}
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

  // Auto-save functionality
  useEffect(() => {
    const interval = setInterval(() => {
      saveToLocalStorage();
    }, 15000);
    return () => clearInterval(interval);
  }, [resumeData, settings]);

  // Helper functions with exact names from requirements
  const saveToLocalStorage = () => {
    try {
      const dataToSave = {
        data: resumeData,
        template: settings.template,
        customizations: settings,
        lastSavedAt: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  };

  const loadDraft = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const { data, template, customizations } = JSON.parse(saved);
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
    localStorage.removeItem(STORAGE_KEY);
    setResumeData(emptyResume);
    setSettings(defaultSettings);
    setShowClearDialog(false);
    alert('Draft cleared successfully!');
  };

  const downloadPDF = () => {
    // Client-side PDF generation using print
    const printWindow = window.open('', '_blank');
    const previewEl = document.getElementById('resume-preview');
    if (!printWindow || !previewEl) return;
    const resumeHTML = previewEl.innerHTML;
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Resume - ${resumeData.fullName}</title>
          <style>
            body { font-family: ${settings.fontFamily}, Arial, sans-serif; margin: 0; padding: 20px; }
            .resume-preview { max-width: 8.5in; margin: 0 auto; }
            @media print {
              body { margin: 0; padding: 0; }
              .resume-preview { box-shadow: none; border: none; }
            }
            @page { margin: 0.5in; }
          </style>
        </head>
        <body>
          <div class="resume-preview">
            ${resumeHTML}
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
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
    const templateClasses = getTemplateClasses();
    const accentColor = settings.accentColor;
    
    return (
      <div 
        id="resume-preview"
        className={`resume-preview ${templateClasses} bg-card text-foreground`}
        style={{ 
          fontFamily: settings.fontFamily
        }}
      >
        {settings.template === 'classic' && (
          <div className="flex min-h-full">
            {/* Left Sidebar */}
            <div className="w-1/3 bg-muted p-6">
              {/* Profile Picture */}
              {resumeData.picture && (
                <div className="mb-6">
                  <img 
                    src={resumeData.picture} 
                    alt="Profile" 
                    className="w-24 h-24 rounded-full mx-auto object-cover"
                  />
                </div>
              )}
              
              {/* Contact Info */}
              <div className="mb-6">
                <h3 className="text-sm font-bold mb-3 pb-2 border-b border-border">CONTACT</h3>
                <div className="space-y-2 text-sm">
                  {resumeData.phone && (
                    <div className="flex items-center gap-2">
                      {settings.showIcons && <Phone className="w-3 h-3" />}
                      <span>{resumeData.phone}</span>
                    </div>
                  )}
                  {resumeData.email && (
                    <div className="flex items-center gap-2">
                      {settings.showIcons && <Mail className="w-3 h-3" />}
                      <span>{resumeData.email}</span>
                    </div>
                  )}
                  {resumeData.location && (
                    <div className="flex items-center gap-2">
                      {settings.showIcons && <MapPin className="w-3 h-3" />}
                      <span>{resumeData.location}</span>
                    </div>
                  )}
                  {resumeData.website && (
                    <div className="flex items-center gap-2">
                      {settings.showIcons && <Globe className="w-3 h-3" />}
                      <span className="break-all">{resumeData.website}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Profiles */}
              {resumeData.profiles.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-bold mb-3 pb-2 border-b border-border">PROFILES</h3>
                  <div className="space-y-2 text-sm">
                    {resumeData.profiles.map((profile) => (
                      <div key={profile.id} className="flex items-center gap-2">
                        {settings.showIcons && (
                          profile.platform === 'GitHub' ? <Github className="w-3 h-3" /> :
                          profile.platform === 'LinkedIn' ? <Linkedin className="w-3 h-3" /> :
                          <Globe className="w-3 h-3" />
                        )}
                        <span className="break-all">{profile.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills */}
              {resumeData.skills.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-bold mb-3 pb-2 border-b border-border">TECHNICAL SKILLS</h3>
                  <div className="text-sm">
                    {resumeData.skills.join(', ')}
                  </div>
                </div>
              )}

              {/* Languages */}
              {resumeData.languages.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-bold mb-3 pb-2 border-b border-border">LANGUAGES</h3>
                  <div className="text-sm space-y-1">
                    {resumeData.languages.map((language) => (
                      <div key={language}>{language}</div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {resumeData.certifications.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-bold mb-3 pb-2 border-b border-border">CERTIFICATIONS</h3>
                  <div className="text-sm space-y-1">
                    {resumeData.certifications.map((cert, index) => (
                      <div key={index}>• {cert}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Content */}
            <div className="flex-1 p-6">
              {/* Header */}
              <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2 uppercase tracking-wide">{resumeData.fullName || 'YOUR NAME'}</h1>
                <p className="text-lg text-muted-foreground mb-4">{resumeData.headline || 'Professional Title'}</p>
              </div>

              {/* Summary */}
              {resumeData.summary && (
                <div className="mb-6">
                  <h2 className="text-lg font-bold mb-3 pb-2 border-b border-border">SUMMARY</h2>
                  <p className="text-sm leading-relaxed">{resumeData.summary}</p>
                </div>
              )}

              {/* Experience */}
              {resumeData.experience.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-lg font-bold mb-3 pb-2 border-b border-border">WORK EXPERIENCE</h2>
                  {resumeData.experience.map((exp) => (
                    <div key={exp.id} className="mb-4 break-inside-avoid">
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <h3 className="font-bold">{exp.company || 'Company Name'}</h3>
                          <p className="text-foreground font-medium">{exp.role || 'Job Title'}</p>
                        </div>
                        <div className="text-sm text-muted-foreground text-right">
                          <div className="text-destructive">•</div>
                          <div>
                            {exp.startDate ? new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Start'} — {exp.current ? 'Present' : exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'End'}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm mb-2">{exp.company} description goes here.</div>
                      {exp.bullets.filter(b => b.trim()).length > 0 && (
                        <ul className="text-sm space-y-1">
                          {exp.bullets.filter(b => b.trim()).map((bullet, index) => (
                            <li key={index}>• {bullet}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Education */}
              {resumeData.education.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-lg font-bold mb-3 pb-2 border-b border-border">EDUCATION</h2>
                  {resumeData.education.map((edu) => (
                    <div key={edu.id} className="mb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold">{edu.institution || 'Institution'}</h3>
                          <p className="text-foreground">{edu.degree || 'Degree'} {edu.field ? `of ${edu.field}` : ''}</p>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {edu.graduationYear ? `${edu.graduationYear.includes('-') ? new Date(edu.graduationYear).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : edu.graduationYear}` : 'Graduation Year'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {settings.template === 'blue' && (
          <div className="min-h-full">
            {/* Blue Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-8 rounded-t-lg">
              <div className="flex items-center gap-6">
                {resumeData.picture && (
                  <img 
                    src={resumeData.picture} 
                    alt="Profile" 
                    className="w-32 h-32 rounded object-cover border-4 border-white"
                  />
                )}
                <div className="flex-1">
                  <h1 className="text-4xl font-bold mb-2">{resumeData.fullName || 'John Doe'}</h1>
                  <p className="text-xl/none text-white/80 mb-4">{resumeData.headline || 'Creative and Innovative Web Developer'}</p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    {resumeData.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{resumeData.location}</span>
                      </div>
                    )}
                    {resumeData.phone && (
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        <span>{resumeData.phone}</span>
                      </div>
                    )}
                    {resumeData.email && (
                      <div className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        <span>{resumeData.email}</span>
                      </div>
                    )}
                    {resumeData.website && (
                      <div className="flex items-center gap-1">
                        <Globe className="w-4 h-4" />
                        <span>{resumeData.website}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex p-6 gap-8">
              {/* Left Sidebar */}
              <div className="w-1/3 space-y-6">
                {/* Profiles */}
                {resumeData.profiles.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold mb-3 text-blue-700">Profiles</h3>
                    <div className="space-y-2">
                      {resumeData.profiles.map((profile) => (
                        <div key={profile.id} className="flex items-center gap-2 text-sm">
                          {profile.platform === 'LinkedIn' && <Linkedin className="w-4 h-4 text-blue-600" />}
                          {profile.platform === 'GitHub' && <Github className="w-4 h-4 text-foreground" />}
                          <div>
                            <div className="font-medium">{profile.platform.toLowerCase()}</div>
                            <div className="text-muted-foreground">{profile.platform}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Skills */}
                {resumeData.skills.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold mb-3 text-blue-700">Skills</h3>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-sm">Web Technologies</h4>
                        <p className="text-sm text-muted-foreground">Advanced</p>
                        <p className="text-xs text-muted-foreground">{resumeData.skills.slice(0, 4).join(', ')}</p>
                      </div>
                      {resumeData.skills.length > 4 && (
                        <div>
                          <h4 className="font-semibold text-sm">Web Frameworks</h4>
                          <p className="text-sm text-muted-foreground">Intermediate</p>
                          <p className="text-xs text-muted-foreground">{resumeData.skills.slice(4).join(', ')}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Certifications */}
                {resumeData.certifications.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold mb-3 text-blue-700">Certifications</h3>
                    <div className="space-y-2">
                      {resumeData.certifications.map((cert, index) => (
                        <div key={index} className="text-sm">
                          <div className="font-medium">{cert}</div>
                          <div className="text-muted-foreground">2020</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Languages */}
                {resumeData.languages.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold mb-3 text-blue-700">Languages</h3>
                    <div className="space-y-2">
                      {resumeData.languages.map((language, index) => (
                        <div key={language} className="text-sm">
                          <div className="font-medium">{language}</div>
                          <div className="text-muted-foreground">{index === 0 ? 'Native Speaker' : 'Intermediate'}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* References */}
                <div>
                  <h3 className="text-lg font-bold mb-3 text-blue-700">References</h3>
                  <p className="text-sm text-muted-foreground">Available upon request</p>
                </div>
              </div>

              {/* Right Content */}
              <div className="flex-1 space-y-6">
                {/* Summary */}
                {resumeData.summary && (
                  <div>
                    <h2 className="text-xl font-bold mb-3 text-blue-700">Summary</h2>
                    <p className="text-sm leading-relaxed">{resumeData.summary}</p>
                  </div>
                )}

                {/* Experience */}
                {resumeData.experience.length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold mb-4 text-blue-700">Experience</h2>
                    {resumeData.experience.map((exp) => (
                      <div key={exp.id} className="mb-6 pb-4 border-l-4 border-blue-300 pl-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-bold text-lg">{exp.company || 'Creative Solutions Inc.'}</h3>
                            <p className="text-blue-600 font-medium">{exp.role || 'Senior Web Developer'}</p>
                            <p className="text-sm text-muted-foreground">{exp.link || 'https://creativesolutions.inc/'}</p>
                          </div>
                          <div className="text-right text-sm">
                            <div className="font-medium">
                              {exp.startDate ? new Date(exp.startDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'January 2019'} to {exp.current ? 'Present' : exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Present'}
                            </div>
                            <div className="text-muted-foreground">{resumeData.location || 'San Francisco, CA'}</div>
                          </div>
                        </div>
                        {exp.bullets.filter(b => b.trim()).length > 0 && (
                          <ul className="text-sm space-y-1 text-foreground/80">
                            {exp.bullets.filter(b => b.trim()).map((bullet, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="text-blue-500 mt-1">→</span>
                                <span>{bullet}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Education */}
                {resumeData.education.length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold mb-4 text-blue-700">Education</h2>
                    {resumeData.education.map((edu) => (
                      <div key={edu.id} className="mb-4 pb-4 border-l-4 border-blue-300 pl-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold">{edu.institution || 'University of California'}</h3>
                            <p className="text-foreground">{edu.degree || "Bachelor's in Computer Science"}</p>
                          </div>
                          <div className="text-right text-sm">
                            <div className="font-medium">
                              {edu.graduationYear ? `${edu.graduationYear.includes('-') ? new Date(edu.graduationYear).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : edu.graduationYear}` : 'August 2012 to May 2016'}
                            </div>
                            <div className="text-muted-foreground">Berkeley, CA</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Projects */}
                {resumeData.projects.length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold mb-4 text-blue-700">Projects</h2>
                    <div className="grid grid-cols-2 gap-4">
                      {resumeData.projects.map((project) => (
                        <div key={project.id} className="border-l-4 border-blue-300 pl-4">
                          <h3 className="font-bold">{project.title || 'E-Commerce Platform'}</h3>
                          <p className="text-sm text-muted-foreground mb-1">{project.role || 'Project Lead'}</p>
                          <p className="text-sm text-foreground/80">{project.description || 'Led the development of a full-stack e-commerce platform, improving sales conversion by 25%.'}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {settings.template === 'photo-left' && (
          <div className="min-h-full flex">
            {/* Left Photo Section */}
            <div className="w-1/3 bg-muted">
              {resumeData.picture && (
                <img 
                  src={resumeData.picture} 
                  alt="Profile" 
                  className="w-full h-80 object-cover"
                />
              )}
              
              <div className="p-6">
                {/* Profiles */}
                {resumeData.profiles.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold mb-3" style={{ color: settings.accentColor }}>Profiles</h3>
                    <div className="space-y-2">
                      {resumeData.profiles.map((profile) => (
                        <div key={profile.id} className="flex items-center gap-2 text-sm">
                          {profile.platform === 'LinkedIn' && <Linkedin className="w-4 h-4" style={{ color: settings.accentColor }} />}
                          {profile.platform === 'GitHub' && <Github className="w-4 h-4" />}
                          <div>
                            <div className="font-medium">{profile.platform.toLowerCase()}</div>
                            <div className="text-muted-foreground">{profile.platform}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Skills */}
                {resumeData.skills.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold mb-3" style={{ color: settings.accentColor }}>Skills</h3>
                    <div className="space-y-3">
                      <div className="border-b border-orange-200 pb-2">
                        <h4 className="font-semibold text-sm">Web Technologies</h4>
                        <p className="text-sm text-muted-foreground">Advanced</p>
                        <p className="text-xs text-muted-foreground">{resumeData.skills.slice(0, 4).join(', ')}</p>
                      </div>
                      {resumeData.skills.length > 4 && (
                        <div className="border-b border-orange-200 pb-2">
                          <h4 className="font-semibold text-sm">Web Frameworks</h4>
                          <p className="text-sm text-muted-foreground">Intermediate</p>
                          <p className="text-xs text-muted-foreground">{resumeData.skills.slice(4).join(', ')}</p>
                        </div>
                      )}
                      <div className="border-b border-orange-200 pb-2">
                        <h4 className="font-semibold text-sm">Tools</h4>
                        <p className="text-sm text-muted-foreground">Intermediate</p>
                        <p className="text-xs text-muted-foreground">Webpack, Git, Jenkins, Docker, JIRA</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Certifications */}
                {resumeData.certifications.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold mb-3" style={{ color: settings.accentColor }}>Certifications</h3>
                    <div className="space-y-2">
                      {resumeData.certifications.map((cert, index) => (
                        <div key={index} className="text-sm">
                          <div className="font-medium">{cert}</div>
                          <div className="text-muted-foreground">2020</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Languages */}
                {resumeData.languages.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold mb-3" style={{ color: settings.accentColor }}>Languages</h3>
                    <div className="space-y-2">
                      {resumeData.languages.map((language, index) => (
                        <div key={language} className="text-sm">
                          <div className="font-medium">{language}</div>
                          <div className="text-muted-foreground">{index === 0 ? 'Native Speaker' : 'Intermediate'}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* References */}
                <div>
                  <h3 className="text-lg font-bold mb-3" style={{ color: settings.accentColor }}>References</h3>
                  <p className="text-sm text-muted-foreground">Available upon request</p>
                </div>
              </div>
            </div>

            {/* Right Content */}
            <div className="flex-1">
              {/* Colored Header */}
              <div className="text-white p-8" style={{ backgroundColor: settings.accentColor }}>
                <h1 className="text-4xl font-bold mb-2">{resumeData.fullName || 'John Doe'}</h1>
                <p className="text-xl mb-4 opacity-90">{resumeData.headline || 'Creative and Innovative Web Developer'}</p>
                <div className="flex flex-wrap gap-4 text-sm opacity-90">
                  {resumeData.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{resumeData.location}</span>
                    </div>
                  )}
                  {resumeData.phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      <span>{resumeData.phone}</span>
                    </div>
                  )}
                  {resumeData.email && (
                    <div className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      <span>{resumeData.email}</span>
                    </div>
                  )}
                  {resumeData.website && (
                    <div className="flex items-center gap-1">
                      <Globe className="w-4 h-4" />
                      <span>{resumeData.website}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-8 space-y-6">
                {/* Summary */}
                {resumeData.summary && (
                  <div>
                    <h2 className="text-xl font-bold mb-3 border-b-2 pb-1" style={{ borderColor: settings.accentColor, color: settings.accentColor }}>Summary</h2>
                    <p className="text-sm leading-relaxed">{resumeData.summary}</p>
                  </div>
                )}

                {/* Experience */}
                {resumeData.experience.length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold mb-4 border-b-2 pb-1" style={{ borderColor: settings.accentColor, color: settings.accentColor }}>Experience</h2>
                    {resumeData.experience.map((exp) => (
                      <div key={exp.id} className="mb-6 pb-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-bold text-lg">{exp.company || 'Creative Solutions Inc.'}</h3>
                            <p className="font-medium" style={{ color: settings.accentColor }}>{exp.role || 'Senior Web Developer'}</p>
                            <p className="text-sm text-muted-foreground">{exp.link || 'https://creativesolutions.inc/'}</p>
                          </div>
                          <div className="text-right text-sm">
                            <div className="font-medium">
                              {exp.startDate ? new Date(exp.startDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'January 2019'} to {exp.current ? 'Present' : exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Present'}
                            </div>
                            <div className="text-muted-foreground">{resumeData.location || 'San Francisco, CA'}</div>
                          </div>
                        </div>
                        {exp.bullets.filter(b => b.trim()).length > 0 && (
                          <ul className="text-sm space-y-1 text-foreground/80">
                            {exp.bullets.filter(b => b.trim()).map((bullet, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span style={{ color: settings.accentColor }} className="mt-1">→</span>
                                <span>{bullet}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Education */}
                {resumeData.education.length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold mb-4 border-b-2 pb-1" style={{ borderColor: settings.accentColor, color: settings.accentColor }}>Education</h2>
                    {resumeData.education.map((edu) => (
                      <div key={edu.id} className="mb-4 pb-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold">{edu.institution || 'University of California'}</h3>
                            <p className="text-foreground">{edu.degree || "Bachelor's in Computer Science"}</p>
                          </div>
                          <div className="text-right text-sm">
                            <div className="font-medium">
                              {edu.graduationYear ? `${edu.graduationYear.includes('-') ? new Date(edu.graduationYear).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : edu.graduationYear}` : 'August 2012 to May 2016'}
                            </div>
                            <div className="text-muted-foreground">Berkeley, CA</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Projects */}
                {resumeData.projects.length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold mb-4 border-b-2 pb-1" style={{ borderColor: settings.accentColor, color: settings.accentColor }}>Projects</h2>
                    {resumeData.projects.map((project) => (
                      <div key={project.id} className="mb-4">
                        <h3 className="font-bold">{project.title || 'E-Commerce Platform'}</h3>
                        <p className="text-sm text-muted-foreground mb-1">{project.role || 'Project Lead'}</p>
                        <p className="text-sm text-foreground/80">{project.description || 'Led the development of a full-stack e-commerce platform, improving sales conversion by 25%.'}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
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
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column - Form */}
          <div className="space-y-6">
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Accent Color</label>
                    <input
                      type="color"
                      value={settings.accentColor}
                      onChange={(e) => setSettings(prev => ({ ...prev, accentColor: e.target.value }))}
                      className="w-full h-10 rounded border border-input bg-background"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Font Family</label>
                    <Select
                      value={settings.fontFamily}
                      onValueChange={(value) => setSettings(prev => ({ ...prev, fontFamily: value }))}
                    >
                      <option value="Arial">Arial</option>
                      <option value="Georgia">Georgia</option>
                      <option value="Inter">Inter</option>
                      <option value="Roboto Slab">Roboto Slab</option>
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
                  <label className="block text-sm font-medium mb-2">Picture URL</label>
                  <Input
                    placeholder="https://lh3.googleusercontent.com/a/ACg8ocI8NFOsWNf4SLxz0RhUvc396v2S_00ky98azXTQ7zd-7a_wlA=s96-c"
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
                      placeholder="Developer"
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
                      placeholder="beddylea@gmail.com"
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
            <div className="grid grid-cols-2 gap-4">
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
          <div className="lg:sticky lg:top-4 lg:max-h-screen lg:overflow-y-auto">
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Live Preview</h2>
              </CardHeader>
              <CardContent className="p-0">
                <div className="border border-border rounded-lg overflow-hidden" style={{ minHeight: '800px' }}>
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

      {/* Print Styles */}
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
          }
          .template-classic {
            break-inside: avoid;
          }
          .template-classic .mb-4,
          .template-blue .mb-6,
          .template-photo-left .mb-4 {
            break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
};

export default ResumeBuilder;