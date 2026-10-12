# Preview-First Deployment Workflow

## Purpose

CPRMP must never use the production environment as the first environment for testing a new feature or change.

Every significant change should move through controlled environments before reaching production.

**Golden Rule:**

> Never make production the first testing environment.

---

# 1. Deployment Pipeline

The standard CPRMP deployment pipeline is:
```
LOCAL
  ↓
PREVIEW
  ↓
QA
  ↓
PRODUCTION
```

Each stage has a specific purpose.

### Local

Development and initial testing happen locally.
```
Developer / AI
      ↓
Implement
      ↓
Run locally
      ↓
Test
      ↓
Commit
```

Local testing should catch obvious implementation errors before deployment.

---

### Preview

The feature branch is deployed to a preview environment.
```
feature/student-profile
        ↓
Preview Deployment
        ↓
Test Feature
        ↓
Find Issues
```

Preview allows the team to test the actual deployed application without affecting production.

---

### QA

After preview testing succeeds, the change moves to QA.

QA verifies:

- Functional behavior
- Integration between modules
- Authentication
- Authorization
- Database behavior
- API behavior
- Responsive UI
- Accessibility
- Error handling
- Regression risks
- End-to-end workflows

---

### Production

Only after preview and QA verification should the change be released to production.
```
QA PASS
  ↓
Review
  ↓
Merge
  ↓
Production Deployment
```

---

# 2. Feature Deployment Workflow

For a larger feature, use:
```
feature/notes
      ↓
Preview Deployment
      ↓
Test
      ↓
Fix
      ↓
Preview Again
      ↓
QA
      ↓
Merge
      ↓
Production
```

For CPRMP examples:
```
feature/auth
feature/student-profile
feature/resume
feature/placement-drive
feature/eligibility
feature/application
feature/recruiter-applicants
feature/ai-matching
```

Each significant feature should be verified before being merged into the production branch.

---

# 3. Preview Testing

After a feature is deployed to preview:

### Functional Testing

- Feature loads correctly
- Main user flow works
- Forms work
- API requests work
- Database operations work
- Success states work
- Error states work
- Loading states work
- Empty states work

### Security Testing

- Authentication works
- Authorization works
- Protected routes are protected
- Users cannot access unauthorized resources
- No secrets are exposed
- API validation works

### UI Testing

- Mobile layout
- Tablet layout
- Desktop layout
- Keyboard navigation
- No unexpected UI regressions

---

# 4. Fix → Redeploy → Retest

If a problem is discovered in preview:
```
Preview
  ↓
Issue Found
  ↓
Fix Locally
  ↓
Test Locally
  ↓
Commit
  ↓
Push
  ↓
Preview Redeployment
  ↓
Retest
```

Do not assume that fixing the code locally means the preview deployment is correct.

The deployed version must be tested again.

---

# 5. Never Skip Preview for AI-Generated Changes

AI-generated code can introduce:

- Unexpected dependencies
- Incorrect API calls
- Security problems
- Broken existing functionality
- Unnecessary refactoring
- Incorrect database queries
- UI regressions
- Environment-specific problems

Therefore, significant AI-generated changes should go through:
```
AI Code
   ↓
Local Testing
   ↓
Git Commit
   ↓
Preview
   ↓
Testing
   ↓
QA
   ↓
Production
```

---

# 6. Production Protection

Production should contain only reviewed and tested code.

Do not use production as:

- A development environment
- A debugging environment
- A feature testing environment
- A place to experiment with AI-generated code
- A place to test database schema changes for the first time

If a feature has not been verified in preview/QA, it should not be deployed to production.

---

# 7. Environment Separation

Keep environments logically separated:
```
LOCAL
Development
    ↓
PREVIEW
Feature testing
    ↓
QA
Final verification
    ↓
PRODUCTION
Real users / stable release
```

Environment-specific configuration should be managed through environment variables.

Never hardcode production credentials into the application.

---

# 8. Deployment Checklist

Before moving a feature forward:

### Local → Preview

- Feature implemented
- Local tests pass
- Lint passes
- Production build passes where applicable
- Git changes reviewed
- No secrets committed
- Feature committed and pushed

### Preview → QA

- Preview deployment succeeds
- Feature works in preview
- API works
- Database operations work
- Authentication verified
- Authorization verified
- Responsive UI verified
- Error/loading/empty states verified
- No critical bugs remain

### QA → Production

- QA testing passes
- Regression testing passes
- Security checks pass
- End-to-end flow passes
- Production environment variables verified
- Database configuration verified
- Production build verified
- Final Git version reviewed
- Release is approved by the project team

---

# 9. CPRMP Example

For the AI Resume–Job Matching module:
```
feature/ai-matching
        ↓
Local Development
        ↓
Local Testing
        ↓
Git Commit
        ↓
Preview Deployment
        ↓
Test:
  - Resume upload
  - Skill extraction
  - Match score
  - Missing skills
  - Recommendations
  - Error handling
        ↓
Fix Issues
        ↓
Preview Redeployment
        ↓
QA
        ↓
Regression Testing
        ↓
Merge
        ↓
Production
```

The same process should be used for other major CPRMP modules.

---

# 10. Rollback Principle

If a production deployment introduces a critical problem:
```
Production Issue
      ↓
Stop Further Changes
      ↓
Identify Last Known Working Version
      ↓
Rollback / Revert
      ↓
Verify Production
      ↓
Fix Issue Separately
      ↓
Preview
      ↓
QA
      ↓
Redeploy
```

Do not attempt untested emergency changes directly in production unless there is an unavoidable operational emergency.

---

# 11. Golden Rules

1. **Local comes before Preview.**
2. **Preview comes before QA.**
3. **QA comes before Production.**
4. **Never make production the first testing environment.**
5. **Test the actual deployed preview, not only local code.**
6. **Fix issues locally and redeploy preview.**
7. **Do not skip preview for significant AI-generated changes.**
8. **Keep production limited to reviewed and tested code.**
9. **Maintain a known working version for rollback.**
10. **Every production release should have passed the required verification stages.**

### Final Rule

> **LOCAL → PREVIEW → QA → PRODUCTION. Never reverse this order.**
