# Production Deployment Workflow

## Purpose

Production deployment is the final stage of the CPRMP release process.

Production must contain only code that has already been developed locally, tested in preview, verified through QA, and approved for release.

**Golden Rule:**

> Never deploy untested code directly to production.

---

# 1. CPRMP Deployment Pipeline

The standard deployment flow is:
```
GitHub Repository
        ↓
Connect Deployment Platform
        ↓
Configure Environment Variables
        ↓
Deploy Preview
        ↓
Preview URL
        ↓
Test
        ↓
QA Verification
        ↓
Production Deployment
```

For CPRMP, the complete release flow is:
```
LOCAL
  ↓
GIT
  ↓
GITHUB
  ↓
PREVIEW
  ↓
QA
  ↓
PRODUCTION
```

---

# 2. Recommended CPRMP Deployment Architecture

The current CPRMP stack is:
```
Frontend
React + Vite
        ↓
Backend
Node.js + Express
        ↓
Database
MySQL

AI Module
Python + Scikit-learn
```

Therefore, deployment should be treated as separate application components where necessary.
```
                    GitHub
                       │
        ┌──────────────┼──────────────┐
        ↓              ↓              ↓
    Frontend        Backend        AI Module
 React + Vite     Node + Express   Python
        │              │              │
        └──────────────┼──────────────┘
                       ↓
                    MySQL
```

Do not assume that the entire CPRMP system must be deployed as a single service.

---

# 3. Frontend Deployment

Vercel is one possible deployment platform for the CPRMP React + Vite frontend.

General workflow:
```
GitHub Repository
        ↓
Connect Frontend Repository to Vercel
        ↓
Configure Build Settings
        ↓
Configure Environment Variables
        ↓
Deploy
        ↓
Preview URL
        ↓
Test
        ↓
Production
```

The deployment platform must use the actual build configuration defined by the project.

Do not copy Next.js-specific configuration into CPRMP because CPRMP uses React + Vite.

---

# 4. Environment Variables

Production environment variables must be configured through the deployment platform.

Never place production secrets directly in source code.

Examples of CPRMP configuration include:
```
CLIENT_URL
API_BASE_URL
AI_SERVICE_URL
```

Backend environment variables may include:
```
NODE_ENV
PORT
DB_HOST
DB_PORT
DB_NAME
DB_USER
DB_PASSWORD
JWT_SECRET
JWT_EXPIRES_IN
UPLOAD_DIR
AI_SERVICE_URL
```

Production values must be different from development values where appropriate.

### Never commit:
```
.env
Production passwords
JWT secrets
Database credentials
API keys
Private tokens
```

---

# 5. Preview Deployment

Every significant production change should first create a preview deployment.
```
feature branch
      ↓
GitHub
      ↓
Preview Deployment
      ↓
Preview URL
      ↓
Testing
```

Test the actual deployed preview rather than relying only on local testing.

Verify:

- Application loads
- Login works
- Authentication works
- API requests work
- Database operations work
- File uploads work
- Role-based authorization works
- AI matching works
- Responsive UI works
- Error handling works
- Loading states work
- No critical console errors

---

# 6. Production Deployment

After preview and QA successfully pass:
```
Preview
   ↓
QA PASS
   ↓
Final Review
   ↓
Merge / Release
   ↓
Production Deployment
```

Production deployment should be performed using the deployment platform's approved workflow.

For platforms supporting CLI deployment, CLI commands may be used when appropriate.

For example, with Vercel:
```
vercel
```

After preview testing and approval:
```
vercel --prod
```

These commands should only be used if the project is actually configured for Vercel.

---

# 7. Production Verification

Immediately after production deployment, perform a smoke test.

### Application

- Production URL opens
- Frontend loads correctly
- No major console errors
- Assets load correctly
- Routing works

### Authentication

- Student login works
- Admin login works
- Recruiter login works
- Logout works
- Protected routes work

### Core CPRMP Flow

- Student profile works
- Resume upload works
- Placement drives load
- Eligibility checking works
- Application submission works
- Duplicate application prevention works
- Recruiter applicant management works
- Selection/placement tracking works
- AI resume-job matching works

### API

- Frontend communicates with production API
- API authentication works
- API authorization works
- Database connection works
- Error responses are handled correctly

---

# 8. Production Database

Before production deployment:

- Production MySQL database is configured
- Database schema is up to date
- Required tables exist
- Required constraints exist
- Database credentials are secure
- Backend connects successfully
- No development database is accidentally used

Never test destructive database operations against production without an explicit need and appropriate backup/recovery planning.

---

# 9. Production AI Service

If the Python AI module is deployed separately:
```
Production Backend
        ↓
AI Service URL
        ↓
Python AI Service
        ↓
AI Matching Result
```

Verify:

- AI service is reachable
- Backend can communicate with AI service
- Resume/job data is handled correctly
- Match score is returned
- Missing skills are returned
- Recommendations are returned
- AI failure is handled gracefully
- AI never overrides official eligibility

If the AI service is unavailable, the main application should fail safely rather than exposing internal errors.

---

# 10. Rollback

If a production deployment introduces a critical issue:
```
Production Deployment
        ↓
Critical Issue
        ↓
Stop Further Changes
        ↓
Identify Last Known Working Version
        ↓
Rollback / Revert
        ↓
Verify Production
        ↓
Fix Locally
        ↓
Preview
        ↓
QA
        ↓
Production
```

Do not repeatedly modify production until the issue disappears.

Fix the problem through the normal development workflow.

---

# 11. Production Release Checklist

### GitHub

- Correct branch/version selected
- Changes reviewed
- Tests passed
- No secrets committed
- Latest changes pushed
- Production release corresponds to a known working commit

### Deployment

- Deployment platform configured
- Build settings verified
- Environment variables configured
- Preview deployment successful
- Preview tested
- QA passed
- Production deployment completed

### Production

- Production URL verified
- Authentication verified
- Authorization verified
- Database connection verified
- API verified
- File upload verified
- Core placement flow verified
- AI module verified
- Responsive UI verified
- Error handling verified
- No critical production errors

---

# 12. Important CPRMP Rule

The deployment platform is an implementation choice, not a core product requirement.

For example:
```
Frontend
React + Vite
    ↓
Vercel / Other suitable platform

Backend
Node + Express
    ↓
Render / Railway / Other suitable platform

AI
Python
    ↓
Suitable Python hosting

Database
MySQL
    ↓
Suitable managed MySQL provider
```

The final platform may change during development.

The architecture and deployment rules must remain independent of a specific hosting provider unless the project officially adopts that provider.

---

# 13. Final Production Flow
```
Developer
    ↓
Local Development
    ↓
Testing
    ↓
Git Commit
    ↓
GitHub
    ↓
Preview Deployment
    ↓
Preview URL
    ↓
Functional Testing
    ↓
Security Testing
    ↓
QA
    ↓
Final Review
    ↓
Production Deployment
    ↓
Production Smoke Test
    ↓
Release Complete
```

### Final Rule

> **GitHub → Preview → Test → QA → Production. Production is the final release environment, not a testing environment.**
