// CHANGED_BY: Claude - backend finish (2025-09-15)
// ATS checker endpoint with simple keyword matching and scoring

import { Router } from 'express';
import { z } from 'zod';
import { requireAuth, AuthRequest } from '../../middleware/auth.ts';
import { supabaseService } from '../../lib/supabaseClient.ts';

const router = Router();

// ATS check request validation
const ATSCheckSchema = z.object({
  resumeText: z.string().min(10, "Resume text must be at least 10 characters"),
  jobDescription: z.string().min(10, "Job description must be at least 10 characters").optional(),
  targetRole: z.string().optional(),
  requiredSkills: z.array(z.string()).optional()
});

// Common tech skills for scoring
const TECH_SKILLS = [
  // Programming Languages
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'PHP', 'Ruby',
  'Swift', 'Kotlin', 'Scala', 'R', 'MATLAB', 'SQL', 'HTML', 'CSS', 'Dart',
  
  // Frameworks & Libraries
  'React', 'Angular', 'Vue.js', 'Node.js', 'Express', 'Next.js', 'Nuxt.js', 'Django', 'Flask',
  'Spring', 'Spring Boot', 'Laravel', 'Rails', 'ASP.NET', 'Flutter', 'React Native',
  
  // Databases
  'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite', 'Oracle', 'SQL Server', 'Cassandra',
  'DynamoDB', 'Firebase', 'Supabase',
  
  // Cloud & DevOps
  'AWS', 'Azure', 'Google Cloud', 'GCP', 'Docker', 'Kubernetes', 'Jenkins', 'GitLab CI',
  'GitHub Actions', 'Terraform', 'Ansible', 'Chef', 'Puppet',
  
  // Tools & Technologies
  'Git', 'Linux', 'Ubuntu', 'Nginx', 'Apache', 'Elasticsearch', 'Kafka', 'RabbitMQ',
  'GraphQL', 'REST API', 'Microservices', 'Serverless',
  
  // AI/ML
  'TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy', 'OpenCV', 'Keras',
  
  // Mobile
  'iOS', 'Android', 'Xamarin', 'Cordova', 'Ionic',
  
  // Blockchain
  'Ethereum', 'Solidity', 'Web3', 'Smart Contracts', 'Blockchain'
];

// Common soft skills and keywords
const SOFT_SKILLS = [
  'Leadership', 'Communication', 'Problem Solving', 'Team Work', 'Project Management',
  'Agile', 'Scrum', 'Collaboration', 'Critical Thinking', 'Analytical', 'Creative',
  'Adaptable', 'Detail-oriented', 'Time Management', 'Self-motivated'
];

// ATS-friendly keywords
const ATS_KEYWORDS = [
  'Bachelor', 'Master', 'PhD', 'Degree', 'Certification', 'Experience', 'Years',
  'Developed', 'Built', 'Created', 'Implemented', 'Designed', 'Led', 'Managed',
  'Improved', 'Optimized', 'Increased', 'Reduced', 'Achieved', 'Delivered'
];

/**
 * Extract skills from text using keyword matching
 */
function extractSkills(text: string, skillsList: string[]): string[] {
  const lowerText = text.toLowerCase();
  return skillsList.filter(skill => {
    const lowerSkill = skill.toLowerCase();
    // Check for exact word match (not substring)
    const regex = new RegExp(`\\b${lowerSkill}\\b`, 'i');
    return regex.test(lowerText);
  });
}

/**
 * Calculate ATS score based on various factors
 */
function calculateATSScore(resumeText: string, jobDescription?: string, targetRole?: string, requiredSkills?: string[]) {
  const analysis = {
    techSkillsFound: extractSkills(resumeText, TECH_SKILLS),
    softSkillsFound: extractSkills(resumeText, SOFT_SKILLS),
    atsKeywordsFound: extractSkills(resumeText, ATS_KEYWORDS),
    totalWords: resumeText.split(/\s+/).length,
    score: 0,
    breakdown: {
      skillsScore: 0,
      keywordsScore: 0,
      lengthScore: 0,
      formatScore: 0,
      jobMatchScore: 0
    },
    suggestions: [] as string[],
    matchedRequirements: [] as string[],
    missingRequirements: [] as string[]
  };

  // Skills Score (40% weight)
  const skillsScore = Math.min(
    100, 
    (analysis.techSkillsFound.length * 5) + (analysis.softSkillsFound.length * 2)
  );
  analysis.breakdown.skillsScore = skillsScore;

  // Keywords Score (25% weight)  
  const keywordsScore = Math.min(100, analysis.atsKeywordsFound.length * 8);
  analysis.breakdown.keywordsScore = keywordsScore;

  // Length Score (15% weight)
  let lengthScore = 0;
  if (analysis.totalWords >= 200 && analysis.totalWords <= 800) {
    lengthScore = 100;
  } else if (analysis.totalWords >= 100 && analysis.totalWords <= 1200) {
    lengthScore = 80;
  } else if (analysis.totalWords >= 50) {
    lengthScore = 60;
  } else {
    lengthScore = 30;
  }
  analysis.breakdown.lengthScore = lengthScore;

  // Format Score (10% weight) - Basic checks
  let formatScore = 50; // Base score
  if (resumeText.includes('@')) formatScore += 10; // Has email
  if (resumeText.match(/\d{4}/)) formatScore += 10; // Has year (likely dates)
  if (resumeText.match(/https?:\/\//)) formatScore += 10; // Has URLs
  if (resumeText.includes('\n')) formatScore += 20; // Has line breaks (structure)
  analysis.breakdown.formatScore = Math.min(100, formatScore);

  // Job Match Score (10% weight)
  let jobMatchScore = 50; // Default
  if (jobDescription) {
    const jobSkills = extractSkills(jobDescription, [...TECH_SKILLS, ...SOFT_SKILLS]);
    const resumeSkills = [...analysis.techSkillsFound, ...analysis.softSkillsFound];
    const matchingSkills = jobSkills.filter(skill => resumeSkills.includes(skill));
    
    if (jobSkills.length > 0) {
      jobMatchScore = (matchingSkills.length / jobSkills.length) * 100;
      analysis.matchedRequirements = matchingSkills;
      analysis.missingRequirements = jobSkills.filter(skill => !matchingSkills.includes(skill));
    }
  }

  if (requiredSkills && requiredSkills.length > 0) {
    const resumeSkills = [...analysis.techSkillsFound, ...analysis.softSkillsFound];
    const matchingRequired = requiredSkills.filter(skill => 
      resumeSkills.some(rSkill => rSkill.toLowerCase().includes(skill.toLowerCase()))
    );
    
    jobMatchScore = Math.max(jobMatchScore, (matchingRequired.length / requiredSkills.length) * 100);
    analysis.matchedRequirements = [...analysis.matchedRequirements, ...matchingRequired];
    analysis.missingRequirements = [...analysis.missingRequirements, 
      ...requiredSkills.filter(skill => !matchingRequired.includes(skill))
    ];
  }

  analysis.breakdown.jobMatchScore = jobMatchScore;

  // Calculate weighted final score
  analysis.score = Math.round(
    (skillsScore * 0.4) + 
    (keywordsScore * 0.25) + 
    (lengthScore * 0.15) + 
    (formatScore * 0.1) + 
    (jobMatchScore * 0.1)
  );

  // Generate suggestions
  if (analysis.techSkillsFound.length < 5) {
    analysis.suggestions.push("Add more technical skills to improve ATS visibility");
  }
  if (analysis.atsKeywordsFound.length < 8) {
    analysis.suggestions.push("Include more action verbs and achievement keywords");
  }
  if (analysis.totalWords < 200) {
    analysis.suggestions.push("Expand your resume content - it seems too brief");
  } else if (analysis.totalWords > 800) {
    analysis.suggestions.push("Consider condensing your resume - it might be too long");
  }
  if (analysis.softSkillsFound.length < 3) {
    analysis.suggestions.push("Include more soft skills and interpersonal abilities");
  }
  if (analysis.missingRequirements.length > 0) {
    analysis.suggestions.push(`Consider adding these skills if you have them: ${analysis.missingRequirements.slice(0, 3).join(', ')}`);
  }

  return analysis;
}

/**
 * POST /api/candidate/ats/check
 * Check resume against ATS scoring algorithm
 */
router.post('/check', requireAuth, async (req: AuthRequest, res) => {
  try {
    // Validate input
    const validationResult = ATSCheckSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validationResult.error.issues
      });
    }

    const { resumeText, jobDescription, targetRole, requiredSkills } = validationResult.data;

    console.log(`ATS check requested by user ${req.user.id}, text length: ${resumeText.length}`);

    // Run ATS analysis
    const analysis = calculateATSScore(resumeText, jobDescription, targetRole, requiredSkills);

    // Get user's profile for context
    const { data: candidate } = await supabaseService
      .from('candidates')
      .select('name, role, candidate_skills(skill)')
      .eq('user_id', req.user.id)
      .single();

    let profileContext = {};
    if (candidate) {
      const profileSkills = candidate.candidate_skills?.map((s: any) => s.skill) || [];
      const skillsInProfile = analysis.techSkillsFound.filter(skill => 
        profileSkills.some(pSkill => pSkill.toLowerCase().includes(skill.toLowerCase()))
      );
      
      profileContext = {
        candidateName: candidate.name,
        profileRole: candidate.role,
        profileSkills: profileSkills.length,
        skillsMatchingProfile: skillsInProfile.length
      };

      if (skillsInProfile.length !== profileSkills.length) {
        analysis.suggestions.push("Some skills from your profile are missing in this resume text");
      }
    }

    // Save ATS check record (optional - for analytics)
    try {
      await supabaseService
        .from('ats_checks')
        .insert({
          user_id: req.user.id,
          score: analysis.score,
          resume_word_count: analysis.totalWords,
          skills_found: analysis.techSkillsFound.length + analysis.softSkillsFound.length,
          created_at: new Date().toISOString()
        });
    } catch (logError) {
      console.warn('Failed to log ATS check:', logError);
    }

    res.json({
      score: analysis.score,
      grade: analysis.score >= 80 ? 'A' : analysis.score >= 70 ? 'B' : analysis.score >= 60 ? 'C' : analysis.score >= 50 ? 'D' : 'F',
      breakdown: analysis.breakdown,
      skillsFound: {
        technical: analysis.techSkillsFound,
        soft: analysis.softSkillsFound,
        total: analysis.techSkillsFound.length + analysis.softSkillsFound.length
      },
      keywordsFound: analysis.atsKeywordsFound,
      matchedRequirements: analysis.matchedRequirements,
      missingRequirements: analysis.missingRequirements,
      suggestions: analysis.suggestions,
      stats: {
        wordCount: analysis.totalWords,
        recommendedRange: "200-800 words"
      },
      profileContext,
      message: analysis.score >= 70 ? 
        "Great! Your resume is well-optimized for ATS systems." :
        analysis.score >= 50 ?
        "Good start! A few improvements could boost your ATS score." :
        "Your resume needs improvement to pass ATS filters effectively."
    });

  } catch (error: any) {
    console.error('ATS check error:', error);
    res.status(500).json({
      error: 'ATS check failed',
      message: 'Unable to analyze resume',
      details: error.message
    });
  }
});

/**
 * GET /api/candidate/ats/suggestions
 * Get general ATS improvement suggestions
 */
router.get('/suggestions', requireAuth, async (req: AuthRequest, res) => {
  try {
    // Get user's profile and role for targeted suggestions
    const { data: candidate } = await supabaseService
      .from('candidates')
      .select('role, custom_role, candidate_skills(skill)')
      .eq('user_id', req.user.id)
      .single();

    const role = candidate?.custom_role || candidate?.role || 'Software Developer';
    const profileSkills = candidate?.candidate_skills?.map((s: any) => s.skill) || [];

    // Role-specific skill suggestions
    const roleSuggestions: Record<string, string[]> = {
      'Software Developer': ['JavaScript', 'Python', 'React', 'Node.js', 'Git', 'SQL'],
      'Data Scientist': ['Python', 'R', 'SQL', 'TensorFlow', 'Pandas', 'Scikit-learn'],
      'DevOps Engineer': ['Docker', 'Kubernetes', 'AWS', 'Jenkins', 'Terraform', 'Linux'],
      'Machine Learning Engineer': ['Python', 'TensorFlow', 'PyTorch', 'Kubernetes', 'AWS', 'Docker'],
      'Full Stack Developer': ['JavaScript', 'React', 'Node.js', 'MongoDB', 'PostgreSQL', 'Docker'],
      'Backend Developer': ['Node.js', 'Python', 'Java', 'PostgreSQL', 'Redis', 'Docker'],
      'Frontend Developer': ['React', 'JavaScript', 'TypeScript', 'CSS', 'HTML', 'Vue.js']
    };

    const suggestedSkills = roleSuggestions[role] || roleSuggestions['Software Developer'];
    const missingSkills = suggestedSkills.filter(skill => 
      !profileSkills.some(pSkill => pSkill.toLowerCase().includes(skill.toLowerCase()))
    );

    const generalTips = [
      {
        category: "Keywords",
        tip: "Use action verbs like 'developed', 'implemented', 'optimized', 'led'",
        impact: "High"
      },
      {
        category: "Skills",
        tip: "Include both technical and soft skills relevant to your role",
        impact: "High"
      },
      {
        category: "Quantify",
        tip: "Add numbers and metrics (e.g., 'improved performance by 30%')",
        impact: "Medium"
      },
      {
        category: "Format",
        tip: "Use standard section headers: Experience, Education, Skills",
        impact: "Medium"
      },
      {
        category: "Length",
        tip: "Keep resume between 200-800 words for optimal ATS parsing",
        impact: "Medium"
      },
      {
        category: "File Format",
        tip: "Use PDF or DOCX format, avoid images and complex formatting",
        impact: "High"
      }
    ];

    res.json({
      generalTips,
      roleSpecific: {
        role,
        suggestedSkills,
        missingFromProfile: missingSkills,
        message: missingSkills.length > 0 ? 
          `Consider adding these ${role} skills if you have experience with them` :
          `Your profile has good coverage of ${role} skills`
      },
      atsKeywords: {
        technical: TECH_SKILLS.slice(0, 20),
        soft: SOFT_SKILLS.slice(0, 10),
        action: ATS_KEYWORDS.slice(0, 15)
      }
    });

  } catch (error: any) {
    console.error('ATS suggestions error:', error);
    res.status(500).json({
      error: 'Failed to get suggestions',
      details: error.message
    });
  }
});

/**
 * GET /api/candidate/ats/history
 * Get ATS check history for user
 */
router.get('/history', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { data: history, error } = await supabaseService
      .from('ats_checks')
      .select('score, resume_word_count, skills_found, created_at')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error && error.code !== 'PGRST116') throw error;

    const stats = history && history.length > 0 ? {
      averageScore: Math.round(history.reduce((acc, check) => acc + check.score, 0) / history.length),
      bestScore: Math.max(...history.map(check => check.score)),
      totalChecks: history.length,
      improvementTrend: history.length >= 2 ? 
        (history[0].score > history[1].score ? 'improving' : 
         history[0].score < history[1].score ? 'declining' : 'stable') : 'insufficient_data'
    } : null;

    res.json({
      history: history || [],
      stats,
      message: history && history.length > 0 ? 
        'Your ATS check history' : 
        'No ATS checks found. Run your first check!'
    });

  } catch (error: any) {
    console.error('ATS history error:', error);
    res.status(500).json({
      error: 'Failed to fetch ATS history',
      details: error.message
    });
  }
});

export default router;