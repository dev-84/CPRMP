# CPRMP Environment Variables

# -----------------------------------------

# This file contains placeholders only.

# NEVER put real secrets in this file.





# Copy this file to .env for local development

# and replace the placeholder values with real values.





# IMPORTANT:

# .env must NEVER be committed to Git.

# -----------------------------------------

# =========================================

# Application

# =========================================

NODE_ENV=development

PORT=5000

CLIENT_URL=[http://localhost:5173](http://localhost:5173)

# =========================================

# Database — MySQL

# =========================================

DB_HOST=localhost

DB_PORT=3306

DB_NAME=cprmp

DB_USER=your_database_username

DB_PASSWORD=your_database_password

# =========================================

# Authentication — JWT

# =========================================

JWT_SECRET=replace_with_a_long_random_secret

JWT_EXPIRES_IN=1d

# =========================================

# File Uploads

# =========================================

MAX_FILE_SIZE_MB=5

UPLOAD_DIR=uploads

# =========================================

# AI Module

# =========================================

AI_SERVICE_URL=[http://localhost:8000](http://localhost:8000)

# =========================================

# Optional External Services

# =========================================

# Add these only if the project actually

# integrates these services later.





# OPENAI_API_KEY=

# CLOUDINARY_CLOUD_NAME=

# CLOUDINARY_API_KEY=

# CLOUDINARY_API_SECRET=

# =========================================

# Production Notes

# =========================================





# Production secrets must be configured

# through the deployment platform's secure

# environment-variable settings.





# Never commit:

# - Real database passwords

# - JWT secrets

# - API keys

# - Cloud credentials

# - Deployment credentials





# Never expose server-side secrets through

# React/Vite client-side code.
