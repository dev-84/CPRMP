import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import {
  TrendingUp,
  CheckCircle2,
  Clock,
  Users,
  Search,
  Filter,
  ArrowRight,
  Eye,
  AlertCircle,
  FileCheck,
  ChevronRight,
  UserCheck,
  XCircle,
} from "lucide-react";
import AppLayout from "../../components/ui/AppLayout.jsx";
import {
  PageHeader,
  ApplicationStatusBadge,
} from "../../components/ui/EditorialComponents.jsx";
import { recruiterApi } from "../../api/recruiterApi.js";
import "./RecruitmentStatusPage.css";

export default function RecruitmentStatusPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const driveId = searchParams.get("driveId") || "all";
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await recruiterApi.getRecruitmentStatus({ driveId });
      setData(res);
    } catch (err) {
      setError(err.message || "Failed to load recruitment pipeline summary");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, [driveId]);

  const pipeline = data?.pipelineCounts || {
    applied: 0,
    under_review: 0,
    shortlisted: 0,
    interview: 0,
    selected: 0,
    rejected: 0,
    withdrawn: 0,
  };

  const drivesList = data?.drivesList || [];
  const candidates = data?.candidates || [];

  const filteredCandidates = candidates.filter((c) => {
    if (!searchTerm.trim()) return true;
    const s = searchTerm.toLowerCase();
    return c.studentName.toLowerCase().includes(s) || c.rollNo.toLowerCase().includes(s);
  });

  return (
    <AppLayout
      pageTitle="Recruitment Status"
      breadcrumb="Recruiter Portal / Hiring Outcomes"
    >
      <div className="recruitment-status-root">
        {/* Page Header */}
        <PageHeader
          eyebrow="Talent Acquisition Pipeline"
          title="Recruitment Status & Pipeline"
          description="Track applicant flow from initial submission through technical evaluation, interview rounds, and employment offer issuance."
          actions={
            <div className="header-controls-wrap">
              <select
                value={driveId}
                onChange={(e) => {
                  const next = new URLSearchParams(searchParams);
                  if (e.target.value !== "all") next.set("driveId", e.target.value);
                  else next.delete("driveId");
                  setSearchParams(next);
                }}
                className="drive-select-dropdown"
              >
                <option value="all">All Company Placement Drives</option>
                {drivesList.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.title}
                  </option>
                ))}
              </select>
            </div>
          }
        />

        {error && (
          <div className="alert-banner alert-error">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="status-loading-card">
            <div className="loading-spinner" />
            <p>Aggregating candidate recruitment stages...</p>
          </div>
        ) : (
          <>
            {/* Visual Pipeline Funnel Strip */}
            <div className="funnel-pipeline-card">
              <h3 className="pipeline-card-title">Hiring Stage Funnel</h3>

              <div className="funnel-steps-container">
                {/* Stage 1: Applied */}
                <div className="funnel-step">
                  <div className="funnel-step-header">
                    <span className="step-number">01</span>
                    <span className="step-name">Applied</span>
                  </div>
                  <div className="funnel-step-count">{pipeline.applied}</div>
                  <span className="funnel-step-desc">New Submissions</span>
                </div>

                <div className="funnel-arrow">
                  <ChevronRight size={20} color="#8A948C" />
                </div>

                {/* Stage 2: Under Review */}
                <div className="funnel-step">
                  <div className="funnel-step-header">
                    <span className="step-number">02</span>
                    <span className="step-name">Under Review</span>
                  </div>
                  <div className="funnel-step-count">{pipeline.under_review}</div>
                  <span className="funnel-step-desc">Profile Audited</span>
                </div>

                <div className="funnel-arrow">
                  <ChevronRight size={20} color="#8A948C" />
                </div>

                {/* Stage 3: Shortlisted */}
                <div className="funnel-step">
                  <div className="funnel-step-header">
                    <span className="step-number">03</span>
                    <span className="step-name">Shortlisted</span>
                  </div>
                  <div className="funnel-step-count highlight-shortlist">{pipeline.shortlisted}</div>
                  <span className="funnel-step-desc">Test Qualified</span>
                </div>

                <div className="funnel-arrow">
                  <ChevronRight size={20} color="#8A948C" />
                </div>

                {/* Stage 4: Interview */}
                <div className="funnel-step">
                  <div className="funnel-step-header">
                    <span className="step-number">04</span>
                    <span className="step-name">Interview</span>
                  </div>
                  <div className="funnel-step-count highlight-interview">{pipeline.interview}</div>
                  <span className="funnel-step-desc">Panel Assessment</span>
                </div>

                <div className="funnel-arrow">
                  <ChevronRight size={20} color="#8A948C" />
                </div>

                {/* Stage 5: Selected */}
                <div className="funnel-step highlight-selected-step">
                  <div className="funnel-step-header">
                    <span className="step-number">05</span>
                    <span className="step-name">Selected</span>
                  </div>
                  <div className="funnel-step-count highlight-selected">{pipeline.selected}</div>
                  <span className="funnel-step-desc">Offer Extended</span>
                </div>
              </div>

              {/* Terminal Outcomes Strip */}
              <div className="terminal-outcomes-strip">
                <div className="terminal-box">
                  <span className="terminal-label">Applications Rejected:</span>
                  <strong className="terminal-val text-red">{pipeline.rejected}</strong>
                </div>
                <div className="terminal-box">
                  <span className="terminal-label">Withdrawn by Student:</span>
                  <strong className="terminal-val text-muted">{pipeline.withdrawn}</strong>
                </div>
              </div>
            </div>

            {/* Candidates Tracking Table Panel */}
            <div className="candidates-tracking-panel">
              <div className="tracking-panel-header">
                <div>
                  <h3 className="tracking-title">Candidate Pipeline Roster</h3>
                  <p className="tracking-subtitle">
                    Live candidate tracking across authorized company recruitment drives.
                  </p>
                </div>

                <div className="tracking-search-box">
                  <Search size={15} color="#8A948C" />
                  <input
                    type="text"
                    placeholder="Search roster by candidate or roll no..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {filteredCandidates.length === 0 ? (
                <div className="panel-empty-state">
                  <Users size={32} color="#8A948C" />
                  <p>No candidate records found for the selected drive filter.</p>
                </div>
              ) : (
                <div className="table-scroll-container">
                  <table className="tracking-table">
                    <thead>
                      <tr>
                        <th>Candidate</th>
                        <th>Roll Number</th>
                        <th>Placement Drive</th>
                        <th>Application Date</th>
                        <th>Recruitment Stage</th>
                        <th>Interview Round</th>
                        <th>Last Updated</th>
                        <th style={{ textAlign: "right" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCandidates.map((cand) => (
                        <tr key={cand._id}>
                          <td>
                            <div className="candidate-cell">
                              <span className="candidate-avatar">
                                {cand.studentName.charAt(0).toUpperCase()}
                              </span>
                              <div className="candidate-name">{cand.studentName}</div>
                            </div>
                          </td>
                          <td>
                            <span className="code-badge">{cand.rollNo}</span>
                          </td>
                          <td>
                            <span className="drive-tag">{cand.driveTitle}</span>
                          </td>
                          <td>
                            <span className="date-text">
                              {new Date(cand.appliedAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </td>
                          <td>
                            <ApplicationStatusBadge status={cand.status} />
                          </td>
                          <td>
                            <span className="round-text">
                              {cand.interviewRound || "—"}
                            </span>
                          </td>
                          <td>
                            <span className="date-text">
                              {cand.updatedAt
                                ? new Date(cand.updatedAt).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                  })
                                : "—"}
                            </span>
                          </td>
                          <td>
                            <div className="table-actions-cell">
                              <button
                                type="button"
                                className="action-btn-view"
                                onClick={() => navigate(`/recruiter/applicants/${cand._id}`)}
                              >
                                <Eye size={13} /> Review Dossier
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
