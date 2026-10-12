# End-to-End (E2E) Testing

## 1. Purpose

E2E testing verifies CPRMP from the **user's perspective**.

Instead of testing only individual functions or APIs, E2E tests simulate a real user interacting with the application through the browser.

Example:
```
Open CPRMP
    ↓
Register
    ↓
Login
    ↓
Open Dashboard
    ↓
Perform Action
    ↓
Refresh Page
    ↓
Verify Data Persists
    ↓
Edit Data
    ↓
Verify Updated Data
    ↓
Delete/Remove Where Applicable
    ↓
Verify UI Update
    ↓
Logout
```

The goal is to confirm that the complete user flow works across the frontend, backend, database, authentication, and relevant services.

---

# 2. E2E Testing Tool

The project may use **Playwright** for browser-based E2E testing.

Playwright can automate:

- Opening the application.
- Clicking buttons.
- Filling forms.
- Navigating between pages.
- Verifying displayed data.
- Refreshing pages.
- Testing authentication flows.
- Testing responsive layouts where required.

Do not add Playwright until it is required by the project's testing setup/task.

---

# 3. Student Authentication E2E Flow

Test the complete Student authentication flow:
```
Open CPRMP
    ↓
Student Signup
    ↓
Enter Registration Details
    ↓
Submit
    ↓
Registration Success
    ↓
Student Login
    ↓
Enter Credentials
    ↓
Login
    ↓
Student Dashboard
    ↓
Logout
```

Checklist:

- Application opens successfully.
- Student can open registration.
- Student can enter valid registration information.
- Registration succeeds.
- Student can log in.
- Dashboard opens after successful login.
- Student can log out.
- Protected dashboard cannot be accessed after logout.

---

# 4. Student Profile E2E Flow
```
Student Login
    ↓
Dashboard
    ↓
Open Profile
    ↓
Edit Profile
    ↓
Save
    ↓
Refresh
    ↓
Verify Updated Profile
```

Checklist:

- Student can open profile.
- Student can edit profile information.
- Valid information can be saved.
- Success state is displayed.
- Refresh does not lose the saved information.
- Updated information is displayed.
- Another student's profile cannot be accessed.

---

# 5. Resume E2E Flow
```
Student Login
    ↓
Profile
    ↓
Resume Section
    ↓
Upload Resume
    ↓
Save
    ↓
Refresh
    ↓
Verify Resume
    ↓
Replace/Update Resume
```

Checklist:

- Student can open resume section.
- Student can upload a valid resume.
- Upload succeeds.
- Resume information is displayed.
- Refresh preserves the resume information.
- Student can update the resume where permitted.
- Invalid file type is rejected.
- Oversized file is rejected.
- Unauthorized user cannot access the resume.

---

# 6. Placement Drive E2E Flow

## Admin
```
Admin Login
    ↓
Admin Dashboard
    ↓
Create Company
    ↓
Create Placement Drive
    ↓
Set Job Details
    ↓
Set Eligibility
    ↓
Save
```

## Student
```
Student Login
    ↓
Student Dashboard
    ↓
Placement Drives
    ↓
Open Drive
    ↓
View Job Details
    ↓
View Eligibility
```

Checklist:

- Admin can log in.
- Admin can create a company where permitted.
- Admin can create a placement drive.
- Drive information is saved.
- Student can see the appropriate drive.
- Student can open drive details.
- Eligibility information is displayed correctly.

---

# 7. Student Application E2E Flow
```
Student Login
    ↓
Placement Drives
    ↓
Open Eligible Drive
    ↓
Check Eligibility
    ↓
Apply
    ↓
Application Saved
    ↓
Refresh
    ↓
Verify Application
```

Checklist:

- Student can view the drive.
- Eligibility is calculated correctly.
- Eligible student can apply.
- Application is saved.
- Application status is displayed.
- Refresh preserves the application.
- Student cannot submit a duplicate application.
- Application after the deadline is rejected where applicable.
- Ineligible student cannot apply when prohibited.

---

# 8. Recruiter Applicant E2E Flow
```
Recruiter Login
    ↓
Recruiter Dashboard
    ↓
Open Placement Drive
    ↓
View Applicants
    ↓
Open Applicant
    ↓
Shortlist
    ↓
Save
    ↓
Verify Updated Status
```

Checklist:

- Recruiter can log in.
- Recruiter can access permitted company drives.
- Recruiter can view applicants for their drive.
- Recruiter can perform permitted shortlisting.
- Shortlisting is saved.
- Updated status is displayed.
- Recruiter cannot access another company's restricted applicants.

---

# 9. Selection & Placement E2E Flow
```
Recruiter/Admin
    ↓
Applicant
    ↓
Recruitment Status
    ↓
Select / Reject
    ↓
Save Result
    ↓
Student Login
    ↓
View Application Status
    ↓
View Placement Result
```

Checklist:

- Authorized user can update the recruitment result.
- Selection/rejection is persisted.
- Student can see the appropriate result.
- Student cannot modify the official result.
- Placement history is displayed correctly where applicable.

---

# 10. AI Matching E2E Flow
```
Student
    ↓
Resume Available
    ↓
Open Placement Drive
    ↓
Run/View AI Matching
    ↓
Skill Matching
    ↓
Match Score
    ↓
Matched Skills
    ↓
Missing Skills
    ↓
Suggestions
```

Checklist:

- Resume is available.
- AI matching can be requested where applicable.
- Job requirements are processed.
- Match result is generated.
- Matched skills are displayed.
- Missing skills are displayed.
- Skill-gap suggestions are displayed where applicable.
- AI failure is handled safely.
- AI result does not override official eligibility.

---

# 11. Data Persistence Testing

E2E tests should verify that important data survives navigation and page refresh.

Example:
```
Create Data
    ↓
Save
    ↓
Refresh Browser
    ↓
Open Same Page
    ↓
Verify Data Still Exists
```

Apply this where appropriate to:

- Student profile
- Resume information
- Placement drives
- Applications
- Shortlisting status
- Selection status
- Placement records

This helps verify that the UI is not merely displaying temporary client-side state.

---

# 12. Logout & Protected Route E2E Test
```
Login
    ↓
Dashboard
    ↓
Logout
    ↓
Attempt Dashboard Access
    ↓
Access Denied / Redirect to Login
```

Checklist:

- User can log out.
- Authentication state is removed/invalidated as configured.
- Protected dashboard cannot be accessed after logout.
- Protected API requests are rejected appropriately.

---

# 13. Responsive E2E Testing

Where applicable, test important user flows at:
```
375px
768px
1440px
```

Check:

- Signup flow
- Login flow
- Dashboard
- Placement-drive view
- Application flow
- Recruiter applicant view
- Important forms
- Navigation

The application should remain usable at all required viewport sizes.

---

# 14. E2E Test Boundaries

Not every small task needs a complete E2E test.

For example:

### Small UI Task
```
Signup UI
```

Use appropriate UI/unit testing first.

### Complete Authentication Slice
```
Signup
    ↓
Login
    ↓
Dashboard
    ↓
Logout
```

Add an E2E test for the complete flow.

### Complete Placement Slice
```
View Drive
    ↓
Eligibility
    ↓
Apply
    ↓
Refresh
    ↓
Verify Application
```

Add an E2E test for the complete flow.

---

# 15. E2E Test Failure Rule

If an E2E test fails:
```
E2E Failure
    ↓
Identify Failed Step
    ↓
Check Browser/UI
    ↓
Check API
    ↓
Check Backend
    ↓
Check Database
    ↓
Fix Root Cause
    ↓
Run E2E Test Again
```

Do not simply skip or disable the failing test.

---

# 16. E2E Definition of Done

A completed vertical slice should have appropriate E2E verification when it represents a complete user flow.

The E2E test should confirm:

- User can start the flow.
- User can complete the flow.
- Backend operations work.
- Database persistence works where required.
- UI displays the correct result.
- Refresh/navigation does not incorrectly lose persisted data.
- Authentication works.
- Authorization works.
- Relevant error states work.
- The flow works at required responsive sizes where applicable.

---

# 17. Example Playwright Flow

A conceptual CPRMP E2E flow:
```
Open CPRMP
      ↓
Student Signup
      ↓
Student Login
      ↓
Student Dashboard
      ↓
Open Placement Drive
      ↓
Check Eligibility
      ↓
Apply
      ↓
Refresh
      ↓
Verify Application Exists
      ↓
Logout
      ↓
Verify Dashboard Is Protected
```

The exact Playwright implementation should follow the project's actual frontend structure, selectors, authentication strategy, and test configuration.

---

# 18. Golden Rule

> **E2E testing should verify CPRMP the way a real user experiences it.**

Do not test only:
```
Function → Function → Function
```

Also test:
```
Real User
   ↓
Browser
   ↓
UI
   ↓
API
   ↓
Backend
   ↓
Database
   ↓
Response
   ↓
Updated UI
```

A completed vertical slice should be proven from the user's perspective before it is considered fully working.