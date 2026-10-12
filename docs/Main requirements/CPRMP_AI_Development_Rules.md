# CPRMP — AI Development Rules

## 1. Project Context

**Project:** Campus Placement and Recruitment Management Portal (CPRMP)

**Purpose:** A web-based platform for managing the campus placement lifecycle for Students, Admin/Placement Officers, and Recruiters.

**Primary Stack:**

- Frontend: React.js + Vite
- Language: JavaScript
- Styling: Tailwind CSS
- Backend: Node.js + Express.js
- Database: MySQL
- Authentication: JWT + bcrypt
- AI Module: Python + Scikit-learn / NLP
- Testing: Jest + Supertest + Postman
- Version Control: Git + GitHub

---

# 2. Source of Truth

Before implementing any feature, follow this documentation hierarchy:

```text
PRD.md
   ↓
ARCHITECTURE.md
   ↓
DESIGN.md
   ↓
RULES.md
   ↓
Implementation
```

### Rules

- `PRD.md` defines **WHAT** the system should do and **WHY**.
- `ARCHITECTURE.md` defines **HOW** the system is technically structured.
- `DESIGN.md` defines **HOW the application should look and feel**.
- `RULES.md` defines **HOW AI-assisted development must be performed**.
- Do not implement features that contradict these documents.
- Do not silently add major features that are not defined in the project scope.
- If a requested feature conflicts with the documentation, identify the conflict before implementing it.

---

# 3. General Development Rules

- Use the approved project technology stack.
- Keep the architecture simple and suitable for a 2-member MCA Semester-3 project.
- Prefer simple solutions over unnecessary complexity.
- Reuse existing functionality wherever possible.
- Do not duplicate business logic.
- Keep functions small and focused.
- Keep components focused on a single responsibility.
- Use meaningful names for variables, functions, components, APIs, and database fields.
- Do not introduce a new library when existing project functionality can solve the problem.
- Do not introduce microservices unless explicitly required.
- Do not modify unrelated files.
- Do not rewrite working modules without a clear reason.
- Maintain existing functionality when adding new features.

---

# 4. Before Coding

Before making changes:

1. Read the relevant project documentation.
2. Inspect the existing folder structure.
3. Inspect related components and services.
4. Check whether the required functionality already exists.
5. Reuse existing components and utilities where possible.
6. Identify dependencies between modules.
7. For large changes, create an implementation plan before coding.
8. Make the smallest reasonable change that solves the requirement.

For example:

```text
User Request
     ↓
Understand Requirement
     ↓
Read Relevant Documentation
     ↓
Inspect Existing Code
     ↓
Plan Change
     ↓
Implement
     ↓
Test
     ↓
Review
     ↓
Commit
```

---

# 5. Project Scope Rules

The MVP contains these core modules:

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

### Rules

- Do not add unrelated features to the MVP.
- P1 and P2 features should not be implemented unless specifically requested.
- Do not artificially split one small feature into multiple modules.
- Preserve the three official roles:
  - Student
  - Admin / Placement Officer
  - Recruiter
- Use **Recruiter** consistently.
- Do not use "Requirator" or alternative role terminology.

---

# 6. Frontend Rules

## Technology

Use:

- React.js
- Vite
- JavaScript
- Tailwind CSS

## Component Rules

- Use reusable components.
- Do not duplicate UI code.
- Keep components focused.
- Business logic should not be embedded heavily inside UI components.
- API communication should be handled through service modules.
- Use existing components before creating new ones.

Recommended structure:

```text
frontend/src/

components/
pages/
layouts/
features/
services/
hooks/
context/
utils/
types/
assets/
```

---

# 7. UI Rules

All frontend implementation must follow `DESIGN.md`.

### Visual System

- Use Inter typography.
- Use `#6366F1` as the primary color.
- Use `#F8FAFC` as the main background.
- Use `#0F172A` for primary text.
- Use `#64748B` for muted text.
- Use `#FFFFFF` for cards/surfaces.
- Use `#E2E8F0` for borders.
- Use 12px default card radius.
- Use 8px default button/input radius.
- Use consistent spacing.

### Do Not

- Create random colors.
- Create inconsistent card styles.
- Use different button designs on different pages.
- Introduce excessive gradients.
- Introduce excessive animations.
- Use unnecessary shadows.
- Create a completely different design for each dashboard.

---

# 8. Responsive UI Rules

Every new UI feature must work on:

- Mobile
- Tablet
- Desktop

### Requirements

- Avoid unnecessary horizontal scrolling.
- Stack cards appropriately on smaller screens.
- Make forms responsive.
- Make tables usable on smaller screens.
- Maintain readable typography.
- Ensure buttons remain usable on touch devices.
- Test important screens at different viewport sizes.

---

# 9. UX State Rules

Every data-driven screen should properly handle relevant states.

### Loading State

Show:

- Spinner
- Skeleton
- Loading message

Example:

```text
Loading placement drives...
```

### Empty State

Show a meaningful message when no records exist.

Example:

```text
No placement drives available.
```

### Error State

Show a user-friendly error.

Example:

```text
Unable to load placement drives.

[Retry]
```

Never expose:

- Stack traces
- SQL errors
- Internal server details
- Secrets

### Success State

After successful operations, provide clear confirmation.

Example:

```text
Application submitted successfully.
```

---

# 10. Accessibility Rules

- Use semantic HTML.
- Every form field must have a visible label.
- Do not rely only on placeholder text.
- Maintain readable color contrast.
- Provide visible focus states.
- Buttons must have meaningful labels.
- Images should have appropriate alt text.
- Important functionality should be keyboard accessible.
- Do not communicate important information using color alone.
- Validation errors must identify the affected field.

---

# 11. Backend Rules

Use:

```text
Node.js + Express.js
```

Backend structure:

```text
backend/src/

config/
routes/
controllers/
services/
models/
middleware/
validators/
utils/
```

### Separation of Responsibilities

**Routes**

Define API endpoints.

**Controllers**

Handle request/response processing.

**Services**

Contain business logic.

**Models/Repositories**

Handle database operations.

**Middleware**

Handle cross-cutting concerns such as:

- Authentication
- Authorization
- Error handling

**Validators**

Validate incoming data.

---

# 12. Business Logic Rules

Business logic must remain separate from UI.

Examples:

```text
EligibilityService
ApplicationService
PlacementDriveService
ShortlistingService
PlacementService
AIMatchingService
```

Do not implement important business rules directly inside React components.

---

# 13. Database Rules

Use **MySQL** for persistent application data.

### Rules

- Database operations belong in the backend.
- Frontend must never connect directly to MySQL.
- Use appropriate relationships between entities.
- Avoid unnecessary duplicate data.
- Validate data before saving.
- Use appropriate constraints for unique data.
- Do not expose database credentials.
- Do not return unnecessary sensitive database fields to the frontend.

Core entities include:

```text
User
StudentProfile
Resume
RecruiterProfile
Company
PlacementDrive
EligibilityCriteria
Application
RecruitmentStatus
PlacementHistory
AIMatchResult
```

---

# 14. Authentication Rules

Use:

```text
JWT + bcrypt
```

### Password Rules

- Never store plain-text passwords.
- Hash passwords using bcrypt.
- Never return passwords through APIs.
- Never log passwords.

### JWT Rules

- Verify JWT tokens server-side.
- Do not trust frontend authentication alone.
- Protected APIs must verify authentication.
- Role authorization must happen server-side.

---

# 15. Authorization Rules

The system has exactly three roles:

```text
Student
Admin / Placement Officer
Recruiter
```

### Student

Can access student-specific functionality.

### Admin / Placement Officer

Can manage placement administration.

### Recruiter

Can access authorized company/recruitment functionality.

### Important

Frontend route protection is not sufficient.

Every protected backend operation must verify:

```text
Authentication
      ↓
User Identity
      ↓
User Role
      ↓
Resource Ownership / Permission
      ↓
Operation
```

---

# 16. Recruiter Data Isolation

Recruiters must only access data belonging to their authorized company and placement drives.

Do not rely only on IDs supplied by the frontend.

The backend must verify ownership/authorization before returning or modifying recruiter-related data.

---

# 17. Eligibility Rules

Eligibility is a deterministic business process.

Possible criteria include:

- Course
- Branch
- CGPA
- Percentage
- Backlogs
- Passing year

The eligibility engine must produce a clear result:

```text
Eligible
OR
Not Eligible
```

### Important Rule

**AI must never override official eligibility.**

The architecture must remain:

```text
Official Eligibility Engine
          ↓
   Official Decision

AI Matching
          ↓
Recommendation / Assistance
```

AI match score must not automatically make an ineligible student eligible.

---

# 18. Application Rules

When a student applies:

```text
Authentication
      ↓
Role Check
      ↓
Placement Drive Exists?
      ↓
Drive Open?
      ↓
Eligibility Check
      ↓
Duplicate Application Check
      ↓
Create Application
```

The backend must enforce:

- Student authentication.
- Student role.
- Valid placement drive.
- Application deadline.
- Eligibility.
- Duplicate application prevention.

Do not rely only on frontend validation.

---

# 19. Resume Rules

Student resumes must:

- Be uploaded through the backend.
- Be validated.
- Be stored using the approved file-storage approach.
- Have their file reference/path stored in the database.
- Not expose private files publicly without authorization.

Do not store resume files directly inside React source code.

---

# 20. AI Module Rules

The AI module is **assistive**, not authoritative.

It may provide:

- Matched skills
- Missing skills
- Match score
- Skill-gap suggestions
- Resume–job comparison

It must not:

- Decide official eligibility.
- Automatically select students.
- Automatically reject students.
- Override Admin decisions.
- Override Recruiter decisions.

AI output should be clearly presented as a recommendation.

---

# 21. API Rules

Use REST APIs.

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

### API Rules

- Use meaningful endpoint names.
- Use appropriate HTTP methods.
- Validate request data.
- Authenticate protected endpoints.
- Authorize protected endpoints.
- Return consistent response structures.
- Handle errors consistently.
- Do not expose internal implementation details.

---

# 22. Security Rules

Never:

- Commit API keys.
- Commit passwords.
- Commit database credentials.
- Commit JWT secrets.
- Hardcode production secrets.
- Log sensitive information.
- Trust client-side authorization.
- Expose internal server errors.

Use environment variables:

```text
.env
```

The `.env` file must be ignored by Git.

Provide an example environment file where appropriate:

```text
.env.example
```

Do not put real credentials inside `.env.example`.

---

# 23. Input Validation

Validate user input on:

```text
Frontend
   +
Backend
```

Backend validation is mandatory.

Validate:

- Required fields
- Email format
- Password requirements
- Numeric values
- Dates
- File uploads
- IDs
- Eligibility criteria
- Application data

Never assume frontend validation is sufficient.

---

# 24. Error Handling

Use centralized backend error handling.

Errors returned to users should be:

- Clear
- Useful
- Safe
- Non-technical where appropriate

Do not expose:

```text
SQL queries
Stack traces
File paths
Environment variables
Internal service details
```

---

# 25. Testing Rules

Important functionality must have tests.

Prioritize testing for:

- Authentication
- Authorization
- Eligibility engine
- Duplicate application prevention
- Application creation
- Placement drive rules
- Shortlisting
- Selection/placement tracking
- AI matching logic

### Testing Process

```text
Implement
   ↓
Run Tests
   ↓
Fix Failures
   ↓
Run Tests Again
   ↓
Review
   ↓
Commit
```

Do not continue to the next major module while known critical tests are failing.

---

# 26. Postman/API Testing

Use Postman to verify APIs.

For protected APIs, test:

- Valid token
- Missing token
- Invalid token
- Wrong role
- Valid role
- Invalid input
- Missing required fields
- Unauthorized resource access

---

# 27. Git Rules

Use Git from the beginning.

### Workflow

```text
Create Feature
      ↓
Implement
      ↓
Test
      ↓
Review
      ↓
Commit
      ↓
Push
```

### Commit Rules

Use small, meaningful commits.

Good:

```text
Add JWT authentication
Add student registration API
Add placement drive creation
Add eligibility service
Add application duplicate check
Add AI skill matching
```

Avoid:

```text
update
changes
final
final2
new
fix stuff
```

### Git Safety

Before major changes:

```bash
git status
git add .
git commit -m "Working version before feature change"
```

Never intentionally remove working functionality without checking its dependencies.

---

# 28. AI Coding Rules for Cursor

When using Cursor:

- Do not blindly accept AI-generated code.
- Inspect generated code before committing.
- Ask Cursor to explain unfamiliar changes.
- Prefer small changes over large rewrites.
- Do not allow AI to modify unrelated files.
- Review database migrations/schema changes carefully.
- Review authentication and authorization code manually.
- Test every important generated feature.
- Keep Git checkpoints before large AI changes.

### Preferred Cursor Workflow

```text
Ask Cursor
    ↓
Inspect Plan
    ↓
Review Files to Change
    ↓
Implement
    ↓
Review Diff
    ↓
Run Tests
    ↓
Run Application
    ↓
Verify Feature
    ↓
Git Commit
```

---

# 29. File Modification Rules

When implementing a feature:

- Modify only required files.
- Avoid unnecessary refactoring.
- Do not rename unrelated files.
- Do not delete existing functionality without a reason.
- Do not rewrite entire files when a small change is sufficient.
- Preserve existing APIs unless the change requires an API modification.

For large refactoring, explain:

1. Why it is required.
2. Which files will change.
3. What behavior will remain unchanged.
4. How it will be tested.

---

# 30. Documentation Rules

Keep project documentation updated when architecture or behavior changes.

Important documents:

```text
docs/
├── PRD.md
├── ARCHITECTURE.md
├── DESIGN.md
├── API.md
└── DATABASE.md
```

Documentation must reflect the actual implementation.

Do not claim a feature is implemented if it is only planned.

---

# 31. Dependency Rules

Before adding a dependency:

1. Check whether the project already has a solution.
2. Check whether the dependency is actually necessary.
3. Prefer well-maintained and widely used packages.
4. Avoid duplicate libraries that solve the same problem.
5. Update documentation if the dependency changes the architecture.

---

# 32. Performance Rules

For this academic-scale project:

- Avoid unnecessary API requests.
- Avoid unnecessary React re-renders.
- Paginate large lists where appropriate.
- Do not load large datasets unnecessarily.
- Validate file sizes before upload.
- Keep database queries focused.
- Avoid premature optimization.

Prefer simple, maintainable performance improvements.

---

# 33. Code Quality Rules

Code should be:

- Readable
- Modular
- Maintainable
- Consistent
- Testable

Avoid:

- Extremely large functions
- Extremely large React components
- Duplicate logic
- Magic numbers
- Hardcoded credentials
- Unused imports
- Dead code
- Unnecessary comments
- Unnecessary abstractions

Use comments when they explain **why**, not when they merely repeat **what** the code does.

---

# 34. Definition of Done

A feature is not considered complete until:

- [ ] Requirement is understood.
- [ ] Relevant documentation has been checked.
- [ ] Existing implementation has been inspected.
- [ ] Code follows project architecture.
- [ ] UI follows `DESIGN.md`.
- [ ] Authentication/authorization is handled where required.
- [ ] Input validation is implemented.
- [ ] Loading state is handled where applicable.
- [ ] Empty state is handled where applicable.
- [ ] Error state is handled.
- [ ] Important functionality is tested.
- [ ] Application runs successfully.
- [ ] No unrelated files were modified.
- [ ] Git diff has been reviewed.
- [ ] Changes are committed with a meaningful message.

---

# 35. Final Rule

**Do not optimize for writing the most code. Optimize for writing the smallest amount of correct, maintainable code that satisfies the documented requirement.**

The project should remain:

```text
Simple
   +
Consistent
   +
Secure
   +
Testable
   +
Maintainable
```

---

# 36. Quick Reference

```text
PRD.md
→ WHAT + WHY

ARCHITECTURE.md
→ HOW IT WORKS

DESIGN.md
→ HOW IT LOOKS + FEELS

RULES.md
→ HOW AI/DEVELOPERS MUST BUILD IT
```

**These four documents together form the project's development contract.**
