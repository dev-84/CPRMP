import { useState, useMemo } from "react";
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
import "./PlacementHistory.css";

const HISTORICAL_RECORDS = [
  {
    id: "DRV-2026-TCS-019",
    company: "TCS Digital",
    logo: "TCS",
    role: "System Architect Trainee",
    division: "Digital Enterprise Core",
    salary: 7.5,
    package: "₹7.50 LPA",
    date: "14 Oct 2026",
    status: "Selected & Accepted",
    outcome: "Letter of Intent Signed (#LOI-8842)",
  },
  {
    id: "DRV-2026-DEL-041",
    company: "Deloitte USI",
    logo: "DT",
    role: "Associate Analyst (Consulting)",
    division: "Technology Advisory",
    salary: 14.2,
    package: "₹14.20 LPA",
    date: "18 Oct 2026",
    status: "Under Review",
    outcome: "Technical Assessment completed",
  },
  {
    id: "DRV-2026-WIP-011",
    company: "Wipro Technologies",
    logo: "WIP",
    role: "Project Engineer (Turbo)",
    division: "Cloud Solutions",
    salary: 6.5,
    package: "₹6.50 LPA",
    date: "02 Oct 2026",
    status: "Withdrawn / Superseded",
    outcome: "Higher Tier Offer Accepted",
  },
  {
    id: "DRV-2026-CTS-008",
    company: "Cognizant Technology Solutions",
    logo: "CTS",
    role: "Software Specialist (GenC Next)",
    division: "Cloud & DevOps",
    salary: 6.75,
    package: "₹6.75 LPA",
    date: "25 Sep 2026",
    status: "Not Selected",
    outcome: "Technical round cutoff not met",
  },
];

export default function PlacementHistory() {
  const [records] = useState(HISTORICAL_RECORDS);
  const [search, setSearch] = useState("");

  const filteredRecords = useMemo(() => {
    if (!search.trim()) return records;
    const q = search.toLowerCase();
    return records.filter(
      (r) =>
        r.company.toLowerCase().includes(q) ||
        r.role.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q)
    );
  }, [records, search]);

  const handleDownloadCsv = () => {
    const headers = ["Company", "Drive ID", "Role", "Division", "CTC", "Date", "Status", "Outcome"];
    const rows = filteredRecords.map((r) => [
      r.company,
      r.id,
      r.role,
      r.division,
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
    link.setAttribute("download", "Placement_History_Transcript_2026_2027.csv");
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
          description="Official record of campus recruitment participation, evaluations, offers received, and institutional acceptances for the 2026–2027 academic session."
          actions={
            <SecondaryButton onClick={handleDownloadCsv}>
              <Download size={14} />
              <span>Export CSV Transcript</span>
            </SecondaryButton>
          }
        />

        {/* Overview Metric Row */}
        <MetricRow>
          <MetricItem
            label="Active Offer Status"
            value="Selected & Accepted"
            detail="TCS Digital (Digital Core)"
            icon={Award}
          />
          <MetricItem
            label="Highest Package Accepted"
            value="₹7.50 LPA"
            detail="Digital Grade Cadre"
            icon={TrendingUp}
          />
          <MetricItem
            label="Total Drives Attended"
            value={records.length}
            detail="Participation in 2026–2027 cycle"
            icon={Calendar}
          />
          <MetricItem
            label="College Clearance"
            value="Approved"
            detail="Official LOI lodged with TPO"
            icon={CheckCircle2}
          />
        </MetricRow>

        {/* Search & Table */}
        {filteredRecords.length === 0 ? (
          <EmptyState
            title="No records found"
            description="No participation history matches your search query."
          />
        ) : (
          <div className="history-table-container">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Company & Drive ID</th>
                  <th>Designation / Role</th>
                  <th>Division</th>
                  <th>Compensation (CTC)</th>
                  <th>Date</th>
                  <th>Recruitment Status</th>
                  <th>Official Outcome</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record) => (
                  <tr key={record.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <CompanyLogo name={record.company} logo={record.logo} />
                        <div>
                          <strong style={{ fontWeight: 600 }}>{record.company}</strong>
                          <span style={{ display: "block", fontSize: "11px", color: "var(--text-muted)" }}>
                            {record.id}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 500, color: "var(--text-primary)" }}>
                        {record.role}
                      </span>
                    </td>
                    <td>
                      <span style={{ color: "var(--text-secondary)", fontSize: "12.5px" }}>
                        {record.division}
                      </span>
                    </td>
                    <td>
                      <strong style={{ color: "var(--accent)" }}>{record.package}</strong>
                    </td>
                    <td>
                      <span style={{ color: "var(--text-secondary)", fontSize: "12.5px" }}>
                        {record.date}
                      </span>
                    </td>
                    <td>
                      <ApplicationStatusBadge status={record.status} />
                    </td>
                    <td>
                      <span className="history-outcome-badge">{record.outcome}</span>
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
