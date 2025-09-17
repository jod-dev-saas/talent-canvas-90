// CHANGED_BY: Claude - backend finish (2025-09-15)
// Complete candidate profile CRUD API endpoints with Supabase integration

import { Router } from 'express';
import { z } from 'zod';
import { requireAuth, AuthRequest } from '../../middleware/auth.ts';
import { supabaseService } from '../../lib/supabaseClient.ts';

const router = Router();

// Profile validation schema
const CandidateProfileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  role: z.string().min(1, "Role is required"),
  custom_role: z.string().optional(),
  bio: z.string().optional(),
  job_seeking_type: z.enum(['Internship', 'Part-time', 'Full-time', 'Freelance']),
  job_preference: z.enum(['Remote', 'On-site', 'Hybrid', 'Any']),
  expected_salary: z.string().optional(),
  preferred_locations: z.array(z.string()).min(1, "At least one location is required"),
  notice_period: z.enum(['Immediate', '15 days', '1 month', '2 months', '3 months', 'Negotiable']),
  linkedin: z.string().url().optional().or(z.literal('')),
  github: z.string().url().optional().or(z.literal('')),
  portfolio: z.string().url().optional().or(z.literal('')),
  open_to_relocate: z.union([z.boolean(), z.literal('maybe')]).optional(),
  education: z.string().optional(),
  custom_education: z.string().optional(),
  graduation_year: z.string().optional(),
  additional_notes: z.string().optional(),
  skills: z.array(z.string()).optional(),
  projects: z.array(z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    url: z.string().url().optional().or(z.literal('')),
    technologies: z.array(z.string()).optional()
  })).optional(),
  visibility: z.enum(['public', 'private']).optional().default('public')
});

/**
 * GET /api/candidate/profile
 * Get authenticated user's profile
 */
router.get('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { data: profile, error } = await supabaseService
      .from('candidates')
      .select(`
        *,
        candidate_skills (skill),
        candidate_projects (id, title, description, url, technologies, display_order),
        candidate_files (id, file_type, file_name, file_url, created_at)
      `)
      .eq('user_id', req.user.id)
      .single();

    if (error && error.code === 'PGRST116') {
      // No profile found
      return res.status(404).json({ 
        error: 'Profile not found. Please create your profile first.' 
      });
    }

    if (error) throw error;

    // Transform the data structure
    const transformedProfile = {
      ...profile,
      skills: profile.candidate_skills?.map((s: any) => s.skill) || [],
      projects: profile.candidate_projects || [],
      files: profile.candidate_files || []
    };

    // Remove nested arrays
    delete transformedProfile.candidate_skills;
    delete transformedProfile.candidate_projects;  
    delete transformedProfile.candidate_files;

    res.json({ profile: transformedProfile });
  } catch (error: any) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

/**
 * POST /api/candidate/profile  
 * Create new candidate profile
 */
router.post('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    // Check if profile already exists
    const { data: existingProfile } = await supabaseService
      .from('candidates')
      .select('id')
      .eq('user_id', req.user.id)
      .single();

    if (existingProfile) {
      return res.status(409).json({ error: 'Profile already exists. Use PUT to update.' });
    }

    // Validate request body
    const validationResult = CandidateProfileSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: validationResult.error.issues 
      });
    }

    const { skills = [], projects = [], ...profileData } = validationResult.data;

    // Create main profile record
    const { data: profile, error: profileError } = await supabaseService
      .from('candidates')
      .insert({
        ...profileData,
        user_id: req.user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (profileError) throw profileError;

    // Add skills if provided
    if (skills.length > 0) {
      const skillsData = skills.map((skill: string) => ({
        candidate_id: profile.id,
        skill: skill.trim()
      }));

      const { error: skillsError } = await supabaseService
        .from('candidate_skills')
        .insert(skillsData);

      if (skillsError) {
        console.error('Error adding skills:', skillsError);
      }
    }

    // Add projects if provided
    if (projects.length > 0) {
      const projectsData = projects.map((project: any, index: number) => ({
        candidate_id: profile.id,
        title: project.title,
        description: project.description || '',
        url: project.url || '',
        technologies: project.technologies || [],
        display_order: index
      }));

      const { error: projectsError } = await supabaseService
        .from('candidate_projects')
        .insert(projectsData);

      if (projectsError) {
        console.error('Error adding projects:', projectsError);
      }
    }

    // Return complete profile
    const { data: completeProfile } = await supabaseService
      .from('candidates')
      .select(`
        *,
        candidate_skills (skill),
        candidate_projects (id, title, description, url, technologies, display_order),
        candidate_files (id, file_type, file_name, file_url, created_at)
      `)
      .eq('id', profile.id)
      .single();

    const transformedProfile = {
      ...completeProfile,
      skills: completeProfile?.candidate_skills?.map((s: any) => s.skill) || [],
      projects: completeProfile?.candidate_projects || [],
      files: completeProfile?.candidate_files || []
    };

    delete transformedProfile.candidate_skills;
    delete transformedProfile.candidate_projects;
    delete transformedProfile.candidate_files;

    res.status(201).json({ 
      profile: transformedProfile,
      message: 'Profile created successfully'
    });

  } catch (error: any) {
    console.error('Create profile error:', error);
    res.status(500).json({ error: 'Failed to create profile' });
  }
});

/**
 * PUT /api/candidate/profile
 * Update candidate profile
 */
router.put('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    // Get existing profile
    const { data: existingProfile, error: fetchError } = await supabaseService
      .from('candidates')
      .select('id, user_id')
      .eq('user_id', req.user.id)
      .single();

    if (fetchError && fetchError.code === 'PGRST116') {
      return res.status(404).json({ 
        error: 'Profile not found. Create a profile first.' 
      });
    }

    if (fetchError) throw fetchError;

    // Validate request body
    const validationResult = CandidateProfileSchema.partial().safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: validationResult.error.issues 
      });
    }

    const { skills, projects, ...profileData } = validationResult.data;

    // Update main profile
    const { data: updatedProfile, error: updateError } = await supabaseService
      .from('candidates')
      .update({
        ...profileData,
        updated_at: new Date().toISOString()
      })
      .eq('id', existingProfile.id)
      .select()
      .single();

    if (updateError) throw updateError;

    // Update skills if provided
    if (skills !== undefined) {
      // Delete existing skills
      await supabaseService
        .from('candidate_skills')
        .delete()
        .eq('candidate_id', existingProfile.id);

      // Add new skills
      if (skills.length > 0) {
        const skillsData = skills.map((skill: string) => ({
          candidate_id: existingProfile.id,
          skill: skill.trim()
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
        .eq('candidate_id', existingProfile.id);

      // Add new projects
      if (projects.length > 0) {
        const projectsData = projects.map((project: any, index: number) => ({
          candidate_id: existingProfile.id,
          title: project.title,
          description: project.description || '',
          url: project.url || '',
          technologies: project.technologies || [],
          display_order: index
        }));

        await supabaseService
          .from('candidate_projects')
          .insert(projectsData);
      }
    }

    // Return updated profile
    const { data: completeProfile } = await supabaseService
      .from('candidates')
      .select(`
        *,
        candidate_skills (skill),
        candidate_projects (id, title, description, url, technologies, display_order),
        candidate_files (id, file_type, file_name, file_url, created_at)
      `)
      .eq('id', existingProfile.id)
      .single();

    const transformedProfile = {
      ...completeProfile,
      skills: completeProfile?.candidate_skills?.map((s: any) => s.skill) || [],
      projects: completeProfile?.candidate_projects || [],
      files: completeProfile?.candidate_files || []
    };

    delete transformedProfile.candidate_skills;
    delete transformedProfile.candidate_projects;
    delete transformedProfile.candidate_files;

    res.json({ 
      profile: transformedProfile,
      message: 'Profile updated successfully'
    });

  } catch (error: any) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

/**
 * DELETE /api/candidate/profile
 * Soft delete candidate profile
 */
router.delete('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    // Get existing profile
    const { data: existingProfile, error: fetchError } = await supabaseService
      .from('candidates')
      .select('id, user_id')
      .eq('user_id', req.user.id)
      .single();

    if (fetchError && fetchError.code === 'PGRST116') {
      return res.status(404).json({ 
        error: 'Profile not found.' 
      });
    }

    if (fetchError) throw fetchError;

    // Soft delete by setting visibility to private and adding deleted flag
    const { error: deleteError } = await supabaseService
      .from('candidates')
      .update({
        visibility: 'private',
        is_deleted: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', existingProfile.id);

    if (deleteError) throw deleteError;

    res.json({ message: 'Profile deleted successfully' });

  } catch (error: any) {
    console.error('Delete profile error:', error);
    res.status(500).json({ error: 'Failed to delete profile' });
  }
});

export default router;