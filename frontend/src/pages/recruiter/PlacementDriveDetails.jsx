import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Briefcase,
  Calendar,
  DollarSign,
  MapPin,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Edit,
  GraduationCap,
  Sparkles,
  Layers,
  FileCheck,
  Building2,
  ChevronRight,
} from "lucide-react";
import AppLayout from "../../components/ui/AppLayout.jsx";
import { PageHeader } from "../../components/ui/EditorialComponents.jsx";
import { recruiterApi } from "../../api/recruiterApi.js";
import "./PlacementDriveDetails.css";

export default function PlacementDriveDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [drive, setDrive] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  const fetchDriveDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await recruiterApi.getDriveById(id);
      setDrive(res.drive);
    } catch (err) {
      setError(err.message || "Failed to load placement drive details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDriveDetails();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    try {
      setError(null);
      await recruiterApi.updateDriveStatus(id, newStatus);
      setActionSuccess(`Drive status updated to ${newStatus}.`);
      fetchDriveDetails();
    } catch (err) {
      setError(err.message || "Failed to update drive status");
    }
  };

  if (loading) {
    return (
      <AppLayout pageTitle="Drive Details" breadcrumb="Recruiter Portal / Drives / Details">
        <div className="details-loading-card">
          <div className="loading-spinner" />
          <p>Loading placement drive specifications...</p>
        </div>
      </AppLayout>
    );
  }

  if (error || !drive) {
    return (
      <AppLayout pageTitle="Drive Details" breadcrumb="Recruiter Portal / Drives / Details">
        <div className="details-error-card">
          <AlertCircle size={36} color="#B93838" />
          <h3>Unable to Load Placement Drive</h3>
          <p>{error || "Drive not found or access restricted to your company."}</p>
          <Link to="/recruiter/drives" className="btn-back-link">
            ← Back to Placement Drives
          </Link>
        </div>
      </AppLayout>
    );
  }

  const criteria = drive.criteria || {};
  const statusBreakdown = drive.statusBreakdown || {};
  const deadlineDate = new Date(drive.applicationDeadline);
  const isExpired = deadlineDate < new Date();

  return (
    <AppLayout pageTitle={drive.title} breadcrumb="Recruiter Portal / Drives / Specification">
      <div className="drive-details-root">
        {/* Back Link */}
        <div className="back-nav-row">
          <Link to="/recruiter/drives" className="btn-back-link">
            <ArrowLeft size={14} /> Back to Placement Drives
          </Link>
        </div>

        {/* Page Header */}
        <PageHeader
          eyebrow={`Campus Drive · ${drive.jobType || "Full-time"}`}
          title={drive.title}
          description={`Created on ${new Date(drive.createdAt).toLocaleDateString()} · Application deadline ${deadlineDate.toLocaleDateString()}`}
          actions={
            <div className="details-header-actions">
              <Link to={`/recruiter/applicants?driveId=${drive._id}`} className="btn-view-applicants">
                <Users size={15} />
                View {drive.totalApplicants || 0} Applicants
              </Link>

              <button
                type="button"
                className="btn-edit-drive"
                onClick={() => navigate(`/recruiter/drives/${drive._id}/edit`)}
              >
                <Edit size={14} />
                Edit Drive
              </button>
            </div>
          }
        />

        {actionSuccess && (
          <div className="alert-banner alert-success">
            <CheckCircle2 size={16} />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* Quick Metrics Bar */}
        <div className="drive-metrics-bar">
          <div className="drive-metric-box">
            <span className="metric-box-label">Total Applications</span>
            <span className="metric-box-val">{drive.totalApplicants || 0}</span>
          </div>
          <div className="drive-metric-box">
            <span className="metric-box-label">Under Review</span>
            <span className="metric-box-val">{statusBreakdown.under_review || 0}</span>
          </div>
          <div className="drive-metric-box">
            <span className="metric-box-label">Shortlisted</span>
            <span className="metric-box-val">{statusBreakdown.shortlisted || 0}</span>
          </div>
          <div className="drive-metric-box">
            <span className="metric-box-label">Interviews</span>
            <span className="metric-box-val">{statusBreakdown.interview || 0}</span>
          </div>
          <div className="drive-metric-box">
            <span className="metric-box-label">Selected</span>
            <span className="metric-box-val">{statusBreakdown.selected || 0}</span>
          </div>
          <div className="drive-metric-box">
            <span className="metric-box-label">Drive Status</span>
            <span className={`status-pill pill-${drive.status}`}>
              {drive.status.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Lifecycle Action Bar */}
        <div className="lifecycle-action-strip">
          <div className="lifecycle-info">
            <Clock size={16} color="#68766D" />
            <span>
              Application Window:{" "}
              <strong>
                {deadlineDate.toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </strong>
              {isExpired && drive.status === "published" && " (Expired)"}
            </span>
          </div>

          <div className="lifecycle-buttons">
            {drive.status === "draft" && (
              <button
                type="button"
                className="btn-publish-lifecycle"
                onClick={() => handleStatusChange("published")}
              >
                Publish Opportunity Now
              </button>
            )}

            {drive.status === "published" && (
              <button
                type="button"
                className="btn-close-lifecycle"
                onClick={() => handleStatusChange("closed")}
              >
                Close Application Window
              </button>
            )}
          </div>
        </div>

        {/* Details Grid */}
        <div className="drive-spec-grid">
          {/* Left Column: Job Description & Eligibility */}
          <div className="drive-spec-main">
            {/* Opportunity Summary */}
            <div className="spec-card">
              <h3 className="spec-card-title">Role Overview & Team Mission</h3>
              <p className="spec-description">{drive.description}</p>

              {drive.responsibilities && drive.responsibilities.length > 0 && (
                <div className="responsibilities-block">
                  <h4>Core Responsibilities</h4>
                  <ul>
                    {drive.responsibilities.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Eligibility Specification */}
            <div className="spec-card">
              <div className="spec-card-header">
                <GraduationCap size={18} color="#3F754B" />
                <h3 className="spec-card-title">Institutional Eligibility Rules</h3>
              </div>

              <div className="eligibility-table-wrap">
                <table className="eligibility-table">
                  <tbody>
                    <tr>
                      <th>Minimum CGPA</th>
                      <td>
                        <strong>{drive.minCGPA || criteria.minimumCgpa || "No threshold"}</strong>
                      </td>
                    </tr>
                    <tr>
                      <th>Active Backlogs</th>
                      <td>
                        <strong>
                          {drive.maxActiveBacklogs != null
                            ? `Maximum ${drive.maxActiveBacklogs} backlogs`
                            : "Zero backlogs allowed"}
                        </strong>
                      </td>
                    </tr>
                    <tr>
                      <th>Eligible Degrees</th>
                      <td>
                        <div className="tags-flex">
                          {(drive.eligibleDegrees || criteria.allowedDegrees || ["All"]).map((d) => (
                            <span key={d} className="degree-tag">
                              {d}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th>Eligible Departments</th>
                      <td>
                        <div className="tags-flex">
                          {(drive.eligibleDepartments || criteria.allowedDepartments || ["All Departments"]).map(
                            (dep) => (
                              <span key={dep} className="dept-tag">
                                {dep}
                              </span>
                            )
                          )}
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th>Passing Out Batches</th>
                      <td>
                        <div className="tags-flex">
                          {(drive.graduationYears || criteria.graduationYears || ["Open"]).map((yr) => (
                            <span key={yr} className="year-tag">
                              Class of {yr}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Selection Rounds */}
            <div className="spec-card">
              <div className="spec-card-header">
                <Layers size={18} color="#3F754B" />
                <h3 className="spec-card-title">Recruitment & Evaluation Workflow</h3>
              </div>

              {drive.rounds && drive.rounds.length > 0 ? (
                <div className="rounds-timeline">
                  {drive.rounds.map((round, index) => (
                    <div key={index} className="round-node">
                      <div className="round-badge">{index + 1}</div>
                      <div className="round-details">
                        <strong>{round}</strong>
                        <span>Selection & Evaluation Stage</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-data-text">Standard 3-Stage Campus Evaluation Workflow configured.</p>
              )}
            </div>
          </div>

          {/* Right Column: Parameters & Metadata */}
          <div className="drive-spec-side">
            <div className="spec-side-card">
              <h4 className="side-title">Placement Drive Summary</h4>

              <div className="side-info-row">
                <span className="side-label">Compensation (CTC)</span>
                <strong className="side-val">
                  {drive.ctcMin && drive.ctcMax
                    ? `${drive.ctcMin}–${drive.ctcMax} LPA`
                    : drive.salary || "Competitive"}
                </strong>
              </div>

              <div className="side-info-row">
                <span className="side-label">Anticipated Openings</span>
                <strong className="side-val">{drive.openings || 1} Positions</strong>
              </div>

              <div className="side-info-row">
                <span className="side-label">Work Mode</span>
                <strong className="side-val">{drive.location || "On-site"}</strong>
              </div>

              <div className="side-info-row">
                <span className="side-label">Employment Type</span>
                <strong className="side-val">{drive.jobType || "Full-time"}</strong>
              </div>

              <div className="side-info-row">
                <span className="side-label">Drive Assessment Date</span>
                <strong className="side-val">
                  {drive.driveDate
                    ? new Date(drive.driveDate).toLocaleDateString()
                    : "To be announced"}
                </strong>
              </div>
            </div>

            {/* Skills Card */}
            <div className="spec-side-card">
              <h4 className="side-title">Required Competencies</h4>
              <div className="skills-wrap">
                {drive.requiredSkills && drive.requiredSkills.length > 0 ? (
                  drive.requiredSkills.map((sk) => (
                    <span key={sk} className="skill-chip">
                      {sk}
                    </span>
                  ))
                ) : (
                  <span className="no-data-text">No technical skills configured</span>
                )}
              </div>
            </div>

            {/* Quick Action Button Card */}
            <div className="spec-side-card cta-card">
              <h4>Manage Candidate Pool</h4>
              <p>Review applicants, evaluate resumes, and advance candidates to shortlisting.</p>
              <Link
                to={`/recruiter/applicants?driveId=${drive._id}`}
                className="btn-full-cta"
              >
                Review Applications ({drive.totalApplicants || 0})
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
