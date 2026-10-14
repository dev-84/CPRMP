# CPRMP — Security Requirements

## 1. Purpose

This document defines the security requirements for the **Campus Placement and Recruitment Management Portal (CPRMP)**.

Security is a development requirement, not a final deployment task.

> **Security should not be added five minutes before deployment.**

Security requirements must be considered while designing, coding, testing, reviewing, and deploying every feature.

---

# 2. Security Principles

The project follows these principles:

- Authentication before access to private resources.
- Authorization on every protected operation.
- Least-privilege access.
- Server-side validation.
- Secure password storage.
- No secrets in client-side code.
- Secure database access.
- Strict file-upload validation.
- Safe API design.
- User and company data isolation.
- Secure error handling.
- Security testing before release.

---

# 3. Authentication

CPRMP has three primary roles:

```text
Student
Admin / Placement Officer
Recruiter
```

## Requirements

- [ ] Private routes require authentication.
- [ ] Protected APIs require valid authentication.
- [ ] Login credentials must be verified on the server.
- [ ] Passwords must never be stored as plain text.
- [ ] Passwords must be hashed using `bcrypt`.
- [ ] Authentication tokens must be handled securely.
- [ ] Invalid credentials must not reveal whether an account exists unnecessarily.
- [ ] Logout must invalidate/remove the client authentication state.
- [ ] Expired or invalid tokens must be rejected.
- [ ] Tampered tokens must be rejected.
- [ ] Authentication logic must remain server-side.

---

# 4. Authorization

Authentication answers:

> **Who are you?**

Authorization answers:

> **What are you allowed to do?**

Both must be enforced.

## Role-Based Access

### Student

Students may access:

- Their own profile
- Their own resume
- Available placement drives
- Their own applications
- Their own application status
- Permitted AI matching results

Students must not:

- Access Admin functions.
- Access Recruiter functions.
- Modify official selection decisions.
- Access another student's private data.

### Admin / Placement Officer

Admin may access authorized:

- Student management
- Company management
- Placement drive management
- Eligibility management
- Application/recruitment monitoring
- Selection and placement tracking

### Recruiter

Recruiters may access:

- Their company information
- Their company's placement drives
- Applicants for their company's drives
- Permitted applicant information
- Recruitment/shortlisting actions

Recruiters must not:

- Access another company's private recruitment data.
- Modify another company's drives.
- Access unrelated student data beyond permitted recruitment information.

---

# 5. Resource Ownership

Users can only access resources they are authorized to access.

Examples:

```text
Student A
   ↓
Own Profile
Own Resume
Own Applications
```

Student A must not be able to access:

```text
Student B
   ↓
Profile
Resume
Applications
```

Similarly:

```text
Recruiter A
   ↓
Company A
   ↓
Company A Drives
   ↓
Company A Applicants
```

Recruiter A must not access restricted data belonging to another company.

## Requirements

- [ ] Ownership checks are performed server-side.
- [ ] Resource IDs from the client are never trusted by themselves.
- [ ] Authorization is checked before returning protected data.
- [ ] Authorization is checked before update operations.
- [ ] Authorization is checked before delete operations.
- [ ] Authorization is checked before file access.

---

# 6. Secrets Management

Secrets must never be exposed to client-side code.

Never place sensitive values directly in React source code.

Examples of secrets:

- Database passwords
- JWT secrets
- API keys
- AI/API credentials
- Cloud storage credentials
- Deployment credentials

## Requirements

- [ ] Secrets are stored in environment variables.
- [ ] `.env` files are excluded from Git.
- [ ] `.env.example` contains only variable names/placeholders.
- [ ] No real passwords are committed to Git.
- [ ] No API keys are committed to Git.
- [ ] No JWT secret is committed to Git.
- [ ] Client-side code receives only information that is safe to expose.
- [ ] Production secrets are configured through the deployment environment.

Example:

```env
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=
JWT_SECRET=
```

Never commit real values.

---

# 7. Database Security

CPRMP uses **MongoDB with Mongoose**.

Database access must be controlled through the backend.

The React frontend must never connect directly to MongoDB.

```text
React Frontend
      ↓
Express API
      ↓
Backend Services
      ↓
MongoDB
```

## Requirements

- [ ] Database credentials are stored as environment variables.
- [ ] Database credentials are never exposed to the frontend.
- [ ] Backend is responsible for database access.
- [ ] Database users should have only the permissions required by the application.
- [ ] Production database credentials must not be shared in source code.
- [ ] Database queries must safely handle user-provided values.
- [ ] SQL injection risks must be prevented.
- [ ] Foreign-key relationships must be enforced where appropriate.
- [ ] Sensitive database information must not be returned in API responses.

---

# 8. Input Validation

All user input must be treated as untrusted.

Validation must occur on the **backend**, even when frontend validation already exists.

Examples:

- Name
- Email
- Phone number
- Student ID
- CGPA
- Percentage
- Course
- Branch
- Company information
- Job description
- Eligibility criteria
- Application data

## Requirements

- [ ] Validate required fields.
- [ ] Validate data types.
- [ ] Validate string length.
- [ ] Validate numeric ranges.
- [ ] Validate email format.
- [ ] Validate allowed values where applicable.
- [ ] Reject unexpected input.
- [ ] Sanitize/handle input appropriately before processing.
- [ ] Never trust frontend validation alone.

Example:

```text
Frontend Validation
        ↓
Backend Validation
        ↓
Business Logic
        ↓
Database
```

---

# 9. API Security

Every protected API endpoint must verify authentication and authorization where required.

## Requirements

- [ ] Validate request body.
- [ ] Validate route parameters.
- [ ] Validate query parameters.
- [ ] Validate authentication.
- [ ] Validate authorization.
- [ ] Reject malformed requests.
- [ ] Reject unauthorized requests.
- [ ] Return appropriate HTTP status codes.
- [ ] Do not expose stack traces in production responses.
- [ ] Do not expose database errors directly to clients.
- [ ] Do not expose passwords, JWT secrets, or sensitive internal information.

## Example

A request such as:

```http
GET /api/students/123
```

must not automatically mean the requester is allowed to access student `123`.

The backend must verify:

```text
Authenticated?
     ↓
Correct Role?
     ↓
Authorized for Resource?
     ↓
Return Data
```

---

# 10. File Upload Security

CPRMP allows students to upload resumes.

File uploads must be treated as untrusted input.

## Validate File Type

- [ ] Only supported resume formats are accepted.
- [ ] Unsupported file types are rejected.
- [ ] File extension alone must not be considered sufficient validation where stronger validation is practical.

Example permitted formats may include:

```text
.pdf
.doc
.docx
```

The exact allowed formats must match the implemented resume-upload requirement.

## Validate File Size

- [ ] Maximum file size is defined.
- [ ] Files exceeding the limit are rejected.
- [ ] File-size validation is performed server-side.

## Validate Filename

- [ ] Original filenames are not blindly trusted.
- [ ] Unsafe characters are handled safely.
- [ ] Path traversal attempts are rejected.
- [ ] User-controlled filenames must not determine arbitrary server paths.
- [ ] Uploaded files should use safe/generated storage names where appropriate.

Never allow a user-controlled filename to become an unrestricted filesystem path.

---

# 11. Resume/File Access

Uploaded resumes must not automatically become publicly accessible.

## Requirements

- [ ] Resume access requires appropriate authorization.
- [ ] Student can access their own permitted resume.
- [ ] Recruiter access is limited to permitted recruitment context.
- [ ] Unauthorized users cannot download another student's private resume.
- [ ] File access is controlled by the backend.
- [ ] File references/paths are not treated as authorization.

---

# 12. Password Security

Passwords are sensitive credentials.

## Requirements

- [ ] Passwords are hashed using `bcrypt`.
- [ ] Plain-text passwords are never stored.
- [ ] Plain-text passwords are never logged.
- [ ] Passwords are never returned in API responses.
- [ ] Password hashes are never returned unnecessarily.
- [ ] Password fields are protected from accidental exposure.
- [ ] Password confirmation is validated during registration where applicable.

---

# 13. JWT Security

CPRMP uses JWT-based authentication.

## Requirements

- [ ] JWT signing secret is stored securely.
- [ ] JWT secrets are never committed to Git.
- [ ] Token validity is verified server-side.
- [ ] Expired tokens are rejected.
- [ ] Invalid tokens are rejected.
- [ ] Tampered tokens are rejected.
- [ ] Protected routes require valid authentication.
- [ ] Sensitive information should not be unnecessarily stored inside JWT payloads.
- [ ] Authentication state must not expose secrets to the frontend.

---

# 14. AI Module Security

The AI Resume–Job Matching module is assistive.

## Requirements

- [ ] AI input is validated.
- [ ] Resume content is treated as untrusted input.
- [ ] Job-description input is validated.
- [ ] AI processing must not bypass authorization.
- [ ] AI endpoints require appropriate authentication/authorization.
- [ ] AI results must belong to the correct student and placement drive.
- [ ] AI must never override official eligibility.
- [ ] AI failures must not expose internal errors or sensitive information.

Security boundary:

```text
Official Eligibility
        ↑
Deterministic Backend Rules
        ↑
       AI
```

AI is not an authorization mechanism.

---

# 15. Error Handling

Errors must provide useful information without exposing sensitive implementation details.

## Do

```text
Invalid credentials.
```

```text
You are not authorized to access this resource.
```

## Do Not Expose

```text
MongoDB connection URI = ...
```

```text
JWT_SECRET = ...
```

```text
/full/server/internal/path/...
```

```text
Raw database stack trace
```

## Requirements

- [ ] Production API responses do not expose stack traces.
- [ ] Internal database errors are logged securely.
- [ ] Sensitive values are never included in logs.
- [ ] Users receive safe, understandable error messages.

---

# 16. Logging & Monitoring

Logs can contain sensitive information if implemented carelessly.

## Requirements

- [ ] Never log passwords.
- [ ] Never log JWT secrets.
- [ ] Never log API keys.
- [ ] Avoid unnecessary personal data in logs.
- [ ] Log important security events where appropriate.
- [ ] Log authentication failures appropriately.
- [ ] Log authorization failures appropriately.
- [ ] Production logs must be handled securely.

---

# 17. CORS & HTTP Security

The backend must restrict cross-origin access according to the deployment architecture.

## Requirements

- [ ] Configure CORS explicitly.
- [ ] Do not allow arbitrary origins in production without a reason.
- [ ] Use HTTPS in production.
- [ ] Avoid transmitting sensitive information over unsecured HTTP.
- [ ] Configure appropriate security-related HTTP headers where applicable.
- [ ] Disable unnecessary server-identifying information.

---

# 18. Environment Configuration

Different environments must use separate configuration.

```text
Development
     ↓
Testing
     ↓
Production
```

## Requirements

- [ ] Development secrets are separate from production secrets.
- [ ] Production credentials are never committed to Git.
- [ ] Environment variables are documented through `.env.example`.
- [ ] Production configuration is reviewed before deployment.
- [ ] Debug settings are not enabled in production.

---

# 19. Dependency Security

Third-party dependencies can introduce security vulnerabilities.

## Requirements

- [ ] Use trusted packages.
- [ ] Avoid unnecessary dependencies.
- [ ] Keep dependencies reasonably up to date.
- [ ] Review dependency warnings.
- [ ] Remove unused dependencies.
- [ ] Do not install packages blindly because an AI tool suggests them.
- [ ] Review important dependency changes before committing.

---

# 20. Git & Repository Security

The Git repository must not contain sensitive information.

## Never Commit

```text
.env
Production passwords
JWT secrets
API keys
Database credentials
Private certificates
Private deployment credentials
```

## Requirements

- [ ] `.gitignore` includes `.env`.
- [ ] Uploaded/private files are excluded where appropriate.
- [ ] Secrets are not included in commits.
- [ ] Git history is checked if a secret is accidentally committed.
- [ ] Accidentally exposed secrets must be rotated immediately.

---

# 21. Frontend Security

The React application must never be considered a trusted security boundary.

Frontend controls improve user experience, but backend controls provide actual security.

## Requirements

- [ ] Do not store secrets in frontend source code.
- [ ] Do not connect directly from React to MongoDB.
- [ ] Do not rely only on hidden UI elements for authorization.
- [ ] Backend authorization must protect every sensitive operation.
- [ ] Do not expose unnecessary user information.
- [ ] Validate API responses where appropriate.
- [ ] Handle authentication failures safely.

Example:

Hiding an Admin button from a Student is **not sufficient security**.

The backend must also reject the Student's unauthorized Admin API request.

---

# 22. Data Privacy

CPRMP handles student and recruitment information.

Potentially sensitive information includes:

- Student contact information
- Academic information
- Resume data
- Application information
- Recruitment status
- Placement information

## Requirements

- [ ] Collect only information required by the application.
- [ ] Restrict access according to user role.
- [ ] Do not expose student information unnecessarily.
- [ ] Do not expose private resumes publicly.
- [ ] Do not display sensitive information in unnecessary UI locations.
- [ ] Protect stored information through appropriate access controls.

---

# 23. Security Testing Checklist

Before a feature is marked complete:

### Authentication

- [ ] Unauthenticated request tested.
- [ ] Valid authentication tested.
- [ ] Invalid authentication tested.
- [ ] Expired authentication tested where applicable.

### Authorization

- [ ] Correct role tested.
- [ ] Incorrect role tested.
- [ ] Resource ownership tested.
- [ ] Another user's resource access tested.

### Input

- [ ] Valid input tested.
- [ ] Empty input tested.
- [ ] Invalid input tested.
- [ ] Boundary values tested.
- [ ] Unexpected input tested.

### Files

- [ ] Valid file tested.
- [ ] Invalid file type tested.
- [ ] Oversized file tested.
- [ ] Unsafe filename tested.
- [ ] Unauthorized file access tested.

### APIs

- [ ] Valid request tested.
- [ ] Invalid request tested.
- [ ] Missing authentication tested.
- [ ] Unauthorized access tested.
- [ ] Invalid parameters tested.

---

# 24. Security Review Before Deployment

Security review must happen **before** production deployment.

Minimum checklist:

- [ ] No secrets committed to Git.
- [ ] Production environment variables configured.
- [ ] Authentication tested.
- [ ] Authorization tested.
- [ ] Resource ownership tested.
- [ ] Database access secured.
- [ ] API validation tested.
- [ ] File upload validation tested.
- [ ] Resume access authorization tested.
- [ ] Error responses reviewed.
- [ ] Debug mode disabled.
- [ ] HTTPS enabled.
- [ ] CORS configuration reviewed.
- [ ] Dependencies reviewed.
- [ ] Security-related tests pass.

---

# 25. Security Definition of Done

A feature is **security-complete** only when:

```text
Feature Implemented
        ↓
Authentication Checked
        ↓
Authorization Checked
        ↓
Input Validated
        ↓
Resource Ownership Checked
        ↓
Sensitive Data Protected
        ↓
Errors Reviewed
        ↓
Security Tests Passed
        ↓
Code Reviewed
        ↓
READY
```

A feature must not be considered production-ready simply because its normal functionality works.

---

# 26. Security Rule

> **Security is part of development from the first line of code, not a five-minute task before deployment.**

Every new CPRMP feature must consider:

```text
Authentication
Authorization
Input Validation
Data Protection
API Security
File Security
Error Handling
Testing
```

Security requirements must be implemented and tested alongside the feature itself.
