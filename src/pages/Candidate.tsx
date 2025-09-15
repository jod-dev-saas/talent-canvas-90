import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Upload, User, Briefcase, X, Plus, CheckCircle, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';

import { CandidateHeader } from '@/components/CandidateHeader';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

import { SkillsInput } from '@/components/candidate/SkillsInput';
import { ProjectsSection } from '@/components/candidate/ProjectsSection';
import { CandidateProfile } from '@/types/candidate';

const INDIAN_CITIES = [
  'Bengaluru', 'Mumbai', 'Hyderabad', 'Pune', 'Delhi NCR', 'Chennai',
  'Kolkata', 'Ahmedabad', 'Kochi', 'Gurgaon', 'Noida', 'Mysore',
  'Coimbatore', 'Thiruvananthapuram', 'Indore', 'Nagpur', 'Bhubaneswar',
  'Chandigarh', 'Jaipur', 'Vadodara', 'Nashik', 'Vizag', 'Remote'
];

// URL validation functions
const validateLinkedIn = (url: string) => {
  if (!url) return { isValid: true, message: '' };
  const linkedInRegex = /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/;
  if (linkedInRegex.test(url)) {
    return { isValid: true, message: '' };
  }
  return { isValid: false, message: 'Please enter a valid LinkedIn profile URL (e.g., https://linkedin.com/in/username)' };
};

const validateGitHub = (url: string) => {
  if (!url) return { isValid: true, message: '' };
  const githubRegex = /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9-]+\/?$/;
  if (githubRegex.test(url)) {
    return { isValid: true, message: '' };
  }
  return { isValid: false, message: 'Please enter a valid GitHub profile URL (e.g., https://github.com/username)' };
};

const validatePortfolio = (url: string) => {
  if (!url) return { isValid: true, message: '' };
  const urlRegex = /^https?:\/\/[^\s/$.?#].[^\s]*$/;
  if (urlRegex.test(url)) {
    return { isValid: true, message: '' };
  }
  return { isValid: false, message: 'Please enter a valid URL (e.g., https://your-portfolio.com)' };
};

/* ---------------------------
   CustomSelect (single-select)
   - renders menu into document.body (portal) to avoid clipping.
   - keyboard support: ArrowUp/Down, Enter, Esc
   --------------------------- */
interface CustomSelectProps {
  label?: string;
  value?: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  required?: boolean;
  id?: string;
  className?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  value = '',
  onChange,
  options,
  placeholder = 'Select...',
  required = false,
  id,
  className = '',
}) => {
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [highlight, setHighlight] = useState<number>(-1);

  useEffect(() => {
    if (open && triggerRef.current) {
      setRect(triggerRef.current.getBoundingClientRect());
      setHighlight(options.findIndex((o) => o === value));
    }
  }, [open, options, value]);

  useEffect(() => {
    const onResize = () => {
      if (open && triggerRef.current) setRect(triggerRef.current.getBoundingClientRect());
    };
    const onScroll = () => {
      if (open && triggerRef.current) setRect(triggerRef.current.getBoundingClientRect());
    };
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onScroll, true);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll, true);
    };
  }, [open]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const target = e.target as Node;
      if (!triggerRef.current) return;
      if (triggerRef.current.contains(target)) return;
      if (menuRef.current && menuRef.current.contains(target)) return;
      setOpen(false);
    }
    if (open) document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!open) return;
      if (e.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlight((h) => Math.min(h + 1, options.length - 1));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlight((h) => Math.max(h - 1, 0));
      }
      if (e.key === 'Enter' && highlight >= 0) {
        onChange(options[highlight]);
        setOpen(false);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, highlight, options, onChange]);

  const menu = rect ? (
    <div
      ref={menuRef}
      role="listbox"
      aria-labelledby={id}
      style={{
        position: 'fixed',
        left: rect.left,
        top: rect.bottom + 6,
        minWidth: rect.width,
        zIndex: 9999,
      }}
      className="shadow-lg"
    >
      <div className="bg-card text-foreground max-w-lg max-h-60 overflow-auto rounded-md border border-input">
        {options.map((opt, i) => {
          const selected = opt === value;
          const isHighlighted = i === highlight;
          return (
            <button
              key={opt}
              role="option"
              aria-selected={selected}
              onMouseDown={(ev) => {
                // prevent blur before click
                ev.preventDefault();
                onChange(opt);
                setOpen(false);
              }}
              onMouseEnter={() => setHighlight(i)}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-muted/30 ${selected ? 'font-medium' : 'font-normal'} ${isHighlighted ? 'bg-muted/20' : ''}`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  ) : null;

  return (
    <div className="space-y-2">
      {label && (
        <label id={id} className="block text-sm font-medium">
          {label} {required && <span className="text-destructive">*</span>}
        </label>
      )}
      <div>
        <button
          id={id ? `${id}-trigger` : undefined}
          ref={triggerRef}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((s) => !s)}
          className={`w-full rounded-md border border-input px-3 py-2 text-sm text-left bg-background ${className}`}
        >
          <span className={`truncate ${value ? 'text-foreground' : 'text-muted-foreground'}`}>
            {value || placeholder}
          </span>
          <span className="absolute inset-y-0 right-0 pr-2 pointer-events-none">
            <svg className={`h-5 w-5 text-muted-foreground transform transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </button>
      </div>

      {open && typeof document !== 'undefined' && createPortal(menu, document.body)}
    </div>
  );
};

/* ---------------------------
   CityMultiSelect (chip-based multi-select)
   - portal menu, filter, custom add
   --------------------------- */
interface CityMultiSelectProps {
  selectedCities: string[];
  onChange: (cities: string[]) => void;
  required?: boolean;
}

const CityMultiSelect: React.FC<CityMultiSelectProps> = ({ selectedCities = [], onChange, required = false }) => {
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [filter, setFilter] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customCity, setCustomCity] = useState('');

  useEffect(() => {
    if (open && triggerRef.current) setRect(triggerRef.current.getBoundingClientRect());
  }, [open]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (!triggerRef.current) return;
      if (triggerRef.current.contains(target)) return;
      if (menuRef.current && menuRef.current.contains(target)) return;
      setOpen(false);
    };
    if (open) document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open]);

  useEffect(() => {
    const onResize = () => {
      if (open && triggerRef.current) setRect(triggerRef.current.getBoundingClientRect());
    };
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onResize, true);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onResize, true);
    };
  }, [open]);

  const toggleCity = (city: string) => {
    const exists = selectedCities.includes(city);
    if (exists) onChange(selectedCities.filter((c) => c !== city));
    else onChange([...selectedCities, city]);
  };

  const addCustomCity = () => {
    const trimmed = customCity.trim();
    if (!trimmed) return;
    if (!selectedCities.includes(trimmed)) onChange([...selectedCities, trimmed]);
    setCustomCity('');
    setShowCustomInput(false);
  };

  const menu = rect ? (
    <div
      ref={menuRef}
      style={{
        position: 'fixed',
        left: rect.left,
        top: rect.bottom + 6,
        minWidth: Math.max(280, rect.width),
        zIndex: 9999,
      }}
    >
      <div className="bg-card rounded-md border border-input shadow-lg max-h-64 overflow-auto p-2">
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full mb-2 rounded-md border border-input px-2 py-1 text-sm"
          placeholder="Filter cities..."
        />
        <div className="space-y-1">
          {INDIAN_CITIES.filter(c => c.toLowerCase().includes(filter.toLowerCase())).map((city) => {
            const checked = selectedCities.includes(city);
            return (
              <label key={city} className="flex items-center gap-2 px-2 py-1 rounded hover:bg-muted/20 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleCity(city)}
                />
                <span className="text-sm">{city}</span>
              </label>
            );
          })}
        </div>

        <div className="border-t border-border mt-2 pt-2">
          {!showCustomInput ? (
            <button
              type="button"
              onClick={() => setShowCustomInput(true)}
              className="w-full px-3 py-2 text-left hover:bg-accent hover:text-accent-foreground focus:outline-none text-primary font-medium rounded"
            >
              <Plus className="inline mr-2 h-4 w-4" />
              Add custom location
            </button>
          ) : (
            <div className="p-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter city name"
                  value={customCity}
                  onChange={(e) => setCustomCity(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addCustomCity()}
                  className="flex-1 px-2 py-1 border border-input rounded text-sm focus:outline-none focus:ring-1 focus:ring-ring bg-background"
                />
                <button type="button" onClick={addCustomCity} className="px-3 py-1 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/90">
                  Add
                </button>
                <button type="button" onClick={() => { setShowCustomInput(false); setCustomCity(''); }} className="px-2 py-1 text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-3 flex justify-end gap-2">
          <button type="button" className="px-3 py-1 rounded border border-input" onClick={() => setOpen(false)}>Done</button>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">
        Preferred Locations {required && <span className="text-destructive">*</span>}
      </label>

      <div
        ref={triggerRef}
        className="min-h-[44px] bg-background w-full rounded-md border border-input px-2 py-1 flex flex-wrap gap-2 items-center cursor-text"
        onClick={() => {
          setOpen(true);
          if (triggerRef.current) setRect(triggerRef.current.getBoundingClientRect());
        }}
      >
        {selectedCities.length === 0 ? (
          <span className="text-sm text-muted-foreground">Select preferred locations...</span>
        ) : (
          selectedCities.map((c) => (
            <span key={c} className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-sm border border-input bg-secondary text-secondary-foreground">
              <span>{c}</span>
              <button
                onClick={(e) => { e.stopPropagation(); toggleCity(c); }}
                type="button"
                aria-label={`remove ${c}`}
                className="ml-1 text-xs"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))
        )}
      </div>

      {open && typeof document !== 'undefined' && createPortal(menu, document.body)}
    </div>
  );
};

/* ---------------------------
   ValidatedInput (with icons)
   --------------------------- */
interface ValidatedInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  validator?: (value: string) => { isValid: boolean; message: string };
  required?: boolean;
  id?: string;
}

const ValidatedInput: React.FC<ValidatedInputProps> = ({ label, value, onChange, placeholder, validator, required = false, id }) => {
  const [touched, setTouched] = useState(false);
  const validation = validator ? validator(value) : { isValid: true, message: '' };
  const showError = touched && !validation.isValid;

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <div className="relative z-10">
        <Input
          id={id}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => setTouched(true)}
          className={`${showError ? 'border-destructive focus:border-destructive' : validation.isValid && value ? 'border-primary focus:border-primary' : 'border-input focus:border-primary'}`}
        />
        {value && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {showError ? (
              <AlertCircle className="h-5 w-5 text-destructive" />
            ) : validation.isValid ? (
              <CheckCircle className="h-5 w-5 text-primary" />
            ) : null}
          </div>
        )}
      </div>
      {showError && (
        <p className="text-sm text-destructive flex items-center">
          <AlertCircle className="h-4 w-4 mr-1" />
          {validation.message}
        </p>
      )}
    </div>
  );
};

/* ---------------------------
   Main Candidate component
   --------------------------- */

export default function Candidate() {
  const { toast } = useToast();

  const [profile, setProfile] = useState<CandidateProfile>({
    name: '',
    email: '',
    role: '',
    customRole: '',
    skills: [],
    bio: '',
    projects: [],
    resumeFile: null,
    resumeFileUrl: '',

    // Job preferences
    jobSeekingType: '',
    jobPreference: '',
    expectedSalary: '',
    preferredLocations: [],
    noticePeriod: '',

    // Additional info
    linkedin: '',
    github: '',
    portfolio: '',
    openToRelocate: undefined,
    education: '',
    graduationYear: '',
    additionalNotes: '',
  });

  const form = useForm<CandidateProfile>({
    defaultValues: profile,
  });

  const updateProfile = <K extends keyof CandidateProfile>(field: K, value: CandidateProfile[K]) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  /* ---------- Resume upload logic (client-side) ---------- */
  const hiddenFileRef = useRef<HTMLInputElement | null>(null);

  const onChooseFile = () => hiddenFileRef.current?.click();

  const validateResume = (file: File) => {
    const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const maxSize = 10 * 1024 * 1024; // 10 MB
    if (!allowed.includes(file.type)) return { ok: false, message: 'Only PDF / DOC / DOCX allowed' };
    if (file.size > maxSize) return { ok: false, message: 'File too large (max 10 MB)' };
    return { ok: true, message: '' };
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const v = validateResume(file);
    if (!v.ok) {
      toast({ title: "Invalid file", description: v.message, variant: 'destructive' });
      return;
    }
    updateProfile('resumeFile', file as any);
    toast({ title: "File selected", description: file.name });
  };

  const removeResume = () => {
    updateProfile('resumeFile', null);
    updateProfile('resumeFileUrl', '');
    if (hiddenFileRef.current) hiddenFileRef.current.value = '';
  };

  // Stub: replace this with your Supabase upload implementation.
  const uploadResumeToSupabase = async (file: File): Promise<string> => {
    // TODO: connect to Supabase storage and upload; return public URL.
    // Example (pseudo):
    // const { data, error } = await supabase.storage.from('resumes').upload(path, file);
    // return supabase.storage.from('resumes').getPublicUrl(path);
    // For now we just simulate a short delay and return a fake url.
    await new Promise(r => setTimeout(r, 700));
    return `https://example.com/uploads/${encodeURIComponent(file.name)}`;
  };

  const handleUpload = async () => {
    if (!profile.resumeFile) {
      toast({ title: "No file", description: "Choose a resume file first", variant: 'destructive' });
      return;
    }
    try {
      toast({ title: "Uploading", description: "Uploading resume..." });
      const url = await uploadResumeToSupabase(profile.resumeFile as File);
      updateProfile('resumeFileUrl', url as any);
      toast({ title: "Uploaded", description: "Resume uploaded successfully." });
    } catch (err) {
      console.error(err);
      toast({ title: "Upload failed", description: "Could not upload resume. Try again later.", variant: 'destructive' });
    }
  };

  const handleSubmit = () => {
    // Basic client-side guard: required fields (except salary)
    const requiredFields: (keyof CandidateProfile)[] = [
      'name', 'email', 'role', 'jobSeekingType', 'jobPreference', 'noticePeriod'
    ];
    for (const f of requiredFields) {
      const val = (profile as any)[f];
      if (!val || (Array.isArray(val) && val.length === 0)) {
        toast({ title: "Missing required fields", description: `Please fill ${String(f)}`, variant: 'destructive' });
        return;
      }
    }
    if (profile.role === 'Other' && !profile.customRole) {
      toast({ title: "Missing role", description: "Please specify your role", variant: 'destructive' });
      return;
    }
    if (!profile.preferredLocations || profile.preferredLocations.length === 0) {
      toast({ title: "Missing preferred locations", description: "Please choose at least one preferred location", variant: 'destructive' });
      return;
    }

    // Save
    console.log('Profile submitted:', profile);
    toast({
      title: "Profile Saved",
      description: "Your candidate profile has been saved successfully.",
    });
    // TODO: integrate with Supabase / server
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pt-20">
      <CandidateHeader />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 flex-1">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Create Your Candidate Profile
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Showcase your skills, projects, and experience to top companies.
            </p>
          </div>

          {/* Form and Submit Layout */}
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">

              {/* Basic Info */}
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name <span className="text-destructive">*</span></Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        value={profile.name}
                        onChange={(e) => updateProfile('name', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email <span className="text-destructive">*</span></Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={profile.email}
                        onChange={(e) => updateProfile('email', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">

                    <CustomSelect
                      id="role"
                      label="Role / Position"
                      value={profile.role || ''}
                      onChange={(value) => {
                        updateProfile('role', value as any);
                        if (value !== 'Other') updateProfile('customRole', '' as any);
                      }}
                      options={[
                        'Artificial Intelligence Engineer',
                        'Machine Learning Engineer',
                        'Big Data Engineer',
                        'Blockchain Developer (dApp / Smart Contracts)',
                        'Blockchain Engineer (Protocol / Infrastructure)',
                        'Cloud Architect',
                        'Cloud Engineer',
                        'Cloud Computing Specialist',
                        'Software Developer',
                        'Software Architect',
                        'IoT Solutions Architect',
                        'Data Architect',
                        'Information Security Specialist',
                        'Cybersecurity Analyst',
                        'Cybersecurity Engineer',
                        'Reliability Engineer (SRE)',
                        'Project Manager',
                        'Web Developer',
                        'Other'
                      ]}
                      placeholder="Select role"
                      required
                    />
                  </div>

                  {/* when 'Other' is picked, show a required custom input */}
                  {profile.role === 'Other' && (
                    <div className="space-y-2">
                      <Label htmlFor="customRole">Please specify <span className="text-destructive">*</span></Label>
                      <Input
                        id="customRole"
                        placeholder="Your role (e.g. Quantum Researcher)"
                        value={profile.customRole || ''}
                        onChange={(e) => updateProfile('customRole', e.target.value as any)}
                        required
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Job Preferences */}
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-primary" />
                    Job Preferences
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <CustomSelect
                      label="Looking for"
                      value={profile.jobSeekingType}
                      onChange={(value) => updateProfile('jobSeekingType', value as any)}
                      options={['Internship', 'Part-time', 'Full-time', 'Freelance']}
                      placeholder="Select..."
                      required
                    />

                    <CustomSelect
                      label="Job type preference"
                      value={profile.jobPreference}
                      onChange={(value) => updateProfile('jobPreference', value as any)}
                      options={['Remote', 'On-site', 'Hybrid', 'Any']}
                      placeholder="Select..."
                      required
                    />

                    <CustomSelect
                      label="Expected Salary (LPA) — optional"
                      value={profile.expectedSalary}
                      onChange={(value) => updateProfile('expectedSalary', value as any)}
                      options={[
                        'No preference',
                        '0 - 3 LPA',
                        '3 - 6 LPA',
                        '6 - 10 LPA',
                        '10 - 12 LPA',
                        '12 - 15 LPA',
                        '15 - 20 LPA',
                        '20 - 25 LPA',
                        '25 - 30 LPA',
                        '30 - 40 LPA',
                        '40 - 50 LPA',
                        '50+ LPA'
                      ]}
                      placeholder="Select..."
                    />

                    <CustomSelect
                      label="Notice Period"
                      value={profile.noticePeriod}
                      onChange={(value) => updateProfile('noticePeriod', value as any)}
                      options={['Immediate', '15 days', '1 month', '2 months', '3 months', 'Negotiable']}
                      placeholder="Select..."
                      required
                    />
                  </div>

                  <CityMultiSelect
                    selectedCities={profile.preferredLocations}
                    onChange={(cities) => updateProfile('preferredLocations', cities as any)}
                    required
                  />
                </CardContent>
              </Card>

              {/* Skills */}
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-primary" />
                    Skills & Technologies <span className="text-destructive">*</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SkillsInput
                    skills={profile.skills}
                    onChange={(skills) => updateProfile('skills', skills as any)}
                  />
                </CardContent>
              </Card>

              {/* Experience / Bio */}
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle>Experience & Bio</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Tell us about yourself and your experience</Label>
                    <Textarea
                      id="bio"
                      placeholder="I'm a passionate developer with 3+ years of experience..."
                      value={profile.bio}
                      onChange={(e) => updateProfile('bio', e.target.value as any)}
                      rows={6}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Projects */}
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle>Projects & Portfolio</CardTitle>
                </CardHeader>
                <CardContent>
                  <ProjectsSection
                    projects={profile.projects}
                    onChange={(projects) => updateProfile('projects', projects as any)}
                  />
                </CardContent>
              </Card>

              {/* Additional Information */}
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Additional Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <ValidatedInput
                      label="LinkedIn"
                      value={profile.linkedin}
                      onChange={(value) => updateProfile('linkedin', value as any)}
                      placeholder="https://linkedin.com/in/username"
                      validator={validateLinkedIn}
                    />

                    <ValidatedInput
                      label="GitHub"
                      value={profile.github}
                      onChange={(value) => updateProfile('github', value as any)}
                      placeholder="https://github.com/username"
                      validator={validateGitHub}
                    />

                    <ValidatedInput
                      label="Portfolio / Website"
                      value={profile.portfolio}
                      onChange={(value) => updateProfile('portfolio', value as any)}
                      placeholder="https://your-portfolio.example"
                      validator={validatePortfolio}
                    />

                    <div className="space-y-2">
                      <Label>Open to Relocate</Label>
                      <div className="flex items-center gap-4">
                        <label className="inline-flex items-center gap-2">
                          <input
                            type="radio"
                            name="relocate"
                            checked={profile.openToRelocate === true}
                            onChange={() => updateProfile('openToRelocate', true as any)}
                          />
                          Yes
                        </label>
                        <label className="inline-flex items-center gap-2">
                          <input
                            type="radio"
                            name="relocate"
                            checked={profile.openToRelocate === false}
                            onChange={() => updateProfile('openToRelocate', false as any)}
                          />
                          No
                        </label>
                        <label className="inline-flex items-center gap-2">
                          <input
                            type="radio"
                            name="relocate"
                            checked={profile.openToRelocate === 'maybe'}
                            onChange={() => updateProfile('openToRelocate', 'maybe' as any)}
                          />
                          Maybe
                        </label>
                      </div>
                    </div>

                    {/* Highest Education */}
                    <CustomSelect
                      label="Highest Education"
                      value={profile.education}
                      onChange={(value) => {
                        updateProfile('education', value as any);
                        // clear custom when a normal option is picked
                        if (value !== 'Other') updateProfile('customEducation', '' as any);
                      }}
                      options={[
                        "Bachelor's (B.Tech / B.E.)",
                        "Master's (M.Tech / M.S.)",
                        'MBA',
                        'Diploma',
                        'Other'
                      ]}
                      placeholder="Select..."
                      required
                    />

                    {profile.education === 'Other' && (
                      <div className="space-y-2">
                        <Label htmlFor="customEducation">Please specify your degree <span className="text-destructive">*</span></Label>
                        <Input
                          id="customEducation"
                          placeholder="e.g. B.Sc. Computer Science, M.Phil, PhD in AI"
                          value={profile.customEducation || ''}
                          onChange={(e) => updateProfile('customEducation', e.target.value as any)}
                          required
                        />
                      </div>
                    )}


                    <div className="space-y-2">
                      <Label htmlFor="graduationYear">Graduation Year</Label>
                      <Input
                        id="graduationYear"
                        placeholder="2022"
                        value={profile.graduationYear}
                        onChange={(e) => updateProfile('graduationYear', e.target.value as any)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="additionalNotes">Additional Notes (optional)</Label>
                    <Textarea
                      id="additionalNotes"
                      placeholder="Willing to work in specific domains, preferred tech stacks, notice on interviews etc."
                      value={profile.additionalNotes}
                      onChange={(e) => updateProfile('additionalNotes', e.target.value as any)}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Resume Upload */}
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5 text-primary" />
                    Resume Upload <span className="text-sm text-muted-foreground">(PDF / DOC / DOCX, max 10 MB)</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center space-y-4">
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="h-12 w-12 text-muted-foreground" />
                      <p className="text-muted-foreground mb-2">Upload your resume (PDF, DOC, DOCX)</p>
                      <input
                        ref={hiddenFileRef}
                        type="file"
                        accept=".pdf, .doc, .docx, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        className="hidden"
                        onChange={handleFileChange}
                      />

                      <div className="flex items-center gap-3">
                        <Button variant="outline" onClick={onChooseFile}>
                          Choose File
                        </Button>

                        {profile.resumeFile && (
                          <>
                            <div className="text-left">
                              <div className="font-medium">{(profile.resumeFile as File).name}</div>
                              <div className="text-sm text-muted-foreground">{Math.round(((profile.resumeFile as File).size / 1024) * 100) / 100} KB</div>
                            </div>

                            <Button variant="ghost" onClick={removeResume} title="Remove file">
                              <X />
                            </Button>

                            <Button onClick={handleUpload}>
                              Upload
                            </Button>
                          </>
                        )}
                      </div>

                      {profile.resumeFileUrl && (
                        <div className="mt-2 text-sm">
                          <a href={profile.resumeFileUrl} target="_blank" rel="noreferrer" className="underline">
                            View uploaded resume
                          </a>
                        </div>
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground mb-0">Coming soon - File upload will be stored in your Supabase bucket. Use the Upload button to push the file (currently stubbed).</p>
                  </div>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <div className="flex justify-center pt-6">
                <Button
                  onClick={handleSubmit}
                  size="lg"
                  className="px-12 py-3 text-lg hover-scale min-h-touch"
                >
                  Save Profile
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
