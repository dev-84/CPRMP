import { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Building2,
  MapPin,
  Calendar,
  DollarSign,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ShieldCheck,
  Check,
  X,
  RefreshCw,
  FileText,
} from "lucide-react";
import { useAuth } from "../context/useAuth.js";
import AppLayout from "../components/ui/AppLayout.jsx";
import {
  ApplicationStatusBadge,
  CompanyLogo,
  PrimaryButton,
  SecondaryButton,
  EmptyState,
} from "../components/ui/EditorialComponents.jsx";
import { studentApi } from "../api/studentApi.js";
import "./DriveDetailsApply.css";

export default function DriveDetailsApply() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [driveData, setDriveData] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchDriveDetails = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const data = await studentApi.getDriveById(id);
      setDriveData(data);
    } catch (err) {
      console.error("Failed to load drive details:", err);
      setError(err.message || "Failed to load placement drive details.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDriveDetails();
  }, [fetchDriveDetails]);

  const drive = driveData?.drive || null;
  const eligibility = driveData?.eligibility || { isEligible: false, criteria: [], isDeadlineOpen: true };
  const hasApplied = driveData?.hasApplied || false;
  const resumeStatus = driveData?.resumeStatus || { hasResume: false };

  const handleApply = async () => {
    if (hasApplied) return;

    if (!resumeStatus.hasResume) {
      setFeedback({
        type: "error",
        message: "Mandatory resume is required. Please upload your resume in Resume Management before applying.",
        action: {
          label: "Go to Resume Management",
          onClick: () => navigate("/student/resume"),
        },
      });
      return;
    }

    if (!eligibility.isEligible) {
      setFeedback({
        type: "error",
        message: "You do not meet the minimum eligibility requirements for this placement drive.",
      });
      return;
    }

    try {
      setSubmitting(true);
      await studentApi.applyToDrive(id);
      setFeedback({
        type: "success",
        message: "Application submitted successfully! Your active verified resume has been attached.",
      });
      await fetchDriveDetails();
    } catch (err) {
      console.error("Apply error:", err);
      if (err.code === "RESUME_REQUIRED" || err.message?.toLowerCase().includes("resume")) {
        setFeedback({
          type: "error",
          message: err.message || "Resume upload is mandatory before applying.",
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
      setSubmitting(false);
    }
  };

  if (loading && !driveData) {
    return (
      <AppLayout pageTitle="Placement Drive Details">
        <div style={{ padding: "80px", textAlign: "center", color: "var(--text-secondary)" }}>
          <RefreshCw size={28} className="animate-spin" style={{ margin: "0 auto 16px" }} />
          <p>Retrieving drive dossier and official eligibility criteria...</p>
        </div>
      </AppLayout>
    );
  }

  if (error || !drive) {
    return (
      <AppLayout pageTitle="Placement Drive Details">
        <div className="editorial-page-container">
          <EmptyState
            title="Placement drive not found"
            description={error || "The requested recruitment opportunity does not exist or has closed."}
            action={
              <Link to="/student/drives" className="btn-secondary btn-sm">
                ← Back to Placement Drives
              </Link>
            }
          />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout pageTitle={`${drive.company} — ${drive.role}`}>
      <div className="editorial-page-container">
        {/* Navigation Breadcrumb */}
        <div className="details-nav-bar">
          <Link to="/student/drives" className="details-back-link">
            <ArrowLeft size={16} />
            <span>Back to All Placement Drives</span>
          </Link>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            style={{
              padding: "14px 20px",
              borderRadius: "6px",
              backgroundColor: feedback.type === "error" ? "var(--error-soft, #fdf2f2)" : "var(--success-soft, #eaf2e7)",
              border: `1px solid ${feedback.type === "error" ? "var(--error, #B93838)" : "var(--success, #287A45)"}`,
              color: feedback.type === "error" ? "var(--error, #B93838)" : "var(--success, #287A45)",
              fontSize: "13.5px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {feedback.type === "error" ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
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
              style={{ background: "none", border: "none", cursor: "pointer", color: "inherit" }}
            >
              <X size={15} />
            </button>
          </div>
        )}

        {/* Hero Card */}
        <div className="details-hero-card">
          <div className="details-header-row">
            <div className="details-company-group">
              <CompanyLogo name={drive.company} logo={drive.logo} />
              <div>
                <div className="details-company-name">
                  {drive.company} {drive.companyId?.website ? `· ${drive.companyId.website}` : ""}
                </div>
                <h1 className="details-role-title">{drive.role}</h1>
              </div>
            </div>

            <div className="details-actions-area">
              <ApplicationStatusBadge
                status={hasApplied ? "Applied" : eligibility.isEligible ? "Eligible" : "Not Eligible"}
              />

              {hasApplied ? (
                <Link to="/student/applications" className="btn-secondary btn-sm">
                  Track in My Applications
                </Link>
              ) : (
                <PrimaryButton
                  onClick={handleApply}
                  disabled={!eligibility.isEligible || submitting}
                >
                  {submitting ? "Submitting..." : "Apply to Drive"}
                </PrimaryButton>
              )}
            </div>
          </div>

          <div className="details-summary-grid">
            <div className="summary-spec-item">
              <span className="spec-label">Compensation (CTC)</span>
              <span className="spec-value" style={{ color: "var(--accent)" }}>{drive.package}</span>
            </div>
            <div className="summary-spec-item">
              <span className="spec-label">Location</span>
              <span className="spec-value">{drive.location || "Multiple Locations"}</span>
            </div>
            <div className="summary-spec-item">
              <span className="spec-label">Work Mode</span>
              <span className="spec-value">{drive.jobType || "Full Time Campus Hire"}</span>
            </div>
            <div className="summary-spec-item">
              <span className="spec-label">Application Deadline</span>
              <span className="spec-value">{drive.deadline}</span>
            </div>
          </div>
        </div>

        {/* Two-Column Details Body */}
        <div className="details-body-grid">
          {/* Main Description & Responsibilities */}
          <div className="details-card-section">
            <div>
              <h2 className="section-block-title">Role Overview</h2>
              <p className="editorial-prose">{drive.description}</p>
            </div>

            {drive.responsibilities && drive.responsibilities.length > 0 && (
              <div>
                <h2 className="section-block-title">Key Responsibilities</h2>
                <ul className="responsibilities-list">
                  {drive.responsibilities.map((resp, index) => (
                    <li key={index}>{resp}</li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <h2 className="section-block-title">Required Competencies & Skills</h2>
              <div className="skills-pill-group">
                {(drive.requiredSkills || []).map((skill, index) => (
                  <span key={index} className="skill-editorial-badge">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {drive.rounds && drive.rounds.length > 0 && (
              <div>
                <h2 className="section-block-title">Recruitment Process & Rounds</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {drive.rounds.map((round, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: "10px 14px",
                        backgroundColor: "var(--surface-secondary)",
                        borderRadius: "6px",
                        fontSize: "13px",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <span
                        style={{
                          width: "22px",
                          height: "22px",
                          borderRadius: "50%",
                          backgroundColor: "var(--accent)",
                          color: "#fff",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "11px",
                          fontWeight: 600,
                        }}
                      >
                        {idx + 1}
                      </span>
                      <span style={{ fontWeight: 500, color: "var(--text-primary)" }}>{round}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Eligibility & Status */}
          <div className="eligibility-checklist-card">
            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "18px", margin: 0, color: "var(--text-primary)" }}>
              Institutional Eligibility Criteria
            </h3>
            <p style={{ fontSize: "12.5px", color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>
              Audited in real-time against your verified academic record.
            </p>

            {/* Dynamic criteria checklist */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "12px" }}>
              {eligibility.criteria?.map((item, idx) => (
                <div key={idx} className="checklist-item">
                  {item.passed ? (
                    <CheckCircle2 size={18} color="var(--success, #287A45)" style={{ flexShrink: 0, marginTop: "2px" }} />
                  ) : (
                    <AlertCircle size={18} color="var(--error, #B93838)" style={{ flexShrink: 0, marginTop: "2px" }} />
                  )}
                  <div>
                    <div className="checklist-item-title">
                      {item.label}: {item.required}
                    </div>
                    <div className="checklist-item-desc">
                      Your Profile: <strong>{item.studentValue}</strong> {item.passed ? "(Eligible)" : "(Does not meet requirement)"}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Resume Attachment Status */}
            <div
              style={{
                marginTop: "16px",
                padding: "12px",
                borderRadius: "6px",
                backgroundColor: resumeStatus.hasResume ? "var(--surface-secondary)" : "var(--error-soft, #fdf2f2)",
                border: `1px solid ${resumeStatus.hasResume ? "var(--border)" : "#f5c2c2"}`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                <FileText size={15} color={resumeStatus.hasResume ? "var(--accent)" : "var(--error)"} />
                <span style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--text-primary)" }}>
                  Verified Resume
                </span>
              </div>
              <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: "0 0 6px" }}>
                {resumeStatus.hasResume
                  ? `Active resume "${resumeStatus.filename}" will be attached.`
                  : "No active resume found. You must upload a resume before applying."}
              </p>
              {!resumeStatus.hasResume && (
                <Link
                  to="/student/resume"
                  style={{ fontSize: "12px", fontWeight: 600, color: "var(--accent)", textDecoration: "underline" }}
                >
                  Upload Resume Now →
                </Link>
              )}
            </div>

            <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid var(--border)" }}>
              {hasApplied ? (
                <div style={{ textAlign: "center", color: "var(--accent)", fontSize: "13px", fontWeight: 600 }}>
                  ✓ Application submitted and registered
                </div>
              ) : (
                <button
                  type="button"
                  className="btn-primary"
                  style={{ width: "100%" }}
                  onClick={handleApply}
                  disabled={!eligibility.isEligible || submitting}
                >
                  {submitting
                    ? "Submitting Application..."
                    : eligibility.isEligible
                    ? "Apply to Drive Now"
                    : "Ineligible for this Drive"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
