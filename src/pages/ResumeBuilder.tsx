/**
 * Resume Builder - Candidate resume creation tool with live preview
 * 
 * Features:
 * - Multi-section form builder (Profile, Experience, Education, Projects, Skills)
 * - Live preview with printable templates (Classic/Modern)
 * - Draft save/load via localStorage key 'jod_resume_draft_v1'
 * - Print-to-PDF functionality
 * 
 * Environment hooks:
 * - TODO: Replace localStorage with Supabase writes (add auth + RLS first)
 * - TODO: Replace window.print() with server-side PDF generation
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Save, Upload, Download, Trash2, Plus, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  graduationYear: string;
  gpa?: string;
}

interface Project {
  id: string;
  title: string;
  link?: string;
  description: string;
  technologies: string[];
}

interface ResumeData {
  profile: {
    name: string;
    email: string;
    phone: string;
    location: string;
    title: string;
    summary: string;
  };
  experience: Experience[];
  education: Education[];
  projects: Project[];
  skills: string[];
}

const STORAGE_KEY = 'jod_resume_draft_v1';

const emptyResume: ResumeData = {
  profile: {
    name: '',
    email: '',
    phone: '',
    location: '',
    title: '',
    summary: ''
  },
  experience: [],
  education: [],
  projects: [],
  skills: []
};

export default function ResumeBuilder() {
  const [resumeData, setResumeData] = useState<ResumeData>(emptyResume);
  const [template, setTemplate] = useState<'classic' | 'modern'>('classic');
  const [newSkill, setNewSkill] = useState('');
  const { toast } = useToast();

  // Auto-save every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      saveToLocalStorage();
    }, 15000);
    return () => clearInterval(interval);
  }, [resumeData]);

  const saveToLocalStorage = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        data: resumeData,
        template,
        lastSaved: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  };

  const saveDraft = () => {
    saveToLocalStorage();
    toast({
      title: "Draft Saved",
      description: "Your resume has been saved locally.",
    });
  };

  const loadDraft = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const { data, template: savedTemplate } = JSON.parse(saved);
        setResumeData(data);
        setTemplate(savedTemplate || 'classic');
        toast({
          title: "Draft Loaded",
          description: "Your saved resume has been loaded.",
        });
      } else {
        toast({
          title: "No Draft Found",
          description: "No saved resume draft found.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Load Failed",
        description: "Failed to load resume draft.",
        variant: "destructive"
      });
    }
  };

  const clearDraft = () => {
    localStorage.removeItem(STORAGE_KEY);
    setResumeData(emptyResume);
    setTemplate('classic');
    toast({
      title: "Draft Cleared",
      description: "Resume draft has been cleared.",
    });
  };

  const downloadPDF = () => {
    // TODO: Replace with server-side PDF generation for better control
    window.print();
    toast({
      title: "Print Dialog Opened",
      description: "Use your browser's print dialog to save as PDF.",
    });
  };

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
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, newExp]
    }));
  };

  const removeExperience = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };

  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const addBullet = (expId: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp =>
        exp.id === expId ? { ...exp, bullets: [...exp.bullets, ''] } : exp
      )
    }));
  };

  const removeBullet = (expId: string, bulletIndex: number) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp =>
        exp.id === expId 
          ? { ...exp, bullets: exp.bullets.filter((_, i) => i !== bulletIndex) }
          : exp
      )
    }));
  };

  const updateBullet = (expId: string, bulletIndex: number, value: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp =>
        exp.id === expId 
          ? { 
              ...exp, 
              bullets: exp.bullets.map((bullet, i) => i === bulletIndex ? value : bullet)
            }
          : exp
      )
    }));
  };

  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      field: '',
      graduationYear: ''
    };
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, newEdu]
    }));
  };

  const removeEducation = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  const updateEducation = (id: string, field: keyof Education, value: any) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      title: '',
      description: '',
      technologies: []
    };
    setResumeData(prev => ({
      ...prev,
      projects: [...prev.projects, newProject]
    }));
  };

  const removeProject = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.filter(proj => proj.id !== id)
    }));
  };

  const updateProject = (id: string, field: keyof Project, value: any) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.map(proj =>
        proj.id === id ? { ...proj, [field]: value } : proj
      )
    }));
  };

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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      {/* Breadcrumb */}
      <div className="border-b border-border bg-muted/30">
        <div className="container mx-auto px-4 py-4">
          <Link 
            to="/candidate" 
            className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors min-h-touch"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Candidate
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Resume Builder
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Create a professional resume with live preview and multiple templates.
            </p>
          </div>

          {/* Actions Bar */}
          <div className="flex flex-wrap gap-4 mb-8 justify-center md:justify-start">
            <Button onClick={saveDraft} className="min-h-touch">
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
            <Button onClick={loadDraft} variant="outline" className="min-h-touch">
              <Upload className="w-4 h-4 mr-2" />
              Load Draft
            </Button>
            <Button onClick={downloadPDF} variant="outline" className="min-h-touch">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="min-h-touch">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear Draft
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear Resume Draft?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete your current resume draft. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={clearDraft}>Clear Draft</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          {/* Two-column layout on desktop, stacked on mobile */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Form */}
            <div className="space-y-6">
              
              {/* Template Selector */}
              <Card>
                <CardHeader>
                  <CardTitle>Template Style</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select value={template} onValueChange={(value: 'classic' | 'modern') => setTemplate(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="classic">Classic</SelectItem>
                      <SelectItem value="modern">Modern</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Profile Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={resumeData.profile.name}
                        onChange={(e) => setResumeData(prev => ({
                          ...prev,
                          profile: { ...prev.profile, name: e.target.value }
                        }))}
                        className="min-h-touch"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={resumeData.profile.email}
                        onChange={(e) => setResumeData(prev => ({
                          ...prev,
                          profile: { ...prev.profile, email: e.target.value }
                        }))}
                        className="min-h-touch"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={resumeData.profile.phone}
                        onChange={(e) => setResumeData(prev => ({
                          ...prev,
                          profile: { ...prev.profile, phone: e.target.value }
                        }))}
                        className="min-h-touch"
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={resumeData.profile.location}
                        onChange={(e) => setResumeData(prev => ({
                          ...prev,
                          profile: { ...prev.profile, location: e.target.value }
                        }))}
                        className="min-h-touch"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="title">Professional Title</Label>
                    <Input
                      id="title"
                      value={resumeData.profile.title}
                      onChange={(e) => setResumeData(prev => ({
                        ...prev,
                        profile: { ...prev.profile, title: e.target.value }
                      }))}
                      className="min-h-touch"
                    />
                  </div>
                  <div>
                    <Label htmlFor="summary">Professional Summary</Label>
                    <Textarea
                      id="summary"
                      rows={4}
                      value={resumeData.profile.summary}
                      onChange={(e) => setResumeData(prev => ({
                        ...prev,
                        profile: { ...prev.profile, summary: e.target.value }
                      }))}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Experience Section */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Work Experience</CardTitle>
                  <Button onClick={addExperience} size="sm" className="min-h-touch">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Experience
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  {resumeData.experience.map((exp, index) => (
                    <div key={exp.id} className="border border-border rounded-lg p-4 space-y-4">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">Experience {index + 1}</h4>
                        <Button
                          onClick={() => removeExperience(exp.id)}
                          size="sm"
                          variant="destructive"
                          className="min-h-touch min-w-touch"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label>Company</Label>
                          <Input
                            value={exp.company}
                            onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                            className="min-h-touch"
                          />
                        </div>
                        <div>
                          <Label>Role</Label>
                          <Input
                            value={exp.role}
                            onChange={(e) => updateExperience(exp.id, 'role', e.target.value)}
                            className="min-h-touch"
                          />
                        </div>
                        <div>
                          <Label>Start Date</Label>
                          <Input
                            type="month"
                            value={exp.startDate}
                            onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                            className="min-h-touch"
                          />
                        </div>
                        <div>
                          <Label>End Date</Label>
                          <Input
                            type="month"
                            value={exp.endDate}
                            onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                            disabled={exp.current}
                            className="min-h-touch"
                          />
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`current-${exp.id}`}
                          checked={exp.current}
                          onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                          className="min-h-touch min-w-touch"
                        />
                        <Label htmlFor={`current-${exp.id}`}>Currently working here</Label>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label>Key Achievements</Label>
                          <Button
                            onClick={() => addBullet(exp.id)}
                            size="sm"
                            variant="outline"
                            className="min-h-touch"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Bullet
                          </Button>
                        </div>
                        {exp.bullets.map((bullet, bulletIndex) => (
                          <div key={bulletIndex} className="flex gap-2">
                            <Input
                              value={bullet}
                              onChange={(e) => updateBullet(exp.id, bulletIndex, e.target.value)}
                              placeholder="Describe your achievement..."
                              className="min-h-touch"
                            />
                            <Button
                              onClick={() => removeBullet(exp.id, bulletIndex)}
                              size="sm"
                              variant="destructive"
                              className="min-h-touch min-w-touch"
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
                  <CardTitle>Education</CardTitle>
                  <Button onClick={addEducation} size="sm" className="min-h-touch">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Education
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {resumeData.education.map((edu, index) => (
                    <div key={edu.id} className="border border-border rounded-lg p-4 space-y-4">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">Education {index + 1}</h4>
                        <Button
                          onClick={() => removeEducation(edu.id)}
                          size="sm"
                          variant="destructive"
                          className="min-h-touch min-w-touch"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label>Institution</Label>
                          <Input
                            value={edu.institution}
                            onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                            className="min-h-touch"
                          />
                        </div>
                        <div>
                          <Label>Degree</Label>
                          <Input
                            value={edu.degree}
                            onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                            className="min-h-touch"
                          />
                        </div>
                        <div>
                          <Label>Field of Study</Label>
                          <Input
                            value={edu.field}
                            onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                            className="min-h-touch"
                          />
                        </div>
                        <div>
                          <Label>Graduation Year</Label>
                          <Input
                            value={edu.graduationYear}
                            onChange={(e) => updateEducation(edu.id, 'graduationYear', e.target.value)}
                            className="min-h-touch"
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
                  <CardTitle>Projects</CardTitle>
                  <Button onClick={addProject} size="sm" className="min-h-touch">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Project
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {resumeData.projects.map((project, index) => (
                    <div key={project.id} className="border border-border rounded-lg p-4 space-y-4">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">Project {index + 1}</h4>
                        <Button
                          onClick={() => removeProject(project.id)}
                          size="sm"
                          variant="destructive"  
                          className="min-h-touch min-w-touch"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label>Title</Label>
                          <Input
                            value={project.title}
                            onChange={(e) => updateProject(project.id, 'title', e.target.value)}
                            className="min-h-touch"
                          />
                        </div>
                        <div>
                          <Label>Link (optional)</Label>
                          <Input
                            value={project.link || ''}
                            onChange={(e) => updateProject(project.id, 'link', e.target.value)}
                            className="min-h-touch"
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={project.description}
                          onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                          rows={3}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Skills Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        placeholder="Add a skill..."
                        onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                        className="min-h-touch"
                      />
                      <Button onClick={addSkill} className="min-h-touch">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {resumeData.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                          {skill}
                          <button
                            onClick={() => removeSkill(skill)}
                            className="ml-1 hover:text-destructive"
                            aria-label={`Remove ${skill}`}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Preview */}
            <div className="lg:sticky lg:top-8 lg:h-fit">
              <Card>
                <CardHeader>
                  <CardTitle>Live Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div 
                    className={`resume-preview bg-white text-black p-6 rounded border min-h-[800px] ${
                      template === 'modern' ? 'resume-modern' : 'resume-classic'
                    }`}
                    style={{ fontFamily: 'Arial, sans-serif', fontSize: '14px', lineHeight: '1.4' }}
                  >
                    {/* Header */}
                    <div className="text-center mb-6 pb-4 border-b border-gray-300">
                      <h1 className="text-2xl font-bold mb-2">{resumeData.profile.name || 'Your Name'}</h1>
                      <p className="text-lg text-gray-600 mb-2">{resumeData.profile.title || 'Professional Title'}</p>
                      <div className="flex justify-center gap-4 text-sm">
                        {resumeData.profile.email && <span>{resumeData.profile.email}</span>}
                        {resumeData.profile.phone && <span>{resumeData.profile.phone}</span>}
                        {resumeData.profile.location && <span>{resumeData.profile.location}</span>}
                      </div>
                    </div>

                    {/* Summary */}
                    {resumeData.profile.summary && (
                      <div className="mb-6">
                        <h2 className="text-lg font-bold mb-2 border-b border-gray-300 pb-1">Professional Summary</h2>
                        <p className="text-sm">{resumeData.profile.summary}</p>
                      </div>
                    )}

                    {/* Experience */}
                    {resumeData.experience.length > 0 && (
                      <div className="mb-6">
                        <h2 className="text-lg font-bold mb-2 border-b border-gray-300 pb-1">Work Experience</h2>
                        {resumeData.experience.map((exp) => (
                          <div key={exp.id} className="mb-4">
                            <div className="flex justify-between items-start mb-1">
                              <h3 className="font-semibold">{exp.role || 'Role'}</h3>
                              <span className="text-sm text-gray-600">
                                {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                              </span>
                            </div>
                            <p className="text-gray-600 mb-2">{exp.company || 'Company'}</p>
                            {exp.bullets.filter(b => b.trim()).length > 0 && (
                              <ul className="list-disc list-inside text-sm space-y-1">
                                {exp.bullets.filter(b => b.trim()).map((bullet, index) => (
                                  <li key={index}>{bullet}</li>
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
                        <h2 className="text-lg font-bold mb-2 border-b border-gray-300 pb-1">Education</h2>
                        {resumeData.education.map((edu) => (
                          <div key={edu.id} className="mb-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-semibold">{edu.degree || 'Degree'} in {edu.field || 'Field'}</h3>
                                <p className="text-gray-600">{edu.institution || 'Institution'}</p>
                              </div>
                              <span className="text-sm text-gray-600">{edu.graduationYear}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Projects */}
                    {resumeData.projects.length > 0 && (
                      <div className="mb-6">
                        <h2 className="text-lg font-bold mb-2 border-b border-gray-300 pb-1">Projects</h2>
                        {resumeData.projects.map((project) => (
                          <div key={project.id} className="mb-3">
                            <h3 className="font-semibold">{project.title || 'Project Title'}</h3>
                            {project.link && (
                              <p className="text-blue-600 text-sm">{project.link}</p>
                            )}
                            <p className="text-sm">{project.description || 'Project description'}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Skills */}
                    {resumeData.skills.length > 0 && (
                      <div className="mb-6">
                        <h2 className="text-lg font-bold mb-2 border-b border-gray-300 pb-1">Skills</h2>
                        <p className="text-sm">{resumeData.skills.join(', ')}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}