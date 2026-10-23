import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Calendar,
  Building2,
  FileCheck,
  ShieldCheck,
  Check,
  RefreshCw,
  AlertCircle,
  FileText,
} from "lucide-react";
import AppLayout from "../components/ui/AppLayout.jsx";
import {
  ApplicationStatusBadge,
  CompanyLogo,
  EmptyState,
} from "../components/ui/EditorialComponents.jsx";
import { studentApi } from "../api/studentApi.js";
import "./ApplicationTracking.css";

export default function ApplicationTracking() {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchApplicationDetails = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const res = await studentApi.getApplicationById(id);
      setData(res);
    } catch (err) {
      console.error("Failed to load application details:", err);
      setError(err.message || "Failed to load application dossier.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchApplicationDetails();
  }, [fetchApplicationDetails]);

  if (loading && !data) {
    return (
      <AppLayout pageTitle="Application Progression" breadcrumb="My Applications">
        <div style={{ padding: "80px", textAlign: "center", color: "var(--text-secondary)" }}>
          <RefreshCw size={26} className="animate-spin" style={{ margin: "0 auto 16px" }} />
          <p>Retrieving application dossier and recruitment stages...</p>
        </div>
      </AppLayout>
    );
  }

  if (error || !data) {
    return (
      <AppLayout pageTitle="Application Progression" breadcrumb="My Applications">
        <div className="editorial-page-container">
          <EmptyState
            title="Application record not found"
            description={error || "Could not retrieve the requested application. It may have been archived."}
            action={
              <Link to="/student/applications" className="btn-secondary btn-sm">
                ← Back to My Applications
              </Link>
            }
          />
        </div>
      </AppLayout>
    );
  }

  const { application, drive, company, stages } = data;

  return (
    <AppLayout pageTitle="Application Progression" breadcrumb="My Applications">
      <div className="tracking-editorial-layout">
        <Link
          to="/student/applications"
          className="section-action-link"
          style={{ alignSelf: "flex-start", marginBottom: "-12px" }}
        >
          <ArrowLeft size={14} />
          <span>Back to Applications</span>
        </Link>

        {/* Hero Card */}
        <div className="tracking-hero-card">
          <div className="tracking-header-row">
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <CompanyLogo name={company?.name} logo={company?.logo} />
              <div>
                <div style={{ fontSize: "13.5px", color: "var(--text-secondary)", fontWeight: 600 }}>
                  {company?.name} · Application Ref #{application.id?.slice(-6).toUpperCase()}
                </div>
                <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "26px", margin: "4px 0 0", color: "var(--text-primary)" }}>
                  {drive?.title || "Placement Role"}
                </h1>
              </div>
            </div>

            <div>
              <ApplicationStatusBadge status={application.status || "Submitted"} />
            </div>
          </div>

          <div className="tracking-meta-grid">
            <div>
              <span style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>
                Submission Date
              </span>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", marginTop: "4px" }}>
                {application.appliedDate || "Recently"}
              </div>
            </div>
            <div>
              <span style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>
                Eligibility Standing
              </span>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--success)", marginTop: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
                <Check size={14} />
                <span>Verified by Institutional Engine</span>
              </div>
            </div>
            <div>
              <span style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>
                Compensation Package
              </span>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", marginTop: "4px" }}>
                {drive?.ctc || "Competitive"}
              </div>
            </div>
          </div>
        </div>

        {/* Two-Column Tracking Body */}
        <div className="tracking-body-grid">
          {/* Progression Timeline */}
          <div className="tracking-stages-card">
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "20px", margin: "0 0 24px", color: "var(--text-primary)" }}>
              Recruitment Evaluation Stages
            </h2>

            <div>
              {(stages || []).map((stage) => {
                const isCompleted = stage.status === "completed";
                const isCurrent = stage.status === "current";
                const isRejected = stage.status === "rejected";

                return (
                  <div key={stage.number} className="tracking-stage-item">
                    <div className="stage-indicator-column">
                      <div
                        className={`stage-number-bubble ${
                          isCompleted ? "completed" : isCurrent ? "current" : isRejected ? "rejected" : "upcoming"
                        }`}
                      >
                        {isCompleted ? <Check size={14} /> : stage.number}
                      </div>
                      {stage.number < (stages.length || 5) && (
                        <div className={`stage-line-connector ${isCompleted ? "completed" : ""}`} />
                      )}
                    </div>

                    <div className="stage-content-box">
                      <div className="stage-header-line">
                        <span className="stage-title-text">{stage.title}</span>
                        {isCurrent && (
                          <span className="editorial-badge badge-accent">IN PROGRESS</span>
                        )}
                        {isCompleted && (
                          <span className="editorial-badge badge-success">COMPLETED</span>
                        )}
                        {isRejected && (
                          <span className="editorial-badge badge-error">UNSUCCESSFUL</span>
                        )}
                      </div>

                      <p className="stage-desc-text">{stage.description}</p>

                      <div className="stage-meta-line">
                        <span>{stage.date}</span>
                        {stage.reference && (
                          <>
                            <span>·</span>
                            <span>{stage.reference}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Company & Review Notes */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div className="tracking-sidebar-card">
              <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "17px", margin: "0 0 12px", color: "var(--text-primary)" }}>
                Recruiter Organization
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px" }}>
                <div>
                  <span style={{ color: "var(--text-muted)", fontSize: "11.5px", display: "block" }}>Company Name</span>
                  <strong style={{ color: "var(--text-primary)" }}>{company?.name}</strong>
                </div>
                {company?.industry && (
                  <div>
                    <span style={{ color: "var(--text-muted)", fontSize: "11.5px", display: "block" }}>Industry</span>
                    <span>{company.industry}</span>
                  </div>
                )}
                {company?.headquarters && (
                  <div>
                    <span style={{ color: "var(--text-muted)", fontSize: "11.5px", display: "block" }}>Headquarters</span>
                    <span>{company.headquarters}</span>
                  </div>
                )}
                {drive?.location && (
                  <div>
                    <span style={{ color: "var(--text-muted)", fontSize: "11.5px", display: "block" }}>Work Location</span>
                    <span>{drive.location}</span>
                  </div>
                )}
              </div>
            </div>

            {application.reviewNotes && (
              <div className="tracking-sidebar-card" style={{ backgroundColor: "var(--surface-secondary)" }}>
                <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "17px", margin: "0 0 8px", color: "var(--text-primary)" }}>
                  Recruitment Communications
                </h3>
                <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.5, margin: 0 }}>
                  {application.reviewNotes}
                </p>
              </div>
            )}

            <div className="tracking-sidebar-card">
              <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "17px", margin: "0 0 8px", color: "var(--text-primary)" }}>
                Attached Application Resume
              </h3>
              <p style={{ fontSize: "12.5px", color: "var(--text-secondary)", margin: "0 0 12px" }}>
                The verified resume snapshot submitted with this application.
              </p>
              <Link to="/student/resume" className="btn-secondary btn-sm" style={{ display: "inline-flex", width: "100%", justifyContent: "center" }}>
                <FileText size={14} />
                <span>View in Resume Management</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
