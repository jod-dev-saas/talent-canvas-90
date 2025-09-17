import { Router } from 'express';
 import { requireAuth, optionalAuth, AuthRequest } from '../../middleware/auth.ts';
import { supabaseService, getSupabaseClient } from '../../lib/supabaseClient.ts';
import { uploadAvatar, uploadImage, deleteImage } from '../../lib/cloudinary.ts';
import multer from 'multer';
import { 
  Candidate, 
  CandidateWithDetails, 
  CandidateSearchParams, 
  CandidateSearchResult 
} from '../../models/candidate.ts';

const router = Router();
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

/**
 * GET /api/candidate
 * List candidates with filters and pagination
 * Query params: ?page=1&limit=10&skills=React,Node&location=Mumbai&jobType=Remote
 */
router.get('/', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      skills, 
      location, 
      jobType,
      keywords 
    } = req.query;
    
    const offset = (Number(page) - 1) * Number(limit);
    
    let query = supabaseService
      .from('candidates')
      .select(`
        *,
        candidate_skills (skill),
        candidate_projects (*)
      `)
      .eq('visibility', 'public')
      .range(offset, offset + Number(limit) - 1);

    // Apply filters
    if (location) {
      query = query.contains('preferred_locations', [location as string]);
    }
    
    if (jobType) {
      query = query.eq('job_preference', jobType);
    }

    if (keywords) {
      query = query.textSearch('search_vector', keywords as string);
    }

    const { data, error, count } = await query;
    
    if (error) throw error;

    // Filter by skills if provided
    let results = data;
    if (skills) {
      const skillArray = (skills as string).split(',');
      results = data?.filter(candidate => {
        const candidateSkills = candidate.candidate_skills.map((s: any) => s.skill);
        return skillArray.some(skill => candidateSkills.includes(skill));
      });
    }

    res.json({
      candidates: results,
      total: count || 0,
      page: Number(page),
      limit: Number(limit)
    });
  } catch (error) {
    console.error('List candidates error:', error);
    res.status(500).json({ error: 'Failed to fetch candidates' });
  }
});

/**
 * POST /api/candidate
 * Create new candidate profile
 * Body: Candidate object
 */
router.post('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const candidateData = {
      ...req.body,
      user_id: req.user.id
    };

    // Extract skills and projects
    const { skills = [], projects = [], ...mainData } = candidateData;

    // Create candidate
    const { data: candidate, error } = await supabaseService
      .from('candidates')
      .insert(mainData)
      .select()
      .single();

    if (error) throw error;

    // Add skills
    if (skills.length > 0) {
      const skillsData = skills.map((skill: string) => ({
        candidate_id: candidate.id,
        skill
      }));
      
      await supabaseService
        .from('candidate_skills')
        .insert(skillsData);
    }

    // Add projects
    if (projects.length > 0) {
      const projectsData = projects.map((project: any, index: number) => ({
        candidate_id: candidate.id,
        ...project,
        display_order: index
      }));
      
      await supabaseService
        .from('candidate_projects')
        .insert(projectsData);
    }

    res.status(201).json(candidate);
  } catch (error) {
    console.error('Create candidate error:', error);
    res.status(500).json({ error: 'Failed to create candidate profile' });
  }
});

/**
 * GET /api/candidate/me
 * Get current user's candidate profile
 * Creates one if it doesn't exist
 */
router.get('/me', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { data: candidate, error } = await supabaseService
      .from('candidates')
      .select(`
        *,
        candidate_skills (skill),
        candidate_projects (*),
        candidate_files (*)
      `)
      .eq('user_id', req.user.id)
      .single();

    if (error && error.code === 'PGRST116') {
      // No profile exists, create one
      const newCandidate = {
        user_id: req.user.id,
        name: req.user.user_metadata?.full_name || '',
        email: req.user.email || '',
        role: '',
        job_seeking_type: 'Full-time',
        job_preference: 'Any',
        preferred_locations: [],
        notice_period: 'Immediate'
      };

      const { data: created, error: createError } = await supabaseService
        .from('candidates')
        .insert(newCandidate)
        .select()
        .single();

      if (createError) throw createError;
      
      return res.json({
        ...created,
        candidate_skills: [],
        candidate_projects: [],
        candidate_files: []
      });
    }

    if (error) throw error;
    res.json(candidate);
  } catch (error) {
    console.error('Get candidate profile error:', error);
    res.status(500).json({ error: 'Failed to fetch candidate profile' });
  }
});

/**
 * GET /api/candidate/:id
 * Get specific candidate profile
 */
router.get('/:id', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    
    const { data: candidate, error } = await supabaseService
      .from('candidates')
      .select(`
        *,
        candidate_skills (skill),
        candidate_projects (*),
        candidate_files (*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    // Check visibility
    if (candidate.visibility === 'private' && 
        (!req.user || req.user.id !== candidate.user_id)) {
      return res.status(403).json({ error: 'Profile is private' });
    }

    // Don't return files for other users
    if (!req.user || req.user.id !== candidate.user_id) {
      delete candidate.candidate_files;
    }

    res.json(candidate);
  } catch (error) {
    console.error('Get candidate error:', error);
    res.status(500).json({ error: 'Failed to fetch candidate' });
  }
});

/**
 * PUT /api/candidate/:id
 * Update candidate profile (owner only)
 */
router.put('/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check ownership
    const { data: existing } = await supabaseService
      .from('candidates')
      .select('user_id')
      .eq('id', id)
      .single();

    if (!existing || existing.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Extract skills and projects
    const { skills, projects, ...mainData } = updateData;

    // Update main data
    const { data: updated, error } = await supabaseService
      .from('candidates')
      .update(mainData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Update skills if provided
    if (skills !== undefined) {
      // Delete existing skills
      await supabaseService
        .from('candidate_skills')
        .delete()
        .eq('candidate_id', id);

      // Add new skills
      if (skills.length > 0) {
        const skillsData = skills.map((skill: string) => ({
          candidate_id: id,
          skill
        }));
        
        await supabaseService
          .from('candidate_skills')
          .insert(skillsData);
      }
    }

    // Update projects if provided
    if (projects !== undefined) {
      // Delete existing projects
      await supabaseService
        .from('candidate_projects')
        .delete()
        .eq('candidate_id', id);

      // Add new projects
      if (projects.length > 0) {
        const projectsData = projects.map((project: any, index: number) => ({
          candidate_id: id,
          ...project,
          display_order: index
        }));
        
        await supabaseService
          .from('candidate_projects')
          .insert(projectsData);
      }
    }

    res.json(updated);
  } catch (error) {
    console.error('Update candidate error:', error);
    res.status(500).json({ error: 'Failed to update candidate' });
  }
});

/**
 * DELETE /api/candidate/:id
 * Delete candidate profile (admin only)
 */
router.delete('/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    // Check if user is admin (you'd implement your admin check here)
    const isAdmin = req.user.user_metadata?.role === 'admin';
    
    if (!isAdmin) {
      // Check if user owns the profile
      const { data: existing } = await supabaseService
        .from('candidates')
        .select('user_id')
        .eq('id', id)
        .single();

      if (!existing || existing.user_id !== req.user.id) {
        return res.status(403).json({ error: 'Not authorized' });
      }
    }

    const { error } = await supabaseService
      .from('candidates')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ message: 'Candidate deleted successfully' });
  } catch (error) {
    console.error('Delete candidate error:', error);
    res.status(500).json({ error: 'Failed to delete candidate' });
  }
});

/**
 * POST /api/candidate/:id/resume
 * Upload resume file
 */
router.post('/:id/resume', requireAuth, upload.single('resume'), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    // Validate file type
    const allowedMimeTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      return res.status(400).json({ error: 'Invalid file type. Only PDF, DOC, DOCX allowed' });
    }

    // Check ownership
    const { data: candidate } = await supabaseService
      .from('candidates')
      .select('user_id')
      .eq('id', id)
      .single();

    if (!candidate || candidate.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Upload to Supabase Storage
    const fileName = `${id}/${Date.now()}_${file.originalname}`;
    const { data: uploadData, error: uploadError } = await supabaseService
      .storage
      .from('resumes')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabaseService
      .storage
      .from('resumes')
      .getPublicUrl(fileName);

    // Save file record
    const { data: fileRecord, error: dbError } = await supabaseService
      .from('candidate_files')
      .insert({
        candidate_id: id,
        file_type: 'resume',
        file_name: file.originalname,
        file_url: publicUrl,
        file_size: file.size,
        mime_type: file.mimetype,
        storage_path: fileName
      })
      .select()
      .single();

    if (dbError) throw dbError;

    res.json({
      file: fileRecord,
      url: publicUrl
    });
  } catch (error) {
    console.error('Upload resume error:', error);
    res.status(500).json({ error: 'Failed to upload resume' });
  }
});

/**
 * POST /api/candidate/:id/avatar
 * Upload avatar image
 */
router.post('/:id/avatar', requireAuth, upload.single('avatar'), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    // Check ownership
    const { data: candidate } = await supabaseService
      .from('candidates')
      .select('user_id, avatar_cloudinary_id')
      .eq('id', id)
      .single();

    if (!candidate || candidate.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Delete old avatar if exists
    if (candidate.avatar_cloudinary_id) {
      await deleteImage(candidate.avatar_cloudinary_id);
    }

    // Upload to Cloudinary
    const uploadResult = await uploadAvatar(file.buffer, id);

    // Update candidate profile
    const { error: updateError } = await supabaseService
      .from('candidates')
      .update({
        avatar_url: uploadResult.secure_url,
        avatar_cloudinary_id: uploadResult.public_id
      })
      .eq('id', id);

    if (updateError) throw updateError;

    res.json({
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id
    });
  } catch (error) {
    console.error('Upload avatar error:', error);
    res.status(500).json({ error: 'Failed to upload avatar' });
  }
});

/**
 * POST /api/candidate/:id/project
 * Add project with optional image
 */
router.post('/:id/project', requireAuth, upload.single('image'), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const projectData = req.body;
    const file = req.file;

    // Check ownership
    const { data: candidate } = await supabaseService
      .from('candidates')
      .select('user_id')
      .eq('id', id)
      .single();

    if (!candidate || candidate.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Upload image if provided
    let imageData = {};
    if (file) {
      const uploadResult = await uploadImage(
        file.buffer,
        `candidates/${id}/projects`,
        `project_${id}_${Date.now()}`
      );
      
      imageData = {
        image_url: uploadResult.secure_url,
        image_cloudinary_id: uploadResult.public_id
      };
    }

    // Create project
    const { data: project, error } = await supabaseService
      .from('candidate_projects')
      .insert({
        candidate_id: id,
        ...projectData,
        ...imageData
      })
      .select()
      .single();

    if (error) throw error;

    res.json(project);
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

/**
 * GET /api/candidate/:id/projects
 * List projects for a candidate
 */
router.get('/:id/projects', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: projects, error } = await supabaseService
      .from('candidate_projects')
      .select('*')
      .eq('candidate_id', id)
      .order('display_order', { ascending: true });

    if (error) throw error;

    res.json(projects);
  } catch (error) {
    console.error('List projects error:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

/**
 * POST /api/candidate/search
 * Advanced ATS search with scoring
 */
router.post('/search', async (req, res) => {
  try {
    const params: CandidateSearchParams = req.body;
    const {
      keywords,
      skills = [],
      role,
      location,
      salaryRange,
      jobType,
      page = 1,
      limit = 10
    } = params;

    // Build base query
    let query = supabaseService
      .from('candidates')
      .select(`
        *,
        candidate_skills (skill),
        candidate_projects (*),
        candidate_files (*)
      `)
      .eq('visibility', 'public');

    // Apply filters
    if (jobType) {
      query = query.eq('job_preference', jobType);
    }

    if (location) {
      query = query.contains('preferred_locations', [location]);
    }

    if (keywords) {
      query = query.textSearch('search_vector', keywords);
    }

    const { data: candidates, error } = await query;
    if (error) throw error;

    // Score and rank candidates
    const scoredResults: CandidateSearchResult[] = candidates?.map(candidate => {
      let score = 0;
      const explanation = {
        keywordsMatched: 0,
        skillsMatched: 0,
        locationMatch: false,
        jobTypeMatch: false,
        roleMatch: false
      };

      // Keyword matching in bio and role
      if (keywords) {
        const keywordList = keywords.toLowerCase().split(' ');
        const searchText = `${candidate.bio} ${candidate.role} ${candidate.custom_role}`.toLowerCase();
        
        keywordList.forEach(keyword => {
          if (searchText.includes(keyword)) {
            explanation.keywordsMatched++;
            score += 10;
          }
        });
      }

      // Skills matching
      const candidateSkills = candidate.candidate_skills.map((s: any) => s.skill.toLowerCase());
      skills.forEach(skill => {
        if (candidateSkills.includes(skill.toLowerCase())) {
          explanation.skillsMatched++;
          score += 15;
        }
      });

      // Location matching
      if (location && candidate.preferred_locations?.includes(location)) {
        explanation.locationMatch = true;
        score += 20;
      }

      // Job type matching
      if (jobType && candidate.job_preference === jobType) {
        explanation.jobTypeMatch = true;
        score += 15;
      }

      // Role matching
      if (role) {
        const candidateRole = `${candidate.role} ${candidate.custom_role}`.toLowerCase();
        if (candidateRole.includes(role.toLowerCase())) {
          explanation.roleMatch = true;
          score += 25;
        }
      }

      // Normalize score to 0-100
      score = Math.min(100, score);

      return {
        candidate,
        score,
        explanation
      };
    }) || [];

    // Sort by score
    scoredResults.sort((a, b) => b.score - a.score);

    // Paginate
    const offset = (page - 1) * limit;
    const paginatedResults = scoredResults.slice(offset, offset + limit);

    res.json({
      results: paginatedResults,
      total: scoredResults.length,
      page,
      limit
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

/**
 * POST /api/candidate/:id/visibility
 * Toggle candidate visibility (owner only)
 */
router.post('/:id/visibility', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { visibility } = req.body;

    if (!['public', 'private'].includes(visibility)) {
      return res.status(400).json({ error: 'Invalid visibility value' });
    }

    // Check ownership
    const { data: candidate } = await supabaseService
      .from('candidates')
      .select('user_id')
      .eq('id', id)
      .single();

    if (!candidate || candidate.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const { error } = await supabaseService
      .from('candidates')
      .update({ visibility })
      .eq('id', id);

    if (error) throw error;

    res.json({ message: 'Visibility updated', visibility });
  } catch (error) {
    console.error('Update visibility error:', error);
    res.status(500).json({ error: 'Failed to update visibility' });
  }
});

/**
 * GET /api/candidate/stats
 * Admin endpoint for statistics
 */
router.get('/stats', requireAuth, async (req: AuthRequest, res) => {
  try {
    // Check if user is admin
    const isAdmin = req.user.user_metadata?.role === 'admin';
    if (!isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { count: totalCandidates } = await supabaseService
      .from('candidates')
      .select('*', { count: 'exact', head: true });

    const { count: publicProfiles } = await supabaseService
      .from('candidates')
      .select('*', { count: 'exact', head: true })
      .eq('visibility', 'public');

    const { data: recentCandidates } = await supabaseService
      .from('candidates')
      .select('id, name, email, created_at')
      .order('created_at', { ascending: false })
      .limit(10);

    res.json({
      totalCandidates,
      publicProfiles,
      privateProfiles: (totalCandidates || 0) - (publicProfiles || 0),
      recentCandidates
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export default router;