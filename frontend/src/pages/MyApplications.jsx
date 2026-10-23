import { useState, useMemo, useEffect, useCallback } from "react";
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
  RefreshCw,
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
import { studentApi } from "../api/studentApi.js";
import "./MyApplications.css";

export default function MyApplications() {
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [summary, setSummary] = useState({});
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const loadApplications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await studentApi.getApplications();
      setApplications(data.applications || []);
      setSummary(data.summary || {});
    } catch (err) {
      console.error("Failed to load applications:", err);
      setError(err.message || "Failed to load submitted applications.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  const filterTabs = [
    { id: "all", label: "All Applications" },
    { id: "under_review", label: "Under Screening" },
    { id: "shortlisted", label: "Shortlisted" },
    { id: "interview", label: "Interviews" },
    { id: "selected", label: "Offers / Selected" },
    { id: "rejected", label: "Closed / Not Selected" },
  ];

  const filteredApps = useMemo(() => {
    return applications.filter((app) => {
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        app.company.toLowerCase().includes(q) ||
        app.role.toLowerCase().includes(q);

      const statusNorm = (app.status || "").toLowerCase();
      let matchesStatus = true;
      if (statusFilter === "under_review") {
        matchesStatus = statusNorm === "under_review" || statusNorm === "submitted";
      } else if (statusFilter === "shortlisted") {
        matchesStatus = statusNorm === "shortlisted";
      } else if (statusFilter === "interview") {
        matchesStatus = statusNorm === "interview";
      } else if (statusFilter === "selected") {
        matchesStatus = statusNorm === "selected";
      } else if (statusFilter === "rejected") {
        matchesStatus = statusNorm === "rejected" || statusNorm === "withdrawn";
      }

      return matchesSearch && matchesStatus;
    });
  }, [applications, search, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: applications.length,
      review: (summary.submitted || 0) + (summary.underReview || 0),
      shortlisted: (summary.shortlisted || 0) + (summary.interview || 0),
      offers: summary.selected || 0,
    };
  }, [applications, summary]);

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
            detail="Applications in current placement cycle"
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
            label="Offers Extended"
            value={stats.offers}
            detail="Official campus selection offers"
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
            padding: "16px 20px",
            borderRadius: "8px",
            border: "1px solid var(--border)",
            marginBottom: "24px",
          }}
        >
          <div className="filter-pill-group">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`filter-pill-btn ${statusFilter === tab.id ? "active" : ""}`}
                onClick={() => setStatusFilter(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              type="button"
              className="btn-secondary btn-sm"
              onClick={loadApplications}
              title="Refresh applications"
            >
              <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
              <span>Refresh</span>
            </button>
            <span style={{ fontSize: "12.5px", color: "var(--text-muted)" }}>
              {filteredApps.length} of {applications.length} applications
            </span>
          </div>
        </div>

        {/* Loading and Empty States */}
        {loading && applications.length === 0 ? (
          <div style={{ padding: "60px", textAlign: "center", color: "var(--text-secondary)" }}>
            <RefreshCw size={26} className="animate-spin" style={{ margin: "0 auto 12px" }} />
            <p>Loading your submitted placement applications...</p>
          </div>
        ) : error && applications.length === 0 ? (
          <EmptyState
            title="Failed to load applications"
            description={error}
            action={
              <button type="button" className="btn-secondary btn-sm" onClick={loadApplications}>
                Retry Loading
              </button>
            }
          />
        ) : filteredApps.length === 0 ? (
          <EmptyState
            title="No applications match the current filter"
            description={
              applications.length === 0
                ? "You have not submitted any placement drive applications yet. Browse open drives to begin."
                : "Try selecting 'All Applications' or clearing your search term."
            }
            action={
              applications.length === 0 ? (
                <Link to="/student/drives" className="btn-primary btn-sm">
                  Explore Placement Drives
                </Link>
              ) : (
                <button
                  type="button"
                  className="btn-secondary btn-sm"
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("all");
                  }}
                >
                  Reset Filters
                </button>
              )
            }
          />
        ) : (
          <div className="applications-table-wrapper">
            <table className="editorial-table">
              <thead>
                <tr>
                  <th>Recruiter & Organization</th>
                  <th>Position / Role</th>
                  <th>Applied On</th>
                  <th>Application Status</th>
                  <th>Current Milestone</th>
                  <th style={{ textAlign: "right" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredApps.map((app) => (
                  <tr key={app.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <CompanyLogo name={app.company} logo={app.logo} />
                        <div>
                          <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>{app.company}</div>
                          <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                            CTC: {app.package}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500, color: "var(--text-primary)" }}>{app.role}</div>
                      {app.resumeName && (
                        <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                          Attached: {app.resumeName}
                        </div>
                      )}
                    </td>
                    <td style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                      {app.appliedDate || "Recently"}
                    </td>
                    <td>
                      <ApplicationStatusBadge status={app.status} />
                    </td>
                    <td>
                      <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                        {app.milestone || "Screening in Progress"}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <Link
                        to={`/student/applications/${app.id}`}
                        className="btn-secondary btn-sm"
                      >
                        <span>View Journey</span>
                        <ChevronRight size={13} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
