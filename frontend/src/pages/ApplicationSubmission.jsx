import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  FileText,
  Check,
  AlertCircle,
  Eye,
  AlertTriangle,
  UploadCloud,
  X,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "../context/useAuth.js";
import AppLayout from "../components/ui/AppLayout.jsx";
import {
  PageHeader,
  PrimaryButton,
  SecondaryButton,
} from "../components/ui/EditorialComponents.jsx";

export default function ApplicationSubmission() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  const [declarations, setDeclarations] = useState([true, true, true]);
  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Resume status
  const [resumeLoading, setResumeLoading] = useState(true);
  const [resumeData, setResumeData] = useState(null);
  const [previewBlobUrl, setPreviewBlobUrl] = useState(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  const allAccepted = declarations.every(Boolean);

  const toggleDeclaration = (index) => {
    setDeclarations((prev) => prev.map((val, i) => (i === index ? !val : val)));
  };

  // Check resume status on mount
  useEffect(() => {
    async function checkResume() {
      setResumeLoading(true);
      try {
        if (token) {
          const res = await fetch("/api/student/resume", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const json = await res.json();
            if (json.data?.hasResume && json.data.resume) {
              setResumeData(json.data.resume);
            }
          }
        }
      } catch {
        // Fallback to local storage
        try {
          const cached = localStorage.getItem("cprmpResumeMetadata");
          if (cached) setResumeData(JSON.parse(cached));
        } catch {}
      } finally {
        setResumeLoading(false);
      }
    }

    checkResume();
  }, [token]);

  // Clean up blob URL on unmount
  useEffect(() => {
    return () => {
      if (previewBlobUrl) URL.revokeObjectURL(previewBlobUrl);
    };
  }, [previewBlobUrl]);

  // Handle previewing attached resume
  const handlePreviewResume = async () => {
    if (!resumeData) return;
    try {
      const res = await fetch("/api/student/resume/preview", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error("Could not load preview stream.");
      const blob = await res.blob();
      const url = URL.createObjectURL(new Blob([blob], { type: "application/pdf" }));
      setPreviewBlobUrl(url);
      setPreviewModalOpen(true);
    } catch (err) {
      setNotice(err.message || "Failed to load resume preview.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Mandatory Resume Validation Check
    if (!resumeData) {
      setNotice("Please upload your resume before submitting. A verified resume is required for campus drive applications.");
      return;
    }

    // 2. Declaration check
    if (!allAccepted) {
      setNotice("Please accept all institutional declarations before proceeding.");
      return;
    }

    setSubmitting(true);
    setNotice("");

    try {
      if (token) {
        const res = await fetch("/api/applications/apply", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ driveId: id || "demo-drive" }),
        });

        if (!res.ok) {
          const errJson = await res.json().catch(() => ({}));
          throw new Error(errJson.message || "Application rejected by placement portal.");
        }
      }

      navigate("/student/application-submitted");
    } catch (err) {
      setNotice(err.message || "Failed to submit application. Please check your eligibility and resume.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppLayout pageTitle="Submit Application" breadcrumb="Placement Opportunities">
      <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "28px" }}>
        <Link
          to="/student/placement-drives"
          className="section-action-link"
          style={{ alignSelf: "flex-start", marginBottom: "-12px" }}
        >
          <ArrowLeft size={14} />
          <span>Back to Placement Drives</span>
        </Link>

        <PageHeader
          eyebrow="APPLICATION ATTESTATION"
          title="Confirm Placement Application"
          description="Review your active credentials, verified resume attachment, and institutional declarations before confirming your candidacy."
        />

        {notice && (
          <div
            style={{
              padding: "12px 18px",
              borderRadius: "6px",
              backgroundColor: "var(--error-soft, #FEF3F2)",
              border: "1px solid #f5c2c2",
              color: "var(--error, #B42318)",
              fontSize: "13.5px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <AlertCircle size={16} />
            <span>{notice}</span>
          </div>
        )}

        {/* Mandatory Resume Verification Box */}
        {!resumeLoading && !resumeData && (
          <div
            style={{
              padding: "18px 22px",
              borderRadius: "8px",
              backgroundColor: "#FEF7EA",
              border: "1px solid #F9DBAF",
              color: "#8C5303",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: "16px",
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
              <AlertTriangle size={20} style={{ flexShrink: 0, marginTop: "2px" }} />
              <div>
                <strong style={{ fontSize: "14px", display: "block", marginBottom: "4px" }}>
                  Resume upload is required. Please upload your resume to continue.
                </strong>
                <p style={{ fontSize: "12.5px", margin: 0, lineHeight: 1.5 }}>
                  Placement cell regulations require an authentic PDF resume on record. You cannot submit applications until your resume is verified.
                </p>
              </div>
            </div>

            <Link
              to="/student/resume"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 16px",
                backgroundColor: "var(--accent, #3F754B)",
                color: "#FAF9F6",
                borderRadius: "6px",
                fontSize: "12.5px",
                fontWeight: 600,
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
            >
              <UploadCloud size={14} />
              <span>Upload Resume Now</span>
            </Link>
          </div>
        )}

        {/* Attached Verified Resume Card */}
        {resumeData && (
          <div
            style={{
              padding: "16px 20px",
              borderRadius: "8px",
              backgroundColor: "var(--surface, #FFFFFF)",
              border: "1px solid var(--border, #E5E7E1)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "16px",
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "6px",
                  backgroundColor: "var(--accent-soft, #EAF2E7)",
                  display: "grid",
                  placeItems: "center",
                  color: "var(--accent, #3F754B)",
                  flexShrink: 0,
                }}
              >
                <FileText size={20} />
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--accent)", textTransform: "uppercase" }}>
                    Verified Resume Attached
                  </span>
                  <span
                    style={{
                      fontSize: "10.5px",
                      fontWeight: 600,
                      backgroundColor: "var(--accent-soft, #EAF2E7)",
                      color: "var(--accent, #3F754B)",
                      padding: "1px 6px",
                      borderRadius: "4px",
                    }}
                  >
                    Cleared by TPO
                  </span>
                </div>
                <strong style={{ fontSize: "14px", color: "var(--text-primary)" }}>
                  {resumeData.filename || resumeData.originalFilename || "Candidate_Placement_Resume.pdf"}
                </strong>
              </div>
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <button
                type="button"
                onClick={handlePreviewResume}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  padding: "6px 12px",
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "6px",
                  fontSize: "12.5px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                <Eye size={13} />
                <span>Preview</span>
              </button>

              <Link
                to="/student/resume"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  padding: "6px 12px",
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "6px",
                  fontSize: "12.5px",
                  color: "var(--text-secondary)",
                  textDecoration: "none",
                }}
              >
                <span>Change</span>
              </Link>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "8px", padding: "32px", display: "flex", flexDirection: "column", gap: "24px" }}>
          <div>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "19px", margin: "0 0 12px", color: "var(--text-primary)" }}>
              Institutional Attestation & Declarations
            </h2>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>
              By submitting this application, you formally confirm compliance with university placement guidelines:
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              "I certify that my academic records (CGPA, marks, and backlogs) submitted in the CPRMP portal are accurate and verified by the university registrar.",
              "I understand that upon receiving an official placement offer, I am bound by the university placement cell single-offer policy unless superseded by higher tier categorization.",
              "I confirm my availability to attend scheduled coding assessments, technical interviews, and recruitment activities on the announced dates.",
            ].map((text, idx) => (
              <label
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  padding: "14px 16px",
                  background: "var(--surface-secondary)",
                  borderRadius: "6px",
                  border: "1px solid var(--border)",
                  cursor: "pointer",
                  fontSize: "13px",
                  lineHeight: 1.5,
                  color: "var(--text-primary)",
                }}
              >
                <input
                  type="checkbox"
                  checked={declarations[idx]}
                  onChange={() => toggleDeclaration(idx)}
                  style={{ marginTop: "3px", accentColor: "var(--accent)" }}
                />
                <span>{text}</span>
              </label>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", paddingTop: "12px", borderTop: "1px solid var(--border)" }}>
            <Link to="/student/placement-drives" className="btn-secondary">
              Cancel
            </Link>
            <PrimaryButton
              type="submit"
              disabled={!allAccepted || !resumeData || submitting}
              style={{
                cursor: !allAccepted || !resumeData || submitting ? "not-allowed" : "pointer",
              }}
            >
              {submitting
                ? "Submitting..."
                : !resumeData
                ? "Upload Resume to Apply"
                : "Confirm & Submit Candidacy"}
            </PrimaryButton>
          </div>
        </form>

        {/* Modal PDF Preview */}
        {previewModalOpen && previewBlobUrl && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(23, 43, 36, 0.6)",
              display: "grid",
              placeItems: "center",
              zIndex: 1000,
              padding: "20px",
            }}
            onClick={() => setPreviewModalOpen(false)}
          >
            <div
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "10px",
                maxWidth: "840px",
                width: "100%",
                maxHeight: "90vh",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                border: "1px solid var(--border)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
                <strong style={{ fontSize: "16px", color: "var(--text-primary)" }}>
                  {resumeData?.filename || "Resume Document Preview"}
                </strong>
                <button
                  type="button"
                  onClick={() => setPreviewModalOpen(false)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}
                >
                  <X size={20} />
                </button>
              </div>

              <iframe
                src={previewBlobUrl}
                title="Attached Resume Preview"
                style={{ width: "100%", height: "65vh", border: "none" }}
              />

              <div style={{ display: "flex", justifyContent: "flex-end", padding: "12px 20px", borderTop: "1px solid var(--border)", backgroundColor: "var(--surface-secondary)" }}>
                <button
                  type="button"
                  className="btn-secondary btn-sm"
                  onClick={() => setPreviewModalOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}