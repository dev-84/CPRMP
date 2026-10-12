# Feature-by-Feature Development Workflow

CPRMP must be developed **one feature/task at a time**.

Do not ask Cursor or another AI coding tool to build multiple unrelated features in a single step.

The required development workflow is:
```
Understand
    ↓
Plan
    ↓
Implement
    ↓
Test
    ↓
Review
    ↓
Commit
    ↓
Next Task
```

---

## 1. Understand

Before implementing a task:

- Read the relevant project documentation.
- Read the task description in `TASKS.md`.
- Understand the feature requirements.
- Identify dependencies on existing features.
- Inspect the existing code before modifying it.
- Identify files that will likely be affected.
- Check applicable security and testing requirements.

Do not start coding until the task is understood.

---

## 2. Plan

Before writing code:

- Explain the implementation approach.
- Identify the files that need to be created or modified.
- Identify required API/database changes.
- Identify validation requirements.
- Identify authorization requirements.
- Identify test cases.
- Check that the proposed approach follows `PRD.md`, `ARCHITECTURE.md`, `DESIGN.md`, and `RULES.md`.

Keep the plan limited to the current task.

Do not implement future tasks as part of the current task.

---

## 3. Implement

Implement only the current task.

Rules:

- Do not implement unrelated features.
- Do not skip ahead to later tasks.
- Do not rewrite working code without a reason.
- Do not introduce unnecessary dependencies.
- Follow the existing architecture.
- Follow the existing design system.
- Follow security requirements.
- Keep frontend, backend, database, and AI responsibilities separated.
- Reuse existing components and utilities where appropriate.

---

## 4. Test

After implementation, test the current feature.

Testing should include applicable:

- Happy path
- Invalid input
- Validation
- Authorization
- Resource ownership
- Error handling
- Edge cases
- Responsive behavior
- API behavior
- Database behavior

Use the project's defined testing tools:
```
Jest
Supertest
Postman
Manual UI Testing
```

A feature is not complete merely because the code compiles or the UI appears.

---

## 5. Review

Before committing:

- Review the changed files.
- Check for unnecessary changes.
- Check for security problems.
- Check for duplicated logic.
- Check validation.
- Check authorization.
- Check error handling.
- Check responsive behavior where applicable.
- Check that project documentation and architecture were followed.
- Check that no secrets were added.
- Check that no unrelated task was implemented.

If problems are found, fix them before committing.

---

## 6. Commit

Only after the feature passes testing and review:

- Create a meaningful Git commit.
- Keep the commit focused on the current task.
- Do not mix unrelated features into the commit.
- Update task status where required.
- Update `MEMORY.md` when the project state changes.

Example:
```
git add .
git commit -m "feat: implement student signup page"
```

---

# Example Development Sequence

Do not build the complete authentication system in one prompt.

Instead, break it into focused tasks.

### TASK-001 — Create Signup Page
```
Understand
    ↓
Plan
    ↓
Implement signup UI
    ↓
Test signup UI
    ↓
Review
    ↓
Commit
```

Then move to:

### TASK-002 — Implement Signup Logic
```
Understand
    ↓
Plan
    ↓
Implement signup API/logic
    ↓
Test
    ↓
Review
    ↓
Commit
```

Then:

### TASK-003 — Add Validation
```
Understand
    ↓
Plan
    ↓
Implement validation
    ↓
Test invalid/valid inputs
    ↓
Review
    ↓
Commit
```

Then:

### TASK-004 — Add Authentication Tests
```
Understand
    ↓
Plan
    ↓
Implement tests
    ↓
Run tests
    ↓
Review
    ↓
Commit
```

---

# AI Coding Tool Rule

When using Cursor, do not give a broad instruction such as:

> "Build my entire CPRMP application."

Instead, provide **one specific task**.

Example:

> Read the project documentation first. Implement only TASK-001. Do not work on TASK-002 or any later task.

After TASK-001 is completed:

> Review the result, run the relevant tests, fix issues if necessary, and wait for the next task.

---

# Task Boundary Rule

If the current task reveals work that belongs to another task:
```
Current Task
     ↓
Discover Additional Work
     ↓
Do NOT silently implement it
     ↓
Record/identify it
     ↓
Continue Current Task
     ↓
Next Task
```

Do not expand the current task simply because an additional feature would be convenient to implement at the same time.

---

# Definition of Task Completion

A task is considered complete only when:
```
Understand
    ✓
Plan
    ✓
Implement
    ✓
Test
    ✓
Review
    ✓
Commit
    ✓
```

Only then should the project move to the next task.

---

# Golden Rule

> **One task. One focused implementation. Test it. Review it. Commit it. Then move to the next task.                                                                                                                                                                 &#x20;**&#x67;ive me a .md file not any changes in this