import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Briefcase,
  PlusCircle,
  Search,
  Filter,
  Calendar,
  Users,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  MoreVertical,
  Edit,
  Eye,
  XCircle,
  Archive,
  Building2,
} from "lucide-react";
import AppLayout from "../../components/ui/AppLayout.jsx";
import { PageHeader } from "../../components/ui/EditorialComponents.jsx";
import { recruiterApi } from "../../api/recruiterApi.js";
import "./PlacementDrivesList.css";

export default function PlacementDrivesList() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [drives, setDrives] = useState([]);
  const [metrics, setMetrics] = useState({
    totalDrives: 0,
    draftDrives: 0,
    publishedDrives: 0,
    closedDrives: 0,
  });
  const [unassigned, setUnassigned] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  // Filters
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "all";
  const [searchInput, setSearchInput] = useState(search);

  // Confirmation Modal State
  const [confirmDialog, setConfirmDialog] = useState(null); // { driveId, action, title, text }

  const fetchDrives = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await recruiterApi.getDrives({
        search,
        status,
      });
      setDrives(res.drives || []);
      setMetrics(res.metrics || res.summaryMetrics || {});
      if (res.unassigned) setUnassigned(true);
      else setUnassigned(false);
    } catch (err) {
      setError(err.message || "Failed to load placement drives");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrives();
  }, [search, status]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const next = new URLSearchParams(searchParams);
    if (searchInput.trim()) {
      next.set("search", searchInput.trim());
    } else {
      next.delete("search");
    }
    setSearchParams(next);
  };

  const handleStatusFilter = (newStatus) => {
    const next = new URLSearchParams(searchParams);
    if (newStatus && newStatus !== "all") {
      next.set("status", newStatus);
    } else {
      next.delete("status");
    }
    setSearchParams(next);
  };

  const executeStatusTransition = async () => {
    if (!confirmDialog) return;
    try {
      setError(null);
      await recruiterApi.updateDriveStatus(confirmDialog.driveId, confirmDialog.action);
      setActionSuccess(`Placement drive successfully updated to ${confirmDialog.action}.`);
      setConfirmDialog(null);
      fetchDrives();
    } catch (err) {
      setError(err.message || "Status transition failed");
      setConfirmDialog(null);
    }
  };

  const renderStatusBadge = (s) => {
    switch (s) {
      case "published":
        return <span className="drive-status-badge badge-published">Active / Published</span>;
      case "draft":
        return <span className="drive-status-badge badge-draft">Draft</span>;
      case "closed":
        return <span className="drive-status-badge badge-closed">Closed</span>;
      case "cancelled":
        return <span className="drive-status-badge badge-cancelled">Cancelled</span>;
      default:
        return <span className="drive-status-badge badge-draft">{s}</span>;
    }
  };

  return (
    <AppLayout
      pageTitle="Placement Drives"
      breadcrumb="Recruiter Portal / Drives"
    >
      <div className="drives-list-root">
        {/* Page Header */}
        <PageHeader
          eyebrow="Campus Recruitment Drives"
          title="Placement Drives"
          description="Create, monitor, and manage your company's campus recruitment opportunities and application windows."
          actions={
            <button
              type="button"
              className="btn-create-drive"
              onClick={() => navigate("/recruiter/drives/create")}
            >
              <PlusCircle size={16} />
              Create Placement Drive
            </button>
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

        {unassigned && (
          <div className="alert-banner alert-warning" style={{ backgroundColor: "#FFFBEB", border: "1px solid #FDE68A", color: "#92400E", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Building2 size={18} color="#D97706" />
              <span>Your account is not yet affiliated with an authorized company. Please connect your company to publish and manage placement drives.</span>
            </div>
            <Link to="/recruiter/company" className="btn-secondary btn-sm" style={{ backgroundColor: "#D97706", color: "#FFFFFF", borderColor: "#D97706" }}>
              Connect Company →
            </Link>
          </div>
        )}

        {/* Metric Strip */}
        <div className="drives-summary-strip">
          <div
            className={`metric-pill ${status === "all" ? "active" : ""}`}
            onClick={() => handleStatusFilter("all")}
          >
            <span className="metric-pill-label">Total Drives</span>
            <strong className="metric-pill-val">{metrics.totalDrives || 0}</strong>
          </div>
          <div
            className={`metric-pill ${status === "published" ? "active" : ""}`}
            onClick={() => handleStatusFilter("published")}
          >
            <span className="metric-pill-label">Published / Active</span>
            <strong className="metric-pill-val">{metrics.publishedDrives || metrics.publishedCount || 0}</strong>
          </div>
          <div
            className={`metric-pill ${status === "draft" ? "active" : ""}`}
            onClick={() => handleStatusFilter("draft")}
          >
            <span className="metric-pill-label">Drafts</span>
            <strong className="metric-pill-val">{metrics.draftDrives || metrics.draftCount || 0}</strong>
          </div>
          <div
            className={`metric-pill ${status === "closed" ? "active" : ""}`}
            onClick={() => handleStatusFilter("closed")}
          >
            <span className="metric-pill-label">Closed</span>
            <strong className="metric-pill-val">{metrics.closedDrives || metrics.closedCount || 0}</strong>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="drives-toolbar">
          <form onSubmit={handleSearchSubmit} className="search-form">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search by drive title, job type, location..."
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

          <div className="status-filter-pills">
            <span className="filter-label">Filter:</span>
            {["all", "published", "draft", "closed"].map((st) => (
              <button
                key={st}
                type="button"
                className={`filter-btn ${status === st ? "selected" : ""}`}
                onClick={() => handleStatusFilter(st)}
              >
                {st.charAt(0).toUpperCase() + st.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Drives Table Panel */}
        <div className="drives-table-card">
          {loading ? (
            <div className="table-loading-state">
              <div className="loading-spinner" />
              <p>Loading placement drives...</p>
            </div>
          ) : drives.length === 0 ? (
            <div className="table-empty-state">
              <Briefcase size={36} color="#8A948C" />
              <h3>No Placement Drives Found</h3>
              <p>
                {search || status !== "all"
                  ? "No drives match your current search and filter criteria."
                  : "Your company has not published any placement drives yet."}
              </p>
              <button
                type="button"
                className="btn-create-drive"
                onClick={() => navigate("/recruiter/drives/create")}
              >
                <PlusCircle size={15} /> Create First Drive
              </button>
            </div>
          ) : (
            <div className="table-scroll-container">
              <table className="drives-table">
                <thead>
                  <tr>
                    <th>Opportunity / Title</th>
                    <th>Location & Type</th>
                    <th>Compensation</th>
                    <th>Deadline</th>
                    <th>Applicants</th>
                    <th>Status</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {drives.map((drive) => {
                    const deadlineDate = new Date(drive.applicationDeadline);
                    const isExpired = deadlineDate < new Date();
                    return (
                      <tr key={drive._id}>
                        <td>
                          <div className="drive-title-cell">
                            <span className="drive-main-title">{drive.title}</span>
                            <span className="drive-min-cgpa">
                              Min CGPA: {drive.minCGPA || drive.criteria?.minimumCgpa || "Any"} ·{" "}
                              {drive.openings || 1} {drive.openings === 1 ? "opening" : "openings"}
                            </span>
                          </div>
                        </td>
                        <td>
                          <div className="drive-location-cell">
                            <span>{drive.jobType || "Full-time"}</span>
                            <small>
                              <MapPin size={11} /> {drive.location || "On-site"}
                            </small>
                          </div>
                        </td>
                        <td>
                          <strong className="salary-text">
                            {drive.ctcMin && drive.ctcMax
                              ? `${drive.ctcMin}–${drive.ctcMax} LPA`
                              : drive.salary || "Competitive"}
                          </strong>
                        </td>
                        <td>
                          <div className="deadline-cell">
                            <span className={isExpired && drive.status === "published" ? "text-expired" : ""}>
                              {deadlineDate.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                            {isExpired && drive.status === "published" && (
                              <small className="expired-label">Deadline Expired</small>
                            )}
                          </div>
                        </td>
                        <td>
                          <Link
                            to={`/recruiter/applicants?driveId=${drive._id}`}
                            className="applicants-count-badge"
                            title="View applicants for this drive"
                          >
                            <Users size={13} />
                            <span>{drive.totalApplicants || 0}</span>
                          </Link>
                        </td>
                        <td>{renderStatusBadge(drive.status)}</td>
                        <td>
                          <div className="table-actions-cell">
                            <button
                              type="button"
                              className="action-btn-secondary"
                              onClick={() => navigate(`/recruiter/drives/${drive._id}`)}
                              title="View Full Drive Details"
                            >
                              <Eye size={14} /> View
                            </button>

                            <button
                              type="button"
                              className="action-btn-secondary"
                              onClick={() => navigate(`/recruiter/drives/${drive._id}/edit`)}
                              title="Edit Drive Requirements"
                            >
                              <Edit size={14} /> Edit
                            </button>

                            {drive.status === "draft" && (
                              <button
                                type="button"
                                className="action-btn-publish"
                                onClick={() =>
                                  setConfirmDialog({
                                    driveId: drive._id,
                                    action: "published",
                                    title: "Publish Placement Drive?",
                                    text: `Are you sure you want to publish "${drive.title}"? Eligible campus students will immediately be able to view and apply.`,
                                  })
                                }
                              >
                                Publish
                              </button>
                            )}

                            {drive.status === "published" && (
                              <button
                                type="button"
                                className="action-btn-close"
                                onClick={() =>
                                  setConfirmDialog({
                                    driveId: drive._id,
                                    action: "closed",
                                    title: "Close Placement Drive?",
                                    text: `Closing "${drive.title}" will stop receiving new student applications. Existing candidate submissions will be preserved for review.`,
                                  })
                                }
                              >
                                Close
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

        {/* Confirmation Modal */}
        {confirmDialog && (
          <div className="modal-backdrop" onClick={() => setConfirmDialog(null)}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <AlertCircle size={24} color="#3F754B" />
                <h3>{confirmDialog.title}</h3>
              </div>
              <p className="modal-text">{confirmDialog.text}</p>
              <div className="modal-actions">
                <button
                  type="button"
                  className="modal-btn-cancel"
                  onClick={() => setConfirmDialog(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="modal-btn-confirm"
                  onClick={executeStatusTransition}
                >
                  Confirm Action
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
