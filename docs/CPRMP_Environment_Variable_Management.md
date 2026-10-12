# Environment Variable Management

## Purpose

CPRMP must use separate environment configurations for development, preview/QA, and production.

The local development environment must never be assumed to be identical to the production environment.

**Golden Rule:**

> Never use local environment values as production configuration.

---

# 1. Environment Separation

CPRMP should maintain separate configuration values for each environment:
```
LOCAL / DEVELOPMENT
        ↓
PREVIEW / QA
        ↓
PRODUCTION
```

Example:
```
Development
DATABASE_URL=development-db

Preview
DATABASE_URL=staging-db

Production
DATABASE_URL=production-db
```

Each environment should connect to the intended resources for that environment.

---

# 2. Local Environment

Local development may use environment files such as:
```
.env
.env.local
```

depending on the framework and project configuration.

For CPRMP, local environment values may include:
```
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173

DB_HOST=localhost
DB_PORT=3306
DB_NAME=cprmp
DB_USER=your_database_username
DB_PASSWORD=your_database_password

JWT_SECRET=local_development_secret
JWT_EXPIRES_IN=1d

AI_SERVICE_URL=http://localhost:8000
```

These values are intended only for local development.

---

# 3. Preview Environment

Preview deployments must use preview/staging resources where appropriate.

Example:
```
NODE_ENV=preview

DB_HOST=preview-database
DB_NAME=cprmp_preview

CLIENT_URL=https://preview.example.com

JWT_SECRET=preview_secret

AI_SERVICE_URL=https://preview-ai.example.com
```

Preview should not accidentally connect to the production database.

This protects production data while allowing realistic deployment testing.

---

# 4. Production Environment

Production must have its own environment variables.

Example:
```
NODE_ENV=production

DB_HOST=production-database
DB_NAME=cprmp_production

CLIENT_URL=https://production.example.com

JWT_SECRET=<secure-production-secret>

AI_SERVICE_URL=https://production-ai.example.com
```

Production secrets must be configured through the deployment platform or secure environment-management system.

They must not be committed to Git.

---

# 5. Example Environment Separation

A simplified configuration can be represented as:
```
┌─────────────────────────────────────┐
│ Development                         │
│ DATABASE_URL=development-db        │
│ API=http://localhost:5000           │
└─────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────┐
│ Preview / QA                        │
│ DATABASE_URL=staging-db             │
│ API=https://preview-api.example.com │
└─────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────┐
│ Production                          │
│ DATABASE_URL=production-db          │
│ API=https://api.example.com         │
└─────────────────────────────────────┘
```

---

# 6. Never Commit Secrets

Environment files containing real secrets must not be committed.

Do not commit:
```
.env
.env.local
.env.production
```

when they contain real credentials or secrets.

The repository should contain a safe example file:
```
.env.example
```

Example:
```
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173

DB_HOST=localhost
DB_PORT=3306
DB_NAME=cprmp
DB_USER=your_database_username
DB_PASSWORD=your_database_password

JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=1d

AI_SERVICE_URL=http://localhost:8000
```

The example file must contain placeholders rather than real credentials.

---

# 7. Environment Variables Must Be Explicit

Before deployment, identify which variables are required.

For CPRMP:
```
Required
├── NODE_ENV
├── PORT
├── CLIENT_URL
├── DB_HOST
├── DB_PORT
├── DB_NAME
├── DB_USER
├── DB_PASSWORD
├── JWT_SECRET
├── JWT_EXPIRES_IN
└── AI_SERVICE_URL
```

Optional variables should only be added when the corresponding service is actually integrated.

Do not add unnecessary environment variables simply because a deployment tutorial includes them.

---

# 8. Frontend Environment Variables

Frontend environment variables must be handled carefully.

Only values intended to be exposed to the browser should be made available to frontend code.

Never expose:
```
Database passwords
JWT signing secrets
Private API keys
Backend credentials
Internal service credentials
```

The frontend should communicate with the backend through the configured API URL.

For a Vite application, public client-side variables normally use the `VITE_` prefix.

Example:
```
VITE_API_BASE_URL=https://api.example.com
```

Do not put sensitive secrets in `VITE_*` variables because frontend values can be exposed to users.

---

# 9. Backend Environment Variables

Backend secrets must remain server-side.

Examples:
```
DB_PASSWORD
JWT_SECRET
AI_SERVICE_PRIVATE_KEY
```

These values must never be returned to the frontend or included in API responses.

Backend code should read them from the environment rather than hardcoding them.

---

# 10. Validate Environment Configuration

The application should fail safely when required environment variables are missing.

At application startup, verify required configuration such as:
```
Database configuration
JWT configuration
Client URL
AI service URL
Environment mode
```

Example behavior:
```
Missing required environment variable
            ↓
Application startup check
            ↓
Clear configuration error
            ↓
Do not start with an invalid configuration
```

Do not silently substitute production credentials, hardcoded defaults, or another environment's values.

---

# 11. Environment-Specific Database Protection

The database environment must be explicitly verified before deployment.
```
Local Application
      ↓
Local Database

Preview Application
      ↓
Preview Database

Production Application
      ↓
Production Database
```

A preview deployment must not accidentally point to the production database.

A local development application must not accidentally perform writes against production.

---

# 12. Deployment Platform Configuration

When deploying CPRMP, configure environment variables in the deployment platform according to the target environment.

For example:
```
Preview Deployment
    ↓
Preview Environment Variables
    ↓
Preview Database
```

and:
```
Production Deployment
    ↓
Production Environment Variables
    ↓
Production Database
```

Do not copy local `.env.local` values blindly into the production environment.

---

# 13. Environment Verification Checklist

### Local

- Local environment file configured
- Local database connection verified
- Local API URL verified
- Local AI service URL verified
- Local secrets are not committed

### Preview

- Preview environment variables configured
- Preview database configured
- Preview API URL verified
- Preview AI service URL verified
- Preview does not use production database
- Preview secrets are stored securely

### Production

- Production environment variables configured
- Production database configured
- Production API URL verified
- Production AI service URL verified
- Production JWT secret configured
- Production credentials are secure
- No production secrets exist in Git

---

# 14. Common Mistakes to Avoid

### Mistake 1 — Using Local Database in Production
```
Production
    ↓
localhost database
```

**Do not do this.**

Production must use its configured production database.

### Mistake 2 — Using Production Database in Preview
```
Preview
    ↓
Production Database
```

**Avoid this.**

Preview should use an isolated preview/staging database where practical.

### Mistake 3 — Hardcoding Secrets
```
const JWT_SECRET = "my-secret";
```

**Do not do this.**

Use an environment variable instead.

### Mistake 4 — Committing `.env`
```
git add .env
```

**Do not commit real environment files containing secrets.**

### Mistake 5 — Exposing Backend Secrets

Never place private credentials in browser-accessible frontend environment variables.

---

# 15. Final Environment Rule

Before every deployment, explicitly verify:
```
Which environment am I deploying?
        ↓
Which database will it use?
        ↓
Which API will it use?
        ↓
Which AI service will it use?
        ↓
Which environment variables are configured?
        ↓
Are any secrets exposed?
```

### Final Rule

> **Development, Preview/QA, and Production must have clearly separated configuration. Never assume that the local environment is identical to production.**
