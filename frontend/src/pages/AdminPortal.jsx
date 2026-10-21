import { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import {
  Users,
  Building,
  Briefcase,
  Send,
  ShieldCheck,
  CheckCircle2,
  Search,
  Plus,
  Check,
  X,
  Eye,
  Edit,
  Trash2,
  Filter,
} from "lucide-react";
import AppLayout from "../components/ui/AppLayout.jsx";
import {
  PageHeader,
  MetricRow,
  MetricItem,
  ApplicationStatusBadge,
  CompanyLogo,
  PrimaryButton,
  SecondaryButton,
  ConfirmDialog,
  EmptyState,
} from "../components/ui/EditorialComponents.jsx";
import "./AdminPortal.css";

const INITIAL_STUDENTS = [
  { id: "std-001", name: "Aryan Sharma", rollNo: "MCA2024-042", degree: "MCA", cgpa: 8.84, backlogs: 0, status: "Verified" },
  { id: "std-002", name: "Pooja Reddy", rollNo: "BTECH-CS-102", degree: "B.Tech CS", cgpa: 9.12, backlogs: 0, status: "Verified" },
  { id: "std-003", name: "Rohan Varma", rollNo: "MCA2024-019", degree: "MCA", cgpa: 7.40, backlogs: 1, status: "Pending Audit" },
  { id: "std-004", name: "Sneha Nair", rollNo: "BTECH-IT-084", degree: "B.Tech IT", cgpa: 8.55, backlogs: 0, status: "Verified" },
  { id: "std-005", name: "Aditya Roy", rollNo: "MTECH-CS-004", degree: "M.Tech CS", cgpa: 8.90, backlogs: 0, status: "Verified" },
];

const INITIAL_COMPANIES = [
  { id: "comp-001", name: "Microsoft IDC", industry: "Cloud & AI Infrastructure", contact: "ta-india@microsoft.com", activeDrives: 1, status: "Active" },
  { id: "comp-002", name: "Goldman Sachs", industry: "Financial Services & Tech", contact: "campus-recruitment@gs.com", activeDrives: 1, status: "Active" },
  { id: "comp-003", name: "Google India", industry: "Internet & Technology", contact: "university-programs@google.com", activeDrives: 1, status: "Active" },
  { id: "comp-004", name: "Deloitte USI", industry: "Consulting & Technology", contact: "deloitte-campus@deloitte.com", activeDrives: 1, status: "Active" },
];

const INITIAL_DRIVES = [
  { id: "drv-001", company: "Microsoft IDC", role: "Software Engineer — Cloud & AI", ctc: "₹32.0 LPA", minCgpa: 8.0, deadline: "28 Oct 2026", status: "Active", applicants: 42 },
  { id: "drv-002", company: "Goldman Sachs", role: "Engineering Analyst", ctc: "₹28.5 LPA", minCgpa: 8.0, deadline: "02 Nov 2026", status: "Active", applicants: 38 },
  { id: "drv-003", company: "Infosys", role: "Systems Specialist", ctc: "₹9.5 LPA", minCgpa: 7.0, deadline: "05 Nov 2026", status: "Active", applicants: 85 },
];

export default function AdminPortal() {
  const location = useLocation();
  const queryTab = new URLSearchParams(location.search).get("tab");

  const [activeTab, setActiveTab] = useState(queryTab || "overview");
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [companies] = useState(INITIAL_COMPANIES);
  const [drives, setDrives] = useState(INITIAL_DRIVES);
  const [search, setSearch] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: "", message: "", action: null });

  const toggleStudentVerification = (id) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: s.status === "Verified" ? "Pending Audit" : "Verified" } : s))
    );
    setFeedback({ type: "success", message: "Student eligibility status updated successfully." });
  };

  const tabs = [
    { id: "overview", label: "Dashboard Overview", icon: ShieldCheck },
    { id: "students", label: "Student Management", icon: Users },
    { id: "companies", label: "Companies & Recruiters", icon: Building },
    { id: "drives", label: "Placement Drives", icon: Briefcase },
    { id: "records", label: "Placement Records", icon: CheckCircle2 },
  ];

  return (
    <AppLayout pageTitle="Placement Administration" breadcrumb="TPO Authority">
      <div className="admin-editorial-container">
        <PageHeader
          eyebrow="TPO ADMINISTRATION CONSOLE"
          title="Placement Operations & Governance"
          description="Institutional control room for managing student verification, recruitment drives, company authorizations, and formal placement records."
        />

        {feedback && (
          <div
            style={{
              padding: "12px 18px",
              borderRadius: "6px",
              backgroundColor: feedback.type === "error" ? "var(--error-soft)" : "var(--success-soft)",
              border: `1px solid ${feedback.type === "error" ? "#f5c2c2" : "#c6e1c9"}`,
              color: feedback.type === "error" ? "var(--error)" : "var(--success)",
              fontSize: "13.5px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
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

        {/* Global Admin Metrics */}
        <MetricRow>
          <MetricItem
            label="Enrolled Students"
            value={students.length}
            detail="Registered in 2026–2027 cycle"
            icon={Users}
          />
          <MetricItem
            label="Corporate Partners"
            value={companies.length}
            detail="Authorized recruitment firms"
            icon={Building}
          />
          <MetricItem
            label="Active Campus Drives"
            value={drives.length}
            detail="Scheduled recruitment events"
            icon={Briefcase}
          />
          <MetricItem
            label="Verified Candidates"
            value={students.filter((s) => s.status === "Verified").length}
            detail="Eligibility audited by TPO"
            icon={CheckCircle2}
          />
        </MetricRow>

        {/* Tab Navigation */}
        <div className="admin-tabs-bar">
          {tabs.map((tab) => {
            const IconComp = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                className={`admin-tab-btn ${active ? "active" : ""}`}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSearch("");
                }}
              >
                <IconComp size={15} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Panels */}
        {activeTab === "overview" && (
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "24px" }}>
            <div className="admin-card-section">
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "19px", margin: "0 0 16px", color: "var(--text-primary)" }}>
                Active Placement Drive Summary
              </h2>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                <thead>
                  <tr style={{ background: "var(--surface-secondary)", borderBottom: "1px solid var(--border)", textAlign: "left" }}>
                    <th style={{ padding: "10px 14px", color: "var(--text-secondary)", fontSize: "11px", textTransform: "uppercase" }}>Company</th>
                    <th style={{ padding: "10px 14px", color: "var(--text-secondary)", fontSize: "11px", textTransform: "uppercase" }}>Role</th>
                    <th style={{ padding: "10px 14px", color: "var(--text-secondary)", fontSize: "11px", textTransform: "uppercase" }}>CTC</th>
                    <th style={{ padding: "10px 14px", color: "var(--text-secondary)", fontSize: "11px", textTransform: "uppercase" }}>Applicants</th>
                  </tr>
                </thead>
                <tbody>
                  {drives.map((d) => (
                    <tr key={d.id} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: "12px 14px", fontWeight: 600 }}>{d.company}</td>
                      <td style={{ padding: "12px 14px", color: "var(--text-secondary)" }}>{d.role}</td>
                      <td style={{ padding: "12px 14px", color: "var(--accent)", fontWeight: 600 }}>{d.ctc}</td>
                      <td style={{ padding: "12px 14px" }}>{d.applicants} candidates</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="admin-card-section" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "19px", margin: 0, color: "var(--text-primary)" }}>
                Verification Standing
              </h2>
              <div style={{ background: "var(--surface-secondary)", padding: "16px", borderRadius: "6px", border: "1px solid var(--border)" }}>
                <span style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>
                  Automated Audit Status
                </span>
                <div style={{ fontSize: "18px", fontFamily: "var(--font-serif)", color: "var(--success)", marginTop: "4px" }}>
                  {students.filter((s) => s.status === "Verified").length} / {students.length} Students Cleared
                </div>
                <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: "6px 0 0" }}>
                  All candidates meeting CGPA and zero backlog prerequisites are cleared to apply for campus drives.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Student Management */}
        {activeTab === "students" && (
          <div className="admin-card-section">
            <div className="admin-table-controls">
              <div>
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "19px", margin: 0, color: "var(--text-primary)" }}>
                  Registered Students ({students.length})
                </h2>
                <p style={{ fontSize: "12.5px", color: "var(--text-secondary)", margin: "2px 0 0" }}>
                  Audit candidate transcripts, CGPA, and backlog clearances.
                </p>
              </div>

              <div style={{ position: "relative", width: "240px" }}>
                <Search size={14} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input
                  type="search"
                  placeholder="Search students..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="topbar-search-input"
                />
              </div>
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ background: "var(--surface-secondary)", borderBottom: "1px solid var(--border)", textAlign: "left" }}>
                  <th style={{ padding: "10px 14px", color: "var(--text-secondary)", fontSize: "11px", textTransform: "uppercase" }}>Name</th>
                  <th style={{ padding: "10px 14px", color: "var(--text-secondary)", fontSize: "11px", textTransform: "uppercase" }}>Roll No</th>
                  <th style={{ padding: "10px 14px", color: "var(--text-secondary)", fontSize: "11px", textTransform: "uppercase" }}>Program</th>
                  <th style={{ padding: "10px 14px", color: "var(--text-secondary)", fontSize: "11px", textTransform: "uppercase" }}>CGPA</th>
                  <th style={{ padding: "10px 14px", color: "var(--text-secondary)", fontSize: "11px", textTransform: "uppercase" }}>Backlogs</th>
                  <th style={{ padding: "10px 14px", color: "var(--text-secondary)", fontSize: "11px", textTransform: "uppercase" }}>Status</th>
                  <th style={{ padding: "10px 14px", textAlign: "right", color: "var(--text-secondary)", fontSize: "11px", textTransform: "uppercase" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students
                  .filter((s) => !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.rollNo.toLowerCase().includes(search.toLowerCase()))
                  .map((std) => (
                    <tr key={std.id} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: "12px 14px", fontWeight: 600 }}>{std.name}</td>
                      <td style={{ padding: "12px 14px", color: "var(--text-muted)" }}>{std.rollNo}</td>
                      <td style={{ padding: "12px 14px" }}>{std.degree}</td>
                      <td style={{ padding: "12px 14px", fontWeight: 600 }}>{std.cgpa.toFixed(2)}</td>
                      <td style={{ padding: "12px 14px" }}>{std.backlogs}</td>
                      <td style={{ padding: "12px 14px" }}>
                        <span className={`editorial-badge ${std.status === "Verified" ? "badge-success" : "badge-warning"}`}>
                          {std.status}
                        </span>
                      </td>
                      <td style={{ padding: "12px 14px", textAlign: "right" }}>
                        <button
                          type="button"
                          className="btn-secondary btn-sm"
                          onClick={() => toggleStudentVerification(std.id)}
                        >
                          {std.status === "Verified" ? "Revoke Audit" : "Approve Clearance"}
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab: Companies */}
        {activeTab === "companies" && (
          <div className="admin-card-section">
            <div className="admin-table-controls">
              <div>
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "19px", margin: 0, color: "var(--text-primary)" }}>
                  Recruiting Organizations ({companies.length})
                </h2>
                <p style={{ fontSize: "12.5px", color: "var(--text-secondary)", margin: "2px 0 0" }}>
                  Authorized corporate partners participating in the campus cycle.
                </p>
              </div>
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ background: "var(--surface-secondary)", borderBottom: "1px solid var(--border)", textAlign: "left" }}>
                  <th style={{ padding: "10px 14px", color: "var(--text-secondary)", fontSize: "11px", textTransform: "uppercase" }}>Company</th>
                  <th style={{ padding: "10px 14px", color: "var(--text-secondary)", fontSize: "11px", textTransform: "uppercase" }}>Domain / Industry</th>
                  <th style={{ padding: "10px 14px", color: "var(--text-secondary)", fontSize: "11px", textTransform: "uppercase" }}>Point of Contact</th>
                  <th style={{ padding: "10px 14px", color: "var(--text-secondary)", fontSize: "11px", textTransform: "uppercase" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((c) => (
                  <tr key={c.id} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "12px 14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <CompanyLogo name={c.name} />
                        <strong style={{ fontWeight: 600 }}>{c.name}</strong>
                      </div>
                    </td>
                    <td style={{ padding: "12px 14px", color: "var(--text-secondary)" }}>{c.industry}</td>
                    <td style={{ padding: "12px 14px", color: "var(--text-muted)" }}>{c.contact}</td>
                    <td style={{ padding: "12px 14px" }}>
                      <span className="editorial-badge badge-success">{c.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab: Drives */}
        {activeTab === "drives" && (
          <div className="admin-card-section">
            <div className="admin-table-controls">
              <div>
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "19px", margin: 0, color: "var(--text-primary)" }}>
                  Placement Drives & Requirements
                </h2>
                <p style={{ fontSize: "12.5px", color: "var(--text-secondary)", margin: "2px 0 0" }}>
                  Official drives scheduled for campus interview sessions.
                </p>
              </div>
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ background: "var(--surface-secondary)", borderBottom: "1px solid var(--border)", textAlign: "left" }}>
                  <th style={{ padding: "10px 14px", color: "var(--text-secondary)", fontSize: "11px", textTransform: "uppercase" }}>Company</th>
                  <th style={{ padding: "10px 14px", color: "var(--text-secondary)", fontSize: "11px", textTransform: "uppercase" }}>Designation</th>
                  <th style={{ padding: "10px 14px", color: "var(--text-secondary)", fontSize: "11px", textTransform: "uppercase" }}>Package</th>
                  <th style={{ padding: "10px 14px", color: "var(--text-secondary)", fontSize: "11px", textTransform: "uppercase" }}>Min CGPA</th>
                  <th style={{ padding: "10px 14px", color: "var(--text-secondary)", fontSize: "11px", textTransform: "uppercase" }}>Deadline</th>
                  <th style={{ padding: "10px 14px", color: "var(--text-secondary)", fontSize: "11px", textTransform: "uppercase" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {drives.map((d) => (
                  <tr key={d.id} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "12px 14px", fontWeight: 600 }}>{d.company}</td>
                    <td style={{ padding: "12px 14px", color: "var(--text-primary)" }}>{d.role}</td>
                    <td style={{ padding: "12px 14px", color: "var(--accent)", fontWeight: 600 }}>{d.ctc}</td>
                    <td style={{ padding: "12px 14px" }}>CGPA {d.minCgpa}</td>
                    <td style={{ padding: "12px 14px", color: "var(--text-muted)" }}>{d.deadline}</td>
                    <td style={{ padding: "12px 14px" }}>
                      <span className="editorial-badge badge-accent">{d.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab: Records */}
        {activeTab === "records" && (
          <div className="admin-card-section">
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "19px", margin: "0 0 16px", color: "var(--text-primary)" }}>
              Institutional Selection & Placement Records
            </h2>
            <div style={{ padding: "20px", background: "var(--surface-secondary)", borderRadius: "6px", border: "1px solid var(--border)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <strong style={{ fontSize: "15px", color: "var(--text-primary)" }}>Official Placement Record Register</strong>
                  <p style={{ fontSize: "12.5px", color: "var(--text-secondary)", margin: "4px 0 0" }}>
                    Verified offers are countersigned by the college Principal and Dean of Placements.
                  </p>
                </div>
                <span className="editorial-badge badge-success">Audit Complete</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.action}
        onCancel={() => setConfirmDialog({ isOpen: false, title: "", message: "", action: null })}
      />
    </AppLayout>
  );
}
