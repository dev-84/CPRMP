const User = require('../models/User');
const RecruiterProfile = require('../models/RecruiterProfile');
const Company = require('../models/Company');
const PlacementDrive = require('../models/PlacementDrive');
const EligibilityCriteria = require('../models/EligibilityCriteria');
const Application = require('../models/Application');
const StudentProfile = require('../models/StudentProfile');
const Resume = require('../models/Resume');
const RecruitmentStatus = require('../models/RecruitmentStatus');

function createError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

// Valid recruiter lifecycle status transitions
const ALLOWED_APPLICATION_TRANSITIONS = {
  submitted: ['under_review', 'shortlisted', 'rejected'],
  under_review: ['shortlisted', 'interview', 'rejected'],
  shortlisted: ['interview', 'selected', 'rejected'],
  interview: ['selected', 'rejected', 'shortlisted'],
  selected: [],
  rejected: ['under_review'],
  withdrawn: [],
};

const ALLOWED_DRIVE_TRANSITIONS = {
  draft: ['published', 'cancelled'],
  published: ['closed', 'cancelled'],
  closed: ['cancelled'],
  cancelled: [],
};

/**
 * Validates and retrieves the recruiter's authorized company.
 * Enforces company-level authorization directly from the database.
 */
async function getRecruiterAuthorizedCompany(userId, { allowUnassigned = false } = {}) {
  let profile = await RecruiterProfile.findOne({ userId }).populate('companyId');

  if (!profile) {
    // Check if user exists and has recruiter role
    const user = await User.findById(userId);
    if (!user || user.role !== 'recruiter') {
      throw createError('Access denied: Recruiter account required', 403);
    }
    // Create baseline profile if not yet created
    profile = await RecruiterProfile.create({
      userId,
      isVerified: false,
    });
  }

  if (!profile.companyId) {
    if (allowUnassigned) {
      return {
        recruiterProfile: profile,
        companyId: null,
        company: null,
        unassigned: true,
      };
    }
    throw createError(
      'Your recruiter account is not yet assigned to an authorized company. Please contact the administrator.',
      403
    );
  }

  const company = profile.companyId;
  if (company.status === 'inactive' || company.status === 'rejected') {
    throw createError(
      `Your company account is currently ${company.status}. Access is restricted.`,
      403
    );
  }

  return {
    recruiterProfile: profile,
    companyId: company._id,
    company,
    unassigned: false,
  };
}

/**
 * 1. Recruiter Dashboard Overview
 */
async function getRecruiterDashboard(userId) {
  const { recruiterProfile, companyId, company, unassigned } = await getRecruiterAuthorizedCompany(userId, {
    allowUnassigned: true,
  });
  const user = await User.findById(userId).select('name email');

  if (unassigned || !companyId) {
    return {
      unassigned: true,
      company: null,
      recruiter: {
        name: user?.name || 'Recruiter',
        email: user?.email || '',
        jobTitle: recruiterProfile?.jobTitle || 'Talent Acquisition',
        isVerified: recruiterProfile?.isVerified || false,
      },
      metrics: {
        totalDrives: 0,
        activeDrivesCount: 0,
        totalApplications: 0,
        uniqueCandidatesCount: 0,
        shortlistedCount: 0,
        interviewCount: 0,
        selectedCount: 0,
        underReviewCount: 0,
        submittedCount: 0,
        rejectedCount: 0,
        withdrawnCount: 0,
      },
      statusBreakdown: {
        submitted: 0,
        under_review: 0,
        shortlisted: 0,
        interview: 0,
        selected: 0,
        rejected: 0,
        withdrawn: 0,
      },
      recentApplicants: [],
      upcomingDeadlines: [],
    };
  }

  // Load all drives for this company
  const companyDrives = await PlacementDrive.find({ companyId })
    .sort({ createdAt: -1 })
    .lean();

  const driveIds = companyDrives.map((d) => d._id);
  const now = new Date();

  const activeDrives = companyDrives.filter(
    (d) => d.status === 'published' && (!d.applicationDeadline || new Date(d.applicationDeadline) >= now)
  );

  // Status aggregation for all applications
  const [applications, statusAggregation] = await Promise.all([
    Application.find({ placementDriveId: { $in: driveIds } })
      .populate({
        path: 'studentProfileId',
        select: 'studentId fullName phone department degree graduationYear currentSemester cgpa backlogCount skills',
        populate: { path: 'userId', select: 'name email' },
      })
      .populate('placementDriveId', 'title jobType location applicationDeadline')
      .populate('resumeId', 'originalFilename sizeBytes uploadedAt')
      .sort({ appliedAt: -1 })
      .limit(10)
      .lean(),
    Application.aggregate([
      { $match: { placementDriveId: { $in: driveIds } } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
  ]);

  const totalApplications = await Application.countDocuments({ placementDriveId: { $in: driveIds } });

  // Distinct candidates
  const distinctCandidates = await Application.distinct('studentProfileId', {
    placementDriveId: { $in: driveIds },
  });

  const statusBreakdown = {
    submitted: 0,
    under_review: 0,
    shortlisted: 0,
    interview: 0,
    selected: 0,
    rejected: 0,
    withdrawn: 0,
  };

  statusAggregation.forEach((item) => {
    if (statusBreakdown[item._id] !== undefined) {
      statusBreakdown[item._id] = item.count;
    }
  });

  // Upcoming deadlines (active published drives sorted by nearest deadline)
  const upcomingDeadlines = activeDrives
    .slice()
    .sort((a, b) => new Date(a.applicationDeadline) - new Date(b.applicationDeadline))
    .slice(0, 5)
    .map((d) => ({
      _id: d._id,
      title: d.title,
      jobType: d.jobType,
      applicationDeadline: d.applicationDeadline,
      status: d.status,
      applicantsCount: 0, // populated on demand
    }));

  // Attach applicant counts to upcoming deadlines
  for (const drive of upcomingDeadlines) {
    drive.applicantsCount = await Application.countDocuments({ placementDriveId: drive._id });
  }

  return {
    recruiter: {
      name: user?.name || 'Recruiter',
      email: user?.email,
      jobTitle: recruiterProfile.jobTitle || 'Talent Acquisition',
      isVerified: recruiterProfile.isVerified,
    },
    company: {
      _id: company._id,
      name: company.name,
      industry: company.industry,
      website: company.website,
      logo: company.logo,
      headquarters: company.headquarters,
      status: company.status,
    },
    metrics: {
      totalDrives: companyDrives.length,
      activeDrivesCount: activeDrives.length,
      totalApplications,
      uniqueCandidatesCount: distinctCandidates.length,
      shortlistedCount: statusBreakdown.shortlisted,
      interviewCount: statusBreakdown.interview,
      selectedCount: statusBreakdown.selected,
      underReviewCount: statusBreakdown.under_review,
      submittedCount: statusBreakdown.submitted,
      rejectedCount: statusBreakdown.rejected,
      withdrawnCount: statusBreakdown.withdrawn,
    },
    statusBreakdown,
    recentApplicants: applications.map((app) => ({
      _id: app._id,
      studentName: app.studentProfileId?.fullName || app.studentProfileId?.userId?.name || 'Candidate',
      studentEmail: app.studentProfileId?.userId?.email,
      rollNo: app.studentProfileId?.studentId || 'N/A',
      program: app.studentProfileId?.degree || app.studentProfileId?.department || 'N/A',
      cgpa: app.studentProfileId?.cgpa != null ? app.studentProfileId.cgpa : null,
      appliedDrive: app.placementDriveId?.title || 'Drive',
      driveId: app.placementDriveId?._id,
      appliedAt: app.appliedAt,
      status: app.status,
      resumeId: app.resumeId?._id,
    })),
    upcomingDeadlines,
  };
}

/**
 * 2. Company Profile
 */
async function getRecruiterCompany(userId) {
  const { recruiterProfile, company, unassigned } = await getRecruiterAuthorizedCompany(userId, {
    allowUnassigned: true,
  });

  const availableCompanies = await Company.find({ status: { $ne: 'rejected' } })
    .select('name industry headquarters website contactEmail description size logo status')
    .sort({ name: 1 })
    .lean();

  return {
    company: company || null,
    unassigned: !!unassigned,
    availableCompanies,
    recruiterInfo: {
      jobTitle: recruiterProfile?.jobTitle || '',
      phone: recruiterProfile?.phone || '',
      isVerified: recruiterProfile?.isVerified || false,
    },
  };
}

async function updateRecruiterCompany(userId, updateData) {
  let profile = await RecruiterProfile.findOne({ userId });
  if (!profile) {
    const user = await User.findById(userId);
    if (!user || user.role !== 'recruiter') {
      throw createError('Access denied: Recruiter account required', 403);
    }
    profile = await RecruiterProfile.create({ userId, isVerified: false });
  }

  // Handle company affiliation / switch
  if (updateData.companyId) {
    const comp = await Company.findById(updateData.companyId);
    if (!comp) {
      throw createError('Selected company record not found', 404);
    }
    profile.companyId = comp._id;
  } else if (!profile.companyId && updateData.newCompanyName) {
    let newComp = await Company.findOne({ name: updateData.newCompanyName.trim() });
    if (!newComp) {
      newComp = await Company.create({
        name: updateData.newCompanyName.trim(),
        industry: updateData.industry?.trim() || 'Technology',
        headquarters: updateData.headquarters?.trim() || 'India',
        website: updateData.website?.trim() || '',
        contactEmail: updateData.contactEmail?.trim() || '',
        description: updateData.description?.trim() || '',
        size: updateData.size?.trim() || '500-1000 employees',
        status: 'approved',
        createdBy: userId,
      });
    }
    profile.companyId = newComp._id;
  }

  let company = null;
  if (profile.companyId) {
    company = await Company.findById(profile.companyId);
    if (company) {
      if (updateData.description !== undefined) company.description = updateData.description.trim();
      if (updateData.website !== undefined) company.website = updateData.website.trim();
      if (updateData.headquarters !== undefined) company.headquarters = updateData.headquarters.trim();
      if (updateData.contactEmail !== undefined) company.contactEmail = updateData.contactEmail.trim();
      if (updateData.industry !== undefined) company.industry = updateData.industry.trim();
      if (updateData.logo !== undefined) company.logo = updateData.logo.trim();
      if (updateData.size !== undefined) company.size = updateData.size.trim();
      if (updateData.phone !== undefined) company.phone = updateData.phone.trim();
      await company.save();
    }
  }

  if (updateData.jobTitle !== undefined) profile.jobTitle = updateData.jobTitle.trim();
  if (updateData.recruiterPhone !== undefined) profile.phone = updateData.recruiterPhone.trim();
  await profile.save();

  const availableCompanies = await Company.find({ status: { $ne: 'rejected' } })
    .select('name industry headquarters website contactEmail description size logo status')
    .sort({ name: 1 })
    .lean();

  return {
    company,
    unassigned: !profile.companyId,
    availableCompanies,
    recruiterInfo: {
      jobTitle: profile.jobTitle || '',
      phone: profile.phone || '',
      isVerified: profile.isVerified || false,
    },
  };
}

/**
 * 3. Placement Drives Listing
 */
async function getRecruiterDrives(userId, { search, status, page = 1, limit = 20 } = {}) {
  const { companyId, unassigned } = await getRecruiterAuthorizedCompany(userId, { allowUnassigned: true });

  if (unassigned || !companyId) {
    return {
      drives: [],
      metrics: {
        totalDrives: 0,
        publishedCount: 0,
        draftCount: 0,
        closedCount: 0,
      },
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalRecords: 0,
        pageSize: limit,
      },
      unassigned: true,
    };
  }

  const query = { companyId };

  if (status && status !== 'all') {
    query.status = status;
  }

  if (search && search.trim()) {
    const s = search.trim();
    query.$or = [
      { title: { $regex: s, $options: 'i' } },
      { jobType: { $regex: s, $options: 'i' } },
      { location: { $regex: s, $options: 'i' } },
    ];
  }

  const safePage = Math.max(1, parseInt(page, 10) || 1);
  const safeLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
  const skip = (safePage - 1) * safeLimit;

  const [drives, total] = await Promise.all([
    PlacementDrive.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(safeLimit)
      .lean(),
    PlacementDrive.countDocuments(query),
  ]);

  // Aggregate summary metrics across all recruiter drives
  const allCompanyDrives = await PlacementDrive.find({ companyId }).select('_id status').lean();
  const summaryMetrics = {
    totalDrives: allCompanyDrives.length,
    draftDrives: allCompanyDrives.filter((d) => d.status === 'draft').length,
    publishedDrives: allCompanyDrives.filter((d) => d.status === 'published').length,
    closedDrives: allCompanyDrives.filter((d) => d.status === 'closed').length,
    cancelledDrives: allCompanyDrives.filter((d) => d.status === 'cancelled').length,
  };

  // Attach applicant counts and criteria to each returned drive
  const enrichedDrives = await Promise.all(
    drives.map(async (drive) => {
      const [applicantCount, criteria] = await Promise.all([
        Application.countDocuments({ placementDriveId: drive._id }),
        EligibilityCriteria.findOne({ placementDriveId: drive._id }).lean(),
      ]);

      return {
        ...drive,
        totalApplicants: applicantCount,
        criteria,
      };
    })
  );

  return {
    drives: enrichedDrives,
    summaryMetrics,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      pages: Math.ceil(total / safeLimit),
    },
  };
}

/**
 * 4. Get Placement Drive Details by ID
 */
async function getRecruiterDriveById(userId, driveId) {
  const { companyId } = await getRecruiterAuthorizedCompany(userId);

  const drive = await PlacementDrive.findOne({ _id: driveId, companyId }).lean();
  if (!drive) {
    throw createError('Placement drive not found or does not belong to your company', 404);
  }

  const [criteria, totalApplicants, statusAggregation] = await Promise.all([
    EligibilityCriteria.findOne({ placementDriveId: driveId }).lean(),
    Application.countDocuments({ placementDriveId: driveId }),
    Application.aggregate([
      { $match: { placementDriveId: drive._id } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
  ]);

  const statusBreakdown = {
    submitted: 0,
    under_review: 0,
    shortlisted: 0,
    interview: 0,
    selected: 0,
    rejected: 0,
    withdrawn: 0,
  };

  statusAggregation.forEach((item) => {
    if (statusBreakdown[item._id] !== undefined) {
      statusBreakdown[item._id] = item.count;
    }
  });

  return {
    drive: {
      ...drive,
      criteria,
      totalApplicants,
      statusBreakdown,
    },
  };
}

/**
 * 5. Create Placement Drive
 */
async function createRecruiterDrive(userId, driveData) {
  const { companyId } = await getRecruiterAuthorizedCompany(userId);

  if (!driveData.title || !driveData.title.trim()) {
    throw createError('Job / Drive title is required', 400);
  }
  if (!driveData.description || !driveData.description.trim()) {
    throw createError('Job description is required', 400);
  }
  if (!driveData.applicationDeadline) {
    throw createError('Application deadline is required', 400);
  }

  const deadline = new Date(driveData.applicationDeadline);
  if (isNaN(deadline.getTime())) {
    throw createError('Invalid application deadline format', 400);
  }

  const drive = await PlacementDrive.create({
    companyId,
    createdBy: userId,
    title: driveData.title.trim(),
    description: driveData.description.trim(),
    jobType: driveData.jobType ? driveData.jobType.trim() : 'Full-time',
    location: driveData.location ? driveData.location.trim() : 'On-site',
    salary: driveData.salary || `${driveData.ctcMin || 0}-${driveData.ctcMax || 0} LPA`,
    ctcMin: driveData.ctcMin != null ? Number(driveData.ctcMin) : undefined,
    ctcMax: driveData.ctcMax != null ? Number(driveData.ctcMax) : undefined,
    currency: driveData.currency || 'INR',
    openings: driveData.openings != null ? Math.max(1, parseInt(driveData.openings, 10)) : 1,
    applicationDeadline: deadline,
    driveDate: driveData.driveDate ? new Date(driveData.driveDate) : undefined,
    status: driveData.status === 'published' ? 'published' : 'draft',
    responsibilities: Array.isArray(driveData.responsibilities)
      ? driveData.responsibilities
      : typeof driveData.responsibilities === 'string'
      ? driveData.responsibilities.split('\n').map((s) => s.trim()).filter(Boolean)
      : [],
    requiredSkills: Array.isArray(driveData.requiredSkills)
      ? driveData.requiredSkills
      : typeof driveData.requiredSkills === 'string'
      ? driveData.requiredSkills.split(',').map((s) => s.trim()).filter(Boolean)
      : [],
    eligibleDegrees: Array.isArray(driveData.eligibleDegrees)
      ? driveData.eligibleDegrees
      : typeof driveData.eligibleDegrees === 'string'
      ? driveData.eligibleDegrees.split(',').map((s) => s.trim()).filter(Boolean)
      : [],
    eligibleDepartments: Array.isArray(driveData.eligibleDepartments)
      ? driveData.eligibleDepartments
      : typeof driveData.eligibleDepartments === 'string'
      ? driveData.eligibleDepartments.split(',').map((s) => s.trim()).filter(Boolean)
      : [],
    graduationYears: Array.isArray(driveData.graduationYears)
      ? driveData.graduationYears
      : typeof driveData.graduationYears === 'string'
      ? driveData.graduationYears.split(',').map((s) => parseInt(s.trim(), 10)).filter((n) => !isNaN(n))
      : [],
    minCGPA: driveData.minCGPA != null ? Number(driveData.minCGPA) : 0,
    maxActiveBacklogs: driveData.maxActiveBacklogs != null ? Number(driveData.maxActiveBacklogs) : 0,
    rounds: Array.isArray(driveData.rounds)
      ? driveData.rounds
      : typeof driveData.rounds === 'string'
      ? driveData.rounds.split(',').map((s) => s.trim()).filter(Boolean)
      : ['Online Assessment', 'Technical Round', 'HR Interview'],
  });

  // Synchronize EligibilityCriteria record
  await EligibilityCriteria.findOneAndUpdate(
    { placementDriveId: drive._id },
    {
      placementDriveId: drive._id,
      minimumCgpa: drive.minCGPA,
      allowedDepartments: drive.eligibleDepartments,
      allowedDegrees: drive.eligibleDegrees,
      graduationYears: drive.graduationYears,
      maximumBacklogs: drive.maxActiveBacklogs,
      requiredSkills: drive.requiredSkills,
    },
    { upsert: true, new: true }
  );

  return drive;
}

/**
 * 6. Update Placement Drive
 */
async function updateRecruiterDrive(userId, driveId, updateData) {
  const { companyId } = await getRecruiterAuthorizedCompany(userId);

  const drive = await PlacementDrive.findOne({ _id: driveId, companyId });
  if (!drive) {
    throw createError('Placement drive not found or does not belong to your company', 404);
  }

  if (drive.status === 'closed' || drive.status === 'cancelled') {
    if (updateData.status && updateData.status !== drive.status) {
      throw createError(`Cannot change status of a ${drive.status} placement drive`, 400);
    }
  }

  if (updateData.title !== undefined) drive.title = updateData.title.trim();
  if (updateData.description !== undefined) drive.description = updateData.description.trim();
  if (updateData.jobType !== undefined) drive.jobType = updateData.jobType.trim();
  if (updateData.location !== undefined) drive.location = updateData.location.trim();
  if (updateData.salary !== undefined) drive.salary = updateData.salary;
  if (updateData.ctcMin !== undefined) drive.ctcMin = Number(updateData.ctcMin);
  if (updateData.ctcMax !== undefined) drive.ctcMax = Number(updateData.ctcMax);
  if (updateData.currency !== undefined) drive.currency = updateData.currency;
  if (updateData.openings !== undefined) drive.openings = Math.max(1, parseInt(updateData.openings, 10));
  if (updateData.applicationDeadline) {
    const d = new Date(updateData.applicationDeadline);
    if (!isNaN(d.getTime())) drive.applicationDeadline = d;
  }
  if (updateData.driveDate) {
    const d = new Date(updateData.driveDate);
    if (!isNaN(d.getTime())) drive.driveDate = d;
  }
  if (updateData.responsibilities !== undefined) {
    drive.responsibilities = Array.isArray(updateData.responsibilities)
      ? updateData.responsibilities
      : typeof updateData.responsibilities === 'string'
      ? updateData.responsibilities.split('\n').map((s) => s.trim()).filter(Boolean)
      : [];
  }
  if (updateData.requiredSkills !== undefined) {
    drive.requiredSkills = Array.isArray(updateData.requiredSkills)
      ? updateData.requiredSkills
      : typeof updateData.requiredSkills === 'string'
      ? updateData.requiredSkills.split(',').map((s) => s.trim()).filter(Boolean)
      : [];
  }
  if (updateData.eligibleDegrees !== undefined) {
    drive.eligibleDegrees = Array.isArray(updateData.eligibleDegrees)
      ? updateData.eligibleDegrees
      : typeof updateData.eligibleDegrees === 'string'
      ? updateData.eligibleDegrees.split(',').map((s) => s.trim()).filter(Boolean)
      : [];
  }
  if (updateData.eligibleDepartments !== undefined) {
    drive.eligibleDepartments = Array.isArray(updateData.eligibleDepartments)
      ? updateData.eligibleDepartments
      : typeof updateData.eligibleDepartments === 'string'
      ? updateData.eligibleDepartments.split(',').map((s) => s.trim()).filter(Boolean)
      : [];
  }
  if (updateData.graduationYears !== undefined) {
    drive.graduationYears = Array.isArray(updateData.graduationYears)
      ? updateData.graduationYears
      : typeof updateData.graduationYears === 'string'
      ? updateData.graduationYears.split(',').map((s) => parseInt(s.trim(), 10)).filter((n) => !isNaN(n))
      : [];
  }
  if (updateData.minCGPA !== undefined) drive.minCGPA = Number(updateData.minCGPA);
  if (updateData.maxActiveBacklogs !== undefined) drive.maxActiveBacklogs = Number(updateData.maxActiveBacklogs);
  if (updateData.rounds !== undefined) {
    drive.rounds = Array.isArray(updateData.rounds)
      ? updateData.rounds
      : typeof updateData.rounds === 'string'
      ? updateData.rounds.split(',').map((s) => s.trim()).filter(Boolean)
      : [];
  }

  await drive.save();

  // Sync EligibilityCriteria
  await EligibilityCriteria.findOneAndUpdate(
    { placementDriveId: drive._id },
    {
      placementDriveId: drive._id,
      minimumCgpa: drive.minCGPA,
      allowedDepartments: drive.eligibleDepartments,
      allowedDegrees: drive.eligibleDegrees,
      graduationYears: drive.graduationYears,
      maximumBacklogs: drive.maxActiveBacklogs,
      requiredSkills: drive.requiredSkills,
    },
    { upsert: true, new: true }
  );

  return drive;
}

/**
 * 7. Update Drive Status (Publish, Close, Cancel)
 */
async function updateRecruiterDriveStatus(userId, driveId, newStatus) {
  const { companyId } = await getRecruiterAuthorizedCompany(userId);

  const drive = await PlacementDrive.findOne({ _id: driveId, companyId });
  if (!drive) {
    throw createError('Placement drive not found or does not belong to your company', 404);
  }

  const currentStatus = drive.status;
  const allowed = ALLOWED_DRIVE_TRANSITIONS[currentStatus] || [];

  if (!allowed.includes(newStatus)) {
    throw createError(
      `Drive status transition from "${currentStatus}" to "${newStatus}" is not permitted.`,
      400
    );
  }

  drive.status = newStatus;
  await drive.save();
  return drive;
}

/**
 * 8. Applicants List for Recruiter
 */
async function getRecruiterApplicants(
  userId,
  { driveId, status, search, program, minCgpa, page = 1, limit = 20 } = {}
) {
  const { companyId, unassigned } = await getRecruiterAuthorizedCompany(userId, { allowUnassigned: true });

  if (unassigned || !companyId) {
    return {
      applicants: [],
      summaryMetrics: {
        totalApplications: 0,
        underReview: 0,
        shortlisted: 0,
        interview: 0,
        selected: 0,
        rejected: 0,
      },
      pagination: { page: 1, limit: 20, total: 0, pages: 0 },
      drivesList: [],
      unassigned: true,
    };
  }

  // Get all drive IDs for this company
  const companyDrives = await PlacementDrive.find({ companyId }).select('_id title jobType').lean();
  const allCompanyDriveIds = companyDrives.map((d) => d._id);

  if (allCompanyDriveIds.length === 0) {
    return {
      applicants: [],
      summaryMetrics: {
        totalApplications: 0,
        underReview: 0,
        shortlisted: 0,
        interview: 0,
        selected: 0,
        rejected: 0,
      },
      pagination: { page: 1, limit: 20, total: 0, pages: 0 },
      drivesList: [],
    };
  }

  const query = {};

  if (driveId && driveId !== 'all') {
    // Verify driveId belongs to company
    const belongs = allCompanyDriveIds.some((id) => id.toString() === driveId.toString());
    if (!belongs) {
      throw createError('Requested drive does not belong to your authorized company', 403);
    }
    query.placementDriveId = driveId;
  } else {
    query.placementDriveId = { $in: allCompanyDriveIds };
  }

  if (status && status !== 'all') {
    query.status = status;
  }

  const safePage = Math.max(1, parseInt(page, 10) || 1);
  const safeLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
  const skip = (safePage - 1) * safeLimit;

  // Query applications
  const [allMatchedApps, total] = await Promise.all([
    Application.find(query)
      .populate({
        path: 'studentProfileId',
        select:
          'studentId fullName phone department degree graduationYear currentSemester cgpa backlogCount skills academics',
        populate: { path: 'userId', select: 'name email' },
      })
      .populate('placementDriveId', 'title jobType location applicationDeadline')
      .populate('resumeId', 'originalFilename sizeBytes uploadedAt')
      .sort({ appliedAt: -1 })
      .lean(),
    Application.countDocuments(query),
  ]);

  // In-memory search & filter for populated student fields (name, rollNo, program, minCgpa)
  let filtered = allMatchedApps;

  if (search && search.trim()) {
    const s = search.trim().toLowerCase();
    filtered = filtered.filter((app) => {
      const name = (app.studentProfileId?.fullName || app.studentProfileId?.userId?.name || '').toLowerCase();
      const rollNo = (app.studentProfileId?.studentId || '').toLowerCase();
      const email = (app.studentProfileId?.userId?.email || '').toLowerCase();
      const driveTitle = (app.placementDriveId?.title || '').toLowerCase();
      return name.includes(s) || rollNo.includes(s) || email.includes(s) || driveTitle.includes(s);
    });
  }

  if (program && program !== 'all') {
    const p = program.toLowerCase();
    filtered = filtered.filter(
      (app) =>
        (app.studentProfileId?.degree || '').toLowerCase().includes(p) ||
        (app.studentProfileId?.department || '').toLowerCase().includes(p)
    );
  }

  if (minCgpa != null && minCgpa !== '') {
    const threshold = parseFloat(minCgpa);
    if (!isNaN(threshold)) {
      filtered = filtered.filter((app) => (app.studentProfileId?.cgpa || 0) >= threshold);
    }
  }

  const filteredTotal = filtered.length;
  const paginatedApps = filtered.slice(skip, skip + safeLimit);

  // Compute summary metrics for company applications
  const statusAggregation = await Application.aggregate([
    { $match: { placementDriveId: { $in: allCompanyDriveIds } } },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  const summaryMetrics = {
    totalApplications: await Application.countDocuments({ placementDriveId: { $in: allCompanyDriveIds } }),
    underReview: 0,
    shortlisted: 0,
    interview: 0,
    selected: 0,
    rejected: 0,
    withdrawn: 0,
  };

  statusAggregation.forEach((item) => {
    if (item._id === 'under_review') summaryMetrics.underReview = item.count;
    if (item._id === 'shortlisted') summaryMetrics.shortlisted = item.count;
    if (item._id === 'interview') summaryMetrics.interview = item.count;
    if (item._id === 'selected') summaryMetrics.selected = item.count;
    if (item._id === 'rejected') summaryMetrics.rejected = item.count;
    if (item._id === 'withdrawn') summaryMetrics.withdrawn = item.count;
  });

  const formattedApplicants = paginatedApps.map((app) => ({
    _id: app._id,
    studentName: app.studentProfileId?.fullName || app.studentProfileId?.userId?.name || 'Applicant',
    studentEmail: app.studentProfileId?.userId?.email,
    rollNo: app.studentProfileId?.studentId || 'N/A',
    degree: app.studentProfileId?.degree || 'N/A',
    department: app.studentProfileId?.department || 'N/A',
    graduationYear: app.studentProfileId?.graduationYear || 'N/A',
    cgpa: app.studentProfileId?.cgpa != null ? app.studentProfileId.cgpa : null,
    activeBacklogs: app.studentProfileId?.backlogCount != null ? app.studentProfileId.backlogCount : 0,
    skills: app.studentProfileId?.skills || [],
    appliedDrive: app.placementDriveId?.title || 'Placement Drive',
    driveId: app.placementDriveId?._id,
    appliedAt: app.appliedAt,
    status: app.status,
    resumeId: app.resumeId?._id || null,
    resumeFilename: app.resumeId?.originalFilename || null,
  }));

  return {
    applicants: formattedApplicants,
    summaryMetrics,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total: filteredTotal,
      pages: Math.ceil(filteredTotal / safeLimit),
    },
    drivesList: companyDrives.map((d) => ({ _id: d._id, title: d.title })),
  };
}

/**
 * 9. Applicant Details (Single application + candidate profile)
 */
async function getRecruiterApplicantById(userId, applicationId) {
  const { companyId } = await getRecruiterAuthorizedCompany(userId);

  const application = await Application.findById(applicationId)
    .populate({
      path: 'placementDriveId',
      select: 'title description jobType location salary applicationDeadline status companyId',
    })
    .populate({
      path: 'studentProfileId',
      populate: { path: 'userId', select: 'name email createdAt' },
    })
    .populate('resumeId', 'originalFilename sizeBytes uploadedAt mimeType')
    .lean();

  if (!application) {
    throw createError('Application record not found', 404);
  }

  // Company authorization check: ensure the applied drive belongs to recruiter's company
  if (
    !application.placementDriveId ||
    application.placementDriveId.companyId.toString() !== companyId.toString()
  ) {
    throw createError('You are not authorized to view applicants for this company placement drive', 403);
  }

  // Fetch status history audit log
  const statusHistory = await RecruitmentStatus.find({ applicationId: application._id })
    .populate('changedBy', 'name role')
    .sort({ changedAt: 1 })
    .lean();

  const student = application.studentProfileId;

  return {
    application: {
      _id: application._id,
      status: application.status,
      appliedAt: application.appliedAt,
      eligibilityStatus: application.eligibilityStatus,
      reviewNotes: application.reviewNotes,
      interviewRound: application.interviewRound,
      placementDrive: application.placementDriveId,
      resume: application.resumeId,
      statusHistory: statusHistory.map((h) => ({
        _id: h._id,
        status: h.status,
        changedBy: h.changedBy?.name || 'Recruitment Team',
        note: h.note,
        changedAt: h.changedAt,
      })),
    },
    student: {
      _id: student?._id,
      fullName: student?.fullName || student?.userId?.name || 'Candidate',
      email: student?.userId?.email,
      phone: student?.phone || 'N/A',
      studentId: student?.studentId || 'N/A',
      degree: student?.degree || 'N/A',
      department: student?.department || 'N/A',
      graduationYear: student?.graduationYear || 'N/A',
      currentSemester: student?.currentSemester || 'N/A',
      cgpa: student?.cgpa != null ? student.cgpa : null,
      backlogCount: student?.backlogCount != null ? student.backlogCount : 0,
      skills: student?.skills || [],
      academics: student?.academics || null,
      projects: student?.projects || [],
      certifications: student?.certifications || [],
      isVerified: student?.isVerified || false,
    },
  };
}

/**
 * 10. Update Single Applicant Status (Shortlist, Interview, Select, Reject, Under Review)
 */
async function updateApplicantStatus(userId, applicationId, { status: newStatus, note, interviewRound }) {
  const { companyId } = await getRecruiterAuthorizedCompany(userId);

  const application = await Application.findById(applicationId).populate('placementDriveId');
  if (!application) {
    throw createError('Application record not found', 404);
  }

  if (
    !application.placementDriveId ||
    application.placementDriveId.companyId.toString() !== companyId.toString()
  ) {
    throw createError('You are not authorized to update applications for this drive', 403);
  }

  const currentStatus = application.status;
  const allowed = ALLOWED_APPLICATION_TRANSITIONS[currentStatus] || [];

  if (!allowed.includes(newStatus)) {
    throw createError(
      `Status transition from "${currentStatus}" to "${newStatus}" is not permitted.`,
      400
    );
  }

  application.status = newStatus;
  application.reviewedBy = userId;
  if (note) application.reviewNotes = note.trim();
  if (interviewRound) application.interviewRound = interviewRound.trim();
  await application.save();

  // Record audit history
  const historyEntry = await RecruitmentStatus.create({
    applicationId: application._id,
    status: newStatus,
    changedBy: userId,
    note: note ? note.trim() : `Status transitioned to ${newStatus}`,
    changedAt: new Date(),
  });

  return {
    application,
    historyEntry,
  };
}

/**
 * 11. Bulk Update Applicant Status (e.g. Bulk Shortlisting)
 */
async function bulkUpdateApplicantStatus(userId, { applicationIds, status: newStatus, note }) {
  const { companyId } = await getRecruiterAuthorizedCompany(userId);

  if (!Array.isArray(applicationIds) || applicationIds.length === 0) {
    throw createError('Please select at least one candidate application', 400);
  }

  // Find all requested applications
  const applications = await Application.find({ _id: { $in: applicationIds } }).populate('placementDriveId');

  let updatedCount = 0;
  const successfulIds = [];
  const errors = [];

  for (const app of applications) {
    if (
      !app.placementDriveId ||
      app.placementDriveId.companyId.toString() !== companyId.toString()
    ) {
      errors.push({ id: app._id, reason: 'Unauthorized for this company drive' });
      continue;
    }

    const currentStatus = app.status;
    const allowed = ALLOWED_APPLICATION_TRANSITIONS[currentStatus] || [];
    if (!allowed.includes(newStatus)) {
      errors.push({
        id: app._id,
        reason: `Cannot transition from ${currentStatus} to ${newStatus}`,
      });
      continue;
    }

    app.status = newStatus;
    app.reviewedBy = userId;
    if (note) app.reviewNotes = note.trim();
    await app.save();

    await RecruitmentStatus.create({
      applicationId: app._id,
      status: newStatus,
      changedBy: userId,
      note: note ? note.trim() : `Bulk update to ${newStatus}`,
      changedAt: new Date(),
    });

    successfulIds.push(app._id);
    updatedCount++;
  }

  return {
    updatedCount,
    successfulIds,
    errors,
  };
}

/**
 * 12. Shortlisting Workspace Data
 */
async function getRecruiterShortlistingData(userId, { driveId, search, minCgpa, page = 1, limit = 20 } = {}) {
  const { companyId, unassigned } = await getRecruiterAuthorizedCompany(userId, { allowUnassigned: true });

  if (unassigned || !companyId) {
    return {
      drives: [],
      selectedDriveId: null,
      candidates: [],
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        pages: 0,
      },
      unassigned: true,
    };
  }

  const companyDrives = await PlacementDrive.find({ companyId })
    .select('_id title applicationDeadline status')
    .sort({ createdAt: -1 })
    .lean();

  // Attach applicant and shortlisted counts to each drive
  const enrichedDrives = await Promise.all(
    companyDrives.map(async (d) => {
      const [total, shortlisted] = await Promise.all([
        Application.countDocuments({ placementDriveId: d._id }),
        Application.countDocuments({ placementDriveId: d._id, status: 'shortlisted' }),
      ]);
      return {
        ...d,
        totalApplicants: total,
        shortlistedCount: shortlisted,
      };
    })
  );

  // If no drive selected, default to the first active/available drive
  const selectedDriveId = driveId && driveId !== 'all' ? driveId : enrichedDrives[0]?._id;

  let candidates = [];
  let totalCandidates = 0;

  if (selectedDriveId) {
    const query = { placementDriveId: selectedDriveId };

    const rawCandidates = await Application.find(query)
      .populate({
        path: 'studentProfileId',
        select: 'studentId fullName phone department degree graduationYear currentSemester cgpa backlogCount skills',
        populate: { path: 'userId', select: 'name email' },
      })
      .populate('resumeId', 'originalFilename sizeBytes uploadedAt')
      .sort({ appliedAt: -1 })
      .lean();

    let filtered = rawCandidates;
    if (search && search.trim()) {
      const s = search.trim().toLowerCase();
      filtered = filtered.filter((c) => {
        const name = (c.studentProfileId?.fullName || c.studentProfileId?.userId?.name || '').toLowerCase();
        const roll = (c.studentProfileId?.studentId || '').toLowerCase();
        return name.includes(s) || roll.includes(s);
      });
    }

    if (minCgpa != null && minCgpa !== '') {
      const threshold = parseFloat(minCgpa);
      if (!isNaN(threshold)) {
        filtered = filtered.filter((c) => (c.studentProfileId?.cgpa || 0) >= threshold);
      }
    }

    totalCandidates = filtered.length;
    const safePage = Math.max(1, parseInt(page, 10) || 1);
    const safeLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (safePage - 1) * safeLimit;

    candidates = filtered.slice(skip, skip + safeLimit).map((app) => ({
      _id: app._id,
      studentName: app.studentProfileId?.fullName || app.studentProfileId?.userId?.name || 'Applicant',
      rollNo: app.studentProfileId?.studentId || 'N/A',
      degree: app.studentProfileId?.degree || 'N/A',
      department: app.studentProfileId?.department || 'N/A',
      graduationYear: app.studentProfileId?.graduationYear || 'N/A',
      cgpa: app.studentProfileId?.cgpa != null ? app.studentProfileId.cgpa : null,
      backlogCount: app.studentProfileId?.backlogCount != null ? app.studentProfileId.backlogCount : 0,
      skills: app.studentProfileId?.skills || [],
      appliedAt: app.appliedAt,
      status: app.status,
      resumeId: app.resumeId?._id,
      resumeFilename: app.resumeId?.originalFilename,
    }));
  }

  return {
    drives: enrichedDrives,
    selectedDriveId,
    candidates,
    pagination: {
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 20,
      total: totalCandidates,
      pages: Math.ceil(totalCandidates / (parseInt(limit, 10) || 20)),
    },
  };
}

/**
 * 13. Recruitment Status & Pipeline Monitoring
 */
async function getRecruiterPipelineSummary(userId, { driveId } = {}) {
  const { companyId, unassigned } = await getRecruiterAuthorizedCompany(userId, { allowUnassigned: true });

  if (unassigned || !companyId) {
    return {
      drivesList: [],
      pipelineCounts: {
        applied: 0,
        under_review: 0,
        shortlisted: 0,
        interview: 0,
        selected: 0,
        rejected: 0,
        withdrawn: 0,
      },
      candidates: [],
      totalApplications: 0,
      unassigned: true,
    };
  }

  const companyDrives = await PlacementDrive.find({ companyId }).select('_id title').lean();
  const allDriveIds = companyDrives.map((d) => d._id);

  const query = {};
  if (driveId && driveId !== 'all') {
    const belongs = allDriveIds.some((id) => id.toString() === driveId.toString());
    if (!belongs) {
      throw createError('Drive does not belong to your company', 403);
    }
    query.placementDriveId = driveId;
  } else {
    query.placementDriveId = { $in: allDriveIds };
  }

  const [applications, statusAggregation] = await Promise.all([
    Application.find(query)
      .populate({
        path: 'studentProfileId',
        select: 'studentId fullName department degree cgpa backlogCount',
        populate: { path: 'userId', select: 'name email' },
      })
      .populate('placementDriveId', 'title')
      .sort({ appliedAt: -1 })
      .lean(),
    Application.aggregate([
      { $match: query },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
  ]);

  const pipelineCounts = {
    applied: 0, // submitted
    under_review: 0,
    shortlisted: 0,
    interview: 0,
    selected: 0,
    rejected: 0,
    withdrawn: 0,
  };

  statusAggregation.forEach((item) => {
    if (item._id === 'submitted') pipelineCounts.applied = item.count;
    else if (pipelineCounts[item._id] !== undefined) {
      pipelineCounts[item._id] = item.count;
    }
  });

  const formattedCandidates = applications.map((app) => ({
    _id: app._id,
    studentName: app.studentProfileId?.fullName || app.studentProfileId?.userId?.name || 'Applicant',
    rollNo: app.studentProfileId?.studentId || 'N/A',
    driveTitle: app.placementDriveId?.title || 'Drive',
    appliedAt: app.appliedAt,
    status: app.status,
    interviewRound: app.interviewRound || null,
    updatedAt: app.updatedAt,
  }));

  return {
    drivesList: companyDrives,
    pipelineCounts,
    candidates: formattedCandidates,
    totalApplications: applications.length,
  };
}

module.exports = {
  getRecruiterAuthorizedCompany,
  getRecruiterDashboard,
  getRecruiterCompany,
  updateRecruiterCompany,
  getRecruiterDrives,
  getRecruiterDriveById,
  createRecruiterDrive,
  updateRecruiterDrive,
  updateRecruiterDriveStatus,
  getRecruiterApplicants,
  getRecruiterApplicantById,
  updateApplicantStatus,
  bulkUpdateApplicantStatus,
  getRecruiterShortlistingData,
  getRecruiterPipelineSummary,
};
