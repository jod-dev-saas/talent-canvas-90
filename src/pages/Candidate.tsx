import { useState } from 'react';
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

// Custom Select Component
interface CustomSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
  required?: boolean;
  className?: string;
}

const CustomSelect = ({ label, value, onChange, options, placeholder, required = false, className = '' }: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="space-y-2">
      <Label htmlFor={label.replace(/\s+/g, '').toLowerCase()}>
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <div className="relative z-20">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full px-3 py-2 border border-input rounded-md bg-background text-left shadow-sm hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors ${className}`}
        >
          <span className={value ? 'text-foreground' : 'text-muted-foreground'}>
            {value || placeholder}
          </span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2">
            <svg className={`h-5 w-5 text-muted-foreground transform transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </button>
        
        {isOpen && (
          <div className="absolute z-50 mt-1 w-full bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-auto">
            {options.map((option, index) => (
              <button
                key={index}
                type="button"
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2 text-left hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none ${
                  value === option ? 'bg-accent text-accent-foreground' : 'text-popover-foreground'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Multi-Select Component for Cities
interface CityMultiSelectProps {
  selectedCities: string[];
  onChange: (cities: string[]) => void;
  required?: boolean;
}

const CityMultiSelect = ({ selectedCities, onChange, required = false }: CityMultiSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customCity, setCustomCity] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleCitySelect = (city: string) => {
    if (!selectedCities.includes(city)) {
      onChange([...selectedCities, city]);
    }
  };

  const handleCityRemove = (cityToRemove: string) => {
    onChange(selectedCities.filter(city => city !== cityToRemove));
  };

  const handleCustomCityAdd = () => {
    if (customCity.trim() && !selectedCities.includes(customCity.trim())) {
      onChange([...selectedCities, customCity.trim()]);
      setCustomCity('');
      setShowCustomInput(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="preferredLocations">
        Preferred Locations {required && <span className="text-destructive">*</span>}
      </Label>
      
      {/* Selected Cities */}
      {selectedCities.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedCities.map((city, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-secondary text-secondary-foreground border"
            >
              {city}
              <button
                type="button"
                onClick={() => handleCityRemove(city)}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Dropdown */}
      <div className="relative z-30">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-3 py-2 border border-input rounded-md bg-background text-left shadow-sm hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors"
        >
          <span className="text-muted-foreground">
            {selectedCities.length === 0 ? 'Select preferred locations...' : `${selectedCities.length} location(s) selected`}
          </span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2">
            <svg className={`h-5 w-5 text-muted-foreground transform transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </button>
        
        {isOpen && (
          <div className="absolute z-50 mt-1 w-full bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-auto">
            {INDIAN_CITIES.map((city, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleCitySelect(city)}
                disabled={selectedCities.includes(city)}
                className={`w-full px-3 py-2 text-left hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none ${
                  selectedCities.includes(city) 
                    ? 'bg-muted text-muted-foreground cursor-not-allowed' 
                    : 'text-popover-foreground'
                }`}
              >
                {city}
                {selectedCities.includes(city) && (
                  <CheckCircle className="inline ml-2 h-4 w-4 text-primary" />
                )}
              </button>
            ))}
            
            {/* Add Custom City Option */}
            <div className="border-t border-border">
              {!showCustomInput ? (
                <button
                  type="button"
                  onClick={() => setShowCustomInput(true)}
                  className="w-full px-3 py-2 text-left hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none text-primary font-medium"
                >
                  <Plus className="inline mr-2 h-4 w-4" />
                  Add custom location
                </button>
              ) : (
                <div className="p-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter city name"
                      value={customCity}
                      onChange={(e) => setCustomCity(e.target.value)}
                      className="flex-1 px-2 py-1 border border-input rounded text-sm focus:outline-none focus:ring-1 focus:ring-ring bg-background"
                      onKeyPress={(e) => e.key === 'Enter' && handleCustomCityAdd()}
                    />
                    <button
                      type="button"
                      onClick={handleCustomCityAdd}
                      className="px-3 py-1 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/90"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCustomInput(false);
                        setCustomCity('');
                      }}
                      className="px-2 py-1 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      <p className="text-sm text-muted-foreground">
        Hold Ctrl/Cmd to select multiple. Choose at least one preferred location.
      </p>
    </div>
  );
};

// Input with validation
interface ValidatedInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  validator?: (value: string) => { isValid: boolean; message: string };
  required?: boolean;
}

const ValidatedInput = ({ label, value, onChange, placeholder, validator, required = false }: ValidatedInputProps) => {
  const [touched, setTouched] = useState(false);
  const validation = validator ? validator(value) : { isValid: true, message: '' };
  const showError = touched && !validation.isValid;

  return (
    <div className="space-y-2">
      <Label>
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <div className="relative z-10">
        <Input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => setTouched(true)}
          className={`${
            showError 
              ? 'border-destructive focus:border-destructive' 
              : validation.isValid && value 
                ? 'border-primary focus:border-primary' 
                : 'border-input focus:border-primary'
          }`}
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

export default function Candidate() {
  const { toast } = useToast();
  const [profile, setProfile] = useState<CandidateProfile>({
    name: '',
    email: '',
    role: '',
    skills: [],
    bio: '',
    projects: [],
    resumeFile: null,

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

  const updateProfile = (field: keyof CandidateProfile, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log('Profile submitted:', profile);
    // TODO: Integrate with Supabase backend later (add auth + RLS first)
    toast({
      title: "Profile Saved",
      description: "Your candidate profile has been saved successfully.",
    });
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
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        value={profile.name}
                        onChange={(e) => updateProfile('name', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={profile.email}
                        onChange={(e) => updateProfile('email', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role / Position</Label>
                    <Input
                      id="role"
                      placeholder="Frontend Developer"
                      value={profile.role}
                      onChange={(e) => updateProfile('role', e.target.value)}
                    />
                  </div>
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
                      onChange={(value) => updateProfile('jobSeekingType', value)}
                      options={['Internship', 'Part-time', 'Full-time', 'Freelance']}
                      placeholder="Select..."
                      required
                    />

                    <CustomSelect
                      label="Job type preference"
                      value={profile.jobPreference}
                      onChange={(value) => updateProfile('jobPreference', value)}
                      options={['Remote', 'On-site', 'Hybrid', 'Any']}
                      placeholder="Select..."
                      required
                    />

                    <CustomSelect
                      label="Expected Salary (LPA) — optional"
                      value={profile.expectedSalary}
                      onChange={(value) => updateProfile('expectedSalary', value)}
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
                      onChange={(value) => updateProfile('noticePeriod', value)}
                      options={['Immediate', '15 days', '1 month', '2 months', '3 months', 'Negotiable']}
                      placeholder="Select..."
                    />
                  </div>

                  <CityMultiSelect
                    selectedCities={profile.preferredLocations}
                    onChange={(cities) => updateProfile('preferredLocations', cities)}
                    required
                  />
                  
                  <p className="text-sm text-muted-foreground">Optional — typical salary bands for Indian software jobs.</p>
                </CardContent>
              </Card>

              {/* Skills */}
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-primary" />
                    Skills & Technologies
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SkillsInput
                    skills={profile.skills}
                    onChange={(skills) => updateProfile('skills', skills)}
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
                      placeholder="I'm a passionate developer with 3+ years of experience in building web applications using React, TypeScript, and Node.js. I love creating user-friendly interfaces and solving complex problems..."
                      value={profile.bio}
                      onChange={(e) => updateProfile('bio', e.target.value)}
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
                    onChange={(projects) => updateProfile('projects', projects)}
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
                      onChange={(value) => updateProfile('linkedin', value)}
                      placeholder="https://linkedin.com/in/username"
                      validator={validateLinkedIn}
                    />

                    <ValidatedInput
                      label="GitHub"
                      value={profile.github}
                      onChange={(value) => updateProfile('github', value)}
                      placeholder="https://github.com/username"
                      validator={validateGitHub}
                    />

                    <ValidatedInput
                      label="Portfolio / Website"
                      value={profile.portfolio}
                      onChange={(value) => updateProfile('portfolio', value)}
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
                            onChange={() => updateProfile('openToRelocate', true)}
                          />
                          Yes
                        </label>
                        <label className="inline-flex items-center gap-2">
                          <input
                            type="radio"
                            name="relocate"
                            checked={profile.openToRelocate === false}
                            onChange={() => updateProfile('openToRelocate', false)}
                          />
                          No
                        </label>
                        <label className="inline-flex items-center gap-2">
                          <input
                            type="radio"
                            name="relocate"
                            checked={profile.openToRelocate === 'maybe'}
                            onChange={() => updateProfile('openToRelocate', 'maybe')}
                          />
                          Maybe / Negotiable
                        </label>
                      </div>
                    </div>

                    <CustomSelect
                      label="Highest Education"
                      value={profile.education}
                      onChange={(value) => updateProfile('education', value)}
                      options={[
                        "Bachelor's (B.Tech / B.E.)",
                        "Master's (M.Tech / M.S.)",
                        'MBA',
                        'Diploma',
                        'Other'
                      ]}
                      placeholder="Select..."
                    />

                    <div className="space-y-2">
                      <Label htmlFor="graduationYear">Graduation Year</Label>
                      <Input
                        id="graduationYear"
                        placeholder="2022"
                        value={profile.graduationYear}
                        onChange={(e) => updateProfile('graduationYear', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="additionalNotes">Additional Notes (optional)</Label>
                    <Textarea
                      id="additionalNotes"
                      placeholder="Willing to work in specific domains, preferred tech stacks, notice on interviews etc."
                      value={profile.additionalNotes}
                      onChange={(e) => updateProfile('additionalNotes', e.target.value)}
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
                    Resume Upload
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-2">Upload your resume (PDF, DOC)</p>
                    <p className="text-sm text-muted-foreground mb-4">Coming soon - File upload integration</p>
                    <Button variant="outline" disabled>
                      Choose File
                    </Button>
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