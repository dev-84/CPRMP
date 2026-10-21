import { useState, useRef, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Download,
  Eye,
  Trash2,
  X,
  ShieldCheck,
  Check,
  FileCheck,
} from "lucide-react";
import AppLayout from "../components/ui/AppLayout.jsx";
import {
  PageHeader,
  PrimaryButton,
  SecondaryButton,
} from "../components/ui/EditorialComponents.jsx";
import "./ResumeManagement.css";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const STORAGE_KEY = "cprmpResumeMetadata";

const DEFAULT_RESUME = {
  name: "Aryan_Sharma_MCA_2026_Placement_Resume.pdf",
  size: 245 * 1024,
  uploadedAt: "15 Oct 2026, 11:30 IST",
  status: "Verified by TPO",
};

const SAMPLE_ARCHIVE = [
  {
    id: "v2",
    name: "Aryan_Sharma_Internship_Resume_v2.pdf",
    size: 190 * 1024,
    date: "01 Sep 2026",
  },
  {
    id: "v1",
    name: "Aryan_Sharma_Academic_Draft_v1.pdf",
    size: 165 * 1024,
    date: "12 Aug 2026",
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

function formatBytes(bytes) {
  if (!bytes) return "0 KB";
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(2)} MB`;
}

export default function ResumeManagement() {
  const fileInputRef = useRef(null);

  const [currentResume, setCurrentResume] = useState(() =>
    readSaved(STORAGE_KEY, DEFAULT_RESUME)
  );
  const [archive, setArchive] = useState(() =>
    readSaved("cprmp_resume_archive", SAMPLE_ARCHIVE)
  );

  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentResume));
      localStorage.setItem("cprmp_resume_archive", JSON.stringify(archive));
    } catch {}
  }, [currentResume, archive]);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setFeedback({
        type: "error",
        message: "Only PDF format documents are supported for official placement submission.",
      });
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setFeedback({
        type: "error",
        message: "File exceeds the 5 MB maximum file size limit.",
      });
      return;
    }

    // Simulate progress
    setIsUploading(true);
    setUploadProgress(10);
    setFeedback(null);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          finishUpload(file);
          return 100;
        }
        return prev + 25;
      });
    }, 150);
  };

  const finishUpload = (file) => {
    setTimeout(() => {
      // Archive current
      if (currentResume) {
        setArchive((prev) => [
          {
            id: `v-${Date.now()}`,
            name: currentResume.name,
            size: currentResume.size,
            date: new Date().toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
          },
          ...prev,
        ]);
      }

      const newResume = {
        name: file.name,
        size: file.size,
        uploadedAt: new Date().toLocaleString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }) + " IST",
        status: "Active & TPO Verified",
      };

      setCurrentResume(newResume);
      setIsUploading(false);
      setUploadProgress(0);
      setFeedback({
        type: "success",
        message: `Successfully uploaded ${file.name}. Your active resume is updated across all campus drives.`,
      });
    }, 300);
  };

  const handleDownload = () => {
    // Generate text/pdf dummy download
    const element = document.createElement("a");
    const file = new Blob([
      `Campus Placement and Recruitment Management Portal (CPRMP)\nVerified Candidate Resume\nFile: ${currentResume.name}\nTimestamp: ${currentResume.uploadedAt}\nVerification Status: ${currentResume.status}`
    ], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = currentResume.name;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <AppLayout pageTitle="Resume Management" breadcrumb="Candidate Records">
      <div className="resume-editorial-container">
        <PageHeader
          eyebrow="INSTITUTIONAL DOSSIER"
          title="Placement Resume Management"
          description="Upload and manage your official campus placement resume. Recruiters access this verified document during shortlisting and technical interviews."
        />

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

        {/* Hero: Active Resume Card */}
        <div className="resume-hero-card">
          <div className="resume-meta-info">
            <div className="resume-pdf-icon-badge">
              <FileText size={22} />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", color: "var(--accent)", textTransform: "uppercase" }}>
                  Active Placement Resume
                </span>
                <span className="editorial-badge badge-success">
                  <Check size={12} />
                  <span>{currentResume.status}</span>
                </span>
              </div>
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "20px", margin: "4px 0 2px", color: "var(--text-primary)" }}>
                {currentResume.name}
              </h2>
              <span style={{ fontSize: "12.5px", color: "var(--text-secondary)" }}>
                {formatBytes(currentResume.size)} · Uploaded on {currentResume.uploadedAt}
              </span>
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              type="button"
              className="btn-secondary btn-sm"
              onClick={() => setPreviewOpen(true)}
            >
              <Eye size={14} />
              <span>Preview</span>
            </button>
            <button
              type="button"
              className="btn-secondary btn-sm"
              onClick={handleDownload}
            >
              <Download size={14} />
              <span>Download</span>
            </button>
            <PrimaryButton
              className="btn-primary btn-sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadCloud size={14} />
              <span>Replace Resume</span>
            </PrimaryButton>
          </div>
        </div>

        {/* Two-Column Grid: Upload & Archived Versions */}
        <div className="resume-body-grid">
          {/* Upload Dropzone */}
          <div className="resume-card-section">
            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "18px", margin: 0, color: "var(--text-primary)" }}>
              Upload Updated Document
            </h3>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>
              Ensure your resume includes updated CGPA, major projects, technical proficiencies, and contact information.
            </p>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept=".pdf"
              style={{ display: "none" }}
            />

            <div
              className="resume-upload-dropzone"
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
            >
              <UploadCloud size={36} color="var(--accent)" strokeWidth={1.5} />
              <div>
                <strong style={{ display: "block", fontSize: "14px", color: "var(--text-primary)" }}>
                  Click to select or drag and drop your PDF resume
                </strong>
                <span style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px", display: "block" }}>
                  PDF format only · Maximum file size 5 MB
                </span>
              </div>
            </div>

            {isUploading && (
              <div style={{ padding: "16px", backgroundColor: "var(--surface-secondary)", borderRadius: "6px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12.5px", fontWeight: 600, marginBottom: "6px" }}>
                  <span>Uploading and verifying document...</span>
                  <span style={{ color: "var(--accent)" }}>{uploadProgress}%</span>
                </div>
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill" style={{ width: `${uploadProgress}%` }} />
                </div>
              </div>
            )}
          </div>

          {/* Archived Resumes */}
          <div className="resume-card-section">
            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "18px", margin: 0, color: "var(--text-primary)" }}>
              Archived Versions
            </h3>
            <p style={{ fontSize: "12.5px", color: "var(--text-secondary)", margin: 0 }}>
              Prior submissions preserved for academic audit history.
            </p>

            <div className="resume-history-list">
              {archive.map((item) => (
                <div key={item.id} className="resume-history-item">
                  <div>
                    <strong style={{ display: "block", fontSize: "13px", color: "var(--text-primary)" }}>
                      {item.name}
                    </strong>
                    <span style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>
                      {formatBytes(item.size)} · {item.date}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="btn-secondary btn-sm"
                    onClick={handleDownload}
                    title="Download archive copy"
                  >
                    <Download size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Preview Modal */}
        {previewOpen && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(23, 43, 36, 0.5)",
              display: "grid",
              placeItems: "center",
              zIndex: 100,
              padding: "20px",
            }}
            onClick={() => setPreviewOpen(false)}
          >
            <div
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                maxWidth: "600px",
                width: "100%",
                padding: "28px",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "20px", margin: 0, color: "var(--text-primary)" }}>
                  Resume Document Preview
                </h3>
                <button
                  type="button"
                  onClick={() => setPreviewOpen(false)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}
                >
                  <X size={18} />
                </button>
              </div>

              <div
                style={{
                  padding: "24px",
                  background: "var(--surface-secondary)",
                  borderRadius: "6px",
                  border: "1px solid var(--border)",
                  fontSize: "13px",
                  lineHeight: 1.6,
                  color: "var(--text-secondary)",
                  maxHeight: "360px",
                  overflowY: "auto",
                }}
              >
                <div style={{ textAlign: "center", borderBottom: "1px solid var(--border)", paddingBottom: "12px", marginBottom: "12px" }}>
                  <strong style={{ fontSize: "16px", color: "var(--text-primary)" }}>Aryan Sharma</strong>
                  <div style={{ fontSize: "12px" }}>Master of Computer Applications · University College of Engineering</div>
                  <div style={{ fontSize: "12px" }}>aryan.sharma@college.edu · +91 98765 43210</div>
                </div>

                <div style={{ marginBottom: "10px" }}>
                  <strong style={{ color: "var(--text-primary)" }}>Education:</strong>
                  <div>MCA (2024–2027) — CGPA: 8.84 / 10.0</div>
                  <div>Secondary (CBSE): 94.2% · Higher Secondary: 91.8%</div>
                </div>

                <div style={{ marginBottom: "10px" }}>
                  <strong style={{ color: "var(--text-primary)" }}>Technical Skills:</strong>
                  <div>Java, Python, C++, React, Node.js, SQL, Docker, Kubernetes, Linux</div>
                </div>

                <div>
                  <strong style={{ color: "var(--text-primary)" }}>Projects:</strong>
                  <div>Campus Placement Portal (CPRMP) — React, Node.js, MongoDB, JWT</div>
                  <div>Distributed Cache Key-Value Store — Go, Raft Consensus, Docker</div>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
                <button
                  type="button"
                  className="btn-secondary btn-sm"
                  onClick={() => setPreviewOpen(false)}
                >
                  Close Preview
                </button>
                <button
                  type="button"
                  className="btn-primary btn-sm"
                  onClick={handleDownload}
                >
                  <Download size={13} />
                  <span>Download Document</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
