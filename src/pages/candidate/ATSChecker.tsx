/**
 * ATS Checker Page - JOD ATS Score Analysis Tool
 * 
 * Upload resume and get ATS compatibility score with suggestions
 */

import { useState } from "react";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Upload, CheckCircle, AlertCircle, XCircle, Target, TrendingUp, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { CandidateHeader } from "@/components/CandidateHeader";

interface ATSResult {
  score: number;
  issues: Array<{
    type: 'critical' | 'warning' | 'suggestion';
    title: string;
    description: string;
    fix: string;
  }>;
  strengths: string[];
  keywords: {
    found: string[];
    missing: string[];
  };
}

const MOCK_ATS_RESULTS: ATSResult = {
  score: 76,
  issues: [
    {
      type: 'critical',
      title: 'Missing Contact Information',
      description: 'Your resume is missing a phone number',
      fix: 'Add your phone number to the contact section'
    },
    {
      type: 'warning',
      title: 'Non-standard Section Headers',
      description: 'Using "Professional Background" instead of "Work Experience"',
      fix: 'Use standard headers like "Work Experience", "Education", "Skills"'
    },
    {
      type: 'suggestion',
      title: 'Keyword Optimization',
      description: 'Could include more relevant technical skills',
      fix: 'Add keywords like "React", "Node.js", "AWS" based on job requirements'
    }
  ],
  strengths: [
    'Clean, readable formatting',
    'Appropriate file format (PDF)',
    'Quantified achievements',
    'Professional email address'
  ],
  keywords: {
    found: ['JavaScript', 'Python', 'Git', 'SQL', 'Agile'],
    missing: ['React', 'Node.js', 'AWS', 'Docker', 'TypeScript']
  }
};

export default function ATSChecker() {
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<ATSResult | null>(null);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      if (uploadedFile.type === 'application/pdf' || uploadedFile.type.startsWith('application/')) {
        setFile(uploadedFile);
        toast({
          title: "File Uploaded",
          description: `${uploadedFile.name} is ready for analysis`
        });
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please upload a PDF, DOC, or DOCX file",
          variant: "destructive"
        });
      }
    }
  };

  const analyzeResume = async () => {
    if (!file) return;

    setAnalyzing(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setResults(MOCK_ATS_RESULTS);
    setAnalyzing(false);
    
    toast({
      title: "Analysis Complete",
      description: `Your ATS score is ${MOCK_ATS_RESULTS.score}/100`
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'suggestion':
        return <Target className="h-5 w-5 text-blue-500" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <CandidateHeader/>
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-12 px-4 bg-muted/30">
          <div className="container mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                ATS Score Checker
              </h1>
              <p className="text-xl text-muted-foreground mb-6">
                Get your resume's ATS compatibility score and optimization tips
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <Badge variant="secondary">📊 Instant Analysis</Badge>
                <Badge variant="secondary">🔍 Detailed Feedback</Badge>
                <Badge variant="secondary">💡 Improvement Tips</Badge>
                <Badge variant="secondary">🆓 100% Free</Badge>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Upload Section */}
        <section className="py-8 px-4">
          <div className="container mx-auto max-w-4xl">
            {!results ? (
              <Card>
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center gap-2">
                    <Upload className="h-6 w-6 text-primary" />
                    Upload Your Resume
                  </CardTitle>
                  <CardDescription>
                    Upload your resume in PDF, DOC, or DOCX format for instant ATS analysis
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* File Upload Area */}
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="resume-upload"
                    />
                    <label htmlFor="resume-upload" className="cursor-pointer">
                      <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-lg font-medium mb-2">
                        {file ? file.name : "Click to upload or drag and drop"}
                      </p>
                      <p className="text-muted-foreground">
                        PDF, DOC, or DOCX (max 10MB)
                      </p>
                    </label>
                  </div>

                  {/* Analyze Button */}
                  {file && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center"
                    >
                      <Button 
                        onClick={analyzeResume} 
                        disabled={analyzing}
                        size="lg"
                        className="w-full md:w-auto px-8"
                      >
                        {analyzing ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Analyzing Resume...
                          </>
                        ) : (
                          <>
                            <Zap className="h-4 w-4 mr-2" />
                            Analyze My Resume
                          </>
                        )}
                      </Button>
                    </motion.div>
                  )}

                  {/* What We Check */}
                  <Card className="bg-muted/30">
                    <CardHeader>
                      <CardTitle className="text-lg">What We Check</CardTitle>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">File format compatibility</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Section organization</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Contact information</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Keyword optimization</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Formatting issues</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Length and structure</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">ATS-friendly elements</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Readability score</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            ) : (
              /* Results Section */
              <div className="space-y-6">
                {/* Score Overview */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Card>
                    <CardHeader className="text-center">
                      <CardTitle>Your ATS Score</CardTitle>
                      <CardDescription>
                        Based on ATS compatibility and best practices
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center space-y-4">
                      <div className={`text-6xl font-bold ${getScoreColor(results.score)}`}>
                        {results.score}
                        <span className="text-2xl text-muted-foreground">/100</span>
                      </div>
                      <Progress value={results.score} className="max-w-md mx-auto" />
                      <div className="flex justify-center">
                        {results.score >= 80 ? (
                          <Badge variant="default" className="bg-green-500">Excellent</Badge>
                        ) : results.score >= 60 ? (
                          <Badge variant="secondary" className="bg-yellow-500 text-white">Good</Badge>
                        ) : (
                          <Badge variant="destructive">Needs Improvement</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Issues and Suggestions */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-yellow-500" />
                        Issues Found
                      </CardTitle>
                      <CardDescription>
                        Areas that need improvement for better ATS compatibility
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {results.issues.map((issue, index) => (
                        <div key={index} className="border-l-4 border-l-primary pl-4 space-y-1">
                          <div className="flex items-start gap-2">
                            {getIssueIcon(issue.type)}
                            <div className="flex-1">
                              <div className="font-medium">{issue.title}</div>
                              <div className="text-sm text-muted-foreground">{issue.description}</div>
                              <div className="text-sm text-primary font-medium mt-1">
                                💡 {issue.fix}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        Strengths
                      </CardTitle>
                      <CardDescription>
                        Things your resume does well
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {results.strengths.map((strength, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm">{strength}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                {/* Keywords Analysis */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      Keywords Analysis
                    </CardTitle>
                    <CardDescription>
                      Keywords found and suggested improvements
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-3 text-green-600">✅ Keywords Found</h4>
                      <div className="flex flex-wrap gap-2">
                        {results.keywords.found.map((keyword) => (
                          <Badge key={keyword} variant="secondary" className="bg-green-100 text-green-700">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-3 text-red-600">❌ Suggested Keywords to Add</h4>
                      <div className="flex flex-wrap gap-2">
                        {results.keywords.missing.map((keyword) => (
                          <Badge key={keyword} variant="outline" className="border-red-200 text-red-600">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button onClick={() => setResults(null)} variant="outline">
                    Analyze Another Resume
                  </Button>
                  <Button asChild>
                    <a href="/resume-builder">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Improve with Resume Builder
                    </a>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}