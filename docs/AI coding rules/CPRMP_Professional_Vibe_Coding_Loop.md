# Professional Vibe Coding Loop

## Purpose

Every CPRMP feature must be developed using a controlled, repeatable workflow.

AI coding tools such as Cursor should not be allowed to move directly from a feature request to implementation without first understanding the existing project.

The standard development loop is:
```
1. READ
   ↓
2. UNDERSTAND
   ↓
3. PLAN
   ↓
4. IMPLEMENT
   ↓
5. TEST
   ↓
6. REVIEW
   ↓
7. FIX
   ↓
8. COMMIT
   ↓
9. UPDATE DOCUMENTATION
   ↓
Next Feature
```

**Golden Rule:**

> Never skip the development loop just because a feature appears simple.

---

# 1. READ

Before changing code, read the relevant project context.

At minimum, inspect:
```
PRD.md
ARCHITECTURE.md
DESIGN.md
RULES.md
TASKS.md
MEMORY.md
```

Read additional documents when relevant:
```
DECISIONS.md
TEST_PLAN.md
SECURITY.md
API.md
DATABASE.md
```

Also inspect the existing implementation related to the feature.

Do not assume that previous AI output represents the current codebase.

---

# 2. UNDERSTAND

Before implementation, clearly understand:

- What feature is being built?
- Why is it required?
- Which users will use it?
- Which existing modules are affected?
- Which files are likely to change?
- What APIs are required?
- What database changes are required?
- What security rules apply?
- What acceptance criteria must be satisfied?
- What must not be changed?

For CPRMP, also identify the affected role:
```
Student
Admin / Placement Officer
Recruiter
```

The AI should ask for clarification only when essential information is genuinely missing.

---

# 3. PLAN

Create a small implementation plan before writing code.

The plan should identify:
```
Files to create
Files to modify
API changes
Database changes
UI changes
Tests required
Potential risks
```

Example:
```
Feature: Student Profile

Plan:
1. Create profile page
2. Add profile API
3. Add backend validation
4. Connect MySQL model/service
5. Add authentication/authorization
6. Add tests
7. Test complete user flow
```

Do not create an unnecessarily large plan for a small task.

---

# 4. IMPLEMENT

Implement only the requested feature.

Follow:
```
PRD
ARCHITECTURE
DESIGN
RULES
DECISIONS
```

Important rules:

- Do not implement unrelated features.
- Do not perform unnecessary refactoring.
- Do not introduce unnecessary dependencies.
- Do not change architecture without justification.
- Do not modify unrelated files.
- Keep the implementation as small as reasonably possible.
- Keep business logic in the appropriate backend/service layer.
- Never place secrets in source code.

For AI-generated code, review the generated changes before accepting them.

---

# 5. TEST

Never consider the feature complete immediately after implementation.

Test at the appropriate levels:
```
Unit Test
    ↓
Integration Test
    ↓
E2E Test
```

Not every feature requires every test level, but the appropriate tests must be performed.

Also manually verify:

- Happy path
- Invalid input
- Error state
- Loading state
- Empty state
- Authentication
- Authorization
- Responsive behavior where applicable

Run the project's actual configured commands.

Examples:
```
npm run lint
npm test
npm run build
```

Do not invent commands that are not configured in the project.

---

# 6. REVIEW

After testing, review the implementation against the project requirements.

Check:

### Correctness

- Does the feature satisfy the acceptance criteria?
- Does it work as intended?

### Architecture

- Does it follow `ARCHITECTURE.md`?
- Is business logic in the correct layer?

### Design

- Does it follow `DESIGN.md`?
- Is the UI consistent?

### Security

- Is authentication enforced?
- Is authorization enforced?
- Is input validated?
- Are secrets protected?
- Is resource ownership enforced?

### Code Quality

- Is the implementation unnecessarily complex?
- Is there duplicated code?
- Are there unused files/imports/dependencies?
- Are error cases handled?

### Git

Inspect:
```
git status
git diff
```

Make sure the changes are limited to the intended task.

---

# 7. FIX

If testing or review finds problems:
```
Issue
 ↓
Identify Root Cause
 ↓
Smallest Safe Fix
 ↓
Test Again
 ↓
Review Again
```

Do not immediately perform a large refactor.

For debugging, provide:
```
ERROR:
EXPECTED BEHAVIOR:
ACTUAL BEHAVIOR:
STEPS TO REPRODUCE:
CONSTRAINTS:
```

Then determine:

1. What is failing?
2. Why is it failing?
3. Which file/layer is responsible?
4. What is the smallest safe fix?
5. How should the fix be tested?

After fixing, return to **TEST**.

---

# 8. COMMIT

Only commit after the feature is working and reviewed.

First:
```
git status
```

Then review:
```
git diff
```

Stage:
```
git add .
```

Commit with a meaningful message:
```
git commit -m "feat: add student profile"
```

Then push:
```
git push
```

Examples:
```
git commit -m "feat: add student registration"
git commit -m "feat: add resume upload"
git commit -m "fix: prevent duplicate applications"
git commit -m "test: add eligibility service tests"
```

Do not commit untested AI-generated code simply because the AI says the task is complete.

---

# 9. UPDATE DOCUMENTATION

After a feature is completed, update documentation that has actually changed.

Check:
```
TASKS.md
MEMORY.md
DECISIONS.md
README.md
ARCHITECTURE.md
```

Also review when applicable:
```
PRD.md
DESIGN.md
TEST_PLAN.md
SECURITY.md
API.md
DATABASE.md
```

Examples:

### TASKS.md

Mark the completed task:
```
TASK-XXX
Status: Completed
```

### MEMORY.md

Update:
```
Current Phase
Current Task
Completed Work
Known Issues
Next Step
```

### ARCHITECTURE.md

Update if the feature changed system architecture.

### DECISIONS.md

Update if a significant technical decision was made.

### README.md

Update if installation, features, commands, or usage changed.

---

# 10. Move to the Next Feature

Only after completing all nine stages should development continue.
```
READ
 ↓
UNDERSTAND
 ↓
PLAN
 ↓
IMPLEMENT
 ↓
TEST
 ↓
REVIEW
 ↓
FIX
 ↓
COMMIT
 ↓
UPDATE DOCUMENTATION
 ↓
NEXT FEATURE
```

The next feature starts again from **READ**.

Never assume that the previous feature's context is sufficient for the next feature.

---

# 11. Example — CPRMP Student Registration

For example, when implementing Student Registration:
```
READ
 ↓
Read PRD, architecture, design, rules,
tasks, memory and authentication requirements
 ↓
UNDERSTAND
 ↓
Understand registration fields,
validation, role and database requirements
 ↓
PLAN
 ↓
Plan UI + API + validation + database + tests
 ↓
IMPLEMENT
 ↓
Build registration flow
 ↓
TEST
 ↓
Test valid/invalid registration,
duplicate email, validation and API
 ↓
REVIEW
 ↓
Review security, architecture, UI and code
 ↓
FIX
 ↓
Fix discovered issues
 ↓
TEST AGAIN
 ↓
COMMIT
 ↓
git commit -m "feat: add student registration"
 ↓
UPDATE DOCUMENTATION
 ↓
Update TASKS.md and MEMORY.md
 ↓
NEXT FEATURE
```

---

# 12. Vertical Slice Principle

Whenever practical, build features as complete vertical slices instead of implementing the entire frontend first and backend later.

Example:
```
Student Registration
        ↓
React UI
        ↓
API
        ↓
Express
        ↓
Validation
        ↓
Service
        ↓
MySQL
        ↓
Response
        ↓
React UI
        ↓
Test
```

This makes it easier to verify that the complete user flow works.

---

# 13. AI-Specific Rule

AI coding tools must not interpret:

> "Implement this feature"

as permission to modify the entire project.

The AI should:
```
Read current context
      ↓
Understand task
      ↓
Plan limited changes
      ↓
Implement only requested scope
      ↓
Test
      ↓
Report results
```

The AI must not automatically:

- Start the next task
- Refactor unrelated code
- Change architecture
- Install unnecessary packages
- Modify unrelated modules
- Rewrite working code without reason

---

# 14. Final Feature Completion Criteria

A feature is considered complete only when:
```
[ ] Read relevant documentation
[ ] Understood requirements
[ ] Created implementation plan
[ ] Implemented requested scope
[ ] Tested feature
[ ] Reviewed implementation
[ ] Fixed discovered issues
[ ] Re-tested after fixes
[ ] Reviewed Git changes
[ ] Committed working code
[ ] Pushed changes
[ ] Updated relevant documentation
```

If one of these required steps has not been completed, the feature should not be treated as fully complete.

---

# 15. Final Rule

> **READ → UNDERSTAND → PLAN → IMPLEMENT → TEST → REVIEW → FIX → COMMIT → UPDATE DOCUMENTATION → NEXT FEATURE**

This is the standard development loop for CPRMP.

**Do not skip steps merely because AI generated the code quickly.