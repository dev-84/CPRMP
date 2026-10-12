# Feature Testing Workflow

Every implemented feature must be tested before it is considered complete.

Do not assume that code working in the browser means the feature is finished.

The required verification flow is:
```
Code
  ↓
Lint
  ↓
Type Check
  ↓
Unit Tests
  ↓
Integration Tests
  ↓
E2E Tests
  ↓
Build
  ↓
Review
  ↓
Commit
```

Not every feature will require every test level, but the applicable checks must be executed.

---

# 1. Code

After implementing the feature:

- Inspect the changed files.
- Confirm the implementation matches the task.
- Confirm no unrelated files were modified.
- Check that the existing architecture is followed.
- Check security requirements.
- Check validation and error handling.

Do not immediately commit after writing the code.

---

# 2. Lint

Run the project's configured lint command.

Typical command:
```
npm run lint
```

Check for:

- Syntax problems
- ESLint errors
- Unused variables
- Incorrect imports
- Code-quality violations
- Project-specific lint rules

If the command does not exist, inspect `package.json` before assuming the correct command.

---

# 3. Type Check

Run the project's configured type-checking command when available.

Typical command:
```
npm run typecheck
```

### Important

CPRMP currently uses **JavaScript**, not TypeScript.

Therefore, `npm run typecheck` may not exist in the initial project configuration.

Do not add TypeScript or create a type-checking system solely because this command was mentioned.

Instead:

1. Check `package.json`.
2. Check the project's configured scripts.
3. Run the available type/static-analysis check if one exists.
4. If no type-check command exists, report:
```
Type check: Not configured for the current JavaScript project.
```

Do not claim that type checking passed when it was not configured or executed.

---

# 4. Unit Tests

Run the project's unit tests.

Typical command:
```
npm test
```

Unit tests should verify small pieces of functionality such as:

- Validation functions
- Utility functions
- Business rules
- Individual components where appropriate
- Eligibility logic
- Data transformation
- AI matching logic where applicable

Example:
```
Input
  ↓
Validation Function
  ↓
Expected Result
```

Test both valid and invalid cases where applicable.

---

# 5. Integration Tests

Integration tests verify that multiple parts of the application work together.

Examples:
```
Frontend
   ↓
API
   ↓
Backend
   ↓
Database
```

or:
```
API
 ↓
Authentication Middleware
 ↓
Authorization
 ↓
Service
 ↓
Database
```

For CPRMP, integration testing should cover relevant flows such as:

- Registration
- Login
- Protected API access
- Student profile updates
- Resume operations
- Placement applications
- Eligibility checking
- Recruiter applicant access
- Shortlisting
- Selection/placement updates

Use the project's configured integration-testing tools.

For backend APIs, **Supertest** may be used where appropriate.

---

# 6. End-to-End Tests

E2E tests verify complete user flows.

Example:
```
Student Signup
      ↓
Student Login
      ↓
Dashboard
      ↓
View Placement Drive
      ↓
Check Eligibility
      ↓
Apply
      ↓
View Application Status
```

E2E testing should verify that the complete flow works from the user's perspective.

Not every small UI-only task requires a complete E2E test.

However, completed vertical slices should eventually have appropriate end-to-end verification.

---

# 7. Build

Run the project's configured production build.

Typical command:
```
npm run build
```

The build must complete successfully before a feature is considered ready for commit when the affected project/package has a build script.

Check for:

- Build errors
- Missing imports
- Invalid configuration
- Broken production compilation
- Missing environment configuration
- Unexpected build warnings

Do not claim the build passed unless it was actually executed.

---

# 8. Exact Commands

The commonly expected commands are:

### Type Check
```
npm run typecheck
```

### Lint
```
npm run lint
```

### Tests
```
npm test
```

### Build
```
npm run build
```

However:

> **The exact commands depend on the project's actual configuration.**

Before running commands, inspect:
```
package.json
```

and determine which scripts actually exist.

Do not invent missing commands.

---

# 9. Frontend and Backend Testing

CPRMP contains separate frontend and backend applications.

Run commands from the appropriate directory.

Example:
```
cprmp/
├── frontend/
│   └── package.json
│
└── backend/
    └── package.json
```

The frontend may have:
```
cd frontend
npm run lint
npm test
npm run build
```

The backend may have:
```
cd backend
npm run lint
npm test
```

The exact commands must be taken from each project's `package.json`.

---

# 10. Test According to Task Size

Testing should match the task.

### Small UI Task

Example:
```
Signup UI
```

At minimum, where configured:
```
Code
 ↓
Lint
 ↓
Relevant Unit/UI Tests
 ↓
Build
```

### Backend API Task

Example:
```
Registration API
```

Test:
```
Code
 ↓
Lint
 ↓
Unit Tests
 ↓
API/Integration Tests
 ↓
Build
```

### Complete Vertical Slice

Example:
```
Signup
 ↓
Registration API
 ↓
Database
 ↓
Login
 ↓
Dashboard
```

Test:
```
Code
 ↓
Lint
 ↓
Unit Tests
 ↓
Integration Tests
 ↓
E2E Tests
 ↓
Build
```

---

# 11. Failure Rule

If an applicable check fails:
```
Test Fails
    ↓
Investigate
    ↓
Fix
    ↓
Run Test Again
    ↓
Pass
```

Do not:

- Ignore the failure.
- Delete the test just to make it pass.
- Disable lint rules without justification.
- Skip security checks.
- Claim the task is complete while critical tests are failing.

---

# 12. Regression Testing

After implementing a feature, verify that existing functionality has not been broken.

At minimum:

- Relevant existing tests still pass.
- Related user flow still works.
- Existing API behavior is preserved where required.
- Existing authorization still works.
- Existing UI remains functional.
- No unrelated feature was changed.

---

# 13. Test Report

After testing, provide a clear report:
```
TEST REPORT

Lint:
PASS / FAIL / NOT CONFIGURED

Type Check:
PASS / FAIL / NOT CONFIGURED

Unit Tests:
PASS / FAIL / NOT CONFIGURED

Integration Tests:
PASS / FAIL / NOT CONFIGURED

E2E Tests:
PASS / FAIL / NOT CONFIGURED

Build:
PASS / FAIL / NOT CONFIGURED

Remaining Issues:
- None
OR
- <issue>
```

Never report a check as `PASS` unless it was actually executed successfully.

---

# 14. Definition of Done

A feature is ready to be committed only when:

- Code is implemented.
- Relevant lint checks pass.
- Type/static checks pass where configured.
- Relevant unit tests pass.
- Relevant integration tests pass.
- Relevant E2E tests pass for completed user flows.
- Build passes where configured.
- Security requirements are satisfied.
- No critical regression exists.
- Code has been reviewed.

Then:
```
Tests Pass
    ↓
Review
    ↓
Git Commit
    ↓
Update MEMORY.md
    ↓
Next Task
```

---

# Golden Rule

> **Every feature must be proven to work before it is considered done.**

Code that has not been appropriately tested is **not finished**.