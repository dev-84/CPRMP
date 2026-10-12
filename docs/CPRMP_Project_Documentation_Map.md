# Project Documentation Map

## Purpose

Each CPRMP documentation file has a specific responsibility.

The team and AI coding tools should know **which file answers which question** instead of putting all project information into one document.

**Golden Rule:**

> One document should have one clear primary responsibility, and all documentation must remain consistent with the actual project.

---

# 1. Core Documentation

| File              | Purpose                                | Stage         |
| ----------------- | -------------------------------------- | ------------- |
| `PRD.md`          | What are we building?                  | Planning      |
| `ARCHITECTURE.md` | How will we build it?                  | Planning      |
| `DESIGN.md`       | How should it look and behave?         | Planning      |
| `RULES.md`        | How should AI and developers code?     | Planning      |
| `TASKS.md`        | What should we build next?             | Development   |
| `DECISIONS.md`    | Why did we make this decision?         | Development   |
| `MEMORY.md`       | What is the current project state?     | Development   |
| `TEST_PLAN.md`    | How do we verify it?                   | Testing       |
| `SECURITY.md`     | How do we protect it?                  | Development   |
| `.env.example`    | What configuration is required?        | Setup         |
| `README.md`       | How do humans use and run the project? | Documentation |

---

# 2. PRD.md

### Question

> **What are we building?**

`PRD.md` defines the product requirements for CPRMP.

It describes:

- Product purpose
- Problem
- Target users
- Core value proposition
- Features
- Functional requirements
- User stories
- Modules
- MVP scope
- Out-of-scope features
- Success criteria

Example:
```
CPRMP
 ↓
Student
Admin / Placement Officer
Recruiter
 ↓
Placement Lifecycle
```

`PRD.md` defines **what the product should do**, not how developers should implement it.

### Stage

**Planning**

---

# 3. ARCHITECTURE.md

### Question

> **How will we build it?**

`ARCHITECTURE.md` defines the technical architecture.

It describes:

- Frontend architecture
- Backend architecture
- Database architecture
- AI module
- API communication
- Authentication flow
- Authorization
- File storage
- Component relationships
- Deployment architecture
- Data flow

Current CPRMP architecture:
```
React + Vite
      ↓
Node + Express
      ↓
MySQL

Backend
      ↓
Python AI Module
```

### Stage

**Planning**

---

# 4. DESIGN.md

### Question

> **How should it look and behave?**

`DESIGN.md` defines the CPRMP UI/UX and design system.

It describes:

- Visual style
- Colors
- Typography
- Buttons
- Forms
- Cards
- Tables
- Navigation
- Dashboards
- Status badges
- AI matching interface
- Responsive behavior
- Accessibility
- Loading states
- Empty states
- Error states

### Stage

**Planning**

---

# 5. RULES.md

### Question

> **How should AI and developers code?**

`RULES.md` contains development rules and engineering practices.

It includes rules for:

- AI-assisted development
- Small AI tasks
- Git workflow
- Testing
- Debugging
- Code review
- Security
- Deployment
- Environment variables
- Preview-first deployment
- Production QA
- Monitoring
- Documentation maintenance
- Project structure

AI tools such as Cursor must follow these rules when modifying CPRMP.

### Stage

**Planning → Development**

---

# 6. TASKS.md

### Question

> **What should we build next?**

`TASKS.md` is the active implementation roadmap.

It contains:

- Phases
- Task IDs
- Task descriptions
- Status
- Dependencies
- Acceptance criteria
- Testing requirements
- Next task

Example:
```
TASK-001
Initialize Project
Status: In Progress

TASK-002
Create Project Structure
Status: Not Started
```

The AI must not automatically jump to the next task after completing the current one.

### Stage

**Development**

---

# 7. DECISIONS.md

### Question

> **Why did we make this decision?**

`DECISIONS.md` records important technical and architectural decisions.

Examples:
```
React + Vite
MySQL
Node + Express
JWT + bcrypt
Three user roles
Layered architecture
Deterministic eligibility
Assistive AI matching
```

Each important decision should explain the reasoning and consequences.

This prevents the team or AI from repeatedly reconsidering already-settled decisions without context.

### Stage

**Development**

---

# 8. MEMORY.md

### Question

> **What is the current project state?**

`MEMORY.md` provides a compact snapshot of the current CPRMP state.

It should track:

- Current phase
- Current task
- Current module
- Completed work
- Known issues
- Important implementation details
- Current architecture changes
- Next step

Example:
```
Current Phase:
Phase 1 — Project Setup

Current Task:
TASK-001

Status:
Planning complete.
Coding not started.

Next:
Complete project initialization.
```

AI should read this before continuing an existing project workflow.

### Stage

**Development**

---

# 9. TEST_PLAN.md

### Question

> **How do we verify it?**

`TEST_PLAN.md` defines how CPRMP features are tested.

It covers:

- Unit testing
- Integration testing
- API testing
- E2E testing
- Authentication testing
- Authorization testing
- Database testing
- Responsive testing
- Accessibility testing
- Error handling
- Regression testing
- Production QA

The core principle is:

> If it has not been tested, it is not considered working.

### Stage

**Testing**

---

# 10. SECURITY.md

### Question

> **How do we protect it?**

`SECURITY.md` defines CPRMP security requirements.

It covers:

- Authentication
- Authorization
- Password security
- JWT security
- Input validation
- API security
- Database security
- File upload security
- Resume protection
- Secrets
- Environment variables
- CORS
- Error handling
- Logging
- Dependency security
- Security testing

Security must be considered throughout development rather than only before deployment.

### Stage

**Development → Deployment**

---

# 11. .env.example

### Question

> **What configuration is required?**

`.env.example` documents the environment variables required to run CPRMP.

Example:
```
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173

DB_HOST=localhost
DB_PORT=3306
DB_NAME=cprmp
DB_USER=your_database_username
DB_PASSWORD=your_database_password

JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=1d

AI_SERVICE_URL=http://localhost:8000
```

It must contain placeholders, not real credentials.

Real `.env` files must not be committed.

### Stage

**Setup**

---

# 12. README.md

### Question

> **How do humans use and run the project?**

`README.md` is the primary human-facing introduction to CPRMP.

It should explain:

- What CPRMP is
- Main features
- Technology stack
- Project structure
- Installation
- Environment setup
- How to run the frontend
- How to run the backend
- How to run the AI module
- Testing
- Deployment
- Basic usage

A new developer should be able to understand and start the project from the README.

### Stage

**Documentation**

---

# 13. How the Documents Work Together

The documentation forms a chain:
```
PRD.md
"What are we building?"
        ↓
ARCHITECTURE.md
"How will we build it?"
        ↓
DESIGN.md
"How should it look?"
        ↓
RULES.md
"How should we develop it?"
        ↓
TASKS.md
"What should we build next?"
        ↓
Implementation
        ↓
TEST_PLAN.md
"Does it work?"
        ↓
SECURITY.md
"Is it protected?"
        ↓
MEMORY.md
"What is the current state?"
        ↓
README.md
"How do humans use it?"
```

`DECISIONS.md` records the reasoning behind important choices throughout this process.

---

# 14. AI Context Hierarchy

When an AI coding tool works on CPRMP, it should use the documents according to the task.

### Product question

Read:
```
PRD.md
```

### Architecture question

Read:
```
ARCHITECTURE.md
DECISIONS.md
```

### UI question

Read:
```
DESIGN.md
PRD.md
```

### Coding task

Read:
```
RULES.md
TASKS.md
MEMORY.md
```

and the relevant architecture/design/security documents.

### Testing task

Read:
```
TEST_PLAN.md
RULES.md
SECURITY.md
```

### Security task

Read:
```
SECURITY.md
ARCHITECTURE.md
RULES.md
```

### Continuing existing work

Read:
```
MEMORY.md
TASKS.md
```

before making changes.

---

# 15. Documentation Source-of-Truth Rule

Do not duplicate the same information unnecessarily across documents.

For example:
```
Product requirements
→ PRD.md

Architecture
→ ARCHITECTURE.md

UI rules
→ DESIGN.md

Development rules
→ RULES.md

Current task
→ TASKS.md

Technical decisions
→ DECISIONS.md

Current state
→ MEMORY.md

Testing
→ TEST_PLAN.md

Security
→ SECURITY.md
```

If a fact changes, update its authoritative document and update other documents only when necessary.

---

# 16. Final Documentation Principle

Every file should answer a clear question:
```
PRD.md
      ↓
What are we building?

ARCHITECTURE.md
      ↓
How will we build it?

DESIGN.md
      ↓
How should it look?

RULES.md
      ↓
How should we code it?

TASKS.md
      ↓
What should we build next?

DECISIONS.md
      ↓
Why did we choose this?

MEMORY.md
      ↓
What is the current state?

TEST_PLAN.md
      ↓
How do we verify it?

SECURITY.md
      ↓
How do we protect it?

.env.example
      ↓
What configuration is required?

README.md
      ↓
How do humans use it?
```

### Final Rule

> **Every document should have a clear purpose. Keep the documentation accurate, focused, and synchronized with the actual CPRMP implementation.**
