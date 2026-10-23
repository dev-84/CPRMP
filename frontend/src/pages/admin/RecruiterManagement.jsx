import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Building,
  Users,
  Search,
  Plus,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Eye,
  Edit,
  X,
  Phone,
  Mail,
  Briefcase,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import AppLayout from "../../components/ui/AppLayout.jsx";
import {
  PageHeader,
  MetricRow,
  MetricItem,
  CompanyLogo,
} from "../../components/ui/EditorialComponents.jsx";
import { adminApi } from "../../api/adminApi.js";
import "./RecruiterManagement.css";

export default function RecruiterManagement() {
  const [recruiters, setRecruiters] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [companiesList, setCompaniesList] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalRecords: 0, pageSize: 10 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [verificationFilter, setVerificationFilter] = useState("all");
  const [page, setPage] = useState(1);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedRecruiter, setSelectedRecruiter] = useState(null);
  const [editingRecruiter, setEditingRecruiter] = useState(null);

  // Edit Recruiter State
  const [editFormData, setEditFormData] = useState({
    companyId: "",
    jobTitle: "",
    phone: "",
    isVerified: true,
    accountStatus: "Active",
  });
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState(null);

  // New Recruiter Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    companyId: "",
    companyName: "",
    jobTitle: "",
    phone: "",
    isVerified: true,
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  const handleOpenEditModal = (rec) => {
    setEditingRecruiter(rec);
    setEditError(null);
    setEditFormData({
      companyId: rec.companyId || "",
      jobTitle: rec.jobTitle || "",
      phone: rec.phone && rec.phone !== "N/A" ? rec.phone : "",
      isVerified: !!rec.isVerified,
      accountStatus: rec.accountStatus || "Active",
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingRecruiter) return;
    try {
      setEditSubmitting(true);
      setEditError(null);
      await adminApi.updateRecruiter(editingRecruiter.id, editFormData);
      setFeedback({
        type: "success",
        message: `Recruiter "${editingRecruiter.name}" updated successfully.`,
      });
      setEditingRecruiter(null);
      fetchRecruitersList();
    } catch (err) {
      setEditError(err.message || "Failed to update recruiter.");
    } finally {
      setEditSubmitting(false);
    }
  };

  const fetchRecruitersList = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [data, companies] = await Promise.all([
        adminApi.getRecruiters({
          search: searchTerm,
          status: statusFilter,
          isVerified: verificationFilter,
          page,
          limit: 10,
        }),
        adminApi.getCompanies(),
      ]);

      setRecruiters(data.recruiters || []);
      setMetrics(data.metrics);
      setPagination(data.pagination || { currentPage: 1, totalPages: 1, totalRecords: 0, pageSize: 10 });
      setCompaniesList(companies || []);
    } catch (err) {
      console.error("Failed to load recruiters:", err);
      setError(err.message || "Failed to load recruiter accounts from database.");
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter, verificationFilter, page]);

  useEffect(() => {
    fetchRecruitersList();
  }, [fetchRecruitersList]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchRecruitersList();
  };

  // Toggle Verification
  const handleToggleVerification = async (rec) => {
    const nextVerified = !rec.isVerified;
    try {
      await adminApi.updateRecruiter(rec.id, { isVerified: nextVerified });
      setFeedback({
        type: "success",
        message: `Recruiter verification for ${rec.name} updated to "${nextVerified ? "Verified" : "Pending"}".`,
      });
      fetchRecruitersList();
    } catch (err) {
      setFeedback({ type: "error", message: err.message || "Failed to update recruiter." });
    }
  };

  // Toggle Account Active / Inactive
  const handleToggleAccountStatus = async (rec) => {
    const nextStatus = rec.accountStatus === "Active" ? "Inactive" : "Active";
    try {
      await adminApi.updateRecruiter(rec.id, { accountStatus: nextStatus });
      setFeedback({
        type: "success",
        message: `Account status for ${rec.name} set to "${nextStatus}".`,
      });
      fetchRecruitersList();
    } catch (err) {
      setFeedback({ type: "error", message: err.message || "Failed to update account status." });
    }
  };

  // Create Recruiter Form Submit
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      setFormError("Full name, email, and password are required.");
      return;
    }
    if (formData.password.length < 6) {
      setFormError("Password must be at least 6 characters.");
      return;
    }

    try {
      setFormSubmitting(true);
      setFormError(null);
      await adminApi.createRecruiter(formData);
      setIsAddModalOpen(false);
      setFormData({
        name: "",
        email: "",
        password: "",
        companyId: "",
        companyName: "",
        jobTitle: "",
        phone: "",
        isVerified: true,
      });
      setFeedback({
        type: "success",
        message: "New recruiter account provisioned successfully.",
      });
      fetchRecruitersList();
    } catch (err) {
      setFormError(err.message || "Failed to provision recruiter account.");
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <AppLayout pageTitle="Recruiters Management" breadcrumb="TPO Authority">
      <div className="admin-recruiters-page">
        {/* Page Header */}
        <PageHeader
          eyebrow="TPO ADMINISTRATION CONSOLE"
          title="Recruiters Management"
          description="Manage recruiter accounts, company associations, and recruitment activity."
          actions={
            <div className="admin-header-actions">
              <button
                type="button"
                className="btn-secondary btn-sm"
                onClick={fetchRecruitersList}
                disabled={loading}
              >
                <RefreshCw size={14} className={loading ? "spin-icon" : ""} />
                <span>Refresh</span>
              </button>
              <button
                type="button"
                className="btn-primary btn-sm"
                onClick={() => setIsAddModalOpen(true)}
              >
                <Plus size={14} />
                <span>Add Recruiter</span>
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
            label="Total Recruiters"
            value={loading ? "..." : (metrics?.totalRecruiters ?? 0)}
            detail="Registered recruiter profiles"
            icon={Users}
          />
          <MetricItem
            label="Active Recruiters"
            value={loading ? "..." : (metrics?.activeRecruiters ?? 0)}
            detail="Authorized access enabled"
            icon={CheckCircle2}
          />
          <MetricItem
            label="Pending Verification"
            value={loading ? "..." : (metrics?.pendingVerification ?? 0)}
            detail="Awaiting TPO credential audit"
            icon={AlertCircle}
          />
          <MetricItem
            label="Companies Represented"
            value={loading ? "..." : (metrics?.companiesRepresented ?? 0)}
            detail="Corporate hiring entities"
            icon={Building}
          />
        </MetricRow>

        {/* Search & Filter Bar */}
        <div className="admin-filter-container">
          <form onSubmit={handleSearchSubmit} className="admin-search-form">
            <div className="admin-search-wrapper" style={{ width: "280px" }}>
              <Search size={14} className="admin-search-icon" />
              <input
                type="search"
                placeholder="Search recruiter, company, email..."
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
              aria-label="Filter by account status"
            >
              <option value="all">All Account Statuses</option>
              <option value="active">Active Accounts</option>
              <option value="inactive">Inactive Accounts</option>
            </select>

            <select
              className="admin-select-filter"
              value={verificationFilter}
              onChange={(e) => {
                setVerificationFilter(e.target.value);
                setPage(1);
              }}
              aria-label="Filter by verification"
            >
              <option value="all">All Verification States</option>
              <option value="verified">Verified Recruiters</option>
              <option value="pending">Pending Audit</option>
            </select>

            {(searchTerm || statusFilter !== "all" || verificationFilter !== "all") && (
              <button
                type="button"
                className="admin-reset-link"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setVerificationFilter("all");
                  setPage(1);
                }}
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Recruiters Table */}
        <div className="admin-card-section" style={{ padding: 0 }}>
          <div className="admin-table-wrapper" style={{ border: "none" }}>
            <table className="admin-editorial-table">
              <thead>
                <tr>
                  <th>Recruiter Name</th>
                  <th>Email</th>
                  <th>Company</th>
                  <th>Designation</th>
                  <th>Active Drives</th>
                  <th>Applicants</th>
                  <th>Account Status</th>
                  <th>Verification</th>
                  <th>Created Date</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={10} style={{ textAlign: "center", padding: "36px", color: "var(--text-muted)" }}>
                      Loading recruiter accounts...
                    </td>
                  </tr>
                ) : recruiters.length > 0 ? (
                  recruiters.map((rec) => (
                    <tr key={rec.id}>
                      {/* Name */}
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div className="student-avatar-initial">{rec.name.charAt(0)}</div>
                          <strong style={{ fontWeight: 600 }}>{rec.name}</strong>
                        </div>
                      </td>

                      {/* Email */}
                      <td style={{ color: "var(--text-secondary)", fontSize: "12.5px" }}>{rec.email}</td>

                      {/* Company */}
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <CompanyLogo name={rec.company} />
                          <span style={{ fontWeight: 600 }}>{rec.company}</span>
                        </div>
                      </td>

                      {/* Designation */}
                      <td style={{ color: "var(--text-secondary)", fontSize: "12px" }}>{rec.jobTitle}</td>

                      {/* Active Drives */}
                      <td style={{ textAlign: "center" }}>
                        <span className="editorial-badge badge-neutral">{rec.activeDrivesCount}</span>
                      </td>

                      {/* Applicants */}
                      <td style={{ textAlign: "center" }}>
                        <span className="editorial-badge badge-neutral">{rec.totalApplicantsCount}</span>
                      </td>

                      {/* Account Status */}
                      <td>
                        <span
                          className={`editorial-badge ${rec.accountStatus === "Active" ? "badge-success" : "badge-neutral"}`}
                        >
                          {rec.accountStatus}
                        </span>
                      </td>

                      {/* Verification */}
                      <td>
                        <span
                          className={`editorial-badge ${rec.isVerified ? "badge-success" : "badge-warning"}`}
                        >
                          {rec.isVerified ? "Verified" : "Pending"}
                        </span>
                      </td>

                      {/* Created Date */}
                      <td style={{ color: "var(--text-muted)", fontSize: "12px" }}>
                        {rec.createdAt ? new Date(rec.createdAt).toLocaleDateString() : "Active"}
                      </td>

                      {/* Actions */}
                      <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                        <div style={{ display: "inline-flex", gap: "6px" }}>
                          <button
                            type="button"
                            className="btn-secondary btn-sm"
                            onClick={() => setSelectedRecruiter(rec)}
                            title="View recruiter details"
                          >
                            <Eye size={13} />
                            <span>View</span>
                          </button>
                          <button
                            type="button"
                            className="btn-secondary btn-sm"
                            onClick={() => handleOpenEditModal(rec)}
                            title="Edit profile & assign company"
                          >
                            <Edit size={13} />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            className="btn-secondary btn-sm"
                            onClick={() => handleToggleVerification(rec)}
                            title={rec.isVerified ? "Revoke verification" : "Approve verification"}
                          >
                            {rec.isVerified ? "Revoke" : "Verify"}
                          </button>
                          <button
                            type="button"
                            className={`btn-sm ${rec.accountStatus === "Active" ? "btn-secondary" : "btn-primary"}`}
                            onClick={() => handleToggleAccountStatus(rec)}
                            title={rec.accountStatus === "Active" ? "Deactivate account" : "Activate account"}
                          >
                            {rec.accountStatus === "Active" ? "Deactivate" : "Activate"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={10} style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
                      No recruiter accounts found matching active filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="admin-pagination-bar">
            <span className="pagination-info">
              Showing {(pagination.currentPage - 1) * pagination.pageSize + (recruiters.length > 0 ? 1 : 0)}–
              {Math.min(pagination.currentPage * pagination.pageSize, pagination.totalRecords)} of{" "}
              {pagination.totalRecords} recruiters
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

        {/* Add Recruiter Modal */}
        {isAddModalOpen && (
          <div className="admin-modal-backdrop" onClick={() => setIsAddModalOpen(false)}>
            <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="admin-modal-header">
                <div>
                  <h3 className="admin-modal-title">Provision Recruiter Account</h3>
                  <p className="admin-modal-subtitle">
                    Authorize corporate partner talent acquisition accounts and company affiliations.
                  </p>
                </div>
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => setIsAddModalOpen(false)}
                  aria-label="Close modal"
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

                  <div className="form-field-group">
                    <label className="form-field-label">Full Name *</label>
                    <input
                      type="text"
                      className="form-field-input"
                      required
                      placeholder="e.g. Vikram Sengupta"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="form-row-2">
                    <div className="form-field-group">
                      <label className="form-field-label">Official Work Email *</label>
                      <input
                        type="email"
                        className="form-field-input"
                        required
                        placeholder="recruiter@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div className="form-field-group">
                      <label className="form-field-label">Account Password *</label>
                      <input
                        type="password"
                        className="form-field-input"
                        required
                        placeholder="Minimum 6 characters"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-row-2">
                    <div className="form-field-group">
                      <label className="form-field-label">Select Company</label>
                      <select
                        className="form-field-input"
                        value={formData.companyId}
                        onChange={(e) => setFormData({ ...formData, companyId: e.target.value, companyName: "" })}
                      >
                        <option value="">-- Or enter new company below --</option>
                        {companiesList.map((c) => (
                          <option key={c._id} value={c._id}>
                            {c.name} ({c.industry || "General"})
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
                      <label className="form-field-label">Job Title / Role</label>
                      <input
                        type="text"
                        className="form-field-input"
                        placeholder="e.g. University Talent Lead"
                        value={formData.jobTitle}
                        onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                      />
                    </div>
                    <div className="form-field-group">
                      <label className="form-field-label">Phone Number</label>
                      <input
                        type="text"
                        className="form-field-input"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-checkbox-row">
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "13px" }}>
                      <input
                        type="checkbox"
                        checked={formData.isVerified}
                        onChange={(e) => setFormData({ ...formData, isVerified: e.target.checked })}
                      />
                      <span>Mark recruiter credentials as verified by TPO</span>
                    </label>
                  </div>
                </div>

                <div className="admin-modal-footer">
                  <button
                    type="button"
                    className="btn-secondary btn-sm"
                    onClick={() => setIsAddModalOpen(false)}
                    disabled={formSubmitting}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary btn-sm" disabled={formSubmitting}>
                    {formSubmitting ? "Provisioning..." : "Provision Recruiter"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* View Recruiter Details Modal */}
        {selectedRecruiter && (
          <div className="admin-modal-backdrop" onClick={() => setSelectedRecruiter(null)}>
            <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="admin-modal-header">
                <div>
                  <h3 className="admin-modal-title">{selectedRecruiter.name}</h3>
                  <p className="admin-modal-subtitle">
                    {selectedRecruiter.jobTitle} • {selectedRecruiter.company}
                  </p>
                </div>
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => setSelectedRecruiter(null)}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="admin-modal-body">
                <div className="modal-section">
                  <h4 className="modal-sec-title">Recruiter Profile & Company Dossier</h4>
                  <div className="modal-info-grid">
                    <div>
                      <span className="info-label">Associated Enterprise</span>
                      <strong className="info-val">{selectedRecruiter.company}</strong>
                    </div>
                    <div>
                      <span className="info-label">Industry Domain</span>
                      <strong className="info-val">{selectedRecruiter.companyIndustry || "Technology"}</strong>
                    </div>
                    <div>
                      <span className="info-label">Email Address</span>
                      <strong className="info-val">{selectedRecruiter.email}</strong>
                    </div>
                    <div>
                      <span className="info-label">Direct Phone</span>
                      <strong className="info-val">{selectedRecruiter.phone}</strong>
                    </div>
                    <div>
                      <span className="info-label">Account Status</span>
                      <strong className="info-val">{selectedRecruiter.accountStatus}</strong>
                    </div>
                    <div>
                      <span className="info-label">TPO Verification</span>
                      <strong className="info-val">
                        {selectedRecruiter.isVerified ? "Verified Credentials" : "Pending Review"}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="modal-section">
                  <h4 className="modal-sec-title">Campus Activity Standing</h4>
                  <div className="modal-info-grid">
                    <div>
                      <span className="info-label">Active Drives</span>
                      <strong className="info-val">{selectedRecruiter.activeDrivesCount} published</strong>
                    </div>
                    <div>
                      <span className="info-label">Total Applicants</span>
                      <strong className="info-val">{selectedRecruiter.totalApplicantsCount} submissions</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="btn-secondary btn-sm"
                  onClick={() => setSelectedRecruiter(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Recruiter & Assign Company Modal */}
        {editingRecruiter && (
          <div className="admin-modal-backdrop" onClick={() => setEditingRecruiter(null)}>
            <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="admin-modal-header">
                <div>
                  <h3 className="admin-modal-title">Edit Recruiter Account</h3>
                  <p className="admin-modal-subtitle">
                    Assign company affiliation, corporate role, direct contact, and verification status.
                  </p>
                </div>
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => setEditingRecruiter(null)}
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleEditSubmit}>
                <div className="admin-modal-body">
                  {editError && (
                    <div className="admin-error-banner" style={{ padding: "8px 12px", fontSize: "12.5px" }}>
                      <AlertCircle size={15} />
                      <span>{editError}</span>
                    </div>
                  )}

                  <div className="form-row-2">
                    <div className="form-field-group">
                      <label className="form-field-label">Recruiter Name</label>
                      <input
                        type="text"
                        className="form-field-input"
                        disabled
                        value={editingRecruiter.name}
                        style={{ backgroundColor: "var(--bg-muted)", cursor: "not-allowed" }}
                      />
                    </div>
                    <div className="form-field-group">
                      <label className="form-field-label">Account Email</label>
                      <input
                        type="text"
                        className="form-field-input"
                        disabled
                        value={editingRecruiter.email}
                        style={{ backgroundColor: "var(--bg-muted)", cursor: "not-allowed" }}
                      />
                    </div>
                  </div>

                  <div className="form-field-group">
                    <label className="form-field-label">Assigned Company / Enterprise *</label>
                    <select
                      className="form-field-input"
                      value={editFormData.companyId}
                      onChange={(e) => setEditFormData({ ...editFormData, companyId: e.target.value })}
                      required
                    >
                      <option value="">-- Select Corporate Partner --</option>
                      {companiesList.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name} ({c.industry || "General"})
                        </option>
                      ))}
                    </select>
                    <small style={{ color: "var(--text-muted)", fontSize: "11.5px", marginTop: "4px" }}>
                      Select the verified company this recruiter is authorized to create drives and recruit for.
                    </small>
                  </div>

                  <div className="form-row-2">
                    <div className="form-field-group">
                      <label className="form-field-label">Job Title / Designation</label>
                      <input
                        type="text"
                        className="form-field-input"
                        placeholder="e.g. Talent Acquisition Lead"
                        value={editFormData.jobTitle}
                        onChange={(e) => setEditFormData({ ...editFormData, jobTitle: e.target.value })}
                      />
                    </div>
                    <div className="form-field-group">
                      <label className="form-field-label">Direct Phone</label>
                      <input
                        type="text"
                        className="form-field-input"
                        placeholder="e.g. +91 98765 43210"
                        value={editFormData.phone}
                        onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-row-2">
                    <div className="form-field-group">
                      <label className="form-field-label">Account Status</label>
                      <select
                        className="form-field-input"
                        value={editFormData.accountStatus}
                        onChange={(e) => setEditFormData({ ...editFormData, accountStatus: e.target.value })}
                      >
                        <option value="Active">Active (Permitted to Log In)</option>
                        <option value="Inactive">Inactive (Suspended)</option>
                      </select>
                    </div>
                    <div className="form-field-group">
                      <label className="form-field-label">Verification Standing</label>
                      <select
                        className="form-field-input"
                        value={editFormData.isVerified ? "true" : "false"}
                        onChange={(e) => setEditFormData({ ...editFormData, isVerified: e.target.value === "true" })}
                      >
                        <option value="true">Verified Institutional Liaison</option>
                        <option value="false">Pending Directorate Review</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="admin-modal-footer">
                  <button
                    type="button"
                    className="btn-secondary btn-sm"
                    onClick={() => setEditingRecruiter(null)}
                    disabled={editSubmitting}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary btn-sm" disabled={editSubmitting}>
                    {editSubmitting ? "Saving..." : "Save Recruiter Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
