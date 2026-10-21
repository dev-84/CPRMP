import { useMemo, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Briefcase,
  CheckCircle2,
  Clock,
  Send,
  Building2,
  FileText,
  ShieldCheck,
  Check,
  X,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../context/useAuth.js";
import AppLayout from "../components/ui/AppLayout.jsx";
import {
  SectionHeader,
  MetricRow,
  MetricItem,
  PlacementDriveCard,
  ApplicationStatusBadge,
  CompanyLogo,
  EmptyState,
} from "../components/ui/EditorialComponents.jsx";
import "./StudentDashboard.css";

const DEFAULT_DRIVES = [
  {
    id: "drv-001",
    company: "Microsoft IDC",
    logo: "MS",
    role: "Software Engineer — Cloud & AI",
    category: "Super Dream",
    location: "Hyderabad / Bengaluru",
    deadline: "28 Oct 2026",
    ctc: "₹32.0 LPA",
    status: "Eligible",
    minCgpa: 8.0,
    maxBacklogs: 0,
    skills: ["Azure", "Distributed Systems", "C++", "Python"],
  },
  {
    id: "drv-002",
    company: "Goldman Sachs",
    logo: "GS",
    role: "Engineering Analyst",
    category: "Super Dream",
    location: "Bengaluru",
    deadline: "02 Nov 2026",
    ctc: "₹28.5 LPA",
    status: "Eligible",
    minCgpa: 8.0,
    maxBacklogs: 0,
    skills: ["Java", "SQL", "Algorithms", "Financial Tech"],
  },
  {
    id: "drv-003",
    company: "Infosys",
    logo: "INF",
    role: "Systems Specialist",
    category: "Core Tech",
    location: "Pune / Bengaluru",
    deadline: "05 Nov 2026",
    ctc: "₹9.5 LPA",
    status: "Eligible",
    minCgpa: 7.0,
    maxBacklogs: 1,
    skills: ["Full Stack", "Java", "React", "Cloud Basics"],
  },
  {
    id: "drv-004",
    company: "Google India",
    logo: "G",
    role: "Associate Software Engineer",
    category: "Super Dream",
    location: "Bengaluru / Hyderabad",
    deadline: "30 Oct 2026",
    ctc: "₹34.0 LPA",
    status: "Eligible",
    minCgpa: 8.5,
    maxBacklogs: 0,
    skills: ["DSA", "Go", "Distributed Systems", "Kubernetes"],
  },
];

const INITIAL_APPLICATIONS = [
  {
    id: "app-101",
    driveId: "drv-101",
    company: "TCS Digital",
    role: "Graduate Engineer Trainee",
    appliedDate: "14 Oct 2026",
    status: "Shortlisted",
    milestone: "Technical Assessment Cleared",
  },
  {
    id: "app-102",
    driveId: "drv-102",
    company: "Deloitte USI",
    role: "Associate Analyst (Consulting)",
    appliedDate: "18 Oct 2026",
    status: "Under Review",
    milestone: "Dossier review by Talent Team",
  },
];

function readSavedData(key, fallback) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [drives] = useState(() => readSavedData("cprmp_all_drives", DEFAULT_DRIVES));
  const [applications, setApplications] = useState(() =>
    readSavedData("cprmp_applications", INITIAL_APPLICATIONS)
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [eligibilityModalOpen, setEligibilityModalOpen] = useState(false);

  // Student Profile data
  const profile = useMemo(() => {
    const stored = readSavedData("cprmpStudentProfile", {});
    return {
      name: user?.name || user?.fullName || stored.fullName || stored.name || "Aryan Sharma",
      course: stored.degree || user?.course || "Master of Computer Applications",
      college: stored.institution || user?.collegeName || "University College of Engineering",
      cgpa: Number(stored.cgpa || 8.84),
      backlogs: Number(stored.backlogs || 0),
      skills: stored.skills || ["Java", "Python", "React", "SQL", "Docker"],
      graduationYear: stored.graduationYear || "2027",
    };
  }, [user]);

  // Persist applications when updated
  useEffect(() => {
    try {
      localStorage.setItem("cprmp_applications", JSON.stringify(applications));
    } catch {
      // ignore
    }
  }, [applications]);

  // Eligibility calculation
  const eligibleDrivesCount = useMemo(() => {
    return drives.filter(
      (drive) => profile.cgpa >= (drive.minCgpa || 7.0) && profile.backlogs <= (drive.maxBacklogs || 0)
    ).length;
  }, [drives, profile]);

  // Placement status computation
  const placementStatus = useMemo(() => {
    const hasOffer = applications.some((app) =>
      ["Selected", "Offer Received", "Accepted"].includes(app.status)
    );
    if (hasOffer) return "Offer Accepted";

    const hasInterview = applications.some((app) =>
      ["Shortlisted", "Interview", "Assessment"].includes(app.status)
    );
    if (hasInterview) return "In Selection Process";

    return applications.length > 0 ? "Applications Active" : "Profile Ready";
  }, [applications]);

  // Handle Apply to Drive
  const handleApply = (drive) => {
    const alreadyApplied = applications.some(
      (app) => app.driveId === drive.id || app.company === drive.company
    );

    if (alreadyApplied) {
      setFeedback({
        type: "info",
        message: `You have already applied to ${drive.company}. Check status in My Applications.`,
      });
      return;
    }

    if (profile.cgpa < (drive.minCgpa || 7.0) || profile.backlogs > (drive.maxBacklogs || 0)) {
      setFeedback({
        type: "error",
        message: `You do not meet the minimum criteria (CGPA >= ${drive.minCgpa}, Backlogs <= ${drive.maxBacklogs}) for ${drive.company}.`,
      });
      return;
    }

    const newApp = {
      id: `app-${Date.now()}`,
      driveId: drive.id,
      company: drive.company,
      role: drive.role,
      appliedDate: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      status: "Applied",
      milestone: "Application submitted and queued for verification",
    };

    setApplications((prev) => [newApp, ...prev]);
    setFeedback({
      type: "success",
      message: `Successfully applied to ${drive.company} for ${drive.role}!`,
    });
  };

  // Filtered drives based on search
  const filteredDrives = useMemo(() => {
    if (!searchQuery.trim()) return drives;
    const q = searchQuery.toLowerCase();
    return drives.filter(
      (d) =>
        d.company.toLowerCase().includes(q) ||
        d.role.toLowerCase().includes(q) ||
        d.location.toLowerCase().includes(q)
    );
  }, [drives, searchQuery]);

  return (
    <AppLayout
      pageTitle="Student Dashboard"
      breadcrumb="Campus Directorate"
      searchValue={searchQuery}
      onSearch={setSearchQuery}
      searchPlaceholder="Search placement drives..."
    >
      <div className="sd-editorial-dashboard">
        {/* Feedback Alert */}
        {feedback && (
          <div className={`sd-alert-banner ${feedback.type}`} role="alert">
            <span>{feedback.message}</span>
            <button
              type="button"
              onClick={() => setFeedback(null)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", fontWeight: 600 }}
              aria-label="Dismiss feedback"
            >
              <X size={15} />
            </button>
          </div>
        )}

        {/* A. Editorial Welcome Section & Profile Widget */}
        <div className="sd-welcome-grid">
          <section className="sd-welcome-card" aria-labelledby="welcome-heading">
            <div>
              <div className="sd-cycle-eyebrow">
                <span className="sd-cycle-indicator" />
                ACADEMIC CYCLE 2026–2027
              </div>
              <h1 id="welcome-heading" className="sd-welcome-heading">
                Your Career Starts Here
              </h1>
              <p className="sd-welcome-text">
                Explore opportunities, meet top recruiters, and take the next step in your career.
                Track campus placement deadlines and verify institutional eligibility seamlessly.
              </p>
            </div>

            {/* F. Quick Actions */}
            <div className="sd-quick-actions-bar">
              <Link to="/student/placement-drives" className="btn-primary">
                <Briefcase size={15} />
                <span>Browse Drives</span>
              </Link>
              <Link to="/student/resume" className="btn-secondary">
                <FileText size={15} />
                <span>Manage Resume</span>
              </Link>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setEligibilityModalOpen(true)}
              >
                <ShieldCheck size={15} />
                <span>Check Eligibility</span>
              </button>
            </div>
          </section>

          {/* E. Profile Completion Card */}
          <section className="sd-profile-card">
            <div>
              <div className="sd-profile-header">
                <div>
                  <h2 className="sd-profile-name">{profile.name}</h2>
                  <p className="sd-profile-sub">
                    {profile.course} · {profile.college}
                  </p>
                </div>
                <span className="editorial-badge badge-accent">
                  CGPA {profile.cgpa.toFixed(2)}
                </span>
              </div>

              <div className="sd-progress-box">
                <div className="sd-progress-info">
                  <span>Profile Strength</span>
                  <span style={{ color: "var(--accent)" }}>88% Complete</span>
                </div>
                <div className="sd-progress-bar-container">
                  <div className="sd-progress-bar-fill" style={{ width: "88%" }} />
                </div>
                <div className="sd-progress-caption">
                  Active academic credentials verified for the 2026–2027 placement cycle.
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
              <Link to="/student/profile" className="btn-secondary btn-sm" style={{ flex: 1 }}>
                View Profile
              </Link>
              <Link to="/student/edit-profile" className="btn-secondary btn-sm" style={{ flex: 1 }}>
                Update Info
              </Link>
            </div>
          </section>
        </div>

        {/* B. Placement Statistics - Horizontal Row with subtle dividers */}
        <section aria-label="Placement Statistics">
          <MetricRow>
            <MetricItem
              label="Active Drives"
              value={drives.length}
              detail="Total recruitment drives open"
              icon={Briefcase}
            />
            <MetricItem
              label="Eligible Drives"
              value={eligibleDrivesCount}
              detail={`Based on CGPA ${profile.cgpa} & ${profile.backlogs} backlogs`}
              icon={ShieldCheck}
            />
            <MetricItem
              label="Applications Submitted"
              value={applications.length}
              detail="Active in placement cycle"
              icon={Send}
            />
            <MetricItem
              label="Placement Status"
              value={placementStatus}
              detail="Live candidate recruitment standing"
              icon={CheckCircle2}
            />
          </MetricRow>
        </section>

        {/* C. Featured Opportunities */}
        <section aria-labelledby="featured-opportunities-heading">
          <SectionHeader
            title="Opportunities Worth Exploring"
            subtitle="Discover placement drives aligned with your academic profile."
            actionText="View All Drives"
            actionLink="/student/placement-drives"
          />

          {filteredDrives.length === 0 ? (
            <EmptyState
              title="No drives match your search"
              description="Try adjusting your keyword or browse all available placement drives."
              action={
                <button
                  type="button"
                  className="btn-secondary btn-sm"
                  onClick={() => setSearchQuery("")}
                >
                  Clear Search
                </button>
              }
            />
          ) : (
            <div className="sd-drives-grid">
              {filteredDrives.slice(0, 3).map((drive) => {
                const hasApplied = applications.some(
                  (app) => app.driveId === drive.id || app.company === drive.company
                );
                const isEligible =
                  profile.cgpa >= (drive.minCgpa || 7.0) &&
                  profile.backlogs <= (drive.maxBacklogs || 0);

                return (
                  <PlacementDriveCard
                    key={drive.id}
                    drive={drive}
                    hasApplied={hasApplied}
                    isEligible={isEligible}
                    onApply={handleApply}
                  />
                );
              })}
            </div>
          )}
        </section>

        {/* D. Application Journey */}
        <section aria-labelledby="application-journey-heading">
          <SectionHeader
            title="Your Application Journey"
            subtitle="Recent placement applications and progression stages."
            actionText="View All Applications"
            actionLink="/student/applications"
          />

          {applications.length === 0 ? (
            <EmptyState
              title="No active applications yet"
              description="Explore placement drives above and submit applications for roles matching your interests."
            />
          ) : (
            <div className="sd-journey-container">
              {applications.slice(0, 4).map((app) => (
                <div key={app.id} className="sd-application-row">
                  <div className="sd-app-meta">
                    <CompanyLogo name={app.company} />
                    <div>
                      <div className="sd-app-company">{app.company}</div>
                      <div className="sd-app-role">{app.role}</div>
                      <div className="sd-app-date">Submitted on {app.appliedDate}</div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <div style={{ textAlign: "right", display: "flex", flexDirection: "column", gap: "4px" }}>
                      <ApplicationStatusBadge status={app.status} />
                      {app.milestone && (
                        <span style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>
                          {app.milestone}
                        </span>
                      )}
                    </div>

                    <Link
                      to={`/student/application-tracking/${app.id || app.driveId}`}
                      className="btn-secondary btn-sm"
                      aria-label={`Track application for ${app.company}`}
                    >
                      <span>Track</span>
                      <ChevronRight size={13} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Eligibility Modal */}
      {eligibilityModalOpen && (
        <div
          className="sd-modal-backdrop"
          onClick={() => setEligibilityModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="eligibility-modal-title"
        >
          <div
            className="sd-eligibility-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <h2 id="eligibility-modal-title" style={{ fontFamily: "var(--font-serif)", fontSize: "22px", margin: 0, color: "var(--text-primary)" }}>
                Academic Eligibility Verification
              </h2>
              <button
                type="button"
                onClick={() => setEligibilityModalOpen(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: 0 }}>
              Official criteria verified against university registrar records for academic cycle 2026–2027.
            </p>

            <div className="sd-criteria-list">
              <div className="sd-criteria-item">
                <span className="sd-criteria-title">Cumulative Grade Point Average (CGPA)</span>
                <span className="sd-criteria-val" style={{ color: "var(--success)" }}>
                  <Check size={14} />
                  <span>{profile.cgpa.toFixed(2)} (Min required: 7.0)</span>
                </span>
              </div>
              <div className="sd-criteria-item">
                <span className="sd-criteria-title">Active Academic Backlogs</span>
                <span className="sd-criteria-val" style={{ color: "var(--success)" }}>
                  <Check size={14} />
                  <span>{profile.backlogs} Backlogs (Allowed: 0)</span>
                </span>
              </div>
              <div className="sd-criteria-item">
                <span className="sd-criteria-title">Graduation Year / Cohort</span>
                <span className="sd-criteria-val" style={{ color: "var(--accent)" }}>
                  <Check size={14} />
                  <span>Class of {profile.graduationYear}</span>
                </span>
              </div>
              <div className="sd-criteria-item">
                <span className="sd-criteria-title">Official Placement Resume</span>
                <span className="sd-criteria-val" style={{ color: "var(--success)" }}>
                  <Check size={14} />
                  <span>Active & Verified by TPO</span>
                </span>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button
                type="button"
                className="btn-primary btn-sm"
                onClick={() => setEligibilityModalOpen(false)}
              >
                Close Verification
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
