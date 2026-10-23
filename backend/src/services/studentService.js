const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const StudentProfile = require('../models/StudentProfile');
const PlacementDrive = require('../models/PlacementDrive');
const Application = require('../models/Application');
const Resume = require('../models/Resume');
const PlacementHistory = require('../models/PlacementHistory');
const AIMatchResult = require('../models/AIMatchResult');
const Company = require('../models/Company');
const { RESUME_DIR } = require('../middleware/resumeUpload');


function createError(message, statusCode, code = undefined) {
  const error = new Error(message);
  error.statusCode = statusCode;
  if (code) error.code = code;
  return error;
}

/**
 * Calculate accurate profile completion breakdown
 */
function calculateProfileCompletion(profile, hasResume = false) {
  if (!profile) return { percentage: 0, incompleteSections: ['Profile not created'], isComplete: false };

  let score = 0;
  const incompleteSections = [];

  // 1. Personal & Academic Identity (20%)
  if (profile.fullName && profile.studentId && profile.degree && profile.department && profile.currentSemester && profile.graduationYear) {
    score += 20;
  } else {
    incompleteSections.push('Personal Identity & Program Details');
  }

  // 2. Contact Information (15%)
  if (profile.phone && profile.personalEmail && profile.address?.city && profile.address?.state) {
    score += 15;
  } else {
    incompleteSections.push('Contact Information & Address');
  }

  // 3. Academic Qualifications Ladder (25%)
  const quals = profile.qualifications || [];
  const has10th = quals.some((q) => q.level === '10th' && (q.score !== undefined && q.score !== null));
  const has12th = quals.some((q) => q.level === '12th' && (q.score !== undefined && q.score !== null));
  const hasHigher = quals.some((q) => (q.level === 'ug' || q.level === 'pg') && (q.score !== undefined && q.score !== null));

  if (has10th && has12th && hasHigher) {
    score += 25;
  } else {
    incompleteSections.push('Academic Qualifications (10th, 12th, Degree)');
  }

  // 4. Technical Skills (15%)
  const totalSkills = (profile.skills?.length || 0) + (profile.categorizedSkills?.reduce((acc, cat) => acc + (cat.skills?.length || 0), 0) || 0);
  if (totalSkills >= 3) {
    score += 15;
  } else {
    incompleteSections.push('Technical Skills (add at least 3 skills)');
  }

  // 5. Projects & Certifications (10%)
  if ((profile.projects?.length || 0) > 0 || (profile.certifications?.length || 0) > 0) {
    score += 10;
  } else {
    incompleteSections.push('Projects or Certifications');
  }

  // 6. Resume Upload (15%)
  if (hasResume) {
    score += 15;
  } else {
    incompleteSections.push('Active Verified Resume');
  }

  return {
    percentage: Math.min(100, score),
    incompleteSections,
    isComplete: score >= 80,
  };
}

/**
 * Check student eligibility against drive criteria
 */
function evaluateEligibility(student, drive) {
  const cgpaRequired = Number(drive.minCGPA) || 0;
  const studentCgpa = Number(student.cgpa) || 0;
  const cgpaPass = studentCgpa >= cgpaRequired;

  const maxBacklogsAllowed = drive.maxActiveBacklogs !== undefined && drive.maxActiveBacklogs !== null ? Number(drive.maxActiveBacklogs) : 0;
  const studentBacklogs = Number(student.backlogCount) || 0;
  const backlogPass = studentBacklogs <= maxBacklogsAllowed;

  const degrees = Array.isArray(drive.eligibleDegrees) ? drive.eligibleDegrees : [];
  const studentDegree = (student.degree || '').trim().toLowerCase();
  const degreePass = degrees.length === 0 || degrees.some((d) => d.trim().toLowerCase() === studentDegree || (studentDegree.includes(d.trim().toLowerCase())));

  const departments = Array.isArray(drive.eligibleDepartments) ? drive.eligibleDepartments : [];
  const studentDept = (student.department || '').trim().toLowerCase();
  const deptPass = departments.length === 0 || departments.some((d) => d.trim().toLowerCase() === studentDept || (studentDept.includes(d.trim().toLowerCase())));

  const gradYears = Array.isArray(drive.graduationYears) ? drive.graduationYears.map(Number) : [];
  const studentGradYear = Number(student.graduationYear);
  const yearPass = gradYears.length === 0 || gradYears.includes(studentGradYear);

  const deadline = new Date(drive.applicationDeadline);
  const isDeadlineOpen = !isNaN(deadline.getTime()) ? deadline >= new Date() : true;

  const isEligible = cgpaPass && backlogPass && degreePass && deptPass && yearPass && isDeadlineOpen;

  const criteria = [
    {
      label: 'Minimum CGPA',
      required: cgpaRequired > 0 ? `${cgpaRequired.toFixed(2)} CGPA` : 'No min criteria',
      studentValue: `${studentCgpa.toFixed(2)} CGPA`,
      passed: cgpaPass,
    },
    {
      label: 'Max Active Backlogs',
      required: maxBacklogsAllowed === 0 ? '0 Backlogs' : `Up to ${maxBacklogsAllowed}`,
      studentValue: `${studentBacklogs} Backlogs`,
      passed: backlogPass,
    },
    {
      label: 'Eligible Degree',
      required: degrees.length > 0 ? degrees.join(', ') : 'All Degrees',
      studentValue: student.degree || 'Not specified',
      passed: degreePass,
    },
    {
      label: 'Department / Branch',
      required: departments.length > 0 ? departments.join(', ') : 'All Branches',
      studentValue: student.department || 'Not specified',
      passed: deptPass,
    },
    {
      label: 'Graduation Year',
      required: gradYears.length > 0 ? gradYears.join(', ') : 'All Batches',
      studentValue: studentGradYear ? String(studentGradYear) : 'Not specified',
      passed: yearPass,
    },
    {
      label: 'Application Window',
      required: !isNaN(deadline.getTime()) ? deadline.toLocaleDateString('en-GB') : 'Open',
      studentValue: isDeadlineOpen ? 'Active' : 'Closed',
      passed: isDeadlineOpen,
    },
  ];

  return {
    isEligible,
    criteria,
    isDeadlineOpen,
  };
}

/**
 * 1. Student Dashboard Data
 */
async function getStudentDashboardData(userId) {
  const studentProfile = await StudentProfile.findOne({ userId });
  if (!studentProfile) {
    throw createError('Student profile not found. Please complete profile setup.', 404);
  }

  // Active verified resume check
  const activeResume = await Resume.findOne({
    studentProfileId: studentProfile._id,
    isActive: true,
  }).sort({ uploadedAt: -1 });

  const completion = calculateProfileCompletion(studentProfile, !!activeResume);

  // Placement Drives stats
  const publishedDrives = await PlacementDrive.find({ status: 'published' })
    .populate('companyId', 'name logo headquarters industry website')
    .sort({ applicationDeadline: 1 })
    .lean();

  // Student applications
  const applications = await Application.find({ studentProfileId: studentProfile._id })
    .populate({
      path: 'placementDriveId',
      populate: { path: 'companyId', select: 'name logo headquarters industry' },
    })
    .sort({ appliedAt: -1 })
    .lean();

  const submittedCount = applications.length;
  const shortlistedCount = applications.filter((a) => a.status === 'shortlisted').length;
  const interviewCount = applications.filter((a) => a.status === 'interview').length;
  const selectedCount = applications.filter((a) => a.status === 'selected').length;

  // Placement status check from PlacementHistory or selected application
  const placementRecord = await PlacementHistory.findOne({ studentProfileId: studentProfile._id })
    .populate('companyId', 'name logo')
    .populate('placementDriveId', 'title')
    .lean();

  let placementStatus = {
    isPlaced: false,
    label: 'In Placement Cycle',
    company: null,
    package: null,
    tier: null,
    status: 'In Progress',
  };

  if (placementRecord) {
    placementStatus = {
      isPlaced: true,
      label: 'Officially Placed',
      company: placementRecord.companyId?.name || 'Recruiter Partner',
      role: placementRecord.jobTitle || placementRecord.placementDriveId?.title || 'Engineer',
      package: placementRecord.packageAmount ? `₹${placementRecord.packageAmount.toFixed(2)} LPA` : 'Competitive',
      tier: placementRecord.tier || 'Dream',
      status: placementRecord.offerLetterStatus || 'Offer Issued',
    };
  } else if (selectedCount > 0) {
    const selectedApp = applications.find((a) => a.status === 'selected');
    placementStatus = {
      isPlaced: true,
      label: 'Offer Selected',
      company: selectedApp?.placementDriveId?.companyId?.name || 'Recruiter Partner',
      role: selectedApp?.placementDriveId?.title || 'Selected Candidate',
      package: selectedApp?.placementDriveId?.ctcMax ? `₹${selectedApp.placementDriveId.ctcMax} LPA` : 'Competitive',
      tier: 'Dream',
      status: 'Selected',
    };
  }

  // Recommended drives (published, upcoming deadline, student eligible)
  const appliedDriveIds = new Set(applications.map((a) => a.placementDriveId?._id?.toString()));

  const recommendedDrives = publishedDrives
    .map((drive) => {
      const { isEligible } = evaluateEligibility(studentProfile, drive);
      const hasApplied = appliedDriveIds.has(drive._id.toString());
      const ctcStr = drive.ctcMax
        ? `₹${drive.ctcMax.toFixed(1)} LPA`
        : drive.salary
        ? String(drive.salary)
        : 'Competitive';

      return {
        id: drive._id.toString(),
        company: drive.companyId?.name || 'Campus Partner',
        logo: drive.companyId?.logo || (drive.companyId?.name || 'CP').slice(0, 2).toUpperCase(),
        role: drive.title,
        category: drive.ctcMax >= 20 ? 'Super Dream' : drive.ctcMax >= 10 ? 'Dream' : 'Core Tech',
        location: drive.location || 'Multiple Locations',
        deadline: drive.applicationDeadline ? new Date(drive.applicationDeadline).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Open',
        rawDeadline: drive.applicationDeadline,
        ctc: ctcStr,
        isEligible,
        hasApplied,
        minCgpa: drive.minCGPA || 0,
        maxBacklogs: drive.maxActiveBacklogs ?? 0,
        skills: drive.requiredSkills || [],
      };
    })
    .filter((d) => !d.hasApplied && new Date(d.rawDeadline) >= new Date())
    .slice(0, 4);

  // Recent applications activity
  const recentApplications = applications.slice(0, 5).map((app) => ({
    id: app._id.toString(),
    driveId: app.placementDriveId?._id?.toString() || '',
    company: app.placementDriveId?.companyId?.name || 'Partner Company',
    logo: app.placementDriveId?.companyId?.logo || (app.placementDriveId?.companyId?.name || 'CO').slice(0, 2).toUpperCase(),
    role: app.placementDriveId?.title || 'Job Opening',
    appliedDate: app.appliedAt ? new Date(app.appliedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Recently',
    status: app.status,
    milestone: app.interviewRound || (app.status === 'selected' ? 'Offer Issued' : app.status === 'shortlisted' ? 'Screening Cleared' : 'Under Assessment'),
    lastUpdated: app.updatedAt ? new Date(app.updatedAt).toLocaleDateString('en-GB') : '',
  }));

  return {
    student: {
      fullName: studentProfile.fullName || 'Student',
      studentId: studentProfile.studentId,
      degree: studentProfile.degree,
      department: studentProfile.department,
      graduationYear: studentProfile.graduationYear,
      currentSemester: studentProfile.currentSemester,
      cgpa: studentProfile.cgpa,
      profileCompletion: completion.percentage,
      incompleteSections: completion.incompleteSections,
      verificationStatus: studentProfile.placementVerificationStatus || 'Verified',
      hasResume: !!activeResume,
      resumeFilename: activeResume?.originalFilename || null,
    },
    metrics: {
      profileCompletion: completion.percentage,
      availableDrives: publishedDrives.length,
      applicationsSubmitted: submittedCount,
      shortlistedApplications: shortlistedCount,
      interviewStageApplications: interviewCount,
      selectedApplications: selectedCount,
      placementStatus,
    },
    recommendedDrives,
    recentApplications,
  };
}

/**
 * 2. Get Student Placement Drives with dynamic eligibility
 */
async function getStudentDrivesList(userId, filters = {}) {
  const studentProfile = await StudentProfile.findOne({ userId });
  if (!studentProfile) {
    throw createError('Student profile not found', 404);
  }

  const drives = await PlacementDrive.find({ status: 'published' })
    .populate('companyId', 'name logo headquarters industry website description size')
    .sort({ applicationDeadline: 1 })
    .lean();

  const applications = await Application.find({ studentProfileId: studentProfile._id }).lean();
  const applicationMap = new Map();
  applications.forEach((app) => {
    applicationMap.set(app.placementDriveId.toString(), {
      id: app._id.toString(),
      status: app.status,
      appliedAt: app.appliedAt,
    });
  });

  const formattedDrives = drives.map((drive) => {
    const { isEligible, criteria, isDeadlineOpen } = evaluateEligibility(studentProfile, drive);
    const appInfo = applicationMap.get(drive._id.toString());
    const ctcStr = drive.ctcMax
      ? `₹${drive.ctcMax.toFixed(1)} LPA`
      : drive.salary
      ? String(drive.salary)
      : 'Competitive';

    return {
      id: drive._id.toString(),
      company: drive.companyId?.name || 'Recruitment Partner',
      logo: drive.companyId?.logo || (drive.companyId?.name || 'CP').slice(0, 2).toUpperCase(),
      role: drive.title,
      description: drive.description,
      package: drive.ctcMax || (drive.ctcMin || 8),
      ctc: ctcStr,
      ctcMin: drive.ctcMin,
      ctcMax: drive.ctcMax,
      location: drive.location || 'Multiple Locations',
      deadline: drive.applicationDeadline ? new Date(drive.applicationDeadline).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Open',
      rawDeadline: drive.applicationDeadline,
      category: drive.ctcMax >= 20 ? 'Super Dream' : drive.ctcMax >= 10 ? 'Dream' : 'Core Tech',
      degree: drive.eligibleDegrees?.length ? drive.eligibleDegrees.join(', ') : 'All Disciplines',
      minCgpa: drive.minCGPA || 0,
      maxBacklogs: drive.maxActiveBacklogs ?? 0,
      skills: drive.requiredSkills || [],
      rounds: drive.rounds || [],
      openings: drive.openings || 1,
      isEligible,
      criteria,
      isDeadlineOpen,
      hasApplied: !!appInfo,
      applicationId: appInfo?.id || null,
      applicationStatus: appInfo?.status || null,
    };
  });

  // Apply in-memory search and filters
  let filtered = formattedDrives;

  if (filters.search) {
    const q = filters.search.toLowerCase().trim();
    filtered = filtered.filter(
      (d) =>
        d.company.toLowerCase().includes(q) ||
        d.role.toLowerCase().includes(q) ||
        d.skills.some((s) => s.toLowerCase().includes(q)) ||
        d.location.toLowerCase().includes(q)
    );
  }

  if (filters.eligibility === 'eligible_only') {
    filtered = filtered.filter((d) => d.isEligible);
  }

  if (filters.category && filters.category !== 'all') {
    filtered = filtered.filter((d) => d.category.toLowerCase() === filters.category.toLowerCase());
  }

  return {
    drives: filtered,
    totalCount: filtered.length,
    student: {
      cgpa: studentProfile.cgpa,
      degree: studentProfile.degree,
      department: studentProfile.department,
      graduationYear: studentProfile.graduationYear,
      backlogCount: studentProfile.backlogCount,
    },
  };
}

/**
 * 3. Get Student Placement Drive Details
 */
async function getStudentDriveById(userId, driveId) {
  if (!mongoose.isValidObjectId(driveId)) {
    throw createError('Invalid drive ID', 400);
  }

  const studentProfile = await StudentProfile.findOne({ userId });
  if (!studentProfile) {
    throw createError('Student profile not found', 404);
  }

  const drive = await PlacementDrive.findById(driveId)
    .populate('companyId')
    .lean();

  if (!drive) {
    throw createError('Placement drive not found', 404);
  }

  const { isEligible, criteria, isDeadlineOpen } = evaluateEligibility(studentProfile, drive);

  const existingApp = await Application.findOne({
    studentProfileId: studentProfile._id,
    placementDriveId: drive._id,
  }).lean();

  const activeResume = await Resume.findOne({
    studentProfileId: studentProfile._id,
    isActive: true,
  }).sort({ uploadedAt: -1 });

  return {
    drive: {
      ...drive,
      id: drive._id.toString(),
      company: drive.companyId?.name || 'Recruitment Partner',
      logo: drive.companyId?.logo || (drive.companyId?.name || 'CP').slice(0, 2).toUpperCase(),
      role: drive.title,
      package: drive.ctcMax ? `₹${drive.ctcMax.toFixed(1)} LPA` : drive.salary ? String(drive.salary) : 'Competitive',
      deadline: drive.applicationDeadline ? new Date(drive.applicationDeadline).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Open',
    },
    eligibility: {
      isEligible,
      criteria,
      isDeadlineOpen,
    },
    hasApplied: !!existingApp,
    application: existingApp,
    resumeStatus: {
      hasResume: !!activeResume,
      filename: activeResume?.originalFilename || null,
      uploadedAt: activeResume?.uploadedAt || null,
    },
  };
}

/**
 * 4. Apply to Placement Drive with strict server-side validation
 */
async function applyToDriveForStudent(userId, driveId) {
  const studentProfile = await StudentProfile.findOne({ userId });
  if (!studentProfile) {
    throw createError('You must complete your student academic profile before applying.', 400);
  }

  let drive = null;
  if (mongoose.isValidObjectId(driveId)) {
    drive = await PlacementDrive.findById(driveId);
  }

  if (!drive) {
    throw createError('Placement drive not found or has been removed.', 404);
  }

  if (drive.status !== 'published') {
    throw createError('This placement drive is not currently accepting applications.', 400);
  }

  // Application deadline validation
  if (drive.applicationDeadline && new Date(drive.applicationDeadline) < new Date()) {
    throw createError('The application deadline for this placement drive has passed.', 400);
  }

  // Server-side eligibility validation
  const { isEligible } = evaluateEligibility(studentProfile, drive);
  if (!isEligible) {
    throw createError(
      'You do not meet the minimum eligibility criteria (CGPA, active backlogs, or degree requirement) for this drive.',
      400,
      'INELIGIBLE'
    );
  }

  // MANDATORY RESUME VERIFICATION
  const activeResume = await Resume.findOne({
    studentProfileId: studentProfile._id,
    isActive: true,
  }).sort({ uploadedAt: -1 });

  if (!activeResume) {
    throw createError(
      'Resume upload is mandatory. Please upload your resume in Resume Management before applying.',
      400,
      'RESUME_REQUIRED'
    );
  }

  // Verify file exists on server disk
  const safeFilename = path.basename(activeResume.storageKey);
  const filePath = path.join(RESUME_DIR, safeFilename);

  if (!fs.existsSync(filePath)) {
    throw createError(
      'Your uploaded resume file is unavailable on the server storage. Please re-upload your resume.',
      400,
      'RESUME_MISSING_ON_DISK'
    );
  }

  // Duplicate application check
  const existing = await Application.findOne({
    studentProfileId: studentProfile._id,
    placementDriveId: drive._id,
  });

  if (existing) {
    throw createError(
      'You have already submitted an application for this placement drive.',
      400,
      'DUPLICATE_APPLICATION'
    );
  }

  // Create official Application
  const newApp = await Application.create({
    studentProfileId: studentProfile._id,
    placementDriveId: drive._id,
    resumeId: activeResume._id,
    status: 'submitted',
    eligibilityStatus: 'eligible',
    appliedAt: new Date(),
  });

  return {
    application: newApp,
    message: 'Application submitted successfully with verified resume.',
  };
}

/**
 * 5. Get Student Submitted Applications
 */
async function getStudentApplications(userId) {
  const studentProfile = await StudentProfile.findOne({ userId });
  if (!studentProfile) return { applications: [], summary: {} };

  const apps = await Application.find({ studentProfileId: studentProfile._id })
    .populate({
      path: 'placementDriveId',
      populate: { path: 'companyId' },
    })
    .populate('resumeId', 'originalFilename sizeBytes uploadedAt')
    .sort({ appliedAt: -1 })
    .lean();

  const formatted = apps.map((app) => {
    const drive = app.placementDriveId;
    const company = drive?.companyId;

    return {
      id: app._id.toString(),
      driveId: drive?._id?.toString() || '',
      company: company?.name || 'Recruitment Partner',
      logo: company?.logo || (company?.name || 'CP').slice(0, 2).toUpperCase(),
      role: drive?.title || 'Placement Role',
      package: drive?.ctcMax ? `₹${drive.ctcMax.toFixed(1)} LPA` : drive?.salary ? String(drive.salary) : 'Competitive',
      appliedDate: app.appliedAt ? new Date(app.appliedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '',
      rawAppliedDate: app.appliedAt,
      status: app.status,
      milestone: app.interviewRound || (app.status === 'selected' ? 'Offer Letter Issued' : app.status === 'shortlisted' ? 'Screening Cleared' : 'Under Assessment'),
      lastUpdated: app.updatedAt ? new Date(app.updatedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '',
      reviewNotes: app.reviewNotes || null,
      resumeName: app.resumeId?.originalFilename || null,
    };
  });

  const summary = {
    total: formatted.length,
    submitted: formatted.filter((a) => a.status === 'submitted').length,
    underReview: formatted.filter((a) => a.status === 'under_review').length,
    shortlisted: formatted.filter((a) => a.status === 'shortlisted').length,
    interview: formatted.filter((a) => a.status === 'interview').length,
    selected: formatted.filter((a) => a.status === 'selected').length,
    rejected: formatted.filter((a) => a.status === 'rejected').length,
  };

  return {
    applications: formatted,
    summary,
  };
}

/**
 * 6. Get Single Student Application Details with Timeline Stages
 */
async function getStudentApplicationDetails(userId, applicationId) {
  if (!mongoose.isValidObjectId(applicationId)) {
    throw createError('Invalid application ID', 400);
  }

  const studentProfile = await StudentProfile.findOne({ userId });
  if (!studentProfile) {
    throw createError('Student profile not found', 404);
  }

  const app = await Application.findById(applicationId)
    .populate({
      path: 'placementDriveId',
      populate: { path: 'companyId' },
    })
    .populate('resumeId')
    .lean();

  if (!app) {
    throw createError('Application record not found', 404);
  }

  // Security check: Student can only view their own applications
  if (app.studentProfileId.toString() !== studentProfile._id.toString()) {
    throw createError('Access denied: You are not authorized to view this application.', 403);
  }

  const drive = app.placementDriveId || {};
  const company = drive.companyId || {};

  // Build recruitment stages based on status
  const stages = [
    {
      number: 1,
      title: 'Application Submitted & Institutional Verification',
      status: 'completed',
      description: 'Eligibility criteria verified against institutional academic records.',
      date: app.appliedAt ? new Date(app.appliedAt).toLocaleString('en-GB') : 'Verified',
      reference: `Ref #${app._id.toString().slice(-6).toUpperCase()}`,
    },
    {
      number: 2,
      title: 'Recruiter Screening & ATS Review',
      status: ['under_review', 'shortlisted', 'interview', 'selected'].includes(app.status)
        ? 'completed'
        : app.status === 'submitted'
        ? 'current'
        : 'upcoming',
      description: 'The talent acquisition team evaluates candidate qualifications and resume alignment.',
      date: app.status !== 'submitted' ? 'Screening Processed' : 'In Progress',
      reference: 'ATS Profile Evaluation',
    },
    {
      number: 3,
      title: 'Technical & Aptitude Assessment',
      status: ['shortlisted', 'interview', 'selected'].includes(app.status)
        ? 'completed'
        : app.status === 'under_review'
        ? 'current'
        : 'upcoming',
      description: 'Standard technical assessment or coding round evaluating core competencies.',
      date: ['shortlisted', 'interview', 'selected'].includes(app.status) ? 'Completed' : 'Pending Schedule',
      reference: 'Technical Assessment',
    },
    {
      number: 4,
      title: 'Technical & HR Interviews',
      status: app.status === 'selected'
        ? 'completed'
        : app.status === 'interview'
        ? 'current'
        : 'upcoming',
      description: app.interviewRound ? `Current Round: ${app.interviewRound}` : 'Comprehensive technical and behavioral interview rounds.',
      date: app.interviewRound ? app.interviewRound : 'Schedule pending',
      reference: 'Interview Committee',
    },
    {
      number: 5,
      title: 'Final Selection & Offer Letter',
      status: app.status === 'selected'
        ? 'completed'
        : app.status === 'rejected'
        ? 'rejected'
        : 'upcoming',
      description: app.status === 'selected' ? 'Congratulations! Official placement offer extended.' : 'Final leadership review and offer issuance.',
      date: app.status === 'selected' ? 'Offer Extended' : 'Pending Final Outcome',
      reference: 'Institutional Placement Cell',
    },
  ];

  return {
    application: {
      ...app,
      id: app._id.toString(),
      appliedDate: app.appliedAt ? new Date(app.appliedAt).toLocaleDateString('en-GB') : '',
    },
    drive: {
      id: drive._id?.toString(),
      title: drive.title,
      description: drive.description,
      location: drive.location,
      salary: drive.salary,
      ctc: drive.ctcMax ? `₹${drive.ctcMax.toFixed(1)} LPA` : 'Competitive',
      deadline: drive.applicationDeadline ? new Date(drive.applicationDeadline).toLocaleDateString('en-GB') : '',
      requiredSkills: drive.requiredSkills || [],
    },
    company: {
      name: company.name || 'Recruiter Partner',
      logo: company.logo || (company.name || 'CP').slice(0, 2).toUpperCase(),
      industry: company.industry,
      website: company.website,
      headquarters: company.headquarters,
    },
    stages,
  };
}

/**
 * 7. AI Placement Matching based on real skills comparison
 */
async function getStudentAIMatching(userId) {
  const studentProfile = await StudentProfile.findOne({ userId }).lean();
  if (!studentProfile) {
    throw createError('Student profile not found', 404);
  }

  // Gather student skills
  const studentSkillsList = [
    ...(studentProfile.skills || []),
    ...(studentProfile.categorizedSkills || []).flatMap((c) => c.skills || []),
  ];
  const normalizedStudentSkills = new Set(studentSkillsList.map((s) => s.toLowerCase().trim()));

  const drives = await PlacementDrive.find({ status: 'published' })
    .populate('companyId', 'name logo industry')
    .lean();

  const matches = drives.map((drive) => {
    const requiredSkills = drive.requiredSkills || [];
    const matched = [];
    const missing = [];

    requiredSkills.forEach((req) => {
      const lower = req.toLowerCase().trim();
      const hasDirect = normalizedStudentSkills.has(lower);
      const hasPartial = Array.from(normalizedStudentSkills).some((s) => s.includes(lower) || lower.includes(s));

      if (hasDirect || hasPartial) {
        matched.push(req);
      } else {
        missing.push(req);
      }
    });

    // Score computation
    const skillRatio = requiredSkills.length > 0 ? matched.length / requiredSkills.length : 0.75;
    const cgpaScore = (studentProfile.cgpa || 0) >= (drive.minCGPA || 0) ? 20 : 5;
    const degreeScore = (drive.eligibleDegrees || []).length === 0 || drive.eligibleDegrees.some((d) => d.toLowerCase().includes((studentProfile.degree || '').toLowerCase())) ? 15 : 0;

    const baseScore = Math.round(skillRatio * 65 + cgpaScore + degreeScore);
    const score = Math.max(30, Math.min(96, baseScore));

    const recommendations = [];
    if (missing.length > 0) {
      recommendations.push(`Strengthen competencies in: ${missing.slice(0, 3).join(', ')}.`);
    }
    if (matched.length > 0) {
      recommendations.push(`Highlight your experience with ${matched.slice(0, 2).join(' and ')} in technical interviews.`);
    }
    recommendations.push('Review system design fundamentals and multi-tier architecture patterns.');

    return {
      id: drive._id.toString(),
      name: `${drive.companyId?.name || 'Company'} — ${drive.title}`,
      company: drive.companyId?.name || 'Company',
      role: drive.title,
      score,
      matched,
      missing,
      recommendations,
      package: drive.ctcMax ? `₹${drive.ctcMax.toFixed(1)} LPA` : drive.salary ? String(drive.salary) : 'Competitive',
      deadline: drive.applicationDeadline ? new Date(drive.applicationDeadline).toLocaleDateString('en-GB') : '',
    };
  });

  matches.sort((a, b) => b.score - a.score);

  return {
    matches,
    studentSkillsCount: normalizedStudentSkills.size,
    totalDrivesCount: drives.length,
  };
}

/**
 * 8. Get Official Student Placement History
 */
async function getStudentPlacementHistory(userId) {
  const studentProfile = await StudentProfile.findOne({ userId });
  if (!studentProfile) {
    throw createError('Student profile not found', 404);
  }

  // Official PlacementHistory entries
  const historyEntries = await PlacementHistory.find({ studentProfileId: studentProfile._id })
    .populate('companyId')
    .populate('placementDriveId')
    .sort({ placedAt: -1 })
    .lean();

  // Also query applications marked 'selected'
  const selectedApps = await Application.find({
    studentProfileId: studentProfile._id,
    status: 'selected',
  })
    .populate({
      path: 'placementDriveId',
      populate: { path: 'companyId' },
    })
    .lean();

  const records = [];
  const driveIdSet = new Set();

  historyEntries.forEach((entry) => {
    driveIdSet.add(entry.placementDriveId?._id?.toString());
    const company = entry.companyId;
    records.push({
      id: entry._id.toString(),
      company: company?.name || 'Recruiter Partner',
      logo: company?.logo || (company?.name || 'CP').slice(0, 2).toUpperCase(),
      role: entry.jobTitle || entry.placementDriveId?.title || 'Selected Candidate',
      division: company?.industry || 'Technology & Software',
      salary: entry.packageAmount || 8,
      package: entry.packageAmount ? `₹${entry.packageAmount.toFixed(2)} LPA` : 'Competitive',
      date: entry.placedAt ? new Date(entry.placedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Verified',
      status: entry.offerLetterStatus === 'signed' ? 'Offer Signed & Accepted' : 'Offer Issued',
      tier: entry.tier || 'Dream',
      outcome: `Institutional Placement Verified (#PL-${entry._id.toString().slice(-4).toUpperCase()})`,
    });
  });

  selectedApps.forEach((app) => {
    if (app.placementDriveId && !driveIdSet.has(app.placementDriveId._id.toString())) {
      const company = app.placementDriveId.companyId;
      records.push({
        id: app._id.toString(),
        company: company?.name || 'Recruiter Partner',
        logo: company?.logo || (company?.name || 'CP').slice(0, 2).toUpperCase(),
        role: app.placementDriveId.title || 'Selected Engineer',
        division: company?.industry || 'Technology & Engineering',
        salary: app.placementDriveId.ctcMax || 9,
        package: app.placementDriveId.ctcMax ? `₹${app.placementDriveId.ctcMax.toFixed(2)} LPA` : 'Competitive',
        date: app.appliedAt ? new Date(app.appliedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Recently',
        status: 'Selected & Accepted',
        tier: (app.placementDriveId.ctcMax || 0) >= 20 ? 'Super Dream' : 'Dream',
        outcome: `Official Selection Extended (${app.placementDriveId.title})`,
      });
    }
  });

  const totalOffers = records.length;
  const packages = records.map((r) => r.salary).filter(Boolean);
  const highestPackage = packages.length ? Math.max(...packages) : 0;
  const averagePackage = packages.length ? (packages.reduce((a, b) => a + b, 0) / packages.length).toFixed(2) : 0;

  return {
    records,
    summary: {
      totalOffers,
      highestPackage: highestPackage ? `₹${highestPackage.toFixed(2)} LPA` : 'N/A',
      averagePackage: averagePackage > 0 ? `₹${averagePackage} LPA` : 'N/A',
      isPlaced: totalOffers > 0,
    },
  };
}

module.exports = {
  calculateProfileCompletion,
  evaluateEligibility,
  getStudentDashboardData,
  getStudentDrivesList,
  getStudentDriveById,
  applyToDriveForStudent,
  getStudentApplications,
  getStudentApplicationDetails,
  getStudentAIMatching,
  getStudentPlacementHistory,
};
