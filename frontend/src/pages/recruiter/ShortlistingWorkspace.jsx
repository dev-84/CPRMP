import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import {
  UserCheck,
  CheckCircle2,
  Users,
  Search,
  Filter,
  FileText,
  AlertCircle,
  Eye,
  CheckSquare,
  Square,
  ArrowRight,
  Sparkles,
  Calendar,
} from "lucide-react";
import AppLayout from "../../components/ui/AppLayout.jsx";
import {
  PageHeader,
  ApplicationStatusBadge,
} from "../../components/ui/EditorialComponents.jsx";
import ResumePreviewModal from "../../components/ui/ResumePreviewModal.jsx";
import { recruiterApi } from "../../api/recruiterApi.js";
import "./ShortlistingWorkspace.css";

export default function ShortlistingWorkspace() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const driveIdParam = searchParams.get("driveId") || "";
  const searchParam = searchParams.get("search") || "";
  const minCgpaParam = searchParams.get("minCgpa") || "";

  const [drives, setDrives] = useState([]);
  const [selectedDriveId, setSelectedDriveId] = useState(driveIdParam);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  // Search input state
  const [searchInput, setSearchInput] = useState(searchParam);

  // Selection state
  const [selectedIds, setSelectedIds] = useState([]);

  // Bulk action dialog
  const [bulkDialog, setBulkDialog] = useState(null); // { targetStatus, label }
  const [bulkNote, setBulkNote] = useState("");
  const [processing, setProcessing] = useState(false);

  // Resume Modal
  const [resumeModal, setResumeModal] = useState({
    isOpen: false,
    resumeId: null,
    candidateName: "",
  });

  const fetchShortlisting = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await recruiterApi.getShortlisting({
        driveId: selectedDriveId,
        search: searchParam,
        minCgpa: minCgpaParam,
      });

      setDrives(res.drives || []);
      setCandidates(res.candidates || []);
      if (!selectedDriveId && res.selectedDriveId) {
        setSelectedDriveId(res.selectedDriveId);
      }
      setSelectedIds([]); // clear selection upon refresh
    } catch (err) {
      setError(err.message || "Failed to load shortlisting workspace");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShortlisting();
  }, [selectedDriveId, searchParam, minCgpaParam]);

  const handleDriveSelect = (id) => {
    setSelectedDriveId(id);
    const next = new URLSearchParams(searchParams);
    next.set("driveId", id);
    setSearchParams(next);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const next = new URLSearchParams(searchParams);
    if (searchInput.trim()) next.set("search", searchInput.trim());
    else next.delete("search");
    setSearchParams(next);
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.length === candidates.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(candidates.map((c) => c._id));
    }
  };

  const handleToggleCandidate = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleExecuteBulkAction = async () => {
    if (!bulkDialog || selectedIds.length === 0) return;
    try {
      setProcessing(true);
      setError(null);
      const res = await recruiterApi.bulkUpdateApplicantStatus({
        applicationIds: selectedIds,
        status: bulkDialog.targetStatus,
        note: bulkNote || `Bulk status update to ${bulkDialog.label}`,
      });

      setActionSuccess(
        `Successfully updated ${res.updatedCount} candidate(s) to ${bulkDialog.label}.`
      );
      setBulkDialog(null);
      setBulkNote("");
      setSelectedIds([]);
      fetchShortlisting();
    } catch (err) {
      setError(err.message || "Bulk operation encountered errors");
    } finally {
      setProcessing(false);
    }
  };

  const activeDrive = drives.find((d) => d._id === selectedDriveId) || drives[0];

  return (
    <AppLayout
      pageTitle="Shortlisting Workspace"
      breadcrumb="Recruiter Portal / Shortlisting"
    >
      <div className="shortlisting-root">
        {/* Page Header */}
        <PageHeader
          eyebrow="Evaluation & Shortlisting Hub"
          title="Candidate Shortlisting Workspace"
          description="Filter applicant cohorts by institutional criteria, inspect resumes, and execute individual or bulk stage progressions."
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

        {/* Drive Selector Cards Bar */}
        <div className="drive-selector-section">
          <label className="section-selector-title">Select Active Placement Drive:</label>
          <div className="drive-cards-scroll">
            {drives.map((d) => {
              const isSelected = d._id === selectedDriveId;
              return (
                <div
                  key={d._id}
                  className={`drive-select-card ${isSelected ? "selected" : ""}`}
                  onClick={() => handleDriveSelect(d._id)}
                >
                  <strong className="select-card-title">{d.title}</strong>
                  <div className="select-card-meta">
                    <span>
                      <Users size={12} /> {d.totalApplicants || 0} applicants
                    </span>
                    <span>·</span>
                    <span className="text-shortlist">
                      <UserCheck size={12} /> {d.shortlistedCount || 0} shortlisted
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Filters & Bulk Action Strip */}
        <div className="shortlisting-controls-bar">
          <form onSubmit={handleSearchSubmit} className="search-form">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search candidates by name or roll number..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            {searchInput && (
              <button
                type="button"
                className="btn-clear-search"
                onClick={() => {
                  setSearchInput("");
                  const next = new URLSearchParams(searchParams);
                  next.delete("search");
                  setSearchParams(next);
                }}
              >
                Clear
              </button>
            )}
          </form>

          <div className="controls-right-side">
            <select
              value={minCgpaParam}
              onChange={(e) => {
                const next = new URLSearchParams(searchParams);
                if (e.target.value) next.set("minCgpa", e.target.value);
                else next.delete("minCgpa");
                setSearchParams(next);
              }}
              className="toolbar-select"
            >
              <option value="">Filter: All CGPA Ranges</option>
              <option value="7.5">CGPA ≥ 7.5</option>
              <option value="8.0">CGPA ≥ 8.0</option>
              <option value="8.5">CGPA ≥ 8.5</option>
              <option value="9.0">CGPA ≥ 9.0</option>
            </select>
          </div>
        </div>

        {/* Sticky Bulk Action Floating Bar when candidates selected */}
        {selectedIds.length > 0 && (
          <div className="bulk-actions-floating-bar">
            <div className="bulk-selection-info">
              <CheckCircle2 size={18} color="#3F754B" />
              <span>
                <strong>{selectedIds.length}</strong> candidate(s) selected
              </span>
            </div>

            <div className="bulk-action-buttons">
              <button
                type="button"
                className="btn-bulk-shortlist"
                onClick={() =>
                  setBulkDialog({
                    targetStatus: "shortlisted",
                    label: "Shortlisted",
                  })
                }
              >
                Shortlist Selected
              </button>

              <button
                type="button"
                className="btn-bulk-interview"
                onClick={() =>
                  setBulkDialog({
                    targetStatus: "interview",
                    label: "Interview Stage",
                  })
                }
              >
                Advance to Interview
              </button>

              <button
                type="button"
                className="btn-bulk-reject"
                onClick={() =>
                  setBulkDialog({
                    targetStatus: "rejected",
                    label: "Rejected",
                  })
                }
              >
                Reject Selected
              </button>

              <button
                type="button"
                className="btn-bulk-clear"
                onClick={() => setSelectedIds([])}
              >
                Deselect
              </button>
            </div>
          </div>
        )}

        {/* Candidates Table */}
        <div className="shortlisting-table-card">
          {loading ? (
            <div className="table-loading-state">
              <div className="loading-spinner" />
              <p>Loading candidate cohort for shortlisting...</p>
            </div>
          ) : candidates.length === 0 ? (
            <div className="table-empty-state">
              <Users size={36} color="#8A948C" />
              <h3>No Eligible Candidates Found</h3>
              <p>
                {searchParam || minCgpaParam
                  ? "No applicants match your current search and CGPA filter."
                  : "No students have applied to this placement drive yet."}
              </p>
            </div>
          ) : (
            <div className="table-scroll-container">
              <table className="shortlisting-table">
                <thead>
                  <tr>
                    <th style={{ width: "40px" }}>
                      <input
                        type="checkbox"
                        checked={selectedIds.length === candidates.length && candidates.length > 0}
                        onChange={handleToggleSelectAll}
                      />
                    </th>
                    <th>Candidate</th>
                    <th>Roll Number</th>
                    <th>Program</th>
                    <th>CGPA</th>
                    <th>Backlogs</th>
                    <th>Status</th>
                    <th>Resume</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {candidates.map((cand) => {
                    const isSelected = selectedIds.includes(cand._id);
                    return (
                      <tr key={cand._id} className={isSelected ? "row-selected" : ""}>
                        <td>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleCandidate(cand._id)}
                          />
                        </td>
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
                          <span>{cand.degree}</span>
                        </td>
                        <td>
                          <strong className="cgpa-strong">
                            {cand.cgpa != null ? cand.cgpa.toFixed(2) : "—"}
                          </strong>
                        </td>
                        <td>
                          <span className={cand.backlogCount > 0 ? "text-backlog" : "text-clean"}>
                            {cand.backlogCount || 0}
                          </span>
                        </td>
                        <td>
                          <ApplicationStatusBadge status={cand.status} />
                        </td>
                        <td>
                          {cand.resumeId ? (
                            <button
                              type="button"
                              className="action-btn-resume"
                              onClick={() =>
                                setResumeModal({
                                  isOpen: true,
                                  resumeId: cand.resumeId,
                                  candidateName: cand.studentName,
                                })
                              }
                            >
                              <FileText size={13} />
                              Preview
                            </button>
                          ) : (
                            <span className="no-resume-text">None</span>
                          )}
                        </td>
                        <td>
                          <div className="table-actions-cell">
                            <button
                              type="button"
                              className="action-btn-view"
                              onClick={() => navigate(`/recruiter/applicants/${cand._id}`)}
                            >
                              <Eye size={13} /> Dossier
                            </button>

                            {cand.status !== "shortlisted" && cand.status !== "interview" && cand.status !== "selected" && (
                              <button
                                type="button"
                                className="action-btn-shortlist"
                                onClick={() => {
                                  setSelectedIds([cand._id]);
                                  setBulkDialog({
                                    targetStatus: "shortlisted",
                                    label: "Shortlisted",
                                  });
                                }}
                              >
                                Shortlist
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
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

        {/* Bulk Action Confirmation Modal */}
        {bulkDialog && (
          <div className="modal-backdrop" onClick={() => setBulkDialog(null)}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <CheckCircle2 size={22} color="#3F754B" />
                <h3>Confirm Stage Transition</h3>
              </div>
              <p className="modal-text">
                You are about to transition <strong>{selectedIds.length} candidate(s)</strong> to{" "}
                <span className="target-status-pill">{bulkDialog.label}</span>.
              </p>

              <div className="dialog-note-input">
                <label>Recruiter Evaluation Note (Optional):</label>
                <textarea
                  rows={2}
                  placeholder={`Batch progression to ${bulkDialog.label}...`}
                  value={bulkNote}
                  onChange={(e) => setBulkNote(e.target.value)}
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="modal-btn-cancel"
                  onClick={() => setBulkDialog(null)}
                  disabled={processing}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="modal-btn-confirm"
                  onClick={handleExecuteBulkAction}
                  disabled={processing}
                >
                  {processing ? "Updating..." : "Execute Bulk Update"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
