// CHANGED_BY: Claude - backend finish (2025-09-15)
// Resume download and generation endpoints with auth gating

import { Router } from 'express';
import { requireAuth, optionalAuth, AuthRequest } from '../../middleware/auth.ts';
import { supabaseService } from '../../lib/supabaseClient.ts';

const router = Router();

/**
 * GET /api/candidate/resume/download
 * Download resume (requires authentication)
 * This is the gating endpoint that forces sign-up for resume downloads
 */
router.get('/download', optionalAuth, async (req: AuthRequest, res) => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'Please sign up or sign in to download your resume',
        redirect: '/candidate/auth/signin',
        action: 'download_resume'
      });
    }

    // Get candidate profile and resume files
    const { data: candidate, error: candidateError } = await supabaseService
      .from('candidates')
      .select(`
        id,
        name,
        candidate_files (
          id,
          file_type,
          file_name,
          file_size,
          file_url,
          storage_path,
          created_at
        )
      `)
      .eq('user_id', req.user.id)
      .single();

    if (candidateError && candidateError.code === 'PGRST116') {
      return res.status(404).json({
        error: 'Profile not found',
        message: 'Please create your candidate profile first',
        redirect: '/candidate'
      });
    }

    if (candidateError) throw candidateError;

    // Find the most recent resume file
    const resumeFiles = candidate.candidate_files?.filter(
      (file: any) => file.file_type === 'resume'
    ) || [];

    if (resumeFiles.length === 0) {
      return res.status(404).json({
        error: 'No resume found',
        message: 'Please upload your resume first',
        redirect: '/candidate'
      });
    }

    // Get the most recent resume
    const latestResume = resumeFiles.sort(
      (a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )[0];

    // If the resume URL is a signed URL that might be expired, regenerate it
    if (latestResume.storage_path) {
      const { data: signedUrlData, error: urlError } = await supabaseService.storage
        .from('resumes')
        .createSignedUrl(latestResume.storage_path, 60 * 60); // 1 hour expiry

      if (urlError) {
        console.error('Error creating signed URL:', urlError);
        return res.status(500).json({
          error: 'Failed to generate download link',
          message: 'Please try again later'
        });
      }

      // Log the download
      console.log(`Resume download by user ${req.user.id}: ${latestResume.file_name}`);

      // Return the signed URL for download
      return res.json({
        downloadUrl: signedUrlData.signedUrl,
        fileName: latestResume.file_name,
        fileSize: latestResume.file_size ?? null,
        message: 'Resume ready for download'
      });
    }

    // If no storage path, use the existing file URL
    res.json({
      downloadUrl: latestResume.file_url,
      fileName: latestResume.file_name,
      message: 'Resume ready for download'
    });

  } catch (error: any) {
    console.error('Resume download error:', error);
    res.status(500).json({
      error: 'Download failed',
      message: 'Unable to process download request',
      details: error.message
    });
  }
});

/**
 * GET /api/candidate/resume/download/:fileId
 * Download specific resume file by ID
 */
router.get('/download/:fileId', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { fileId } = req.params;

    // Get file record and verify ownership
    const { data: fileRecord, error: fetchError } = await supabaseService
      .from('candidate_files')
      .select(`
        *,
        candidates!inner(user_id, name)
      `)
      .eq('id', fileId)
      .eq('file_type', 'resume')
      .eq('candidates.user_id', req.user.id)
      .single();

    if (fetchError && fetchError.code === 'PGRST116') {
      return res.status(404).json({
        error: 'Resume not found or not authorized',
        message: 'The requested resume file was not found or you do not have access to it'
      });
    }

    if (fetchError) throw fetchError;

    // Generate fresh signed URL if we have storage path
    if (fileRecord.storage_path) {
      const { data: signedUrlData, error: urlError } = await supabaseService.storage
        .from('resumes')
        .createSignedUrl(fileRecord.storage_path, 60 * 60); // 1 hour expiry

      if (urlError) {
        console.error('Error creating signed URL:', urlError);
        return res.status(500).json({
          error: 'Failed to generate download link',
          message: 'Please try again later'
        });
      }

      return res.json({
        downloadUrl: signedUrlData.signedUrl,
        fileName: fileRecord.file_name,
        fileSize: fileRecord.file_size,
        message: 'Resume ready for download'
      });
    }

    // Use existing file URL
    res.json({
      downloadUrl: fileRecord.file_url,
      fileName: fileRecord.file_name,
      fileSize: fileRecord.file_size,
      message: 'Resume ready for download'
    });

  } catch (error: any) {
    console.error('Specific resume download error:', error);
    res.status(500).json({
      error: 'Download failed',
      message: 'Unable to process download request',
      details: error.message
    });
  }
});

/**
 * POST /api/candidate/resume/generate
 * Generate resume from profile data (future enhancement)
 */
router.post('/generate', requireAuth, async (req: AuthRequest, res) => {
  try {
    // Get candidate profile with all data
    const { data: candidate, error: candidateError } = await supabaseService
      .from('candidates')
      .select(`
        *,
        candidate_skills (skill),
        candidate_projects (title, description, url, technologies),
        candidate_files (*)
      `)
      .eq('user_id', req.user.id)
      .single();

    if (candidateError && candidateError.code === 'PGRST116') {
      return res.status(404).json({
        error: 'Profile not found',
        message: 'Please create your candidate profile first',
        redirect: '/candidate'
      });
    }

    if (candidateError) throw candidateError;

    // This is a placeholder for future PDF generation functionality
    // You would integrate with a PDF generation library like puppeteer, jsPDF, or a service like DocuSign
    
    const resumeData = {
      candidate: {
        name: candidate.name,
        email: candidate.email,
        role: candidate.role,
        bio: candidate.bio,
        linkedin: candidate.linkedin,
        github: candidate.github,
        portfolio: candidate.portfolio,
        phone: candidate.phone,
        location: candidate.preferred_locations?.[0] || ''
      },
      skills: candidate.candidate_skills?.map((s: any) => s.skill) || [],
      projects: candidate.candidate_projects || [],
      education: {
        degree: candidate.education,
        customDegree: candidate.custom_education,
        graduationYear: candidate.graduation_year
      },
      preferences: {
        jobType: candidate.job_preference,
        expectedSalary: candidate.expected_salary,
        noticePeriod: candidate.notice_period
      }
    };

    // TODO: Implement PDF generation here
    // const pdfBuffer = await generateResumePDF(resumeData);
    // Upload generated PDF to Supabase Storage
    // Return download link

    res.json({
      message: 'Resume generation feature coming soon',
      data: resumeData,
      notice: 'This endpoint will generate a PDF resume from your profile data in a future update'
    });

  } catch (error: any) {
    console.error('Resume generation error:', error);
    res.status(500).json({
      error: 'Generation failed',
      message: 'Unable to generate resume',
      details: error.message
    });
  }
});

/**
 * GET /api/candidate/resume/preview
 * Get resume data for preview (no download, just data)
 */
router.get('/preview', optionalAuth, async (req: AuthRequest, res) => {
  try {
    // Allow preview without authentication for resume builder page
    if (!req.user) {
      return res.json({
        message: 'Sign in to preview your saved resume data',
        previewAvailable: false
      });
    }

    // Get candidate profile for preview
    const { data: candidate, error: candidateError } = await supabaseService
      .from('candidates')
      .select(`
        name,
        email,
        role,
        custom_role,
        bio,
        linkedin,
        github,
        portfolio,
        education,
        custom_education,
        graduation_year,
        job_preference,
        expected_salary,
        notice_period,
        preferred_locations,
        candidate_skills (skill),
        candidate_projects (title, description, url, technologies)
      `)
      .eq('user_id', req.user.id)
      .single();

    if (candidateError && candidateError.code === 'PGRST116') {
      return res.json({
        message: 'No profile found. Create your profile to see preview.',
        previewAvailable: false
      });
    }

    if (candidateError) throw candidateError;

    const previewData = {
      previewAvailable: true,
      candidate: {
        name: candidate.name,
        email: candidate.email,
        role: candidate.custom_role || candidate.role,
        bio: candidate.bio,
        linkedin: candidate.linkedin,
        github: candidate.github,
        portfolio: candidate.portfolio,
        location: candidate.preferred_locations?.[0] || ''
      },
      skills: candidate.candidate_skills?.map((s: any) => s.skill) || [],
      projects: candidate.candidate_projects?.map((p: any) => ({
        title: p.title,
        description: p.description,
        url: p.url,
        technologies: p.technologies || []
      })) || [],
      education: {
        degree: candidate.custom_education || candidate.education,
        graduationYear: candidate.graduation_year
      },
      preferences: {
        jobType: candidate.job_preference,
        expectedSalary: candidate.expected_salary,
        noticePeriod: candidate.notice_period,
        preferredLocations: candidate.preferred_locations || []
      }
    };

    res.json(previewData);

  } catch (error: any) {
    console.error('Resume preview error:', error);
    res.status(500).json({
      error: 'Preview failed',
      message: 'Unable to load resume preview',
      previewAvailable: false
    });
  }
});

/**
 * GET /api/candidate/resume/files
 * List all resume files for authenticated user
 */
router.get('/files', requireAuth, async (req: AuthRequest, res) => {
  try {
    // Get candidate profile
    const { data: candidate, error: candidateError } = await supabaseService
      .from('candidates')
      .select('id')
      .eq('user_id', req.user.id)
      .single();

    if (candidateError && candidateError.code === 'PGRST116') {
      return res.status(404).json({
        error: 'Profile not found',
        message: 'Please create your candidate profile first'
      });
    }

    if (candidateError) throw candidateError;

    // Get all resume files
    const { data: files, error: filesError } = await supabaseService
      .from('candidate_files')
      .select('id, file_name, file_size, mime_type, created_at')
      .eq('candidate_id', candidate.id)
      .eq('file_type', 'resume')
      .order('created_at', { ascending: false });

    if (filesError) throw filesError;

    res.json({
      files: files || [],
      count: files?.length || 0
    });

  } catch (error: any) {
    console.error('List resume files error:', error);
    res.status(500).json({
      error: 'Failed to fetch resume files',
      details: error.message
    });
  }
});

export default router;