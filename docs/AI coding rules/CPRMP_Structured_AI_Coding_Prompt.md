# CPRMP — Structured AI Coding Prompt

Use this structure for every implementation request given to Cursor or another AI coding tool.
```
CONTEXT
TASK
FILES
CONSTRAINTS
ACCEPTANCE CRITERIA
TESTING
```

---

# 1. CONTEXT

Explain the project and the relevant feature before asking the AI to implement anything.

Include:

- Project name
- Relevant user role
- Current feature/module
- Current task
- Relevant project documentation
- Existing architecture that must be followed

Example:
```
CONTEXT

We are building the Campus Placement and Recruitment Management Portal (CPRMP).

This is an MCA Semester-3 group mini project.

Before making changes, read:

PRD.md
ARCHITECTURE.md
DESIGN.md
RULES.md
TASKS.md
TEST_PLAN.md
SECURITY.md
MEMORY.md

Current task:
TASK-XXX — <Task Name>

Understand the existing implementation before making changes.
```

---

# 2. TASK

Clearly state **one specific task**.

Do not ask the AI to build an entire module or application when the work can be divided into smaller tasks.

Example:
```
TASK

Implement the Student Registration form UI.

Only implement the registration UI for this task.

Do not implement login, JWT authentication, database persistence,
AI matching, placement drives, or other future features.
```

---

# 3. FILES

Tell the AI which files/directories are relevant.

If the exact files already exist, identify them.

If they do not exist, say that they may need to be created.

Example:
```
FILES

Relevant areas:

frontend/src/features/auth/
frontend/src/components/
frontend/src/pages/
frontend/src/services/

Check the existing project structure before creating files.

Do not create duplicate components or services.
```

The AI must inspect the existing files before modifying them.

---

# 4. CONSTRAINTS

Define what the AI must and must not do.

Typical CPRMP constraints:
```
CONSTRAINTS

- Follow PRD.md.
- Follow ARCHITECTURE.md.
- Follow DESIGN.md.
- Follow RULES.md.
- Follow SECURITY.md.
- Follow TEST_PLAN.md.
- Follow the existing project structure.
- Reuse existing components where possible.
- Do not create a second architecture or database layer.
- Do not create duplicate services.
- Do not introduce unnecessary dependencies.
- Do not modify unrelated files.
- Validate all user input.
- Enforce authorization on protected operations.
- Never expose secrets.
- Do not hardcode credentials or API keys.
- Follow the existing design system.
- Keep the implementation responsive.
- Do not implement future tasks.
- Do not change permanent technical decisions without justification.
```

For a specific task, add task-specific constraints.

---

# 5. ACCEPTANCE CRITERIA

Define exactly what must be true for the task to be considered complete.

Acceptance criteria should be observable and testable.

Example:
```
ACCEPTANCE CRITERIA

- Student can open the registration page.
- Registration form displays all required fields.
- Required fields cannot be submitted empty.
- Email format is validated.
- Password confirmation is validated.
- Invalid input displays useful error messages.
- Valid input can be submitted.
- The UI follows DESIGN.md.
- The page works at 375px, 768px, and 1440px.
- No unrelated functionality is changed.
```

For backend tasks:
```
ACCEPTANCE CRITERIA

- Valid request is accepted.
- Invalid request is rejected.
- Required fields are validated.
- Password is hashed before storage.
- Duplicate student email is rejected.
- Appropriate HTTP status codes are returned.
- Sensitive information is not returned in the response.
```

---

# 6. TESTING

Tell the AI exactly how the implementation must be tested.

Example:
```
TESTING

After implementation:

1. Run the relevant automated tests.
2. Add tests for the new functionality.
3. Test valid input.
4. Test invalid input.
5. Test required-field validation.
6. Test authorization where applicable.
7. Test relevant edge cases.
8. Test responsive behavior where applicable.
9. Run linting.
10. Run the project's available validation/build checks.

Do not mark the task complete if relevant tests fail.
```

Do not ask the AI to run commands that are not supported by the project's actual tooling.

---

# 7. Required Final Report

After implementation, the AI must report:
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
- <relevant security checks>

7. Next Task
- <next task>
```

The AI must not claim a test passed if it was not actually executed.

---

# 8. Complete CPRMP Prompt Template

Copy and customize this template for future tasks:
```
CONTEXT

We are building the Campus Placement and Recruitment Management Portal (CPRMP).

This is an MCA Semester-3 group mini project.

Before making changes, read and understand:

PRD.md
ARCHITECTURE.md
DESIGN.md
RULES.md
TASKS.md
TEST_PLAN.md
SECURITY.md
MEMORY.md

Current Phase:
<phase>

Current Task:
<TASK-ID> — <Task Name>

Understand the existing implementation before making changes.


TASK

Implement only:

<TASK DESCRIPTION>

Do not implement future tasks or unrelated functionality.


FILES

Relevant files/directories:

<FILE/DIRECTORY 1>
<FILE/DIRECTORY 2>
<FILE/DIRECTORY 3>

First inspect the existing files.

Create new files only when required by the architecture.


CONSTRAINTS

- Follow PRD.md.
- Follow ARCHITECTURE.md.
- Follow DESIGN.md.
- Follow RULES.md.
- Follow TEST_PLAN.md.
- Follow SECURITY.md.
- Reuse existing components and utilities.
- Follow the existing architecture.
- Do not create duplicate services or database layers.
- Do not modify unrelated files.
- Do not introduce unnecessary dependencies.
- Validate all user input.
- Enforce authentication and authorization where applicable.
- Protect user/resource ownership.
- Never expose secrets.
- Do not hardcode credentials or API keys.
- Follow responsive design requirements.
- Do not implement future tasks.


ACCEPTANCE CRITERIA

- <criterion 1>
- <criterion 2>
- <criterion 3>
- <criterion 4>
- <criterion 5>

The task is complete only when all applicable acceptance criteria are satisfied.


TESTING

After implementation:

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
- Run build/type checking if configured.
- Verify that existing relevant functionality still works.

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

---

# 9. Example — CPRMP Student Registration

A real CPRMP task prompt could look like this:
```
CONTEXT

We are building CPRMP.

Read:

PRD.md
ARCHITECTURE.md
DESIGN.md
RULES.md
TASKS.md
TEST_PLAN.md
SECURITY.md
MEMORY.md

Current task:
TASK-016 — Student Registration UI


TASK

Implement only the Student Registration UI.

Do not implement backend registration, database persistence,
JWT authentication, or login logic yet.


FILES

Inspect:

frontend/src/
frontend/src/components/
frontend/src/pages/
frontend/src/features/auth/

Reuse existing components where possible.


CONSTRAINTS

- Follow DESIGN.md.
- Follow RULES.md.
- Follow SECURITY.md.
- Use React.js and JavaScript.
- Use Tailwind CSS.
- Do not introduce another UI framework.
- Do not modify unrelated features.
- Do not create duplicate components.
- Validate form input.
- Do not hardcode secrets.
- Keep the page responsive.


ACCEPTANCE CRITERIA

- Student can open the registration page.
- Registration form contains the required student fields.
- Required fields are validated.
- Invalid email is rejected.
- Password confirmation is validated.
- Useful validation messages are displayed.
- Valid form data can be submitted through the UI layer prepared for the future API.
- UI follows DESIGN.md.
- Layout works at 375px, 768px, and 1440px.


TESTING

- Add appropriate UI tests if the current testing setup supports them.
- Test required-field validation.
- Test invalid email.
- Test password confirmation.
- Test valid form input.
- Run relevant tests.
- Run linting if configured.
- Verify no unrelated functionality was broken.


FINAL REPORT

Report:

1. Files changed
2. What was implemented
3. Tests executed
4. Test results
5. Remaining issues
6. Security considerations
7. Next task

Do not implement the next task automatically.
```

---

# 10. Golden Rule

Every AI coding request should answer six questions:
```
CONTEXT
What are we building?

TASK
What exactly are we doing now?

FILES
Where should the work happen?

CONSTRAINTS
What rules must be followed?

ACCEPTANCE CRITERIA
What does "done" mean?

TESTING
How do we prove it works?
```

> **Never give the AI a vague instruction like "Build my app." Give it a structured, bounded task with measurable acceptance criteria.                                                                                                                                                                                                                                                             give me a .md file not any changes in this**
