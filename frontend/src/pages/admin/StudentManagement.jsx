import React, { useState, useEffect, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Users,
  Search,
  Filter,
  RefreshCw,
  Download,
  CheckCircle2,
  AlertCircle,
  FileText,
  Award,
  ChevronLeft,
  ChevronRight,
  Eye,
  X,
  ExternalLink,
  ShieldCheck,
  GraduationCap,
} from "lucide-react";
import AppLayout from "../../components/ui/AppLayout.jsx";
import {
  PageHeader,
  CompanyLogo,
  ApplicationStatusBadge,
} from "../../components/ui/EditorialComponents.jsx";
import { adminApi } from "../../api/adminApi.js";
import "./StudentManagement.css";

export default function StudentManagement() {
  const [searchParams, setSearchParams] = useSearchParams();

  // State
  const [students, setStudents] = useState([]);
  const [summaryCards, setSummaryCards] = useState(null);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalRecords: 0, pageSize: 10 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [programFilter, setProgramFilter] = useState(searchParams.get("program") || "all");
  const [placementFilter, setPlacementFilter] = useState(searchParams.get("placement") || "all");
  const [offerSignedFilter, setOfferSignedFilter] = useState(searchParams.get("offerSigned") || "all");
  const [backlogFilter, setBacklogFilter] = useState(searchParams.get("backlogs") || "all");
  const [verificationFilter, setVerificationFilter] = useState(searchParams.get("verification") || "all");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  // Selected student for detail modal
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Fetch students
  const fetchStudentsList = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminApi.getStudents({
        search: searchTerm,
        program: programFilter,
        placementStatus: placementFilter,
        offerSigned: offerSignedFilter,
        backlogStatus: backlogFilter,
        verificationStatus: verificationFilter,
        page,
        limit: 10,
      });

      setStudents(data.students || []);
      setPagination(data.pagination || { currentPage: 1, totalPages: 1, totalRecords: 0, pageSize: 10 });
      if (data.summaryCards) {
        setSummaryCards(data.summaryCards);
      }
    } catch (err) {
      console.error("Failed to load students:", err);
      setError(err.message || "Failed to load student records from database.");
    } finally {
      setLoading(false);
    }
  }, [searchTerm, programFilter, placementFilter, offerSignedFilter, backlogFilter, verificationFilter, page]);

  useEffect(() => {
    fetchStudentsList();
  }, [fetchStudentsList]);

  // Handle Search Input submit / debounce
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchStudentsList();
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setProgramFilter("all");
    setPlacementFilter("all");
    setOfferSignedFilter("all");
    setBacklogFilter("all");
    setVerificationFilter("all");
    setPage(1);
  };

  // Toggle Verification Clearance
  const handleToggleClearance = async (student) => {
    const nextStatus = student.verificationStatus === "verified" ? "pending" : "verified";
    try {
      await adminApi.updateStudentVerification(student.id, {
        placementVerificationStatus: nextStatus,
      });
      setFeedback({
        type: "success",
        message: `Clearance status for ${student.name} (${student.rollNo}) updated to "${nextStatus}".`,
      });
      fetchStudentsList();
    } catch (err) {
      setFeedback({
        type: "error",
        message: err.message || "Failed to update verification status.",
      });
    }
  };

  // View Student Full Details
  const handleViewProfile = async (id) => {
    try {
      setDetailLoading(true);
      const fullStudent = await adminApi.getStudentById(id);
      setSelectedStudent(fullStudent);
    } catch (err) {
      alert("Failed to load student profile details: " + err.message);
    } finally {
      setDetailLoading(false);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (students.length === 0) return;
    const headers = [
      "Roll No",
      "PRN",
      "Name",
      "Program",
      "Department",
      "Graduation Year",
      "CGPA",
      "Active Backlogs",
      "Applied Drives",
      "Offer Letter Signed",
      "Placement Status",
      "Clearance Status",
    ];

    const rows = students.map((s) => [
      s.rollNo,
      s.prn,
      `"${s.name}"`,
      s.program,
      `"${s.department}"`,
      s.graduationYear,
      s.cgpa || "N/A",
      s.activeBacklogs,
      s.appliedDrivesCount,
      s.offerLetterSigned,
      s.placementStatus,
      s.verificationStatus,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `CPRMP_Student_Register_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AppLayout pageTitle="Student Management" breadcrumb="TPO Authority">
      <div className="admin-students-page">
        {/* Page Header */}
        <PageHeader
          eyebrow="TPO ADMINISTRATION CONSOLE"
          title="Student Management"
          description="View student profiles, academic performance, application activity, and placement outcomes."
          actions={
            <div className="admin-header-actions">
              <button
                type="button"
                className="btn-secondary btn-sm"
                onClick={fetchStudentsList}
                disabled={loading}
              >
                <RefreshCw size={14} className={loading ? "spin-icon" : ""} />
                <span>Refresh</span>
              </button>
              <button type="button" className="btn-secondary btn-sm" onClick={handleExportCSV}>
                <Download size={14} />
                <span>Export CSV</span>
              </button>
            </div>
          }
        />

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`admin-feedback-banner ${feedback.type === "error" ? "feedback-error" : "feedback-success"}`}
          >
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

        {/* Four Primary Summary Cards */}
        <div className="admin-student-summary-cards">
          {/* Card 1: Total Students */}
          <div className="student-summary-card">
            <div className="sum-card-top">
              <span className="sum-card-label">Total Registered Students</span>
              <Users size={16} className="text-secondary" />
            </div>
            <div className="sum-card-value">{loading ? "..." : (summaryCards?.totalStudents ?? 0)}</div>
            <div className="sum-card-detail">Verified institutional enrollment (2026–2027)</div>
          </div>

          {/* Card 2: Students by Academic Program */}
          <div className="student-summary-card">
            <div className="sum-card-top">
              <span className="sum-card-label">Program Distribution</span>
              <GraduationCap size={16} className="text-accent" />
            </div>
            <div className="sum-card-programs-list">
              {summaryCards?.programBreakdown?.slice(0, 3).map((p) => (
                <div key={p.program} className="sum-program-item">
                  <span>{p.program}:</span>
                  <strong>{p.count}</strong>
                </div>
              ))}
              {(summaryCards?.programBreakdown?.length || 0) > 3 && (
                <span className="sum-more-tag">+{summaryCards.programBreakdown.length - 3} more</span>
              )}
            </div>
            <div className="sum-card-detail">Based on enrolled academic programs</div>
          </div>

          {/* Card 3: Students with Signed Offer Letters */}
          <div className="student-summary-card">
            <div className="sum-card-top">
              <span className="sum-card-label">Signed Offer Letters</span>
              <Award size={16} className="text-accent" />
            </div>
            <div className="sum-card-value" style={{ color: "var(--accent)" }}>
              {loading ? "..." : (summaryCards?.signedOfferLetters ?? 0)}
            </div>
            <div className="sum-card-detail">Distinct candidates with countersigned offer documents</div>
          </div>

          {/* Card 4: Students with Active Backlogs */}
          <div className="student-summary-card">
            <div className="sum-card-top">
              <span className="sum-card-label">Backlog Audit Standing</span>
              <AlertCircle size={16} className="text-warning" />
            </div>
            <div className="sum-card-value" style={{ color: "var(--text-primary)" }}>
              {loading ? "..." : (summaryCards?.studentsWithActiveBacklogs ?? 0)}
            </div>
            <div className="sum-card-detail">
              <span style={{ color: "var(--success)", fontWeight: 600 }}>
                {summaryCards?.studentsWithZeroBacklogs ?? 0} Students
              </span>{" "}
              with 0 active backlogs (Audit Cleared)
            </div>
          </div>
        </div>

        {/* Filter Bar & Search */}
        <div className="admin-filter-container">
          <form onSubmit={handleSearchSubmit} className="admin-search-form">
            <div className="admin-search-wrapper" style={{ width: "280px" }}>
              <Search size={14} className="admin-search-icon" />
              <input
                type="search"
                placeholder="Search name, roll no, PRN, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button type="submit" className="btn-secondary btn-sm">
              Search
            </button>
          </form>

          <div className="admin-filters-row">
            {/* Program Filter */}
            <select
              className="admin-select-filter"
              value={programFilter}
              onChange={(e) => {
                setProgramFilter(e.target.value);
                setPage(1);
              }}
              aria-label="Filter by program"
            >
              <option value="all">All Programs</option>
              <option value="MCA">MCA</option>
              <option value="B.Tech">B.Tech</option>
              <option value="BCA">BCA</option>
              <option value="M.Sc. IT">M.Sc. IT</option>
              <option value="B.Sc. IT">B.Sc. IT</option>
              <option value="M.Tech">M.Tech</option>
            </select>

            {/* Placement Status Filter */}
            <select
              className="admin-select-filter"
              value={placementFilter}
              onChange={(e) => {
                setPlacementFilter(e.target.value);
                setPage(1);
              }}
              aria-label="Filter by placement status"
            >
              <option value="all">All Placement Statuses</option>
              <option value="placed">Placed (Signed Offer)</option>
              <option value="selected">Selected</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="under review">Under Review</option>
              <option value="not placed">Not Placed</option>
            </select>

            {/* Signed Offer Filter */}
            <select
              className="admin-select-filter"
              value={offerSignedFilter}
              onChange={(e) => {
                setOfferSignedFilter(e.target.value);
                setPage(1);
              }}
              aria-label="Filter by offer signed"
            >
              <option value="all">All Offer Statuses</option>
              <option value="yes">Offer Signed: Yes</option>
              <option value="no">Offer Signed: No</option>
            </select>

            {/* Backlogs Filter */}
            <select
              className="admin-select-filter"
              value={backlogFilter}
              onChange={(e) => {
                setBacklogFilter(e.target.value);
                setPage(1);
              }}
              aria-label="Filter by backlogs"
            >
              <option value="all">All Backlog Records</option>
              <option value="clear">0 Active Backlogs (Clear)</option>
              <option value="with_backlogs">Active Backlogs (&gt; 0)</option>
            </select>

            {/* Verification Filter */}
            <select
              className="admin-select-filter"
              value={verificationFilter}
              onChange={(e) => {
                setVerificationFilter(e.target.value);
                setPage(1);
              }}
              aria-label="Filter by clearance status"
            >
              <option value="all">All Clearance States</option>
              <option value="verified">Verified by TPO</option>
              <option value="pending">Pending Audit</option>
            </select>

            {(searchTerm ||
              programFilter !== "all" ||
              placementFilter !== "all" ||
              offerSignedFilter !== "all" ||
              backlogFilter !== "all" ||
              verificationFilter !== "all") && (
              <button type="button" className="admin-reset-link" onClick={handleResetFilters}>
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Student Management Table (12 Required Columns) */}
        <div className="admin-card-section" style={{ padding: 0 }}>
          <div className="admin-table-wrapper" style={{ border: "none" }}>
            <table className="admin-editorial-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Roll Number</th>
                  <th>PRN / Enrollment</th>
                  <th>Program</th>
                  <th>Department / Branch</th>
                  <th>Grad. Year</th>
                  <th>CGPA</th>
                  <th>Active Backlogs</th>
                  <th>Applied Drives</th>
                  <th>Offer Signed</th>
                  <th>Placement Status</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={12} style={{ textAlign: "center", padding: "36px", color: "var(--text-muted)" }}>
                      Loading verified student records from database...
                    </td>
                  </tr>
                ) : students.length > 0 ? (
                  students.map((std) => (
                    <tr key={std.id}>
                      {/* 1. Name */}
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div className="student-avatar-initial">
                            {std.name.charAt(0)}
                          </div>
                          <div>
                            <strong style={{ fontWeight: 600 }}>{std.name}</strong>
                            <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{std.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* 2. Roll Number */}
                      <td style={{ fontWeight: 500 }}>{std.rollNo}</td>

                      {/* 3. PRN */}
                      <td style={{ color: "var(--text-muted)", fontSize: "12px" }}>{std.prn}</td>

                      {/* 4. Program */}
                      <td>
                        <span className="editorial-badge badge-neutral">{std.program}</span>
                      </td>

                      {/* 5. Department */}
                      <td style={{ color: "var(--text-secondary)", fontSize: "12px" }}>{std.department}</td>

                      {/* 6. Graduation Year */}
                      <td>{std.graduationYear || 2026}</td>

                      {/* 7. CGPA */}
                      <td>
                        {std.cgpa !== null ? (
                          <strong style={{ color: "var(--accent)" }}>{std.cgpa.toFixed(2)}</strong>
                        ) : (
                          <span style={{ color: "var(--text-muted)" }}>Not Provided</span>
                        )}
                      </td>

                      {/* 8. Active Backlogs */}
                      <td>
                        {std.activeBacklogs === 0 ? (
                          <span style={{ color: "var(--success)", fontWeight: 500 }}>0 (Clear)</span>
                        ) : (
                          <span style={{ color: "var(--error)", fontWeight: 600 }}>{std.activeBacklogs} Backlog</span>
                        )}
                      </td>

                      {/* 9. Applied Drives */}
                      <td style={{ textAlign: "center" }}>
                        <span className="editorial-badge badge-neutral">{std.appliedDrivesCount}</span>
                      </td>

                      {/* 10. Offer Letter Signed */}
                      <td>
                        {std.offerLetterSigned === "Yes" ? (
                          <span className="editorial-badge badge-success">Signed</span>
                        ) : std.offerLetterSigned === "Pending" ? (
                          <span className="editorial-badge badge-warning">Pending</span>
                        ) : (
                          <span className="editorial-badge badge-neutral">No</span>
                        )}
                      </td>

                      {/* 11. Placement Status */}
                      <td>
                        <ApplicationStatusBadge status={std.placementStatus} />
                      </td>

                      {/* 12. Actions */}
                      <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                        <div style={{ display: "inline-flex", gap: "6px" }}>
                          <button
                            type="button"
                            className="btn-secondary btn-sm"
                            onClick={() => handleViewProfile(std.id)}
                            title="View complete profile & academic details"
                          >
                            <Eye size={13} />
                            <span>View</span>
                          </button>
                          <button
                            type="button"
                            className={`btn-sm ${std.verificationStatus === "verified" ? "btn-secondary" : "btn-primary"}`}
                            onClick={() => handleToggleClearance(std)}
                            title={std.verificationStatus === "verified" ? "Revoke clearance" : "Approve audit clearance"}
                          >
                            {std.verificationStatus === "verified" ? "Revoke" : "Approve"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={12} style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
                      No student records match the active search and filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Bar */}
          <div className="admin-pagination-bar">
            <span className="pagination-info">
              Showing {(pagination.currentPage - 1) * pagination.pageSize + (students.length > 0 ? 1 : 0)}–
              {Math.min(pagination.currentPage * pagination.pageSize, pagination.totalRecords)} of{" "}
              {pagination.totalRecords} students
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

        {/* Student Detail Modal */}
        {selectedStudent && (
          <div className="admin-modal-backdrop" onClick={() => setSelectedStudent(null)}>
            <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="admin-modal-header">
                <div>
                  <h3 className="admin-modal-title">{selectedStudent.fullName || selectedStudent.studentId}</h3>
                  <p className="admin-modal-subtitle">
                    {selectedStudent.degree} • Roll No: {selectedStudent.studentId} • PRN: {selectedStudent.prn || "N/A"}
                  </p>
                </div>
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => setSelectedStudent(null)}
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="admin-modal-body">
                {/* Academic Highlights */}
                <div className="modal-section">
                  <h4 className="modal-sec-title">Academic & Contact Dossier</h4>
                  <div className="modal-info-grid">
                    <div>
                      <span className="info-label">Current CGPA</span>
                      <strong className="info-val">{selectedStudent.cgpa?.toFixed(2) || "Not Provided"}</strong>
                    </div>
                    <div>
                      <span className="info-label">Active Backlogs</span>
                      <strong className="info-val">
                        {selectedStudent.backlogCount === 0 ? "0 (All Cleared)" : `${selectedStudent.backlogCount} Active`}
                      </strong>
                    </div>
                    <div>
                      <span className="info-label">Graduation Year</span>
                      <strong className="info-val">{selectedStudent.graduationYear} (Sem {selectedStudent.currentSemester || 4})</strong>
                    </div>
                    <div>
                      <span className="info-label">Institutional College</span>
                      <strong className="info-val">{selectedStudent.collegeName || "DPIATR"}</strong>
                    </div>
                    <div>
                      <span className="info-label">Email Address</span>
                      <strong className="info-val">{selectedStudent.personalEmail || selectedStudent.userId?.email || "N/A"}</strong>
                    </div>
                    <div>
                      <span className="info-label">Contact Phone</span>
                      <strong className="info-val">{selectedStudent.phone || "N/A"}</strong>
                    </div>
                  </div>
                </div>

                {/* Applied Drives & Application History */}
                <div className="modal-section">
                  <h4 className="modal-sec-title">Applied Placement Drives ({selectedStudent.applications?.length || 0})</h4>
                  {selectedStudent.applications?.length > 0 ? (
                    <div className="modal-app-list">
                      {selectedStudent.applications.map((app) => (
                        <div key={app._id} className="modal-app-item">
                          <div>
                            <strong>{app.placementDriveId?.companyId?.name || "Corporate Drive"}</strong>
                            <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                              {app.placementDriveId?.title} • {app.placementDriveId?.salary || "CTC TBD"}
                            </div>
                          </div>
                          <ApplicationStatusBadge status={app.status} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ fontSize: "12.5px", color: "var(--text-muted)" }}>
                      Student has not submitted applications for any drives yet.
                    </p>
                  )}
                </div>

                {/* Official Placement Records & Signed Offer Letters */}
                <div className="modal-section">
                  <h4 className="modal-sec-title">Official Placement Records & Offers</h4>
                  {selectedStudent.placementHistory?.length > 0 ? (
                    <div className="modal-placement-list">
                      {selectedStudent.placementHistory.map((rec) => (
                        <div key={rec._id} className="modal-placement-item">
                          <div>
                            <strong style={{ color: "var(--accent)", fontSize: "14px" }}>
                              {rec.companyId?.name || "Hiring Enterprise"}
                            </strong>
                            <div style={{ fontSize: "12.5px", color: "var(--text-primary)" }}>
                              {rec.jobTitle || "Software Engineer"} •{" "}
                              <strong>{rec.packageAmount ? `₹${(rec.packageAmount / 100000).toFixed(1)} LPA` : "Offered CTC"}</strong>
                            </div>
                            <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                              Placed on: {new Date(rec.placedAt).toLocaleDateString()}
                            </div>
                          </div>
                          <span
                            className={`editorial-badge ${rec.offerLetterStatus === "signed" ? "badge-success" : "badge-warning"}`}
                          >
                            {rec.offerLetterStatus === "signed" ? "Offer Signed" : "Offer Issued"}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ fontSize: "12.5px", color: "var(--text-muted)" }}>
                      No placement offers recorded for this student yet.
                    </p>
                  )}
                </div>
              </div>

              <div className="admin-modal-footer">
                <button type="button" className="btn-secondary btn-sm" onClick={() => setSelectedStudent(null)}>
                  Close Dossier
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
