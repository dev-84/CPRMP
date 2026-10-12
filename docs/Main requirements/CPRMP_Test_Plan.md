# CPRMP — Test Plan

## 1. Purpose

This document defines what **"working"** means for the Campus Placement and Recruitment Management Portal (CPRMP).

The purpose of testing is to verify that:

- Required features work correctly.
- Users can perform only the actions allowed by their role.
- Invalid input is handled correctly.
- Users cannot access unauthorized data.
- Business rules are enforced by the backend.
- AI functionality works as an assistive feature.
- The application works across supported screen sizes.
- Major changes do not break existing functionality.

This document will be used as the project's **testing checklist** during development.

---

# 2. Testing Principles

Every implemented feature should be tested for:

1. **Happy Path** — valid input produces the expected result.
2. **Validation** — invalid or missing input produces a useful error.
3. **Authorization** — users can access only features allowed for their role.
4. **Data Isolation** — users cannot access another user's or company's restricted data.
5. **Edge Cases** — boundary and unusual cases are handled correctly.
6. **Responsive UI** — the feature works on required screen sizes.
7. **Regression** — existing features continue working after changes.

---

# 3. Test Status

Use the following status values:

| Status | Meaning |
|---|---|
| `PASS` | Feature works as expected |
| `FAIL` | Feature does not work as expected |
| `BLOCKED` | Cannot test because a dependency is incomplete |
| `NOT TESTED` | Testing has not started |

---

# 4. Authentication & Role Management

## 4.1 Student Registration

- [ ] Student can open registration page.
- [ ] Student can enter required registration details.
- [ ] Student can successfully register with valid data.
- [ ] Required fields cannot be submitted empty.
- [ ] Invalid email format shows an error.
- [ ] Password validation works.
- [ ] Password confirmation must match.
- [ ] Duplicate college email is rejected.
- [ ] Duplicate student ID is rejected.
- [ ] Student password is not stored as plain text.

## 4.2 Login

- [ ] Student can log in with valid credentials.
- [ ] Admin can log in with valid credentials.
- [ ] Recruiter can log in with valid credentials.
- [ ] Invalid email/username shows an error.
- [ ] Invalid password shows an error.
- [ ] Empty login fields show validation errors.
- [ ] Successful login creates a valid authenticated session/token.
- [ ] User is redirected to the correct dashboard according to role.

## 4.3 Authorization

- [ ] Logged-out users cannot access protected dashboards.
- [ ] Logged-out users cannot access protected APIs.
- [ ] Student cannot access Admin pages.
- [ ] Student cannot access Recruiter pages.
- [ ] Recruiter cannot access Admin pages.
- [ ] Recruiter cannot access another recruiter's restricted data.
- [ ] Admin can access permitted administrative features.
- [ ] Unauthorized API requests return an appropriate error.

## 4.4 Logout

- [ ] User can log out.
- [ ] Authentication state is cleared after logout.
- [ ] User cannot access protected pages after logout.
- [ ] Protected API requests fail after logout when authentication is no longer valid.

---

# 5. Student Profile Management

- [ ] Student can view their profile.
- [ ] Student can create/update profile information.
- [ ] Required profile fields are validated.
- [ ] Invalid profile data is rejected.
- [ ] Student can update their information.
- [ ] Updated information is persisted correctly.
- [ ] Student cannot modify another student's profile.
- [ ] Student can see their own academic information.

---

# 6. Resume Management

- [ ] Student can upload a resume.
- [ ] Supported resume file types are accepted.
- [ ] Invalid file types are rejected.
- [ ] File-size validation works.
- [ ] Student can view resume information.
- [ ] Student can replace/update their resume.
- [ ] Student can delete their resume when permitted.
- [ ] Resume file reference is stored correctly.
- [ ] Student cannot access another student's private resume through unauthorized requests.
- [ ] Resume upload does not expose unsafe file paths.

---

# 7. Company Management

## Admin

- [ ] Admin can create a company.
- [ ] Admin can view companies.
- [ ] Admin can update company information.
- [ ] Admin can approve/reject company information when applicable.
- [ ] Invalid company data is rejected.

## Recruiter

- [ ] Recruiter can access their company information according to permissions.
- [ ] Recruiter cannot modify another company's information.
- [ ] Recruiter cannot access another company's restricted recruitment data.

---

# 8. Placement Drive Management

## Admin

- [ ] Admin can create a placement drive.
- [ ] Admin can enter job description.
- [ ] Admin can enter required skills.
- [ ] Admin can define eligibility criteria.
- [ ] Admin can define application deadline.
- [ ] Admin can update a drive when permitted.
- [ ] Admin can close a drive.
- [ ] Invalid drive information is rejected.

## Student

- [ ] Student can view available placement drives.
- [ ] Student can view relevant drive details.
- [ ] Student can see application deadline.
- [ ] Student can see eligibility information.

## Recruiter

- [ ] Recruiter can view permitted company drives.
- [ ] Recruiter cannot modify another company's drive.

---

# 9. Eligibility Management

Eligibility must be determined by the **official deterministic eligibility rules**, not by AI.

Test criteria may include:

- Course
- Branch
- CGPA/percentage
- Backlogs
- Passing year
- Other configured academic requirements

Tests:

- [ ] Eligible student is identified correctly.
- [ ] Ineligible student is identified correctly.
- [ ] Course requirement is checked correctly.
- [ ] Branch requirement is checked correctly.
- [ ] CGPA/percentage requirement is checked correctly.
- [ ] Backlog requirement is checked correctly.
- [ ] Passing-year requirement is checked correctly.
- [ ] Boundary values are tested.
- [ ] Missing student information is handled correctly.
- [ ] Eligibility result is generated consistently.
- [ ] AI matching cannot change official eligibility.

---

# 10. Application Management

- [ ] Eligible student can apply for a placement drive.
- [ ] Ineligible student cannot apply when the drive rules prohibit it.
- [ ] Student can view application status.
- [ ] Student cannot submit duplicate applications for the same drive.
- [ ] Application after the deadline is rejected.
- [ ] Required application information is validated.
- [ ] Student can view their own applications.
- [ ] Student cannot access another student's application.
- [ ] Application status changes are persisted correctly.

---

# 11. Applicant Management & Shortlisting

## Recruiter

- [ ] Recruiter can view applicants for their company's drive.
- [ ] Recruiter cannot view applicants belonging to another company's drive.
- [ ] Recruiter can review applicant information permitted by the system.
- [ ] Recruiter can shortlist an applicant.
- [ ] Recruiter can reject an applicant.
- [ ] Applicant status is updated correctly.
- [ ] Duplicate or conflicting status updates are handled correctly.

## Admin

- [ ] Admin can view permitted applicant information.
- [ ] Admin can monitor recruitment progress.

---

# 12. Selection & Placement Tracking

- [ ] Authorized user can mark an applicant as selected.
- [ ] Authorized user can mark an applicant as rejected.
- [ ] Selection status is stored correctly.
- [ ] Final placement information is recorded correctly.
- [ ] Student can view their final placement status.
- [ ] Student cannot modify official selection results.
- [ ] Placement history is associated with the correct student.
- [ ] Unauthorized users cannot modify selection results.

---

# 13. AI Resume–Job Matching

The AI module is **assistive only**.

It must never override official eligibility.

## Resume Processing

- [ ] System can process a supported resume.
- [ ] Relevant skills can be extracted from the resume.
- [ ] Invalid/empty resume input is handled safely.

## Job Processing

- [ ] Required skills can be extracted/read from the job description.
- [ ] Missing or invalid job information is handled correctly.

## Matching

- [ ] Resume skills are compared with job requirements.
- [ ] Matched skills are displayed.
- [ ] Missing skills are displayed.
- [ ] Match score is generated.
- [ ] Improvement/skill-gap suggestions are generated when applicable.
- [ ] AI result is associated with the correct student and placement drive.
- [ ] AI result does not modify official eligibility.
- [ ] AI failure does not break the normal placement application flow.

---

# 14. Dashboard Testing

## Student Dashboard

- [ ] Student can access their dashboard after login.
- [ ] Student sees only student-related information.
- [ ] Available placement drives are displayed.
- [ ] Application information is displayed correctly.
- [ ] Profile/resume information is accessible.
- [ ] AI matching information is displayed where applicable.

## Admin Dashboard

- [ ] Admin can access the admin dashboard.
- [ ] Admin sees permitted management features.
- [ ] Company information is accessible.
- [ ] Placement drive information is accessible.
- [ ] Applicant/placement information is accessible.

## Recruiter Dashboard

- [ ] Recruiter can access the recruiter dashboard.
- [ ] Recruiter sees only permitted company/recruitment information.
- [ ] Recruiter can access their placement drives.
- [ ] Recruiter can access applicants for their drives.
- [ ] Recruiter can perform permitted shortlisting/recruitment actions.

---

# 15. API Testing

Use **Jest + Supertest** for automated backend/API testing and **Postman** for manual API verification.

- [ ] Valid API request returns expected response.
- [ ] Invalid request returns appropriate validation error.
- [ ] Missing authentication is rejected for protected endpoints.
- [ ] Unauthorized role access is rejected.
- [ ] Invalid resource ID is handled correctly.
- [ ] Non-existent resource returns appropriate error.
- [ ] Duplicate data is rejected where required.
- [ ] API response format is consistent.
- [ ] Server errors do not expose sensitive implementation details.

---

# 16. Database Testing

- [ ] Required tables exist.
- [ ] Primary keys work correctly.
- [ ] Foreign-key relationships work correctly.
- [ ] Required fields cannot contain invalid/null values where prohibited.
- [ ] Duplicate records are prevented where required.
- [ ] Application relationships are maintained correctly.
- [ ] Student/application/drive relationships are correct.
- [ ] Placement records are associated with the correct student.
- [ ] Passwords are stored securely and never as plain text.

---

# 17. Security Testing

- [ ] Passwords are hashed using bcrypt.
- [ ] JWT authentication is validated on protected endpoints.
- [ ] Unauthorized users cannot access restricted resources.
- [ ] Role-based authorization is enforced server-side.
- [ ] Student data is isolated between users.
- [ ] Recruiter data is isolated between companies where required.
- [ ] User input is validated on the backend.
- [ ] File uploads are validated.
- [ ] Sensitive configuration values are stored in environment variables.
- [ ] `.env` files are not committed to Git.
- [ ] API errors do not expose passwords, tokens, or sensitive information.

---

# 18. Validation & Error Handling

- [ ] Required fields show validation errors.
- [ ] Invalid formats show useful errors.
- [ ] Duplicate records show useful errors.
- [ ] Unauthorized requests show appropriate errors.
- [ ] Non-existent resources show appropriate errors.
- [ ] Server errors show user-friendly messages.
- [ ] Forms do not silently fail.
- [ ] Loading states are displayed during asynchronous operations.
- [ ] Empty states are displayed when no data exists.
- [ ] Success messages are displayed after successful operations.

---

# 19. Responsive Testing

The application must be tested at the following viewport widths:

### Mobile

- [ ] **375px**

Check:

- Navigation
- Login/register forms
- Dashboard cards
- Tables/lists
- Buttons
- Forms
- Resume upload
- Placement-drive details

### Tablet

- [ ] **768px**

Check:

- Navigation
- Dashboard layout
- Forms
- Tables
- Cards
- Filters
- Buttons

### Desktop

- [ ] **1440px**

Check:

- Full dashboard layout
- Sidebar/navigation
- Tables
- Forms
- Cards
- Placement-drive pages
- Recruiter/Admin interfaces

---

# 20. Browser Testing

Test the application in supported modern browsers where available:

- [ ] Google Chrome
- [ ] Microsoft Edge

Verify:

- [ ] Pages load correctly.
- [ ] Forms work correctly.
- [ ] Navigation works.
- [ ] Authentication works.
- [ ] File uploads work.
- [ ] Responsive layouts work.
- [ ] No major console errors occur during normal usage.

---

# 21. Regression Testing

After implementing a new major feature:

- [ ] Existing authentication still works.
- [ ] Existing authorization still works.
- [ ] Existing dashboards still work.
- [ ] Existing APIs still work.
- [ ] Existing database relationships still work.
- [ ] Existing application flow still works.
- [ ] Existing AI functionality still works where applicable.
- [ ] No previously passed critical test has become broken.

---

# 22. End-to-End Placement Flow

The complete placement lifecycle must eventually be tested as one flow:

```text
Student Registration
        ↓
Student Login
        ↓
Complete Profile
        ↓
Upload Resume
        ↓
Admin Creates Company/Drive
        ↓
Admin Defines Eligibility
        ↓
Student Views Drive
        ↓
Eligibility Check
        ↓
AI Resume–Job Matching
        ↓
Student Applies
        ↓
Recruiter Views Applicants
        ↓
Recruiter Shortlists
        ↓
Recruitment Process
        ↓
Selection / Rejection
        ↓
Placement Tracking
```

Checklist:

- [ ] Registration works.
- [ ] Login works.
- [ ] Profile creation works.
- [ ] Resume upload works.
- [ ] Company setup works.
- [ ] Placement drive creation works.
- [ ] Eligibility checking works.
- [ ] AI matching works.
- [ ] Application works.
- [ ] Applicant management works.
- [ ] Shortlisting works.
- [ ] Selection/rejection works.
- [ ] Placement tracking works.

---

# 23. Definition of "Working"

A feature is considered **WORKING** only when:

```text
Feature Implemented
       ↓
Happy Path Tested
       ↓
Invalid Input Tested
       ↓
Authorization Tested
       ↓
Data Isolation Tested
       ↓
Relevant Edge Cases Tested
       ↓
Responsive UI Tested
       ↓
No Critical Regression
       ↓
Code Reviewed
       ↓
Test PASSED
```

A feature must **not** be marked complete simply because the UI appears on the screen.

---

# 24. Definition of Done

A task can be marked **DONE** when:

- [ ] Required functionality is implemented.
- [ ] Happy-path test passes.
- [ ] Validation tests pass.
- [ ] Authorization tests pass where applicable.
- [ ] Data-isolation tests pass where applicable.
- [ ] Relevant edge cases pass.
- [ ] Responsive testing passes.
- [ ] No critical regression is introduced.
- [ ] Code has been reviewed.
- [ ] Related documentation is updated if required.
- [ ] Changes are committed to Git.

---

# 25. Test Execution Record

Use this section during development.

| Test ID | Feature | Test Description | Expected Result | Actual Result | Status | Date |
|---|---|---|---|---|---|---|
| AUTH-001 | Authentication | Valid student login | Student dashboard opens | — | NOT TESTED | — |
| AUTH-002 | Authentication | Invalid password | Error displayed | — | NOT TESTED | — |
| AUTH-003 | Authorization | Logged-out dashboard access | Access denied | — | NOT TESTED | — |
| PROF-001 | Profile | Student updates profile | Profile updated | — | NOT TESTED | — |
| RES-001 | Resume | Student uploads valid resume | Resume uploaded | — | NOT TESTED | — |
| DRIVE-001 | Placement Drive | Admin creates drive | Drive created | — | NOT TESTED | — |
| ELIG-001 | Eligibility | Eligible student checks drive | Eligible result | — | NOT TESTED | — |
| APP-001 | Application | Student applies | Application created | — | NOT TESTED | — |
| APP-002 | Application | Duplicate application | Application rejected | — | NOT TESTED | — |
| AI-001 | AI Matching | Resume/job matching | Match result generated | — | NOT TESTED | — |
| REC-001 | Recruitment | Recruiter views applicants | Applicants displayed | — | NOT TESTED | — |
| SEL-001 | Selection | Applicant selected | Selection recorded | — | NOT TESTED | — |
| RESP-001 | Responsive | 375px layout | No major layout issue | — | NOT TESTED | — |
| RESP-002 | Responsive | 768px layout | No major layout issue | — | NOT TESTED | — |
| RESP-003 | Responsive | 1440px layout | No major layout issue | — | NOT TESTED | — |

---

# 26. Final Testing Checklist

Before declaring the CPRMP project ready:

### Core Functionality

- [ ] Authentication works.
- [ ] Role management works.
- [ ] Student profile works.
- [ ] Resume management works.
- [ ] Company management works.
- [ ] Placement drive management works.
- [ ] Eligibility engine works.
- [ ] Application management works.
- [ ] Applicant management works.
- [ ] Shortlisting works.
- [ ] Selection and placement tracking works.
- [ ] AI resume-job matching works.

### Security

- [ ] Authentication is secure.
- [ ] Authorization is enforced.
- [ ] User data is isolated.
- [ ] Recruiter/company data is isolated.
- [ ] Passwords are securely hashed.
- [ ] File uploads are validated.
- [ ] Sensitive information is protected.

### Quality

- [ ] Validation works.
- [ ] Error handling works.
- [ ] Loading states work.
- [ ] Empty states work.
- [ ] Responsive UI works at 375px.
- [ ] Responsive UI works at 768px.
- [ ] Responsive UI works at 1440px.
- [ ] Critical regression tests pass.
- [ ] Final end-to-end placement flow passes.

---

# 27. Testing Rule

> **If it has not been tested, it is not considered working.**

The implementation status in `TASKS.md` and `MEMORY.md` should reflect actual tested functionality rather than merely completed code.