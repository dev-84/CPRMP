const {
  uploadResume,
  getResumeStatus,
  getResumeFile,
  deleteResume,
} = require('../services/resumeService');

/**
 * GET /api/student/resume - Fetch active resume metadata and archive
 */
async function handleGetResumeStatus(req, res, next) {
  try {
    const data = await getResumeStatus(req.user.id);
    return res.status(200).json({
      status: 'success',
      data,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/student/resume - Upload or replace active resume
 */
async function handleUploadResume(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide a PDF resume file to upload.',
      });
    }

    const resume = await uploadResume(req.user.id, req.file);

    return res.status(201).json({
      status: 'success',
      message: 'Resume uploaded successfully',
      data: { resume },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/student/resume/preview or GET /api/student/resume/:id/preview
 * Streams actual PDF file inline for browser rendering
 */
async function handlePreviewResume(req, res, next) {
  try {
    const { filePath, originalFilename, mimeType } = await getResumeFile(
      req.user,
      req.params.id || null
    );

    res.setHeader('Content-Type', mimeType || 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `inline; filename="${encodeURIComponent(originalFilename)}"`
    );
    res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');

    return res.sendFile(filePath);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/student/resume/download or GET /api/student/resume/:id/download
 * Streams file as attachment download
 */
async function handleDownloadResume(req, res, next) {
  try {
    const { filePath, originalFilename, mimeType } = await getResumeFile(
      req.user,
      req.params.id || null
    );

    res.setHeader('Content-Type', mimeType || 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${encodeURIComponent(originalFilename)}"`
    );

    return res.sendFile(filePath);
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/student/resume/:id
 */
async function handleDeleteResume(req, res, next) {
  try {
    const result = await deleteResume(req.user.id, req.params.id);
    return res.status(200).json({
      status: 'success',
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  handleGetResumeStatus,
  handleUploadResume,
  handlePreviewResume,
  handleDownloadResume,
  handleDeleteResume,
};
