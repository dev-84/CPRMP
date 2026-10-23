import React, { useState, useEffect, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Briefcase,
  Search,
  Plus,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  Eye,
  Edit,
  X,
  Building,
  Calendar,
  MapPin,
  DollarSign,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Send,
} from "lucide-react";
import AppLayout from "../../components/ui/AppLayout.jsx";
import {
  PageHeader,
  MetricRow,
  MetricItem,
  CompanyLogo,
} from "../../components/ui/EditorialComponents.jsx";
import { adminApi } from "../../api/adminApi.js";
import "./PlacementDriveManagement.css";

export default function PlacementDriveManagement() {
  const [searchParams] = useSearchParams();

  const [drives, setDrives] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [companiesList, setCompaniesList] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalRecords: 0, pageSize: 10 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(searchParams.get("create") === "true");
  const [selectedDrive, setSelectedDrive] = useState(null);
  const [editingDrive, setEditingDrive] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    companyId: "",
    companyName: "",
    description: "",
    jobType: "Full-time",
    location: "Onsite",
    salary: "",
    applicationDeadline: "",
    driveDate: "",
    status: "published",
    minimumCgpa: "7.0",
    maximumBacklogs: "0",
    allowedDegrees: ["MCA", "B.Tech"],
    graduationYears: [2026, 2027],
    requiredSkills: "Java, Python, Algorithms",
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  const fetchDrivesList = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [data, companies] = await Promise.all([
        adminApi.getDrives({
          search: searchTerm,
          status: statusFilter,
          page,
          limit: 10,
        }),
        adminApi.getCompanies(),
      ]);

      setDrives(data.drives || []);
      setMetrics(data.metrics);
      setPagination(data.pagination || { currentPage: 1, totalPages: 1, totalRecords: 0, pageSize: 10 });
      setCompaniesList(companies || []);
    } catch (err) {
      console.error("Failed to load drives:", err);
      setError(err.message || "Failed to load placement drives from database.");
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter, page]);

  useEffect(() => {
    fetchDrivesList();
  }, [fetchDrivesList]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchDrivesList();
  };

  // Toggle Drive Status
  const handleToggleStatus = async (drive) => {
    const nextStatus = drive.status === "published" ? "closed" : "published";
    try {
      await adminApi.updateDrive(drive.id, { status: nextStatus });
      setFeedback({
        type: "success",
        message: `Placement drive status for ${drive.company} set to "${nextStatus}".`,
      });
      fetchDrivesList();
    } catch (err) {
      setFeedback({ type: "error", message: err.message || "Failed to update drive status." });
    }
  };

  // Create Drive Form Submit
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim() || !formData.applicationDeadline) {
      setFormError("Job title, description, and application deadline are required.");
      return;
    }

    try {
      setFormSubmitting(true);
      setFormError(null);

      const payload = {
        ...formData,
        minimumCgpa: Number(formData.minimumCgpa) || 0,
        maximumBacklogs: Number(formData.maximumBacklogs) || 0,
        requiredSkills: formData.requiredSkills
          ? formData.requiredSkills.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
      };

      await adminApi.createDrive(payload);
      setIsCreateModalOpen(false);
      setFeedback({
        type: "success",
        message: `Placement drive "${formData.title}" published successfully.`,
      });
      fetchDrivesList();
    } catch (err) {
      setFormError(err.message || "Failed to create placement drive.");
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <AppLayout pageTitle="Placement Drive Management" breadcrumb="TPO Authority">
      <div className="admin-drives-page">
        {/* Page Header */}
        <PageHeader
          eyebrow="TPO ADMINISTRATION CONSOLE"
          title="Placement Drive Management"
          description="Create, publish, monitor, and manage campus recruitment opportunities."
          actions={
            <div className="admin-header-actions">
              <button
                type="button"
                className="btn-secondary btn-sm"
                onClick={fetchDrivesList}
                disabled={loading}
              >
                <RefreshCw size={14} className={loading ? "spin-icon" : ""} />
                <span>Refresh</span>
              </button>
              <button
                type="button"
                className="btn-primary btn-sm"
                onClick={() => setIsCreateModalOpen(true)}
              >
                <Plus size={14} />
                <span>Create Placement Drive</span>
              </button>
            </div>
          }
        />

        {/* Feedback Alert */}
        {feedback && (
          <div className={`admin-feedback-banner ${feedback.type === "error" ? "feedback-error" : "feedback-success"}`}>
            <span>{feedback.message}</span>
            <button
              type="button"
              onClick={() => setFeedback(null)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "inherit" }}
            >
              <X size={15} />
            </button>
          </div>
        )}

        {/* Summary Metrics */}
        <MetricRow>
          <MetricItem
            label="Total Placement Drives"
            value={loading ? "..." : (metrics?.totalDrives ?? 0)}
            detail="Scheduled in current cycle"
            icon={Briefcase}
          />
          <MetricItem
            label="Active / Published Drives"
            value={loading ? "..." : (metrics?.publishedDrives ?? 0)}
            detail="Currently accepting applications"
            icon={CheckCircle2}
          />
          <MetricItem
            label="Draft Drives"
            value={loading ? "..." : (metrics?.draftDrives ?? 0)}
            detail="Pending publishing approval"
            icon={Clock}
          />
          <MetricItem
            label="Closed / Expired Drives"
            value={loading ? "..." : (metrics?.closedDrives ?? 0)}
            detail="Application deadline elapsed"
            icon={AlertCircle}
          />
        </MetricRow>

        {/* Search & Filter Bar */}
        <div className="admin-filter-container">
          <form onSubmit={handleSearchSubmit} className="admin-search-form">
            <div className="admin-search-wrapper" style={{ width: "280px" }}>
              <Search size={14} className="admin-search-icon" />
              <input
                type="search"
                placeholder="Search job title, company, CTC..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button type="submit" className="btn-secondary btn-sm">
              Search
            </button>
          </form>

          <div className="admin-filters-row">
            <select
              className="admin-select-filter"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              aria-label="Filter by drive status"
            >
              <option value="all">All Drive Statuses</option>
              <option value="published">Published / Active</option>
              <option value="draft">Drafts</option>
              <option value="closed">Closed / Finished</option>
            </select>

            {(searchTerm || statusFilter !== "all") && (
              <button
                type="button"
                className="admin-reset-link"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setPage(1);
                }}
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Placement Drives Table */}
        <div className="admin-card-section" style={{ padding: 0 }}>
          <div className="admin-table-wrapper" style={{ border: "none" }}>
            <table className="admin-editorial-table">
              <thead>
                <tr>
                  <th>Job / Drive Title</th>
                  <th>Company</th>
                  <th>Eligible Degrees</th>
                  <th>Grad. Years</th>
                  <th>Min CGPA / Backlogs</th>
                  <th>Salary (CTC)</th>
                  <th>Location</th>
                  <th>Deadline</th>
                  <th>Applicants</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={11} style={{ textAlign: "center", padding: "36px", color: "var(--text-muted)" }}>
                      Loading campus placement drives...
                    </td>
                  </tr>
                ) : drives.length > 0 ? (
                  drives.map((d) => (
                    <tr key={d.id}>
                      {/* Job Title */}
                      <td>
                        <strong style={{ fontWeight: 600, color: "var(--text-primary)" }}>{d.title}</strong>
                        <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{d.jobType}</div>
                      </td>

                      {/* Company */}
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <CompanyLogo name={d.company} />
                          <span style={{ fontWeight: 600 }}>{d.company}</span>
                        </div>
                      </td>

                      {/* Degrees */}
                      <td>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                          {d.criteria?.allowedDegrees?.length > 0 ? (
                            d.criteria.allowedDegrees.map((deg) => (
                              <span key={deg} className="editorial-badge badge-neutral" style={{ fontSize: "10.5px" }}>
                                {deg}
                              </span>
                            ))
                          ) : (
                            <span style={{ color: "var(--text-muted)", fontSize: "11.5px" }}>All Degrees</span>
                          )}
                        </div>
                      </td>

                      {/* Grad Years */}
                      <td style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                        {d.criteria?.graduationYears?.join(", ") || "2026, 2027"}
                      </td>

                      {/* Min CGPA & Backlogs */}
                      <td>
                        <div style={{ fontSize: "12px" }}>
                          <strong style={{ color: "var(--accent)" }}>CGPA {d.criteria?.minCgpa}</strong>
                          <div style={{ color: "var(--text-muted)", fontSize: "11px" }}>
                            Max {d.criteria?.maxBacklogs} Backlogs
                          </div>
                        </div>
                      </td>

                      {/* CTC Package */}
                      <td>
                        <strong style={{ color: "var(--accent)", fontSize: "13.5px" }}>{d.salary}</strong>
                      </td>

                      {/* Location */}
                      <td style={{ color: "var(--text-secondary)", fontSize: "12px" }}>{d.location}</td>

                      {/* Deadline */}
                      <td style={{ color: "var(--text-muted)", fontSize: "12px" }}>
                        {d.applicationDeadline ? new Date(d.applicationDeadline).toLocaleDateString() : "Ongoing"}
                      </td>

                      {/* Applicants */}
                      <td style={{ textAlign: "center" }}>
                        <span className="editorial-badge badge-neutral">{d.applicantsCount}</span>
                      </td>

                      {/* Status */}
                      <td>
                        <span
                          className={`editorial-badge ${
                            d.status === "published"
                              ? "badge-success"
                              : d.status === "draft"
                              ? "badge-warning"
                              : "badge-neutral"
                          }`}
                        >
                          {d.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                        <div style={{ display: "inline-flex", gap: "6px" }}>
                          <button
                            type="button"
                            className="btn-secondary btn-sm"
                            onClick={() => setSelectedDrive(d)}
                            title="View drive requirements"
                          >
                            <Eye size={13} />
                            <span>View</span>
                          </button>
                          <button
                            type="button"
                            className={`btn-sm ${d.status === "published" ? "btn-secondary" : "btn-primary"}`}
                            onClick={() => handleToggleStatus(d)}
                            title={d.status === "published" ? "Close drive applications" : "Publish drive"}
                          >
                            {d.status === "published" ? "Close" : "Publish"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={11} style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
                      No placement drives found matching active filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="admin-pagination-bar">
            <span className="pagination-info">
              Showing {(pagination.currentPage - 1) * pagination.pageSize + (drives.length > 0 ? 1 : 0)}–
              {Math.min(pagination.currentPage * pagination.pageSize, pagination.totalRecords)} of{" "}
              {pagination.totalRecords} drives
            </span>

            <div className="pagination-buttons">
              <button
                type="button"
                className="btn-secondary btn-sm"
                disabled={pagination.currentPage <= 1 || loading}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              >
                <ChevronLeft size={14} />
                <span>Previous</span>
              </button>
              <span className="pagination-current-page">
                Page {pagination.currentPage} of {Math.max(1, pagination.totalPages)}
              </span>
              <button
                type="button"
                className="btn-secondary btn-sm"
                disabled={pagination.currentPage >= pagination.totalPages || loading}
                onClick={() => setPage((prev) => prev + 1)}
              >
                <span>Next</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Create Placement Drive Modal */}
        {isCreateModalOpen && (
          <div className="admin-modal-backdrop" onClick={() => setIsCreateModalOpen(false)}>
            <div className="admin-modal-card" style={{ maxWidth: "720px" }} onClick={(e) => e.stopPropagation()}>
              <div className="admin-modal-header">
                <div>
                  <h3 className="admin-modal-title">Create Campus Placement Drive</h3>
                  <p className="admin-modal-subtitle">
                    Publish recruitment opportunities, role designations, compensation, and eligibility criteria.
                  </p>
                </div>
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateSubmit}>
                <div className="admin-modal-body">
                  {formError && (
                    <div className="admin-error-banner" style={{ padding: "8px 12px", fontSize: "12.5px" }}>
                      <AlertCircle size={15} />
                      <span>{formError}</span>
                    </div>
                  )}

                  {/* Company & Role */}
                  <div className="form-row-2">
                    <div className="form-field-group">
                      <label className="form-field-label">Company *</label>
                      <select
                        className="form-field-input"
                        value={formData.companyId}
                        onChange={(e) => setFormData({ ...formData, companyId: e.target.value, companyName: "" })}
                      >
                        <option value="">-- Or enter new company below --</option>
                        {companiesList.map((c) => (
                          <option key={c._id} value={c._id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {!formData.companyId && (
                      <div className="form-field-group">
                        <label className="form-field-label">New Company Name</label>
                        <input
                          type="text"
                          className="form-field-input"
                          placeholder="e.g. Amazon India"
                          value={formData.companyName}
                          onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        />
                      </div>
                    )}
                  </div>

                  <div className="form-row-2">
                    <div className="form-field-group">
                      <label className="form-field-label">Job Title / Designation *</label>
                      <input
                        type="text"
                        className="form-field-input"
                        required
                        placeholder="e.g. Software Engineer — Cloud & AI"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      />
                    </div>
                    <div className="form-field-group">
                      <label className="form-field-label">Package / CTC *</label>
                      <input
                        type="text"
                        className="form-field-input"
                        required
                        placeholder="e.g. ₹32.0 LPA"
                        value={formData.salary}
                        onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-row-2">
                    <div className="form-field-group">
                      <label className="form-field-label">Location & Work Mode</label>
                      <input
                        type="text"
                        className="form-field-input"
                        placeholder="e.g. Bengaluru / Hyderabad (Hybrid)"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      />
                    </div>
                    <div className="form-field-group">
                      <label className="form-field-label">Application Deadline *</label>
                      <input
                        type="date"
                        className="form-field-input"
                        required
                        value={formData.applicationDeadline}
                        onChange={(e) => setFormData({ ...formData, applicationDeadline: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-field-group">
                    <label className="form-field-label">Job Description & Responsibilities *</label>
                    <textarea
                      rows={3}
                      className="form-field-input"
                      required
                      placeholder="Outline key responsibilities, team function, and recruitment overview..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>

                  {/* Academic Eligibility Section */}
                  <div className="modal-sec-title" style={{ marginTop: "10px" }}>
                    Academic Eligibility Criteria
                  </div>

                  <div className="form-row-2">
                    <div className="form-field-group">
                      <label className="form-field-label">Minimum CGPA Prerequisite</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        className="form-field-input"
                        value={formData.minimumCgpa}
                        onChange={(e) => setFormData({ ...formData, minimumCgpa: e.target.value })}
                      />
                    </div>
                    <div className="form-field-group">
                      <label className="form-field-label">Maximum Active Backlogs Permitted</label>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        className="form-field-input"
                        value={formData.maximumBacklogs}
                        onChange={(e) => setFormData({ ...formData, maximumBacklogs: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-field-group">
                    <label className="form-field-label">Required Technical Skills (comma separated)</label>
                    <input
                      type="text"
                      className="form-field-input"
                      placeholder="e.g. Java, Python, Data Structures, Algorithms"
                      value={formData.requiredSkills}
                      onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value })}
                    />
                  </div>
                </div>

                <div className="admin-modal-footer">
                  <button
                    type="button"
                    className="btn-secondary btn-sm"
                    onClick={() => setIsCreateModalOpen(false)}
                    disabled={formSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn-secondary btn-sm"
                    disabled={formSubmitting}
                    onClick={() => {
                      setFormData({ ...formData, status: "draft" });
                      handleCreateSubmit({ preventDefault: () => {} });
                    }}
                  >
                    Save as Draft
                  </button>
                  <button
                    type="submit"
                    className="btn-primary btn-sm"
                    disabled={formSubmitting}
                    onClick={() => setFormData({ ...formData, status: "published" })}
                  >
                    {formSubmitting ? "Publishing..." : "Publish Placement Drive"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* View Placement Drive Details Modal */}
        {selectedDrive && (
          <div className="admin-modal-backdrop" onClick={() => setSelectedDrive(null)}>
            <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="admin-modal-header">
                <div>
                  <h3 className="admin-modal-title">{selectedDrive.title}</h3>
                  <p className="admin-modal-subtitle">
                    {selectedDrive.company} • {selectedDrive.salary}
                  </p>
                </div>
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => setSelectedDrive(null)}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="admin-modal-body">
                <div className="modal-section">
                  <h4 className="modal-sec-title">Drive Specifications</h4>
                  <div className="modal-info-grid">
                    <div>
                      <span className="info-label">Corporate Enterprise</span>
                      <strong className="info-val">{selectedDrive.company}</strong>
                    </div>
                    <div>
                      <span className="info-label">CTC Package</span>
                      <strong className="info-val" style={{ color: "var(--accent)" }}>{selectedDrive.salary}</strong>
                    </div>
                    <div>
                      <span className="info-label">Location / Mode</span>
                      <strong className="info-val">{selectedDrive.location}</strong>
                    </div>
                    <div>
                      <span className="info-label">Application Deadline</span>
                      <strong className="info-val">
                        {selectedDrive.applicationDeadline ? new Date(selectedDrive.applicationDeadline).toLocaleDateString() : "Ongoing"}
                      </strong>
                    </div>
                    <div>
                      <span className="info-label">Drive Lifecycle Status</span>
                      <strong className="info-val">{selectedDrive.status}</strong>
                    </div>
                    <div>
                      <span className="info-label">Registered Applicants</span>
                      <strong className="info-val">{selectedDrive.applicantsCount} candidates applied</strong>
                    </div>
                  </div>
                </div>

                <div className="modal-section">
                  <h4 className="modal-sec-title">Eligibility Criteria</h4>
                  <div className="modal-info-grid">
                    <div>
                      <span className="info-label">Minimum CGPA</span>
                      <strong className="info-val">CGPA {selectedDrive.criteria?.minCgpa}</strong>
                    </div>
                    <div>
                      <span className="info-label">Max Active Backlogs</span>
                      <strong className="info-val">{selectedDrive.criteria?.maxBacklogs} Backlogs</strong>
                    </div>
                    <div>
                      <span className="info-label">Eligible Degree Programs</span>
                      <strong className="info-val">{selectedDrive.criteria?.allowedDegrees?.join(", ") || "All"}</strong>
                    </div>
                    <div>
                      <span className="info-label">Eligible Graduation Years</span>
                      <strong className="info-val">{selectedDrive.criteria?.graduationYears?.join(", ") || "2026, 2027"}</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="btn-secondary btn-sm"
                  onClick={() => setSelectedDrive(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
