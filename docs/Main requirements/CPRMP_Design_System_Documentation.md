# Design System Documentation

## 1. Project

**Campus Placement and Recruitment Management Portal (CPRMP)**

**Design Style:** Modern / Minimal / Professional

**Design Goal:** Create a clean, consistent, responsive, and easy-to-use interface for Students, Admin/Placement Officers, and Recruiters.

---

# 2. Design Principles

The CPRMP interface should follow these principles:

1. **Simple** — Avoid unnecessary visual complexity.
2. **Professional** — Suitable for an academic placement-management system.
3. **Consistent** — The same visual language should be used throughout the application.
4. **Responsive** — Work properly on desktop, tablet, and mobile screens.
5. **Accessible** — Forms, buttons, text, and navigation should be easy to understand and use.
6. **Information-focused** — Placement information, eligibility, application status, and recruitment status should be easy to find.

---

# 3. Color System

### Primary Colors

| Purpose | Color | Hex |
|---|---|---|
| **Primary** | Indigo | `#6366F1` |
| **Primary Hover** | Dark Indigo | `#4F46E5` |
| **Background** | Slate 50 | `#F8FAFC` |
| **Surface / Card** | White | `#FFFFFF` |
| **Text** | Slate 900 | `#0F172A` |
| **Muted Text** | Slate 500 | `#64748B` |
| **Border** | Slate 200 | `#E2E8F0` |
| **Success** | Green | `#16A34A` |
| **Warning** | Amber | `#D97706` |
| **Error / Destructive** | Red | `#DC2626` |
| **Info** | Blue | `#2563EB` |

### Color Usage

```text
Primary      → Main actions, links, active navigation
Background   → Application background
Surface      → Cards, panels, forms
Text         → Main headings and important information
Muted        → Secondary information
Success      → Selected / successful / completed status
Warning      → Pending / warning status
Error        → Failed / rejected / destructive actions
Info         → Informational messages
```

Do not use colors randomly. Every color should have a defined purpose.

---

# 4. Typography

**Primary Font:** Inter

Typography hierarchy:

| Element | Weight | Suggested Size |
|---|---:|---:|
| Page Title | 700 | 28–32px |
| Section Heading | 600 | 20–24px |
| Card Heading | 600 | 16–18px |
| Body Text | 400 | 14–16px |
| Secondary Text | 400 | 13–14px |
| Button Text | 500–600 | 14–16px |
| Form Label | 500 | 14px |
| Table Text | 400 | 14px |

### Typography Rules

- Use **Inter** consistently.
- Avoid using multiple font families.
- Maintain clear heading hierarchy.
- Do not use excessively large text inside dashboards.
- Maintain readable line spacing.

---

# 5. Spacing System

Use a consistent spacing scale based on multiples of 4px.

```text
4px   → Very small spacing
8px   → Small spacing
12px  → Compact spacing
16px  → Standard spacing
20px  → Medium spacing
24px  → Section/card spacing
32px  → Large spacing
48px  → Major section spacing
```

Avoid arbitrary spacing values unless required by a specific component.

---

# 6. Border Radius

Use consistent rounded corners throughout the application.

| Component | Border Radius |
|---|---:|
| Cards | 12px |
| Buttons | 8px |
| Input Fields | 8px |
| Dropdowns | 8px |
| Modals | 12px |
| Badges | 9999px |
| Images | 8–12px |

**Default Card Radius:** `12px`

---

# 7. Cards

Cards are used for:

- Placement drives
- Student information
- Company information
- Application summaries
- Dashboard statistics
- AI matching results

### Card Style

```text
Background: #FFFFFF
Border: 1px #E2E8F0
Border Radius: 12px
Shadow: Subtle
Padding: 20–24px
```

Cards should have consistent:

- Padding
- Border radius
- Border
- Heading style
- Spacing

Avoid excessive shadows.

---

# 8. Buttons

The system should have three main button types.

### Primary Button

Used for the main action.

Examples:

```text
Apply Now
Save Changes
Create Drive
Upload Resume
Shortlist
```

Style:

```text
Background: #6366F1
Text: White
Radius: 8px
```

### Secondary Button

Used for supporting actions.

Examples:

```text
Cancel
View Details
Edit
Back
```

Style:

```text
Background: White
Border: #E2E8F0
Text: #0F172A
Radius: 8px
```

### Destructive Button

Used for actions that may remove or reject information.

Examples:

```text
Delete
Remove
Reject
Deactivate
```

Style:

```text
Background: #DC2626
Text: White
Radius: 8px
```

### Button Rules

- Buttons must have clear labels.
- Use icons only when their meaning is obvious.
- Avoid multiple competing primary buttons in the same section.
- Show disabled state when an action is unavailable.
- Show loading state during API operations.

---

# 9. Form Design

Forms are important for:

- Student registration
- Student profile
- Resume upload
- Company registration
- Placement drive creation
- Eligibility criteria
- Recruiter information

### Form Rules

- Every input should have a visible label.
- Use helpful placeholders where appropriate.
- Required fields should be clearly indicated.
- Display validation errors near the relevant field.
- Do not rely only on placeholder text as a label.
- Use consistent input heights and spacing.
- Provide clear Save/Cancel actions.

Example:

```text
Student Name *
┌────────────────────────────────────┐
│ Enter your full name               │
└────────────────────────────────────┘

College Email *
┌────────────────────────────────────┐
│ student@example.com                │
└────────────────────────────────────┘

                         [Cancel] [Save]
```

---

# 10. Navigation

The application uses role-specific dashboards.

### Student Navigation

```text
Dashboard
Profile
Resume
Placement Drives
My Applications
AI Resume Matching
Placement History
Logout
```

### Admin Navigation

```text
Dashboard
Students
Recruiters
Companies
Placement Drives
Applications
Shortlisting
Placements
Reports
Logout
```

### Recruiter Navigation

```text
Dashboard
Company Profile
Placement Drives
Applicants
Shortlisting
Recruitment Status
Logout
```

Navigation should clearly indicate the **currently active page**.

---

# 11. Dashboard Design

Each role should have a dashboard containing relevant information.

### Student Dashboard

Example:

```text
┌─────────────────────────────────────────────┐
│ Welcome, Student                            │
│                                             │
│ ┌──────────┐ ┌──────────┐ ┌─────────────┐  │
│ │ Drives   │ │ Applied  │ │ Selected    │  │
│ │    12    │ │    5     │ │      1      │  │
│ └──────────┘ └──────────┘ └─────────────┘  │
│                                             │
│ Recommended Placement Drives                │
│ ┌─────────────────────────────────────────┐ │
│ │ Company Name       Software Developer   │ │
│ │ Eligibility: Eligible       [View]      │ │
│ └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

Dashboard statistics should use consistent card designs.

---

# 12. Status Design

Placement systems contain many statuses.

Use consistent status badges.

| Status | Meaning |
|---|---|
| **Eligible** | Student meets eligibility requirements |
| **Not Eligible** | Student does not meet requirements |
| **Applied** | Application submitted |
| **Under Review** | Application being reviewed |
| **Shortlisted** | Candidate shortlisted |
| **Interview** | Candidate is in interview stage |
| **Selected** | Candidate selected |
| **Rejected** | Candidate rejected |
| **Pending** | Action/result pending |

Status should be communicated through **text + visual styling**, not color alone.

---

# 13. Placement Drive Design

Each placement drive should display:

```text
┌────────────────────────────────────────────┐
│ Company Name                               │
│ Software Developer                         │
│                                            │
│ Package: ₹X LPA                            │
│ Location: Ahmedabad                        │
│ Deadline: DD/MM/YYYY                       │
│                                            │
│ Eligibility                                │
│ ✓ MCA                                     │
│ ✓ Required CGPA                            │
│ ✓ No active backlogs                       │
│                                            │
│ Status: Eligible                           │
│                                            │
│                 [View Details] [Apply Now] │
└────────────────────────────────────────────┘
```

The eligibility status should be clearly visible.

---

# 14. Tables

Tables should be used for information-heavy Admin and Recruiter screens.

Examples:

- Student list
- Company list
- Placement drives
- Applicant list
- Selection records

Table rules:

- Clear column headings.
- Consistent row height.
- Adequate cell padding.
- Status badges where appropriate.
- Search/filter controls above the table.
- Responsive behavior on smaller screens.

---

# 15. AI Matching UI

> **Deferred implementation:** This UI is planned for a later phase. Do not implement AI matching until all Student, Recruiter, and Admin portal pages and their core workflows have been implemented, integrated, tested, and reviewed. Until then, official eligibility and recruitment workflows must operate independently of AI.

AI results should be visually separated from official eligibility.

Example:

```text
┌────────────────────────────────────────────┐
│ AI Resume–Job Match                        │
│                                            │
│ Match Score                                │
│ ████████████████░░░░  82%                 │
│                                            │
│ Matched Skills                             │
│ ✓ JavaScript                               │
│ ✓ React.js                                 │
│ ✓ Node.js                                  │
│                                            │
│ Missing Skills                             │
│ • Docker                                   │
│ • AWS                                      │
│                                            │
│ Suggestions                                │
│ Consider improving Docker and AWS skills.  │
└────────────────────────────────────────────┘
```

Include a clear note:

> **AI matching is an assistive recommendation and does not determine official placement eligibility.**

---

# 16. Feedback States

Every major screen must handle four important states.

## Loading State

Display:

- Spinner
- Skeleton
- Loading message

Example:

```text
Loading placement drives...
```

Avoid showing an empty screen while data is loading.

---

## Empty State

When no data exists, provide a helpful message.

Example:

```text
No placement drives available.

Check again later for new opportunities.
```

Where appropriate, provide an action:

```text
[Create Placement Drive]
```

---

## Error State

Errors should be understandable.

Example:

```text
Unable to load placement drives.

Please try again.

[Retry]
```

Do not expose raw database errors or technical stack traces to users.

---

## Success State

After successful actions, provide confirmation.

Example:

```text
✓ Application submitted successfully.
```

---

# 17. Modal Design

Use modals for:

- Confirmation
- Delete confirmation
- Important warnings
- Short forms
- Viewing compact details

Example:

```text
┌──────────────────────────────────┐
│ Delete Application?              │
│                                  │
│ This action cannot be undone.    │
│                                  │
│       [Cancel] [Delete]          │
└──────────────────────────────────┘
```

Avoid using modals for large multi-step forms.

---

# 18. Responsive Design

CPRMP must support:

```text
Mobile
   ↓
Tablet
   ↓
Desktop
```

### Responsive Requirements

- No horizontal scrolling for normal pages.
- Navigation should adapt to smaller screens.
- Tables should have responsive behavior.
- Cards should stack on small screens.
- Forms should become single-column on mobile.
- Buttons should remain easy to tap.
- Text must remain readable.

---

# 19. Accessibility

The application should follow basic accessibility practices:

- Use semantic HTML.
- Every form input must have a label.
- Maintain sufficient text/background contrast.
- Provide visible focus states.
- Buttons must have meaningful labels.
- Do not communicate information using color alone.
- Images should have appropriate alt text.
- Keyboard navigation should work for important interactions.
- Error messages should clearly identify the affected field.

---

# 20. Icons

Use one consistent icon library throughout the application.

Recommended:

**Lucide React**

Use icons for:

- Dashboard
- Profile
- Resume
- Companies
- Placement drives
- Applications
- Notifications
- Settings
- Search
- Edit
- Delete
- Logout

Do not mix multiple icon styles unnecessarily.

---

# 21. Design Consistency Rules

The following rules must be followed:

### Rule 1
Use **Inter** throughout the application.

### Rule 2
Use `#6366F1` as the primary brand color.

### Rule 3
Use `#F8FAFC` as the primary application background.

### Rule 4
Use **12px** as the default card border radius.

### Rule 5
Use consistent button styles across all modules.

### Rule 6
Use the same input style across all forms.

### Rule 7
Use the same status-badge design throughout the application.

### Rule 8
Do not create a new color for individual pages without a defined purpose.

### Rule 9
Do not create different card styles for different dashboards unless there is a functional reason.

### Rule 10
All pages must support loading, empty, error, and appropriate success states.

### Rule 11
All major layouts must be responsive.

### Rule 12
UI design must remain separate from business logic.

---

# 22. Overall Visual Direction

The final application should feel:

**Modern + Clean + Professional + Academic + Trustworthy**

Avoid:

- Excessive gradients
- Excessive animations
- Too many colors
- Heavy shadows
- Cluttered dashboards
- Inconsistent button styles
- Decorative elements that don't improve usability

Prefer:

- Clean white cards
- Light backgrounds
- Indigo primary actions
- Clear typography
- Consistent spacing
- Simple icons
- Clear status indicators
- Data-focused dashboards

---

# 23. Design System Summary

```text
STYLE
Modern / Minimal / Professional

FONT
Inter

PRIMARY
#6366F1

BACKGROUND
#F8FAFC

TEXT
#0F172A

MUTED
#64748B

SURFACE
#FFFFFF

BORDER
#E2E8F0

SUCCESS
#16A34A

WARNING
#D97706

ERROR
#DC2626

CARD RADIUS
12px

BUTTON RADIUS
8px

ICON LIBRARY
Lucide React

RESPONSIVE
Mobile + Tablet + Desktop

UX STATES
Loading + Empty + Error + Success

ACCESSIBILITY
Required
```

**DESIGN = HOW IT SHOULD LOOK AND FEEL**