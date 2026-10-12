# CPRMP — Architecture Decisions

## Purpose

This document records important technical and architectural decisions for the **Campus Placement and Recruitment Management Portal (CPRMP)**.

These decisions are intended to keep the project consistent throughout development and prevent AI-assisted tools such as Cursor from randomly changing the technology stack or architecture.

### Decision Rules

- Existing decisions must not be changed without an explicit project decision.
- AI/Cursor must follow these decisions when implementing tasks.
- A new architectural decision must be documented before changing an existing decision.
- Do not replace a technology simply because another technology is easier for a particular task.
- Avoid introducing unnecessary technologies or architectural complexity.

---

# ADR-001 — Frontend Technology

## Decision

Use **React.js + Vite** for the frontend.

## Reason

React provides a component-based architecture suitable for building the three role-based interfaces:

- Student
- Admin / Placement Officer
- Recruiter

Vite provides a lightweight and fast development environment suitable for the MCA Semester-3 project.

## Consequence

The frontend will be maintained separately from the Node.js backend.

---

# ADR-002 — Frontend Language

## Decision

Use **JavaScript** for frontend development.

## Reason

The project team is already working with JavaScript and the selected React/Node.js stack. Using JavaScript across the main web application reduces unnecessary language complexity.

## Consequence

Frontend source files will primarily use:

```text
.js
.jsx
```

Do not migrate the project to TypeScript unless a new architectural decision is made.

---

# ADR-003 — Styling Technology

## Decision

Use **Tailwind CSS** for application styling.

## Reason

Tailwind provides reusable utility classes and makes it easier to maintain the design system defined in `DESIGN.md`.

It also supports responsive layouts required by CPRMP.

## Consequence

The UI should use the project's defined:

- Colors
- Typography
- Spacing
- Border radius
- Button styles
- Responsive rules

Do not introduce another major CSS framework.

---

# ADR-004 — Backend Technology

## Decision

Use **Node.js + Express.js** for the backend.

## Reason

Express provides a straightforward REST API architecture and works naturally with the React frontend.

Node.js allows the project to use JavaScript throughout the main web application stack.

## Consequence

The backend will provide:

- REST APIs
- Authentication
- Authorization
- Business logic
- Eligibility checking
- Application management
- Recruitment management
- Database communication

---

# ADR-005 — Database

## Decision

Use **MySQL** as the primary application database.

## Reason

CPRMP contains structured and relational data such as:

- Users
- Students
- Recruiters
- Companies
- Placement drives
- Eligibility criteria
- Applications
- Recruitment statuses
- Placement history

A relational database is suitable for maintaining relationships and constraints between these entities.

## Consequence

The frontend must never connect directly to MySQL.

All database operations must go through the backend.

---

# ADR-006 — Authentication

## Decision

Use **JWT + bcrypt** for authentication.

## Reason

JWT provides token-based authentication for REST APIs, while bcrypt provides secure password hashing.

This is sufficient for the academic-scale CPRMP application without introducing a separate authentication platform.

## Consequence

The backend must:

- Hash passwords using bcrypt.
- Verify passwords during login.
- Generate JWT tokens.
- Verify JWT tokens for protected APIs.
- Perform authorization server-side.

Passwords must never be stored as plain text.

---

# ADR-007 — Role Model

## Decision

Use exactly three primary system roles:

1. **Student**
2. **Admin / Placement Officer**
3. **Recruiter**

## Reason

These three roles represent the core users required for the campus placement lifecycle.

Admin and Placement Officer are treated as one system role for this academic project.

## Consequence

The application must not introduce additional primary roles unless explicitly approved.

Use **Recruiter** consistently throughout the project.

Do not use:

```text
Requirator
Recruitment User
HR User
```

as alternative role names.

---

# ADR-008 — Architecture Style

## Decision

Use a **client-server layered architecture**.

```text
React Frontend
      ↓
Express REST API
      ↓
Controllers
      ↓
Services / Business Logic
      ↓
Database Layer
      ↓
MySQL
```

## Reason

This provides clear separation between:

- UI
- API
- Business logic
- Database

It is easier to understand, develop, test, and maintain for a two-member MCA project.

## Consequence

Do not convert the project into a microservices architecture.

---

# ADR-009 — Business Logic Location

## Decision

Business logic must remain in backend services.

Examples:

```text
EligibilityService
ApplicationService
PlacementDriveService
ShortlistingService
PlacementService
AIMatchingService
```

## Reason

Keeping business rules separate from UI components makes the system easier to test and prevents duplicated logic.

## Consequence

React components should not contain important business rules such as official eligibility calculations.

---

# ADR-010 — Eligibility Decision

## Decision

Official placement eligibility will be determined by a **deterministic rule-based eligibility engine**.

## Reason

Placement eligibility must be predictable and explainable.

Criteria may include:

- Course
- Branch
- CGPA
- Percentage
- Backlogs
- Passing year

## Consequence

The system produces:

```text
Eligible
OR
Not Eligible
```

The AI module must **never override the official eligibility decision**.

---

# ADR-011 — AI Technology

## Decision

Use **Python + Scikit-learn / lightweight NLP or skill matching** for the AI module.

## Reason

The project requires an AI module for:

- Resume–job matching
- Matched skills
- Missing skills
- Match score
- Skill-gap suggestions

Python provides suitable libraries for implementing this functionality without requiring a complex AI infrastructure.

## Consequence

The first implementation should remain lightweight.

Do not introduce a complex machine-learning pipeline unless the project requirements require it.

---

# ADR-012 — AI Role

## Decision

AI will be **assistive, not authoritative**.

## Reason

AI matching is intended to help students and recruiters understand resume/job alignment. Official placement decisions should remain controlled by deterministic eligibility rules and authorized users.

## Consequence

AI may provide:

```text
Match Score
Matched Skills
Missing Skills
Improvement Suggestions
```

AI must not:

- Make a student eligible.
- Make a student ineligible.
- Automatically select a student.
- Automatically reject a student.
- Override Admin decisions.
- Override Recruiter decisions.

---

# ADR-013 — API Architecture

## Decision

Use **REST APIs** for frontend-backend communication.

## Reason

REST APIs provide a simple and well-understood communication mechanism between React and Express.

## Consequence

The frontend communicates with endpoints such as:

```text
/api/auth
/api/students
/api/resumes
/api/companies
/api/drives
/api/eligibility
/api/applications
/api/applicants
/api/placements
/api/ai
```

---

# ADR-014 — File Storage

## Decision

Student resumes will be handled through backend-controlled file storage, while the database stores the file reference/path and related metadata.

## Reason

Resumes are files rather than ordinary relational data. Separating file storage from database records keeps the database structure simpler.

## Consequence

The system must:

- Validate uploaded files.
- Validate file size/type.
- Store file references in MySQL.
- Protect access to private student documents.

Resume files must not be placed inside the React source code.

---

# ADR-015 — Version Control

## Decision

Use **Git + GitHub** from the beginning of development.

## Reason

The project is being developed by two team members and uses AI-assisted development. Git provides checkpoints that allow the team to inspect, compare, and roll back changes.

## Consequence

Development should follow:

```text
Change
  ↓
Test
  ↓
Review
  ↓
Commit
  ↓
Push
```

Commits should be small and descriptive.

---

# ADR-016 — AI Development Tool

## Decision

Use **Cursor** as the primary AI-assisted development IDE.

## Reason

CPRMP contains multiple interconnected modules and requires repository-level code changes, debugging, refactoring, and navigation across frontend/backend/AI code.

Cursor can assist with these tasks while Git provides version control and rollback capability.

## Consequence

Cursor must follow:

```text
PRD.md
ARCHITECTURE.md
DESIGN.md
RULES.md
TASKS.md
DECISIONS.md
```

Cursor must not independently change architectural decisions.

---

# ADR-017 — Task-Based Development

## Decision

Build CPRMP incrementally through small development tasks.

## Reason

Generating the entire application in one AI prompt can introduce inconsistent architecture, broken dependencies, duplicated logic, and difficult-to-debug code.

## Consequence

Use:

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
```

Never ask Cursor to build the entire CPRMP in one prompt.

---

# ADR-018 — Testing Strategy

## Decision

Use **Jest + Supertest + Postman**.

## Reason

These tools provide suitable coverage for:

- Backend unit tests
- API/integration testing
- Manual API testing

## Consequence

Important functionality must be tested before being marked complete.

Priority testing areas include:

- Authentication
- Authorization
- Eligibility
- Applications
- Duplicate application prevention
- Shortlisting
- Selection
- Placement tracking
- AI matching

---

# ADR-019 — Deployment Strategy

## Decision

Use:

```text
Frontend → Vercel
Backend  → Render / Railway
Database → MySQL-compatible deployment
```

The exact provider can be finalized during deployment.

## Reason

This approach separates frontend and backend deployment while keeping the deployment model understandable for an academic project.

## Consequence

Production configuration must use environment variables and must not expose secrets in GitHub.

---

# ADR-020 — No Unnecessary Microservices

## Decision

Do not use microservices for the first version.

## Reason

CPRMP is an academic-scale application developed by two students. A modular monolithic backend is sufficient for the current scope.

## Consequence

The backend remains one Express application with clearly separated:

```text
Routes
Controllers
Services
Models/Repositories
Middleware
Validators
Utilities
```

The AI module may remain separately organized because it uses Python, but the overall system should not be unnecessarily fragmented.

---

# ADR-021 — MVP Scope

## Decision

The first version focuses on the ten core modules:

1. Authentication & Role Management
2. Student Registration & Profile Management
3. Resume Management
4. Company Management
5. Placement Drive Management
6. Eligibility Management
7. Application Management
8. Applicant Management & Shortlisting
9. Selection & Placement Tracking
10. AI Resume–Job Matching & Skill Gap Analysis

## Reason

These modules provide the complete core placement lifecycle while keeping the project manageable for a two-member MCA Semester-3 team.

## Consequence

Features such as:

- Email/SMS notifications
- Online aptitude tests
- Coding tests
- Video interviews
- Native mobile application
- Advanced predictive analytics
- ERP integrations

remain outside the first version unless explicitly added through a new decision.

---

# ADR-022 — Documentation as Source of Truth

## Decision

Project documentation is part of the development contract.

The primary documents are:

```text
PRD.md
ARCHITECTURE.md
DESIGN.md
RULES.md
TASKS.md
DECISIONS.md
```

## Reason

AI-assisted development can otherwise cause architectural drift over time.

## Consequence

Before a major implementation change, AI/developers must check the relevant documentation.

If a technical decision changes, update `DECISIONS.md`.

---

# 3. How to Add a New Decision

When a new important technical decision is required, use the following format:

```text
## ADR-XXX — <Decision Title>

### Decision

<What was decided?>

### Reason

<Why was it decided?>

### Consequence

<What does this decision mean for the project?>
```

Before changing an existing decision:

1. Identify the existing ADR.
2. Explain why it needs to change.
3. Create a new ADR documenting the change.
4. Update affected documentation.
5. Update implementation if required.
6. Test affected modules.
7. Commit the change.

Do not silently overwrite an architectural decision.

---

# 4. Current Technology Stack

| Area | Decision |
|---|---|
| AI IDE | Cursor |
| Frontend | React.js + Vite |
| Language | JavaScript |
| Styling | Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | MySQL |
| Authentication | JWT + bcrypt |
| AI | Python + Scikit-learn / NLP |
| API | REST |
| Testing | Jest + Supertest + Postman |
| Version Control | Git + GitHub |
| Frontend Deployment | Vercel |
| Backend Deployment | Render / Railway |

---

# 5. Decision Summary

```text
React + Vite
      ↓
Tailwind CSS
      ↓
Node.js + Express
      ↓
REST APIs
      ↓
MySQL

Python AI Module
      ↓
Resume–Job Matching
      ↓
Assistive Recommendation

JWT + bcrypt
      ↓
Authentication + Authorization

Git + GitHub
      ↓
Version Control

Cursor
      ↓
AI-Assisted Development
```

**DECISIONS.md = WHY WE CHOSE THE TECHNICAL APPROACH AND WHAT MUST NOT CHANGE RANDOMLY.**