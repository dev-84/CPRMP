# Campus Placement and Recruitment Management Portal (CPRMP)
# Complete Installation & Setup Guide

Welcome to the **Campus Placement and Recruitment Management Portal (CPRMP)**.

This guide provides end-to-end, beginner-friendly instructions for downloading this project as a ZIP archive from GitHub, configuring the environment, installing dependencies, setting up MongoDB, seeding initial data, and launching both the backend API and frontend user interface on your local workstation.

---

## Table of Contents

1. [Project Overview & Architecture](#1-project-overview--architecture)
2. [Downloading the Project as a ZIP Archive](#2-downloading-the-project-as-a-zip-archive)
3. [System Requirements & Prerequisites](#3-system-requirements--prerequisites)
4. [Project Directory Structure](#4-project-directory-structure)
5. [Backend Environment Configuration](#5-backend-environment-configuration)
6. [MongoDB Database Setup](#6-mongodb-database-setup)
   - [Option A: Local MongoDB Community Server](#option-a-local-mongodb-community-server-recommended-for-offline--local-dev)
   - [Option B: MongoDB Atlas (Cloud Cluster)](#option-b-mongodb-atlas-cloud-database)
7. [Installing Backend Dependencies](#7-installing-backend-dependencies)
8. [Database Seeding & Admin Account Provisioning](#8-database-seeding--admin-account-provisioning)
   - [Method 1: Comprehensive Sample Data Seeding (Recommended)](#method-1-comprehensive-sample-data-seeding-recommended)
   - [Method 2: Interactive Admin Creation CLI (Minimalist)](#method-2-interactive-admin-creation-cli-minimalist)
9. [Installing Frontend Dependencies](#9-installing-frontend-dependencies)
10. [Starting the Application](#10-starting-the-application)
    - [Step 1: Start MongoDB Service](#step-1-start-the-mongodb-service)
    - [Step 2: Start Backend Server](#step-2-start-the-backend-server-terminal-1)
    - [Step 3: Verify Backend Health](#step-3-verify-backend-health)
    - [Step 4: Start Frontend Client](#step-4-start-the-frontend-client-terminal-2)
11. [Accessing Portals & Role-Based Workflows](#11-accessing-portals--role-based-workflows)
    - [Authentication Rules](#authentication-rules)
    - [Student Portal Workflow](#1-student-portal)
    - [Recruiter Portal Workflow](#2-recruiter-portal)
    - [Placement Officer / Admin Portal Workflow](#3-placement-officer--admin-portal)
12. [File Uploads & Document Storage](#12-file-uploads--document-storage)
13. [Assistive AI Resume Matching Architecture](#13-assistive-ai-resume-matching-architecture)
14. [Running Tests & Build Verification](#14-running-tests--build-verification)
15. [Troubleshooting & Frequently Encountered Issues](#15-troubleshooting--frequently-encountered-issues)
16. [Quick Command Reference](#16-quick-command-reference)
17. [Production Deployment Considerations](#17-production-deployment-considerations)
18. [Fresh Setup Verification Checklist](#18-fresh-setup-verification-checklist)

---

## 1. Project Overview & Architecture

CPRMP is a complete institutional recruitment system built on the **MERN** stack (MongoDB, Express.js, React, Node.js) with the following technical boundaries:

- **Frontend:** Single-Page Application (SPA) built with React 19, Vite 8, React Router v7, Lucide Icons, and Tailwind CSS v4.
- **Backend:** Modular Express 5 REST API using Node.js, Mongoose 9, JWT authentication with role authorization middleware, bcryptjs password hashing, and Multer file upload handlers.
- **Database:** MongoDB Community Server (local) or MongoDB Atlas (cloud) storing 11 validated schemas.
- **Self-Contained Engine:** No external third-party paid AI or cloud storage APIs are required. All resume matching, eligibility calculations, and file storage functions run directly within Node.js and MongoDB.

---

## 2. Downloading the Project as a ZIP Archive

If you do not have Git installed or prefer not to use the command line to clone, you can download the entire source code as a ZIP archive:

1. Open your web browser and navigate to the GitHub repository:
   ```text
   https://github.com/dev-84/CPRMP
   ```
2. Locate the green **`< > Code`** button near the upper-right corner of the repository file listing.
3. In the dropdown menu that appears, click **Download ZIP**.
4. Save the file (named `CPRMP-main.zip` or similar) to your local downloads directory.
5. Extract the archive:
   - **Windows:** Right-click the `.zip` file, select **Extract All...**, choose a destination folder (e.g. `C:\Projects\CPRMP` or `D:\CPRMP`), and click **Extract**.
   - **macOS:** Double-click the `.zip` file in Finder.
   - **Linux:** Run `unzip CPRMP-main.zip -d CPRMP`.
6. Launch **Visual Studio Code** (or your preferred IDE).
7. Select **File > Open Folder...** and choose the extracted `CPRMP` folder containing `backend` and `frontend`.
8. Open the integrated terminal in VS Code via **Terminal > New Terminal** (`Ctrl + ` `~` on Windows/Linux or `Cmd + ` `~` on macOS).
9. Verify that your terminal prompt is at the project root directory:
   ```powershell
   # Windows PowerShell
   Get-Location
   ```
   ```bash
   # macOS / Linux
   pwd
   ```

> [!NOTE]
> Downloading a ZIP archive downloads the current project snapshot without Git version history (`.git`). You can still run, modify, test, and develop the application normally.

---

## 3. System Requirements & Prerequisites

Verify that your computer has the following tools installed:

| Software | Minimum Version | Recommended Version | Verification Command | Download Link |
|---|---|---|---|---|
| **Node.js** | `v18.0.0` | `v20.x` or `v24.x` | `node -v` | [nodejs.org](https://nodejs.org/) |
| **npm** | `v9.0.0` | `v10.x` or `v11.x` | `npm -v` | Bundled with Node.js |
| **MongoDB** | `v6.0.0` | `v7.0+` Community Server | `mongod --version` or `mongosh --version` | [mongodb.com](https://www.mongodb.com/try/download/community) |
| **Operating System** | Windows 10/11, macOS 12+, or Ubuntu 20.04+ | 64-bit OS | — | — |
| **Web Browser** | Chrome, Edge, Firefox, or Safari | Modern evergreen browser | — | — |

To verify your Node.js and npm versions, run:

```bash
node -v
npm -v
```

If Node.js is not recognized, download and run the **LTS (Long Term Support)** installer from [nodejs.org](https://nodejs.org/), restart your terminal, and re-run `node -v`.

---

## 4. Project Directory Structure

CPRMP is organized cleanly into decoupled frontend and backend applications:

```text
CPRMP/
├── backend/                        # Node.js + Express REST API
│   ├── .env.example               # Environment variables template
│   ├── jest.config.js             # Backend Jest test configuration
│   ├── package.json               # Backend dependencies and scripts
│   ├── package-lock.json          # Deterministic backend dependency tree
│   ├── scripts/                   # CLI maintenance & seeding utilities
│   │   ├── createAdmin.js         # Interactive CLI to create single admin user
│   │   └── seedAdminData.js       # Populates comprehensive demo dataset
│   ├── src/
│   │   ├── app.js                 # Express application middleware & route mounting
│   │   ├── server.js              # Server entry point & DB bootstrap
│   │   ├── config/
│   │   │   └── db.js              # Mongoose MongoDB connection handler
│   │   ├── controllers/           # HTTP controllers for all domain resources
│   │   │   ├── adminController.js
│   │   │   ├── applicationController.js
│   │   │   ├── authController.js
│   │   │   ├── recruiterController.js
│   │   │   ├── resumeController.js
│   │   │   ├── studentController.js
│   │   │   └── studentProfileController.js
│   │   ├── middleware/            # Security, auth, and upload middleware
│   │   │   ├── authMiddleware.js  # JWT verification with role validation
│   │   │   ├── errorHandler.js    # Global error & 404 response formatters
│   │   │   ├── marksheetUpload.js # Multer handler for PDF/PNG/JPG marksheets
│   │   │   ├── resumeUpload.js    # Multer handler for PDF resumes (5MB limit)
│   │   │   └── roleAuthorization.js # Role guards (student, recruiter, admin)
│   │   ├── models/                # Mongoose database schemas (11 models)
│   │   │   ├── AIMatchResult.js
│   │   │   ├── Application.js
│   │   │   ├── Company.js
│   │   │   ├── EligibilityCriteria.js
│   │   │   ├── PlacementDrive.js
│   │   │   ├── PlacementHistory.js
│   │   │   ├── RecruiterProfile.js
│   │   │   ├── RecruitmentStatus.js
│   │   │   ├── Resume.js
│   │   │   ├── StudentProfile.js
│   │   │   └── User.js
│   │   ├── routes/                # Express API endpoints
│   │   │   ├── adminRoutes.js
│   │   │   ├── applicationRoutes.js
│   │   │   ├── authRoutes.js
│   │   │   ├── recruiterRoutes.js
│   │   │   ├── resumeRoutes.js
│   │   │   └── studentProfileRoutes.js
│   │   ├── services/              # Business logic & domain operations
│   │   │   ├── adminService.js
│   │   │   ├── applicationService.js
│   │   │   ├── authService.js
│   │   │   ├── recruiterService.js
│   │   │   ├── resumeService.js
│   │   │   ├── studentProfileService.js
│   │   │   └── studentService.js
│   │   └── validators/            # Express-validator input constraints
│   │       ├── authValidators.js
│   │       └── studentProfileValidators.js
│   └── uploads/                   # Local file storage for documents
│       ├── marksheets/            # Uploaded student marksheet transcripts
│       └── resumes/               # Uploaded candidate PDF resumes
├── frontend/                      # React + Vite Single Page Application
│   ├── index.html                 # Main HTML root
│   ├── package.json               # Frontend dependencies and scripts
│   ├── package-lock.json          # Deterministic frontend dependency tree
│   ├── vite.config.js             # Vite bundler config with /api proxy
│   ├── public/                    # Static assets
│   └── src/
│       ├── App.jsx                # Application routing tree (36 routes)
│       ├── App.css                # Global styles & design system tokens
│       ├── index.css              # Base resets & font definitions
│       ├── main.jsx               # React DOM root mounting
│       ├── Login.jsx              # Centralized role-aware authentication page
│       ├── Registration.jsx       # Student & Recruiter self-registration
│       ├── api/                   # Authenticated API clients
│       │   ├── adminApi.js
│       │   ├── recruiterApi.js
│       │   └── studentApi.js
│       ├── components/            # Shared presentation & navigation components
│       │   ├── LoadingScreen.jsx
│       │   ├── ProtectedRoute.jsx
│       │   └── ui/
│       │       ├── AppLayout.jsx  # Editorial Minimal institutional shell
│       │       ├── ErrorBoundary.jsx
│       │       └── ResumePreviewModal.jsx
│       ├── context/
│       │   ├── AuthContext.jsx    # Session state & JWT token manager
│       │   └── useAuth.js         # React hook for authentication state
│       └── pages/                 # Role workspaces & views
│           ├── StudentDashboard.jsx
│           ├── ProfileOverview.jsx
│           ├── EditProfile.jsx
│           ├── ResumeManagement.jsx
│           ├── PlacementDrives.jsx
│           ├── DriveDetailsApply.jsx
│           ├── MyApplications.jsx
│           ├── ApplicationTracking.jsx
│           ├── AIResumeMatching.jsx
│           ├── PlacementHistory.jsx
│           ├── admin/             # Placement Director / Officer administration
│           └── recruiter/         # Corporate Recruiter talent suite
├── tests/                         # Automated test suites
│   ├── integration/               # 8 Supertest API integration suites
│   └── unit/                      # 15 Jest unit test suites
├── docs/                          # Comprehensive SRS, Architecture & Workflow specs
├── README.md                      # Project overview
└── SETUP_GUIDE.md                 # This setup guide
```

---

## 5. Backend Environment Configuration

The backend requires a configuration file named `.env` located inside the `backend/` directory.

### Step 5.1: Create `backend/.env` from Template

Copy the provided template file `backend/.env.example`:

**Windows PowerShell:**
```powershell
Copy-Item backend\.env.example backend\.env
```

**macOS / Linux:**
```bash
cp backend/.env.example backend/.env
```

### Step 5.2: Environment Variables Reference

Inspect `backend/.env` in VS Code. The variables are configured as follows:

| Environment Variable | Required? | Default Value | Description & Purpose |
|---|---|---|---|
| `PORT` | Optional | `5000` | Port where the Express HTTP backend server listens. Must match the Vite proxy target in `frontend/vite.config.js`. |
| `MONGODB_URI` | **Required** | `mongodb://127.0.0.1:27017/cprmp` | MongoDB connection URI. Use localhost for local MongoDB Community Server, or your Atlas URI for cloud databases. |
| `JWT_SECRET` | **Required** | `cprmp_development_jwt_secret_key_2026_super_secure` | Secret string used to sign and verify JSON Web Tokens (HS256). In production, set this to a strong 64-character random string. |
| `JWT_EXPIRES_IN` | Optional | `1d` | Token lifespan before expiration (e.g. `1d`, `7d`, `24h`). |
| `NODE_ENV` | Optional | `development` | Runtime mode: `development`, `test`, or `production`. |
| `CLIENT_URL` | Optional | `http://localhost:5173` | The origin URL of the React frontend application for CORS policies. |
| `MAX_RESUME_SIZE_MB` | Optional | `5` | Maximum allowed file upload size for student resumes in megabytes. |

> [!IMPORTANT]
> - Never commit `backend/.env` to GitHub. It is already included in `.gitignore`.
> - The frontend does **not** need a separate `.env` file in local development because Vite's development proxy automatically forwards all `/api/*` network requests to `http://localhost:5000`.

---

## 6. MongoDB Setup

You can use either a **Local MongoDB Community Server** or **MongoDB Atlas** (cloud). Choose **one** of the two options below:

### Option A: Local MongoDB Community Server (Recommended for offline / local dev)

1. **Download & Install:**
   - Download the free **MongoDB Community Server** installer from [MongoDB Download Center](https://www.mongodb.com/try/download/community).
   - Run the installer with default settings and ensure **Install MongoDB as a Service** is checked.
2. **Verify the Service is Running:**
   - **Windows:** Open PowerShell as Administrator and run:
     ```powershell
     Get-Service MongoDB
     ```
     If the status is `Stopped`, start it with:
     ```powershell
     Start-Service MongoDB
     ```
   - **macOS (Homebrew):**
     ```bash
     brew services list
     brew services start mongodb-community
     ```
   - **Linux (systemd):**
     ```bash
     sudo systemctl status mongod
     sudo systemctl start mongod
     ```
3. **Connection String in `backend/.env`:**
   Ensure your `backend/.env` contains:
   ```env
   MONGODB_URI=mongodb://127.0.0.1:27017/cprmp
   ```
   *(MongoDB will automatically create the `cprmp` database collection on first connection).*

---

### Option B: MongoDB Atlas (Cloud Database)

If you prefer a cloud-hosted database without installing MongoDB locally:

1. Sign up for a free account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas).
2. Create a free **M0 Sandbox** cluster in your preferred geographic region (e.g. `AWS / Mumbai` or closest region).
3. Under **Security > Database Access**, click **Add New Database User**:
   - Authentication Method: **Password**
   - Username: `cprmp_user`
   - Password: `<your_secure_password>`
   - Database User Privileges: **Read and write to any database**
4. Under **Security > Network Access**, click **Add IP Address**:
   - Add your current IP address (or select `Allow Access from Anywhere` (`0.0.0.0/0`) during initial local development).
5. Under **Deployments > Database**, click **Connect > Drivers**:
   - Driver: `Node.js`
   - Copy the provided connection string.
6. Replace `<password>` with your database user password and specify the `cprmp` database name:
   ```env
   MONGODB_URI=mongodb+srv://cprmp_user:<your_password>@cluster0.abcde.mongodb.net/cprmp?retryWrites=true&w=majority
   ```
7. Paste this connection string into your `backend/.env` file.

> [!TIP]
> If your password contains special characters (like `@`, `:`, `/`, or `%`), URL-encode them (e.g., replace `@` with `%40`).

---

## 7. Installing Backend Dependencies

1. In your terminal, navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies using `npm install` (or reproducible `npm ci`):
   ```bash
   npm install
   ```
3. Available scripts in `backend/package.json`:
   - `npm run dev`: Starts the backend server with Node.js watch mode (`node --watch src/server.js`).
   - `npm start`: Starts the backend server in standard Node.js mode (`node src/server.js`).
   - `npm test`: Runs the automated Jest test suite across unit and integration specs.

---

## 8. Database Seeding & Admin Account Provisioning

Before logging in, you must initialize user accounts in the database. Choose either **Method 1** (recommended for evaluation) or **Method 2** (minimalist):

### Method 1: Comprehensive Sample Data Seeding (Recommended)

Run the included seeding script to populate an entire campus placement ecosystem, including pre-verified companies, placement drives, recruiters, and students:

From the `backend` folder:
```bash
node scripts/seedAdminData.js
```

**Output confirmation:**
```text
MongoDB connected for seeding admin data...
Created admin: admin@cprmp.edu
Created company: Microsoft IDC
Created company: Goldman Sachs
Created company: Google India
...
Seeding completed successfully!
```

#### Pre-Configured Demo Accounts (All passwords: `Cprmp@2026!`)

| Portal / Role | Email | Password | Details & Context |
|---|---|---|---|
| **Placement Admin** | `admin@cprmp.edu` | `Cprmp@2026!` | Institutional Placement Director (Dr. Rajesh Mehta) |
| **Corporate Recruiter** | `recruiter@microsoft.com` | `Cprmp@2026!` | Microsoft IDC Talent Acquisition Lead (Aditi Rao) |
| **Corporate Recruiter** | `vikram.recruiter@gs.com` | `Cprmp@2026!` | Goldman Sachs Engineering Campus Lead (Vikram Sengupta) |
| **Student (MCA)** | `aryan.sharma@cprmp.edu` | `Cprmp@2026!` | MCA, CGPA: 8.84, Roll: `MCA2024-042`, PRN: `PRN202409842` |
| **Student (B.Tech)** | `pooja.reddy@cprmp.edu` | `Cprmp@2026!` | B.Tech CSE, CGPA: 9.12, Roll: `BTECH-CS-102` |

---

### Method 2: Interactive Admin Creation CLI (Minimalist)

If you only want to create a clean administrator account without any sample students, companies, or placement drives:

From the `backend` folder:
```bash
node scripts/createAdmin.js
```

The CLI will interactively prompt you:
```text
MongoDB connected successfully.
Admin name: Prof. Sarah Jenkins
Admin email: admin@college.edu
Admin password (hidden): [enter at least 12 characters]
Confirm admin password: [re-enter password]
Admin account created successfully for admin@college.edu.
```

---

## 9. Installing Frontend Dependencies

1. Open a new terminal window or navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Available scripts in `frontend/package.json`:
   - `npm run dev`: Starts the Vite local development server on `http://localhost:5173`.
   - `npm run build`: Compiles production assets into `frontend/dist/`.
   - `npm run lint`: Runs ESLint to check syntax and code conventions.
   - `npm run preview`: Previews the production build locally.

---

## 10. Starting the Application

To run CPRMP, keep **two terminal windows** open simultaneously: one for the backend server and one for the frontend client.

### Step 1: Start the MongoDB Service

Ensure your MongoDB Community Server service is active (see [Section 6](#6-mongodb-setup)).

### Step 2: Start the Backend Server (Terminal 1)

```bash
cd backend
npm run dev
```

**Expected terminal output:**
```text
> backend@1.0.0 dev
> node --watch src/server.js

MongoDB connected successfully
CPRMP backend running on port 5000
```

### Step 3: Verify Backend Health

Open your browser or run curl to test the health endpoint:
```text
http://localhost:5000/api/health
```

**Expected JSON response:**
```json
{
  "status": "ok",
  "message": "CPRMP backend is running"
}
```

### Step 4: Start the Frontend Client (Terminal 2)

Open a second terminal window at the project root:
```bash
cd frontend
npm run dev
```

**Expected terminal output:**
```text
  VITE v8.3.0  ready in 280 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

Open your browser and navigate to:
```text
http://localhost:5173
```

*(Note: If port `5173` is occupied by another application, Vite will automatically select `http://localhost:5174` or `http://localhost:5175`).*

---

## 11. Accessing Portals & Role-Based Workflows

### Authentication Rules

- **Login Route:** Navigate to `http://localhost:5173/login`.
- **Public Registration:** Navigate to `http://localhost:5173/register`.
  - Anyone can register as a **Student** or **Recruiter**.
  - **Admin accounts cannot be registered publicly** through the web interface. Admin accounts must be created using the CLI seed scripts (`node scripts/seedAdminData.js` or `node scripts/createAdmin.js`).
- After logging in, the portal automatically routes you to your authorized workspace based on your role.

---

### 1. Student Portal

- **Login with:** `aryan.sharma@cprmp.edu` (Password: `Cprmp@2026!`) or create a new student account at `/register`.
- **Key Navigation Routes:**
  - **Dashboard (`/student`):** Active placement cycle status, quick stats, applications overview, and institutional notices.
  - **Profile Overview (`/student/profile`):** Verified academic ladder (10th, 12th, UG, PG), contact information, and audit markers.
  - **Edit Dossier (`/student/edit-profile`):** Update personal details, academic scores, skills taxonomy, projects portfolio, and certifications.
  - **Resume Management (`/student/resume`):** Upload your official PDF resume (up to 5 MB), set active resume, and preview inline.
  - **Placement Drives (`/student/drives`):** Browse active campus drives, view real-time eligibility criteria pass/fail evaluations, and apply with 1-click.
  - **My Applications (`/student/applications`):** Monitor recruitment progress across 5 stages (Application Submitted → Screening → Technical Assessment → Interviews → Final Offer).
  - **AI Resume Matching (`/student/ai-matching`):** Real-time compatibility score against published jobs with targeted skill-gap recommendations.
  - **Placement History (`/student/placement-history`):** Official institutional archive of verified offers and cycle records.

---

### 2. Recruiter Portal

- **Login with:** `recruiter@microsoft.com` (Password: `Cprmp@2026!`) or create a recruiter account at `/register`.
- **Key Navigation Routes:**
  - **Recruiter Dashboard (`/recruiter`):** Active drives summary, total applicants, shortlisted pipeline, and upcoming interview schedules.
  - **Company Profile (`/recruiter/company`):** Manage corporate profile, headquarters, industry, branding, and placement point of contact.
  - **Placement Drives (`/recruiter/drives`):** List all drives created by your organization.
  - **Create Placement Drive (`/recruiter/drives/create`):** Publish new job openings with deterministic eligibility criteria (minimum CGPA, allowed degrees, graduation years, maximum active backlogs, required skills, package CTC, deadlines).
  - **Applicant Review (`/recruiter/applicants`):** Review candidate profiles, download or view resumes, and inspect academic qualifications.
  - **Shortlisting Workspace (`/recruiter/shortlisting`):** Advance candidates through recruitment stages (`under_review`, `shortlisted`, `interview`, `selected`, `rejected`).
  - **Recruitment Status & Pipeline (`/recruiter/recruitment-status`):** Real-time conversion funnel and selection outcomes.

---

### 3. Placement Officer / Admin Portal

- **Login with:** `admin@cprmp.edu` (Password: `Cprmp@2026!`).
- **Key Navigation Routes:**
  - **Admin Dashboard (`/admin`):** Institutional metrics across participating companies, total registered students, verified resumes, active drives, and overall placement conversion percentage.
  - **Student Records Management (`/admin/student`):** View all candidates, filter by degree/department, verify academic dossiers, and update placement eligibility flags.
  - **Corporate Recruiter Approvals (`/admin/recruiters`):** Approve pending corporate recruiter registrations and manage institutional company affiliations.
  - **Placement Drive Audit (`/admin/drive`):** Audit published company placement drives, update compliance flags, and manage application cutoff windows.

---

## 12. File Uploads & Document Storage

CPRMP implements robust local disk storage for student documentation:

- **Storage Location:** Files are stored under `backend/uploads/`:
  - Resumes: `backend/uploads/resumes/`
  - Marksheets: `backend/uploads/marksheets/`
- **Automatic Directory Creation:** The Multer middleware in `backend/src/middleware/resumeUpload.js` and `marksheetUpload.js` automatically creates these folders recursively on server startup if they do not exist.
- **Security & Content Integrity:**
  - Uploaded files are renamed using cryptographically secure random hexadecimal names (e.g. `resume-1792714013108-26a6d23d0626e4fd38c94c365bbde8e1.pdf`) to prevent path traversal or file overwrites.
  - Resumes are strictly limited to `.pdf` format with a 5 MB ceiling (`MAX_RESUME_SIZE_MB`).
  - Marksheets accept `.pdf`, `.png`, `.jpg`, and `.jpeg` (up to 5 MB).
- **Inline Secure Preview:** Files are served through authenticated streaming endpoints (`/api/student/resume/preview` and `/api/student/profile/marksheet/:qualId`) requiring valid JWT Bearer tokens and role authorization.
- **Persistence:** Local files remain preserved across server reboots. When backing up the database, also back up the `backend/uploads/` directory.

---

## 13. Assistive AI Resume Matching Architecture

The **AI Resume Matching Engine** (`/student/ai-matching`) assists candidates in discovering suitable placement opportunities without relying on any external paid services:

- **Local Evaluation:** The matching algorithm is implemented in Node.js (`backend/src/services/studentService.js`). It executes locally without external API latency or subscription fees.
- **Deterministic Multi-Factor Scoring (0–100%):**
  1. **Skills Alignment (65% weight):** Performs normalized case-insensitive keyword intersection between the student's claimed skills/projects and the drive's required technical taxonomy.
  2. **Academic Merit (20% weight):** Assesses whether the candidate meets or exceeds the minimum drive CGPA benchmark.
  3. **Degree Fit (15% weight):** Verifies degree compatibility (e.g., MCA, B.Tech, M.Tech).
- **Dynamic Skill-Gap Recommendations:** Analyzes unmatched job requirements and generates prioritized suggestions (e.g. *"Strengthen competencies in: Cloud Computing, Kubernetes"*).

---

## 14. Running Tests & Build Verification

The CPRMP codebase includes comprehensive automated tests covering unit functions and integration workflows:

### Run Backend Test Suite

From the `backend` folder:
```bash
npm test
```

**Expected results:**
```text
Test Suites: 23 passed, 23 total
Tests:       178 passed, 178 total
Snapshots:   0 total
Time:        ~22-24 s
Ran all test suites.
```

### Run Frontend Production Build

From the `frontend` folder:
```bash
npm run build
```

**Expected results:**
```text
✓ built in ~3.4s
dist/index.html                   0.88 kB
dist/assets/index-Cf1JNEgQ.css  181.65 kB
dist/assets/index-CB2_6Xoz.js   700.97 kB
```

---

## 15. Troubleshooting & Frequently Encountered Issues

### 1. `node: command not found` or `npm: command not found`
- **Cause:** Node.js is not installed or not added to your system's `PATH`.
- **Solution:** Re-download and install Node.js (LTS version) from [nodejs.org](https://nodejs.org/). Restart VS Code and your terminal.

### 2. Backend fails: `MONGODB_URI is not configured`
- **Cause:** You have not created `backend/.env` or the file is empty.
- **Solution:** Copy `backend/.env.example` to `backend/.env`:
  ```powershell
  # PowerShell
  Copy-Item backend\.env.example backend\.env
  ```
  ```bash
  # Bash
  cp backend/.env.example backend/.env
  ```

### 3. Backend fails: `ECONNREFUSED 127.0.0.1:27017`
- **Cause:** The local MongoDB Community Server is not running.
- **Solution:**
  - **Windows:** Run `Start-Service MongoDB` in an administrative PowerShell prompt.
  - **macOS:** Run `brew services start mongodb-community`.
  - **Linux:** Run `sudo systemctl start mongod`.

### 4. Port `5000` is already in use
- **Cause:** A previous instance of Node.js or another process is running on port 5000.
- **Solution:**
  - **Windows:** Find and kill the process:
    ```powershell
    Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force
    ```
  - **macOS / Linux:**
    ```bash
    kill -9 $(lsof -t -i:5000)
    ```

### 5. Frontend shows network error or cannot reach `/api`
- **Cause:** The backend server is not running on port `5000`.
- **Solution:** Make sure Terminal 1 shows `CPRMP backend running on port 5000`. Test `http://localhost:5000/api/health` in your browser.

### 6. Edit Profile shows: `"Request contains unsupported profile fields"`
- **Cause:** The request body included non-whitelisted fields.
- **Solution:** This was resolved in the latest codebase update. Ensure you have the latest files where `allowedProfileFields` whitelists all permitted student attributes.

### 7. Resume upload fails with HTTP 413 or 415
- **Cause:** The file is larger than 5 MB or is not in `.pdf` format.
- **Solution:** Upload a PDF file smaller than 5 MB. If needed, increase `MAX_RESUME_SIZE_MB=10` in `backend/.env`.

---

## 16. Quick Command Reference

All commands listed below are verified against the repository's actual configuration:

| Action | Working Directory | Windows PowerShell | macOS / Linux |
|---|---|---|---|
| **Copy Env Template** | `CPRMP` (Root) | `Copy-Item backend\.env.example backend\.env` | `cp backend/.env.example backend/.env` |
| **Install Backend Deps** | `backend/` | `npm install` | `npm install` |
| **Install Frontend Deps** | `frontend/` | `npm install` | `npm install` |
| **Seed Full Demo Data** | `backend/` | `node scripts/seedAdminData.js` | `node scripts/seedAdminData.js` |
| **Create Clean Admin** | `backend/` | `node scripts/createAdmin.js` | `node scripts/createAdmin.js` |
| **Start Backend API** | `backend/` | `npm run dev` | `npm run dev` |
| **Start Frontend UI** | `frontend/` | `npm run dev` | `npm run dev` |
| **Run Backend Tests** | `backend/` | `npm test` | `npm test` |
| **Build Frontend** | `frontend/` | `npm run build` | `npm run build` |

---

## 17. Production Deployment Considerations

The configuration described in this guide is designed for local development and academic evaluation. For production deployment:

1. **Environment Secrets:** Replace `JWT_SECRET` with a strong cryptographic key generated using `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.
2. **MongoDB Security:** Use a production MongoDB Atlas replica set with TLS/SSL, dedicated user credentials, and restricted IP access.
3. **HTTPS & Domain Routing:** Deploy behind a reverse proxy (e.g. Nginx, Cloudflare, or AWS ALB) enforcing HTTPS.
4. **CORS Restrictions:** Set `CLIENT_URL` in `backend/.env` to your production frontend domain (e.g. `https://cprmp.yourcollege.edu`).
5. **Persistent Document Storage:** For multi-instance horizontal scaling, replace local filesystem storage with S3-compatible object storage (e.g., AWS S3, Cloudflare R2, MinIO).
6. **Production Build:** Build the frontend with `npm run build` and serve the resulting `dist/` directory via Nginx or a CDN.

---

## 18. Fresh Setup Verification Checklist

Use this checklist to confirm that your local environment is completely configured:

- [ ] Project ZIP downloaded from GitHub and extracted to a local directory.
- [ ] Node.js (`v18+`) and npm (`v9+`) installed and verified (`node -v`, `npm -v`).
- [ ] MongoDB Community Server running locally or MongoDB Atlas cluster connected.
- [ ] `backend/.env` created from `backend/.env.example`.
- [ ] `npm install` executed successfully in `backend/`.
- [ ] `npm install` executed successfully in `frontend/`.
- [ ] Database seeded with demo records (`node scripts/seedAdminData.js`) or admin created (`node scripts/createAdmin.js`).
- [ ] Backend server running in Terminal 1 (`http://localhost:5000/api/health` returns `status: "ok"`).
- [ ] Frontend client running in Terminal 2 (`http://localhost:5173`).
- [ ] Logged in as Student (`aryan.sharma@cprmp.edu` / `Cprmp@2026!`) and verified Dashboard & Profile.
- [ ] Logged in as Recruiter (`recruiter@microsoft.com` / `Cprmp@2026!`) and verified Company & Drives.
- [ ] Logged in as Admin (`admin@cprmp.edu` / `Cprmp@2026!`) and verified Admin Dashboard & Metrics.
- [ ] Verified resume upload and preview functionality in Resume Management (`/student/resume`).
- [ ] Executed backend tests (`npm test` in `backend/`) — all 23 suites passing.
