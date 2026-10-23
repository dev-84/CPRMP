import { useState, useMemo, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  History,
  Download,
  CheckCircle2,
  TrendingUp,
  Award,
  Building2,
  Calendar,
  Search,
  RefreshCw,
  Briefcase,
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
import { studentApi } from "../api/studentApi.js";
import "./PlacementHistory.css";

export default function PlacementHistory() {
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState({});
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  const loadHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await studentApi.getPlacementHistory();
      setRecords(data.records || []);
      setSummary(data.summary || {});
    } catch (err) {
      console.error("Failed to load placement history:", err);
      setError(err.message || "Failed to load placement history records.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const filteredRecords = useMemo(() => {
    if (!search.trim()) return records;
    const q = search.toLowerCase();
    return records.filter(
      (r) =>
        r.company.toLowerCase().includes(q) ||
        r.role.toLowerCase().includes(q) ||
        (r.division && r.division.toLowerCase().includes(q)) ||
        (r.id && r.id.toLowerCase().includes(q))
    );
  }, [records, search]);

  const handleDownloadCsv = () => {
    if (!filteredRecords.length) return;
    const headers = ["Company", "Record ID", "Role", "Division", "CTC Package", "Date", "Status", "Outcome"];
    const rows = filteredRecords.map((r) => [
      r.company,
      r.id,
      r.role,
      r.division || "Technology",
      r.package,
      r.date,
      r.status,
      r.outcome,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.map((val) => `"${val}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Placement_History_Transcript_${new Date().getFullYear()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AppLayout
      pageTitle="Placement History"
      breadcrumb="Academic Directorate"
      searchValue={search}
      onSearch={setSearch}
      searchPlaceholder="Filter placement history..."
    >
      <div className="history-editorial-container">
        <PageHeader
          eyebrow="INSTITUTIONAL RECORD"
          title="Placement History & Outcomes"
          description="Official record of campus recruitment participation, evaluations, offers received, and institutional acceptances."
          actions={
            records.length > 0 && (
              <SecondaryButton onClick={handleDownloadCsv}>
                <Download size={14} />
                <span>Export CSV Transcript</span>
              </SecondaryButton>
            )
          }
        />

        {/* Overview Metric Row */}
        <MetricRow>
          <MetricItem
            label="Placement Standing"
            value={summary.isPlaced ? "Placed & Offered" : "In Placement Cycle"}
            detail={summary.totalOffers > 0 ? `${summary.totalOffers} Official Offer(s) Extended` : "Active participation"}
            icon={Award}
          />
          <MetricItem
            label="Highest Package Offered"
            value={summary.highestPackage || "N/A"}
            detail={summary.isPlaced ? "Annual Cost to Company" : "Pending final selections"}
            icon={TrendingUp}
          />
          <MetricItem
            label="Total Placement Records"
            value={records.length}
            detail="Official entries in university ledger"
            icon={Calendar}
          />
          <MetricItem
            label="Institutional Status"
            value={summary.isPlaced ? "Cleared & Verified" : "Active Candidate"}
            detail="Audited by Training & Placement Officer"
            icon={CheckCircle2}
          />
        </MetricRow>

        {/* Search & Table / Loading / Empty */}
        {loading && records.length === 0 ? (
          <div style={{ padding: "80px", textAlign: "center", color: "var(--text-secondary)" }}>
            <RefreshCw size={26} className="animate-spin" style={{ margin: "0 auto 16px" }} />
            <p>Loading verified placement history and official outcomes from ledger...</p>
          </div>
        ) : error && records.length === 0 ? (
          <EmptyState
            title="Failed to load placement history"
            description={error}
            action={
              <button type="button" className="btn-secondary btn-sm" onClick={loadHistory}>
                Retry Loading
              </button>
            }
          />
        ) : records.length === 0 ? (
          <EmptyState
            title="No placement records yet"
            description="Your placement history will be updated here once recruitment outcomes and official offers of intent are finalized by recruiters."
            action={
              <Link to="/student/drives" className="btn-primary btn-sm">
                Browse Active Placement Drives
              </Link>
            }
          />
        ) : filteredRecords.length === 0 ? (
          <EmptyState
            title="No records match your search"
            description="Try clearing your search query to view all official placement history entries."
            action={
              <button type="button" className="btn-secondary btn-sm" onClick={() => setSearch("")}>
                Clear Search
              </button>
            }
          />
        ) : (
          <div className="history-table-container">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Company & Identification</th>
                  <th>Designation / Role</th>
                  <th>Division / Sector</th>
                  <th>CTC Package</th>
                  <th>Outcome Date</th>
                  <th>Recruitment Status</th>
                  <th>Official Outcome</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <div className="company-info-cell">
                        <CompanyLogo name={r.company} logo={r.logo} />
                        <div>
                          <div className="company-name">{r.company}</div>
                          <div className="drive-code">Ref #{r.id.slice(-6).toUpperCase()}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="role-title">{r.role}</div>
                    </td>
                    <td>
                      <span className="division-badge">{r.division || "Technology"}</span>
                    </td>
                    <td>
                      <div className="package-val" style={{ color: "var(--accent)", fontWeight: 600 }}>
                        {r.package}
                      </div>
                    </td>
                    <td>
                      <div className="date-val">{r.date}</div>
                    </td>
                    <td>
                      <ApplicationStatusBadge status={r.status.includes("Offer") || r.status.includes("Select") ? "Selected" : r.status} />
                    </td>
                    <td>
                      <span className="outcome-text" style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                        {r.outcome}
                      </span>
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
