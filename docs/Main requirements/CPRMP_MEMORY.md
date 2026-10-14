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

**Overall Status:** TASK-001 through TASK-007 completed, verified, committed, and pushed. TASK-008 documentation review is in progress.

**Current Phase:** Phase 1 — Project Setup

**Current Task / Next Step:** Complete TASK-008 documentation review, verify the final changes, then commit and push the reviewed documentation.

**Current Development Module:** Frontend foundation, backend foundation, MongoDB connection, and development tooling configured and verified.

---

# 3. Completed

### Verified Setup Tasks

- TASK-001 — Completed, verified, committed, and pushed
- TASK-002 — Completed, verified, committed, and pushed
- TASK-003 — Completed, verified, committed, and pushed
- TASK-004 — Completed, verified, committed, and pushed
- TASK-005 — Completed, verified, committed, and pushed
- TASK-006 — Completed, verified, committed, and pushed
- TASK-007 — Completed, verified, committed, and pushed (`7886dc4`).

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

- `CPRMP_AI_Development_Rules.md` prepared
- Cursor/AI development rules defined
- Security rules defined
- Testing rules defined
- Git rules defined
- Code quality rules defined

### Task Planning

- `CPRMP_Development_Tasks.md` prepared
- Development phases defined
- Task-by-task implementation plan created
- Task workflow defined

### Technical Decisions

- `CPRMP_Architecture_Decisions.md` prepared
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
| Database               | Connection Configured |
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

## TASK-007 - Configure Development Tools

**Status:** Completed, verified, committed, and pushed. Latest commit: `7886dc4` - `chore: configure development tools`.

**Verified:**
- Existing frontend ESLint configuration retained; frontend lint had previously passed.
- Root `.editorconfig` created with UTF-8, two-space indentation, final newline, and trailing-whitespace rules.
- Jest and Supertest installed as backend development dependencies.
- Jest configured in `backend/jest.config.js` to discover tests in the existing root `tests` directory.
- `npm test --prefix .\backend` — 2 integration tests passed: health endpoint and unknown-route HTTP 404.
- Postman `CPRMP API Tests` collection created with the saved `Health Check` request.
- Postman `GET http://localhost:5000/api/health` returned HTTP 200 with the expected JSON.
- Node.js v24.14.1, npm 11.11.0, and Python 3.14.3 verified.
- Local `backend/.env` remains ignored by Git.
- `git diff --check` reported no whitespace errors; line-ending warnings were informational.

**Remaining:** TASK-007 is complete. TASK-008 documentation review, verification, commit, and push remain in progress.


---

# 8. Known Issues

### Current

- TASK-008 documentation review is in progress; its checklist remains pending until the required documents have been reviewed and verified.
- Postman created local workspace metadata under `.postman/`; review these files before deciding whether to commit them.

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

| Document | Status | Purpose |
| --- | --- | --- |
| CPRMP_PRD.md | Ready | Product requirements (WHAT + WHY) |
| CPRMP_Architecture_Documentation.md | Ready | System architecture (HOW it works) |
| CPRMP_Design_System_Documentation.md | Ready | UI design system and visual behavior |
| CPRMP_AI_Development_Rules.md | Ready | AI and development rules |
| CPRMP_Development_Tasks.md | Active | Implementation roadmap |
| CPRMP_Architecture_Decisions.md | Active | Technical architecture decisions |
| CPRMP_MEMORY.md | Active | Current project state and continuity |
| CPRMP_Environment_Variables.md | Ready | Environment configuration reference |
| CPRMP_Security_Requirements.md | Ready | Security requirements |
| CPRMP_Test_Plan.md | Ready | Testing strategy and verification plan |
| CPRMP_Architecture_Decisions.md.bak | Backup - retain until final review | Temporary backup of architecture decisions |
| DESIGN.md | Not present | Older planning reference; use the existing design system document |
---

# 11. Next Step

Complete the current task:

**Complete TASK-008 documentation review, verify the final changes, then stage only intended files, commit, push, and verify the remote.**

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
 └── Implementation        → In Progress
                              │
                              ↓
                    TASK-006 — Configure MongoDB
                    completed and pushed
                              │
                              ↓
                    TASK-007 — Configure
                    Development Tools
                    verified, committed, and pushed
                              │
                              ↓
                    TASK-008 - Documentation Review
                    in progress
```

**MEMORY.md = CURRENT STATE, not permanent decisions.
