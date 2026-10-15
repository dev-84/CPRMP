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

- [x] Create `cprmp` root directory
- [x] Initialize Git repository
- [x] Create GitHub repository
- [x] Connect local repository to GitHub
- [x] Create initial `README.md`
- [x] Create `.gitignore`
- [x] Create `docs/` directory
- [x] Initial Git commit

**Test:**

```bash
git status
git remote -v
```

---

## TASK-002 — Create Project Structure

- [x] Create `frontend/`
- [x] Create `backend/`
- [x] Create `docs/`
- [x] Create required source directories
- [x] Verify folder structure

Expected:

```text
cprmp/
├── frontend/
├── backend/
├── docs/
├── .gitignore
└── README.md
```

---

## TASK-003 — Initialize React Frontend

- [x] Create React + Vite application
- [x] Configure frontend package
- [x] Verify development server
- [x] Remove unnecessary starter code
- [x] Create basic application structure

**Test:**

```bash
npm run dev
```

---

## TASK-004 — Configure Tailwind CSS

- [x] Configure Tailwind CSS v4 with the Vite plugin
- [x] Configure project styling entry point
- [x] Add design-system color, typography, and radius tokens
- [x] Verify Tailwind utility classes
- [x] Run ESLint and production build

**Verified:** Tailwind CSS `4.3.3`, `@tailwindcss/vite` `4.3.3`. ESLint passed, production build passed, and browser rendering was checked.

**Follow-up:** Align landing-page accents with the documented indigo palette and review primary-action contrast in a separate styling task.

---

## TASK-005 — Initialize Node.js Backend

- [x] Initialize backend package
- [x] Install Express
- [x] Create `server.js`
- [x] Create `app.js`
- [x] Create basic API route
- [x] Configure environment variables
- [x] Add centralized error handling

**Completion Verification:**

- [x] Implementation and manual API checks passed
- [x] JavaScript syntax checks passed
- [x] Git commit created
- [x] Push to `origin/main` verified
- [x] Working tree confirmed clean
- MongoDB connectivity has not been configured or verified as part of this task.

**Status:** Completed — implementation, verification, Git commit, and remote push confirmed.

**Git Commit:** `1a62ebb` — `feat: initialize Express backend`

---


## TASK-006 — Configure MongoDB

- [x] Confirm MongoDB Community Server is installed and running
- [x] Verify the local MongoDB connection using `mongosh`
- [x] Install and configure Mongoose in the backend
- [x] Create the database connection module
- [x] Add the MongoDB connection string to backend environment variables
- [x] Connect the Express application to MongoDB
- [x] Handle connection success and failure safely
- [x] Verify the connection from the backend

**Completion Verification:**

- [x] MongoDB service confirmed running
- [x] Local connection verified using `mongosh`
- [x] Mongoose 9.11.2 installed
- [x] Backend connected successfully to MongoDB
- [x] Express starts only after a successful database connection
- [x] Health endpoint returned `status: ok`
- [x] Unknown route returned HTTP 404
- [x] JavaScript syntax checks passed
- [x] Local `.env` confirmed ignored by Git
- [x] Implementation staged and staged diff checks passed

**Note:** MongoDB access control is disabled in the current local setup. This configuration is for local development only, not production.

**Status:** Implementation, runtime verification, commit, and remote push completed.

**Git Commit:** `5ae32ba` — `feat: configure MongoDB connection`

---

## TASK-007 — Configure Development Tools

- [x] Configure ESLint if required — existing frontend ESLint configuration retained; frontend lint previously passed
- [x] Configure formatting rules — root `.editorconfig` added
- [x] Configure Postman — `CPRMP API Tests` collection created with the `Health Check` request
- [x] Configure Jest/Supertest — Jest configured in `backend/jest.config.js`; test script added to `backend/package.json`
- [x] Verify Node.js environment — Node.js v24.14.1 and npm v11.11.0; JavaScript execution verified
- [x] Verify Python environment — Python 3.14.3 available through both `python` and `py`

**Verification completed so far:**
- `npm test --prefix .\backend` — 2 integration tests passed (health endpoint and unknown-route 404).
- Postman `GET http://localhost:5000/api/health` — HTTP 200 with the expected JSON response.
- `git diff --check` — no whitespace errors; line-ending warnings were reported.

**Status:** Development tools configured, tested, committed, and pushed. Latest commit: `7886dc4` — `chore: configure development tools`.

---

## TASK-008 — Create Project Documentation

- [x] Verify the existing `CPRMP_PRD.md`
- [x] Verify the existing `CPRMP_Architecture_Documentation.md`
- [x] Verify the existing `CPRMP_Design_System_Documentation.md`
- [x] Verify the existing `CPRMP_AI_Development_Rules.md`
- [x] Verify the existing `CPRMP_Development_Tasks.md`
- [x] Verify the existing `CPRMP_Architecture_Decisions.md`
- [x] Verify the existing `CPRMP_Environment_Variables.md`
- [x] Verify the existing `CPRMP_Security_Requirements.md`
- [x] Verify the existing `CPRMP_Test_Plan.md`
- [x] Verify the existing `CPRMP_MEMORY.md`
- [x] Verify documentation consistency
- [x] Review the final documentation diff
- [x] Commit the reviewed documentation changes
- [x] Push to GitHub and verify the remote

---

# Phase 2 — Database Design

## TASK-009 — Design Database Schema

Create the initial schema for:

- [x] User
- [x] StudentProfile
- [x] Resume
- [x] RecruiterProfile
- [x] Company
- [x] PlacementDrive
- [x] EligibilityCriteria
- [x] Application
- [x] RecruitmentStatus
- [x] PlacementHistory
- [x] AIMatchResult

---

## TASK-010 — Create MongoDB Models and Collections

- [x] Create User Mongoose model/collection
- [x] Create StudentProfile model/collection
- [x] Create Resume model/collection
- [x] Create RecruiterProfile model/collection
- [x] Create Company model/collection
- [x] Create PlacementDrive model/collection
- [x] Create EligibilityCriteria model/collection
- [x] Create Application model/collection
- [x] Create RecruitmentStatus model/collection
- [x] Create PlacementHistory model/collection
- [x] Create AIMatchResult model/collection
- [x] Verify collections are created as documents are inserted

---

## TASK-011 — Configure MongoDB References, Validation, and Indexes

- [x] Define document identifiers and Mongoose references where appropriate
- [x] Decide which relationships use references and which use embedded documents
- [x] Define unique indexes where required (for example, user email)
- [x] Define required fields and Mongoose schema validation
- [x] Add indexes for frequently queried fields where justified
- [x] Verify references and validation behavior
- [x] Test sample queries and duplicate prevention

---

# Phase 3 — Authentication & Role Management


## TASK-012 — Create User Authentication Backend

- [x] Create User model/repository
- [x] Create registration service
- [x] Implement bcrypt password hashing
- [x] Implement login service
- [x] Implement JWT generation
- [x] Create authentication routes
- [x] Add validation
- [x] Add unit and integration tests
- [x] Verify password byte-length validation
- [x] Verify public registration cannot create admin accounts
- [x] Verify duplicate email handling
- [x] Run full test suite successfully

---

## TASK-013 — Create Authentication Middleware

- [x] Create JWT middleware
- [x] Verify tokens
- [x] Extract user identity
- [x] Handle invalid tokens
- [x] Handle expired tokens

---

## TASK-014 — Create Role Authorization

- [x] Student authorization
- [x] Admin authorization
- [x] Recruiter authorization
- [x] Resource ownership checks

---

## TASK-015 — Create Login UI

- [x] Create login page
- [x] Add email field
- [x] Add password field
- [x] Add validation
- [x] Add loading state
- [x] Add error state
- [x] Connect to login API

---

## TASK-016 — Create Registration UI

- [x] Create registration page
- [x] Add required fields
- [x] Add validation
- [x] Connect registration API
- [x] Handle success state
- [x] Handle error state

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

> **Deferred implementation:** This phase starts only after all Student, Recruiter, and Admin portal pages and core workflows are implemented, integrated, tested, and reviewed. Until then, do not implement the AI model or create `ai-module/`. Keep AI matching assistive; it must not determine official eligibility or placement decisions.

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
- CPRMP_PRD.md
- CPRMP_Architecture_Documentation.md
- CPRMP_Design_System_Documentation.md
- CPRMP_AI_Development_Rules.md
- CPRMP_Development_Tasks.md

Objective:
<Describe exactly what this task should accomplish.>

Requirements:
- <Requirement 1>
- <Requirement 2>
- <Requirement 3>

Constraints:
- Do not modify unrelated files.
- Follow CPRMP_Architecture_Documentation.md.
- Follow CPRMP_Design_System_Documentation.md.
- Follow CPRMP_AI_Development_Rules.md.
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
  ->
Database
  ->
Authentication
  ->
Core Placement Workflows
  ->
Student Portal
  ->
Recruiter Portal
  ->
Admin Portal
  ->
Dashboards
  ->
UI/UX Consistency and Responsive Testing
  ->
Core Workflow Integration and Verification
  ->
AI Matching
  ->
Security and Full Testing
  ->
Final Review
  ->
Deployment
```

**AI implementation gate:** Do not implement the AI model or create `ai-module/` until all Student, Recruiter, and Admin portal pages and their core workflows are implemented, integrated, tested, and reviewed. AI matching must not control official eligibility or placement decisions.

**CPRMP_Development_Tasks.md = WHAT WE BUILD, ONE STEP AT A TIME.**