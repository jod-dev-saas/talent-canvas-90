import { useState } from 'react';
import { Upload, User, Briefcase } from 'lucide-react';
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

          {/* Form and Submit Layout - No Preview */}
          <div className="max-w-4xl mx-auto">
            {/* Form Section */}
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