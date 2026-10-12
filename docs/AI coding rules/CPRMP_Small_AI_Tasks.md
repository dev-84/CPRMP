# Small AI Tasks

Never give the AI a huge implementation task.

The larger and less specific the request, the greater the chance of:

- Architectural misunderstandings
- Unnecessary file changes
- Duplicate code
- Incorrect assumptions
- Scope expansion
- Difficult debugging
- Unwanted dependencies
- Features being implemented before their planned task

---

## Bad Prompt

Do not give instructions such as:

> Build the entire CPRMP application.

or:

> Build the complete authentication system.

or:

> Build the entire Student module.

These tasks are too broad.

---

## Better Prompt

Break the work into smaller tasks.

For example:

> Build authentication.

This is better, but can still be divided further.

---

## Best Prompt

Create one focused implementation task:

> Create the Student signup UI. Do not implement authentication yet.

Then provide precise requirements.
```
TASK

Create the Student signup UI.

Do not implement authentication yet.

Follow DESIGN.md.

Requirements:

- Email field
- Password field
- Confirm password field
- Input validation
- Loading state
- Error state
- Mobile responsive
- Reuse existing components where possible
- Do not modify unrelated files
```

---

# Task Size Rule

A good AI task should normally have:

- One clear objective.
- A small set of related requirements.
- Clearly defined files or feature area.
- Clear constraints.
- Testable acceptance criteria.
- A clear definition of what is **not** included.

---

# Example — Authentication Development

Do not ask:
```
Build complete authentication.
```

Break it down:
```
TASK-001
Create signup UI
```

Then:
```
TASK-002
Add signup form validation
```

Then:
```
TASK-003
Create registration API
```

Then:
```
TASK-004
Connect signup UI to registration API
```

Then:
```
TASK-005
Implement password hashing
```

Then:
```
TASK-006
Implement login API
```

Then:
```
TASK-007
Implement JWT authentication
```

Then:
```
TASK-008
Protect private routes
```

Then:
```
TASK-009
Add authentication tests
```

Each task should be implemented, tested, reviewed, and committed before moving to the next task.

---

# Explicit Exclusions

Every small AI task should clearly state what the AI must **not** implement when there is a risk of scope expansion.

Example:
```
TASK

Create the Student signup UI.

DO NOT IMPLEMENT:

- Authentication
- JWT
- Backend registration API
- Database integration
- Login
- Password hashing
- Email verification
- Forgot password
- Admin authentication
- Recruiter authentication
```

This prevents the AI from assuming that related functionality should also be built.

---

# Small Task → Small Change

Prefer:
```
One Task
   ↓
Small Code Change
   ↓
Small Test Scope
   ↓
Easy Review
   ↓
Easy Debugging
   ↓
Focused Commit
```

Avoid:
```
Huge Task
   ↓
Many Files Changed
   ↓
Many Features
   ↓
Difficult Testing
   ↓
Difficult Debugging
   ↓
Unclear Commit
```

---

# Vertical Slice Compatibility

Small tasks should still contribute toward a complete vertical slice.

For example:
```
Student Authentication Slice
│
├── Signup UI
├── Signup Validation
├── Registration API
├── Database Persistence
├── Login
├── JWT
├── Protected Dashboard
└── Authentication Tests
```

Each individual task remains small, while the completed tasks eventually create a complete user flow.

---

# AI Scope Control Rule

If the AI discovers work that is outside the current task:
```
Discover Additional Work
        ↓
Do NOT automatically implement it
        ↓
Report it
        ↓
Continue Current Task
```

Do not allow convenience to become scope expansion.

---

# When a Task Is Too Large

Consider splitting the task if the prompt contains several independent objectives.

For example:
```
❌ Build signup UI + API + database + JWT + email verification.
```

Split it into:
```
✓ Signup UI
✓ Signup validation
✓ Registration API
✓ Database persistence
✓ Password hashing
✓ Login
✓ JWT
✓ Email verification
```

---

# Golden Rule

> **The smaller and clearer the task, the less room the AI has to misunderstand the project.**

Always prefer:
```
Small Task
   ↓
Clear Requirements
   ↓
Clear Boundaries
   ↓
Test
   ↓
Review
   ↓
Commit
```

over:
```
"Build the whole thing."                                      give me a .md file not any changes in this
```