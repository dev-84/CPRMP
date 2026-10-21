import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Filter, ShieldCheck, CheckCircle2, AlertCircle, X, RotateCcw } from "lucide-react";
import { useAuth } from "../context/useAuth.js";
import AppLayout from "../components/ui/AppLayout.jsx";
import {
  PageHeader,
  PlacementDriveCard,
  EmptyState,
} from "../components/ui/EditorialComponents.jsx";
import "./PlacementDrives.css";

const ALL_DRIVES = [
  {
    id: "drv-001",
    company: "Microsoft IDC",
    logo: "MS",
    role: "Software Engineer — Cloud & AI Infrastructure",
    package: 32,
    ctc: "₹32.0 LPA",
    location: "Hyderabad / Bengaluru",
    deadline: "28 Oct 2026",
    category: "Super Dream",
    degree: "MCA, B.Tech CS/IT",
    minCgpa: 8.0,
    maxBacklogs: 0,
    skills: ["Azure", "Distributed Systems", "C++", "Python", "Kubernetes"],
    description: "Design and implement scalable cloud infrastructure and high-throughput AI services.",
  },
  {
    id: "drv-002",
    company: "Goldman Sachs",
    logo: "GS",
    role: "Engineering Analyst (Core Systems)",
    package: 28.5,
    ctc: "₹28.5 LPA",
    location: "Bengaluru",
    deadline: "02 Nov 2026",
    category: "Super Dream",
    degree: "MCA, B.Tech CS/IT",
    minCgpa: 8.0,
    maxBacklogs: 0,
    skills: ["Java", "SQL", "Algorithms", "Financial Tech", "Data Structures"],
    description: "Build robust transaction processing and risk analysis systems for global financial markets.",
  },
  {
    id: "drv-003",
    company: "Infosys",
    logo: "INF",
    role: "Systems Specialist",
    package: 9.5,
    ctc: "₹9.5 LPA",
    location: "Pune / Bengaluru",
    deadline: "05 Nov 2026",
    category: "Core Tech",
    degree: "All Master Disciplines",
    minCgpa: 7.0,
    maxBacklogs: 1,
    skills: ["Full Stack", "Java", "React", "Cloud Basics", "REST APIs"],
    description: "Enterprise software development, modernization, and digital transformation consulting.",
  },
  {
    id: "drv-004",
    company: "Google India",
    logo: "G",
    role: "Associate Software Engineer",
    package: 34,
    ctc: "₹34.0 LPA",
    location: "Bengaluru / Hyderabad",
    deadline: "30 Oct 2026",
    category: "Super Dream",
    degree: "MCA, B.Tech CS/IT",
    minCgpa: 8.5,
    maxBacklogs: 0,
    skills: ["DSA", "Go", "Distributed Systems", "Kubernetes", "Linux"],
    description: "Develop high-scale web platforms and system software utilized by billions across the globe.",
  },
  {
    id: "drv-005",
    company: "Deloitte USI",
    logo: "DT",
    role: "Associate Analyst (Tech Consulting)",
    package: 14.2,
    ctc: "₹14.2 LPA",
    location: "Hyderabad / Bengaluru",
    deadline: "10 Nov 2026",
    category: "Dream",
    degree: "MCA, B.Tech, M.Tech",
    minCgpa: 7.5,
    maxBacklogs: 0,
    skills: ["Python", "SQL", "Business Analytics", "Cloud Architecture"],
    description: "Deliver technology solutions and advisory services to enterprise clients internationally.",
  },
  {
    id: "drv-006",
    company: "TCS Digital",
    logo: "TCS",
    role: "System Architect Trainee",
    package: 7.5,
    ctc: "₹7.5 LPA",
    location: "Pan-India",
    deadline: "15 Nov 2026",
    category: "Core Tech",
    degree: "MCA, B.Tech",
    minCgpa: 7.0,
    maxBacklogs: 1,
    skills: ["Java", "SQL", "Spring Boot", "Software Engineering"],
    description: "Work on cutting-edge digital enterprise engagements across diverse industry verticals.",
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

export default function PlacementDrives() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [drives] = useState(() => readSaved("cprmp_all_drives", ALL_DRIVES));
  const [applications, setApplications] = useState(() =>
    readSaved("cprmp_applications", [])
  );
  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [feedback, setFeedback] = useState(null);

  const profile = useMemo(() => {
    const stored = readSaved("cprmpStudentProfile", {});
    return {
      name: user?.name || stored.fullName || "Student",
      cgpa: Number(stored.cgpa || 8.84),
      backlogs: Number(stored.backlogs || 0),
    };
  }, [user]);

  // Persist applications
  useEffect(() => {
    try {
      localStorage.setItem("cprmp_applications", JSON.stringify(applications));
    } catch {}
  }, [applications]);

  const filterTabs = [
    { id: "all", label: "All Drives" },
    { id: "eligible", label: "Eligible Only" },
    { id: "super-dream", label: "Super Dream (> ₹20 LPA)" },
    { id: "dream", label: "Dream (₹10–₹20 LPA)" },
    { id: "core", label: "Core Tech" },
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

      const isEligible =
        profile.cgpa >= (drive.minCgpa || 7.0) &&
        profile.backlogs <= (drive.maxBacklogs || 0);

      let matchesFilter = true;
      if (selectedFilter === "eligible") {
        matchesFilter = isEligible;
      } else if (selectedFilter === "super-dream") {
        matchesFilter = drive.category === "Super Dream" || drive.package >= 20;
      } else if (selectedFilter === "dream") {
        matchesFilter = drive.category === "Dream" || (drive.package >= 10 && drive.package < 20);
      } else if (selectedFilter === "core") {
        matchesFilter = drive.category === "Core Tech" || drive.package < 10;
      }

      return matchesSearch && matchesFilter;
    });
  }, [drives, search, selectedFilter, profile]);

  const handleApply = (drive) => {
    const alreadyApplied = applications.some(
      (app) => app.driveId === drive.id || app.company === drive.company
    );

    if (alreadyApplied) {
      setFeedback({
        type: "info",
        message: `You have already submitted an application for ${drive.company}.`,
      });
      return;
    }

    const isEligible =
      profile.cgpa >= (drive.minCgpa || 7.0) &&
      profile.backlogs <= (drive.maxBacklogs || 0);

    if (!isEligible) {
      setFeedback({
        type: "error",
        message: `Eligibility criteria not met: requires minimum CGPA ${drive.minCgpa} and max backlogs ${drive.maxBacklogs}.`,
      });
      return;
    }

    const newApp = {
      id: `app-${Date.now()}`,
      driveId: drive.id,
      company: drive.company,
      role: drive.role,
      appliedDate: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      status: "Applied",
      milestone: "Application submitted and queued for verification",
    };

    setApplications((prev) => [newApp, ...prev]);
    setFeedback({
      type: "success",
      message: `Application submitted successfully for ${drive.company} — ${drive.role}!`,
    });
  };

  const handleResetFilters = () => {
    setSearch("");
    setSelectedFilter("all");
  };

  return (
    <AppLayout
      pageTitle="Placement Drives"
      breadcrumb="Student Workspace"
      searchValue={search}
      onSearch={setSearch}
      searchPlaceholder="Search company, skills, role..."
    >
      <div className="drives-editorial-layout">
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

        <PageHeader
          eyebrow="ACADEMIC CYCLE 2026–2027"
          title="Placement Drives & Opportunities"
          description="Explore active recruitment drives scheduled for this placement session. Check detailed job requirements, verify minimum eligibility thresholds, and apply directly."
        />

        {/* Filter Controls Row */}
        <div className="drives-controls-row">
          <div className="drives-filter-tabs">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`drives-filter-btn ${
                  selectedFilter === tab.id ? "active" : ""
                }`}
                onClick={() => setSelectedFilter(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="drives-search-box">
            <Search size={14} className="drives-search-icon" />
            <input
              type="search"
              className="drives-search-input"
              placeholder="Filter by title, company, or skill..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Grid of Placement Drives */}
        {filteredDrives.length === 0 ? (
          <EmptyState
            title="No placement drives found"
            description="No drives match your current filter criteria. You can clear the filters to see all available opportunities."
            action={
              <button
                type="button"
                className="btn-secondary btn-sm"
                onClick={handleResetFilters}
              >
                <RotateCcw size={13} style={{ marginRight: "6px" }} />
                <span>Reset Filters</span>
              </button>
            }
          />
        ) : (
          <div className="drives-grid-list">
            {filteredDrives.map((drive) => {
              const hasApplied = applications.some(
                (app) => app.driveId === drive.id || app.company === drive.company
              );
              const isEligible =
                profile.cgpa >= (drive.minCgpa || 7.0) &&
                profile.backlogs <= (drive.maxBacklogs || 0);

              return (
                <PlacementDriveCard
                  key={drive.id}
                  drive={drive}
                  hasApplied={hasApplied}
                  isEligible={isEligible}
                  onApply={handleApply}
                />
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
