import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Send,
  CheckCircle2,
  Clock,
  Calendar,
  XCircle,
  Search,
  ChevronRight,
  ExternalLink,
  Briefcase,
} from "lucide-react";
import AppLayout from "../components/ui/AppLayout.jsx";
import {
  PageHeader,
  MetricRow,
  MetricItem,
  ApplicationStatusBadge,
  CompanyLogo,
  EmptyState,
} from "../components/ui/EditorialComponents.jsx";
import "./MyApplications.css";

const BASE_APPLICATIONS = [
  {
    id: "app-101",
    driveId: "drv-006",
    company: "TCS Digital",
    logo: "TCS",
    role: "System Architect Trainee",
    appliedDate: "28 Sep 2026",
    status: "Offer Received",
    milestone: "Institutional LOI Signed",
    lastUpdated: "14 Oct 2026",
  },
  {
    id: "app-102",
    driveId: "drv-002",
    company: "Goldman Sachs",
    logo: "GS",
    role: "Engineering Analyst (Core Systems)",
    appliedDate: "18 Oct 2026",
    status: "Shortlisted",
    milestone: "CoderPad Technical Round scheduled",
    lastUpdated: "20 Oct 2026",
  },
  {
    id: "app-103",
    driveId: "drv-005",
    company: "Deloitte USI",
    logo: "DT",
    role: "Associate Analyst (Tech Consulting)",
    appliedDate: "12 Oct 2026",
    status: "Under Review",
    milestone: "Talent Acquisition Dossier verification",
    lastUpdated: "19 Oct 2026",
  },
  {
    id: "app-104",
    driveId: "drv-001",
    company: "Microsoft IDC",
    logo: "MS",
    role: "Software Engineer — Cloud & AI Infrastructure",
    appliedDate: "16 Oct 2026",
    status: "Under Review",
    milestone: "Codility Assessment scheduled for 02 Nov",
    lastUpdated: "21 Oct 2026",
  },
];

function readSaved(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}

export default function MyApplications() {
  const [applications] = useState(() =>
    readSaved("cprmp_applications", BASE_APPLICATIONS)
  );
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filterTabs = [
    { id: "all", label: "All Applications" },
    { id: "under review", label: "Under Review" },
    { id: "shortlisted", label: "Shortlisted" },
    { id: "offer", label: "Offers / Selected" },
    { id: "closed", label: "Closed / Archived" },
  ];

  const filteredApps = useMemo(() => {
    return applications.filter((app) => {
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        app.company.toLowerCase().includes(q) ||
        app.role.toLowerCase().includes(q);

      const statusNorm = app.status.toLowerCase();
      let matchesStatus = true;
      if (statusFilter === "under review") {
        matchesStatus = statusNorm.includes("review") || statusNorm.includes("applied");
      } else if (statusFilter === "shortlisted") {
        matchesStatus = statusNorm.includes("shortlist") || statusNorm.includes("interview");
      } else if (statusFilter === "offer") {
        matchesStatus = statusNorm.includes("offer") || statusNorm.includes("select");
      } else if (statusFilter === "closed") {
        matchesStatus = statusNorm.includes("reject") || statusNorm.includes("withdrawn");
      }

      return matchesSearch && matchesStatus;
    });
  }, [applications, search, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: applications.length,
      review: applications.filter((a) => a.status.toLowerCase().includes("review") || a.status.toLowerCase().includes("applied")).length,
      shortlisted: applications.filter((a) => a.status.toLowerCase().includes("shortlist") || a.status.toLowerCase().includes("interview")).length,
      offers: applications.filter((a) => a.status.toLowerCase().includes("offer") || a.status.toLowerCase().includes("select")).length,
    };
  }, [applications]);

  return (
    <AppLayout
      pageTitle="My Applications"
      breadcrumb="Student Workspace"
      searchValue={search}
      onSearch={setSearch}
      searchPlaceholder="Search submitted applications..."
    >
      <div className="applications-editorial-container">
        <PageHeader
          eyebrow="APPLICATION TRACKING DOSSIER"
          title="Placement Applications"
          description="Monitor real-time application progression across campus recruiters. Track institutional verifications, assessment dates, and formal recruitment milestones."
        />

        {/* Overview Metric Row */}
        <MetricRow>
          <MetricItem
            label="Total Submitted"
            value={stats.total}
            detail="Applications in 2026–2027 cycle"
            icon={Send}
          />
          <MetricItem
            label="Under Screening"
            value={stats.review}
            detail="Resume & eligibility review"
            icon={Clock}
          />
          <MetricItem
            label="Shortlisted / Interview"
            value={stats.shortlisted}
            detail="Advanced to evaluation stages"
            icon={Calendar}
          />
          <MetricItem
            label="Offers Received"
            value={stats.offers}
            detail="Official institutional offers"
            icon={CheckCircle2}
          />
        </MetricRow>

        {/* Filter Controls Row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
            background: "var(--surface)",
            padding: "14px 20px",
            border: "1px solid var(--border)",
            borderRadius: "8px",
          }}
        >
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`drives-filter-btn ${
                  statusFilter === tab.id ? "active" : ""
                }`}
                onClick={() => setStatusFilter(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div style={{ position: "relative", minWidth: "220px" }}>
            <Search
              size={14}
              style={{
                position: "absolute",
                left: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-muted)",
              }}
            />
            <input
              type="search"
              placeholder="Filter by company or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="topbar-search-input"
            />
          </div>
        </div>

        {/* Data Table for Desktop */}
        {filteredApps.length === 0 ? (
          <EmptyState
            title="No applications match your filter"
            description="You currently have no applications matching this criteria. Browse available drives to submit new applications."
            action={
              <Link to="/student/placement-drives" className="btn-primary btn-sm">
                Browse Placement Drives
              </Link>
            }
          />
        ) : (
          <>
            <div className="applications-table-wrapper">
              <table className="applications-data-table">
                <thead>
                  <tr>
                    <th>Company</th>
                    <th>Job Title</th>
                    <th>Application Date</th>
                    <th>Current Status</th>
                    <th>Milestone / Activity</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApps.map((app) => (
                    <tr key={app.id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <CompanyLogo name={app.company} logo={app.logo} />
                          <strong style={{ fontWeight: 600 }}>{app.company}</strong>
                        </div>
                      </td>
                      <td>
                        <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>
                          {app.role}
                        </span>
                      </td>
                      <td>
                        <span style={{ color: "var(--text-secondary)", fontSize: "12.5px" }}>
                          {app.appliedDate}
                        </span>
                      </td>
                      <td>
                        <ApplicationStatusBadge status={app.status} />
                      </td>
                      <td>
                        <span style={{ fontSize: "12.5px", color: "var(--text-secondary)" }}>
                          {app.milestone || "Awaiting recruiter evaluation"}
                        </span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <Link
                          to={`/student/application-tracking/${app.id || app.driveId}`}
                          className="btn-secondary btn-sm"
                        >
                          <span>Track</span>
                          <ChevronRight size={13} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="applications-mobile-cards">
              {filteredApps.map((app) => (
                <div key={app.id} className="app-mobile-card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <CompanyLogo name={app.company} logo={app.logo} />
                      <div>
                        <strong style={{ display: "block", fontSize: "14px" }}>{app.company}</strong>
                        <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>{app.role}</span>
                      </div>
                    </div>
                    <ApplicationStatusBadge status={app.status} />
                  </div>

                  <div style={{ fontSize: "12px", color: "var(--text-secondary)", borderTop: "1px solid var(--border)", paddingTop: "10px" }}>
                    <div>Applied: <strong>{app.appliedDate}</strong></div>
                    <div style={{ marginTop: "4px" }}>{app.milestone}</div>
                  </div>

                  <Link
                    to={`/student/application-tracking/${app.id || app.driveId}`}
                    className="btn-secondary btn-sm"
                    style={{ textAlign: "center" }}
                  >
                    View Application Timeline
                  </Link>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
