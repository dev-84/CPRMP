# Architecture Documentation

## 1. Project

**Campus Placement and Recruitment Management Portal (CPRMP)**

**Architecture Type:** Client–Server / Layered Architecture

**Primary Stack:**
- Frontend: React.js + Vite
- Language: JavaScript
- Styling: Tailwind CSS
- Backend: Node.js + Express.js
- Database: MongoDB + Mongoose
- Authentication: JWT + bcrypt
- AI Module: Python + Scikit-learn
- Version Control: Git + GitHub
- API Testing: Postman

---

# 2. Technology Architecture

| Layer | Technology | Responsibility |
|---|---|---|
| **Frontend** | React.js + Vite | User interface and user interaction |
| **Styling** | Tailwind CSS | Responsive UI and styling |
| **API Layer** | Express.js | Handle HTTP requests and API routes |
| **Backend** | Node.js | Application server and business logic |
| **Authentication** | JWT + bcrypt | Authentication, password security, and authorization |
| **Database** | MongoDB Community Server | Mongoose (ODM) |
| **AI Module** | Python + Scikit-learn | Resume–job matching and skill-gap analysis |
| **File Storage** | Server/cloud file storage | Student resume/document storage |
| **Testing** | Postman + Jest/Supertest | API and application testing |
| **Version Control** | Git + GitHub | Source-code management |
| **Deployment** | Proposed: Vercel + Render/Railway + MongoDB-compatible database deployment; final provider undecided | Application deployment |

---

# 3. High-Level Architecture

```text
                         ┌──────────────────────┐
                         │        User          │
                         │                      │
                         │ Student / Admin /    │
                         │ Recruiter            │
                         └──────────┬───────────┘
                                    │
                                    ↓
                         ┌──────────────────────┐
                         │   React Frontend     │
                         │   + Vite             │
                         │   + Tailwind CSS     │
                         └──────────┬───────────┘
                                    │
                              HTTP / REST API
                                    │
                                    ↓
                         ┌──────────────────────┐
                         │  Express.js API      │
                         │      Layer           │
                         └──────────┬───────────┘
                                    │
                                    ↓
                         ┌──────────────────────┐
                         │    Node.js Backend   │
                         │                      │
                         │ Business Logic       │
                         │ Eligibility Engine   │
                         │ Application Logic    │
                         │ Recruitment Logic    │
                         └───────┬───────┬──────┘
                                 │       │
                    ┌────────────┘       └──────────────┐
                    ↓                                   ↓
          ┌──────────────────┐                ┌──────────────────┐
          │     MongoDB      │                │   AI Module      │
          │    Database      │                │ Python + ML/NLP  │
          └──────────────────┘                └────────┬─────────┘
                                                       │
                                                       ↓
                                            Resume–Job Matching
                                            Skill Gap Analysis
```

---

# 4. Request Flow

A typical request should follow this flow:

```text
User
  ↓
React UI
  ↓
API Request
  ↓
Express Route
  ↓
Authentication Middleware
  ↓
Authorization / Role Check
  ↓
Controller
  ↓
Service / Business Logic
  ↓
Database Repository / Model
  ↓
MongoDB + Mongoose
  ↓
Service
  ↓
Controller
  ↓
API Response
  ↓
React UI
  ↓
User
```

For example, when a student applies for a placement drive:

```text
Student
   ↓
Clicks "Apply"
   ↓
React Frontend
   ↓
POST /api/applications
   ↓
JWT Verification
   ↓
Student Role Verification
   ↓
Application Controller
   ↓
Application Service
   ↓
Eligibility Check
   ↓
Duplicate Application Check
   ↓
Save Application
   ↓
MongoDB + Mongoose
   ↓
Application Response
   ↓
React UI
```

---

# 5. Three-Role Architecture

CPRMP has exactly three main system roles:

```text
                    CPRMP
                      │
          ┌───────────┼───────────┐
          ↓           ↓           ↓
       Student      Admin      Recruiter
          │           │           │
          ↓           ↓           ↓
      Student       System      Company /
      Features      Control     Recruitment
```

### Student

Responsible for:

- Registration
- Profile management
- Resume management
- Viewing drives
- Checking eligibility
- Applying
- Tracking applications
- Viewing placement status
- Using AI matching assistance

### Admin / Placement Officer

Responsible for:

- Student management
- Company management
- Recruiter management
- Placement drive management
- Eligibility criteria
- Application monitoring
- Selection/placement records

### Recruiter

Responsible for:

- Company profile
- Placement drives
- Applicant viewing
- Candidate shortlisting
- Recruitment status updates

---

# 6. Frontend Architecture

The frontend uses **React.js + Vite**.

```text
React Application
       │
       ├── Authentication
       │
       ├── Student Dashboard
       │
       ├── Admin Dashboard
       │
       ├── Recruiter Dashboard
       │
       ├── Placement Drives
       │
       ├── Applications
       │
       ├── Resume Management
       │
       ├── Shortlisting
       │
       └── AI Matching
```

The frontend is responsible for:

- Rendering UI.
- Collecting user input.
- Form validation at the UI level.
- Calling backend APIs.
- Displaying API responses.
- Managing frontend state.
- Handling navigation.
- Showing loading/error/success states.

The frontend **must not directly access MongoDB**.

---

# 7. Backend Architecture

The backend uses **Node.js + Express.js**.

```text
Backend
│
├── Routes
│
├── Middleware
│
├── Controllers
│
├── Services
│
├── Models / Repositories
│
├── Validators
│
└── Utilities
```

### Routes

Define API endpoints.

Example:

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

### Controllers

Controllers receive requests and return responses.

They should **not contain large amounts of business logic**.

### Services

Services contain business rules.

Examples:

```text
EligibilityService
ApplicationService
PlacementDriveService
ShortlistingService
PlacementService
AIMatchingService
```

### Database Layer

The database layer communicates with MongoDB through Mongoose. Mongoose models define document schemas and support validation and database operations. All database access must occur in the backend.

It should handle:

- Creating records.
- Reading records.
- Updating records.
- Deleting records.
- Database queries.

---

# 8. Authentication Architecture

Authentication uses:

**JWT + bcrypt**

```text
User
 ↓
Login
 ↓
Backend
 ↓
Find User
 ↓
Compare Password using bcrypt
 ↓
Generate JWT
 ↓
Return Token
 ↓
Frontend
 ↓
Authenticated API Request
 ↓
JWT Middleware
 ↓
Verify Token
 ↓
Role Authorization
 ↓
Controller
```

Passwords must never be stored as plain text.

---

# 9. Role-Based Authorization

Authentication answers:

> "Who is this user?"

Authorization answers:

> "What is this user allowed to do?"

Example:

```text
Student
  ↓
Can access student APIs

Admin
  ↓
Can access administration APIs

Recruiter
  ↓
Can access own company/recruitment APIs
```

Every protected backend API must verify the user's role where required.

---

# 10. Eligibility Architecture

Eligibility checking is a **deterministic business rule**, not an AI decision.

```text
Student Profile
      +
Placement Drive Criteria
      ↓
Eligibility Service
      ↓
┌──────────────────────────┐
│ Course                   │
│ Branch                   │
│ CGPA / Percentage        │
│ Backlogs                 │
│ Passing Year             │
└────────────┬─────────────┘
             ↓
       Eligibility Result
         ↙           ↘
     Eligible      Not Eligible
         ↓
    Can Apply       Cannot Apply
```

The eligibility engine should be predictable and rule-based.

**AI must never override the official eligibility result.**

---

# 11. Application Architecture

```text
Student
   ↓
Select Placement Drive
   ↓
Check Eligibility
   ↓
Eligible?
   ↓
Check Duplicate Application
   ↓
Create Application
   ↓
MongoDB
   ↓
Application Status
```

The backend must enforce:

- Eligibility requirements.
- Application deadline.
- Duplicate application prevention.
- Student authentication.
- Valid placement drive status.

---

# 12. AI Architecture

The AI module is an **assistive feature**.

```text
Student Resume
       ↓
Resume Data / Skills
       ↓
AI Matching Module
       +
Job Description
       ↓
Skill Comparison
       ↓
Match Analysis
       ↓
┌───────────────────────┐
│ Match Score           │
│ Matched Skills        │
│ Missing Skills        │
│ Suggestions           │
└───────────────────────┘
```

The AI module can use:

- Python
- Pandas
- NumPy
- Scikit-learn
- Lightweight NLP/keyword matching

The AI result is stored separately from official eligibility.

```text
Official Eligibility
        ≠
AI Match Score
```

---

# 13. Database Architecture

CPRMP will use **MongoDB** as its primary database, with **Mongoose** as the Object Data Modeling (ODM) library for Node.js and Express.

MongoDB will store the core application data, including:

- Student profiles and academic information
- Company and recruiter information
- Placement drives and eligibility criteria
- Student applications and application statuses
- Shortlisting, selection, and placement records
- Resume file references and related metadata

Mongoose will define and validate data models, enforce schema-level rules, and support database operations through the backend.

The Express backend will be responsible for all database interactions. The React frontend must communicate with the backend API and must never connect directly to MongoDB.

The database connection string will be configured through the `MONGODB_URI` environment variable. Credentials and other sensitive connection details must be kept in environment variables and must not be committed to the repository.

MongoDB will store resume metadata and file references. The actual resume files will remain in backend-controlled file storage rather than being stored directly in the database.

Major entities include:

```text
User
  │
  ├── StudentProfile
  │       │
  │       └── Resume
  │
  └── RecruiterProfile
          │
          └── Company
                  │
                  └── PlacementDrive
                           │
                           ├── EligibilityCriteria
                           │
                           └── Applications
                                    │
                                    └── RecruitmentStatus
                                             │
                                             └── PlacementHistory
```

AI results are stored separately:

```text
Resume + PlacementDrive
          ↓
      AIMatchResult
```

---

# 14. File Storage Architecture

Student resumes must not be stored directly as binary data inside MongoDB documents. Instead, CPRMP will store resume files in backend-controlled file storage and maintain their file references and related metadata in MongoDB.

This approach separates file storage from application data and allows the backend to manage file uploads, validation, access, and retrieval.

Recommended flow:

```text
Student
  ->
Upload Resume
  ->
Backend Validation
  ->
File Storage
  ->
Store File Reference / Path
  ->
MongoDB
```
The database stores the resume's file reference or path and related metadata, such as the original filename, content type, and other necessary information.

The Express backend must control resume uploads and access. The frontend must communicate with the backend API rather than accessing the file storage or database directly.

Resume files must be validated before being accepted. The backend should enforce permitted file types and file-size limits, generate safe storage names, and prevent unauthorized users from accessing another student's resume.

Sensitive file paths and storage details should not be exposed unnecessarily to the frontend. The backend must verify authorization before allowing a resume to be viewed or downloaded.

---

# 15. Folder Structure

The following tree reflects the verified current project structure. It excludes generated dependencies, build output, and local environment files. Planned feature directories are documented separately and must not be represented as existing until they are created.

The AI module is deferred until all Student, Recruiter, and Admin portal pages and their core workflows have been implemented, integrated, tested, and reviewed. Until then, do not create ai-module/ or implement AI matching logic. Official eligibility and recruitment workflows must operate independently of AI.

cprmp/
|-- frontend/
|   |-- public/
|   |-- src/
|   |   |-- App.css
|   |   |-- App.jsx
|   |   |-- index.css
|   |   `-- main.jsx
|   |-- .gitignore
|   |-- eslint.config.js
|   |-- index.html
|   |-- package.json
|   |-- package-lock.json
|   |-- README.md
|   `-- vite.config.js
|
|-- backend/
|   |-- src/
|   |   |-- config/
|   |   |   |-- .gitkeep
|   |   |   `-- db.js
|   |   |-- controllers/
|   |   |   `-- .gitkeep
|   |   |-- middleware/
|   |   |   |-- .gitkeep
|   |   |   `-- errorHandler.js
|   |   |-- models/
|   |   |   `-- .gitkeep
|   |   |-- routes/
|   |   |   `-- .gitkeep
|   |   |-- services/
|   |   |   `-- .gitkeep
|   |   |-- utils/
|   |   |   `-- .gitkeep
|   |   |-- validators/
|   |   |   `-- .gitkeep
|   |   |-- app.js
|   |   `-- server.js
|   |-- .env.example
|   |-- jest.config.js
|   |-- package.json
|   `-- package-lock.json
|
|-- docs/
|   `-- Main requirements/
|       |-- CPRMP_PRD.md
|       |-- CPRMP_Architecture_Documentation.md
|       |-- CPRMP_Design_System_Documentation.md
|       |-- CPRMP_Architecture_Decisions.md
|       |-- CPRMP_AI_Development_Rules.md
|       |-- CPRMP_Development_Tasks.md
|       |-- CPRMP_Environment_Variables.md
|       |-- CPRMP_Security_Requirements.md
|       |-- CPRMP_Test_Plan.md
|       `-- CPRMP_MEMORY.md
|
|-- .gitignore
`-- README.md

Future planned structure — do not create yet:

ai-module/
|-- app/
|   |-- services/
|   |-- models/
|   |-- utils/
|   `-- main.py
|-- requirements.txt
`-- README.md

JavaScript convention: The frontend currently uses JavaScript and JSX. Do not add a types/ directory solely for TypeScript definitions. If shared runtime validation or JSDoc conventions are introduced later, document them separately.

---
# 16. Frontend Folder Responsibilities

```text
frontend/src/

components/
    Reusable UI components

pages/
    Application pages/screens

layouts/
    Student/Admin/Recruiter layouts

features/
    Feature-specific frontend logic

services/
    API communication

hooks/
    Reusable React hooks

context/
    Global application state

utils/
    Frontend helper functions

types/ (optional; not currently used)
    Only add if a documented need for shared type definitions arises

assets/
    Images and static assets
```

---

# 17. Backend Folder Responsibilities

```text
backend/src/

config/
    Database and application configuration

routes/
    API route definitions

controllers/
    Request/response handling

services/
    Business logic

models/
    Database models/repositories

middleware/
    Authentication, authorization, error handling

validators/
    Request validation

utils/
    Reusable backend utilities
```

---

# 18. AI Module Responsibilities

> **Deferred implementation:** This is a future planned structure, not part of the current implementation. Do not create `ai-module/` or implement AI matching logic until all Student, Recruiter, and Admin portal pages and their core workflows have been implemented, integrated, tested, and reviewed.

```text
ai-module/

app/
├── services/
│   └── Matching and skill-gap logic
│
├── models/
│   └── ML/NLP models if required
│
├── utils/
│   └── Text processing utilities
│
└── main.py
```

The AI module should remain separate from the main React frontend.

Official eligibility and recruitment workflows must operate independently of AI. AI outputs are assistive recommendations and must never override official eligibility decisions.

---

# 19. API Architecture

The frontend communicates with the backend through REST APIs.

Example:

```text
Frontend
   │
   ├── POST /api/auth/login
   ├── GET  /api/students/profile
   ├── POST /api/resumes
   ├── GET  /api/drives
   ├── GET  /api/drives/:id/eligibility
   ├── POST /api/applications
   ├── GET  /api/applications
   ├── PATCH /api/applications/:id/status
   └── POST /api/ai/match
   │
   ↓
Express Backend
```

---

# 20. Architectural Rules

The following rules must be followed throughout development:

### Rule 1 — UI Separation

**UI components must not contain database logic.**

React components communicate with backend APIs through services.

---

### Rule 2 — Database Separation

**Database operations belong in the database/model/repository layer.**

Controllers should not contain large raw database operations.

---

### Rule 3 — Business Logic Separation

**Business logic belongs in services.**

Examples:

```text
EligibilityService
ApplicationService
ShortlistingService
PlacementService
AIMatchingService
```

---

### Rule 4 — Authentication

**Authentication must be verified server-side.**

Never trust only frontend route protection.

---

### Rule 5 — Authorization

**Every protected API must verify the user's permissions/role on the backend.**

---

### Rule 6 — Reusable Components

Reusable UI elements should be placed in:

```text
frontend/src/components/
```

Examples:

```text
Button
Modal
Table
FormInput
Navbar
Sidebar
StatusBadge
```

---

### Rule 7 — Feature Logic

Feature-specific functionality should remain inside:

```text
frontend/src/features/
```

rather than putting everything into global components.

---

### Rule 8 — API Communication

Frontend API calls should be centralized inside:

```text
frontend/src/services/
```

Components should not repeatedly implement API request logic.

---

### Rule 9 — Environment Variables

Secrets must never be hardcoded.

Use:

```text
.env
```

for:

- Database credentials
- JWT secret
- API keys
- AI service configuration

`.env` must be included in `.gitignore`.

---

### Rule 10 — AI Separation

AI recommendations must remain separate from official eligibility decisions.

```text
Eligibility Engine → Official decision

AI Module → Assistance/recommendation
```

---

### Rule 11 — Role Isolation

Students, Admins, and Recruiters must only access functionality permitted for their role.

---

### Rule 12 — Recruiter Data Isolation

A recruiter should only access applicants and recruitment data belonging to their authorized company/placement drives.

---

### Rule 13 — Validation

Input validation must happen:

```text
Frontend
      +
Backend
```

Backend validation is mandatory even if frontend validation exists.

---

### Rule 14 — Error Handling

Backend errors should be handled centrally through middleware and return consistent API responses.

---

### Rule 15 — Git Checkpoints

Before major architectural/module changes:

```text
Change
  ↓
Test
  ↓
Commit
  ↓
Push
```

Do not allow large uncommitted changes to accumulate.

---

# 21. Deployment Architecture

```text
                    Internet
                       │
                       ↓
              ┌────────────────┐
              │ Vercel         │
              │ React Frontend │
              └───────┬────────┘
                      │
                  REST API
                      │
                      ↓
              ┌────────────────┐
              │ Render/Railway │
              │ Node + Express │
              └───────┬────────┘
                      │
              ┌───────┴────────┐
              ↓                ↓
        ┌───────────┐   ┌────────────┐
        │  MongoDB  │   │ AI Module  │
        │ Database  │   │ Python     │
        └───────────┘   └────────────┘
```

The exact deployment provider can be finalized during implementation.

---

# 22. Architecture Summary

```text
┌─────────────────────────────────────────────────┐
│                    USERS                        │
│         Student | Admin | Recruiter             │
└───────────────────────┬─────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────┐
│                 REACT FRONTEND                  │
│              Vite + Tailwind CSS                │
└───────────────────────┬─────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────┐
│                REST API / EXPRESS               │
│          Routes → Middleware → Controllers      │
└───────────────────────┬─────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────┐
│                BUSINESS SERVICES                │
│ Eligibility | Applications | Drives | Placement │
└───────────────┬─────────────────────┬───────────┘
                ↓                     ↓
       ┌────────────────┐    ┌──────────────────┐
       │     MongoDB    │    │   AI MODULE      │
       │    Database    │    │ Python + ML/NLP  │
       └────────────────┘    └──────────────────┘
```

**Architecture = HOW**

The PRD defines **what CPRMP should do and why**. This architecture defines **how those requirements will be implemented and how the frontend, backend, database, authentication, and AI module will communicate with each other.**