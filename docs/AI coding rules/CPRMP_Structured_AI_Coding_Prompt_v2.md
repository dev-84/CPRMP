# CPRMP — Structured AI Coding Prompt

Every implementation request given to Cursor must use these six sections:
```
CONTEXT
TASK
FILES
CONSTRAINTS
ACCEPTANCE CRITERIA
TESTING
```

---

## CONTEXT

Explain what the project is and what the AI needs to understand before making changes.
```
CONTEXT

We are building the Campus Placement and Recruitment Management Portal (CPRMP).

This is an MCA Semester-3 group mini project.

Read the following files before making changes:

PRD.md
ARCHITECTURE.md
DESIGN.md
RULES.md
TASKS.md
TEST_PLAN.md
SECURITY.md
MEMORY.md

Current phase:
<PHASE>

Current task:
<TASK-ID> — <TASK NAME>

Understand the existing implementation before making any changes.
```

---

## TASK

Describe **one specific task only**.
```
TASK

Implement:

<TASK DESCRIPTION>

Only implement this task.

Do not implement future tasks or unrelated functionality.
```

---

## FILES

Identify the relevant files and directories.
```
FILES

Relevant files/directories:

<path>
<path>
<path>

First inspect the existing files.

Create new files only when required.
Do not create duplicate components, services, or database layers.
```

---

## CONSTRAINTS

List the rules that must be followed.
```
CONSTRAINTS

- Follow PRD.md.
- Follow ARCHITECTURE.md.
- Follow DESIGN.md.
- Follow RULES.md.
- Follow TEST_PLAN.md.
- Follow SECURITY.md.
- Reuse existing components and utilities.
- Follow the existing architecture.
- Do not create a second database layer.
- Do not create duplicate services.
- Do not modify unrelated files.
- Do not introduce unnecessary dependencies.
- Validate all user input.
- Enforce authentication and authorization where applicable.
- Protect resource ownership.
- Never expose secrets.
- Do not hardcode API keys or credentials.
- Follow the existing responsive design.
- Do not implement future tasks.
```

---

## ACCEPTANCE CRITERIA

Define exactly what must be true for the task to be considered complete.
```
ACCEPTANCE CRITERIA

- <criterion 1>
- <criterion 2>
- <criterion 3>
- <criterion 4>
- <criterion 5>

The task is complete only when all applicable criteria are satisfied.
```

Acceptance criteria should be **specific and testable**, not vague statements such as:
```
❌ "Make the feature work."
```

Prefer:
```
✓ User can submit valid data.
✓ Required fields are validated.
✓ Invalid input displays an error.
✓ Data is saved correctly.
✓ Updated data appears in the UI.
```

---

## TESTING

Define how the implementation must be verified.
```
TESTING

- Add appropriate tests for the feature.
- Test the happy path.
- Test invalid input.
- Test validation.
- Test authorization where applicable.
- Test resource ownership where applicable.
- Test relevant edge cases.
- Test responsive behavior where applicable.
- Run relevant automated tests.
- Run linting if configured.
- Run type checking if configured.
- Run the relevant build/validation checks.

Do not claim that a test passed unless it was actually executed.
```

---

# Final Implementation Report

After implementation, Cursor must report:
```
IMPLEMENTATION REPORT

1. Files Changed
- <file>
- <file>

2. What Was Implemented
- <summary>

3. Tests Executed
- <test/command>
- <test/command>

4. Test Results
- PASS / FAIL
- <summary>

5. Remaining Issues
- None
OR
- <issue>

6. Security Considerations
- <relevant security information>

7. Next Task
- <next task>

Do not implement the next task automatically.
```

---

# Complete Copy-Paste Template
```
CONTEXT

We are building the Campus Placement and Recruitment Management Portal (CPRMP).

This is an MCA Semester-3 group mini project.

Read the following files before making changes:

PRD.md
ARCHITECTURE.md
DESIGN.md
RULES.md
TASKS.md
TEST_PLAN.md
SECURITY.md
MEMORY.md

Current phase:
<PHASE>

Current task:
<TASK-ID> — <TASK NAME>

Understand the existing implementation before making any changes.


TASK

Implement:

<TASK DESCRIPTION>

Only implement this task.

Do not implement future tasks or unrelated functionality.


FILES

Relevant files/directories:

<PATH 1>
<PATH 2>
<PATH 3>

First inspect the existing files.

Create new files only when required.

Do not create duplicate components, services, or database layers.


CONSTRAINTS

- Follow PRD.md.
- Follow ARCHITECTURE.md.
- Follow DESIGN.md.
- Follow RULES.md.
- Follow TEST_PLAN.md.
- Follow SECURITY.md.
- Reuse existing components and utilities.
- Follow the existing architecture.
- Do not create a second database layer.
- Do not create duplicate services.
- Do not modify unrelated files.
- Do not introduce unnecessary dependencies.
- Validate all user input.
- Enforce authentication and authorization where applicable.
- Protect resource ownership.
- Never expose secrets.
- Do not hardcode API keys or credentials.
- Follow responsive design requirements.
- Do not implement future tasks.


ACCEPTANCE CRITERIA

- <criterion 1>
- <criterion 2>
- <criterion 3>
- <criterion 4>
- <criterion 5>

The task is complete only when all applicable criteria are satisfied.


TESTING

- Add appropriate tests.
- Test the happy path.
- Test invalid input.
- Test validation.
- Test authorization where applicable.
- Test resource ownership where applicable.
- Test relevant edge cases.
- Test responsive behavior where applicable.
- Run relevant automated tests.
- Run linting if configured.
- Run type checking if configured.
- Run relevant build/validation checks.

Do not claim tests passed unless they were actually executed.


FINAL REPORT

After implementation, report:

1. Files changed
2. What was implemented
3. Tests executed
4. Test results
5. Remaining issues
6. Security considerations
7. Next task

Do not implement the next task automatically.
```

### CPRMP rule

The workflow is now:
```
TASKS.md
   ↓
Choose ONE task
   ↓
Structured Prompt
   ↓
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
Update MEMORY.md
   ↓
Next Task
```

This keeps your **vertical-slice approach**, `TASKS.md`, `TEST_PLAN.md`, `SECURITY.md`, and Cursor workflow consistent with each other.                                                                                                                    give me a .md file not any changes in this