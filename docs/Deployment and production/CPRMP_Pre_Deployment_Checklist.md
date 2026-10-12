# Pre-Deployment Checklist

## Purpose

Before deploying CPRMP to production, the complete application must be verified across functionality, UI, accessibility, security, code quality, testing, and production build.

**Golden Rule:**

> Never deploy CPRMP until the complete pre-deployment checklist has been reviewed and all applicable items pass.

---

# 1. Functionality

Verify that the core application workflows work correctly.

### Authentication

- Student Signup / Registration
- Student Login
- Admin Login
- Recruiter Login
- Logout
- Protected routes
- Invalid login handling
- Session/token handling

### Core Features

- Student profile CRUD operations
- Resume upload/update/delete
- Company CRUD operations
- Placement drive CRUD operations
- Eligibility checking
- Student application
- Duplicate application prevention
- Recruiter applicant management
- Shortlisting
- Selection / rejection
- Placement tracking
- AI resume-job matching

### Forms

- Required-field validation
- Invalid input validation
- Email validation
- Password validation
- File upload validation
- Form submission
- Form reset/cancel behavior
- Server-side validation

### Application States

- Error handling
- Loading states
- Empty states
- Success messages
- Validation messages
- API failure handling
- Network failure handling

---

# 2. Responsive UI

Verify the application on different screen sizes.

### Mobile

- Mobile layout works correctly
- Navigation works
- Forms are usable
- Tables remain usable/responsive
- Buttons are accessible
- No horizontal overflow
- Dashboard is usable

Recommended test size:
```
375px
```

### Tablet

- Tablet layout works correctly
- Navigation works
- Cards and tables are responsive
- Forms remain usable
- No layout overflow

Recommended test size:
```
768px
```

### Desktop

- Desktop layout works correctly
- Dashboard layout is correct
- Sidebar/navbar works
- Tables are readable
- Content spacing is consistent

Recommended test size:
```
1440px
```

---

# 3. Accessibility

Verify that the application can be used with accessible interaction methods.

- Keyboard navigation works
- All interactive elements are keyboard accessible
- Form fields have proper labels
- Buttons have meaningful names
- Focus states are visible
- Images have appropriate alt text
- Error messages are understandable
- Color is not the only way information is communicated
- Modal/dialog keyboard behavior works correctly

---

# 4. Security

Security must be verified before deployment.

### Secrets

- No secrets in Git
- `.env` is not committed
- `.env.example` contains only safe placeholders
- API keys are stored in environment variables
- JWT secret is stored securely
- Database credentials are not hardcoded

### Authentication

- Authentication is verified
- Passwords are securely hashed
- JWT/token handling is verified
- Protected routes require authentication
- Invalid/expired authentication is handled

### Authorization

- Authorization is verified
- Student permissions are restricted correctly
- Admin permissions are restricted correctly
- Recruiter permissions are restricted correctly
- Recruiters cannot access another company's protected data
- Users cannot modify resources they do not own

### Database

- Database security is configured
- Production database credentials are secured
- Database access is restricted appropriately
- Sensitive data is protected
- Production database configuration is verified

### Validation

- Input validation is implemented
- API validation is implemented
- Server-side validation is enforced
- File upload validation is enforced
- Invalid requests are rejected safely
- SQL injection risks are addressed
- Unauthorized API requests are rejected

---

# 5. Code Quality

Before deployment, verify that the codebase passes all configured quality checks.

### JavaScript / Type Checking

The current CPRMP project uses **JavaScript**, not TypeScript.

Therefore:

- JavaScript code passes the configured checks
- If TypeScript is introduced later, TypeScript compilation passes

Do not add a TypeScript requirement unless the project is actually migrated to TypeScript.

### Linting

- Lint passes
- No unresolved lint errors
- No ignored critical warnings

Example:
```
npm run lint
```

Use the actual command defined in the project's `package.json`.

### Tests

- Unit tests pass
- Integration tests pass
- API tests pass
- E2E tests pass where configured
- No known critical test failures

Example:
```
npm test
```

Use the project's actual configured test command.

### Production Build

- Frontend production build passes
- Backend production configuration works
- AI module production configuration works if deployed separately
- No build errors
- No missing environment variables
- Production assets load correctly

Example:
```
npm run build
```

---

# 6. Database and Environment Verification

Before deployment:

- Production database exists
- Database connection works
- Required tables exist
- Required indexes/constraints exist
- Environment variables are configured
- `CLIENT_URL` points to the production frontend
- Backend API URL is configured correctly
- AI service URL is configured correctly if applicable
- Upload directory/storage is configured
- CORS configuration allows only required origins

---

# 7. End-to-End Placement Flow

The complete CPRMP placement workflow should be tested before deployment.
```
Student Registration
        ↓
Student Login
        ↓
Complete Profile
        ↓
Upload Resume
        ↓
View Placement Drive
        ↓
Eligibility Check
        ↓
Apply
        ↓
Recruiter Views Applicants
        ↓
Shortlist
        ↓
Selection / Rejection
        ↓
Placement Tracking
        ↓
AI Resume-Job Matching
```

Verify that data correctly moves between each stage.

- Student registration works
- Student can log in
- Student can complete profile
- Student can upload resume
- Student can view eligible drives
- Eligibility rules work correctly
- Student can apply
- Duplicate applications are prevented
- Recruiter can view authorized applicants
- Recruiter can shortlist applicants
- Selection status is recorded
- Placement record is created correctly
- AI matching produces a result
- AI result does not override official eligibility

---

# 8. Final Git Verification

Before deployment:
```
git status
git diff
git log --oneline
```

Verify:

- Working tree is clean or intentionally contains only deployment-related changes
- No secrets are present
- No temporary/debug files are committed
- All required changes are committed
- Latest tested commit is pushed
- `main` contains the intended stable version

---

# 9. Final Pre-Deployment Checklist
```
FUNCTIONALITY
[ ] Signup
[ ] Login
[ ] Logout
[ ] CRUD operations
[ ] Forms
[ ] Error handling
[ ] Loading states
[ ] Empty states

RESPONSIVE UI
[ ] Mobile
[ ] Tablet
[ ] Desktop

ACCESSIBILITY
[ ] Keyboard navigation
[ ] Form labels
[ ] Focus states
[ ] Accessible controls

SECURITY
[ ] No secrets in Git
[ ] Authentication verified
[ ] Authorization verified
[ ] Database security configured
[ ] Input validation
[ ] API validation
[ ] File upload security

CODE
[ ] JavaScript checks pass
[ ] Lint passes
[ ] Tests pass
[ ] Production build passes

DATABASE & ENVIRONMENT
[ ] Production database verified
[ ] Environment variables configured
[ ] CORS configured
[ ] API configuration verified
[ ] File storage configured

END-TO-END
[ ] Complete placement workflow tested
[ ] AI matching tested
[ ] Eligibility and AI separation verified

GIT
[ ] Changes reviewed
[ ] No secrets committed
[ ] Latest tested commit pushed
[ ] Stable main branch verified
```

---

# 10. Deployment Decision

Only proceed when:
```
All Critical Checks
       ↓
      PASS
       ↓
Production Build
       ↓
      PASS
       ↓
Security Review
       ↓
      PASS
       ↓
Final E2E Test
       ↓
      PASS
       ↓
    DEPLOY
```

If a critical check fails:
```
FAIL
 ↓
Do NOT deploy
 ↓
Identify root cause
 ↓
Fix
 ↓
Test again
 ↓
Review
 ↓
Re-run checklist
```

### Final Rule

> **If the application has not passed functionality, security, code-quality, and production-build verification, it is not ready for deployment.**
