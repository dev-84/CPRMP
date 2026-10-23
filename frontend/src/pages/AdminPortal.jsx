import { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  ArrowRight,
  Clock,
  Award,
  TrendingUp,
  FileText,
  AlertCircle,
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

const INITIAL_APPLICATIONS = [
  {
    id: "app-adm-001",
    studentId: "std-001",
    candidateName: "Aryan Sharma",
    rollNo: "MCA2024-042",
    degree: "MCA",
    cgpa: 8.84,
    company: "Microsoft IDC",
    role: "Software Engineer — Cloud & AI",
    appliedDate: "16 Oct 2026",
    status: "Shortlisted",
    resumeAvailable: true,
  },
  {
    id: "app-adm-002",
    studentId: "std-002",
    candidateName: "Pooja Reddy",
    rollNo: "BTECH-CS-102",
    degree: "B.Tech CS",
    cgpa: 9.12,
    company: "Goldman Sachs",
    role: "Engineering Analyst",
    appliedDate: "18 Oct 2026",
    status: "Under Review",
    resumeAvailable: true,
  },
  {
    id: "app-adm-003",
    studentId: "std-003",
    candidateName: "Rohan Varma",
    rollNo: "MCA2024-019",
    degree: "MCA",
    cgpa: 7.40,
    company: "Infosys",
    role: "Systems Specialist",
    appliedDate: "12 Oct 2026",
    status: "Applied",
    resumeAvailable: true,
  },
  {
    id: "app-adm-004",
    studentId: "std-004",
    candidateName: "Sneha Nair",
    rollNo: "BTECH-IT-084",
    degree: "B.Tech IT",
    cgpa: 8.55,
    company: "Deloitte USI",
    role: "Technology Consultant",
    appliedDate: "19 Oct 2026",
    status: "Selected",
    resumeAvailable: true,
  },
  {
    id: "app-adm-005",
    studentId: "std-005",
    candidateName: "Aditya Roy",
    rollNo: "MTECH-CS-004",
    degree: "M.Tech CS",
    cgpa: 8.90,
    company: "Google India",
    role: "Software Engineer",
    appliedDate: "20 Oct 2026",
    status: "Shortlisted",
    resumeAvailable: true,
  },
];

const INITIAL_RECORDS = [
  { id: "rec-001", studentName: "Aryan Sharma", rollNo: "MCA2024-042", degree: "MCA", company: "Microsoft IDC", role: "Software Engineer", package: "₹32.0 LPA", tier: "Super Dream", offerDate: "15 Oct 2026", status: "Accepted" },
  { id: "rec-002", studentName: "Pooja Reddy", rollNo: "BTECH-CS-102", degree: "B.Tech CS", company: "Goldman Sachs", role: "Engineering Analyst", package: "₹28.5 LPA", tier: "Super Dream", offerDate: "18 Oct 2026", status: "Accepted" },
  { id: "rec-003", studentName: "Sneha Nair", rollNo: "BTECH-IT-084", degree: "B.Tech IT", company: "Deloitte USI", role: "Technology Consultant", package: "₹14.0 LPA", tier: "Dream", offerDate: "20 Oct 2026", status: "Accepted" },
  { id: "rec-004", studentName: "Aditya Roy", rollNo: "MTECH-CS-004", degree: "M.Tech CS", company: "Google India", role: "Software Engineer", package: "₹36.0 LPA", tier: "Super Dream", offerDate: "21 Oct 2026", status: "Accepted" },
];

export default function AdminPortal() {
  const location = useLocation();
  const navigate = useNavigate();

  // Dynamically derive activeTab from location.search so it updates instantly when sidebar links are clicked
  const activeTab = useMemo(() => {
    const tabParam = new URLSearchParams(location.search).get("tab");
    const validTabs = ["overview", "students", "companies", "drives", "applications", "records"];
    return tabParam && validTabs.includes(tabParam) ? tabParam : "overview";
  }, [location.search]);

  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [companies, setCompanies] = useState(INITIAL_COMPANIES);
  const [drives, setDrives] = useState(INITIAL_DRIVES);
  const [applications, setApplications] = useState(INITIAL_APPLICATIONS);
  const [records] = useState(INITIAL_RECORDS);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [feedback, setFeedback] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: "", message: "", action: null });

  // Handle switching tabs and synchronizing the URL query parameter
  const handleTabChange = (tabId, initialSearch = "") => {
    setSearch(initialSearch);
    setStatusFilter("all");
    if (tabId === "overview") {
      navigate("/admin");
    } else {
      navigate(`/admin?tab=${tabId}`);
    }
  };

  const toggleStudentVerification = (id) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const newStatus = s.status === "Verified" ? "Pending Audit" : "Verified";
          setFeedback({
            type: "success",
            message: `Verification status for ${s.name} updated to ${newStatus}.`,
          });
          return { ...s, status: newStatus };
        }
        return s;
      })
    );
  };

  const toggleCompanyStatus = (id) => {
    setCompanies((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const next = c.status === "Active" ? "Under Review" : "Active";
          setFeedback({
            type: "success",
            message: `Company status for ${c.name} updated to ${next}.`,
          });
          return { ...c, status: next };
        }
        return c;
      })
    );
  };

  const toggleDriveStatus = (id) => {
    setDrives((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          const next = d.status === "Active" ? "Closed" : "Active";
          setFeedback({
            type: "success",
            message: `Placement drive status for ${d.company} (${d.role}) set to ${next}.`,
          });
          return { ...d, status: next };
        }
        return d;
      })
    );
  };

  const updateApplicationStatus = (id, newStatus) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === id) {
          setFeedback({
            type: "success",
            message: `Application for ${app.candidateName} updated to "${newStatus}".`,
          });
          return { ...app, status: newStatus };
        }
        return app;
      })
    );
  };

  const tabs = [
    { id: "overview", label: "Dashboard Overview", icon: ShieldCheck },
    { id: "students", label: "Student Management", icon: Users },
    { id: "companies", label: "Company Directory", icon: Building },
    { id: "drives", label: "Placement Drives", icon: Briefcase },
    { id: "applications", label: "Applications", icon: Send },
    { id: "records", label: "Placement Records", icon: CheckCircle2 },
  ];

  // Header content depending on active tab
  const headerContent = useMemo(() => {
    switch (activeTab) {
      case "students":
        return {
          title: "Student Management & Audit",
          desc: "Audit candidate transcripts, CGPA, backlogs clearance, and verify placement drive eligibility.",
        };
      case "companies":
        return {
          title: "Corporate Partner Directory",
          desc: "Manage corporate affiliations, authorized recruiting partners, industry domains, and contact representatives.",
        };
      case "drives":
        return {
          title: "Campus Placement Drives",
          desc: "Schedule, monitor, and regulate campus recruitment drives, role designations, CTC compensation, and prerequisites.",
        };
      case "applications":
        return {
          title: "Candidate Applications & Workflow",
          desc: "Track, evaluate, and progress student applications submitted across campus placement drives.",
        };
      case "records":
        return {
          title: "Institutional Placement Records",
          desc: "Official verified register of student job offers, compensation tiers, and placement governance audit.",
        };
      default:
        return {
          title: "Placement Operations & Governance",
          desc: "Institutional control room for managing student verification, recruitment drives, company authorizations, and formal placement records.",
        };
    }
  }, [activeTab]);

  return (
    <AppLayout pageTitle="Placement Administration" breadcrumb="TPO Authority">
      <div className="admin-editorial-container">
        <PageHeader
          eyebrow="TPO ADMINISTRATION CONSOLE"
          title={headerContent.title}
          description={headerContent.desc}
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
              aria-label="Dismiss message"
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
            value={drives.filter((d) => d.status === "Active").length}
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
                onClick={() => handleTabChange(tab.id)}
              >
                <IconComp size={15} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === "overview" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div className="admin-overview-grid" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "24px" }}>
              <div className="admin-card-section">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "19px", margin: 0, color: "var(--text-primary)" }}>
                    Active Placement Drive Summary
                  </h2>
                  <button
                    type="button"
                    className="btn-secondary btn-sm"
                    onClick={() => handleTabChange("drives")}
                  >
                    View All Drives
                  </button>
                </div>
                <div className="admin-table-wrapper">
                  <table className="admin-editorial-table">
                    <thead>
                      <tr>
                        <th>Company</th>
                        <th>Role</th>
                        <th>CTC</th>
                        <th>Applicants</th>
                        <th style={{ textAlign: "right" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {drives.map((d) => (
                        <tr key={d.id}>
                          <td style={{ fontWeight: 600 }}>{d.company}</td>
                          <td style={{ color: "var(--text-secondary)" }}>{d.role}</td>
                          <td style={{ color: "var(--accent)", fontWeight: 600 }}>{d.ctc}</td>
                          <td>{d.applicants} candidates</td>
                          <td style={{ textAlign: "right" }}>
                            <button
                              type="button"
                              className="btn-secondary btn-sm"
                              onClick={() => handleTabChange("applications", d.company)}
                            >
                              Review
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="admin-card-section" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "19px", margin: 0, color: "var(--text-primary)" }}>
                  Verification Standing
                </h2>
                <div className="admin-stat-callout">
                  <span style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>
                    Automated Audit Status
                  </span>
                  <div style={{ fontSize: "20px", fontFamily: "var(--font-serif)", color: "var(--success)", marginTop: "4px" }}>
                    {students.filter((s) => s.status === "Verified").length} / {students.length} Students Cleared
                  </div>
                  <p style={{ fontSize: "12.5px", color: "var(--text-secondary)", margin: "6px 0 0" }}>
                    All candidates meeting minimum CGPA and zero active backlog prerequisites are cleared to apply for campus drives.
                  </p>
                </div>

                <div className="admin-stat-callout">
                  <span style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>
                    Placement Cycle Highlights
                  </span>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px", fontSize: "13px" }}>
                    <span style={{ color: "var(--text-secondary)" }}>Highest CTC Package:</span>
                    <strong style={{ color: "var(--accent)" }}>₹36.0 LPA (Google India)</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px", fontSize: "13px" }}>
                    <span style={{ color: "var(--text-secondary)" }}>Average Verified CTC:</span>
                    <strong style={{ color: "var(--text-primary)" }}>₹27.6 LPA</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px", fontSize: "13px" }}>
                    <span style={{ color: "var(--text-secondary)" }}>Applications In Pipeline:</span>
                    <strong style={{ color: "var(--text-primary)" }}>{applications.length} submitted</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action Gateway */}
            <div className="admin-card-section">
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "17px", margin: "0 0 14px", color: "var(--text-primary)" }}>
                Operations Gateway & Quick Navigation
              </h2>
              <div className="admin-quick-actions-grid">
                <div className="admin-quick-action-card" onClick={() => handleTabChange("students")}>
                  <div className="admin-quick-action-header">
                    <Users size={18} />
                    <ArrowRight size={14} />
                  </div>
                  <span className="admin-quick-action-title">Student Management</span>
                  <span className="admin-quick-action-desc">Audit transcripts, verify academic eligibility, and clear backlogs.</span>
                </div>

                <div className="admin-quick-action-card" onClick={() => handleTabChange("companies")}>
                  <div className="admin-quick-action-header">
                    <Building size={18} />
                    <ArrowRight size={14} />
                  </div>
                  <span className="admin-quick-action-title">Company Directory</span>
                  <span className="admin-quick-action-desc">Review authorized recruiters, point of contacts, and industry domains.</span>
                </div>

                <div className="admin-quick-action-card" onClick={() => handleTabChange("drives")}>
                  <div className="admin-quick-action-header">
                    <Briefcase size={18} />
                    <ArrowRight size={14} />
                  </div>
                  <span className="admin-quick-action-title">Placement Drives</span>
                  <span className="admin-quick-action-desc">Schedule new campus drives, regulate packages, and set deadlines.</span>
                </div>

                <div className="admin-quick-action-card" onClick={() => handleTabChange("applications")}>
                  <div className="admin-quick-action-header">
                    <Send size={18} />
                    <ArrowRight size={14} />
                  </div>
                  <span className="admin-quick-action-title">Applications Review</span>
                  <span className="admin-quick-action-desc">Monitor student applications, shortlisting, and candidate progression.</span>
                </div>

                <div className="admin-quick-action-card" onClick={() => handleTabChange("records")}>
                  <div className="admin-quick-action-header">
                    <CheckCircle2 size={18} />
                    <ArrowRight size={14} />
                  </div>
                  <span className="admin-quick-action-title">Placement Records</span>
                  <span className="admin-quick-action-desc">Institutional selection register and countersigned placement records.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Students */}
        {activeTab === "students" && (
          <div className="admin-card-section">
            <div className="admin-table-controls">
              <div>
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "19px", margin: 0, color: "var(--text-primary)" }}>
                  Registered Students ({students.length})
                </h2>
                <p style={{ fontSize: "12.5px", color: "var(--text-secondary)", margin: "2px 0 0" }}>
                  Audit candidate transcripts, CGPA, and backlog clearances for placement drive eligibility.
                </p>
              </div>

              <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                <div className="admin-filters-group">
                  <button
                    type="button"
                    className={`admin-filter-pill ${statusFilter === "all" ? "active" : ""}`}
                    onClick={() => setStatusFilter("all")}
                  >
                    All ({students.length})
                  </button>
                  <button
                    type="button"
                    className={`admin-filter-pill ${statusFilter === "Verified" ? "active" : ""}`}
                    onClick={() => setStatusFilter("Verified")}
                  >
                    Verified ({students.filter((s) => s.status === "Verified").length})
                  </button>
                  <button
                    type="button"
                    className={`admin-filter-pill ${statusFilter === "Pending Audit" ? "active" : ""}`}
                    onClick={() => setStatusFilter("Pending Audit")}
                  >
                    Pending Audit ({students.filter((s) => s.status === "Pending Audit").length})
                  </button>
                </div>

                <div className="admin-search-wrapper">
                  <Search size={14} className="admin-search-icon" />
                  <input
                    type="search"
                    placeholder="Search name, roll no, degree..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="admin-table-wrapper">
              <table className="admin-editorial-table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Roll Number</th>
                    <th>Program</th>
                    <th>CGPA</th>
                    <th>Active Backlogs</th>
                    <th>Audit Status</th>
                    <th style={{ textAlign: "right" }}>TPO Action</th>
                  </tr>
                </thead>
                <tbody>
                  {students
                    .filter((s) => {
                      const matchesSearch =
                        !search ||
                        s.name.toLowerCase().includes(search.toLowerCase()) ||
                        s.rollNo.toLowerCase().includes(search.toLowerCase()) ||
                        s.degree.toLowerCase().includes(search.toLowerCase());
                      const matchesStatus = statusFilter === "all" || s.status === statusFilter;
                      return matchesSearch && matchesStatus;
                    })
                    .map((std) => (
                      <tr key={std.id}>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <div
                              style={{
                                width: "32px",
                                height: "32px",
                                borderRadius: "50%",
                                backgroundColor: "var(--surface-secondary)",
                                border: "1px solid var(--border)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: 600,
                                fontSize: "12px",
                                color: "var(--accent)",
                              }}
                            >
                              {std.name.charAt(0)}
                            </div>
                            <span style={{ fontWeight: 600 }}>{std.name}</span>
                          </div>
                        </td>
                        <td style={{ color: "var(--text-muted)" }}>{std.rollNo}</td>
                        <td>{std.degree}</td>
                        <td style={{ fontWeight: 600, color: "var(--accent)" }}>{std.cgpa.toFixed(2)}</td>
                        <td>
                          {std.backlogs === 0 ? (
                            <span style={{ color: "var(--success)", fontWeight: 500 }}>0 (Clear)</span>
                          ) : (
                            <span style={{ color: "var(--error)", fontWeight: 600 }}>{std.backlogs} Backlog</span>
                          )}
                        </td>
                        <td>
                          <span className={`editorial-badge ${std.status === "Verified" ? "badge-success" : "badge-warning"}`}>
                            {std.status}
                          </span>
                        </td>
                        <td style={{ textAlign: "right" }}>
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
          </div>
        )}

        {/* Tab 3: Companies */}
        {activeTab === "companies" && (
          <div className="admin-card-section">
            <div className="admin-table-controls">
              <div>
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "19px", margin: 0, color: "var(--text-primary)" }}>
                  Recruiting Organizations ({companies.length})
                </h2>
                <p style={{ fontSize: "12.5px", color: "var(--text-secondary)", margin: "2px 0 0" }}>
                  Authorized corporate partners participating in the institutional campus placement cycle.
                </p>
              </div>

              <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                <div className="admin-filters-group">
                  <button
                    type="button"
                    className={`admin-filter-pill ${statusFilter === "all" ? "active" : ""}`}
                    onClick={() => setStatusFilter("all")}
                  >
                    All ({companies.length})
                  </button>
                  <button
                    type="button"
                    className={`admin-filter-pill ${statusFilter === "Active" ? "active" : ""}`}
                    onClick={() => setStatusFilter("Active")}
                  >
                    Active ({companies.filter((c) => c.status === "Active").length})
                  </button>
                  <button
                    type="button"
                    className={`admin-filter-pill ${statusFilter === "Under Review" ? "active" : ""}`}
                    onClick={() => setStatusFilter("Under Review")}
                  >
                    Under Review ({companies.filter((c) => c.status === "Under Review").length})
                  </button>
                </div>

                <div className="admin-search-wrapper">
                  <Search size={14} className="admin-search-icon" />
                  <input
                    type="search"
                    placeholder="Search company, industry..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="admin-table-wrapper">
              <table className="admin-editorial-table">
                <thead>
                  <tr>
                    <th>Company</th>
                    <th>Domain / Industry</th>
                    <th>Point of Contact</th>
                    <th>Active Drives</th>
                    <th>Status</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {companies
                    .filter((c) => {
                      const matchesSearch =
                        !search ||
                        c.name.toLowerCase().includes(search.toLowerCase()) ||
                        c.industry.toLowerCase().includes(search.toLowerCase()) ||
                        c.contact.toLowerCase().includes(search.toLowerCase());
                      const matchesStatus = statusFilter === "all" || c.status === statusFilter;
                      return matchesSearch && matchesStatus;
                    })
                    .map((c) => (
                      <tr key={c.id}>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <CompanyLogo name={c.name} />
                            <strong style={{ fontWeight: 600 }}>{c.name}</strong>
                          </div>
                        </td>
                        <td style={{ color: "var(--text-secondary)" }}>{c.industry}</td>
                        <td style={{ color: "var(--text-muted)" }}>{c.contact}</td>
                        <td>
                          <span className="editorial-badge badge-neutral">{c.activeDrives} Drive scheduled</span>
                        </td>
                        <td>
                          <span className={`editorial-badge ${c.status === "Active" ? "badge-success" : "badge-warning"}`}>
                            {c.status}
                          </span>
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <button
                            type="button"
                            className="btn-secondary btn-sm"
                            onClick={() => toggleCompanyStatus(c.id)}
                          >
                            {c.status === "Active" ? "Hold Authorization" : "Authorize"}
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Placement Drives */}
        {activeTab === "drives" && (
          <div className="admin-card-section">
            <div className="admin-table-controls">
              <div>
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "19px", margin: 0, color: "var(--text-primary)" }}>
                  Placement Drives & Requirements ({drives.length})
                </h2>
                <p style={{ fontSize: "12.5px", color: "var(--text-secondary)", margin: "2px 0 0" }}>
                  Official placement drives scheduled for campus interview sessions and evaluations.
                </p>
              </div>

              <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                <div className="admin-filters-group">
                  <button
                    type="button"
                    className={`admin-filter-pill ${statusFilter === "all" ? "active" : ""}`}
                    onClick={() => setStatusFilter("all")}
                  >
                    All Drives ({drives.length})
                  </button>
                  <button
                    type="button"
                    className={`admin-filter-pill ${statusFilter === "Active" ? "active" : ""}`}
                    onClick={() => setStatusFilter("Active")}
                  >
                    Active ({drives.filter((d) => d.status === "Active").length})
                  </button>
                  <button
                    type="button"
                    className={`admin-filter-pill ${statusFilter === "Closed" ? "active" : ""}`}
                    onClick={() => setStatusFilter("Closed")}
                  >
                    Closed ({drives.filter((d) => d.status === "Closed").length})
                  </button>
                </div>

                <div className="admin-search-wrapper">
                  <Search size={14} className="admin-search-icon" />
                  <input
                    type="search"
                    placeholder="Search drives, role, CTC..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="admin-table-wrapper">
              <table className="admin-editorial-table">
                <thead>
                  <tr>
                    <th>Company</th>
                    <th>Designation</th>
                    <th>Package (CTC)</th>
                    <th>Min CGPA</th>
                    <th>Deadline</th>
                    <th>Applicants</th>
                    <th>Status</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {drives
                    .filter((d) => {
                      const matchesSearch =
                        !search ||
                        d.company.toLowerCase().includes(search.toLowerCase()) ||
                        d.role.toLowerCase().includes(search.toLowerCase()) ||
                        d.ctc.toLowerCase().includes(search.toLowerCase());
                      const matchesStatus = statusFilter === "all" || d.status === statusFilter;
                      return matchesSearch && matchesStatus;
                    })
                    .map((d) => (
                      <tr key={d.id}>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <CompanyLogo name={d.company} />
                            <span style={{ fontWeight: 600 }}>{d.company}</span>
                          </div>
                        </td>
                        <td style={{ color: "var(--text-primary)" }}>{d.role}</td>
                        <td style={{ color: "var(--accent)", fontWeight: 600 }}>{d.ctc}</td>
                        <td>CGPA {d.minCgpa}</td>
                        <td style={{ color: "var(--text-muted)" }}>{d.deadline}</td>
                        <td>
                          <button
                            type="button"
                            className="btn-secondary btn-sm"
                            style={{ padding: "4px 8px", fontSize: "11.5px" }}
                            onClick={() => handleTabChange("applications", d.company)}
                          >
                            {d.applicants} candidates →
                          </button>
                        </td>
                        <td>
                          <span className={`editorial-badge ${d.status === "Active" ? "badge-success" : "badge-neutral"}`}>
                            {d.status}
                          </span>
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <button
                            type="button"
                            className="btn-secondary btn-sm"
                            onClick={() => toggleDriveStatus(d.id)}
                          >
                            {d.status === "Active" ? "Close Drive" : "Reopen"}
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 5: Applications (Critical missing tab now fully integrated) */}
        {activeTab === "applications" && (
          <div className="admin-card-section">
            <div className="admin-table-controls">
              <div>
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "19px", margin: 0, color: "var(--text-primary)" }}>
                  Candidate Applications ({applications.length})
                </h2>
                <p style={{ fontSize: "12.5px", color: "var(--text-secondary)", margin: "2px 0 0" }}>
                  Monitor student submissions, candidate progression stages, and recruiter evaluations.
                </p>
              </div>

              <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                <div className="admin-filters-group">
                  <button
                    type="button"
                    className={`admin-filter-pill ${statusFilter === "all" ? "active" : ""}`}
                    onClick={() => setStatusFilter("all")}
                  >
                    All ({applications.length})
                  </button>
                  <button
                    type="button"
                    className={`admin-filter-pill ${statusFilter === "Shortlisted" ? "active" : ""}`}
                    onClick={() => setStatusFilter("Shortlisted")}
                  >
                    Shortlisted ({applications.filter((a) => a.status === "Shortlisted").length})
                  </button>
                  <button
                    type="button"
                    className={`admin-filter-pill ${statusFilter === "Under Review" ? "active" : ""}`}
                    onClick={() => setStatusFilter("Under Review")}
                  >
                    Under Review ({applications.filter((a) => a.status === "Under Review").length})
                  </button>
                  <button
                    type="button"
                    className={`admin-filter-pill ${statusFilter === "Selected" ? "active" : ""}`}
                    onClick={() => setStatusFilter("Selected")}
                  >
                    Selected ({applications.filter((a) => a.status === "Selected").length})
                  </button>
                </div>

                <div className="admin-search-wrapper">
                  <Search size={14} className="admin-search-icon" />
                  <input
                    type="search"
                    placeholder="Search candidate, company, role..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="admin-table-wrapper">
              <table className="admin-editorial-table">
                <thead>
                  <tr>
                    <th>Candidate</th>
                    <th>Placement Drive</th>
                    <th>Applied Date</th>
                    <th>Standing</th>
                    <th>Resume</th>
                    <th>Current Status</th>
                    <th style={{ textAlign: "right" }}>Update Status</th>
                  </tr>
                </thead>
                <tbody>
                  {applications
                    .filter((app) => {
                      const matchesSearch =
                        !search ||
                        app.candidateName.toLowerCase().includes(search.toLowerCase()) ||
                        app.rollNo.toLowerCase().includes(search.toLowerCase()) ||
                        app.company.toLowerCase().includes(search.toLowerCase()) ||
                        app.role.toLowerCase().includes(search.toLowerCase());
                      const matchesStatus = statusFilter === "all" || app.status === statusFilter;
                      return matchesSearch && matchesStatus;
                    })
                    .map((app) => (
                      <tr key={app.id}>
                        <td>
                          <div>
                            <strong style={{ fontWeight: 600 }}>{app.candidateName}</strong>
                            <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{app.rollNo}</div>
                          </div>
                        </td>
                        <td>
                          <div>
                            <span style={{ fontWeight: 600 }}>{app.company}</span>
                            <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>{app.role}</div>
                          </div>
                        </td>
                        <td style={{ color: "var(--text-muted)" }}>{app.appliedDate}</td>
                        <td>
                          <div style={{ fontSize: "12px" }}>
                            <span>{app.degree}</span> • <strong>CGPA {app.cgpa.toFixed(2)}</strong>
                          </div>
                        </td>
                        <td>
                          <span className="editorial-badge badge-neutral" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                            <FileText size={11} /> Verified
                          </span>
                        </td>
                        <td>
                          <ApplicationStatusBadge status={app.status} />
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <select
                            className="admin-status-dropdown"
                            value={app.status}
                            onChange={(e) => updateApplicationStatus(app.id, e.target.value)}
                            aria-label={`Change status for ${app.candidateName}`}
                          >
                            <option value="Applied">Applied</option>
                            <option value="Under Review">Under Review</option>
                            <option value="Shortlisted">Shortlisted</option>
                            <option value="Selected">Selected</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 6: Records */}
        {activeTab === "records" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div className="admin-card-section">
              <div className="admin-table-controls">
                <div>
                  <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "19px", margin: 0, color: "var(--text-primary)" }}>
                    Institutional Placement Register & Audit ({records.length})
                  </h2>
                  <p style={{ fontSize: "12.5px", color: "var(--text-secondary)", margin: "2px 0 0" }}>
                    Verified campus placement offers countersigned by the college Principal and Dean of Placements.
                  </p>
                </div>

                <div className="admin-search-wrapper">
                  <Search size={14} className="admin-search-icon" />
                  <input
                    type="search"
                    placeholder="Search placed candidate, company..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="admin-table-wrapper">
                <table className="admin-editorial-table">
                  <thead>
                    <tr>
                      <th>Candidate</th>
                      <th>Program</th>
                      <th>Company</th>
                      <th>Designation</th>
                      <th>Package (CTC)</th>
                      <th>Tier</th>
                      <th>Offer Date</th>
                      <th>Audit Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records
                      .filter((r) => {
                        return (
                          !search ||
                          r.studentName.toLowerCase().includes(search.toLowerCase()) ||
                          r.rollNo.toLowerCase().includes(search.toLowerCase()) ||
                          r.company.toLowerCase().includes(search.toLowerCase()) ||
                          r.role.toLowerCase().includes(search.toLowerCase())
                        );
                      })
                      .map((rec) => (
                        <tr key={rec.id}>
                          <td>
                            <div>
                              <strong style={{ fontWeight: 600 }}>{rec.studentName}</strong>
                              <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{rec.rollNo}</div>
                            </div>
                          </td>
                          <td style={{ color: "var(--text-secondary)" }}>{rec.degree}</td>
                          <td>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <CompanyLogo name={rec.company} />
                              <span style={{ fontWeight: 600 }}>{rec.company}</span>
                            </div>
                          </td>
                          <td style={{ color: "var(--text-secondary)" }}>{rec.role}</td>
                          <td style={{ color: "var(--accent)", fontWeight: 700 }}>{rec.package}</td>
                          <td>
                            <span className="editorial-badge badge-accent">{rec.tier}</span>
                          </td>
                          <td style={{ color: "var(--text-muted)" }}>{rec.offerDate}</td>
                          <td>
                            <span className="editorial-badge badge-success">Audit Complete</span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
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
