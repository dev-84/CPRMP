# Git Version Control Workflow

## Purpose

Git must be used throughout the entire CPRMP development lifecycle.

Because AI coding tools such as Cursor can generate incorrect or unexpected changes, Git provides a safe history of working code and allows the team to review, revert, and recover changes.

**Golden Rule:**

> Never continue development for a long time without committing a known-working state.

---

## 1. Git After Every Working Feature

After completing and testing a feature, always check the repository status:
```
git status
```

Review which files were created, modified, or deleted.

Then stage the intended changes:
```
git add .
```

Create a meaningful commit:
```
git commit -m "feat: add note creation"
```

Then push the commit:
```
git push
```

For CPRMP, commit messages should describe the actual change.

### Examples
```
git commit -m "feat: add student registration"
git commit -m "feat: add student profile"
git commit -m "feat: add resume upload"
git commit -m "feat: add placement drive creation"
git commit -m "feat: add eligibility checking"
git commit -m "feat: add student application"
git commit -m "feat: add recruiter applicant management"
git commit -m "feat: add AI resume job matching"
```

For bug fixes:
```
git commit -m "fix: prevent duplicate applications"
git commit -m "fix: validate resume file type"
git commit -m "fix: protect recruiter routes"
```

For documentation:
```
git commit -m "docs: update project architecture"
git commit -m "docs: add AI debugging workflow"
```

---

## 2. Do Not Commit Untested AI-Generated Code

AI-generated code must not automatically be considered working code.

Follow this sequence:
```
AI generates code
       ↓
Review changes
       ↓
Run application
       ↓
Test feature
       ↓
Run relevant tests
       ↓
Review git diff
       ↓
git status
       ↓
Commit
       ↓
Push
```

Do not create a commit simply because Cursor reports that the implementation is complete.

---

## 3. Always Review `git diff`

Before committing important changes, inspect what actually changed:
```
git diff
```

For staged changes:
```
git diff --cached
```

Check for:

- Unexpected files
- Unrelated changes
- Debugging code
- Hardcoded credentials
- API keys
- Passwords
- Temporary files
- Generated files
- Unnecessary refactoring
- Changes outside the requested task

If unrelated changes are found, remove or separate them before committing.

---

## 4. Commit Small, Logical Changes

Avoid one huge commit containing many unrelated features.

### Bad
```
git commit -m "update everything"
```

### Good
```
git commit -m "feat: add student registration"
git commit -m "feat: add registration validation"
git commit -m "test: add registration API tests"
```

Small commits make debugging and rollback easier.

---

## 5. Branch Strategy

For larger features or changes that may affect stable code, use a separate branch.

Recommended CPRMP structure:
```
main
│
├── feature/auth
├── feature/student-profile
├── feature/resume
├── feature/company
├── feature/placement-drive
├── feature/eligibility
├── feature/application
├── feature/recruiter-applicants
├── feature/ai-matching
│
├── fix/mobile-navbar
├── fix/duplicate-application
└── fix/resume-upload
```

The `main` branch should contain stable, tested code.

---

## 6. Creating a Feature Branch

Before starting a larger feature:
```
git checkout main
git pull
git checkout -b feature/student-profile
```

Work on the feature:
```
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

Then push the branch:
```
git push -u origin feature/student-profile
```

---

## 7. Do Not Work Directly on `main` for Risky Features

For small documentation or configuration changes, working directly on `main` may be acceptable during the early project stage.

For larger features, risky changes, or major AI-generated modifications, use a feature branch.

Examples:
```
Authentication
Student Profile
Resume Management
Eligibility Engine
Application System
AI Matching
Database Schema Changes
Major UI Redesign
```

These should preferably be developed in separate branches.

---

## 8. Bug-Fix Branches

When fixing an existing problem, create a `fix/` branch when the change is significant:
```
git checkout main
git pull
git checkout -b fix/duplicate-application
```

After fixing and testing:
```
git add .
git commit -m "fix: prevent duplicate applications"
git push -u origin fix/duplicate-application
```

---

## 9. AI Mistake Recovery

If Cursor/AI makes unexpected changes:

**Do not immediately continue asking AI to fix everything.**

First inspect:
```
git status
git diff
```

If the changes are clearly unwanted and have not been committed, restore carefully.

For a complete working tree rollback:
```
git restore .
```

**Warning:** This removes uncommitted changes. Only use it when you are certain those changes are not needed.

If a bad change has already been committed, Git history can be used to identify and revert it.

Before performing destructive Git commands, understand exactly what will be lost.

---

## 10. Never Commit Secrets

Never commit:
```
.env
API keys
JWT secrets
Database passwords
Private credentials
Cloud credentials
Personal access tokens
```

The repository should contain:
```
.env.example
```

but not the real `.env`.

Example:
```
.env              → NEVER commit
.env.example      → SAFE to commit
```

---

## 11. Recommended Commit Convention

Use simple prefixes:

| Prefix      | Purpose                                    |
| ----------- | ------------------------------------------ |
| `feat:`     | New feature                                |
| `fix:`      | Bug fix                                    |
| `docs:`     | Documentation                              |
| `test:`     | Tests                                      |
| `refactor:` | Code restructuring without behavior change |
| `style:`    | Formatting/UI style changes                |
| `chore:`    | Maintenance/configuration                  |

Examples:
```
git commit -m "feat: add student registration"
git commit -m "fix: prevent duplicate applications"
git commit -m "test: add eligibility service tests"
git commit -m "docs: update API documentation"
git commit -m "refactor: simplify application service"
git commit -m "chore: update project dependencies"
```

---

## 12. Git Workflow for Every CPRMP Task

Every development task should follow:
```
1. Check current branch
        ↓
2. Pull latest changes
        ↓
3. Read project documentation
        ↓
4. Implement ONE task
        ↓
5. Test the task
        ↓
6. Review git diff
        ↓
7. Check git status
        ↓
8. Commit
        ↓
9. Push
        ↓
10. Update MEMORY.md / TASKS.md if required
        ↓
11. Start the next task
```

---

## 13. Before Starting a New Task

Run:
```
git status
git pull
```

Confirm that the working tree is clean before starting a new major task.

Expected:
```
nothing to commit, working tree clean
```

This gives the team a known starting point.

---

## 14. Git as a Safety Check for AI Development

Git is not only for storing code.

For CPRMP, Git acts as a safety mechanism when using AI coding tools.
```
Known Working State
        ↓
     Git Commit
        ↓
    AI Changes Code
        ↓
      Testing
        ↓
   Unexpected Result?
      ↙       ↘
    YES        NO
     ↓          ↓
Inspect/        Commit
Revert          Changes
     ↓
Return to
Working State
```

This allows the team to experiment with AI-generated code without permanently damaging the project.

---

## 15. Golden Rules

1. **Use Git throughout development.**
2. **Commit after every tested working feature.**
3. **Keep commits small and meaningful.**
4. **Review `git diff` before important commits.**
5. **Keep `main` stable.**
6. **Use feature branches for larger or risky changes.**
7. **Never commit secrets or `.env`.**
8. **Do not trust AI-generated code without testing it.**
9. **Use Git history to recover from AI mistakes.**
10. **Never start a major task with unknown uncommitted changes.**

### Final Rule

> **If AI changes the code, Git should make the change recoverable.**
