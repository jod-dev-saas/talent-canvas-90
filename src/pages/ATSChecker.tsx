/**
 * ATS Checker - Client-side resume ATS analysis tool
 * 
 * Features:
 * - Text upload/paste interface
 * - Keyword density analysis vs target skills
 * - Format checking (headings, contact info, bullets)
 * - Readability scoring (Flesch-Kincaid approximation)
 * - ATS-friendliness percentage with actionable recommendations
 * - Inline suggestion highlighting
 * - Report export (JSON)
 * 
 * Environment hooks:
 * - Currently client-side only for MVP
 * - TODO: Add server-side PDF text extraction for file uploads
 * - TODO: Add more sophisticated NLP analysis via API
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Upload, FileText, Download, CheckCircle, AlertTriangle, XCircle, Lightbulb } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ATSAnalysis {
  overallScore: number;
  keywordDensity: {
    found: string[];
    missing: string[];
    density: number;
  };
  formatChecks: {
    hasContactInfo: boolean;
    hasHeadings: boolean;
    hasBulletPoints: boolean;
    hasTables: boolean;
  };
  readability: {
    score: number;
    level: string;
  };
  recommendations: string[];
}

const COMMON_SKILLS = [
  'JavaScript', 'Python', 'React', 'Node.js', 'TypeScript', 'HTML', 'CSS',
  'SQL', 'Git', 'AWS', 'Docker', 'Kubernetes', 'Java', 'C++', 'Machine Learning',
  'Data Analysis', 'Project Management', 'Agile', 'Scrum', 'Leadership'
];

export default function ATSChecker() {
  const [resumeText, setResumeText] = useState('');
  const [targetSkills, setTargetSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [analysis, setAnalysis] = useState<ATSAnalysis | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { toast } = useToast();

  const addSkill = (skill: string) => {
    if (skill.trim() && !targetSkills.includes(skill.trim())) {
      setTargetSkills(prev => [...prev, skill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setTargetSkills(prev => prev.filter(s => s !== skill));
  };

  const analyzeResume = () => {
    if (!resumeText.trim()) {
      toast({
        title: "No Resume Text",
        description: "Please paste your resume text to analyze.",
        variant: "destructive"
      });
      return;
    }

    const text = resumeText.toLowerCase();
    const words = resumeText.split(/\s+/).length;
    const sentences = resumeText.split(/[.!?]+/).length;

    // Keyword analysis
    const foundSkills = targetSkills.filter(skill => 
      text.includes(skill.toLowerCase())
    );
    const missingSkills = targetSkills.filter(skill => 
      !text.includes(skill.toLowerCase())
    );
    const density = targetSkills.length > 0 ? (foundSkills.length / targetSkills.length) * 100 : 0;

    // Format checks
    const hasContactInfo = /\b[\w._%+-]+@[\w.-]+\.[A-Z|a-z]{2,}\b/.test(resumeText) || 
                          /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/.test(resumeText);
    const hasHeadings = /\b(experience|education|skills|projects|summary|objective)\b/i.test(resumeText);
    const hasBulletPoints = /^\s*[•\-\*]\s/m.test(resumeText);
    const hasTables = /\|.*\|/.test(resumeText) || /\t.*\t/.test(resumeText);

    // Simple readability (Flesch Reading Ease approximation)
    const avgWordsPerSentence = words / sentences;
    const avgSyllablesPerWord = 1.5; // Rough approximation
    const fleschScore = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);
    const readabilityLevel = fleschScore >= 90 ? 'Very Easy' :
                           fleschScore >= 80 ? 'Easy' :
                           fleschScore >= 70 ? 'Fairly Easy' :
                           fleschScore >= 60 ? 'Standard' :
                           fleschScore >= 50 ? 'Fairly Difficult' :
                           fleschScore >= 30 ? 'Difficult' : 'Very Difficult';

    // Generate recommendations
    const recommendations: string[] = [];
    
    if (!hasContactInfo) {
      recommendations.push("Add contact information (email and phone) at the top of your resume");
    }
    if (!hasHeadings) {
      recommendations.push("Use clear section headings like 'Experience', 'Education', and 'Skills'");
    }
    if (!hasBulletPoints) {
      recommendations.push("Use bullet points to list achievements and responsibilities");
    }
    if (hasTables) {
      recommendations.push("Replace tables with simple text format - ATS systems struggle with tables");
    }
    if (missingSkills.length > 0) {
      recommendations.push(`Consider adding missing relevant skills: ${missingSkills.slice(0, 3).join(', ')}`);
    }
    if (words < 200) {
      recommendations.push("Your resume seems short - consider adding more details about your experience");
    }
    if (fleschScore < 60) {
      recommendations.push("Simplify language and use shorter sentences for better readability");
    }
    if (density < 50) {
      recommendations.push("Include more relevant keywords from the job description");
    }

    // Calculate overall score
    let score = 0;
    if (hasContactInfo) score += 20;
    if (hasHeadings) score += 15;
    if (hasBulletPoints) score += 15;
    if (!hasTables) score += 10;
    score += Math.min(density / 2, 25); // Up to 25 points for keyword density
    score += Math.min((fleschScore - 30) / 2, 15); // Up to 15 points for readability

    const analysisResult: ATSAnalysis = {
      overallScore: Math.max(0, Math.min(100, score)),
      keywordDensity: {
        found: foundSkills,
        missing: missingSkills,
        density
      },
      formatChecks: {
        hasContactInfo,
        hasHeadings,
        hasBulletPoints,
        hasTables
      },
      readability: {
        score: Math.max(0, fleschScore),
        level: readabilityLevel
      },
      recommendations
    };

    setAnalysis(analysisResult);
    toast({
      title: "Analysis Complete",
      description: `Your resume scored ${Math.round(analysisResult.overallScore)}% for ATS compatibility.`,
    });
  };

  const exportReport = () => {
    if (!analysis) return;

    const report = {
      timestamp: new Date().toISOString(),
      resume_length: resumeText.length,
      target_skills: targetSkills,
      analysis
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ats-analysis-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Report Exported",
      description: "ATS analysis report has been downloaded.",
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // TODO: Add PDF text extraction here
      // For now, show a message asking users to paste text
      toast({
        title: "File Upload Not Yet Supported",
        description: "Please copy and paste your resume text for now. PDF extraction coming soon!",
        variant: "destructive"
      });
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (score >= 60) return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
    return <XCircle className="w-5 h-5 text-red-600" />;
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
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              ATS Checker
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Analyze your resume for ATS compatibility and get actionable feedback to improve your chances.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Input */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Resume Input */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Resume Input
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Tabs defaultValue="paste" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="paste">Paste Text</TabsTrigger>
                      <TabsTrigger value="upload">Upload File</TabsTrigger>
                    </TabsList>
                    <TabsContent value="paste" className="space-y-4">
                      <div>
                        <Label htmlFor="resume-text">Paste your resume text below</Label>
                        <Textarea
                          id="resume-text"
                          placeholder="Copy and paste your resume content here..."
                          value={resumeText}
                          onChange={(e) => setResumeText(e.target.value)}
                          rows={12}
                          className="font-mono text-sm"
                        />
                      </div>
                    </TabsContent>
                    <TabsContent value="upload" className="space-y-4">
                      <Alert>
                        <Lightbulb className="h-4 w-4" />
                        <AlertDescription>
                          PDF extraction is coming soon! For now, please copy and paste your resume text in the "Paste Text" tab.
                        </AlertDescription>
                      </Alert>
                      <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                        <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground mb-4">Upload your resume (PDF, DOC)</p>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="file-upload"
                        />
                        <Button variant="outline" disabled className="min-h-touch">
                          <Upload className="w-4 h-4 mr-2" />
                          Choose File (Coming Soon)  
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Target Skills */}
              <Card>
                <CardHeader>
                  <CardTitle>Target Skills</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Add skills relevant to the job you're applying for
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add a skill..."
                      onKeyPress={(e) => e.key === 'Enter' && addSkill(newSkill)}
                      className="min-h-touch"
                    />
                    <Button onClick={() => addSkill(newSkill)} className="min-h-touch">
                      Add
                    </Button>
                  </div>
                  
                  {/* Quick Add Common Skills */}
                  <div>
                    <Label className="text-sm text-muted-foreground">Quick add common skills:</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {COMMON_SKILLS.filter(skill => !targetSkills.includes(skill)).slice(0, 10).map((skill) => (
                        <Button
                          key={skill}
                          onClick={() => addSkill(skill)}
                          variant="outline"
                          size="sm"
                          className="min-h-touch"
                        >
                          + {skill}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Selected Skills */}
                  {targetSkills.length > 0 && (
                    <div>
                      <Label className="text-sm">Selected skills:</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {targetSkills.map((skill) => (
                          <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                            {skill}
                            <button
                              onClick={() => removeSkill(skill)}
                              className="ml-1 hover:text-destructive"
                              aria-label={`Remove ${skill}`}
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex flex-wrap gap-4">
                <Button 
                  onClick={analyzeResume} 
                  size="lg"
                  disabled={!resumeText.trim()}
                  className="min-h-touch"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Analyze Resume
                </Button>
                {analysis && (
                  <>
                    <Button 
                      onClick={() => setShowSuggestions(!showSuggestions)}
                      variant="outline"
                      className="min-h-touch"
                    >
                      <Lightbulb className="w-4 h-4 mr-2" />
                      {showSuggestions ? 'Hide' : 'Show'} Suggestions
                    </Button>
                    <Button 
                      onClick={exportReport}
                      variant="outline"
                      className="min-h-touch"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export Report
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Right Column - Results */}
            <div className="space-y-6">
              {analysis ? (
                <>
                  {/* Overall Score */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {getScoreIcon(analysis.overallScore)}
                        ATS Compatibility
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center mb-4">
                        <div className={`text-4xl font-bold ${getScoreColor(analysis.overallScore)}`}>
                          {Math.round(analysis.overallScore)}%
                        </div>
                        <Progress value={analysis.overallScore} className="mt-2" />
                      </div>
                      <p className="text-sm text-muted-foreground text-center">
                        {analysis.overallScore >= 80 ? 'Excellent! Your resume is ATS-friendly.' :
                         analysis.overallScore >= 60 ? 'Good, but could be improved.' :
                         'Needs improvement for better ATS compatibility.'}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Keyword Analysis */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Keyword Analysis</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Keyword Match</span>
                          <span className="text-sm font-bold">{Math.round(analysis.keywordDensity.density)}%</span>
                        </div>
                        <Progress value={analysis.keywordDensity.density} />
                      </div>
                      
                      {analysis.keywordDensity.found.length > 0 && (
                        <div>
                          <Label className="text-sm text-green-600">Found Skills ({analysis.keywordDensity.found.length})</Label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {analysis.keywordDensity.found.map((skill) => (
                              <Badge key={skill} variant="secondary" className="bg-green-100 text-green-800">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {analysis.keywordDensity.missing.length > 0 && (
                        <div>
                          <Label className="text-sm text-red-600">Missing Skills ({analysis.keywordDensity.missing.length})</Label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {analysis.keywordDensity.missing.map((skill) => (
                              <Badge key={skill} variant="secondary" className="bg-red-100 text-red-800">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Format Checks */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Format Analysis</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Contact Information</span>
                        {analysis.formatChecks.hasContactInfo ? 
                          <CheckCircle className="w-4 h-4 text-green-600" /> : 
                          <XCircle className="w-4 h-4 text-red-600" />
                        }
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Section Headings</span>
                        {analysis.formatChecks.hasHeadings ? 
                          <CheckCircle className="w-4 h-4 text-green-600" /> : 
                          <XCircle className="w-4 h-4 text-red-600" />
                        }
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Bullet Points</span>
                        {analysis.formatChecks.hasBulletPoints ? 
                          <CheckCircle className="w-4 h-4 text-green-600" /> : 
                          <XCircle className="w-4 h-4 text-red-600" />
                        }
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">No Tables</span>
                        {!analysis.formatChecks.hasTables ? 
                          <CheckCircle className="w-4 h-4 text-green-600" /> : 
                          <AlertTriangle className="w-4 h-4 text-yellow-600" />
                        }
                      </div>
                    </CardContent>
                  </Card>

                  {/* Readability */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Readability</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <div className="text-2xl font-bold mb-1">
                          {Math.round(analysis.readability.score)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {analysis.readability.level}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recommendations */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-primary" />
                        Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {analysis.recommendations.map((rec, index) => (
                          <div key={index} className="flex items-start gap-2 text-sm">
                            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                            <span>{rec}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Paste your resume and click "Analyze Resume" to get started.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}