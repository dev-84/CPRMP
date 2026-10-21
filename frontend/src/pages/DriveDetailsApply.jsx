import { useState, useMemo, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Building2,
  MapPin,
  Calendar,
  DollarSign,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ShieldCheck,
  Check,
  X,
} from "lucide-react";
import { useAuth } from "../context/useAuth.js";
import AppLayout from "../components/ui/AppLayout.jsx";
import {
  ApplicationStatusBadge,
  CompanyLogo,
  PrimaryButton,
  SecondaryButton,
} from "../components/ui/EditorialComponents.jsx";
import "./DriveDetailsApply.css";

const ALL_DRIVES = [
  {
    id: "drv-001",
    company: "Microsoft IDC",
    logo: "MS",
    jobId: "MS-HYD-2026-998",
    role: "Software Engineer — Cloud & AI Infrastructure",
    package: "₹32.0 LPA",
    base: "₹18.0 LPA",
    rsu: "₹8.0 LPA",
    bonus: "₹6.0 LPA",
    location: "Hyderabad / Bengaluru, India",
    workMode: "Hybrid (3 days office)",
    deadline: "28 Oct 2026",
    category: "Super Dream",
    degree: "MCA, B.Tech CS/IT",
    minCgpa: 8.0,
    maxBacklogs: 0,
    skills: ["Azure", "Distributed Systems", "C++", "Python", "Kubernetes", "Linux Kernel"],
    description:
      "Join the Core Cloud Infrastructure pod at Microsoft India Development Center. In this role, you will architect fault-tolerant distributed storage, high-throughput microservices, and specialized AI cluster infrastructure.",
    responsibilities: [
      "Design and implement fault-tolerant microservices deployed across Azure Kubernetes Service and hybrid edge clusters.",
      "Build high-performance asynchronous and multithreaded software with predictable memory utilization.",
      "Develop automated CI pipelines, integration stress tests, and distributed OpenTelemetry tracing.",
      "Investigate high-severity production telemetry incidents, root-cause analyses, and architectural post-mortems.",
    ],
  },
  {
    id: "drv-002",
    company: "Goldman Sachs",
    logo: "GS",
    jobId: "GS-BLR-2026-402",
    role: "Engineering Analyst (Core Systems)",
    package: "₹28.5 LPA",
    base: "₹22.0 LPA",
    rsu: "₹3.5 LPA",
    bonus: "₹3.0 LPA",
    location: "Bengaluru, India",
    workMode: "On-Site",
    deadline: "02 Nov 2026",
    category: "Super Dream",
    degree: "MCA, B.Tech CS/IT",
    minCgpa: 8.0,
    maxBacklogs: 0,
    skills: ["Java", "SQL", "Algorithms", "Financial Tech", "Data Structures", "Spring Boot"],
    description:
      "Develop low-latency transactional architectures, global market connectivity gateways, and risk management analytics platforms at Goldman Sachs India.",
    responsibilities: [
      "Design resilient microservices processing multi-million transaction order volumes in sub-millisecond envelopes.",
      "Optimize complex relational schema and distributed query plans for mission-critical ledger records.",
      "Partner with quant risk strategists and compliance officers to implement regulatory security controls.",
    ],
  },
  {
    id: "drv-003",
    company: "Infosys",
    logo: "INF",
    jobId: "INF-SP-2026-881",
    role: "Systems Specialist",
    package: "₹9.5 LPA",
    base: "₹8.0 LPA",
    rsu: "—",
    bonus: "₹1.5 LPA",
    location: "Pune / Bengaluru, India",
    workMode: "Hybrid",
    deadline: "05 Nov 2026",
    category: "Core Tech",
    degree: "All Master Disciplines",
    minCgpa: 7.0,
    maxBacklogs: 1,
    skills: ["Full Stack", "Java", "React", "Cloud Basics", "REST APIs"],
    description:
      "Drive large-scale enterprise cloud migrations and modernized web systems for global Global 2000 customers within Infosys Digital Practice.",
    responsibilities: [
      "Build dynamic user interfaces and decoupled REST API backends using modern JavaScript and Java.",
      "Write unit and integration tests to achieve 90%+ branch coverage.",
      "Participate in agile sprint rituals and code reviews.",
    ],
  },
  {
    id: "drv-004",
    company: "Google India",
    logo: "G",
    jobId: "GOOG-IN-2026-112",
    role: "Associate Software Engineer",
    package: "₹34.0 LPA",
    base: "₹20.0 LPA",
    rsu: "₹10.0 LPA",
    bonus: "₹4.0 LPA",
    location: "Bengaluru / Hyderabad, India",
    workMode: "Hybrid",
    deadline: "30 Oct 2026",
    category: "Super Dream",
    degree: "MCA, B.Tech CS/IT",
    minCgpa: 8.5,
    maxBacklogs: 0,
    skills: ["DSA", "Go", "Distributed Systems", "Kubernetes", "Linux"],
    description:
      "Join Google's engineering team solving foundational challenges in distributed compute, networking, and planetary scale search and cloud services.",
    responsibilities: [
      "Develop and maintain high-reliability production software services serving global users.",
      "Analyze latency bottlenecks, profiling CPU and network consumption under massive traffic loads.",
    ],
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

export default function DriveDetailsApply() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [applications, setApplications] = useState(() =>
    readSaved("cprmp_applications", [])
  );
  const [feedback, setFeedback] = useState(null);

  const drive = useMemo(() => {
    return (
      ALL_DRIVES.find((d) => d.id === id || String(d.id).includes(String(id))) ||
      ALL_DRIVES[0]
    );
  }, [id]);

  const profile = useMemo(() => {
    const stored = readSaved("cprmpStudentProfile", {});
    return {
      cgpa: Number(stored.cgpa || 8.84),
      backlogs: Number(stored.backlogs || 0),
    };
  }, []);

  const hasApplied = applications.some(
    (app) => app.driveId === drive.id || app.company === drive.company
  );

  const meetsCgpa = profile.cgpa >= (drive.minCgpa || 7.0);
  const meetsBacklogs = profile.backlogs <= (drive.maxBacklogs || 0);
  const isEligible = meetsCgpa && meetsBacklogs;

  const handleApply = () => {
    if (hasApplied) return;
    if (!isEligible) {
      setFeedback({
        type: "error",
        message: "You do not meet the minimum eligibility criteria for this drive.",
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

    const updated = [newApp, ...applications];
    setApplications(updated);
    try {
      localStorage.setItem("cprmp_applications", JSON.stringify(updated));
    } catch {}

    setFeedback({
      type: "success",
      message: `Your application to ${drive.company} has been recorded!`,
    });
  };

  return (
    <AppLayout pageTitle="Placement Drive Details" breadcrumb="Placement Opportunities">
      <div className="drive-details-container">
        <Link
          to="/student/placement-drives"
          className="section-action-link"
          style={{ alignSelf: "flex-start", marginBottom: "-12px" }}
        >
          <ArrowLeft size={14} />
          <span>Back to Placement Drives</span>
        </Link>

        {feedback && (
          <div
            style={{
              padding: "14px 20px",
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

        {/* Hero Card */}
        <div className="details-hero-card">
          <div className="details-header-row">
            <div className="details-company-group">
              <CompanyLogo name={drive.company} logo={drive.logo} />
              <div>
                <div className="details-company-name">{drive.company} · {drive.jobId}</div>
                <h1 className="details-role-title">{drive.role}</h1>
              </div>
            </div>

            <div className="details-actions-area">
              <ApplicationStatusBadge
                status={hasApplied ? "Applied" : (isEligible ? "Eligible" : "Not Eligible")}
              />

              {hasApplied ? (
                <Link to="/student/applications" className="btn-secondary btn-sm">
                  Track in Applications
                </Link>
              ) : (
                <PrimaryButton
                  onClick={handleApply}
                  disabled={!isEligible}
                >
                  Apply to Drive
                </PrimaryButton>
              )}
            </div>
          </div>

          <div className="details-summary-grid">
            <div className="summary-spec-item">
              <span className="spec-label">Compensation (CTC)</span>
              <span className="spec-value" style={{ color: "var(--accent)" }}>{drive.package}</span>
            </div>
            <div className="summary-spec-item">
              <span className="spec-label">Location</span>
              <span className="spec-value">{drive.location}</span>
            </div>
            <div className="summary-spec-item">
              <span className="spec-label">Work Mode</span>
              <span className="spec-value">{drive.workMode}</span>
            </div>
            <div className="summary-spec-item">
              <span className="spec-label">Application Deadline</span>
              <span className="spec-value">{drive.deadline}</span>
            </div>
          </div>
        </div>

        {/* Two-Column Details Body */}
        <div className="details-body-grid">
          {/* Main Description & Responsibilities */}
          <div className="details-card-section">
            <div>
              <h2 className="section-block-title">Role Overview</h2>
              <p className="editorial-prose">{drive.description}</p>
            </div>

            <div>
              <h2 className="section-block-title">Key Responsibilities</h2>
              <ul className="responsibilities-list">
                {drive.responsibilities.map((resp, index) => (
                  <li key={index}>{resp}</li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="section-block-title">Required Competencies & Skills</h2>
              <div className="skills-pill-group">
                {drive.skills.map((skill, index) => (
                  <span key={index} className="skill-editorial-badge">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h2 className="section-block-title">Compensation Breakdown</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", background: "var(--surface-secondary)", padding: "16px", borderRadius: "6px" }}>
                <div>
                  <span style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>Base Pay</span>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>{drive.base}</div>
                </div>
                <div>
                  <span style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>RSU / Equity</span>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>{drive.rsu}</div>
                </div>
                <div>
                  <span style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>Target Bonus</span>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>{drive.bonus}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Eligibility & Status */}
          <div className="eligibility-checklist-card">
            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "18px", margin: 0, color: "var(--text-primary)" }}>
              Eligibility Criteria
            </h3>
            <p style={{ fontSize: "12.5px", color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>
              Institutional verification against official candidate records.
            </p>

            <div className="checklist-item">
              {meetsCgpa ? (
                <CheckCircle2 size={18} color="var(--success)" style={{ flexShrink: 0, marginTop: "2px" }} />
              ) : (
                <AlertCircle size={18} color="var(--error)" style={{ flexShrink: 0, marginTop: "2px" }} />
              )}
              <div>
                <div className="checklist-item-title">Minimum CGPA: {drive.minCgpa}</div>
                <div className="checklist-item-desc">
                  Your CGPA: <strong>{profile.cgpa.toFixed(2)}</strong> {meetsCgpa ? "(Eligible)" : "(Below requirement)"}
                </div>
              </div>
            </div>

            <div className="checklist-item">
              {meetsBacklogs ? (
                <CheckCircle2 size={18} color="var(--success)" style={{ flexShrink: 0, marginTop: "2px" }} />
              ) : (
                <AlertCircle size={18} color="var(--error)" style={{ flexShrink: 0, marginTop: "2px" }} />
              )}
              <div>
                <div className="checklist-item-title">Max Allowed Backlogs: {drive.maxBacklogs}</div>
                <div className="checklist-item-desc">
                  Your standing: <strong>{profile.backlogs}</strong> {meetsBacklogs ? "(Eligible)" : "(Exceeds limit)"}
                </div>
              </div>
            </div>

            <div className="checklist-item">
              <CheckCircle2 size={18} color="var(--success)" style={{ flexShrink: 0, marginTop: "2px" }} />
              <div>
                <div className="checklist-item-title">Degree Requirement</div>
                <div className="checklist-item-desc">{drive.degree}</div>
              </div>
            </div>

            <div style={{ marginTop: "8px", paddingTop: "16px", borderTop: "1px solid var(--border)" }}>
              {hasApplied ? (
                <div style={{ textAlign: "center", color: "var(--accent)", fontSize: "13px", fontWeight: 600 }}>
                  ✓ Application already submitted
                </div>
              ) : (
                <button
                  type="button"
                  className="btn-primary"
                  style={{ width: "100%" }}
                  onClick={handleApply}
                  disabled={!isEligible}
                >
                  {isEligible ? "Submit Application" : "Ineligible for this Drive"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
