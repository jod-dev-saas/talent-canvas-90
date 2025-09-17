// CHANGED_BY: Claude - backend finish (2025-09-15)
// File upload endpoints for resume and profile image with Supabase Storage + Cloudinary

import { Router } from 'express';
import multer from 'multer';
import { requireAuth, AuthRequest } from '../../middleware/auth.ts';
import { supabaseService } from '../../lib/supabaseClient.ts';
import { uploadAvatar, uploadImage, deleteImage } from '../../lib/cloudinary.ts';

const router = Router();

// Configure multer for file uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // For resume uploads
    if (file.fieldname === 'resume') {
      const allowedMimeTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Only PDF, DOC, DOCX files are allowed for resume'));
      }
    }
    // For image uploads
    else if (file.fieldname === 'image') {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed'));
      }
    } else {
      cb(new Error('Unexpected field'));
    }
  }
});

/**
 * POST /api/candidate/upload/resume
 * Upload resume file to Supabase Storage
 */
router.post('/resume', requireAuth, upload.single('resume'), async (req: AuthRequest, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    // Get user's candidate profile
    const { data: candidate, error: candidateError } = await supabaseService
      .from('candidates')
      .select('id')
      .eq('user_id', req.user.id)
      .single();

    if (candidateError && candidateError.code === 'PGRST116') {
      return res.status(404).json({ 
        error: 'Candidate profile not found. Create your profile first.' 
      });
    }

    if (candidateError) throw candidateError;

    // Generate unique filename
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${candidate.id}/${Date.now()}_resume.${fileExtension}`;

    console.log('Uploading resume to Supabase Storage:', { fileName, size: file.size });

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseService.storage
      .from('resumes')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      throw uploadError;
    }

    // Get signed URL (valid for 1 year)
    const { data: signedUrlData, error: urlError } = await supabaseService.storage
      .from('resumes')
      .createSignedUrl(fileName, 365 * 24 * 60 * 60); // 1 year

    if (urlError) {
      console.error('Error creating signed URL:', urlError);
      throw urlError;
    }

    // Save file record in database
    const { data: fileRecord, error: dbError } = await supabaseService
      .from('candidate_files')
      .insert({
        candidate_id: candidate.id,
        file_type: 'resume',
        file_name: file.originalname,
        file_url: signedUrlData.signedUrl,
        file_size: file.size,
        mime_type: file.mimetype,
        storage_path: fileName
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database insert error:', dbError);
      throw dbError;
    }

    console.log('Resume uploaded successfully:', fileRecord);

    res.json({
      url: signedUrlData.signedUrl,
      file: fileRecord,
      message: 'Resume uploaded successfully'
    });

  } catch (error: any) {
    console.error('Resume upload error:', error);
    res.status(500).json({ 
      error: 'Failed to upload resume', 
      details: error.message 
    });
  }
});

/**
 * POST /api/candidate/upload/image
 * Upload profile image to Cloudinary
 */
router.post('/image', requireAuth, upload.single('image'), async (req: AuthRequest, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Validate image type
    if (!file.mimetype.startsWith('image/')) {
      return res.status(400).json({ error: 'File must be an image' });
    }

    // Get user's candidate profile
    const { data: candidate, error: candidateError } = await supabaseService
      .from('candidates')
      .select('id, avatar_cloudinary_id')
      .eq('user_id', req.user.id)
      .single();

    if (candidateError && candidateError.code === 'PGRST116') {
      return res.status(404).json({ 
        error: 'Candidate profile not found. Create your profile first.' 
      });
    }

    if (candidateError) throw candidateError;

    console.log('Uploading image to Cloudinary for candidate:', candidate.id);

    // Delete old avatar if exists
    if (candidate.avatar_cloudinary_id) {
      try {
        await deleteImage(candidate.avatar_cloudinary_id);
        console.log('Old avatar deleted:', candidate.avatar_cloudinary_id);
      } catch (deleteError) {
        console.warn('Failed to delete old avatar:', deleteError);
      }
    }

    // Upload to Cloudinary
    const uploadResult = await uploadAvatar(file.buffer, candidate.id);

    console.log('Image uploaded to Cloudinary:', uploadResult);

    // Update candidate profile with new avatar URL
    const { error: updateError } = await supabaseService
      .from('candidates')
      .update({
        avatar_url: uploadResult.secure_url,
        avatar_cloudinary_id: uploadResult.public_id,
        updated_at: new Date().toISOString()
      })
      .eq('id', candidate.id);

    if (updateError) {
      console.error('Error updating profile with avatar:', updateError);
      throw updateError;
    }

    res.json({
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
      message: 'Profile image uploaded successfully'
    });

  } catch (error: any) {
    console.error('Image upload error:', error);
    res.status(500).json({ 
      error: 'Failed to upload image', 
      details: error.message 
    });
  }
});

/**
 * DELETE /api/candidate/upload/image
 * Delete profile image
 */
router.delete('/image', requireAuth, async (req: AuthRequest, res) => {
  try {
    // Get user's candidate profile
    const { data: candidate, error: candidateError } = await supabaseService
      .from('candidates')
      .select('id, avatar_cloudinary_id')
      .eq('user_id', req.user.id)
      .single();

    if (candidateError && candidateError.code === 'PGRST116') {
      return res.status(404).json({ 
        error: 'Candidate profile not found.' 
      });
    }

    if (candidateError) throw candidateError;

    if (!candidate.avatar_cloudinary_id) {
      return res.status(404).json({ error: 'No profile image to delete' });
    }

    // Delete from Cloudinary
    const deleteSuccess = await deleteImage(candidate.avatar_cloudinary_id);
    
    if (!deleteSuccess) {
      console.warn('Failed to delete image from Cloudinary:', candidate.avatar_cloudinary_id);
    }

    // Update candidate profile to remove avatar
    const { error: updateError } = await supabaseService
      .from('candidates')
      .update({
        avatar_url: null,
        avatar_cloudinary_id: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', candidate.id);

    if (updateError) throw updateError;

    res.json({ message: 'Profile image deleted successfully' });

  } catch (error: any) {
    console.error('Delete image error:', error);
    res.status(500).json({ 
      error: 'Failed to delete image', 
      details: error.message 
    });
  }
});

/**
 * DELETE /api/candidate/upload/resume/:fileId
 * Delete specific resume file
 */
router.delete('/resume/:fileId', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { fileId } = req.params;

    // Get file record and verify ownership
    const { data: fileRecord, error: fetchError } = await supabaseService
      .from('candidate_files')
      .select(`
        *,
        candidates!inner(user_id)
      `)
      .eq('id', fileId)
      .eq('candidates.user_id', req.user.id)
      .single();

    if (fetchError && fetchError.code === 'PGRST116') {
      return res.status(404).json({ error: 'File not found or not authorized' });
    }

    if (fetchError) throw fetchError;

    // Delete from Supabase Storage
    if (fileRecord.storage_path) {
      const { error: storageError } = await supabaseService.storage
        .from('resumes')
        .remove([fileRecord.storage_path]);

      if (storageError) {
        console.warn('Failed to delete file from storage:', storageError);
      }
    }

    // Delete file record from database
    const { error: deleteError } = await supabaseService
      .from('candidate_files')
      .delete()
      .eq('id', fileId);

    if (deleteError) throw deleteError;

    res.json({ message: 'Resume deleted successfully' });

  } catch (error: any) {
    console.error('Delete resume error:', error);
    res.status(500).json({ 
      error: 'Failed to delete resume', 
      details: error.message 
    });
  }
});

/**
 * GET /api/candidate/upload/files
 * List user's uploaded files
 */
router.get('/files', requireAuth, async (req: AuthRequest, res) => {
  try {
    // Get user's candidate profile
    const { data: candidate, error: candidateError } = await supabaseService
      .from('candidates')
      .select('id')
      .eq('user_id', req.user.id)
      .single();

    if (candidateError && candidateError.code === 'PGRST116') {
      return res.status(404).json({ 
        error: 'Candidate profile not found.' 
      });
    }

    if (candidateError) throw candidateError;

    // Get all files for this candidate
    const { data: files, error: filesError } = await supabaseService
      .from('candidate_files')
      .select('*')
      .eq('candidate_id', candidate.id)
      .order('created_at', { ascending: false });

    if (filesError) throw filesError;

    res.json({ files });

  } catch (error: any) {
    console.error('Get files error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch files', 
      details: error.message 
    });
  }
});

// Error handling middleware for multer
router.use((error: any, req: any, res: any, next: any) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
    }
    return res.status(400).json({ error: error.message });
  }
  
  if (error.message.includes('Only')) {
    return res.status(400).json({ error: error.message });
  }

  next(error);
});

export default router;