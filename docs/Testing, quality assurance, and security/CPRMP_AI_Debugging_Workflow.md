# AI Debugging Workflow

When something breaks, do not give the AI a vague instruction such as:

> "Fix this."

Instead, provide structured debugging information.

The AI must first identify the **root cause** before modifying code.

---

# 1. Required Debugging Information

When reporting a problem, provide:
```
ERROR

<paste the exact error message>


EXPECTED BEHAVIOR

<what should happen>


ACTUAL BEHAVIOR

<what is actually happening>


STEPS TO REPRODUCE

1. <step>
2. <step>
3. <step>


CONSTRAINTS

- <important restriction>
- <important restriction>
```

Do not paraphrase an error when the exact error message is available.

Include:

- Terminal errors
- Browser console errors
- API response errors
- HTTP status codes
- Relevant screenshots where useful
- Steps that consistently reproduce the problem

---

# 2. Example

Instead of:
```
Fix the dashboard error.
```

Use:
```
ERROR

500 Internal Server Error


EXPECTED BEHAVIOR

The user should be redirected to the dashboard.


ACTUAL BEHAVIOR

The page shows a 500 error.


STEPS TO REPRODUCE

1. Login
2. Click Dashboard
3. Error appears


CONSTRAINTS

- Do not change the database schema.
- Do not refactor unrelated code.
```

---

# 3. Root-Cause Investigation

Before modifying code, ask the AI:
```
Do not modify any code yet.

Find the root cause of this problem.

Explain:

1. What is failing?
2. Why is it failing?
3. Which file is responsible?
4. What is the smallest fix?
5. How will we test the fix?

Inspect the relevant code and configuration before reaching a conclusion.

Do not guess the root cause.
```

The AI must investigate the actual implementation rather than immediately changing code.

---

# 4. Root Cause Report

The AI should provide a report in this format:
```
ROOT CAUSE ANALYSIS

1. What is failing?
<component/API/function/flow>

2. Why is it failing?
<technical explanation>

3. Responsible File(s)
<file path>

4. Smallest Fix
<minimal change required>

5. Testing Plan
<how the fix will be verified>

6. Related Risks
<any relevant side effects>
```

---

# 5. Do Not Modify Code During Diagnosis

During the root-cause phase:

- Do not modify source code.
- Do not modify the database schema.
- Do not install dependencies.
- Do not refactor unrelated code.
- Do not change configuration unless specifically required for diagnosis.
- Do not delete tests.
- Do not suppress errors.
- Do not make speculative fixes.

The goal is to understand the problem first.

---

# 6. After Root Cause Is Confirmed

Once the root cause has been identified, give the implementation instruction:
```
Implement the smallest fix for the identified root cause.

Constraints:

- Do not refactor unrelated code.
- Do not change the database schema unless explicitly approved.
- Do not modify unrelated files.
- Preserve existing behavior.
- Follow PRD.md.
- Follow ARCHITECTURE.md.
- Follow RULES.md.
- Follow SECURITY.md.

After implementation:

1. Run the relevant tests.
2. Verify the original reproduction steps.
3. Check for regression.
4. Report the files changed.
5. Report the tests executed.
6. Report any remaining issues.
```

---

# 7. Smallest Fix Principle

Prefer:
```
Root Cause
    ↓
Smallest Correct Fix
    ↓
Relevant Test
    ↓
Regression Check
```

Avoid:
```
Bug
 ↓
Rewrite Entire Module
 ↓
Refactor Everything
 ↓
Change Database
 ↓
Introduce New Dependencies
```

A bug fix should not become an unrelated refactoring project.

---

# 8. Debugging Workflow

The standard CPRMP debugging workflow is:
```
Problem
   ↓
Collect Exact Error
   ↓
Expected Behavior
   ↓
Actual Behavior
   ↓
Reproduction Steps
   ↓
Constraints
   ↓
Root-Cause Investigation
   ↓
Explain Root Cause
   ↓
Propose Smallest Fix
   ↓
Approval / Implementation
   ↓
Implement
   ↓
Run Relevant Tests
   ↓
Reproduce Original Scenario
   ↓
Regression Check
   ↓
Review
   ↓
Commit
```

---

# 9. Debugging Across Layers

Because CPRMP uses a layered architecture, investigate the complete flow.

For example:
```
Browser
   ↓
React Component
   ↓
API Service
   ↓
Express Route
   ↓
Controller
   ↓
Service
   ↓
Database
```

If a dashboard displays a `500` error, do not automatically assume the React component is responsible.

Determine which layer actually fails.

---

# 10. Authentication Debugging

For authentication-related failures, inspect:
```
Login UI
   ↓
API Request
   ↓
Backend Route
   ↓
Authentication Logic
   ↓
Password Verification
   ↓
JWT Generation/Validation
   ↓
Protected Route
   ↓
Dashboard
```

Check:

- Authentication state
- Request payload
- API response
- HTTP status
- JWT validity
- Middleware
- Authorization
- Backend errors

Do not disable authentication merely to make the page work.

---

# 11. Database Debugging

When a database-related error occurs:

- Identify the failing query/operation.
- Identify the responsible backend layer.
- Check the input values.
- Check the database relationship.
- Check constraints.
- Check whether the required record exists.
- Check the returned database error.

Do not change the database schema as a first response.

If the issue can be fixed in application logic, prefer the application-level fix.

---

# 12. API Debugging

For API failures, inspect:
```
Request
 ↓
Authentication
 ↓
Authorization
 ↓
Validation
 ↓
Controller
 ↓
Service
 ↓
Database
 ↓
Response
```

Record:

- HTTP method
- Endpoint
- Request body
- Parameters
- Authentication state
- HTTP status
- Response body
- Server-side error

Do not expose secrets or sensitive information while sharing debugging information.

---

# 13. Frontend Debugging

For UI problems, inspect:

- Browser console.
- Network request.
- API response.
- Component state.
- Props.
- Routing.
- Loading state.
- Error state.
- Rendering conditions.
- Responsive behavior.

Do not immediately rewrite the component.

Find the actual failing step first.

---

# 14. AI Debugging Rules

When debugging with Cursor:

### First prompt
```
Do not modify code yet.

Find the root cause.
```

### Second step

Review the diagnosis.

### Third step

Ask:
```
Implement the smallest fix.
Do not refactor unrelated code.
```

### Fourth step

Ask:
```
Run the relevant tests and verify the original reproduction steps.
```

This prevents AI from making large speculative changes.

---

# 15. Debugging Report After Fix

After implementing the fix, the AI must report:
```
DEBUGGING REPORT

1. Original Problem
<summary>

2. Root Cause
<summary>

3. Files Changed
- <file>

4. Fix Applied
<summary>

5. Tests Executed
- <test>

6. Original Reproduction Steps
PASS / FAIL

7. Regression Check
PASS / FAIL

8. Remaining Issues
- None
OR
- <issue>
```

The AI must not claim the original issue is fixed unless the original reproduction scenario has been tested again.

---

# 16. Golden Rule

> **Do not tell the AI to "fix this." Tell it what happened, what should have happened, how to reproduce it, and what constraints must be respected.**

The correct debugging process is:
```
ERROR
  ↓
EXPECTED
  ↓
ACTUAL
  ↓
REPRODUCE
  ↓
CONSTRAINTS
  ↓
ROOT CAUSE
  ↓
SMALLEST FIX
  ↓
TEST
  ↓
VERIFY
  ↓
COMMIT
```

**Diagnose first. Modify second.**
