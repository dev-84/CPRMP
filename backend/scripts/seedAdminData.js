require('dotenv').config({
  path: require('path').resolve(__dirname, '../.env'),
});

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../src/models/User');
const StudentProfile = require('../src/models/StudentProfile');
const RecruiterProfile = require('../src/models/RecruiterProfile');
const Company = require('../src/models/Company');
const PlacementDrive = require('../src/models/PlacementDrive');
const EligibilityCriteria = require('../src/models/EligibilityCriteria');
const Application = require('../src/models/Application');
const PlacementHistory = require('../src/models/PlacementHistory');

async function seed() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is missing');
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('MongoDB connected for seeding admin data...');

  const defaultPasswordHash = await bcrypt.hash('Cprmp@2026!', 10);

  // 1. Ensure Admin exists
  let admin = await User.findOne({ email: 'admin@cprmp.edu' });
  if (!admin) {
    admin = await User.create({
      name: 'Dr. Rajesh Mehta',
      email: 'admin@cprmp.edu',
      passwordHash: defaultPasswordHash,
      role: 'admin',
      isActive: true,
    });
    console.log('Created admin:', admin.email);
  }

  // 2. Ensure Companies exist
  const companyData = [
    {
      name: 'Microsoft IDC',
      website: 'https://microsoft.com',
      industry: 'Cloud & AI Infrastructure',
      description: 'Global leader in software, cloud computing, and AI systems.',
      headquarters: 'Hyderabad, India',
      contactEmail: 'campus-india@microsoft.com',
      status: 'approved',
    },
    {
      name: 'Goldman Sachs',
      website: 'https://goldmansachs.com',
      industry: 'Financial Services & Tech',
      description: 'Premier global investment banking, securities, and investment management firm.',
      headquarters: 'Bengaluru, India',
      contactEmail: 'campus-recruitment@gs.com',
      status: 'approved',
    },
    {
      name: 'Google India',
      website: 'https://google.com',
      industry: 'Internet & Technology',
      description: 'Global tech enterprise specializing in search, cloud, advertising, and operating systems.',
      headquarters: 'Bengaluru, India',
      contactEmail: 'university-india@google.com',
      status: 'approved',
    },
    {
      name: 'Deloitte USI',
      website: 'https://deloitte.com',
      industry: 'Consulting & Technology',
      description: 'Industry-leading audit, consulting, tax, and advisory services.',
      headquarters: 'Hyderabad, India',
      contactEmail: 'deloitte-campus@deloitte.com',
      status: 'approved',
    },
    {
      name: 'Infosys',
      website: 'https://infosys.com',
      industry: 'IT & Software Services',
      description: 'Global leader in next-generation digital services and consulting.',
      headquarters: 'Bengaluru, India',
      contactEmail: 'campus-hiring@infosys.com',
      status: 'approved',
    },
  ];

  const companies = {};
  for (const c of companyData) {
    let comp = await Company.findOne({ name: c.name });
    if (!comp) {
      comp = await Company.create({ ...c, createdBy: admin._id });
      console.log('Created company:', comp.name);
    }
    companies[c.name] = comp;
  }

  // 3. Ensure Recruiters exist
  const recruiterData = [
    {
      name: 'Aditi Rao',
      email: 'recruiter@microsoft.com',
      companyName: 'Microsoft IDC',
      jobTitle: 'Senior University Talent Acquisition Lead',
      phone: '+91 98765 43210',
      isVerified: true,
    },
    {
      name: 'Vikram Sengupta',
      email: 'vikram.recruiter@gs.com',
      companyName: 'Goldman Sachs',
      jobTitle: 'Campus Recruitment Manager',
      phone: '+91 98765 43211',
      isVerified: true,
    },
    {
      name: 'Ananya Deshmukh',
      email: 'ananya.deshmukh@google.com',
      companyName: 'Google India',
      jobTitle: 'University Programs Specialist',
      phone: '+91 98765 43212',
      isVerified: true,
    },
    {
      name: 'Karan Malhotra',
      email: 'karan.malhotra@deloitte.com',
      companyName: 'Deloitte USI',
      jobTitle: 'Technology Campus Lead',
      phone: '+91 98765 43213',
      isVerified: true,
    },
    {
      name: 'Sunita Pillai',
      email: 'sunita.pillai@infosys.com',
      companyName: 'Infosys',
      jobTitle: 'Talent Acquisition Associate',
      phone: '+91 98765 43214',
      isVerified: false,
    },
  ];

  for (const r of recruiterData) {
    let user = await User.findOne({ email: r.email });
    if (!user) {
      user = await User.create({
        name: r.name,
        email: r.email,
        passwordHash: defaultPasswordHash,
        role: 'recruiter',
        isActive: true,
      });
      console.log('Created recruiter user:', user.email);
    }
    let profile = await RecruiterProfile.findOne({ userId: user._id });
    if (!profile) {
      profile = await RecruiterProfile.create({
        userId: user._id,
        companyId: companies[r.companyName]._id,
        jobTitle: r.jobTitle,
        phone: r.phone,
        isVerified: r.isVerified,
      });
      console.log('Created recruiter profile for:', r.name);
    }
  }

  // 4. Ensure Placement Drives exist
  const driveData = [
    {
      companyName: 'Microsoft IDC',
      title: 'Software Engineer — Cloud & AI Infrastructure',
      description: 'Join Azure Systems Core pod to build planetary-scale distributed services and generative AI tools.',
      jobType: 'Full-time',
      location: 'Hyderabad / Bengaluru (Hybrid)',
      salary: '₹32.0 LPA',
      applicationDeadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      driveDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      status: 'published',
      criteria: {
        minimumCgpa: 8.0,
        allowedDegrees: ['MCA', 'B.Tech', 'M.Tech', 'BCA'],
        allowedDepartments: ['Computer Science', 'Information Technology', 'Computer Applications'],
        graduationYears: [2026, 2027],
        maximumBacklogs: 0,
        requiredSkills: ['Data Structures', 'Algorithms', 'Java', 'Python', 'Cloud Computing'],
      },
    },
    {
      companyName: 'Goldman Sachs',
      title: 'Engineering Analyst (Core Systems & Quantitative Tech)',
      description: 'Develop low-latency trading infrastructure, risk models, and enterprise software platforms.',
      jobType: 'Full-time',
      location: 'Bengaluru (Onsite)',
      salary: '₹28.5 LPA',
      applicationDeadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      driveDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
      status: 'published',
      criteria: {
        minimumCgpa: 7.75,
        allowedDegrees: ['MCA', 'B.Tech', 'M.Tech'],
        allowedDepartments: ['Computer Science', 'Information Technology', 'Computer Applications'],
        graduationYears: [2026, 2027],
        maximumBacklogs: 0,
        requiredSkills: ['C++', 'Java', 'Algorithms', 'Distributed Systems'],
      },
    },
    {
      companyName: 'Google India',
      title: 'Associate Software Engineer (SWE)',
      description: 'Work on cutting-edge internet products, Android OS, Chrome, and Search backend infrastructure.',
      jobType: 'Full-time',
      location: 'Bengaluru / Hyderabad',
      salary: '₹36.0 LPA',
      applicationDeadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      driveDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
      status: 'published',
      criteria: {
        minimumCgpa: 8.5,
        allowedDegrees: ['MCA', 'B.Tech', 'M.Tech', 'M.Sc. IT'],
        allowedDepartments: ['Computer Science', 'Information Technology', 'Computer Applications'],
        graduationYears: [2026, 2027],
        maximumBacklogs: 0,
        requiredSkills: ['C++', 'Go', 'Python', 'Algorithms', 'System Design'],
      },
    },
    {
      companyName: 'Deloitte USI',
      title: 'Associate Analyst (Technology Consulting)',
      description: 'Design enterprise cloud solutions, SAP/Salesforce architectures, and cybersecurity frameworks.',
      jobType: 'Full-time',
      location: 'Hyderabad / Pune / Gurugram',
      salary: '₹14.2 LPA',
      applicationDeadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      driveDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
      status: 'published',
      criteria: {
        minimumCgpa: 6.5,
        allowedDegrees: ['MCA', 'B.Tech', 'BCA', 'B.Sc. IT', 'M.Sc. IT'],
        allowedDepartments: ['Computer Applications', 'Information Technology', 'Computer Science'],
        graduationYears: [2026, 2027],
        maximumBacklogs: 1,
        requiredSkills: ['SQL', 'Python', 'Cloud Basics', 'Communication'],
      },
    },
    {
      companyName: 'Infosys',
      title: 'Systems Specialist (Specialist Programmer)',
      description: 'Build enterprise digital applications, microservices, and AI workflow accelerators.',
      jobType: 'Full-time',
      location: 'Pune / Mysuru / Bengaluru',
      salary: '₹9.5 LPA',
      applicationDeadline: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // Closed drive
      driveDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      status: 'closed',
      criteria: {
        minimumCgpa: 6.0,
        allowedDegrees: ['MCA', 'B.Tech', 'BCA', 'B.Sc. IT'],
        allowedDepartments: ['Computer Applications', 'Information Technology', 'Computer Science'],
        graduationYears: [2026, 2027],
        maximumBacklogs: 2,
        requiredSkills: ['Java', 'SQL', 'Web Technologies'],
      },
    },
  ];

  const drives = {};
  for (const d of driveData) {
    let drive = await PlacementDrive.findOne({ title: d.title });
    if (!drive) {
      drive = await PlacementDrive.create({
        companyId: companies[d.companyName]._id,
        createdBy: admin._id,
        title: d.title,
        description: d.description,
        jobType: d.jobType,
        location: d.location,
        salary: d.salary,
        applicationDeadline: d.applicationDeadline,
        driveDate: d.driveDate,
        status: d.status,
      });
      console.log('Created drive:', drive.title);
    }
    let crit = await EligibilityCriteria.findOne({ placementDriveId: drive._id });
    if (!crit) {
      crit = await EligibilityCriteria.create({
        placementDriveId: drive._id,
        ...d.criteria,
      });
      console.log('Created criteria for:', drive.title);
    }
    drives[d.title] = drive;
  }

  // 5. Ensure Students across different programs exist
  const studentData = [
    {
      name: 'Aryan Sharma',
      email: 'aryan.sharma@cprmp.edu',
      studentId: 'MCA2024-042',
      prn: 'PRN202409842',
      degree: 'MCA',
      department: 'Department of Computer Applications',
      graduationYear: 2026,
      currentSemester: 4,
      cgpa: 8.84,
      backlogCount: 0,
      accountVerificationStatus: 'verified',
      placementVerificationStatus: 'verified',
    },
    {
      name: 'Pooja Reddy',
      email: 'pooja.reddy@cprmp.edu',
      studentId: 'BTECH-CS-102',
      prn: 'PRN202409102',
      degree: 'B.Tech',
      department: 'Computer Science & Engineering',
      graduationYear: 2026,
      currentSemester: 8,
      cgpa: 9.12,
      backlogCount: 0,
      accountVerificationStatus: 'verified',
      placementVerificationStatus: 'verified',
    },
    {
      name: 'Rohan Varma',
      email: 'rohan.varma@cprmp.edu',
      studentId: 'MCA2024-019',
      prn: 'PRN202409019',
      degree: 'MCA',
      department: 'Department of Computer Applications',
      graduationYear: 2026,
      currentSemester: 4,
      cgpa: 7.40,
      backlogCount: 1,
      accountVerificationStatus: 'verified',
      placementVerificationStatus: 'pending',
    },
    {
      name: 'Sneha Nair',
      email: 'sneha.nair@cprmp.edu',
      studentId: 'BTECH-IT-084',
      prn: 'PRN202409084',
      degree: 'B.Tech',
      department: 'Information Technology',
      graduationYear: 2026,
      currentSemester: 8,
      cgpa: 8.55,
      backlogCount: 0,
      accountVerificationStatus: 'verified',
      placementVerificationStatus: 'verified',
    },
    {
      name: 'Aditya Roy',
      email: 'aditya.roy@cprmp.edu',
      studentId: 'MTECH-CS-004',
      prn: 'PRN202409004',
      degree: 'M.Tech',
      department: 'Computer Science & Engineering',
      graduationYear: 2026,
      currentSemester: 4,
      cgpa: 8.90,
      backlogCount: 0,
      accountVerificationStatus: 'verified',
      placementVerificationStatus: 'verified',
    },
    {
      name: 'Kavita Patel',
      email: 'kavita.patel@cprmp.edu',
      studentId: 'BCA2024-055',
      prn: 'PRN202409055',
      degree: 'BCA',
      department: 'Department of Computer Applications',
      graduationYear: 2026,
      currentSemester: 6,
      cgpa: 8.20,
      backlogCount: 0,
      accountVerificationStatus: 'verified',
      placementVerificationStatus: 'verified',
    },
    {
      name: 'Deepak Joshi',
      email: 'deepak.joshi@cprmp.edu',
      studentId: 'MSCIT2024-012',
      prn: 'PRN202409012',
      degree: 'M.Sc. IT',
      department: 'Information Technology',
      graduationYear: 2026,
      currentSemester: 4,
      cgpa: 7.95,
      backlogCount: 0,
      accountVerificationStatus: 'verified',
      placementVerificationStatus: 'verified',
    },
    {
      name: 'Meera Iyer',
      email: 'meera.iyer@cprmp.edu',
      studentId: 'BSCIT2024-077',
      prn: 'PRN202409077',
      degree: 'B.Sc. IT',
      department: 'Information Technology',
      graduationYear: 2026,
      currentSemester: 6,
      cgpa: 7.15,
      backlogCount: 2,
      accountVerificationStatus: 'verified',
      placementVerificationStatus: 'pending',
    },
  ];

  const studentProfiles = {};
  for (const s of studentData) {
    let user = await User.findOne({ email: s.email });
    if (!user) {
      user = await User.create({
        name: s.name,
        email: s.email,
        passwordHash: defaultPasswordHash,
        role: 'student',
        isActive: true,
      });
      console.log('Created student user:', user.email);
    }
    let profile = await StudentProfile.findOne({ userId: user._id });
    if (!profile) {
      profile = await StudentProfile.create({
        userId: user._id,
        studentId: s.studentId,
        prn: s.prn,
        fullName: s.name,
        degree: s.degree,
        department: s.department,
        graduationYear: s.graduationYear,
        currentSemester: s.currentSemester,
        cgpa: s.cgpa,
        backlogCount: s.backlogCount,
        phone: '+91 91234 56789',
        collegeName: 'Devang Patel Institute of Advance Technology and Research (DPIATR)',
        accountVerificationStatus: s.accountVerificationStatus,
        placementVerificationStatus: s.placementVerificationStatus,
        skills: ['JavaScript', 'Python', 'SQL', 'Data Structures', 'Git'],
      });
      console.log('Created student profile for:', s.name);
    }
    studentProfiles[s.studentId] = profile;
  }

  // 6. Ensure Applications and Placement Histories exist
  const drive1 = drives['Software Engineer — Cloud & AI Infrastructure'];
  const drive2 = drives['Engineering Analyst (Core Systems & Quantitative Tech)'];
  const drive3 = drives['Associate Software Engineer (SWE)'];
  const drive4 = drives['Associate Analyst (Technology Consulting)'];
  const drive5 = drives['Systems Specialist (Specialist Programmer)'];

  const applicationSeeds = [
    // Aryan Sharma (Placed at Microsoft IDC, Signed Offer)
    {
      studentProfile: studentProfiles['MCA2024-042'],
      drive: drive1,
      status: 'selected',
      placed: true,
      company: companies['Microsoft IDC'],
      packageAmount: 3200000,
      tier: 'Super Dream',
      offerLetterStatus: 'signed',
      signedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    },
    // Pooja Reddy (Placed at Goldman Sachs, Signed Offer)
    {
      studentProfile: studentProfiles['BTECH-CS-102'],
      drive: drive2,
      status: 'selected',
      placed: true,
      company: companies['Goldman Sachs'],
      packageAmount: 2850000,
      tier: 'Super Dream',
      offerLetterStatus: 'signed',
      signedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    },
    // Aditya Roy (Placed at Google India, Offer Issued / Accepted)
    {
      studentProfile: studentProfiles['MTECH-CS-004'],
      drive: drive3,
      status: 'selected',
      placed: true,
      company: companies['Google India'],
      packageAmount: 3600000,
      tier: 'Super Dream',
      offerLetterStatus: 'accepted',
      signedAt: null,
    },
    // Sneha Nair (Placed at Deloitte USI, Signed Offer)
    {
      studentProfile: studentProfiles['BTECH-IT-084'],
      drive: drive4,
      status: 'selected',
      placed: true,
      company: companies['Deloitte USI'],
      packageAmount: 1420000,
      tier: 'Dream',
      offerLetterStatus: 'signed',
      signedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    },
    // Rohan Varma (Under Review at Infosys)
    {
      studentProfile: studentProfiles['MCA2024-019'],
      drive: drive5,
      status: 'under_review',
      placed: false,
    },
    // Kavita Patel (Shortlisted at Deloitte)
    {
      studentProfile: studentProfiles['BCA2024-055'],
      drive: drive4,
      status: 'shortlisted',
      placed: false,
    },
    // Deepak Joshi (Submitted at Microsoft)
    {
      studentProfile: studentProfiles['MSCIT2024-012'],
      drive: drive1,
      status: 'submitted',
      placed: false,
    },
  ];

  for (const item of applicationSeeds) {
    if (!item.studentProfile || !item.drive) continue;

    let app = await Application.findOne({
      studentProfileId: item.studentProfile._id,
      placementDriveId: item.drive._id,
    });

    if (!app) {
      app = await Application.create({
        studentProfileId: item.studentProfile._id,
        placementDriveId: item.drive._id,
        status: item.status,
        eligibilityStatus: 'eligible',
        appliedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      });
      console.log('Created application for:', item.studentProfile.studentId, 'on drive:', item.drive.title);
    }

    if (item.placed && item.company) {
      let history = await PlacementHistory.findOne({ applicationId: app._id });
      if (!history) {
        history = await PlacementHistory.create({
          studentProfileId: item.studentProfile._id,
          applicationId: app._id,
          companyId: item.company._id,
          placementDriveId: item.drive._id,
          jobTitle: item.drive.title,
          packageAmount: item.packageAmount,
          packageCurrency: 'INR',
          tier: item.tier,
          offerLetterStatus: item.offerLetterStatus,
          signedAt: item.signedAt,
          placedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        });
        console.log('Created placement record for:', item.studentProfile.studentId, 'at:', item.company.name);
      }
    }
  }

  console.log('Admin data seeding completed successfully!');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
