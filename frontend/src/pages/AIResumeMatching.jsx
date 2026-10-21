import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Briefcase,
  Check,
  Plus,
  ArrowRight,
  Info,
} from "lucide-react";
import AppLayout from "../components/ui/AppLayout.jsx";
import {
  PageHeader,
  PrimaryButton,
} from "../components/ui/EditorialComponents.jsx";
import "./AIResumeMatching.css";

const AVAILABLE_DRIVES = [
  {
    id: "drv-001",
    name: "Microsoft IDC — Software Engineer (Cloud & AI)",
    score: 88,
    matched: [
      "Java & Object-Oriented Design",
      "Python Scripting",
      "Data Structures & Algorithms",
      "Relational SQL & Query Optimization",
      "RESTful API Architecture",
      "Docker Containerization",
      "Git Version Control",
    ],
    missing: [
      "Kubernetes (AKS Cluster Orchestration)",
      "Distributed Consensus (Raft/Paxos)",
      "Azure Observability & OpenTelemetry",
    ],
    recommendations: [
      "Highlight multi-threaded concurrency patterns in your recent Java and Go projects.",
      "Review the CAP theorem and distributed cache consistency models for technical round 2.",
      "Include a brief bullet summarizing container orchestration and Dockerfile best practices.",
    ],
  },
  {
    id: "drv-002",
    name: "Goldman Sachs — Engineering Analyst",
    score: 84,
    matched: [
      "Core Java & Memory Models",
      "Algorithms & Complexity Analysis",
      "Relational SQL Databases",
      "Git & Collaborative Workflows",
    ],
    missing: [
      "Low-Latency IPC Mechanics",
      "Financial Market Infrastructure Basics",
    ],
    recommendations: [
      "Emphasize unit test coverage and transaction atomicity in database projects.",
      "Prepare for questions on indexing, B-trees, and concurrency primitives.",
    ],
  },
  {
    id: "drv-003",
    name: "Google India — Associate Software Engineer",
    score: 91,
    matched: [
      "Data Structures & Graph Traversal",
      "Python & Clean Code Principles",
      "Linux Systems & Shell Programming",
      "Docker & Microservices",
    ],
    missing: [
      "Distributed Tracing at Planetary Scale",
    ],
    recommendations: [
      "Practice dynamic programming and asymptotic time complexity proofs.",
      "Demonstrate knowledge of distributed systems fault boundaries.",
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

export default function AIResumeMatching() {
  const [selectedDriveId, setSelectedDriveId] = useState("drv-001");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const resumeMeta = useMemo(() => {
    return (
      readSaved("cprmpResumeMetadata", null) || {
        name: "Aryan_Sharma_MCA_2026_Placement_Resume.pdf",
        status: "Active Verified Resume",
      }
    );
  }, []);

  const currentAnalysis = useMemo(() => {
    return (
      AVAILABLE_DRIVES.find((d) => d.id === selectedDriveId) ||
      AVAILABLE_DRIVES[0]
    );
  }, [selectedDriveId]);

  const handleDriveChange = (e) => {
    setIsAnalyzing(true);
    setSelectedDriveId(e.target.value);
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 400);
  };

  return (
    <AppLayout pageTitle="AI Resume Matching" breadcrumb="Student Workspace">
      <div className="ai-matching-editorial-container">
        <PageHeader
          eyebrow="ADVISORY INTELLIGENCE"
          title="AI Resume & Skill Gap Analysis"
          description="Evaluate semantic alignment between your active placement resume and target campus recruitment drives. Discover matched competencies and high-impact areas for interview preparation."
        />

        {/* Selection Card */}
        <div className="ai-hero-card">
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <Sparkles size={18} color="var(--accent)" />
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "20px", margin: 0, color: "var(--text-primary)" }}>
              Target Opportunity Configuration
            </h2>
          </div>

          <div className="ai-selector-row">
            <div>
              <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>
                Active Student Resume
              </label>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 14px",
                  background: "var(--surface-secondary)",
                  border: "1px solid var(--border)",
                  borderRadius: "6px",
                  fontSize: "13.5px",
                  fontWeight: 500,
                }}
              >
                <FileText size={16} color="var(--accent)" />
                <span style={{ flex: 1, textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                  {resumeMeta.name}
                </span>
                <Link to="/student/resume" style={{ fontSize: "12px", color: "var(--accent)", textDecoration: "underline" }}>
                  Change
                </Link>
              </div>
            </div>

            <div>
              <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>
                Select Placement Drive
              </label>
              <select
                value={selectedDriveId}
                onChange={handleDriveChange}
                className="field-select"
                style={{ width: "100%", padding: "10px 12px" }}
              >
                {AVAILABLE_DRIVES.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="ai-advisory-banner">
            <Info size={16} style={{ flexShrink: 0 }} />
            <span>
              <strong>Important Policy Notice:</strong> AI Resume Matching is strictly advisory and formative. It assists candidate interview preparation and <em>never</em> overrides official deterministic eligibility criteria (CGPA, backlogs, department) enforced by the college.
            </span>
          </div>
        </div>

        {/* Results Grid */}
        <div className="ai-results-grid">
          {/* Match Score Card */}
          <div className="ai-score-card">
            <span style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-secondary)" }}>
              Overall Skill Compatibility
            </span>

            <div className="ai-score-circle">
              <span className="ai-score-number">{currentAnalysis.score}%</span>
            </div>

            <span className="editorial-badge badge-accent">
              High Semantic Alignment
            </span>

            <p style={{ fontSize: "12.5px", color: "var(--text-secondary)", margin: "4px 0 0", lineHeight: 1.5 }}>
              Your coursework and documented projects reflect substantial overlap with the core engineering competencies required for this role.
            </p>

            <Link
              to="/student/drive-details/drv-001"
              className="btn-secondary btn-sm"
              style={{ width: "100%", textAlign: "center", marginTop: "8px" }}
            >
              View Drive Requirements
            </Link>
          </div>

          {/* Detailed Skill Breakdown & Recommendations */}
          <div className="ai-analysis-card">
            {/* Matched Skills */}
            <div className="skills-analysis-block">
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <CheckCircle2 size={16} color="var(--success)" />
                <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "17px", margin: 0, color: "var(--text-primary)" }}>
                  Identified Strengths & Matched Skills ({currentAnalysis.matched.length})
                </h3>
              </div>
              <div className="skills-tags-wrap">
                {currentAnalysis.matched.map((skill, index) => (
                  <span key={index} className="skill-tag-matched">
                    <Check size={12} />
                    <span>{skill}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="skills-analysis-block">
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Plus size={16} color="var(--text-muted)" />
                <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "17px", margin: 0, color: "var(--text-primary)" }}>
                  Recommended Prerequisite Exposure ({currentAnalysis.missing.length})
                </h3>
              </div>
              <div className="skills-tags-wrap">
                {currentAnalysis.missing.map((skill, index) => (
                  <span key={index} className="skill-tag-missing">
                    <span>{skill}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Improvement Recommendations */}
            <div className="skills-analysis-block">
              <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "17px", margin: 0, color: "var(--text-primary)" }}>
                Interview Preparation Recommendations
              </h3>
              <div className="recommendations-list">
                {currentAnalysis.recommendations.map((rec, index) => (
                  <div key={index} className="recommendation-item">
                    <strong style={{ color: "var(--text-primary)", display: "block", marginBottom: "2px" }}>
                      Tip {index + 1}
                    </strong>
                    <span style={{ color: "var(--text-secondary)" }}>{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
