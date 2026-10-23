import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Briefcase,
  Users,
  CheckCircle2,
  Clock,
  Building2,
  Calendar,
  ArrowRight,
  PlusCircle,
  FileText,
  UserCheck,
  TrendingUp,
  AlertCircle,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import AppLayout from "../../components/ui/AppLayout.jsx";
import {
  PageHeader,
  MetricRow,
  MetricItem,
  ApplicationStatusBadge,
  CompanyLogo,
  PrimaryButton,
  SecondaryButton,
  EmptyState,
} from "../../components/ui/EditorialComponents.jsx";
import { recruiterApi } from "../../api/recruiterApi.js";
import "./RecruiterDashboard.css";

export default function RecruiterDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await recruiterApi.getDashboard();
      setData(res);
    } catch (err) {
      setError(err.message || "Failed to load recruiter dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const metrics = data?.metrics || {
    totalDrives: 0,
    activeDrivesCount: 0,
    totalApplications: 0,
    uniqueCandidatesCount: 0,
    shortlistedCount: 0,
    interviewCount: 0,
    selectedCount: 0,
    underReviewCount: 0,
    submittedCount: 0,
  };

  const statusBreakdown = data?.statusBreakdown || {};
  const recentApplicants = data?.recentApplicants || [];
  const upcomingDeadlines = data?.upcomingDeadlines || [];
  const company = data?.company;
  const recruiter = data?.recruiter;

  return (
    <AppLayout
      pageTitle="Recruiter Dashboard"
      breadcrumb="Recruiter Portal / Overview"
    >
      <div className="recruiter-dashboard-root">
        {/* Page Header */}
        <PageHeader
          eyebrow={company ? `${company.name} · ${company.industry || "Recruiter Workspace"}` : "Authorized Recruiter Workspace"}
          title="Recruiter Dashboard"
          description="Manage your recruitment drives, review candidates, and track hiring progress across campus placement cycles."
          actions={
            <div className="dashboard-header-actions">
              <button
                type="button"
                className="btn-create-drive"
                onClick={() => navigate("/recruiter/drives/create")}
              >
                <PlusCircle size={16} />
                Create Placement Drive
              </button>
            </div>
          }
        />

        {/* Company & Recruiter Identity Strip */}
        <div className="recruiter-identity-banner">
          <div className="identity-left">
            <div className="company-avatar-box">
              {company?.name ? company.name.substring(0, 2).toUpperCase() : "CO"}
            </div>
            <div>
              <div className="identity-company-title">
                <strong>{company?.name || "Company"}</strong>
                <span className="badge-verified">
                  <CheckCircle2 size={12} /> Institutional Partner
                </span>
              </div>
              <p className="identity-recruiter-sub">
                Logged in as <strong>{recruiter?.name || "Recruiter"}</strong> ({recruiter?.jobTitle || "Talent Acquisition"}) · {company?.headquarters || "India"}
              </p>
            </div>
          </div>
          <div className="identity-right">
            <Link to="/recruiter/company" className="btn-manage-company">
              <Building2 size={14} /> Company Profile
            </Link>
          </div>
        </div>

        {(!company || data?.unassigned) && (
          <div className="alert-banner alert-warning" style={{ backgroundColor: "#FFFBEB", border: "1px solid #FDE68A", color: "#92400E", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", borderRadius: "8px", margin: "16px 0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Building2 size={20} color="#D97706" />
              <div>
                <strong>Corporate Partnership Required:</strong>
                <span style={{ marginLeft: "6px" }}>Your recruiter account is not yet affiliated with an authorized company. Connect an enterprise partner to unlock placement drives, applicants, and shortlisting.</span>
              </div>
            </div>
            <Link to="/recruiter/company" className="btn-manage-company" style={{ backgroundColor: "#D97706", color: "#FFFFFF", borderColor: "#D97706", flexShrink: 0 }}>
              Connect Company →
            </Link>
          </div>
        )}

        {loading ? (
          <div className="dashboard-loading-state">
            <div className="loading-spinner" />
            <p>Loading real recruitment metrics and drive schedules...</p>
          </div>
        ) : error ? (
          <div className="dashboard-error-state">
            <AlertCircle size={24} color="#B93838" />
            <p>{error}</p>
            <button type="button" onClick={fetchDashboard} className="btn-retry">
              Retry Load
            </button>
          </div>
        ) : (
          <>
            {/* Primary Stat Cards */}
            <div className="stat-cards-grid">
              <div className="stat-card-custom">
                <div className="stat-top">
                  <span className="stat-label">Total Placement Drives</span>
                  <div className="stat-icon-wrapper icon-green">
                    <Briefcase size={18} />
                  </div>
                </div>
                <div className="stat-value">{metrics.totalDrives}</div>
                <div className="stat-sub">
                  <span>{metrics.activeDrivesCount} active</span> drives currently accepting applications
                </div>
              </div>

              <div className="stat-card-custom">
                <div className="stat-top">
                  <span className="stat-label">Active Drives</span>
                  <div className="stat-icon-wrapper icon-blue">
                    <Clock size={18} />
                  </div>
                </div>
                <div className="stat-value">{metrics.activeDrivesCount}</div>
                <div className="stat-sub">
                  Published campus drives open for student applications
                </div>
              </div>

              <div className="stat-card-custom">
                <div className="stat-top">
                  <span className="stat-label">Total Applications</span>
                  <div className="stat-icon-wrapper icon-purple">
                    <Users size={18} />
                  </div>
                </div>
                <div className="stat-value">{metrics.totalApplications}</div>
                <div className="stat-sub">
                  <span>{metrics.uniqueCandidatesCount} distinct</span> students applied across all drives
                </div>
              </div>

              <div className="stat-card-custom">
                <div className="stat-top">
                  <span className="stat-label">Shortlisted Candidates</span>
                  <div className="stat-icon-wrapper icon-emerald">
                    <UserCheck size={18} />
                  </div>
                </div>
                <div className="stat-value">{metrics.shortlistedCount}</div>
                <div className="stat-sub">
                  <span>{metrics.interviewCount}</span> in interview · <span>{metrics.selectedCount}</span> offers issued
                </div>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="quick-actions-bar">
              <div className="quick-action-item" onClick={() => navigate("/recruiter/drives")}>
                <Briefcase size={16} />
                <span>Placement Drives</span>
                <ChevronRight size={14} />
              </div>
              <div className="quick-action-item" onClick={() => navigate("/recruiter/drives/create")}>
                <PlusCircle size={16} />
                <span>Create Drive</span>
                <ChevronRight size={14} />
              </div>
              <div className="quick-action-item" onClick={() => navigate("/recruiter/applicants")}>
                <Users size={16} />
                <span>Review Applicants</span>
                <ChevronRight size={14} />
              </div>
              <div className="quick-action-item" onClick={() => navigate("/recruiter/shortlisting")}>
                <UserCheck size={16} />
                <span>Manage Shortlisting</span>
                <ChevronRight size={14} />
              </div>
              <div className="quick-action-item" onClick={() => navigate("/recruiter/recruitment-status")}>
                <TrendingUp size={16} />
                <span>Hiring Pipeline</span>
                <ChevronRight size={14} />
              </div>
            </div>

            {/* Main Content Grid: Recent Applicants & Upcoming Deadlines */}
            <div className="dashboard-content-split">
              {/* Left Column: Recent Applicants */}
              <div className="dashboard-main-panel">
                <div className="panel-header">
                  <div>
                    <h2 className="panel-title">Recent Applicants</h2>
                    <p className="panel-subtitle">
                      Latest candidate submissions received for your company's drives.
                    </p>
                  </div>
                  <Link to="/recruiter/applicants" className="panel-link">
                    View All Applicants <ArrowRight size={14} />
                  </Link>
                </div>

                {recentApplicants.length === 0 ? (
                  <div className="panel-empty-state">
                    <FileText size={32} color="#8A948C" />
                    <p>No student applications have been received yet.</p>
                    <small>Applications will appear here once candidates apply to your published drives.</small>
                  </div>
                ) : (
                  <div className="applicants-table-wrapper">
                    <table className="recruiter-table">
                      <thead>
                        <tr>
                          <th>Candidate</th>
                          <th>Roll Number</th>
                          <th>Program</th>
                          <th>Applied Drive</th>
                          <th>CGPA</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentApplicants.map((app) => (
                          <tr key={app._id}>
                            <td>
                              <div className="candidate-cell">
                                <span className="candidate-avatar">
                                  {app.studentName.charAt(0).toUpperCase()}
                                </span>
                                <div>
                                  <div className="candidate-name">{app.studentName}</div>
                                  <div className="candidate-email">{app.studentEmail}</div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className="code-badge">{app.rollNo}</span>
                            </td>
                            <td>{app.program}</td>
                            <td>
                              <span className="drive-tag">{app.appliedDrive}</span>
                            </td>
                            <td>
                              <strong>{app.cgpa != null ? app.cgpa.toFixed(2) : "—"}</strong>
                            </td>
                            <td>
                              <ApplicationStatusBadge status={app.status} />
                            </td>
                            <td>
                              <button
                                type="button"
                                className="table-btn-action"
                                onClick={() => navigate(`/recruiter/applicants/${app._id}`)}
                              >
                                Review Dossier
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Right Column: Deadlines & Recruitment Progress */}
              <div className="dashboard-side-panel">
                {/* Upcoming Deadlines */}
                <div className="side-card">
                  <div className="side-card-header">
                    <div className="side-card-title">
                      <Clock size={16} color="#A96C17" />
                      <h3>Upcoming Drive Deadlines</h3>
                    </div>
                    <Link to="/recruiter/drives" className="side-link">
                      Manage
                    </Link>
                  </div>

                  {upcomingDeadlines.length === 0 ? (
                    <div className="side-empty">
                      <p>No active placement drives with pending deadlines.</p>
                      <button
                        type="button"
                        className="btn-create-small"
                        onClick={() => navigate("/recruiter/drives/create")}
                      >
                        Publish a Drive
                      </button>
                    </div>
                  ) : (
                    <div className="deadlines-list">
                      {upcomingDeadlines.map((drive) => {
                        const deadlineDate = new Date(drive.applicationDeadline);
                        const isExpired = deadlineDate < new Date();
                        return (
                          <div
                            key={drive._id}
                            className="deadline-item"
                            onClick={() => navigate(`/recruiter/drives/${drive._id}`)}
                          >
                            <div className="deadline-item-left">
                              <span className="deadline-drive-title">{drive.title}</span>
                              <div className="deadline-date-row">
                                <Calendar size={12} />
                                <span>
                                  Deadline: {deadlineDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                </span>
                              </div>
                            </div>
                            <div className="deadline-item-right">
                              <span className="applicant-badge-pill">
                                {drive.applicantsCount} applicants
                              </span>
                              <ChevronRight size={14} color="#8A948C" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Pipeline Summary Card */}
                <div className="side-card pipeline-card">
                  <div className="side-card-header">
                    <div className="side-card-title">
                      <TrendingUp size={16} color="#3F754B" />
                      <h3>Application Pipeline</h3>
                    </div>
                    <Link to="/recruiter/recruitment-status" className="side-link">
                      Pipeline View
                    </Link>
                  </div>

                  <div className="pipeline-breakdown">
                    <div className="pipeline-stat-row">
                      <span>Submitted (New)</span>
                      <strong>{statusBreakdown.submitted || 0}</strong>
                    </div>
                    <div className="pipeline-bar-track">
                      <div
                        className="pipeline-bar-fill fill-slate"
                        style={{
                          width: `${metrics.totalApplications ? ((statusBreakdown.submitted || 0) / metrics.totalApplications) * 100 : 0}%`,
                        }}
                      />
                    </div>

                    <div className="pipeline-stat-row">
                      <span>Under Review</span>
                      <strong>{statusBreakdown.under_review || 0}</strong>
                    </div>
                    <div className="pipeline-bar-track">
                      <div
                        className="pipeline-bar-fill fill-blue"
                        style={{
                          width: `${metrics.totalApplications ? ((statusBreakdown.under_review || 0) / metrics.totalApplications) * 100 : 0}%`,
                        }}
                      />
                    </div>

                    <div className="pipeline-stat-row">
                      <span>Shortlisted</span>
                      <strong>{statusBreakdown.shortlisted || 0}</strong>
                    </div>
                    <div className="pipeline-bar-track">
                      <div
                        className="pipeline-bar-fill fill-amber"
                        style={{
                          width: `${metrics.totalApplications ? ((statusBreakdown.shortlisted || 0) / metrics.totalApplications) * 100 : 0}%`,
                        }}
                      />
                    </div>

                    <div className="pipeline-stat-row">
                      <span>Interviews</span>
                      <strong>{statusBreakdown.interview || 0}</strong>
                    </div>
                    <div className="pipeline-bar-track">
                      <div
                        className="pipeline-bar-fill fill-indigo"
                        style={{
                          width: `${metrics.totalApplications ? ((statusBreakdown.interview || 0) / metrics.totalApplications) * 100 : 0}%`,
                        }}
                      />
                    </div>

                    <div className="pipeline-stat-row">
                      <span>Selected (Offers)</span>
                      <strong>{statusBreakdown.selected || 0}</strong>
                    </div>
                    <div className="pipeline-bar-track">
                      <div
                        className="pipeline-bar-fill fill-emerald"
                        style={{
                          width: `${metrics.totalApplications ? ((statusBreakdown.selected || 0) / metrics.totalApplications) * 100 : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
