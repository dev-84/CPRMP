import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Users,
  Search,
  Filter,
  FileText,
  Eye,
  CheckCircle2,
  Clock,
  UserCheck,
  ChevronRight,
  AlertCircle,
  Briefcase,
  X,
  Sparkles,
  Download,
} from "lucide-react";
import AppLayout from "../../components/ui/AppLayout.jsx";
import {
  PageHeader,
  ApplicationStatusBadge,
} from "../../components/ui/EditorialComponents.jsx";
import ResumePreviewModal from "../../components/ui/ResumePreviewModal.jsx";
import { recruiterApi } from "../../api/recruiterApi.js";
import "./ApplicantsList.css";

export default function ApplicantsList() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [applicants, setApplicants] = useState([]);
  const [drivesList, setDrivesList] = useState([]);
  const [metrics, setMetrics] = useState({
    totalApplications: 0,
    underReview: 0,
    shortlisted: 0,
    interview: 0,
    selected: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  // Filters from Query Params
  const driveId = searchParams.get("driveId") || "all";
  const status = searchParams.get("status") || "all";
  const search = searchParams.get("search") || "";
  const program = searchParams.get("program") || "all";
  const minCgpa = searchParams.get("minCgpa") || "";

  const [searchInput, setSearchInput] = useState(search);

  // Resume Modal State
  const [resumeModal, setResumeModal] = useState({
    isOpen: false,
    resumeId: null,
    candidateName: "",
  });

  // Status Update Dialog State
  const [statusDialog, setStatusDialog] = useState(null); // { appId, candidateName, nextStatus, note }

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await recruiterApi.getApplicants({
        driveId,
        status,
        search,
        program,
        minCgpa,
      });
      setApplicants(res.applicants || []);
      setMetrics(res.summaryMetrics || {});
      setDrivesList(res.drivesList || []);
    } catch (err) {
      setError(err.message || "Failed to load candidate applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [driveId, status, search, program, minCgpa]);

  const updateParam = (key, val) => {
    const next = new URLSearchParams(searchParams);
    if (val && val !== "all") {
      next.set(key, val);
    } else {
      next.delete(key);
    }
    setSearchParams(next);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParam("search", searchInput.trim());
  };

  const handleQuickStatusSubmit = async () => {
    if (!statusDialog) return;
    try {
      setError(null);
      await recruiterApi.updateApplicantStatus(statusDialog.appId, {
        status: statusDialog.nextStatus,
        note: statusDialog.note,
      });
      setActionSuccess(`Candidate status updated to ${statusDialog.nextStatus}.`);
      setStatusDialog(null);
      fetchApplicants();
    } catch (err) {
      setError(err.message || "Status update failed");
    }
  };

  return (
    <AppLayout
      pageTitle="Applicants"
      breadcrumb="Recruiter Portal / Applicants"
    >
      <div className="applicants-list-root">
        {/* Page Header */}
        <PageHeader
          eyebrow="Candidate Review & Shortlisting"
          title="Applicants"
          description="Review student dossiers, evaluate verified resumes, and manage hiring progression across placement drives."
          actions={
            <Link to="/recruiter/shortlisting" className="btn-open-shortlisting">
              <UserCheck size={16} /> Open Shortlisting Workspace
            </Link>
          }
        />

        {actionSuccess && (
          <div className="alert-banner alert-success">
            <CheckCircle2 size={16} />
            <span>{actionSuccess}</span>
          </div>
        )}

        {error && (
          <div className="alert-banner alert-error">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Summary Metric Strip */}
        <div className="applicants-summary-strip">
          <div
            className={`metric-pill ${status === "all" ? "active" : ""}`}
            onClick={() => updateParam("status", "all")}
          >
            <span className="metric-pill-label">Total Applications</span>
            <strong className="metric-pill-val">{metrics.totalApplications || 0}</strong>
          </div>
          <div
            className={`metric-pill ${status === "under_review" ? "active" : ""}`}
            onClick={() => updateParam("status", "under_review")}
          >
            <span className="metric-pill-label">Under Review</span>
            <strong className="metric-pill-val">{metrics.underReview || 0}</strong>
          </div>
          <div
            className={`metric-pill ${status === "shortlisted" ? "active" : ""}`}
            onClick={() => updateParam("status", "shortlisted")}
          >
            <span className="metric-pill-label">Shortlisted</span>
            <strong className="metric-pill-val">{metrics.shortlistedCount || metrics.shortlisted || 0}</strong>
          </div>
          <div
            className={`metric-pill ${status === "interview" ? "active" : ""}`}
            onClick={() => updateParam("status", "interview")}
          >
            <span className="metric-pill-label">Interview Stage</span>
            <strong className="metric-pill-val">{metrics.interview || 0}</strong>
          </div>
          <div
            className={`metric-pill ${status === "selected" ? "active" : ""}`}
            onClick={() => updateParam("status", "selected")}
          >
            <span className="metric-pill-label">Offers Issued</span>
            <strong className="metric-pill-val">{metrics.selected || 0}</strong>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="applicants-toolbar">
          <form onSubmit={handleSearchSubmit} className="search-form">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search by student name, roll no, drive..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            {searchInput && (
              <button
                type="button"
                className="btn-clear-search"
                onClick={() => {
                  setSearchInput("");
                  updateParam("search", "");
                }}
              >
                Clear
              </button>
            )}
          </form>

          <div className="filters-row">
            {/* Drive Filter */}
            <select
              value={driveId}
              onChange={(e) => updateParam("driveId", e.target.value)}
              className="toolbar-select"
            >
              <option value="all">All Placement Drives</option>
              {drivesList.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.title}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={status}
              onChange={(e) => updateParam("status", e.target.value)}
              className="toolbar-select"
            >
              <option value="all">All Statuses</option>
              <option value="submitted">Submitted (New)</option>
              <option value="under_review">Under Review</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="interview">Interview</option>
              <option value="selected">Selected</option>
              <option value="rejected">Rejected</option>
            </select>

            {/* Program Filter */}
            <select
              value={program}
              onChange={(e) => updateParam("program", e.target.value)}
              className="toolbar-select"
            >
              <option value="all">All Degree Programs</option>
              <option value="MCA">MCA</option>
              <option value="B.Tech">B.Tech CS / IT</option>
              <option value="M.Tech">M.Tech</option>
            </select>

            {/* Min CGPA Filter */}
            <select
              value={minCgpa}
              onChange={(e) => updateParam("minCgpa", e.target.value)}
              className="toolbar-select"
            >
              <option value="">Any CGPA</option>
              <option value="7.0">CGPA ≥ 7.0</option>
              <option value="8.0">CGPA ≥ 8.0</option>
              <option value="8.5">CGPA ≥ 8.5</option>
              <option value="9.0">CGPA ≥ 9.0</option>
            </select>
          </div>
        </div>

        {/* Applicants Table */}
        <div className="applicants-table-card">
          {loading ? (
            <div className="table-loading-state">
              <div className="loading-spinner" />
              <p>Loading candidate applications...</p>
            </div>
          ) : applicants.length === 0 ? (
            <div className="table-empty-state">
              <Users size={36} color="#8A948C" />
              <h3>No Candidate Applications Found</h3>
              <p>
                {search || status !== "all" || driveId !== "all" || program !== "all"
                  ? "No applicants match your current search and filter combination."
                  : "No students have applied to your published placement drives yet."}
              </p>
            </div>
          ) : (
            <div className="table-scroll-container">
              <table className="applicants-table">
                <thead>
                  <tr>
                    <th>Candidate</th>
                    <th>Roll Number</th>
                    <th>Academic Program</th>
                    <th>CGPA</th>
                    <th>Backlogs</th>
                    <th>Applied Drive</th>
                    <th>Applied Date</th>
                    <th>Status</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applicants.map((app) => (
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
                      <td>
                        <div className="program-cell">
                          <span>{app.degree}</span>
                          <small>{app.department}</small>
                        </div>
                      </td>
                      <td>
                        <strong>{app.cgpa != null ? app.cgpa.toFixed(2) : "—"}</strong>
                      </td>
                      <td>
                        <span className={app.activeBacklogs > 0 ? "text-backlog" : "text-clean"}>
                          {app.activeBacklogs}
                        </span>
                      </td>
                      <td>
                        <span className="drive-tag" title={app.appliedDrive}>
                          {app.appliedDrive}
                        </span>
                      </td>
                      <td>
                        <span className="date-text">
                          {new Date(app.appliedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </td>
                      <td>
                        <ApplicationStatusBadge status={app.status} />
                      </td>
                      <td>
                        <div className="table-actions-cell">
                          {/* Resume Preview Action */}
                          {app.resumeId ? (
                            <button
                              type="button"
                              className="action-btn-resume"
                              onClick={() =>
                                setResumeModal({
                                  isOpen: true,
                                  resumeId: app.resumeId,
                                  candidateName: app.studentName,
                                })
                              }
                              title="Preview Candidate Resume"
                            >
                              <FileText size={13} />
                              Resume
                            </button>
                          ) : (
                            <span className="no-resume-text" title="Candidate has not attached resume">
                              No Resume
                            </span>
                          )}

                          {/* Full Dossier Action */}
                          <button
                            type="button"
                            className="action-btn-view"
                            onClick={() => navigate(`/recruiter/applicants/${app._id}`)}
                            title="View Full Academic Dossier"
                          >
                            <Eye size={13} /> Dossier
                          </button>

                          {/* Quick Workflow Action */}
                          {app.status === "submitted" && (
                            <button
                              type="button"
                              className="action-btn-review"
                              onClick={() =>
                                setStatusDialog({
                                  appId: app._id,
                                  candidateName: app.studentName,
                                  nextStatus: "under_review",
                                  note: "Candidate placed under formal evaluation",
                                })
                              }
                            >
                              Review
                            </button>
                          )}

                          {app.status === "under_review" && (
                            <button
                              type="button"
                              className="action-btn-shortlist"
                              onClick={() =>
                                setStatusDialog({
                                  appId: app._id,
                                  candidateName: app.studentName,
                                  nextStatus: "shortlisted",
                                  note: "Candidate shortlisted based on technical credentials",
                                })
                              }
                            >
                              Shortlist
                            </button>
                          )}

                          {app.status === "shortlisted" && (
                            <button
                              type="button"
                              className="action-btn-interview"
                              onClick={() =>
                                setStatusDialog({
                                  appId: app._id,
                                  candidateName: app.studentName,
                                  nextStatus: "interview",
                                  note: "Invited to Technical Round 1",
                                })
                              }
                            >
                              Interview
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Resume Preview Modal */}
        <ResumePreviewModal
          isOpen={resumeModal.isOpen}
          onClose={() => setResumeModal({ isOpen: false, resumeId: null, candidateName: "" })}
          resumeId={resumeModal.resumeId}
          candidateName={resumeModal.candidateName}
        />

        {/* Quick Status Update Modal */}
        {statusDialog && (
          <div className="modal-backdrop" onClick={() => setStatusDialog(null)}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <UserCheck size={22} color="#3F754B" />
                <h3>Update Candidate Stage</h3>
              </div>
              <p className="modal-text">
                Advance <strong>{statusDialog.candidateName}</strong> to{" "}
                <span className="target-status-pill">{statusDialog.nextStatus.toUpperCase()}</span>?
              </p>

              <div className="dialog-note-input">
                <label>Recruiter Review Note (Optional):</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Strong foundation in distributed systems and data structures..."
                  value={statusDialog.note}
                  onChange={(e) =>
                    setStatusDialog((prev) => ({ ...prev, note: e.target.value }))
                  }
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="modal-btn-cancel"
                  onClick={() => setStatusDialog(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="modal-btn-confirm"
                  onClick={handleQuickStatusSubmit}
                >
                  Confirm Transition
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
