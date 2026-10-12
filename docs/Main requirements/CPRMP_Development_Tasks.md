# CPRMP — Development Tasks

## Project

**Campus Placement and Recruitment Management Portal (CPRMP)**

**Development Approach:** Task-by-task implementation

> **Important:** Never ask AI/Cursor to build the entire application in one prompt. Work on one task at a time.

---

# 1. Task Execution Workflow

Every task must follow:

```text
TASK-XXX
    ↓
Read Relevant Documentation
    ↓
Inspect Existing Code
    ↓
Make a Plan
    ↓
Implement
    ↓
Test
    ↓
Review
    ↓
Git Commit
    ↓
Mark Complete
    ↓
Next Task
```

### Rules

- Complete tasks in dependency order.
- Do not skip testing.
- Do not start the next major task while the current task has critical failures.
- Keep each task small enough to understand and review.
- If a task becomes too large, split it into smaller subtasks.
- Update this file when a task is completed.

---

# Phase 1 — Project Setup

## TASK-001 — Initialize Project

- [ ] Create `cprmp` root directory
- [ ] Initialize Git repository
- [ ] Create GitHub repository
- [ ] Connect local repository to GitHub
- [ ] Create initial `README.md`
- [ ] Create `.gitignore`
- [ ] Create `docs/` directory
- [ ] Initial Git commit

**Test:**

```bash
git status
git remote -v
```

---

## TASK-002 — Create Project Structure

- [ ] Create `frontend/`
- [ ] Create `backend/`
- [ ] Create `ai-module/`
- [ ] Create `docs/`
- [ ] Create required source directories
- [ ] Verify folder structure

Expected:

```text
cprmp/
├── frontend/
├── backend/
├── ai-module/
├── docs/
├── .gitignore
└── README.md
```

---

## TASK-003 — Initialize React Frontend

- [ ] Create React + Vite application
- [ ] Configure frontend package
- [ ] Verify development server
- [ ] Remove unnecessary starter code
- [ ] Create basic application structure

**Test:**

```bash
npm run dev
```

---

## TASK-004 — Configure Tailwind CSS

- [ ] Configure Tailwind CSS
- [ ] Configure project styling
- [ ] Add design-system colors
- [ ] Configure typography
- [ ] Verify Tailwind classes

Follow `DESIGN.md`.

---

## TASK-005 — Initialize Node.js Backend

- [ ] Initialize backend package
- [ ] Install Express
- [ ] Create `server.js`
- [ ] Create `app.js`
- [ ] Create basic API route
- [ ] Configure environment variables
- [ ] Add centralized error handling

**Test:**

```text
GET /api/health
→ 200 OK
```

---

## TASK-006 — Configure MySQL

- [ ] Create MySQL database
- [ ] Configure database connection
- [ ] Create database configuration
- [ ] Add database environment variables
- [ ] Test connection

**Test:**

```text
Backend → MySQL
Connection successful
```

---

## TASK-007 — Configure Development Tools

- [ ] Configure ESLint if required
- [ ] Configure formatting rules
- [ ] Configure Postman
- [ ] Configure Jest/Supertest
- [ ] Verify Node.js environment
- [ ] Verify Python environment

---

## TASK-008 — Create Project Documentation

- [ ] Add `PRD.md`
- [ ] Add `ARCHITECTURE.md`
- [ ] Add `DESIGN.md`
- [ ] Add `RULES.md`
- [ ] Add `TASKS.md`
- [ ] Verify documentation consistency

---

# Phase 2 — Database Design

## TASK-009 — Design Database Schema

Create the initial schema for:

- [ ] User
- [ ] StudentProfile
- [ ] Resume
- [ ] RecruiterProfile
- [ ] Company
- [ ] PlacementDrive
- [ ] EligibilityCriteria
- [ ] Application
- [ ] RecruitmentStatus
- [ ] PlacementHistory
- [ ] AIMatchResult

---

## TASK-010 — Create Database Tables

- [ ] Create User table
- [ ] Create StudentProfile table
- [ ] Create Resume table
- [ ] Create RecruiterProfile table
- [ ] Create Company table
- [ ] Create PlacementDrive table
- [ ] Create EligibilityCriteria table
- [ ] Create Application table
- [ ] Create RecruitmentStatus table
- [ ] Create PlacementHistory table
- [ ] Create AIMatchResult table

---

## TASK-011 — Configure Database Relationships

- [ ] Define primary keys
- [ ] Define foreign keys
- [ ] Define unique constraints
- [ ] Define required fields
- [ ] Verify relationships
- [ ] Test sample queries

---

# Phase 3 — Authentication & Role Management

## TASK-012 — Create User Authentication Backend

- [ ] Create User model/repository
- [ ] Create registration service
- [ ] Implement bcrypt password hashing
- [ ] Implement login service
- [ ] Implement JWT generation
- [ ] Create authentication routes
- [ ] Add validation

---

## TASK-013 — Create Authentication Middleware

- [ ] Create JWT middleware
- [ ] Verify tokens
- [ ] Extract user identity
- [ ] Handle invalid tokens
- [ ] Handle expired tokens

---

## TASK-014 — Create Role Authorization

Implement:

- [ ] Student authorization
- [ ] Admin authorization
- [ ] Recruiter authorization
- [ ] Resource ownership checks

---

## TASK-015 — Create Login UI

- [ ] Create login page
- [ ] Add email/username field
- [ ] Add password field
- [ ] Add validation
- [ ] Add loading state
- [ ] Add error state
- [ ] Connect to login API

---

## TASK-016 — Create Registration UI

- [ ] Create registration page
- [ ] Add required fields
- [ ] Add validation
- [ ] Connect registration API
- [ ] Handle success state
- [ ] Handle error state

---

## TASK-017 — Protect Frontend Routes

- [ ] Create authentication context/state
- [ ] Create protected routes
- [ ] Create role-based routes
- [ ] Redirect unauthorized users
- [ ] Test Student/Admin/Recruiter access

---

## TASK-018 — Test Authentication

- [ ] Test valid registration
- [ ] Test duplicate email
- [ ] Test invalid password
- [ ] Test valid login
- [ ] Test invalid login
- [ ] Test expired token
- [ ] Test invalid token
- [ ] Test role authorization

---

# Phase 4 — Student Registration & Profile

## TASK-019 — Create Student Profile Backend

- [ ] Create student profile service
- [ ] Create profile API
- [ ] Create update profile API
- [ ] Validate student information
- [ ] Protect student profile APIs

---

## TASK-020 — Create Student Profile UI

- [ ] Create profile page
- [ ] Display student information
- [ ] Add edit functionality
- [ ] Add validation
- [ ] Add loading state
- [ ] Add error state
- [ ] Add success state

---

## TASK-021 — Test Student Profile

- [ ] Create profile
- [ ] View profile
- [ ] Update profile
- [ ] Test invalid input
- [ ] Test unauthorized access

---

# Phase 5 — Resume Management

## TASK-022 — Create Resume Upload Backend

- [ ] Create resume upload endpoint
- [ ] Validate file type
- [ ] Validate file size
- [ ] Store file reference/path
- [ ] Save resume metadata
- [ ] Protect resume access

---

## TASK-023 — Create Resume UI

- [ ] Create resume upload component
- [ ] Display current resume
- [ ] Add upload button
- [ ] Add replace/update functionality
- [ ] Add validation messages
- [ ] Add loading state

---

## TASK-024 — Test Resume Management

- [ ] Test valid upload
- [ ] Test invalid file
- [ ] Test oversized file
- [ ] Test resume replacement
- [ ] Test unauthorized access

---

# Phase 6 — Company Management

## TASK-025 — Create Company Backend

- [ ] Create Company model/repository
- [ ] Create company service
- [ ] Create company APIs
- [ ] Add validation
- [ ] Add authorization

---

## TASK-026 — Create Company Management UI

- [ ] Company list
- [ ] Company details
- [ ] Create company
- [ ] Edit company
- [ ] Deactivate company if required
- [ ] Add loading/empty/error states

---

## TASK-027 — Test Company Management

- [ ] Create company
- [ ] View company
- [ ] Edit company
- [ ] Test validation
- [ ] Test Admin authorization

---

# Phase 7 — Placement Drive Management

## TASK-028 — Create Placement Drive Backend

- [ ] Create PlacementDrive model/repository
- [ ] Create drive service
- [ ] Create drive API
- [ ] Add company relationship
- [ ] Add application deadline
- [ ] Add drive status

---

## TASK-029 — Create Eligibility Criteria Backend

- [ ] Add course criteria
- [ ] Add branch criteria
- [ ] Add CGPA criteria
- [ ] Add percentage criteria
- [ ] Add backlog criteria
- [ ] Add passing-year criteria

---

## TASK-030 — Create Placement Drive UI

- [ ] Create drive form
- [ ] Create drive list
- [ ] Create drive details
- [ ] Add eligibility criteria
- [ ] Add deadline
- [ ] Add validation
- [ ] Add loading/empty/error states

---

## TASK-031 — Test Placement Drives

- [ ] Create drive
- [ ] Edit drive
- [ ] View drive
- [ ] Test deadline
- [ ] Test eligibility criteria
- [ ] Test Admin authorization

---

# Phase 8 — Eligibility Management

## TASK-032 — Build Eligibility Engine

Implement deterministic eligibility checking:

```text
Student Profile
      +
Placement Criteria
      ↓
Eligibility Service
      ↓
Eligible / Not Eligible
```

- [ ] Course check
- [ ] Branch check
- [ ] CGPA check
- [ ] Percentage check
- [ ] Backlog check
- [ ] Passing-year check
- [ ] Return clear eligibility result

---

## TASK-033 — Integrate Eligibility with Frontend

- [ ] Display eligibility status
- [ ] Display eligibility reasons
- [ ] Disable Apply when not eligible
- [ ] Ensure backend still validates eligibility

---

## TASK-034 — Test Eligibility Engine

Test:

- [ ] Fully eligible student
- [ ] Wrong course
- [ ] Wrong branch
- [ ] Low CGPA
- [ ] Low percentage
- [ ] Backlog restriction
- [ ] Wrong passing year
- [ ] Multiple failed criteria

---

# Phase 9 — Application Management

## TASK-035 — Create Application Backend

- [ ] Create Application model/repository
- [ ] Create application service
- [ ] Create application API
- [ ] Verify student authentication
- [ ] Verify drive status
- [ ] Verify deadline
- [ ] Verify eligibility
- [ ] Prevent duplicate applications

---

## TASK-036 — Create Student Application UI

- [ ] Add Apply button
- [ ] Add confirmation
- [ ] Submit application
- [ ] Display application status
- [ ] Create My Applications page

---

## TASK-037 — Test Applications

- [ ] Valid application
- [ ] Ineligible student
- [ ] Closed drive
- [ ] Expired deadline
- [ ] Duplicate application
- [ ] Unauthorized request

---

# Phase 10 — Applicant Management & Shortlisting

## TASK-038 — Create Applicant Backend

- [ ] Create applicant listing API
- [ ] Filter applicants by drive
- [ ] Verify recruiter authorization
- [ ] Verify company ownership
- [ ] Return required applicant information

---

## TASK-039 — Create Shortlisting Backend

- [ ] Create shortlist operation
- [ ] Update recruitment status
- [ ] Prevent unauthorized changes
- [ ] Add validation

---

## TASK-040 — Create Recruiter Applicant UI

- [ ] Applicant list
- [ ] Applicant details
- [ ] Resume access
- [ ] Shortlist action
- [ ] Status display
- [ ] Search/filter where required

---

## TASK-041 — Test Applicant Management

- [ ] Recruiter views own applicants
- [ ] Recruiter cannot view another company's applicants
- [ ] Shortlist candidate
- [ ] Verify status update
- [ ] Test unauthorized access

---

# Phase 11 — Selection & Placement Tracking

## TASK-042 — Create Recruitment Status System

Define statuses such as:

```text
Applied
Under Review
Shortlisted
Interview
Selected
Rejected
```

- [ ] Create status model/repository
- [ ] Create status service
- [ ] Add status history
- [ ] Validate status changes

---

## TASK-043 — Create Selection Management

- [ ] Mark candidate selected
- [ ] Mark candidate rejected
- [ ] Store final outcome
- [ ] Record relevant selection information

---

## TASK-044 — Create Placement History

- [ ] Create PlacementHistory model/repository
- [ ] Store selected company
- [ ] Store placement drive
- [ ] Store placement outcome
- [ ] Display placement history to student

---

## TASK-045 — Test Selection & Placement

- [ ] Test shortlist
- [ ] Test selection
- [ ] Test rejection
- [ ] Test placement history
- [ ] Test unauthorized changes

---

# Phase 12 — AI Resume–Job Matching

## TASK-046 — Prepare AI Module

- [ ] Initialize Python environment
- [ ] Create `requirements.txt`
- [ ] Configure Python project
- [ ] Install Pandas
- [ ] Install NumPy
- [ ] Install Scikit-learn
- [ ] Create AI module structure

---

## TASK-047 — Extract Resume Skills

- [ ] Read resume data
- [ ] Identify relevant skills
- [ ] Normalize skill names
- [ ] Prepare structured skill data

Keep the first implementation lightweight.

---

## TASK-048 — Create Job Skill Extraction

- [ ] Read placement drive/job description
- [ ] Identify required skills
- [ ] Normalize skill names
- [ ] Prepare job skill list

---

## TASK-049 — Implement Resume–Job Matching

Compare:

```text
Resume Skills
      +
Job Skills
      ↓
Matching Algorithm
      ↓
Match Score
Matched Skills
Missing Skills
```

- [ ] Calculate match score
- [ ] Identify matched skills
- [ ] Identify missing skills
- [ ] Generate improvement suggestions

---

## TASK-050 — Connect AI Module to Backend

- [ ] Create AI API/interface
- [ ] Send resume/job data
- [ ] Receive AI result
- [ ] Validate AI response
- [ ] Store AIMatchResult
- [ ] Handle AI errors

---

## TASK-051 — Create AI Matching UI

- [ ] Create AI matching page/component
- [ ] Display match score
- [ ] Display matched skills
- [ ] Display missing skills
- [ ] Display suggestions
- [ ] Add loading state
- [ ] Add error state
- [ ] Clearly label AI output as assistive

---

## TASK-052 — Test AI Matching

- [ ] Test high skill match
- [ ] Test low skill match
- [ ] Test missing skills
- [ ] Test empty skill list
- [ ] Test invalid input
- [ ] Verify AI never changes eligibility

---

# Phase 13 — Dashboards

## TASK-053 — Student Dashboard

- [ ] Dashboard layout
- [ ] Profile summary
- [ ] Resume status
- [ ] Available drives
- [ ] Application summary
- [ ] Placement status
- [ ] Responsive design

---

## TASK-054 — Admin Dashboard

- [ ] Dashboard layout
- [ ] Student statistics
- [ ] Company statistics
- [ ] Placement drive summary
- [ ] Application summary
- [ ] Selection summary
- [ ] Responsive design

---

## TASK-055 — Recruiter Dashboard

- [ ] Dashboard layout
- [ ] Company information
- [ ] Placement drive summary
- [ ] Applicant summary
- [ ] Shortlisting summary
- [ ] Recruitment status
- [ ] Responsive design

---

# Phase 14 — UI/UX Consistency

## TASK-056 — Apply Design System

- [ ] Verify Inter typography
- [ ] Verify color system
- [ ] Verify button styles
- [ ] Verify card styles
- [ ] Verify form styles
- [ ] Verify status badges
- [ ] Verify spacing
- [ ] Verify border radius

---

## TASK-057 — Responsive Testing

Test:

- [ ] Mobile
- [ ] Tablet
- [ ] Desktop

Check:

- [ ] Navigation
- [ ] Forms
- [ ] Tables
- [ ] Cards
- [ ] Dashboards
- [ ] Modals
- [ ] Buttons

---

## TASK-058 — UX State Review

Verify all major screens have:

- [ ] Loading states
- [ ] Empty states
- [ ] Error states
- [ ] Success feedback
- [ ] Validation messages

---

# Phase 15 — Security Testing

## TASK-059 — Authentication Security Review

- [ ] Verify password hashing
- [ ] Verify JWT validation
- [ ] Verify protected APIs
- [ ] Verify token handling
- [ ] Verify logout behavior
- [ ] Check sensitive data exposure

---

## TASK-060 — Authorization Security Review

Test:

- [ ] Student accessing Admin API
- [ ] Student accessing Recruiter API
- [ ] Recruiter accessing another company's data
- [ ] Unauthorized application modification
- [ ] Unauthorized placement modification

---

## TASK-061 — Input & File Security Review

- [ ] Validate all important inputs
- [ ] Validate resume file type
- [ ] Validate resume file size
- [ ] Check environment variables
- [ ] Check secrets
- [ ] Check error responses
- [ ] Check exposed database information

---

# Phase 16 — Testing

## TASK-062 — Backend Unit Tests

Test:

- [ ] Authentication services
- [ ] Eligibility service
- [ ] Application service
- [ ] Placement drive service
- [ ] Shortlisting service
- [ ] Placement service
- [ ] AI matching service

---

## TASK-063 — API Integration Tests

Test major APIs:

- [ ] Authentication
- [ ] Student
- [ ] Resume
- [ ] Company
- [ ] Placement Drive
- [ ] Eligibility
- [ ] Application
- [ ] Applicant
- [ ] Placement
- [ ] AI

---

## TASK-064 — End-to-End Manual Testing

Complete the full workflow:

```text
Student Registration
       ↓
Login
       ↓
Profile
       ↓
Resume Upload
       ↓
Placement Drive
       ↓
Eligibility
       ↓
Application
       ↓
Recruiter Review
       ↓
Shortlisting
       ↓
Selection
       ↓
Placement History
```

---

# Phase 17 — Final Integration

## TASK-065 — Integrate All Modules

- [ ] Verify frontend/backend communication
- [ ] Verify database relationships
- [ ] Verify authentication across modules
- [ ] Verify authorization across modules
- [ ] Verify eligibility flow
- [ ] Verify application flow
- [ ] Verify recruitment flow
- [ ] Verify AI flow

---

## TASK-066 — Fix Integration Issues

- [ ] Fix API errors
- [ ] Fix UI errors
- [ ] Fix database errors
- [ ] Fix authentication issues
- [ ] Fix authorization issues
- [ ] Fix validation issues
- [ ] Fix responsive issues

---

# Phase 18 — Documentation

## TASK-067 — Update API Documentation

- [ ] Document authentication APIs
- [ ] Document student APIs
- [ ] Document resume APIs
- [ ] Document company APIs
- [ ] Document drive APIs
- [ ] Document eligibility APIs
- [ ] Document application APIs
- [ ] Document recruitment APIs
- [ ] Document AI APIs

---

## TASK-068 — Update Database Documentation

- [ ] Document entities
- [ ] Document relationships
- [ ] Document important constraints
- [ ] Add ER diagram
- [ ] Verify documentation matches database

---

## TASK-069 — Update README

README should include:

- [ ] Project overview
- [ ] Features
- [ ] Technology stack
- [ ] Architecture overview
- [ ] Installation instructions
- [ ] Environment variables
- [ ] Running instructions
- [ ] Testing instructions
- [ ] Team members

---

# Phase 19 — Deployment

## TASK-070 — Prepare Production Configuration

- [ ] Configure production environment variables
- [ ] Verify frontend build
- [ ] Verify backend production configuration
- [ ] Verify database configuration
- [ ] Verify file storage configuration
- [ ] Verify AI module configuration

---

## TASK-071 — Deploy Backend

- [ ] Deploy Node.js/Express backend
- [ ] Configure environment variables
- [ ] Connect production database
- [ ] Test health endpoint
- [ ] Test APIs

---

## TASK-072 — Deploy Frontend

- [ ] Build React application
- [ ] Configure backend API URL
- [ ] Deploy frontend
- [ ] Test frontend/backend communication

---

## TASK-073 — Deploy AI Module

- [ ] Deploy/configure AI service
- [ ] Connect backend
- [ ] Test AI endpoint
- [ ] Test error handling

---

# Phase 20 — Final Project Review

## TASK-074 — Functional Review

Verify:

- [ ] All P0 modules work
- [ ] Student workflow works
- [ ] Admin workflow works
- [ ] Recruiter workflow works
- [ ] AI matching works
- [ ] Eligibility works correctly
- [ ] Duplicate applications are prevented

---

## TASK-075 — UI/UX Review

- [ ] Design system is consistent
- [ ] Responsive layout works
- [ ] Loading states work
- [ ] Empty states work
- [ ] Error states work
- [ ] Forms are accessible
- [ ] Navigation is consistent

---

## TASK-076 — Code Review

- [ ] No unnecessary duplicate logic
- [ ] No unused code
- [ ] No hardcoded secrets
- [ ] No unrelated files changed
- [ ] Business logic is separated
- [ ] API structure is consistent
- [ ] Code follows `RULES.md`

---

## TASK-077 — Final Git Review

- [ ] Check `git status`
- [ ] Review Git diff
- [ ] Remove accidental files
- [ ] Verify `.env` is ignored
- [ ] Commit final changes
- [ ] Push to GitHub
- [ ] Verify GitHub repository

---

# 3. Task Status Convention

Use:

```text
[ ] Not Started
[x] Completed
```

Example:

```text
## TASK-001 — Initialize Project

- [x] Create cprmp directory
- [x] Initialize Git
- [x] Create GitHub repository
- [x] Connect repository
- [x] Initial commit
```

Do not mark a task complete until it has been **implemented, tested, reviewed, and committed**.

---

# 4. AI/Cursor Task Prompt Format

When asking Cursor to implement a task, use this structure:

```text
TASK-XXX: <Task Name>

Read these documents first:
- PRD.md
- ARCHITECTURE.md
- DESIGN.md
- RULES.md
- TASKS.md

Objective:
<Describe exactly what this task should accomplish.>

Requirements:
- <Requirement 1>
- <Requirement 2>
- <Requirement 3>

Constraints:
- Do not modify unrelated files.
- Follow ARCHITECTURE.md.
- Follow DESIGN.md.
- Follow RULES.md.
- Reuse existing functionality.
- Do not implement future tasks.

Before coding:
1. Inspect the existing implementation.
2. Identify files that need to change.
3. Explain your implementation plan.

Then:
1. Implement the task.
2. Run relevant tests.
3. Fix failures.
4. Review the changes.
5. Summarize what was changed.
```

---

# 5. Golden Rule

Never do this:

```text
"Cursor, build the entire CPRMP application."
```

Instead:

```text
TASK-001
   ↓
Implement
   ↓
Test
   ↓
Review
   ↓
Commit
   ↓
TASK-002
   ↓
Implement
   ↓
Test
   ↓
Review
   ↓
Commit
   ↓
...
```

---

# 6. Development Priority

The recommended implementation order is:

```text
Setup
  ↓
Database
  ↓
Authentication
  ↓
Student Profile
  ↓
Resume
  ↓
Company
  ↓
Placement Drives
  ↓
Eligibility
  ↓
Applications
  ↓
Shortlisting
  ↓
Selection / Placement
  ↓
AI Matching
  ↓
Dashboards
  ↓
Testing
  ↓
Documentation
  ↓
Deployment
```

**TASKS.md = WHAT WE BUILD, ONE STEP AT A TIME.**