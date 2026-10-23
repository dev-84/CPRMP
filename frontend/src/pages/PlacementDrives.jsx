import { useState, useMemo, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  X,
  RotateCcw,
  RefreshCw,
  Building2,
} from "lucide-react";
import { useAuth } from "../context/useAuth.js";
import AppLayout from "../components/ui/AppLayout.jsx";
import {
  PageHeader,
  PlacementDriveCard,
  EmptyState,
} from "../components/ui/EditorialComponents.jsx";
import { studentApi } from "../api/studentApi.js";
import "./PlacementDrives.css";

export default function PlacementDrives() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [drives, setDrives] = useState([]);
  const [studentMeta, setStudentMeta] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [feedback, setFeedback] = useState(null);
  const [error, setError] = useState(null);

  const fetchDrives = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await studentApi.getDrives();
      setDrives(data.drives || []);
      setStudentMeta(data.student || null);
    } catch (err) {
      console.error("Failed to load placement drives:", err);
      setError(err.message || "Failed to load placement drives.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDrives();
  }, [fetchDrives]);

  const filterTabs = [
    { id: "all", label: "All Drives" },
    { id: "eligible", label: "Eligible Only" },
    { id: "super-dream", label: "Super Dream (> ₹20 LPA)" },
    { id: "dream", label: "Dream (₹10–₹20 LPA)" },
    { id: "core", label: "Core Tech (< ₹10 LPA)" },
  ];

  const filteredDrives = useMemo(() => {
    return drives.filter((drive) => {
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        drive.company.toLowerCase().includes(q) ||
        drive.role.toLowerCase().includes(q) ||
        drive.location.toLowerCase().includes(q) ||
        (Array.isArray(drive.skills) && drive.skills.some((s) => s.toLowerCase().includes(q)));

      let matchesFilter = true;
      if (selectedFilter === "eligible") {
        matchesFilter = drive.isEligible;
      } else if (selectedFilter === "super-dream") {
        matchesFilter = drive.category === "Super Dream" || drive.package >= 20;
      } else if (selectedFilter === "dream") {
        matchesFilter = drive.category === "Dream" || (drive.package >= 10 && drive.package < 20);
      } else if (selectedFilter === "core") {
        matchesFilter = drive.category === "Core Tech" || drive.package < 10;
      }

      return matchesSearch && matchesFilter;
    });
  }, [drives, search, selectedFilter]);

  const handleApply = async (drive) => {
    if (drive.hasApplied) {
      setFeedback({
        type: "info",
        message: `You have already applied to ${drive.company}. View progress in My Applications.`,
      });
      return;
    }

    if (!drive.isEligible) {
      setFeedback({
        type: "error",
        message: `You do not meet the minimum eligibility requirements for ${drive.company}.`,
      });
      return;
    }

    try {
      await studentApi.applyToDrive(drive.id);
      setFeedback({
        type: "success",
        message: `Application submitted successfully for ${drive.company} (${drive.role})!`,
      });
      await fetchDrives();
    } catch (err) {
      console.error("Apply error:", err);
      if (err.code === "RESUME_REQUIRED" || err.message?.toLowerCase().includes("resume")) {
        setFeedback({
          type: "error",
          message: err.message || "A verified resume is required before applying.",
          action: {
            label: "Go to Resume Management",
            onClick: () => navigate("/student/resume"),
          },
        });
      } else {
        setFeedback({
          type: "error",
          message: err.message || "Failed to submit application. Please try again.",
        });
      }
    }
  };

  return (
    <AppLayout
      pageTitle="Placement Drives"
      breadcrumb="Campus Placement Portal"
      searchValue={search}
      onSearch={setSearch}
      searchPlaceholder="Filter by company, skill, role, location..."
    >
      <div className="editorial-page-container">
        {/* Feedback Alert */}
        {feedback && (
          <div className={`sd-alert-banner ${feedback.type}`} role="alert" style={{ marginBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1 }}>
              {feedback.type === "success" ? (
                <CheckCircle2 size={16} color="var(--success, #287A45)" />
              ) : (
                <AlertCircle size={16} color="var(--error, #B93838)" />
              )}
              <span>{feedback.message}</span>
              {feedback.action && (
                <button
                  type="button"
                  onClick={feedback.action.onClick}
                  style={{
                    marginLeft: "8px",
                    textDecoration: "underline",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: 600,
                    color: "inherit",
                  }}
                >
                  {feedback.action.label} →
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={() => setFeedback(null)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", fontWeight: 600 }}
              aria-label="Dismiss feedback"
            >
              <X size={15} />
            </button>
          </div>
        )}

        {/* Page Header */}
        <PageHeader
          title="Placement Opportunities"
          subtitle="Explore published recruitment drives, verify your academic eligibility, and apply directly."
        />

        {/* Filters and Search Bar */}
        <div className="drives-controls-panel">
          <div className="filter-pill-group">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`filter-pill-btn ${selectedFilter === tab.id ? "active" : ""}`}
                onClick={() => setSelectedFilter(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              type="button"
              className="btn-secondary btn-sm"
              onClick={fetchDrives}
              title="Refresh drives from server"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              <span>Refresh</span>
            </button>
            <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
              Showing {filteredDrives.length} of {drives.length} drives
            </span>
          </div>
        </div>

        {/* Loading / Error States */}
        {loading && drives.length === 0 ? (
          <div style={{ padding: "60px", textAlign: "center", color: "var(--text-secondary)" }}>
            <RefreshCw size={26} className="animate-spin" style={{ margin: "0 auto 12px" }} />
            <p>Loading published recruitment drives from database...</p>
          </div>
        ) : error && drives.length === 0 ? (
          <EmptyState
            title="Failed to load placement drives"
            description={error}
            action={
              <button type="button" className="btn-secondary btn-sm" onClick={fetchDrives}>
                Retry Loading
              </button>
            }
          />
        ) : filteredDrives.length === 0 ? (
          <EmptyState
            title="No placement drives found"
            description={
              selectedFilter === "eligible"
                ? "No open drives currently match your academic CGPA or backlog criteria."
                : "Try clearing your search query or selecting a different filter category."
            }
            action={
              <button
                type="button"
                className="btn-secondary btn-sm"
                onClick={() => {
                  setSearch("");
                  setSelectedFilter("all");
                }}
              >
                Reset Filters
              </button>
            }
          />
        ) : (
          <div className="drives-listing-grid">
            {filteredDrives.map((drive) => (
              <PlacementDriveCard
                key={drive.id}
                drive={drive}
                hasApplied={drive.hasApplied}
                isEligible={drive.isEligible}
                onApply={() => handleApply(drive)}
              />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
