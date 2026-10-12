# AI-Generated Code Review

Never assume AI-generated code is correct simply because:

- It compiles.
- The application starts.
- The page appears in the browser.
- A single test passes.

> **"It compiled, so it's correct" is not an acceptable review standard.**

All AI-generated or AI-assisted code must be reviewed against the project's source-of-truth documentation.

---

# 1. Review Before Modification

After AI-generated code is implemented, perform a review **before making further modifications**.

The first review must be read-only.

Do not immediately ask the AI to:

> "Fix everything."

Instead:

```text id="b6tv3h"
Review
  ↓
Identify Issues
  ↓
Report All Issues
  ↓
Prioritize Issues
  ↓
Fix One Issue
  ↓
Test
  ↓
Review Again
  ↓
Next Issue
```

---

# 2. Required Review Documents

The implementation must be reviewed against:

```text id="o1m9ms"
PRD.md
ARCHITECTURE.md
DESIGN.md
RULES.md
TEST_PLAN.md
SECURITY.md
```

Where project-state information is relevant, also consult:

```text id="1p7t3a"
TASKS.md
MEMORY.md
DECISIONS.md
```

These documents have different purposes:

```text id="1d2c4e"
PRD.md
    ↓
What the product should do

ARCHITECTURE.md
    ↓
How the system should be structured

DESIGN.md
    ↓
How the interface should look and behave

RULES.md
    ↓
How development should be performed

TEST_PLAN.md
    ↓
How functionality should be verified

SECURITY.md
    ↓
How the system should be protected
```

---

# 3. Review Checklist

Every meaningful AI-generated implementation should be reviewed for the following areas.

---

## 3.1 Correctness

Check:

- Does the implementation satisfy the task?
- Does it satisfy the acceptance criteria?
- Does the feature behave correctly?
- Are valid inputs handled correctly?
- Are invalid inputs handled correctly?
- Are edge cases handled?
- Are API responses handled correctly?
- Is data persisted correctly where required?
- Does the UI reflect the actual backend state?

Do not assume correctness because the application runs.

---

## 3.2 Architecture

Check:

- Does the implementation follow `ARCHITECTURE.md`?
- Is frontend logic separated from backend logic?
- Is business logic in the correct backend layer?
- Are database operations handled through the appropriate layer?
- Are API calls organized according to the existing structure?
- Are existing services/components reused?
- Has a duplicate service or database layer been created?
- Has unnecessary architecture been introduced?
- Are responsibilities placed in the correct module?

Do not accept architectural shortcuts simply because they are faster to implement.

---

## 3.3 Security

Check against `SECURITY.md`.

Verify:

- Authentication
- Authorization
- Resource ownership
- Input validation
- Password handling
- JWT handling
- Database access
- API security
- File-upload security
- Secret management
- Error exposure
- Sensitive data exposure

Ask:

> Can a malicious or unauthorized user bypass this feature by directly calling the API?

Frontend restrictions alone are not sufficient.

---

## 3.4 Error Handling

Check:

- Are validation errors handled?
- Are API failures handled?
- Are database errors handled safely?
- Are loading failures handled?
- Are empty states handled?
- Are unexpected errors handled?
- Does the UI show useful messages?
- Are internal errors hidden from users?
- Are stack traces or sensitive implementation details exposed?

The application should fail safely and predictably.

---

## 3.5 Accessibility

Check:

- Are form fields properly labeled?
- Can important controls be used with keyboard navigation?
- Are buttons distinguishable from ordinary text?
- Are error messages understandable?
- Are interactive elements accessible?
- Is sufficient visual contrast maintained according to the project's design requirements?
- Are loading and error states understandable?
- Are images given appropriate alternative text where required?
- Are focus states preserved?

Accessibility should be reviewed as part of implementation, not added only at the end.

---

## 3.6 Responsive Design

Check the project's required viewport sizes:

```text id="b2v2i9"
375px
768px
1440px
```

Verify:

- Navigation
- Forms
- Buttons
- Cards
- Tables
- Dashboard layouts
- Error messages
- Loading states
- Empty states
- Placement-drive pages
- Relevant role-specific interfaces

The UI must remain usable rather than merely fitting on the screen.

---

## 3.7 Performance

Check for:

- Unnecessary API requests
- Duplicate API calls
- Unnecessary database queries
- Excessive component re-rendering
- Large unnecessary client-side data loads
- Unoptimized file handling
- Blocking operations
- Unnecessary dependencies
- Repeated expensive calculations

Do not optimize prematurely, but identify obvious performance problems introduced by the implementation.

---

## 3.8 Code Duplication

Check for:

- Duplicate components
- Duplicate validation logic
- Duplicate API calls
- Duplicate business rules
- Duplicate database queries
- Repeated constants
- Repeated error-handling code
- Multiple implementations of the same functionality

Prefer existing reusable utilities/components/services where appropriate.

Do not create abstractions merely to reduce a few lines of code.

---

# 4. Review Scope

Review the implementation as a whole, but pay particular attention to:

```text id="q38m1v"
Changed Files
      ↓
Affected Dependencies
      ↓
Related APIs
      ↓
Related Database Operations
      ↓
Related User Flow
```

Do not modify unrelated parts of the application merely because they could be improved.

---

# 5. Read-Only Review Prompt

Use this prompt with Cursor after an implementation:

```text id="m4v4j6"
Review the current implementation.

Do NOT modify any files yet.

First read and review the implementation against:

PRD.md
ARCHITECTURE.md
DESIGN.md
RULES.md
TEST_PLAN.md
SECURITY.md

Also consider TASKS.md, MEMORY.md, and DECISIONS.md where relevant.

Check:

1. Correctness
2. Architecture
3. Security
4. Error handling
5. Accessibility
6. Responsive design
7. Performance
8. Code duplication
9. Validation
10. Authentication and authorization
11. Resource ownership
12. Testing coverage
13. Acceptance criteria

Do not fix anything yet.

Report ALL issues you find first.

For each issue provide:

- Issue ID
- Severity
- File
- Location
- Problem
- Why it is a problem
- Relevant project rule/document
- Recommended fix

Do not modify any files until the complete review report has been provided.
```

---

# 6. Issue Severity

Classify issues consistently.

| Severity | Meaning |
|---|---|
| Critical | Serious security, data-loss, or system-breaking issue |
| High | Major correctness, authorization, or architectural problem |
| Medium | Significant quality, UX, validation, or maintainability issue |
| Low | Minor improvement or non-critical issue |

Example:

```text id="6p1zjp"
ISSUE-001
Severity: High
Category: Security
File: backend/src/routes/applications.js

Problem:
The endpoint does not verify that the requester owns the application
or has permission to access it.

Why:
Another authenticated user may access another student's application.

Reference:
SECURITY.md — Resource Ownership

Recommended Fix:
Add server-side authorization/resource ownership validation.
```

---

# 7. Do Not Fix Everything at Once

After the review report is complete:

```text id="k2ezg2"
Issue List
    ↓
Select Highest-Priority Issue
    ↓
Understand
    ↓
Plan Fix
    ↓
Implement Fix
    ↓
Test
    ↓
Review
    ↓
Commit
```

Then move to the next issue.

Do not make a large collection of unrelated fixes in one change.

---

# 8. Fix-One-Issue-at-a-Time Rule

For each issue:

### Step 1 — Understand

Understand why the issue exists.

### Step 2 — Plan

Explain the smallest appropriate fix.

### Step 3 — Implement

Modify only the required files.

### Step 4 — Test

Run tests relevant to the fix.

### Step 5 — Review

Confirm that:

- The issue is actually fixed.
- No new issue was introduced.
- Existing behavior still works.

### Step 6 — Commit

Create a focused commit when appropriate.

---

# 9. Example

Suppose the review identifies:

```text id="v0d0fc"
ISSUE-001 — Missing input validation
ISSUE-002 — Unauthorized resource access
ISSUE-003 — Mobile layout problem
ISSUE-004 — Duplicate API utility
```

Do not ask:

> Fix all four issues.

Instead:

```text id="m0u1td"
Fix ISSUE-001 only.

Do not modify ISSUE-002, ISSUE-003, or ISSUE-004 yet.
```

Then:

```text id="70uyz0"
Test ISSUE-001
     ↓
Review ISSUE-001
     ↓
Commit
```

Then:

```text id="c3qj1x"
Fix ISSUE-002 only.
```

Continue until the review issues are resolved.

---

# 10. Review After Fixes

After fixing an issue, perform a focused re-review.

Then, after all issues are addressed, perform a final review:

```text id="5euw8g"
Initial Review
      ↓
Issue Report
      ↓
Fix ISSUE-001
      ↓
Test
      ↓
Fix ISSUE-002
      ↓
Test
      ↓
...
      ↓
Final Review
      ↓
Full Test Suite
      ↓
Build
      ↓
Commit
```

The final review must confirm that the implementation still follows:

- PRD
- Architecture
- Design
- Rules
- Test Plan
- Security requirements

---

# 11. AI Must Not Self-Approve

The AI must not use statements such as:

> "The code looks good."

without performing an actual review.

Likewise:

> "All tests pass, therefore the architecture is correct."

is not sufficient.

Testing and code review are different activities.

```text id="5phzcy"
Tests
  ↓
Does it behave correctly?

Review
  ↓
Was it implemented correctly?
```

Both are required.

---

# 12. Final Review Checklist

Before marking a feature complete:

### Correctness

- [ ] Acceptance criteria satisfied.
- [ ] Happy path works.
- [ ] Invalid input handled.
- [ ] Edge cases considered.

### Architecture

- [ ] Existing architecture followed.
- [ ] Correct layer used.
- [ ] No duplicate architecture introduced.
- [ ] No unnecessary dependencies.

### Security

- [ ] Authentication checked.
- [ ] Authorization checked.
- [ ] Resource ownership checked.
- [ ] Input validated.
- [ ] Secrets protected.
- [ ] Sensitive data protected.

### UX

- [ ] Error states work.
- [ ] Loading states work.
- [ ] Empty states work.
- [ ] Accessibility reviewed.
- [ ] Responsive behavior reviewed.

### Quality

- [ ] No obvious performance problems.
- [ ] No unnecessary duplication.
- [ ] Relevant tests pass.
- [ ] Build passes where configured.
- [ ] No unrelated files were changed.

---

# Golden Rule

> **Never trust AI-generated code simply because it compiles. Review it against the project's requirements, architecture, design, testing, and security rules before accepting it.**

The correct workflow is:

```text id="4d0qjo"
AI Generates Code
       ↓
READ-ONLY REVIEW
       ↓
REPORT ALL ISSUES
       ↓
FIX ONE ISSUE
       ↓
TEST
       ↓
REVIEW
       ↓
COMMIT
       ↓
NEXT ISSUE
```

**Review first. Report first. Fix second.**