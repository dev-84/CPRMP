const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const RecruiterProfile = require('../models/RecruiterProfile');
const Company = require('../models/Company');
const PlacementDrive = require('../models/PlacementDrive');
const EligibilityCriteria = require('../models/EligibilityCriteria');
const Application = require('../models/Application');
const PlacementHistory = require('../models/PlacementHistory');
const Resume = require('../models/Resume');

function escapeRegex(text) {
  if (!text) return '';
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

/**
 * 1. Admin Dashboard Statistics & Analytics
 */
async function getDashboardStats() {
  const now = new Date();

  // Metrics from MongoDB
  const totalStudents = await StudentProfile.countDocuments();
  const totalRecruiters = await User.countDocuments({ role: 'recruiter' });
  const totalCompanies = await Company.countDocuments();
  const totalDrives = await PlacementDrive.countDocuments();
  const activeDrives = await PlacementDrive.countDocuments({
    status: 'published',
    applicationDeadline: { $gte: now },
  });
  const totalApplications = await Application.countDocuments();

  // Distinct students placed
  const distinctPlacedStudents = await PlacementHistory.distinct('studentProfileId');
  const studentsPlaced = distinctPlacedStudents.length;

  // Distinct students who have officially signed an offer letter
  const signedOfferHistories = await PlacementHistory.find({
    offerLetterStatus: 'signed',
  }).distinct('studentProfileId');
  const studentsWithSignedOffers = signedOfferHistories.length;

  // Placement Rate
  const placementRate = totalStudents > 0 ? Math.round((studentsPlaced / totalStudents) * 100) : 0;

  // Verified Students
  const verifiedStudents = await StudentProfile.countDocuments({
    placementVerificationStatus: 'verified',
  });

  // Students by Program Breakdown
  const programAggregation = await StudentProfile.aggregate([
    {
      $group: {
        _id: '$degree',
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
  ]);

  const studentsByProgram = programAggregation.map((p) => ({
    program: p._id || 'Unspecified',
    count: p.count,
  }));

  // Applications by Status Breakdown
  const appStatusAggregation = await Application.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
  ]);

  const applicationsByStatus = appStatusAggregation.map((a) => ({
    status: a._id || 'unknown',
    count: a.count,
  }));

  // Placement Drives by Status Breakdown
  const driveStatusAggregation = await PlacementDrive.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  const drivesByStatus = driveStatusAggregation.map((d) => ({
    status: d._id || 'unknown',
    count: d.count,
  }));

  // CTC Package Stats from PlacementHistory
  const packageStats = await PlacementHistory.aggregate([
    {
      $group: {
        _id: null,
        highestSalary: { $max: '$packageAmount' },
        avgSalary: { $avg: '$packageAmount' },
      },
    },
  ]);

  const highestPackage = packageStats.length > 0 && packageStats[0].highestSalary
    ? `₹${(packageStats[0].highestSalary / 100000).toFixed(1)} LPA`
    : 'Not Recorded';

  const averagePackage = packageStats.length > 0 && packageStats[0].avgSalary
    ? `₹${(packageStats[0].avgSalary / 100000).toFixed(1)} LPA`
    : 'Not Recorded';

  return {
    totalStudents,
    totalRecruiters,
    totalCompanies,
    totalDrives,
    activeDrives,
    totalApplications,
    studentsPlaced,
    studentsWithSignedOffers,
    placementRate,
    verifiedStudents,
    highestPackage,
    averagePackage,
    academicCycle: '2026–2027',
    charts: {
      studentsByProgram,
      applicationsByStatus,
      drivesByStatus,
    },
  };
}

/**
 * 2. Recent Administrative Activity Log
 */
async function getRecentActivity() {
  const recentEvents = [];

  // Recent applications
  const recentApps = await Application.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate({
      path: 'studentProfileId',
      select: 'fullName studentId degree',
    })
    .populate({
      path: 'placementDriveId',
      select: 'title companyId',
      populate: { path: 'companyId', select: 'name' },
    })
    .lean();

  for (const app of recentApps) {
    if (app.studentProfileId && app.placementDriveId) {
      recentEvents.push({
        id: `app-${app._id}`,
        type: 'application',
        title: 'New Drive Application',
        description: `${app.studentProfileId.fullName || app.studentProfileId.studentId} applied for ${app.placementDriveId.title} (${app.placementDriveId.companyId?.name || 'Company'}).`,
        status: app.status,
        timestamp: app.createdAt || app.appliedAt,
      });
    }
  }

  // Recent placement offers / records
  const recentPlacements = await PlacementHistory.find()
    .sort({ placedAt: -1 })
    .limit(4)
    .populate({
      path: 'studentProfileId',
      select: 'fullName studentId',
    })
    .populate({
      path: 'companyId',
      select: 'name',
    })
    .lean();

  for (const p of recentPlacements) {
    if (p.studentProfileId && p.companyId) {
      recentEvents.push({
        id: `place-${p._id}`,
        type: 'placement',
        title: 'Placement Offer Recorded',
        description: `${p.studentProfileId.fullName || p.studentProfileId.studentId} received offer at ${p.companyId.name} (${p.packageAmount ? `₹${(p.packageAmount / 100000).toFixed(1)} LPA` : 'CTC Finalized'}).`,
        status: p.offerLetterStatus === 'signed' ? 'Offer Signed' : 'Offer Issued',
        timestamp: p.placedAt || p.createdAt,
      });
    }
  }

  // Recent drives
  const recentDrives = await PlacementDrive.find()
    .sort({ createdAt: -1 })
    .limit(3)
    .populate({ path: 'companyId', select: 'name' })
    .lean();

  for (const d of recentDrives) {
    recentEvents.push({
      id: `drive-${d._id}`,
      type: 'drive',
      title: 'Placement Drive Created',
      description: `Drive scheduled for ${d.title} by ${d.companyId?.name || 'Corporate Partner'}.`,
      status: d.status,
      timestamp: d.createdAt,
    });
  }

  // Sort chronologically descending
  recentEvents.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  return recentEvents.slice(0, 8);
}

/**
 * 3. Upcoming / Active Placement Drives for Dashboard
 */
async function getUpcomingDrives(limit = 5) {
  const drives = await PlacementDrive.find({
    status: { $in: ['published', 'draft'] },
  })
    .sort({ applicationDeadline: 1 })
    .limit(limit)
    .populate({ path: 'companyId', select: 'name industry headquarters' })
    .lean();

  const enriched = await Promise.all(
    drives.map(async (d) => {
      const applicantsCount = await Application.countDocuments({
        placementDriveId: d._id,
      });
      return {
        id: d._id,
        company: d.companyId?.name || 'Authorized Partner',
        companyId: d.companyId?._id,
        role: d.title,
        salary: d.salary || 'Competitive',
        deadline: d.applicationDeadline,
        status: d.status,
        applicantsCount,
      };
    })
  );

  return enriched;
}

/**
 * 4. Student Management: Paginated Search & Filters with 4 Primary Summary Cards
 */
async function getStudents(options = {}) {
  const {
    search = '',
    program = 'all',
    department = 'all',
    graduationYear,
    minCgpa,
    maxCgpa,
    backlogStatus = 'all',
    placementStatus = 'all',
    offerSigned = 'all',
    verificationStatus = 'all',
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = options;

  const query = {};

  // Text search
  if (search.trim()) {
    const escaped = escapeRegex(search.trim());
    query.$or = [
      { fullName: { $regex: escaped, $options: 'i' } },
      { firstName: { $regex: escaped, $options: 'i' } },
      { lastName: { $regex: escaped, $options: 'i' } },
      { studentId: { $regex: escaped, $options: 'i' } },
      { prn: { $regex: escaped, $options: 'i' } },
      { personalEmail: { $regex: escaped, $options: 'i' } },
      { collegeName: { $regex: escaped, $options: 'i' } },
    ];
  }

  // Program / Degree filter
  if (program && program !== 'all') {
    query.degree = { $regex: new RegExp(`^${escapeRegex(program)}$`, 'i') };
  }

  // Department filter
  if (department && department !== 'all') {
    query.department = { $regex: new RegExp(escapeRegex(department), 'i') };
  }

  // Graduation Year
  if (graduationYear && !isNaN(Number(graduationYear))) {
    query.graduationYear = Number(graduationYear);
  }

  // CGPA range
  if (minCgpa !== undefined && minCgpa !== '' && !isNaN(Number(minCgpa))) {
    query.cgpa = { ...(query.cgpa || {}), $gte: Number(minCgpa) };
  }
  if (maxCgpa !== undefined && maxCgpa !== '' && !isNaN(Number(maxCgpa))) {
    query.cgpa = { ...(query.cgpa || {}), $lte: Number(maxCgpa) };
  }

  // Backlog status
  if (backlogStatus === 'clear') {
    query.backlogCount = 0;
  } else if (backlogStatus === 'with_backlogs') {
    query.backlogCount = { $gt: 0 };
  }

  // Verification status
  if (verificationStatus && verificationStatus !== 'all') {
    query.placementVerificationStatus = verificationStatus;
  }

  // Execute query with pagination
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
  const skip = (pageNum - 1) * limitNum;

  const sortDirection = sortOrder === 'asc' ? 1 : -1;
  const sortCriteria = {};
  if (sortBy === 'name') {
    sortCriteria.fullName = sortDirection;
  } else if (sortBy === 'rollNo') {
    sortCriteria.studentId = sortDirection;
  } else if (sortBy === 'cgpa') {
    sortCriteria.cgpa = sortDirection;
  } else if (sortBy === 'backlogs') {
    sortCriteria.backlogCount = sortDirection;
  } else {
    sortCriteria[sortBy] = sortDirection;
  }

  const [studentDocs, totalRecords] = await Promise.all([
    StudentProfile.find(query)
      .sort(sortCriteria)
      .skip(skip)
      .limit(limitNum)
      .populate({ path: 'userId', select: 'name email role isActive' })
      .lean(),
    StudentProfile.countDocuments(query),
  ]);

  // Enrich each student with applied drives, placement record, and signed offer status
  const enrichedStudents = await Promise.all(
    studentDocs.map(async (student) => {
      const studentIdObj = student._id;

      // Applied drives count
      const appliedDrivesCount = await Application.countDocuments({
        studentProfileId: studentIdObj,
      });

      // Placement history
      const placementRecord = await PlacementHistory.findOne({
        studentProfileId: studentIdObj,
      })
        .populate({ path: 'companyId', select: 'name' })
        .lean();

      // Offer letter signed check
      let offerLetterSigned = 'No';
      if (placementRecord) {
        if (placementRecord.offerLetterStatus === 'signed') {
          offerLetterSigned = 'Yes';
        } else if (placementRecord.offerLetterStatus === 'issued' || placementRecord.offerLetterStatus === 'accepted') {
          offerLetterSigned = 'Pending';
        }
      }

      // Placement status
      let derivedStatus = 'Not Placed';
      if (placementRecord) {
        derivedStatus = placementRecord.offerLetterStatus === 'signed' ? 'Placed (Signed)' : 'Offer Issued';
      } else {
        const latestApp = await Application.findOne({ studentProfileId: studentIdObj }).sort({ updatedAt: -1 }).lean();
        if (latestApp) {
          if (latestApp.status === 'selected') derivedStatus = 'Selected';
          else if (latestApp.status === 'shortlisted') derivedStatus = 'Shortlisted';
          else if (latestApp.status === 'under_review') derivedStatus = 'Under Review';
          else derivedStatus = 'Applied';
        }
      }

      // Resume check
      const resumeDoc = await Resume.findOne({ studentProfileId: studentIdObj, isActive: true }).lean();

      return {
        id: student._id,
        name: student.fullName || student.userId?.name || 'Unnamed Student',
        rollNo: student.studentId,
        prn: student.prn || 'Not Provided',
        email: student.personalEmail || student.userId?.email || 'N/A',
        program: student.degree || 'Unspecified',
        department: student.department || 'General',
        graduationYear: student.graduationYear,
        currentSemester: student.currentSemester,
        cgpa: typeof student.cgpa === 'number' ? student.cgpa : null,
        activeBacklogs: student.backlogCount ?? 0,
        appliedDrivesCount,
        offerLetterSigned,
        placementStatus: derivedStatus,
        verificationStatus: student.placementVerificationStatus || 'pending',
        hasResume: !!(resumeDoc || student.resume?.filename),
        phone: student.phone || 'N/A',
        createdAt: student.createdAt,
      };
    })
  );

  // Apply in-memory secondary filters if requested (placementStatus & offerSigned)
  let filtered = enrichedStudents;
  if (placementStatus && placementStatus !== 'all') {
    filtered = filtered.filter((s) => s.placementStatus.toLowerCase().includes(placementStatus.toLowerCase()));
  }
  if (offerSigned && offerSigned !== 'all') {
    filtered = filtered.filter((s) => (offerSigned === 'yes' ? s.offerLetterSigned === 'Yes' : s.offerLetterSigned !== 'Yes'));
  }

  // Four Primary Summary Cards Data
  const allStudentsTotal = await StudentProfile.countDocuments();
  const programBreakdownAgg = await StudentProfile.aggregate([
    { $group: { _id: '$degree', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);
  const distinctSignedStudents = await PlacementHistory.find({ offerLetterStatus: 'signed' }).distinct('studentProfileId');
  const studentsWithBacklogsCount = await StudentProfile.countDocuments({ backlogCount: { $gt: 0 } });
  const studentsZeroBacklogsCount = await StudentProfile.countDocuments({ backlogCount: 0 });

  return {
    students: filtered,
    pagination: {
      totalRecords,
      totalPages: Math.ceil(totalRecords / limitNum),
      currentPage: pageNum,
      pageSize: limitNum,
    },
    summaryCards: {
      totalStudents: allStudentsTotal,
      programBreakdown: programBreakdownAgg.map((p) => ({ program: p._id || 'Unspecified', count: p.count })),
      signedOfferLetters: distinctSignedStudents.length,
      studentsWithActiveBacklogs: studentsWithBacklogsCount,
      studentsWithZeroBacklogs: studentsZeroBacklogsCount,
    },
  };
}

/**
 * 5. Student Details by ID
 */
async function getStudentById(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw { statusCode: 400, message: 'Invalid Student ID format' };
  }

  const student = await StudentProfile.findById(id)
    .populate({ path: 'userId', select: 'name email role isActive lastLoginAt' })
    .lean();

  if (!student) {
    throw { statusCode: 404, message: 'Student profile not found' };
  }

  // Applications
  const applications = await Application.find({ studentProfileId: student._id })
    .populate({
      path: 'placementDriveId',
      select: 'title salary location applicationDeadline companyId status',
      populate: { path: 'companyId', select: 'name industry' },
    })
    .sort({ createdAt: -1 })
    .lean();

  // Placement history / offer letters
  const placementHistory = await PlacementHistory.find({ studentProfileId: student._id })
    .populate({ path: 'companyId', select: 'name industry headquarters' })
    .populate({ path: 'placementDriveId', select: 'title' })
    .lean();

  // Active resume
  const activeResume = await Resume.findOne({ studentProfileId: student._id, isActive: true }).lean();

  return {
    ...student,
    applications,
    placementHistory,
    activeResume,
  };
}

/**
 * 6. Update Student Verification Clearance
 */
async function updateStudentVerification(id, { placementVerificationStatus, accountVerificationStatus }) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw { statusCode: 400, message: 'Invalid Student ID' };
  }

  const update = {};
  if (placementVerificationStatus) {
    update.placementVerificationStatus = placementVerificationStatus;
  }
  if (accountVerificationStatus) {
    update.accountVerificationStatus = accountVerificationStatus;
  }

  const updated = await StudentProfile.findByIdAndUpdate(id, { $set: update }, { new: true });
  if (!updated) {
    throw { statusCode: 404, message: 'Student profile not found' };
  }
  return updated;
}

/**
 * 7. Recruiter Management: Paginated Search & Filters
 */
async function getRecruiters(options = {}) {
  const {
    search = '',
    status = 'all',
    isVerified = 'all',
    page = 1,
    limit = 10,
  } = options;

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
  const skip = (pageNum - 1) * limitNum;

  // Find recruiter users first
  const userQuery = { role: 'recruiter' };
  if (status === 'active') userQuery.isActive = true;
  if (status === 'inactive') userQuery.isActive = false;

  const recruiterUsers = await User.find(userQuery).select('name email isActive createdAt').lean();
  const userIds = recruiterUsers.map((u) => u._id);

  // RecruiterProfile query
  const profileQuery = { userId: { $in: userIds } };
  if (isVerified === 'verified') profileQuery.isVerified = true;
  if (isVerified === 'pending') profileQuery.isVerified = false;

  const [profiles, totalProfiles] = await Promise.all([
    RecruiterProfile.find(profileQuery)
      .skip(skip)
      .limit(limitNum)
      .populate({ path: 'userId', select: 'name email isActive createdAt' })
      .populate({ path: 'companyId', select: 'name industry headquarters contactEmail status' })
      .lean(),
    RecruiterProfile.countDocuments(profileQuery),
  ]);

  // Enrich with active drives & applicant count
  const enriched = await Promise.all(
    profiles.map(async (prof) => {
      let activeDrivesCount = 0;
      let totalApplicantsCount = 0;

      if (prof.companyId?._id) {
        activeDrivesCount = await PlacementDrive.countDocuments({
          companyId: prof.companyId._id,
          status: 'published',
        });

        const drives = await PlacementDrive.find({ companyId: prof.companyId._id }).select('_id');
        const driveIds = drives.map((d) => d._id);
        totalApplicantsCount = await Application.countDocuments({
          placementDriveId: { $in: driveIds },
        });
      }

      return {
        id: prof._id,
        userId: prof.userId?._id,
        name: prof.userId?.name || 'Recruiter',
        email: prof.userId?.email || 'N/A',
        jobTitle: prof.jobTitle || 'Talent Acquisition',
        phone: prof.phone || 'N/A',
        company: prof.companyId?.name || 'Not Assigned',
        companyId: prof.companyId?._id || null,
        companyIndustry: prof.companyId?.industry || 'N/A',
        isVerified: prof.isVerified,
        accountStatus: prof.userId?.isActive ? 'Active' : 'Inactive',
        activeDrivesCount,
        totalApplicantsCount,
        createdAt: prof.createdAt || prof.userId?.createdAt,
      };
    })
  );

  // Filter by search term if provided
  let filtered = enriched;
  if (search.trim()) {
    const s = search.toLowerCase().trim();
    filtered = filtered.filter(
      (r) =>
        r.name.toLowerCase().includes(s) ||
        r.email.toLowerCase().includes(s) ||
        r.company.toLowerCase().includes(s) ||
        r.jobTitle.toLowerCase().includes(s)
    );
  }

  // Summary Metrics
  const totalRecruiters = await User.countDocuments({ role: 'recruiter' });
  const activeRecruiters = await User.countDocuments({ role: 'recruiter', isActive: true });
  const pendingVerification = await RecruiterProfile.countDocuments({ isVerified: false });
  const companiesRepresented = (await RecruiterProfile.distinct('companyId')).length;

  return {
    recruiters: filtered,
    pagination: {
      totalRecords: totalProfiles,
      totalPages: Math.ceil(totalProfiles / limitNum),
      currentPage: pageNum,
      pageSize: limitNum,
    },
    metrics: {
      totalRecruiters,
      activeRecruiters,
      pendingVerification,
      companiesRepresented,
    },
  };
}

/**
 * 8. Create Recruiter Account & Profile
 */
async function createRecruiter({
  name,
  email,
  password,
  companyId,
  companyName,
  jobTitle,
  phone,
  isVerified = true,
}) {
  if (!name || !email || !password) {
    throw { statusCode: 400, message: 'Name, email, and password are required' };
  }

  const existing = await User.findOne({ email: email.toLowerCase().trim() });
  if (existing) {
    throw { statusCode: 400, message: 'An account with this email address already exists' };
  }

  // Resolve or create company
  let targetCompanyId = companyId;
  if (!targetCompanyId && companyName) {
    let comp = await Company.findOne({ name: companyName.trim() });
    if (!comp) {
      // Find an admin user to assign as creator
      const adminUser = await User.findOne({ role: 'admin' });
      comp = await Company.create({
        name: companyName.trim(),
        contactEmail: email.toLowerCase().trim(),
        status: 'approved',
        createdBy: adminUser?._id || new mongoose.Types.ObjectId(),
      });
    }
    targetCompanyId = comp._id;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    passwordHash,
    role: 'recruiter',
    isActive: true,
  });

  const profile = await RecruiterProfile.create({
    userId: user._id,
    companyId: targetCompanyId,
    jobTitle: jobTitle?.trim() || 'Recruiter',
    phone: phone?.trim(),
    isVerified: !!isVerified,
  });

  return { user, profile };
}

/**
 * 9. Update Recruiter Profile / Account Status
 */
async function updateRecruiter(id, data) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw { statusCode: 400, message: 'Invalid Recruiter ID' };
  }

  const profile = await RecruiterProfile.findById(id);
  if (!profile) {
    throw { statusCode: 404, message: 'Recruiter profile not found' };
  }

  if (data.jobTitle !== undefined) profile.jobTitle = data.jobTitle;
  if (data.phone !== undefined) profile.phone = data.phone;
  if (data.isVerified !== undefined) profile.isVerified = data.isVerified;
  if (data.companyId !== undefined) profile.companyId = data.companyId;

  await profile.save();

  if (data.accountStatus !== undefined) {
    await User.findByIdAndUpdate(profile.userId, {
      isActive: data.accountStatus === 'Active' || data.accountStatus === true,
    });
  }

  return profile;
}

/**
 * 10. Placement Drives Management: Search, Filters & Metrics
 */
async function getDrives(options = {}) {
  const {
    search = '',
    status = 'all',
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = options;

  const query = {};

  if (status && status !== 'all') {
    query.status = status;
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
  const skip = (pageNum - 1) * limitNum;

  const [drives, totalDrives] = await Promise.all([
    PlacementDrive.find(query)
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limitNum)
      .populate({ path: 'companyId', select: 'name industry headquarters contactEmail' })
      .lean(),
    PlacementDrive.countDocuments(query),
  ]);

  // Enrich with criteria and applicants count
  const enriched = await Promise.all(
    drives.map(async (d) => {
      const criteria = await EligibilityCriteria.findOne({ placementDriveId: d._id }).lean();
      const applicantsCount = await Application.countDocuments({ placementDriveId: d._id });

      return {
        id: d._id,
        title: d.title,
        company: d.companyId?.name || 'Authorized Partner',
        companyId: d.companyId?._id,
        companyIndustry: d.companyId?.industry,
        jobType: d.jobType || 'Full-time',
        location: d.location || 'Onsite / Hybrid',
        salary: d.salary || 'Competitive',
        applicationDeadline: d.applicationDeadline,
        driveDate: d.driveDate,
        status: d.status,
        applicantsCount,
        criteria: {
          minCgpa: criteria?.minimumCgpa ?? 'Not Specified',
          maxBacklogs: criteria?.maximumBacklogs ?? 'Not Specified',
          allowedDegrees: criteria?.allowedDegrees || [],
          graduationYears: criteria?.graduationYears || [],
          requiredSkills: criteria?.requiredSkills || [],
        },
        createdAt: d.createdAt,
      };
    })
  );

  // Search filter
  let filtered = enriched;
  if (search.trim()) {
    const s = search.toLowerCase().trim();
    filtered = filtered.filter(
      (d) =>
        d.title.toLowerCase().includes(s) ||
        d.company.toLowerCase().includes(s) ||
        (typeof d.salary === 'string' && d.salary.toLowerCase().includes(s)) ||
        d.location.toLowerCase().includes(s)
    );
  }

  // Summary Metrics
  const now = new Date();
  const allDrivesTotal = await PlacementDrive.countDocuments();
  const publishedDrives = await PlacementDrive.countDocuments({ status: 'published', applicationDeadline: { $gte: now } });
  const draftDrives = await PlacementDrive.countDocuments({ status: 'draft' });
  const closedDrives = await PlacementDrive.countDocuments({
    $or: [{ status: 'closed' }, { applicationDeadline: { $lt: now } }],
  });
  const totalAppsAcrossDrives = await Application.countDocuments();

  return {
    drives: filtered,
    pagination: {
      totalRecords: totalDrives,
      totalPages: Math.ceil(totalDrives / limitNum),
      currentPage: pageNum,
      pageSize: limitNum,
    },
    metrics: {
      totalDrives: allDrivesTotal,
      publishedDrives,
      draftDrives,
      closedDrives,
      totalApplications: totalAppsAcrossDrives,
    },
  };
}

/**
 * 11. Create Placement Drive & Eligibility Criteria
 */
async function createDrive(data, adminUserId) {
  const {
    companyId,
    companyName,
    title,
    description,
    jobType = 'Full-time',
    location = 'Onsite',
    salary,
    applicationDeadline,
    driveDate,
    status = 'published',
    minimumCgpa = 7.0,
    maximumBacklogs = 0,
    allowedDegrees = ['MCA', 'B.Tech'],
    allowedDepartments = ['Computer Science', 'Information Technology', 'Computer Applications'],
    graduationYears = [2026, 2027],
    requiredSkills = [],
  } = data;

  if (!title || !description || !applicationDeadline) {
    throw { statusCode: 400, message: 'Title, description, and application deadline are required' };
  }

  // Resolve Company
  let targetCompanyId = companyId;
  if (!targetCompanyId && companyName) {
    let comp = await Company.findOne({ name: companyName.trim() });
    if (!comp) {
      comp = await Company.create({
        name: companyName.trim(),
        status: 'approved',
        createdBy: adminUserId,
      });
    }
    targetCompanyId = comp._id;
  }

  if (!targetCompanyId) {
    // Pick first company
    const firstComp = await Company.findOne();
    targetCompanyId = firstComp?._id;
  }

  const drive = await PlacementDrive.create({
    companyId: targetCompanyId,
    createdBy: adminUserId,
    title: title.trim(),
    description: description.trim(),
    jobType,
    location,
    salary: salary || 'Competitive CTC',
    applicationDeadline: new Date(applicationDeadline),
    driveDate: driveDate ? new Date(driveDate) : null,
    status,
  });

  const criteria = await EligibilityCriteria.create({
    placementDriveId: drive._id,
    minimumCgpa: Number(minimumCgpa) || 0,
    maximumBacklogs: Number(maximumBacklogs) || 0,
    allowedDegrees: Array.isArray(allowedDegrees) ? allowedDegrees : [allowedDegrees],
    allowedDepartments: Array.isArray(allowedDepartments) ? allowedDepartments : [allowedDepartments],
    graduationYears: Array.isArray(graduationYears) ? graduationYears.map(Number) : [2026, 2027],
    requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : [],
  });

  return { drive, criteria };
}

/**
 * 12. Update Placement Drive & Criteria
 */
async function updateDrive(id, data) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw { statusCode: 400, message: 'Invalid Drive ID' };
  }

  const updateFields = {};
  if (data.title) updateFields.title = data.title.trim();
  if (data.description) updateFields.description = data.description.trim();
  if (data.jobType) updateFields.jobType = data.jobType;
  if (data.location) updateFields.location = data.location;
  if (data.salary) updateFields.salary = data.salary;
  if (data.applicationDeadline) updateFields.applicationDeadline = new Date(data.applicationDeadline);
  if (data.driveDate) updateFields.driveDate = new Date(data.driveDate);
  if (data.status) updateFields.status = data.status;

  const drive = await PlacementDrive.findByIdAndUpdate(id, { $set: updateFields }, { new: true });
  if (!drive) {
    throw { statusCode: 404, message: 'Placement drive not found' };
  }

  // Update criteria if provided
  if (
    data.minimumCgpa !== undefined ||
    data.maximumBacklogs !== undefined ||
    data.allowedDegrees !== undefined ||
    data.graduationYears !== undefined ||
    data.requiredSkills !== undefined
  ) {
    const criteriaUpdate = {};
    if (data.minimumCgpa !== undefined) criteriaUpdate.minimumCgpa = Number(data.minimumCgpa);
    if (data.maximumBacklogs !== undefined) criteriaUpdate.maximumBacklogs = Number(data.maximumBacklogs);
    if (data.allowedDegrees !== undefined) criteriaUpdate.allowedDegrees = data.allowedDegrees;
    if (data.graduationYears !== undefined) criteriaUpdate.graduationYears = data.graduationYears.map(Number);
    if (data.requiredSkills !== undefined) criteriaUpdate.requiredSkills = data.requiredSkills;

    await EligibilityCriteria.findOneAndUpdate(
      { placementDriveId: drive._id },
      { $set: criteriaUpdate },
      { upsert: true }
    );
  }

  return drive;
}

/**
 * 13. Get Companies List for Select Dropdowns
 */
async function getCompaniesList() {
  return Company.find().select('name industry contactEmail headquarters status').sort({ name: 1 }).lean();
}

module.exports = {
  getDashboardStats,
  getRecentActivity,
  getUpcomingDrives,
  getStudents,
  getStudentById,
  updateStudentVerification,
  getRecruiters,
  createRecruiter,
  updateRecruiter,
  getDrives,
  createDrive,
  updateDrive,
  getCompaniesList,
};
