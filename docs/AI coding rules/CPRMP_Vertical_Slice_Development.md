# Vertical Slice Development

CPRMP must be developed using **vertical slices**.

Do not develop the application layer-by-layer like this:
```
Entire Frontend
      ↓
Entire Backend
      ↓
Entire Database
      ↓
Integration
```

Instead, build a **complete user flow from UI to backend to database and back to the UI**.

---

# 1. What Is a Vertical Slice?

A vertical slice is a small, complete feature that works across all required layers.

For example:
```
Frontend UI
     ↓
API
     ↓
Backend Logic
     ↓
Database
     ↓
Backend Response
     ↓
Frontend UI Update
```

The feature should be usable end-to-end before moving to the next related feature.

---

# 2. CPRMP Example

Instead of building:
```
All React Pages
      ↓
All Express APIs
      ↓
All MySQL Tables
```

Build a complete user journey.

For example, the Student Authentication slice:
```
Student Signup
      ↓
Save Student
      ↓
Database
      ↓
Student Login
      ↓
Authentication
      ↓
Student Dashboard
```

Then expand the same flow:
```
Student Dashboard
      ↓
View Placement Drive
      ↓
Check Eligibility
      ↓
Apply
      ↓
Save Application
      ↓
Display Application Status
```

Then:
```
Recruiter Login
      ↓
Recruiter Dashboard
      ↓
View Applicants
      ↓
Shortlist Applicant
      ↓
Save Shortlisting Status
      ↓
Student Sees Updated Status
```

---

# 3. Example Vertical Slice — Student Registration

A complete registration slice should include:
```
Signup Page
     ↓
Enter Student Details
     ↓
Frontend Validation
     ↓
POST /api/auth/register
     ↓
Backend Validation
     ↓
Password Hashing
     ↓
Save User/Student Data
     ↓
MySQL
     ↓
API Response
     ↓
Frontend Success Message
```

Test the complete flow before moving forward.

---

# 4. Example Vertical Slice — Login
```
Login Page
     ↓
Enter Credentials
     ↓
Frontend Validation
     ↓
POST /api/auth/login
     ↓
Backend Authentication
     ↓
Verify Password
     ↓
Generate JWT
     ↓
API Response
     ↓
Frontend Authentication State
     ↓
Student Dashboard
```

Test:

- Valid credentials
- Invalid credentials
- Missing credentials
- Wrong password
- Unauthorized dashboard access

---

# 5. Example Vertical Slice — Placement Application

A complete application flow should be:
```
Student Dashboard
       ↓
View Placement Drive
       ↓
View Eligibility
       ↓
Eligibility Check
       ↓
Apply
       ↓
POST Application
       ↓
Backend Validation
       ↓
Save Application
       ↓
MySQL
       ↓
Application Response
       ↓
Student Dashboard
       ↓
Display "Applied"
```

Test:

- Eligible student can apply.
- Ineligible student cannot apply when prohibited.
- Duplicate application is rejected.
- Application after deadline is rejected.
- Application status is displayed correctly.

---

# 6. Example Vertical Slice — Recruiter Shortlisting
```
Recruiter Login
       ↓
Recruiter Dashboard
       ↓
Select Placement Drive
       ↓
View Applicants
       ↓
Select Applicant
       ↓
Shortlist
       ↓
API Request
       ↓
Authorization Check
       ↓
Update Application Status
       ↓
MySQL
       ↓
API Response
       ↓
Recruiter UI Updated
```

Then verify that the Student can see the updated application status.

---

# 7. Example Vertical Slice — AI Matching

The AI module should also be integrated as a complete slice.
```
Student Resume
       ↓
Resume Processing
       ↓
AI Skill Extraction
       ↓
Placement Job Requirements
       ↓
Skill Matching
       ↓
Match Score
       ↓
Missing Skills
       ↓
Backend Response
       ↓
Student UI
```

Important:
```
AI Matching
     ≠
Official Eligibility
```

The deterministic eligibility engine remains authoritative.

---

# 8. Vertical Slice Development Rule

For each feature:
```
Understand
    ↓
Plan
    ↓
Frontend
    ↓
API
    ↓
Backend Logic
    ↓
Database
    ↓
Integration
    ↓
Test
    ↓
Review
    ↓
Commit
```

Do not leave a feature half-integrated across multiple layers unless the current task explicitly requires it.

---

# 9. Do Not Build by Technical Layer

Avoid this development strategy:
```
❌ Build every React page
       ↓
❌ Build every Express route
       ↓
❌ Build every database table
       ↓
❌ Connect everything at the end
```

This creates a large integration problem at the end of development.

Instead:
```
✓ Complete one user flow
       ↓
✓ Test it
       ↓
✓ Review it
       ↓
✓ Commit it
       ↓
✓ Build the next user flow
```

---

# 10. Debugging Advantage

Vertical slices make debugging easier because failures remain close to the feature being developed.

For example:
```
Signup
  ↓
Signup UI works
  ↓
API fails
  ↓
Check registration endpoint
  ↓
Database insert fails
  ↓
Fix database operation
  ↓
Retest complete signup flow
```

Instead of discovering months later that:
```
Frontend ✓
Backend ✓
Database ✓
Integration ✗
```

---

# 11. Vertical Slice Boundaries

Each slice should be:

- Small enough to understand.
- Large enough to demonstrate a complete user flow.
- Testable independently.
- Connected across required layers.
- Consistent with the architecture.
- Secure.
- Committed separately when practical.

Do not make a vertical slice artificially large.

---

# 12. CPRMP Recommended Slice Order

A practical sequence for CPRMP is:

### Slice 1 — Student Authentication
```
Student Signup
    ↓
Student Login
    ↓
Student Dashboard
```

### Slice 2 — Student Profile
```
Dashboard
    ↓
View Profile
    ↓
Edit Profile
    ↓
Save
    ↓
Display Updated Profile
```

### Slice 3 — Resume
```
Profile
    ↓
Upload Resume
    ↓
Validate File
    ↓
Save Resume
    ↓
Display Resume
```

### Slice 4 — Company & Placement Drive
```
Admin Login
    ↓
Create Company
    ↓
Create Placement Drive
    ↓
Save
    ↓
Student Sees Drive
```

### Slice 5 — Eligibility & Application
```
Placement Drive
    ↓
Eligibility Check
    ↓
Apply
    ↓
Save Application
    ↓
Display Application Status
```

### Slice 6 — Recruiter Applicants
```
Recruiter Login
    ↓
Recruiter Dashboard
    ↓
View Applicants
    ↓
Shortlist
    ↓
Save Status
```

### Slice 7 — Selection & Placement
```
Shortlisted Applicant
    ↓
Selection
    ↓
Placement Status
    ↓
Save Placement
    ↓
Student Sees Result
```

### Slice 8 — AI Matching
```
Resume
    ↓
Extract Skills
    ↓
Compare With Job
    ↓
Calculate Match
    ↓
Show Skill Gaps
```

---

# 13. Relationship With Task-Based Development

Vertical slices do not replace the task system.

They work together:
```
TASKS.md
   ↓
Select ONE task
   ↓
Identify its vertical slice
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
```

A single vertical slice may require several focused tasks.

For example:
```
Student Authentication Slice
│
├── TASK — Signup UI
├── TASK — Signup API
├── TASK — Database persistence
├── TASK — Login
├── TASK — JWT authentication
└── TASK — Authentication tests
```

Each task remains focused, while together they create a complete working flow.

---

# 14. Definition of a Complete Vertical Slice

A vertical slice is considered complete when:

- User can start the flow from the UI.
- Frontend validation works.
- API request works.
- Backend logic works.
- Database operation works where required.
- Backend response is handled correctly.
- UI reflects the result.
- Authorization works.
- Relevant security checks pass.
- Error handling works.
- Relevant tests pass.
- Code has been reviewed.
- Changes have been committed.

---

# 15. Golden Rule

> **Build complete user flows, not isolated technical layers.**

The goal is to keep CPRMP continuously usable:
```
Small Feature
     ↓
Complete Flow
     ↓
Test
     ↓
Review
     ↓
Commit
     ↓
Next Flow
```

This keeps integration problems small and makes debugging significantly easier.