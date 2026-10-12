# CPRMP — AI Project Context

You are working on an MCA Semester-3 group mini project called:

**Campus Placement and Recruitment Management Portal (CPRMP)**

Before making any changes, read and understand the following project documentation:
```
PRD.md
ARCHITECTURE.md
DESIGN.md
RULES.md
TASKS.md
```

## IMPORTANT

**Do not modify, create, delete, or generate any project files yet.**

**Do not write application code yet.**

**Do not install packages yet.**

**Do not initialize or change the database yet.**

Your first task is only to understand the project and prepare an implementation plan.

---

# Step 1 — Understand the Product

Read `PRD.md` carefully.

Understand:

- Product purpose
- Problem being solved
- Target users
- Three system roles
- Core features
- MVP scope
- 10 core functional modules
- Out-of-scope features
- User flows
- AI Resume–Job Matching functionality
- Functional requirements
- Non-functional requirements
- Project constraints

Do not invent features that are not defined in the PRD.

---

# Step 2 — Understand the Architecture

Read `ARCHITECTURE.md`.

Understand:

- Overall application architecture
- Frontend architecture
- Backend architecture
- Database architecture
- Authentication architecture
- AI module architecture
- REST API approach
- Frontend/backend separation
- Backend layer responsibilities
- Project folder structure
- Data flow
- Security boundaries
- Communication between frontend, backend, database, and AI module

Pay particular attention to which responsibilities belong to:
```
Frontend
Backend
Database
AI Module
```

Do not change the architecture without identifying the reason and following the project's decision process.

---

# Step 3 — Review the Design System

Read `DESIGN.md`.

Understand:

- Visual style
- Typography
- Color system
- Buttons
- Forms
- Cards
- Navigation
- Dashboard design
- Tables
- Status badges
- AI matching UI
- Loading states
- Empty states
- Error states
- Success states
- Responsive requirements
- Accessibility requirements

The implementation must follow the existing design system rather than introducing a separate visual style.

---

# Step 4 — Review Development Rules

Read `RULES.md` completely.

Treat `RULES.md` as mandatory project instructions.

Pay particular attention to:

- Coding conventions
- Frontend rules
- Backend rules
- Database rules
- Authentication rules
- Authorization rules
- Security requirements
- API rules
- Testing rules
- Git rules
- AI/Cursor development rules
- File modification rules
- Dependency rules
- Documentation rules
- Definition of Done

Do not bypass or ignore these rules.

If another instruction conflicts with `RULES.md`, identify the conflict instead of silently choosing an approach.

---

# Step 5 — Review Current Tasks

Read `TASKS.md`.

Understand:

- Development phases
- Task dependencies
- Task order
- Task objectives
- Task workflow
- Definition of task completion

The current project state is:
```
Current Phase:
Phase 1 — Project Setup

Current Task:
TASK-001 — Initialize Project
```

Do not start TASK-002 or any later task.

Do not implement the entire application.

---

# Step 6 — Identify Missing Information

After reading all five documents, identify information that is missing or unclear before TASK-001 can be implemented.

Separate findings into:

### A. Blocking Information

Information that must be known before TASK-001 can begin.

### B. Non-Blocking Information

Information that can be decided later without blocking TASK-001.

### C. Already Defined

Information that is clearly defined in the project documentation and does not need clarification.

Do not invent answers for missing information.

If something is genuinely missing, clearly identify it.

---

# Step 7 — Explain TASK-001

Based only on the project documentation, explain how TASK-001 should be implemented.

## TASK-001 — Initialize Project

The task currently requires:

- Create the `cprmp` project folder.
- Initialize Git.
- Create/connect the GitHub repository.
- Create the initial `README.md`.
- Create `.gitignore`.
- Create the `docs/` directory.
- Make the initial commit.

Explain:

1. What needs to be created.
2. What files/directories should exist after TASK-001.
3. What should NOT be created yet.
4. What dependencies, if any, are required.
5. What should be verified before marking TASK-001 complete.
6. What should be included in the initial Git commit.
7. What should remain for TASK-002.

---

# Important Project Constraints

Keep these constraints in mind while reviewing the project:

- Project is an MCA Semester-3 group mini project.
- Team size is 2 students.
- Use exactly three primary roles:
  - Student
  - Admin / Placement Officer
  - Recruiter
- Use **Recruiter** consistently.
- Do not use "Requirator".
- Keep the architecture manageable for two students.
- Do not introduce unnecessary microservices.
- Use the existing technology decisions.
- Official eligibility is deterministic.
- AI matching is assistive only.
- AI must never override official eligibility.
- Do not expand the MVP without a clear requirement.
- Do not build the entire application in one step.
- Implement one task at a time.
- Test before marking a task complete.
- Follow Git and documentation rules.

---

# Current Technology Decisions

The project documentation defines the following stack:
```
AI IDE:
Cursor

Frontend:
React.js + Vite

Language:
JavaScript

Styling:
Tailwind CSS

Backend:
Node.js + Express.js

Database:
MySQL

Authentication:
JWT + bcrypt

AI Module:
Python + Scikit-learn / NLP

API:
REST

Testing:
Jest + Supertest + Postman

Version Control:
Git + GitHub

Frontend Deployment:
Vercel

Backend Deployment:
Render / Railway
```

Do not replace these technologies during TASK-001.

---

# Required Response Format

After reading all five documents, respond with the following sections:

## 1. Project Understanding

Briefly explain what CPRMP does and who uses it.

## 2. Architecture Understanding

Explain the main architectural layers and how they communicate.

## 3. Design Understanding

Summarize the important design-system requirements.

## 4. Development Rules Understanding

List the most important rules that will affect implementation.

## 5. Current Task Understanding

Explain what TASK-001 means.

## 6. Missing Information

### Blocking

- ...

### Non-Blocking

- ...

### Already Defined

- ...

## 7. TASK-001 Implementation Plan

Provide a step-by-step implementation plan.

## 8. Expected Project Structure After TASK-001

Show the expected directory/file structure.

## 9. What Will NOT Be Done Yet

Clearly list the work that belongs to later tasks.

## 10. Verification Checklist

Provide a checklist for deciding whether TASK-001 is complete.

---

# Final Instruction

**Do not write code.**

**Do not modify any files.**

**Do not install dependencies.**

**Do not run project initialization commands.**

**Do not create the project structure yet.**

Only read, understand, identify missing information, and explain the implementation plan for TASK-001.

Wait for explicit approval before making any changes.