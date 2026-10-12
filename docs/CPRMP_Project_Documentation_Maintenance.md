# Project Documentation Maintenance

## Purpose

CPRMP documentation must remain synchronized with the actual implementation.

As the project changes, the relevant documentation must be updated. Documentation should describe what the project **currently is**, not what it used to be or what the team originally planned.

**Golden Rule:**

> Never allow documentation to describe an application that no longer exists.

Accurate documentation gives developers and AI coding tools the context required to make safe and consistent changes.

---

# 1. Core Project Documentation

The following files must be maintained throughout development:
```
TASKS.md
MEMORY.md
DECISIONS.md
README.md
ARCHITECTURE.md
```

Other project documents should also be updated when their related behavior changes, such as:
```
PRD.md
DESIGN.md
RULES.md
TEST_PLAN.md
SECURITY.md
API.md
DATABASE.md
```

---

# 2. TASKS.md

`TASKS.md` tracks project implementation progress.

Update it when:

- A task starts
- A task is completed
- A task is blocked
- A task is cancelled
- A task is split into smaller tasks
- A task's scope changes
- A new implementation task is discovered

Example:
```
Before:

TASK-006 — Student Registration
Status: Not Started

After:

TASK-006 — Student Registration
Status: Completed
```

Do not mark a task as completed simply because code was generated.

A task should be marked complete only after the required implementation and testing have been completed.

---

# 3. MEMORY.md

`MEMORY.md` maintains the current working state of the project.

Update it when there is a meaningful change to:

- Current development phase
- Current task
- Completed modules
- Active module
- Important implementation decisions
- Known issues
- Architecture
- Technology stack
- Current project status
- Next development step

Example:
```
Current Phase:
Phase 2 — Authentication

Current Task:
TASK-005 — Student Login

Current Status:
Student registration completed and tested.
Student login currently in development.

Next Step:
Complete login API integration.
```

The purpose is to allow AI tools to quickly understand the current state without guessing.

---

# 4. DECISIONS.md

`DECISIONS.md` records important architectural and technical decisions.

Update it when the team makes a significant decision about:

- Technology
- Architecture
- Database
- Authentication
- Authorization
- AI implementation
- API design
- File storage
- Deployment
- Testing
- Security
- Project scope

Each decision should explain:
```
Decision
Why it was chosen
Alternatives considered
Consequences
```

Example:
```
Decision:
Use MySQL for CPRMP.

Reason:
The project requires relational data and structured relationships
between students, companies, placement drives, applications,
and placements.
```

Do not silently change a major architectural decision without recording it.

---

# 5. README.md

`README.md` should provide an accurate overview of the current project.

Update it when there are changes to:

- Project description
- Features
- Technology stack
- Installation instructions
- Environment configuration
- Running instructions
- Project structure
- Testing commands
- Deployment instructions
- Current functionality

The README should be useful to a new developer who has never seen the project.

Do not leave outdated commands or technologies in the README.

---

# 6. ARCHITECTURE.md

`ARCHITECTURE.md` must describe the actual system architecture.

Update it when there are changes to:

- Frontend architecture
- Backend architecture
- API structure
- Database architecture
- AI module
- Authentication flow
- Authorization
- File storage
- External services
- Deployment architecture
- Communication between components

Example:

If the project changes from:
```
React
   ↓
Express
   ↓
MySQL
```

to:
```
React
   ↓
Express
   ↓
MySQL

        +
Python AI Service
```

then `ARCHITECTURE.md` must be updated.

---

# 7. Documentation Update Rule

Whenever implementation changes the documented behavior of the system:
```
Code Change
    ↓
Determine Documentation Impact
    ↓
Update Relevant Documentation
    ↓
Review
    ↓
Commit Together
```

Do not postpone important documentation updates indefinitely.

---

# 8. Documentation and Code Must Agree

The following must not contradict each other:
```
PRD.md
   ↓
ARCHITECTURE.md
   ↓
DESIGN.md
   ↓
RULES.md
   ↓
TASKS.md
   ↓
MEMORY.md
   ↓
Implementation
```

If the implementation intentionally changes a documented decision, update the appropriate source documents.

---

# 9. AI Must Read Current Documentation

Before making significant changes, AI coding tools such as Cursor should inspect the relevant project documentation.

At minimum, AI should understand:
```
PRD.md
ARCHITECTURE.md
DESIGN.md
RULES.md
TASKS.md
MEMORY.md
```

Additional documents should be read when relevant:
```
DECISIONS.md
TEST_PLAN.md
SECURITY.md
API.md
DATABASE.md
```

AI must not assume that an old conversation or previous generated code represents the current project state.

---

# 10. Do Not Trust Stale Documentation

If documentation and implementation disagree, do not blindly follow either one.

First determine:
```
What is the current implementation?
What was intentionally changed?
Which documentation is outdated?
Was the change approved?
```

Then update the relevant documentation.

The goal is:
```
Current Code
      =
Current Documentation
```

---

# 11. Documentation After Major Features

After completing a major CPRMP feature:
```
Implement
   ↓
Test
   ↓
Review
   ↓
Update Documentation
   ↓
Git Commit
   ↓
Git Push
```

For example, after implementing authentication:
```
Authentication Code
       ↓
Update TASKS.md
       ↓
Update MEMORY.md
       ↓
Update README.md if required
       ↓
Update ARCHITECTURE.md if architecture changed
       ↓
Update DECISIONS.md if a new decision was made
       ↓
Commit
```

Only update documents that are actually affected. Do not create unnecessary documentation changes.

---

# 12. Documentation Review Before Deployment

Before production deployment, verify:

- `TASKS.md` reflects current task status
- `MEMORY.md` reflects current project state
- `DECISIONS.md` contains current major decisions
- `README.md` contains current setup and usage instructions
- `ARCHITECTURE.md` matches the actual architecture
- `PRD.md` still matches the intended product scope
- `DESIGN.md` matches the implemented UI rules
- `TEST_PLAN.md` matches current testing requirements
- `SECURITY.md` matches current security requirements

---

# 13. Documentation Commit

Documentation changes should be committed with the related implementation whenever practical.

Example:
```
git add .
git commit -m "feat: add student profile management"
git push
```

If the change is documentation-only:
```
git add .
git commit -m "docs: update architecture documentation"
git push
```

This keeps the repository history understandable.

---

# 14. Documentation as AI Context

For CPRMP, documentation is not only for human developers.

It is also context for AI coding tools.
```
Project Documentation
        ↓
AI Understands Current State
        ↓
AI Plans Change
        ↓
AI Implements Task
        ↓
Tests
        ↓
Documentation Updated
        ↓
New Current State
```

Accurate documentation reduces the risk of AI:

- Implementing already-completed functionality
- Using an old technology choice
- Violating current architecture
- Reintroducing rejected decisions
- Modifying the wrong files
- Creating duplicate modules
- Breaking project scope
- Assuming outdated APIs
- Repeating previously fixed bugs

---

# 15. Documentation Drift

Documentation drift occurs when documentation and implementation gradually become different.

Example:
```
README says:
MongoDB

Actual application:
MySQL
```

or:
```
ARCHITECTURE.md says:
3 services

Actual application:
Single backend
```

or:
```
TASKS.md says:
Authentication not started

Actual application:
Authentication completed
```

These are documentation inconsistencies and must be corrected.

---

# 16. Documentation Maintenance Checklist

After meaningful project changes:
```
[ ] Did the task status change?
    → Update TASKS.md

[ ] Did the current project state change?
    → Update MEMORY.md

[ ] Did an important technical decision change?
    → Update DECISIONS.md

[ ] Did setup/features/usage change?
    → Update README.md

[ ] Did the architecture change?
    → Update ARCHITECTURE.md

[ ] Did the product requirements change?
    → Review PRD.md

[ ] Did UI/design rules change?
    → Review DESIGN.md

[ ] Did testing requirements change?
    → Review TEST_PLAN.md

[ ] Did security requirements change?
    → Review SECURITY.md
```

---

# 17. Final Documentation Principle

Documentation should describe the **current truth** of the project.

Not:
```
What we originally planned
```

Not:
```
What the AI implemented last week
```

Not:
```
What the old version contained
```

But:
```
What CPRMP currently contains
```

### Final Rule

> **Keep documentation synchronized with implementation. The AI needs accurate context, and the team needs a reliable source of truth.**
