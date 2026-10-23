import { useState, useMemo, useEffect, useCallback } from "react";
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
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import AppLayout from "../components/ui/AppLayout.jsx";
import {
  PageHeader,
  PrimaryButton,
  EmptyState,
} from "../components/ui/EditorialComponents.jsx";
import { studentApi } from "../api/studentApi.js";
import "./AIResumeMatching.css";

export default function AIResumeMatching() {
  const [loading, setLoading] = useState(true);
  const [matchingData, setMatchingData] = useState(null);
  const [resumeData, setResumeData] = useState(null);
  const [selectedDriveId, setSelectedDriveId] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [aiRes, resumeRes] = await Promise.all([
        studentApi.getAIMatching(),
        studentApi.getResumeStatus().catch(() => null),
      ]);
      setMatchingData(aiRes);
      setResumeData(resumeRes);
      if (aiRes.matches && aiRes.matches.length > 0) {
        setSelectedDriveId(aiRes.matches[0].id);
      }
    } catch (err) {
      console.error("Failed to load AI matching data:", err);
      setError(err.message || "Failed to load matching data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const matches = matchingData?.matches || [];

  const currentAnalysis = useMemo(() => {
    if (!matches.length) return null;
    return matches.find((d) => d.id === selectedDriveId) || matches[0];
  }, [matches, selectedDriveId]);

  const handleDriveChange = (e) => {
    setIsAnalyzing(true);
    setSelectedDriveId(e.target.value);
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 300);
  };

  const resumeName =
    resumeData?.resume?.originalFilename ||
    "Active Profile Skills & Coursework Snapshot";

  return (
    <AppLayout pageTitle="AI Resume Matching" breadcrumb="Student Workspace">
      <div className="ai-matching-editorial-container">
        <PageHeader
          eyebrow="ADVISORY INTELLIGENCE"
          title="AI Resume & Skill Gap Analysis"
          description="Evaluate semantic alignment between your active placement resume and target campus recruitment drives. Discover matched competencies and high-impact areas for interview preparation."
        />

        {loading && !matchingData ? (
          <div style={{ padding: "80px", textAlign: "center", color: "var(--text-secondary)" }}>
            <RefreshCw size={28} className="animate-spin" style={{ margin: "0 auto 16px" }} />
            <p>Comparing your technical profile competencies against published drives...</p>
          </div>
        ) : error && !matchingData ? (
          <EmptyState
            title="Failed to run skill gap analysis"
            description={error}
            action={
              <button type="button" className="btn-secondary btn-sm" onClick={loadData}>
                Retry Analysis
              </button>
            }
          />
        ) : matches.length === 0 ? (
          <EmptyState
            title="No published placement drives available"
            description="There are currently no active placement drives published to analyze against."
            action={
              <Link to="/student" className="btn-secondary btn-sm">
                Return to Dashboard
              </Link>
            }
          />
        ) : (
          <>
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
                      {resumeName}
                    </span>
                    <Link to="/student/resume" style={{ fontSize: "12px", color: "var(--accent)", textDecoration: "underline" }}>
                      Change
                    </Link>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>
                    Select Placement Drive to Audit
                  </label>
                  <select
                    value={selectedDriveId}
                    onChange={handleDriveChange}
                    className="field-select"
                    style={{ width: "100%", padding: "10px 12px" }}
                  >
                    {matches.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.score}% Match)
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
            {currentAnalysis && (
              <div className="ai-results-grid">
                {/* Match Score Card */}
                <div className="ai-score-card">
                  <span style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-secondary)" }}>
                    Overall Skill Compatibility
                  </span>

                  <div className="ai-score-circle">
                    <span className="ai-score-number">{currentAnalysis.score}%</span>
                  </div>

                  <span className={`editorial-badge ${currentAnalysis.score >= 80 ? "badge-accent" : currentAnalysis.score >= 60 ? "badge-info" : "badge-warning"}`}>
                    {currentAnalysis.score >= 80 ? "Strong Skill Alignment" : currentAnalysis.score >= 60 ? "Moderate Alignment" : "Skill Gaps Identified"}
                  </span>

                  <p style={{ fontSize: "12.5px", color: "var(--text-secondary)", margin: "4px 0 0", lineHeight: 1.5 }}>
                    Your recorded competencies match {currentAnalysis.matched.length} requirements. {currentAnalysis.missing.length > 0 ? `Review the ${currentAnalysis.missing.length} missing skill areas below.` : "Excellent alignment across all requirements."}
                  </p>

                  <Link
                    to={`/student/drives/${currentAnalysis.id}`}
                    className="btn-secondary btn-sm"
                    style={{ width: "100%", textAlign: "center", marginTop: "8px" }}
                  >
                    View Drive Details & Apply
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
                      {currentAnalysis.matched.length === 0 ? (
                        <span style={{ fontSize: "12.5px", color: "var(--text-muted)" }}>
                          No direct skill matches found for this specific drive.
                        </span>
                      ) : (
                        currentAnalysis.matched.map((skill, index) => (
                          <span key={index} className="skill-tag-matched">
                            <Check size={12} />
                            <span>{skill}</span>
                          </span>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Missing Skills */}
                  <div className="skills-analysis-block">
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <Plus size={16} color="var(--text-muted)" />
                      <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "17px", margin: 0, color: "var(--text-primary)" }}>
                        Recommended Technical Exposure ({currentAnalysis.missing.length})
                      </h3>
                    </div>
                    <div className="skills-tags-wrap">
                      {currentAnalysis.missing.length === 0 ? (
                        <span style={{ fontSize: "12.5px", color: "var(--success)" }}>
                          ✓ You possess all required technical skills for this role!
                        </span>
                      ) : (
                        currentAnalysis.missing.map((skill, index) => (
                          <span key={index} className="skill-tag-missing">
                            <span>{skill}</span>
                          </span>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Improvement Recommendations */}
                  <div className="skills-analysis-block">
                    <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "17px", margin: 0, color: "var(--text-primary)" }}>
                      Interview Preparation Recommendations
                    </h3>
                    <div className="recommendations-list">
                      {(currentAnalysis.recommendations || []).map((rec, index) => (
                        <div key={index} className="recommendation-item">
                          <strong style={{ color: "var(--text-primary)", display: "block", marginBottom: "2px" }}>
                            Insight {index + 1}
                          </strong>
                          <span style={{ color: "var(--text-secondary)" }}>{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
}
