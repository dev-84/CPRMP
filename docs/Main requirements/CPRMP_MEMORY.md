# CPRMP — Project Memory

## 1. Project

**Project Name:** Campus Placement and Recruitment Management Portal (CPRMP)

**Project Type:** MCA Semester-3 Group Mini Project

**Team Size:** 2 Members

**Members:**

- Dev Chauhan
- Avinash Dhobi

---

# 2. Current Status

**Overall Status:** Project setup, frontend foundation, and backend foundation are implemented, verified, committed, and pushed through TASK-005. MongoDB connectivity remains unverified.

**Current Phase:** Phase 1 — Project Setup

**Current Task / Next Step:** TASK-006 — Configure MongoDB with Mongoose

**Current Development Module:** Frontend foundation complete; backend foundation complete and verified; database connection not yet configured or verified

---

# 3. Completed

### Verified Setup Tasks

- TASK-001 — Completed and verified
- TASK-002 — Completed and verified
- TASK-003 — Completed and verified
- TASK-004 — Completed and verified
- TASK-005 — Completed and verified

### Project Planning

- Project idea finalized
- Product Requirements Document prepared
- 10+ functional modules identified
- MVP scope defined
- Out-of-scope features defined
- Three system roles defined:
  - Student
  - Admin / Placement Officer
  - Recruiter

### Architecture

- Architecture documentation prepared
- Frontend architecture defined
- Backend architecture defined
- Database architecture defined
- Authentication architecture defined
- AI architecture defined
- Folder structure defined
- Architectural rules defined

### Design

- Design system defined
- Color system defined
- Typography defined
- Button styles defined
- Card styles defined
- Form guidelines defined
- Responsive requirements defined
- Loading/empty/error states defined
- Accessibility requirements defined

### Development Rules

- `RULES.md` prepared
- Cursor/AI development rules defined
- Security rules defined
- Testing rules defined
- Git rules defined
- Code quality rules defined

### Task Planning

- `TASKS.md` prepared
- Development phases defined
- Task-by-task implementation plan created
- Task workflow defined

### Technical Decisions

- `DECISIONS.md` prepared
- Frontend technology selected
- Backend technology selected
- Database selected
- Authentication approach selected
- AI approach selected
- Testing approach selected
- Deployment approach selected

---

# 4. Current Technology Stack

| Area                | Current Decision            |
| ------------------- | --------------------------- |
| AI IDE              | Cursor                      |
| Frontend            | React.js + Vite             |
| Language            | JavaScript                  |
| Styling             | Tailwind CSS                |
| Backend             | Node.js + Express.js        |
| Database            | MongoDB Community Server + Mongoose |
| Authentication      | JWT + bcrypt                |
| AI Module           | Python + Scikit-learn / NLP |
| API                 | REST                        |
| Testing             | Jest + Supertest + Postman  |
| Version Control     | Git + GitHub                |
| Frontend Deployment | Vercel                      |
| Backend Deployment  | Render / Railway            |

---

# 5. Current Core Modules

The planned MVP contains:

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

---

# 6. Development Status by Module

| Module                 | Status      |
| ---------------------- | ----------- |
| Project Setup          | Completed   |
| Backend Foundation     | Completed   |
| Database               | Not Started |
| Authentication         | Not Started |
| Student Profile        | Not Started |
| Resume Management      | Not Started |
| Company Management     | Not Started |
| Placement Drive        | Not Started |
| Eligibility Engine     | Not Started |
| Application Management | Not Started |
| Applicant Management   | Not Started |
| Shortlisting           | Not Started |
| Selection & Placement  | Not Started |
| AI Resume–Job Matching | Not Started |
| Dashboards             | Not Started |
| Testing                | Not Started |
| Deployment             | Not Started |

---

# 7. Current Task

## TASK-006 — Configure MongoDB

**Status:** Not started. First verify the local MongoDB installation and connection, then configure Mongoose and connect the backend. Do not claim database connectivity until a real connection test succeeds.

---

# 8. Known Issues

### Current

- MongoDB/Mongoose connection is not yet configured or verified.
- TASK-006 must verify the local MongoDB connection before backend database integration is implemented.

### Documentation Note

- The design guide exists as `CPRMP_Design_System_Documentation.md`.
- `DESIGN.md` is referenced by older planning documentation but is not present. Do not create a duplicate design file; use the existing design guide and update outdated references when appropriate.
- Ensure the other relevant project documents are available in the repository before making changes.

---

# 9. Important Project Constraints

- The project is being developed by two MCA Semester-3 students.
- Keep the architecture manageable for an academic project.
- Do not introduce unnecessary microservices.
- Do not expand the MVP without a clear requirement.
- Use exactly three primary roles:
  - Student
  - Admin / Placement Officer
  - Recruiter
- Use **Recruiter** consistently.
- Official eligibility must remain deterministic.
- AI matching is assistive only.
- AI must never override official eligibility.
- Do not ask Cursor to build the entire application in one prompt.
- Implement one task at a time.
- Test and commit before moving to the next major task.

---

# 10. Documentation Status

| Document          | Status | Purpose                       |
| ----------------- | ------ | ----------------------------- |
| `PRD.md`          | Ready  | WHAT + WHY                    |
| `ARCHITECTURE.md` | Ready  | HOW it works                  |
| `CPRMP_Design_System_Documentation.md` | Ready | HOW it looks/feels |
| `DESIGN.md`       | Not present | Referenced by older planning documentation |
| `RULES.md`        | Ready  | Development rules             |
| `TASKS.md`        | Ready  | Implementation roadmap        |
| `DECISIONS.md`    | Ready  | Permanent technical decisions |
| `MEMORY.md`       | Active | Current project state         |

---

# 11. Next Step

Complete the current task:

**TASK-006 — Configure MongoDB with Mongoose**

Configure the MongoDB connection through Mongoose and verify it from the backend. Do not claim connectivity until the actual connection test succeeds.

---

# 12. How to Update MEMORY.md

`MEMORY.md` must always describe the **actual current state**, not the planned state.

After completing a task:

1. Mark the task as completed.
2. Update the current phase.
3. Update the current task.
4. Update the module status.
5. Record newly discovered issues.
6. Record the next step.
7. Commit the updated `MEMORY.md`.

Example:
```
Before:

Current Task: TASK-001
Status: In Progress

After:

Current Task: TASK-002
Status: TASK-001 Completed
```

---

# 13. Important Distinction
```
DECISIONS.md
      ↓
Permanent Technical Decisions

MEMORY.md
      ↓
Current Project State
```

### DECISIONS.md answers:

> **Why did we choose this approach?**

### MEMORY.md answers:

> **Where are we right now?**

---

# 14. Current State Summary
```
CPRMP
 │
 ├── Planning              ✓ Complete
 ├── PRD                   ✓ Complete
 ├── Architecture          ✓ Complete
 ├── Design System         ✓ Complete
 ├── Development Rules     ✓ Complete
 ├── Task Roadmap          ✓ Complete
 ├── Technical Decisions   ✓ Complete
 │
 └── Implementation        → In Progress
                              │
                              ↓
                          TASK-006
                    Configure MongoDB with Mongoose
```

**MEMORY.md = CURRENT STATE, not permanent decisions.