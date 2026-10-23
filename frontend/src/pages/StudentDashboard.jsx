import { useState, useEffect, useCallback, useMemo } from "react";
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
  AlertCircle,
  RefreshCw,
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
import { studentApi } from "../api/studentApi.js";
import "./StudentDashboard.css";

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [eligibilityModalOpen, setEligibilityModalOpen] = useState(false);
  const [applyingDriveId, setApplyingDriveId] = useState(null);

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await studentApi.getDashboard();
      setDashboardData(data);
    } catch (err) {
      console.error("Failed to load student dashboard:", err);
      setError(err.message || "Failed to load dashboard data. Please check connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const student = dashboardData?.student || {
    fullName: user?.name || user?.fullName || "Student",
    studentId: user?.studentId || "MCA-2024",
    degree: user?.degree || "Master of Computer Applications",
    department: user?.department || "Computer Applications",
    graduationYear: 2027,
    profileCompletion: 80,
    incompleteSections: [],
    verificationStatus: "Verified",
    hasResume: false,
  };

  const metrics = dashboardData?.metrics || {
    profileCompletion: 0,
    availableDrives: 0,
    applicationsSubmitted: 0,
    shortlistedApplications: 0,
    interviewStageApplications: 0,
    selectedApplications: 0,
    placementStatus: { isPlaced: false, status: "Active in Cycle" },
  };

  const recommendedDrives = dashboardData?.recommendedDrives || [];
  const recentApplications = dashboardData?.recentApplications || [];

  // Filter recommended drives by search
  const filteredDrives = useMemo(() => {
    if (!searchQuery.trim()) return recommendedDrives;
    const q = searchQuery.toLowerCase();
    return recommendedDrives.filter(
      (d) =>
        d.company.toLowerCase().includes(q) ||
        d.role.toLowerCase().includes(q) ||
        d.location.toLowerCase().includes(q) ||
        (d.skills && d.skills.some((s) => s.toLowerCase().includes(q)))
    );
  }, [recommendedDrives, searchQuery]);

  // Handle Apply to Drive
  const handleApply = async (drive) => {
    if (!student.hasResume) {
      setFeedback({
        type: "error",
        message: "Mandatory resume is missing. Please upload your resume in Resume Management before applying.",
        action: {
          label: "Go to Resume Management",
          onClick: () => navigate("/student/resume"),
        },
      });
      return;
    }

    try {
      setApplyingDriveId(drive.id);
      await studentApi.applyToDrive(drive.id);
      setFeedback({
        type: "success",
        message: `Successfully applied to ${drive.company} for ${drive.role}!`,
      });
      // Refresh real dashboard metrics
      await loadDashboard();
    } catch (err) {
      console.error("Apply error:", err);
      if (err.code === "RESUME_REQUIRED" || err.message?.toLowerCase().includes("resume")) {
        setFeedback({
          type: "error",
          message: err.message,
          action: {
            label: "Upload Resume",
            onClick: () => navigate("/student/resume"),
          },
        });
      } else {
        setFeedback({
          type: "error",
          message: err.message || "Failed to submit application. Please try again.",
        });
      }
    } finally {
      setApplyingDriveId(null);
    }
  };

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
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1 }}>
              {feedback.type === "success" ? (
                <CheckCircle2 size={16} color="var(--success, #287A45)" />
              ) : (
                <AlertCircle size={16} color="var(--error, #B93838)" />
              )}
              <span>{feedback.message}</span>
              {feedback.action && (
                <button
                  type="button"
                  onClick={feedback.action.onClick}
                  style={{
                    marginLeft: "8px",
                    textDecoration: "underline",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: 600,
                    color: "inherit",
                  }}
                >
                  {feedback.action.label} →
                </button>
              )}
            </div>
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

        {/* Global Loading or Error Banner */}
        {loading && !dashboardData && (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--text-secondary)" }}>
            <RefreshCw size={24} className="animate-spin" style={{ margin: "0 auto 12px" }} />
            <p>Loading your placement dashboard and verified academic credentials...</p>
          </div>
        )}

        {error && !dashboardData && (
          <div className="sd-alert-banner error" style={{ margin: "20px 0" }}>
            <span>{error}</span>
            <button
              type="button"
              className="btn-secondary btn-sm"
              onClick={loadDashboard}
              style={{ marginLeft: "12px" }}
            >
              Retry
            </button>
          </div>
        )}

        {/* A. Editorial Welcome Section & Profile Widget */}
        <div className="sd-welcome-grid">
          <section className="sd-welcome-card" aria-labelledby="welcome-heading">
            <div>
              <div className="sd-cycle-eyebrow">
                <span className="sd-cycle-indicator" />
                ACADEMIC CYCLE {student.graduationYear ? `${student.graduationYear - 1}–${student.graduationYear}` : "2026–2027"}
              </div>
              <h1 id="welcome-heading" className="sd-welcome-heading">
                Welcome, {student.fullName}
              </h1>
              <p className="sd-welcome-text">
                Enrolled in {student.degree} · Department of {student.department}.
                Explore published recruiter opportunities, check real-time eligibility criteria, and track recruitment rounds.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="sd-quick-actions-bar">
              <Link to="/student/drives" className="btn-primary">
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

          {/* Profile Completion Card */}
          <section className="sd-profile-card">
            <div>
              <div className="sd-profile-header">
                <div>
                  <h2 className="sd-profile-name">{student.fullName}</h2>
                  <p className="sd-profile-sub">
                    Roll: {student.studentId} · Sem {student.currentSemester || 3}
                  </p>
                </div>
                <span className="editorial-badge badge-accent">
                  CGPA {Number(student.cgpa || 0).toFixed(2)}
                </span>
              </div>

              <div className="sd-progress-box">
                <div className="sd-progress-info">
                  <span>Profile Completion</span>
                  <span style={{ color: "var(--accent)" }}>{student.profileCompletion}% Complete</span>
                </div>
                <div className="sd-progress-bar-container">
                  <div
                    className="sd-progress-bar-fill"
                    style={{ width: `${student.profileCompletion}%` }}
                  />
                </div>
                <div className="sd-progress-caption">
                  {student.incompleteSections?.length > 0 ? (
                    <span>Next: Add {student.incompleteSections[0]} to improve placement readiness.</span>
                  ) : (
                    <span>All core academic and resume prerequisites verified for campus drives.</span>
                  )}
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
              label="Available Drives"
              value={metrics.availableDrives}
              detail="Published opportunities open"
              icon={Briefcase}
            />
            <MetricItem
              label="Applications Submitted"
              value={metrics.applicationsSubmitted}
              detail={`${metrics.shortlistedApplications} shortlisted · ${metrics.interviewStageApplications} in interview`}
              icon={Send}
            />
            <MetricItem
              label="Profile Completion"
              value={`${student.profileCompletion}%`}
              detail={student.hasResume ? "Active verified resume linked" : "Resume upload required"}
              icon={ShieldCheck}
            />
            <MetricItem
              label="Placement Standing"
              value={metrics.placementStatus?.status || (metrics.placementStatus?.isPlaced ? "Offer Extended" : "In Cycle")}
              detail={metrics.placementStatus?.company ? `${metrics.placementStatus.company} (${metrics.placementStatus.package})` : "Active placement cycle"}
              icon={CheckCircle2}
            />
          </MetricRow>
        </section>

        {/* C. Recommended Drives */}
        <section aria-labelledby="featured-opportunities-heading">
          <SectionHeader
            title="Recommended Placement Drives"
            subtitle="Verified placement drives open for applications matching your program."
            actionText="View All Drives"
            actionLink="/student/drives"
          />

          {filteredDrives.length === 0 ? (
            <EmptyState
              title="No open drives matching criteria"
              description="Check back shortly or visit all placement drives to browse all upcoming opportunities."
              action={
                <Link to="/student/drives" className="btn-secondary btn-sm">
                  Explore All Drives
                </Link>
              }
            />
          ) : (
            <div className="sd-drives-grid">
              {filteredDrives.map((drive) => (
                <PlacementDriveCard
                  key={drive.id}
                  drive={drive}
                  hasApplied={drive.hasApplied}
                  isEligible={drive.isEligible}
                  onApply={() => handleApply(drive)}
                />
              ))}
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

          {recentApplications.length === 0 ? (
            <EmptyState
              title="No active applications yet"
              description="Explore recommended placement drives above and submit applications for roles matching your interests."
              action={
                <Link to="/student/drives" className="btn-primary btn-sm">
                  Apply to Open Drives
                </Link>
              }
            />
          ) : (
            <div className="sd-journey-container">
              {recentApplications.map((app) => (
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
                      to={`/student/applications/${app.id}`}
                      className="btn-secondary btn-sm"
                    >
                      <span>Track Details</span>
                      <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* E. Eligibility Modal */}
        {eligibilityModalOpen && (
          <div
            className="editorial-modal-backdrop"
            role="dialog"
            aria-modal="true"
            aria-labelledby="eligibility-modal-title"
            onClick={() => setEligibilityModalOpen(false)}
          >
            <div
              className="editorial-modal-card"
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: "540px", width: "90%" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <ShieldCheck size={20} color="var(--accent)" />
                  <h3 id="eligibility-modal-title" style={{ margin: 0, fontSize: "17px", fontFamily: "var(--font-serif)" }}>
                    Institutional Eligibility Audit
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setEligibilityModalOpen(false)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}
                >
                  <X size={18} />
                </button>
              </div>

              <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.5, margin: "0 0 16px" }}>
                The CPRMP placement engine audits your academic credentials in real-time against recruiter prerequisites.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", background: "var(--surface-secondary)", borderRadius: "6px", fontSize: "13px" }}>
                  <span style={{ fontWeight: 500 }}>Recorded CGPA</span>
                  <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{Number(student.cgpa || 0).toFixed(2)} / 10.00</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", background: "var(--surface-secondary)", borderRadius: "6px", fontSize: "13px" }}>
                  <span style={{ fontWeight: 500 }}>Active Backlogs</span>
                  <span style={{ fontWeight: 600, color: Number(student.backlogCount || 0) === 0 ? "var(--success)" : "var(--warning)" }}>
                    {student.backlogCount || 0} Backlogs
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", background: "var(--surface-secondary)", borderRadius: "6px", fontSize: "13px" }}>
                  <span style={{ fontWeight: 500 }}>Program & Department</span>
                  <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{student.degree} ({student.department})</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", background: "var(--surface-secondary)", borderRadius: "6px", fontSize: "13px" }}>
                  <span style={{ fontWeight: 500 }}>Active Verified Resume</span>
                  <span style={{ fontWeight: 600, color: student.hasResume ? "var(--success)" : "var(--error)" }}>
                    {student.hasResume ? "Verified & Attached" : "Missing — Upload Required"}
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button
                  type="button"
                  className="btn-secondary btn-sm"
                  onClick={() => setEligibilityModalOpen(false)}
                >
                  Close
                </button>
                <Link
                  to="/student/profile"
                  className="btn-primary btn-sm"
                  onClick={() => setEligibilityModalOpen(false)}
                >
                  Update Profile Dossier
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
