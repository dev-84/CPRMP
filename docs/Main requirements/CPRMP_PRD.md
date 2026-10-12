# Product Requirements Document (PRD)

## Product: Campus Placement and Recruitment Management Portal (CPRMP)

### Tagline

**Connecting Students, Colleges, and Recruiters — One Placement Cycle, One Platform.**

---

## 1. Problem

Campus placement activities are often managed using spreadsheets, emails, WhatsApp messages, notice boards, and manual eligibility checking.

This creates problems such as:

- Difficult manual eligibility checking.
- Students may miss placement opportunities or deadlines.
- Duplicate applications can occur.
- Recruiters receive inconsistent candidate information.
- Placement officers have difficulty tracking applications and recruitment status.
- Student placement history is difficult to maintain centrally.

**CPRMP solves this by providing one centralized platform for managing the campus placement lifecycle.**

---

## 2. Target Users

### 1. Student

Students can:

- Create and manage their profile.
- Upload and manage their resume.
- View available placement drives.
- Check their eligibility.
- Apply for eligible drives.
- Track application status.
- View final selection and placement information.

### 2. Admin / Placement Officer

Admin can:

- Manage students.
- Manage recruiters and companies.
- Create and manage placement drives.
- Define eligibility criteria.
- Monitor applications.
- Manage shortlisting and selection.
- Maintain placement records.

### 3. Recruiter

Recruiters can:

- Manage company information.
- Create/manage recruitment requirements through placement drives.
- View eligible applicants for their company's drives.
- Shortlist candidates.
- Update recruitment outcomes.

---

## 3. Goal

Create a centralized web-based platform that manages the campus placement process from **student registration and resume management to application, shortlisting, selection, and placement tracking**.

The system should reduce manual work and provide clear visibility to students, administrators, and recruiters.

---

## 4. Core Value Proposition

CPRMP provides:

- Centralized placement information.
- Deterministic eligibility checking.
- Duplicate application prevention.
- Application and recruitment status tracking.
- Centralized student and company information.
- AI-assisted resume–job matching and skill-gap analysis.

**Important:** AI matching is only an assistive feature. It does not override the official eligibility rules.

---

# 5. Core Functional Modules

The project will contain the following meaningful functional modules:

1. **Authentication & Role Management**
2. **Student Registration & Profile Management**
3. **Resume Management**
4. **Company Management**
5. **Placement Drive Management**
6. **Eligibility Management**
7. **Application Management**
8. **Applicant Management & Shortlisting**
9. **Selection & Placement Tracking**
10. **AI Resume–Job Matching & Skill Gap Analysis**

Future/P1 modules may include:

11. Notification & Announcement Management
12. Test & Interview Management
13. Reports & Analytics
14. Search & Filtering

---

# 6. MVP

The first working version should include:

### Authentication

- Student login
- Admin login
- Recruiter login
- Role-based access

### Student

- Student registration
- Student profile
- Resume upload
- Resume management
- View placement drives
- Automatic eligibility checking
- Apply for placement drive
- Track application status

### Admin

- Manage students
- Manage companies
- Approve/manage recruiters
- Create placement drives
- Define eligibility criteria
- Monitor applications
- Manage selection and placement records

### Recruiter

- Company/recruiter profile
- View own placement drives
- View applicants
- Shortlist candidates
- Update candidate recruitment status

### AI

- Extract/identify relevant resume skills
- Compare resume skills with job requirements
- Generate match score
- Identify missing skills
- Provide skill improvement suggestions

---

# 7. Out of Scope — First Version

The following features will **not** be included in the first version:

- Email/SMS/push notifications
- Online aptitude tests
- Online coding tests
- Automated interview scheduling
- Video interviews
- Native mobile application
- Payment/subscription system
- Advanced predictive analytics
- University ERP integration
- Third-party HR system integration
- Multi-college/multi-tenant deployment
- Advanced automated resume parsing

These can be considered for future versions.

---

# 8. Success Criteria

The MVP will be considered successful when:

1. A student can create an account.
2. A student can log in securely.
3. A student can create/update their profile.
4. A student can upload a resume.
5. Admin can create a company.
6. Admin can create a placement drive.
7. Admin can define eligibility criteria.
8. The system can determine whether a student is eligible.
9. An eligible student can apply for a placement drive.
10. The system prevents duplicate applications.
11. Recruiters can view applicants for their company's drives.
12. Recruiters can shortlist candidates.
13. Admin/recruiter can update recruitment outcomes.
14. The system can maintain selected/placed student records.
15. AI can compare a student's resume with a job description and show matched/missing skills.

---

# 9. Main User Flow
```
Student Registration
        ↓
Student Profile
        ↓
Resume Upload
        ↓
Placement Drive Published
        ↓
Eligibility Check
        ↓
Eligible?
   ┌────┴────┐
   │         │
  Yes        No
   ↓         ↓
Apply      Cannot Apply
   ↓
Recruiter Views Applicants
   ↓
Shortlisting
   ↓
Selection Process
   ↓
Selected / Rejected
   ↓
Placement History
```

---

# 10. AI User Flow
```
Student Resume
      ↓
Resume Data / Skills
      ↓
Job Description
      ↓
Skill Comparison
      ↓
AI Matching
      ↓
┌─────────────────────────┐
│ Match Score             │
│ Matched Skills          │
│ Missing Skills          │
│ Improvement Suggestions │
└─────────────────────────┘
```

**AI output is advisory only. Official eligibility is determined by the system's eligibility rules.**

---

# 11. MVP Boundary

### Must Have — P0

- Authentication
- Student Profile
- Resume Management
- Company Management
- Placement Drives
- Eligibility Checking
- Applications
- Applicant Management
- Shortlisting
- Selection/Placement Tracking
- AI Resume–Job Matching

### Important — P1

- Notifications
- Test & Interview Management
- Reports & Analytics
- Search & Filtering

### Future — P2

- Email/SMS integration
- Online aptitude tests
- Coding tests
- Video interviews
- Mobile application
- Predictive analytics
- ERP integration

---

# 12. One-Sentence Product Definition

**CPRMP is a centralized web-based campus placement management platform that connects students, placement administrators, and recruiters while managing eligibility, applications, recruitment, selection, placement tracking, and AI-assisted resume–job matching.**
