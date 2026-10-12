# Recommended CPRMP Project Structure

## Purpose

The CPRMP project should use a clear, modular folder structure that separates documentation, frontend, backend, AI, tests, configuration, and deployment-related files.

The structure should remain understandable for an MCA Semester-3 team while still following professional development practices.

**Golden Rule:**

> Keep related code together, separate different responsibilities, and do not create unnecessary folders or services.

---

# 1. Recommended Root Structure

```text
cprmp/
│
├── docs/
│   ├── PRD.md
│   ├── ARCHITECTURE.md
│   ├── DESIGN.md
│   ├── TEST_PLAN.md
│   ├── SECURITY.md
│   ├── DECISIONS.md
│   ├── MEMORY.md
│   ├── API.md
│   └── DATABASE.md
│
├── .cursor/
│   └── rules/
│       ├── general.mdc
│       ├── frontend.mdc
│       ├── backend.mdc
│       └── testing.mdc
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── features/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── context/
│   │   ├── utils/
│   │   ├── types/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── models/
│   │   ├── middleware/
│   │   ├── validators/
│   │   ├── utils/
│   │   └── app.js
│   │
│   ├── uploads/
│   ├── package.json
│   └── server.js
│
├── ai-module/
│   ├── app/
│   │   ├── services/
│   │   ├── models/
│   │   ├── utils/
│   │   └── main.py
│   │
│   ├── requirements.txt
│   └── README.md
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .env.example
├── .gitignore
├── README.md
├── TASKS.md
├── DECISIONS.md
└── LICENSE
```

---

# 2. Documentation

The `docs/` directory contains the project's source-of-truth documentation.

```text
docs/
├── PRD.md
├── ARCHITECTURE.md
├── DESIGN.md
├── TEST_PLAN.md
├── SECURITY.md
├── DECISIONS.md
├── MEMORY.md
├── API.md
└── DATABASE.md
```

### Responsibilities

| File | Purpose |
|---|---|
| `PRD.md` | Product requirements and scope |
| `ARCHITECTURE.md` | System architecture |
| `DESIGN.md` | UI/UX and design system |
| `TEST_PLAN.md` | Testing strategy |
| `SECURITY.md` | Security requirements |
| `DECISIONS.md` | Important technical decisions |
| `MEMORY.md` | Current project state |
| `API.md` | API documentation |
| `DATABASE.md` | Database structure and relationships |

Documentation must remain synchronized with the implementation.

---

# 3. Cursor Rules

The `.cursor/rules/` directory contains AI coding rules.

```text
.cursor/
└── rules/
    ├── general.mdc
    ├── frontend.mdc
    ├── backend.mdc
    └── testing.mdc
```

### `general.mdc`

Contains rules applicable to the entire project:

- Read project documentation first
- Follow `TASKS.md`
- Follow `MEMORY.md`
- Follow architecture rules
- Follow security rules
- Make small changes
- Do not implement unrelated tasks
- Test before committing
- Do not expose secrets

### `frontend.mdc`

Contains React/Vite-specific rules:

- Follow `DESIGN.md`
- Use reusable components
- Keep API calls in appropriate service layers
- Do not place database logic in frontend
- Follow responsive design rules
- Follow accessibility requirements

### `backend.mdc`

Contains Node/Express-specific rules:

- Validate all inputs
- Use controllers/services appropriately
- Enforce authentication and authorization
- Protect resource ownership
- Keep secrets server-side
- Handle API errors consistently
- Follow database rules

### `testing.mdc`

Contains testing rules:

- Test every completed feature
- Follow `TEST_PLAN.md`
- Write appropriate unit/integration/E2E tests
- Test error states
- Test authorization
- Test responsive behavior where applicable
- Do not claim a feature works without testing it

---

# 4. Frontend

The CPRMP frontend uses:

```text
React + Vite + JavaScript
```

Structure:

```text
frontend/
└── src/
    ├── components/
    ├── pages/
    ├── layouts/
    ├── features/
    ├── services/
    ├── hooks/
    ├── context/
    ├── utils/
    ├── types/
    └── assets/
```

### Components

Reusable UI components:

```text
Button
Input
Modal
Card
Table
Badge
Navbar
Sidebar
Loader
ErrorMessage
EmptyState
```

### Pages

Role/module-level screens:

```text
Login
Student Dashboard
Student Profile
Resume
Placement Drives
Applications
Recruiter Dashboard
Applicants
Admin Dashboard
Company Management
```

### Features

Feature-specific UI and logic.

Examples:

```text
features/
├── auth/
├── student/
├── resume/
├── company/
├── placement/
├── application/
├── recruiter/
└── ai-matching/
```

---

# 5. Backend

The backend uses:

```text
Node.js + Express.js
```

Structure:

```text
backend/
└── src/
    ├── config/
    ├── routes/
    ├── controllers/
    ├── services/
    ├── models/
    ├── middleware/
    ├── validators/
    └── utils/
```

### Routes

Define API endpoints.

Example:

```text
/routes/auth.routes.js
/routes/student.routes.js
/routes/company.routes.js
/routes/placement.routes.js
/routes/application.routes.js
```

### Controllers

Handle HTTP request/response logic.

### Services

Contain business logic.

Examples:

```text
authService
eligibilityService
applicationService
placementService
aiMatchingService
```

### Models

Represent database entities.

Examples:

```text
User
StudentProfile
Resume
Company
PlacementDrive
Application
PlacementHistory
AIMatchResult
```

### Middleware

Examples:

```text
authentication
authorization
validation
error handling
file upload
```

---

# 6. AI Module

The CPRMP AI module is separated from the main backend.

```text
ai-module/
└── app/
    ├── services/
    ├── models/
    ├── utils/
    └── main.py
```

Technology:

```text
Python
Scikit-learn / lightweight NLP
```

Primary responsibility:

```text
Resume
  ↓
Extract Skills
  ↓
Compare With Job Requirements
  ↓
Calculate Match
  ↓
Identify Skill Gaps
  ↓
Generate Recommendations
```

The AI module must remain assistive.

It must **not** replace or override the deterministic eligibility engine.

---

# 7. Tests

Testing is separated into:

```text
tests/
├── unit/
├── integration/
└── e2e/
```

### Unit

Test individual functions/services.

### Integration

Test interactions between:

```text
API
Backend
Database
Services
```

### E2E

Test complete user workflows.

Examples:

```text
Student Registration
        ↓
Login
        ↓
Profile
        ↓
Resume
        ↓
Placement Drive
        ↓
Eligibility
        ↓
Application
```

---

# 8. Environment Configuration

At the root:

```text
.env.example
```

Real environment files containing secrets must not be committed.

Development, preview, and production must use separate configuration.

```text
Development
    ↓
Preview
    ↓
Production
```

Environment-specific values must be configured through the appropriate environment/deployment system.

---

# 9. README.md

The root `README.md` should explain:

- Project overview
- Features
- Technology stack
- Project structure
- Installation
- Environment setup
- Running frontend
- Running backend
- Running AI module
- Testing
- Deployment
- Team information

A new developer should be able to understand and run the project using the README.

---

# 10. TASKS.md

`TASKS.md` remains at the project root because it is the active development task tracker.

```text
TASKS.md
```

It should contain:

- Task ID
- Phase
- Task description
- Status
- Dependencies
- Acceptance criteria
- Testing requirements

The current project task should always be clear.

---

# 11. DECISIONS.md

Although a copy/reference may be discussed at the root, the canonical project documentation location is:

```text
docs/DECISIONS.md
```

Important architectural and technical decisions must be recorded there.

Avoid maintaining two independent versions of the same document.

---

# 12. MEMORY.md

The canonical project memory file is:

```text
docs/MEMORY.md
```

It should track:

```text
Current Phase
Current Task
Current Module
Completed Work
Known Issues
Important Decisions
Next Step
```

AI tools should read it before continuing an existing workflow.

---

# 13. What Should NOT Be Added

Do not create folders simply to make the project look more professional.

Avoid unnecessary structures such as:

```text
microservices/
10 different utility layers
duplicate service folders
duplicate documentation
unused frameworks
unused packages
unused configuration files
```

CPRMP is an MCA Semester-3 mini project with two developers.

The architecture should remain understandable and maintainable.

---

# 14. Structure Must Follow Architecture

The folder structure must represent the actual architecture.

```text
Frontend
   ↓
Backend API
   ↓
MySQL

Backend
   ↓
AI Module
```

Do not create a folder structure for technologies that the project does not actually use.

For example, CPRMP currently uses:

```text
React + Vite
Node + Express
MySQL
Python AI
```

Therefore, do not introduce Next.js-specific folders, MongoDB-specific layers, or unnecessary microservice structures unless the architecture is intentionally changed and documented.

---

# 15. Final Principle

A good project structure should make it easy to answer:

```text
Where is the UI?
        ↓
frontend/

Where is the API?
        ↓
backend/

Where is the AI?
        ↓
ai-module/

Where are the tests?
        ↓
tests/

Where are the project rules?
        ↓
docs/ + .cursor/rules/

Where are the current tasks?
        ↓
TASKS.md

Where do I understand the project?
        ↓
README.md + docs/
```

### Final Rule

> **Use a structure that makes responsibilities obvious. Keep CPRMP modular, but do not introduce complexity that the project does not need.**