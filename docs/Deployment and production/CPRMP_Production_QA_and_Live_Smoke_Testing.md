# Production QA and Live Smoke Testing

## Purpose

After deployment, CPRMP must be tested on the **actual live application**.

A feature working on `localhost` does not prove that it works correctly in production.

Production QA verifies the complete deployed system, including the frontend, backend API, database, authentication, environment configuration, routing, and responsive UI.

**Golden Rule:**

> Never consider a deployment successful until the actual live application has been tested.

---

# 1. Production QA Flow

After production deployment:

```text
Production Deployment
        ↓
Live URL
        ↓
Signup
        ↓
Login
        ↓
Core Features
        ↓
Database Operations
        ↓
Error Handling
        ↓
Mobile
        ↓
Desktop
        ↓
Final Smoke Test
```

Do not perform production QA only by checking whether the deployment platform reports **"Deployment Successful."**

The application itself must be tested.

---

# 2. Live URL Verification

Open the actual production URL.

Example:

```text
https://your-production-domain.com
```

Verify:

- [ ] Live URL opens
- [ ] HTTPS works
- [ ] Frontend loads correctly
- [ ] CSS loads correctly
- [ ] JavaScript loads correctly
- [ ] Images/assets load correctly
- [ ] No critical browser console errors
- [ ] Navigation works
- [ ] API connection works

---

# 3. Authentication Testing

### Signup / Registration

- [ ] Student registration works
- [ ] Required fields are validated
- [ ] Invalid inputs are rejected
- [ ] Duplicate registration is handled
- [ ] Successful registration creates the correct database record

### Login

Test:

- [ ] Correct credentials
- [ ] Wrong password
- [ ] Non-existent account
- [ ] Empty credentials
- [ ] Invalid email format

Verify that successful login provides the correct authenticated experience.

### Logout

- [ ] Logout works
- [ ] Authentication state is cleared
- [ ] Protected pages cannot be accessed after logout

---

# 4. Core Feature Testing

Test the actual production CPRMP workflows.

### Student

- [ ] View dashboard
- [ ] Update profile
- [ ] Upload resume
- [ ] Update resume
- [ ] View placement drives
- [ ] Check eligibility
- [ ] Apply for a placement drive
- [ ] Duplicate application is prevented
- [ ] View application status
- [ ] View AI resume-job matching result

### Admin / Placement Officer

- [ ] Manage students
- [ ] Manage companies
- [ ] Create/update placement drives
- [ ] Configure eligibility criteria
- [ ] Manage placement information

### Recruiter

- [ ] Access recruiter dashboard
- [ ] View authorized placement drives
- [ ] View applicants
- [ ] Shortlist applicants
- [ ] Update recruitment status

---

# 5. Database Operation Testing

Production QA must verify that real database operations work correctly.

Test:

```text
Create
   ↓
Read
   ↓
Update
   ↓
Delete
```

Verify that:

- [ ] Data is created correctly
- [ ] Data is retrieved correctly
- [ ] Data updates correctly
- [ ] Deletion behaves correctly
- [ ] Database constraints work
- [ ] Relationships work
- [ ] Duplicate records are prevented where required
- [ ] Changes persist after page refresh

Example:

```text
Student updates profile
        ↓
Save
        ↓
Refresh page
        ↓
Updated profile still exists
```

---

# 6. Error Handling

Production errors must be tested intentionally.

Test:

- [ ] Invalid form input
- [ ] Invalid API request
- [ ] Wrong credentials
- [ ] Unauthorized request
- [ ] Non-existent resource
- [ ] Invalid file upload
- [ ] Database/API failure
- [ ] Network failure

Verify that users receive a useful error message rather than:

- Blank page
- Application crash
- Raw stack trace
- Internal database error
- Sensitive server information

---

# 7. Responsive Production Testing

Test the actual production URL on multiple screen sizes.

### Mobile

- [ ] Navigation works
- [ ] Forms work
- [ ] Buttons work
- [ ] Tables/cards are usable
- [ ] No horizontal overflow
- [ ] Dashboard works

### Desktop

- [ ] Navigation works
- [ ] Dashboard layout works
- [ ] Forms work
- [ ] Tables work
- [ ] Content is correctly aligned

Recommended test sizes:

```text
Mobile  → 375px
Desktop → 1440px
```

---

# 8. Refresh Testing

Refreshing a page must not unexpectedly break the application.

Test:

```text
Open page
   ↓
Refresh browser
   ↓
Verify page
```

Check:

- [ ] Public pages survive refresh
- [ ] Logged-in pages survive refresh appropriately
- [ ] Authentication state is handled correctly
- [ ] Data remains available
- [ ] No unexpected logout occurs unless intended
- [ ] No blank page appears

---

# 9. Direct URL Testing

Users may access routes directly instead of navigating through the UI.

Test protected and public routes directly.

Examples:

```text
/login
/student/dashboard
/student/profile
/student/applications
/recruiter/dashboard
/admin/dashboard
```

Verify:

- [ ] Public URLs work
- [ ] Authenticated URLs work for authorized users
- [ ] Protected URLs reject logged-out users
- [ ] Unauthorized roles are rejected
- [ ] Invalid URLs show an appropriate response/page

---

# 10. Logged-Out Access Testing

Log out completely and attempt to access protected routes.

Example:

```text
Logout
  ↓
Open /student/dashboard directly
```

Expected behavior:

```text
Protected Route
      ↓
Not Authenticated
      ↓
Access Denied / Redirect to Login
```

Test:

- [ ] Student protected routes
- [ ] Admin protected routes
- [ ] Recruiter protected routes
- [ ] API protected endpoints

---

# 11. Invalid Input Testing

Production forms and APIs must reject invalid data safely.

Test:

- [ ] Empty required fields
- [ ] Invalid email
- [ ] Invalid phone number
- [ ] Invalid password
- [ ] Incorrect confirmation password
- [ ] Invalid CGPA/percentage
- [ ] Invalid date
- [ ] Invalid file type
- [ ] Oversized file
- [ ] Unexpected input values

Verify both:

```text
Frontend Validation
        +
Backend/API Validation
```

Backend validation must not depend solely on frontend validation.

---

# 12. Slow Network Testing

The production application should behave reasonably under slower network conditions.

Test using browser network throttling where available.

Check:

- [ ] Loading indicators appear
- [ ] Buttons do not cause accidental duplicate submissions
- [ ] API timeout/failure is handled
- [ ] Users receive useful feedback
- [ ] Partial loading does not break the page
- [ ] Retry behavior works where implemented

Example:

```text
Slow Network
     ↓
API Request
     ↓
Loading State
     ↓
Success / Error
```

---

# 13. Empty Database Testing

The application must handle situations where no relevant records exist.

Examples:

```text
No placement drives
No applications
No applicants
No companies
No notifications
No placement records
```

Verify that the UI displays a useful empty state.

Example:

```text
No Placement Drives Found

There are currently no placement drives available.
```

The application should not display:

- Broken tables
- `undefined`
- `null`
- Blank screens
- JavaScript errors

---

# 14. Wrong Credentials Testing

Test authentication with incorrect credentials.

Examples:

```text
Correct email + wrong password
Wrong email + correct password
Wrong email + wrong password
Empty email + password
Email + empty password
```

Verify:

- [ ] Login is rejected
- [ ] Useful error message appears
- [ ] No sensitive information is exposed
- [ ] User is not accidentally authenticated

Do not reveal whether an account exists through overly specific authentication errors where that would create an unnecessary account-enumeration risk.

---

# 15. Production Smoke Test

After deployment, perform a short critical-path smoke test:

```text
Live URL
   ↓
Login
   ↓
Dashboard
   ↓
Core Feature
   ↓
Database Operation
   ↓
Logout
   ↓
Protected URL Test
```

If this critical path fails, treat the production deployment as unsuccessful until the issue is resolved or the deployment is safely rolled back.

---

# 16. Production QA Checklist

```text
LIVE APPLICATION
[ ] Live URL works
[ ] HTTPS works
[ ] Frontend loads
[ ] API works
[ ] No critical console errors

AUTHENTICATION
[ ] Signup
[ ] Login
[ ] Logout
[ ] Wrong credentials
[ ] Protected routes

CORE FEATURES
[ ] Student features
[ ] Admin features
[ ] Recruiter features
[ ] AI matching
[ ] Eligibility checking

DATABASE
[ ] Create
[ ] Read
[ ] Update
[ ] Delete
[ ] Data persistence

ERROR HANDLING
[ ] Invalid inputs
[ ] API errors
[ ] Unauthorized access
[ ] Invalid resources
[ ] File errors

ROUTING
[ ] Page refresh
[ ] Direct URLs
[ ] Logged-out access
[ ] Invalid URLs

RESPONSIVE
[ ] Mobile
[ ] Desktop

EDGE CASES
[ ] Slow network
[ ] Empty database
[ ] Wrong credentials

FINAL
[ ] Production smoke test passed
[ ] No critical issues
[ ] Deployment verified
```

---

# 17. If Production QA Fails

Do not immediately make random changes directly in production.

Follow:

```text
Production Issue
      ↓
Record ERROR
      ↓
Identify EXPECTED behavior
      ↓
Identify ACTUAL behavior
      ↓
Reproduce
      ↓
Find Root Cause
      ↓
Fix Locally
      ↓
Test Locally
      ↓
Preview
      ↓
QA
      ↓
Redeploy
      ↓
Production Smoke Test
```

For critical production failures, use the last known working version and rollback when appropriate.

---

# 18. Final Rule

> **Local testing proves that the code works in the development environment. Production QA verifies that the deployed system actually works for users.**

Therefore:

```text
LOCAL ≠ PRODUCTION
```

Both environments must be tested separately.

### Golden Rule

> **After every production deployment, test the actual live application—not only localhost.**