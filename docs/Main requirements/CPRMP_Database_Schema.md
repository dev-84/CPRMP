# CPRMP Database Schema

## 1. Purpose

This document defines the initial database schema for the Campus Placement and Recruitment Management Portal (CPRMP).

**Database:** MongoDB Community Server
**ODM:** Mongoose
**Database access:** Backend only
**Status:** Initial design for TASK-009

This document defines the data structures and relationships. Mongoose model implementation belongs to TASK-010, while references, validation, and indexes will be finalized in TASK-011.

## 2. Design Principles

- Use MongoDB collections with Mongoose schemas.
- Use MongoDB `ObjectId` values for document identifiers and references.
- Keep authentication credentials in the `User` collection.
- Keep role-specific student and recruiter information in separate profile collections.
- Store resume metadata and file references in MongoDB; store actual resume files in backend-controlled file storage.
- Keep eligibility decisions deterministic and independent of AI recommendations.
- Store application and recruitment status changes so the official recruitment process can be tracked.
- Store AI match results separately from official eligibility, application, and selection decisions.
- Use timestamps for records that need creation and update tracking.
- Never store passwords in plaintext.

## 3. Common Conventions

Unless an entity specifies otherwise:

- `_id`: MongoDB-generated `ObjectId`.
- `createdAt`: creation timestamp.
- `updatedAt`: last-update timestamp.
- References: `ObjectId` values referencing the relevant collection.
- Required fields, enum values, uniqueness, and indexes will be enforced in the Mongoose implementation and reviewed in TASK-011.

Sensitive values, including password hashes and private file references, must not be exposed through public API responses.

## 4. Entity Schemas

### 4.1 User

**Collection:** `users`

Purpose: Stores login identity, authentication data, and account-level roles.

| Field | Type | Rules / Description |
|---|---|---|
| `_id` | ObjectId | Primary identifier |
| `name` | String | Required; user's display name |
| `email` | String | Required; normalized and unique |
| `passwordHash` | String | Required; hash only, never plaintext |
| `role` | String | Required; `student`, `recruiter`, or `admin` |
| `isActive` | Boolean | Required; defaults to true |
| `lastLoginAt` | Date | Optional |
| `createdAt` | Date | Creation timestamp |
| `updatedAt` | Date | Last-update timestamp |

Relationships:
- One student `User` can have one `StudentProfile`.
- One recruiter `User` can have one `RecruiterProfile`.
- An admin account does not require either profile.

### 4.2 StudentProfile

**Collection:** `studentprofiles`

Purpose: Stores student academic, contact, and placement-related profile information.

| Field | Type | Rules / Description |
|---|---|---|
| `_id` | ObjectId | Primary identifier |
| `userId` | ObjectId | Required; reference to `User`; unique |
| `studentId` | String | Required; institutional student identifier |
| `phone` | String | Optional contact number |
| `department` | String | Required academic department |
| `degree` | String | Required degree or program |
| `graduationYear` | Number | Required expected or actual graduation year |
| `currentSemester` | Number | Optional semester |
| `cgpa` | Number | Optional cumulative grade-point average |
| `backlogCount` | Number | Optional; non-negative |
| `skills` | Array of String | Optional student-declared skills |
| `createdAt` | Date | Creation timestamp |
| `updatedAt` | Date | Last-update timestamp |

Relationships:
- References one `User`.
- Can have multiple `Resume` records.
- Can submit multiple `Application` records.

### 4.3 Resume

**Collection:** `resumes`

Purpose: Stores resume metadata and references to files held outside MongoDB.

| Field | Type | Rules / Description |
|---|---|---|
| `_id` | ObjectId | Primary identifier |
| `studentProfileId` | ObjectId | Required; reference to `StudentProfile` |
| `originalFilename` | String | Required original filename |
| `storageKey` | String | Required private storage reference |
| `mimeType` | String | Required validated content type |
| `sizeBytes` | Number | Required positive file size |
| `checksum` | String | Optional integrity-check value |
| `isActive` | Boolean | Required; indicates whether the resume is active |
| `uploadedAt` | Date | Upload timestamp |
| `createdAt` | Date | Creation timestamp |
| `updatedAt` | Date | Last-update timestamp |

Relationships:
- Each resume belongs to one `StudentProfile`.
- A resume can be associated with multiple AI matching results.

Security:
- Actual file bytes must not be stored directly in this document.
- Private storage references must not grant unauthorized access.
- Upload type, size, access, and retrieval must be validated by the backend.

### 4.4 RecruiterProfile

**Collection:** `recruiterprofiles`

Purpose: Stores recruiter identity and company association.

| Field | Type | Rules / Description |
|---|---|---|
| `_id` | ObjectId | Primary identifier |
| `userId` | ObjectId | Required; reference to `User`; unique |
| `companyId` | ObjectId | Reference to `Company`; may be absent during onboarding |
| `jobTitle` | String | Optional recruiter job title |
| `phone` | String | Optional contact number |
| `isVerified` | Boolean | Required; defaults to false |
| `createdAt` | Date | Creation timestamp |
| `updatedAt` | Date | Last-update timestamp |

Relationships:
- References one `User`.
- May be associated with one `Company`.
- Can manage placement drives only through authorized backend operations.

### 4.5 Company

**Collection:** `companies`

Purpose: Stores employer and organization information.

| Field | Type | Rules / Description |
|---|---|---|
| `_id` | ObjectId | Primary identifier |
| `name` | String | Required company name |
| `website` | String | Optional company website |
| `industry` | String | Optional industry |
| `description` | String | Optional company description |
| `headquarters` | String | Optional location |
| `contactEmail` | String | Optional official contact email |
| `status` | String | Required; proposed values: `pending`, `approved`, `rejected`, `inactive` |
| `createdBy` | ObjectId | Reference to the creating recruiter or admin `User` |
| `createdAt` | Date | Creation timestamp |
| `updatedAt` | Date | Last-update timestamp |

Relationships:
- Can have multiple `RecruiterProfile` records.
- Can own multiple `PlacementDrive` records.

### 4.6 PlacementDrive

**Collection:** `placementdrives`

Purpose: Stores employer recruitment opportunities and their schedules.

| Field | Type | Rules / Description |
|---|---|---|
| `_id` | ObjectId | Primary identifier |
| `companyId` | ObjectId | Required; reference to `Company` |
| `createdBy` | ObjectId | Required; reference to recruiter `User` |
| `title` | String | Required drive or job title |
| `description` | String | Required opportunity description |
| `jobType` | String | Optional employment type |
| `location` | String | Optional job location |
| `salary` | Object | Optional compensation details; structure to be finalized |
| `applicationDeadline` | Date | Required application deadline |
| `driveDate` | Date | Optional recruitment date |
| `status` | String | Required; proposed values: `draft`, `published`, `closed`, `cancelled` |
| `createdAt` | Date | Creation timestamp |
| `updatedAt` | Date | Last-update timestamp |

Relationships:
- Belongs to one `Company`.
- Is created by one recruiter `User`.
- Has one associated `EligibilityCriteria` record in the initial design.
- Can receive multiple `Application` records.
- Can be associated with multiple `AIMatchResult` records.

### 4.7 EligibilityCriteria

**Collection:** `eligibilitycriteria`

Purpose: Stores deterministic requirements used to determine whether a student qualifies for a placement drive.

| Field | Type | Rules / Description |
|---|---|---|
| `_id` | ObjectId | Primary identifier |
| `placementDriveId` | ObjectId | Required; reference to `PlacementDrive`; unique in the initial design |
| `minimumCgpa` | Number | Optional minimum CGPA |
| `allowedDepartments` | Array of String | Optional allowed departments |
| `allowedDegrees` | Array of String | Optional allowed degrees |
| `graduationYears` | Array of Number | Optional eligible graduation years |
| `maximumBacklogs` | Number | Optional non-negative maximum |
| `requiredSkills` | Array of String | Optional skill requirements |
| `additionalRules` | Array of Object | Optional explicitly defined future criteria; structure requires review before implementation |
| `createdAt` | Date | Creation timestamp |
| `updatedAt` | Date | Last-update timestamp |

Relationships:
- One-to-one with `PlacementDrive` in the initial design.

Rules:
- Eligibility must be calculated by deterministic backend logic.
- Missing or incomplete criteria must not silently be interpreted as a pass.
- AI match scores must not override official eligibility decisions.

### 4.8 Application

**Collection:** `applications`

Purpose: Records a student's application to a placement drive.

| Field | Type | Rules / Description |
|---|---|---|
| `_id` | ObjectId | Primary identifier |
| `studentProfileId` | ObjectId | Required; reference to `StudentProfile` |
| `placementDriveId` | ObjectId | Required; reference to `PlacementDrive` |
| `resumeId` | ObjectId | Optional reference to the resume used |
| `appliedAt` | Date | Application submission timestamp |
| `status` | String | Required; proposed values: `submitted`, `under_review`, `shortlisted`, `rejected`, `selected`, `withdrawn` |
| `eligibilityStatus` | String | Proposed values: `eligible`, `ineligible`, `pending_review` |
| `eligibilityCheckedAt` | Date | Optional eligibility evaluation timestamp |
| `createdAt` | Date | Creation timestamp |
| `updatedAt` | Date | Last-update timestamp |

Relationships:
- Each application references one student, one placement drive, and optionally one resume.
- An application can have multiple `RecruitmentStatus` history records.
- A successful selection can be associated with one `PlacementHistory` record.

Constraints to enforce:
- A student must not have duplicate applications for the same placement drive.
- The backend must verify eligibility and drive status before accepting an application.
- Clients must not be allowed to set their own eligibility or selection outcome.

### 4.9 RecruitmentStatus

**Collection:** `recruitmentstatuses`

Purpose: Records the history of recruitment status changes for an application.

| Field | Type | Rules / Description |
|---|---|---|
| `_id` | ObjectId | Primary identifier |
| `applicationId` | ObjectId | Required; reference to `Application` |
| `status` | String | Required recruitment stage |
| `changedBy` | ObjectId | Reference to the acting `User` |
| `note` | String | Optional explanation |
| `changedAt` | Date | Timestamp of the status change |
| `createdAt` | Date | Creation timestamp |
| `updatedAt` | Date | Last-update timestamp |

Relationships:
- Each record belongs to one application.
- One application can have multiple status history records.

Rule:
- Status history is separate from the application's current status and should be written by authorized backend workflows.

### 4.10 PlacementHistory

**Collection:** `placementhistories`

Purpose: Records confirmed student placement outcomes.

| Field | Type | Rules / Description |
|---|---|---|
| `_id` | ObjectId | Primary identifier |
| `studentProfileId` | ObjectId | Required; reference to `StudentProfile` |
| `applicationId` | ObjectId | Required; reference to `Application`; unique in the initial design |
| `companyId` | ObjectId | Required; reference to `Company` |
| `placementDriveId` | ObjectId | Required; reference to `PlacementDrive` |
| `jobTitle` | String | Optional role title at placement |
| `packageAmount` | Number | Optional compensation amount |
| `packageCurrency` | String | Optional currency code |
| `placedAt` | Date | Placement confirmation date |
| `createdAt` | Date | Creation timestamp |
| `updatedAt` | Date | Last-update timestamp |

Relationships:
- Each record refers to one student, one application, one company, and one placement drive.
- The initial design permits at most one placement-history record per application.

Rule:
- Create placement history only after an authorized official selection/placement workflow confirms the outcome.

### 4.11 AIMatchResult

**Collection:** `aimatchresults`

Purpose: Stores assistive resume-to-job matching output independently from official recruitment decisions.

| Field | Type | Rules / Description |
|---|---|---|
| `_id` | ObjectId | Primary identifier |
| `resumeId` | ObjectId | Required; reference to `Resume` |
| `placementDriveId` | ObjectId | Required; reference to `PlacementDrive` |
| `score` | Number | Optional numeric match score within the chosen scoring range |
| `matchedSkills` | Array of String | Optional identified matching skills |
| `missingSkills` | Array of String | Optional identified skill gaps |
| `modelVersion` | String | Optional AI model version |
| `generatedAt` | Date | Result generation timestamp |
| `createdAt` | Date | Creation timestamp |
| `updatedAt` | Date | Last-update timestamp |

Relationships:
- Each result references one resume and one placement drive.
- A resume or drive may have multiple match results over time.

Rules:
- AI results are recommendations, not official eligibility or selection decisions.
- Store enough model-version information to help interpret historical results.
- Access must be restricted to authorized users.

## 5. Relationship Summary

| Relationship | Cardinality |
|---|---|
| User → StudentProfile | One-to-zero-or-one |
| User → RecruiterProfile | One-to-zero-or-one |
| StudentProfile → Resume | One-to-many |
| StudentProfile → Application | One-to-many |
| Company → RecruiterProfile | One-to-many |
| Company → PlacementDrive | One-to-many |
| PlacementDrive → EligibilityCriteria | One-to-one in initial design |
| PlacementDrive → Application | One-to-many |
| Application → RecruitmentStatus | One-to-many |
| Application → PlacementHistory | One-to-zero-or-one |
| Resume → AIMatchResult | One-to-many |
| PlacementDrive → AIMatchResult | One-to-many |

## 6. Initial Index and Constraint Plan

The following indexes and constraints are proposed for implementation and verification in TASK-011:

- Unique index on normalized `User.email`.
- Unique index on `StudentProfile.userId`.
- Unique index on `StudentProfile.studentId`.
- Unique index on `RecruiterProfile.userId`.
- Unique index on `EligibilityCriteria.placementDriveId`.
- Compound unique index on `Application.studentProfileId` and `Application.placementDriveId`.
- Unique index on `PlacementHistory.applicationId`.
- Query indexes on frequently filtered references such as `Resume.studentProfileId`, `PlacementDrive.companyId`, `Application.placementDriveId`, `Application.studentProfileId`, and `RecruitmentStatus.applicationId`.
- Appropriate validation for enum fields, numeric ranges, required references, and date fields.

Uniqueness and reference existence must be enforced in the database layer where possible and in backend business logic where necessary. MongoDB references do not automatically enforce foreign-key integrity.

## 7. Decisions Requiring Confirmation Before or During Implementation

1. Confirm institutional identifiers and whether student IDs are globally unique.
2. Finalize CGPA scale and validation range.
3. Finalize salary and compensation structures.
4. Define the allowed recruitment status transitions.
5. Define additional eligibility rule structure without allowing arbitrary executable rules.
6. Define AI score scale and whether old match results are retained.
7. Define resume retention and deletion behavior.
8. Decide how recruiter verification and company approval are authorized.
9. Confirm whether eligibility criteria may be versioned after a drive is published.

These details must be resolved against the product requirements before implementing any dependent behavior.

## 8. Scope Boundary

TASK-009 defines the initial schema and relationships only.

- TASK-010: implement the Mongoose models and collections.
- TASK-011: finalize Mongoose references, validation, indexes, and related tests.
- Authentication, eligibility calculations, application workflows, and AI matching behavior remain implementation tasks and must not be treated as completed by this document.

## 9. Completion Checklist

- [ ] All 11 required entities are documented.
- [ ] Entity fields and reference relationships are defined.
- [ ] Resume storage and AI decision boundaries are documented.
- [ ] Proposed indexes and constraints are listed.
- [ ] Open design decisions are identified.
- [ ] Schema is reviewed against the PRD and architecture documentation.
- [ ] TASK-009 changes are reviewed, committed, and pushed.
