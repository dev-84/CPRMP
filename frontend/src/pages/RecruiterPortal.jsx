import { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import {
  Building,
  Briefcase,
  Users,
  CheckCircle2,
  Clock,
  Search,
  Check,
  X,
  Calendar,
  FileText,
  Mail,
  ChevronRight,
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
  EmptyState,
} from "../components/ui/EditorialComponents.jsx";
import "./RecruiterPortal.css";

const INITIAL_APPLICANTS = [
  {
    id: "app-rec-1",
    candidateName: "Aryan Sharma",
    rollNo: "MCA2024-042",
    degree: "MCA",
    cgpa: 8.84,
    skills: ["Java", "Python", "Algorithms", "Docker"],
    appliedDate: "16 Oct 2026",
    status: "Shortlisted",
    drive: "Software Engineer — Cloud & AI Infrastructure",
  },
  {
    id: "app-rec-2",
    candidateName: "Pooja Reddy",
    rollNo: "BTECH-CS-102",
    degree: "B.Tech CS",
    cgpa: 9.12,
    skills: ["C++", "Distributed Systems", "Kubernetes"],
    appliedDate: "18 Oct 2026",
    status: "Under Review",
    drive: "Software Engineer — Cloud & AI Infrastructure",
  },
  {
    id: "app-rec-3",
    candidateName: "Sneha Nair",
    rollNo: "BTECH-IT-084",
    degree: "B.Tech IT",
    cgpa: 8.55,
    skills: ["Python", "SQL", "Cloud Basics"],
    appliedDate: "19 Oct 2026",
    status: "Under Review",
    drive: "Software Engineer — Cloud & AI Infrastructure",
  },
];

export default function RecruiterPortal() {
  const location = useLocation();
  const queryTab = new URLSearchParams(location.search).get("tab");

  const [activeTab, setActiveTab] = useState(queryTab || "overview");
  const [applicants, setApplicants] = useState(INITIAL_APPLICANTS);
  const [search, setSearch] = useState("");
  const [feedback, setFeedback] = useState(null);

  const updateApplicantStatus = (id, newStatus) => {
    setApplicants((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
    setFeedback({
      type: "success",
      message: `Candidate status updated to ${newStatus}.`,
    });
  };

  const tabs = [
    { id: "overview", label: "Dashboard Overview", icon: Briefcase },
    { id: "company", label: "Company Profile", icon: Building },
    { id: "drives", label: "Our Placement Drives", icon: Briefcase },
    { id: "applicants", label: "Applicant Review & Shortlisting", icon: Users },
    { id: "outcomes", label: "Hiring Outcomes", icon: CheckCircle2 },
  ];

  return (
    <AppLayout pageTitle="Recruiter Workspace" breadcrumb="Corporate Gateway">
      <div className="recruiter-editorial-container">
        <PageHeader
          eyebrow="CAMPUS TALENT ACQUISITION"
          title="Recruiter Portal & Applicant Dossier"
          description="Manage corporate placement drives, audit candidate technical competencies, and update recruitment progression stages."
        />

        {feedback && (
          <div
            style={{
              padding: "12px 18px",
              borderRadius: "6px",
              backgroundColor: "var(--success-soft)",
              border: "1px solid #c8e6cb",
              color: "var(--success)",
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

        {/* Recruiter Metrics */}
        <MetricRow>
          <MetricItem
            label="Corporate Organization"
            value="Microsoft IDC"
            detail="Cloud Systems Core Pod"
            icon={Building}
          />
          <MetricItem
            label="Total Applicants"
            value={applicants.length}
            detail="Applied for active drives"
            icon={Users}
          />
          <MetricItem
            label="Candidates Shortlisted"
            value={applicants.filter((a) => a.status === "Shortlisted").length}
            detail="Advanced to Codility & Interviews"
            icon={CheckCircle2}
          />
          <MetricItem
            label="Recruitment Standing"
            value="Evaluation Active"
            detail="Cycle closes 28 Oct 2026"
            icon={Clock}
          />
        </MetricRow>

        {/* Tab Buttons */}
        <div className="recruiter-tabs-bar">
          {tabs.map((tab) => {
            const IconComp = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                className={`recruiter-tab-btn ${active ? "active" : ""}`}
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

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "24px" }}>
            <div className="recruiter-card-section">
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "19px", margin: "0 0 16px", color: "var(--text-primary)" }}>
                Active Recruitment Drive
              </h2>
              <div style={{ background: "var(--surface-secondary)", padding: "18px", borderRadius: "6px", border: "1px solid var(--border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <strong style={{ fontSize: "16px", color: "var(--text-primary)" }}>Software Engineer — Cloud & AI Infrastructure</strong>
                    <div style={{ fontSize: "12.5px", color: "var(--text-secondary)", marginTop: "4px" }}>
                      Hyderabad / Bengaluru · Full Time Campus Hire · ₹32.0 LPA CTC
                    </div>
                  </div>
                  <span className="editorial-badge badge-accent">Applications Open</span>
                </div>
                <div style={{ marginTop: "16px", paddingTop: "12px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", fontSize: "12.5px" }}>
                  <span>Deadline: 28 Oct 2026</span>
                  <span style={{ fontWeight: 600, color: "var(--accent)" }}>{applicants.length} Total Applicants</span>
                </div>
              </div>
            </div>

            <div className="recruiter-card-section">
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "19px", margin: "0 0 16px", color: "var(--text-primary)" }}>
                Upcoming Schedule
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px" }}>
                <div style={{ padding: "10px", background: "var(--surface-secondary)", borderRadius: "4px" }}>
                  <strong>02 Nov 2026:</strong> Codility Assessment Window (10:00–18:00)
                </div>
                <div style={{ padding: "10px", background: "var(--surface-secondary)", borderRadius: "4px" }}>
                  <strong>06 Nov 2026:</strong> Technical Interview Round 1
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "company" && (
          <div className="recruiter-card-section">
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "19px", margin: "0 0 16px", color: "var(--text-primary)" }}>
              Corporate Organization Profile
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px" }}>
              <div>
                <span style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>Company Name</span>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>Microsoft IDC</div>
              </div>
              <div>
                <span style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>Talent Acquisition Lead</span>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>university-ta@microsoft.com</div>
              </div>
              <div>
                <span style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>Campus Locations</span>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>Hyderabad & Bengaluru</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "applicants" && (
          <div className="recruiter-card-section">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
              <div>
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "19px", margin: 0, color: "var(--text-primary)" }}>
                  Candidate Applicants ({applicants.length})
                </h2>
                <p style={{ fontSize: "12.5px", color: "var(--text-secondary)", margin: "2px 0 0" }}>
                  Review candidate profiles, technical competencies, and manage recruitment decisions.
                </p>
              </div>

              <div style={{ position: "relative", width: "240px" }}>
                <Search size={14} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY-50%)", color: "var(--text-muted)" }} />
                <input
                  type="search"
                  placeholder="Filter candidate name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="topbar-search-input"
                />
              </div>
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ background: "var(--surface-secondary)", borderBottom: "1px solid var(--border)", textAlign: "left" }}>
                  <th style={{ padding: "10px 14px", color: "var(--text-secondary)", fontSize: "11px", textTransform: "uppercase" }}>Candidate</th>
                  <th style={{ padding: "10px 14px", color: "var(--text-secondary)", fontSize: "11px", textTransform: "uppercase" }}>Roll No / Degree</th>
                  <th style={{ padding: "10px 14px", color: "var(--text-secondary)", fontSize: "11px", textTransform: "uppercase" }}>CGPA</th>
                  <th style={{ padding: "10px 14px", color: "var(--text-secondary)", fontSize: "11px", textTransform: "uppercase" }}>Skills</th>
                  <th style={{ padding: "10px 14px", color: "var(--text-secondary)", fontSize: "11px", textTransform: "uppercase" }}>Status</th>
                  <th style={{ padding: "10px 14px", textAlign: "right", color: "var(--text-secondary)", fontSize: "11px", textTransform: "uppercase" }}>Recruitment Action</th>
                </tr>
              </thead>
              <tbody>
                {applicants
                  .filter((a) => !search || a.candidateName.toLowerCase().includes(search.toLowerCase()))
                  .map((app) => (
                    <tr key={app.id} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: "12px 14px", fontWeight: 600 }}>{app.candidateName}</td>
                      <td style={{ padding: "12px 14px", color: "var(--text-secondary)" }}>{app.rollNo} ({app.degree})</td>
                      <td style={{ padding: "12px 14px", fontWeight: 600 }}>{app.cgpa.toFixed(2)}</td>
                      <td style={{ padding: "12px 14px" }}>
                        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                          {app.skills.slice(0, 3).map((s, i) => (
                            <span key={i} className="skill-tag">{s}</span>
                          ))}
                        </div>
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <ApplicationStatusBadge status={app.status} />
                      </td>
                      <td style={{ padding: "12px 14px", textAlign: "right" }}>
                        <div style={{ display: "inline-flex", gap: "6px" }}>
                          {app.status !== "Shortlisted" && (
                            <button
                              type="button"
                              className="btn-primary btn-sm"
                              onClick={() => updateApplicantStatus(app.id, "Shortlisted")}
                            >
                              Shortlist
                            </button>
                          )}
                          {app.status === "Shortlisted" && (
                            <button
                              type="button"
                              className="btn-secondary btn-sm"
                              onClick={() => updateApplicantStatus(app.id, "Interview")}
                            >
                              Invite to Interview
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

        {(activeTab === "drives" || activeTab === "outcomes") && (
          <div className="recruiter-card-section">
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "19px", margin: "0 0 12px", color: "var(--text-primary)" }}>
              {activeTab === "drives" ? "Corporate Placement Drives" : "Formal Selection Records"}
            </h2>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
              Placement records are synchronized with university administration and verified candidate dockets.
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
