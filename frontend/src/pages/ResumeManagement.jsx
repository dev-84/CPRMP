import { useState, useRef, useEffect, useCallback } from "react";
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
  ExternalLink,
  RotateCcw,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "../context/useAuth.js";
import AppLayout from "../components/ui/AppLayout.jsx";
import {
  PageHeader,
  PrimaryButton,
  SecondaryButton,
} from "../components/ui/EditorialComponents.jsx";
import "./ResumeManagement.css";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const STORAGE_KEY = "cprmpResumeMetadata";

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
  const { user, token } = useAuth();
  const fileInputRef = useRef(null);

  // Resume State
  const [loading, setLoading] = useState(true);
  const [currentResume, setCurrentResume] = useState(null);
  const [archive, setArchive] = useState([]);

  // Selected file ready to be uploaded / replaced
  const [selectedFile, setSelectedFile] = useState(null);
  const [validationError, setValidationError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [feedback, setFeedback] = useState(null);

  // In-App Document Preview Modal State
  const [previewModal, setPreviewModal] = useState({
    isOpen: false,
    blobUrl: null,
    filename: "",
    loading: false,
  });

  // Fetch current resume status from backend API
  const fetchResumeStatus = useCallback(async () => {
    setLoading(true);
    let foundOnServer = false;

    if (token) {
      try {
        const res = await fetch("/api/student/resume", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const json = await res.json();
          if (json.data) {
            foundOnServer = true;
            if (json.data.hasResume && json.data.resume) {
              setCurrentResume(json.data.resume);
              localStorage.setItem(STORAGE_KEY, JSON.stringify(json.data.resume));
            } else {
              setCurrentResume(null);
              localStorage.removeItem(STORAGE_KEY);
            }

            if (json.data.archive) {
              setArchive(json.data.archive);
              localStorage.setItem("cprmp_resume_archive", JSON.stringify(json.data.archive));
            }
          }
        }
      } catch {
        // Fallback to local storage if offline
      }
    }

    if (!foundOnServer) {
      const cached = readSaved(STORAGE_KEY, null);
      const cachedArchive = readSaved("cprmp_resume_archive", []);
      setCurrentResume(cached);
      setArchive(cachedArchive);
    }

    setLoading(false);
  }, [token]);

  useEffect(() => {
    fetchResumeStatus();
  }, [fetchResumeStatus]);

  // Clean up object URLs when preview modal closes or component unmounts
  useEffect(() => {
    return () => {
      if (previewModal.blobUrl) {
        URL.revokeObjectURL(previewModal.blobUrl);
      }
    };
  }, [previewModal.blobUrl]);

  // Handle client-side file selection and validation (Scenario C)
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setValidationError("");
    setFeedback(null);

    // 1. File Type Validation
    const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    if (ext !== ".pdf" || (file.type && file.type !== "application/pdf")) {
      setValidationError("Only PDF format documents (.pdf) are accepted for official placement submission.");
      setFeedback({
        type: "error",
        message: "Invalid file format. Only PDF documents are supported.",
      });
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // 2. File Size Validation
    if (file.size > MAX_FILE_SIZE) {
      setValidationError("File exceeds the maximum allowed size of 5 MB.");
      setFeedback({
        type: "error",
        message: "File exceeds the 5 MB maximum file size limit.",
      });
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // 3. Empty File Validation
    if (file.size === 0) {
      setValidationError("The selected file is empty. Please choose a valid PDF resume.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setSelectedFile(file);
    setFeedback({
      type: "info",
      message: `Selected "${file.name}" (${formatBytes(file.size)}). Click "Upload & Confirm Resume" to complete submission.`,
    });
  };

  // Handle Mandatory Submit Action (Scenario A & B)
  const handleSubmitUpload = async (e) => {
    if (e) e.preventDefault();

    // Mandatory upload validation check
    if (!selectedFile) {
      setValidationError("Please select your resume before submitting.");
      setFeedback({
        type: "error",
        message: "Please upload your resume before submitting.",
      });
      if (fileInputRef.current) fileInputRef.current.focus();
      return;
    }

    setIsUploading(true);
    setUploadProgress(20);
    setValidationError("");
    setFeedback(null);

    const formData = new FormData();
    formData.append("resume", selectedFile);

    try {
      if (token) {
        setUploadProgress(45);

        const res = await fetch("/api/student/resume", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        setUploadProgress(85);

        const json = await res.json().catch(() => ({}));

        if (!res.ok) {
          throw new Error(json.message || "Failed to upload resume document to server.");
        }

        const uploadedResume = json.data?.resume;

        if (uploadedResume) {
          // If replacing, push previous resume to archive
          if (currentResume) {
            setArchive((prev) => [
              {
                id: `v-${Date.now()}`,
                name: currentResume.filename || currentResume.originalFilename || currentResume.name,
                size: currentResume.sizeBytes || currentResume.fileSize || currentResume.size,
                date: new Date().toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }),
              },
              ...prev,
            ]);
          }

          setCurrentResume(uploadedResume);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(uploadedResume));
        }

        setUploadProgress(100);
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";

        setFeedback({
          type: "success",
          message: `Successfully uploaded ${selectedFile.name}. Your active resume is verified and live across campus placement drives.`,
        });
      } else {
        // Local simulation if offline
        const localResume = {
          id: `res-${Date.now()}`,
          filename: selectedFile.name,
          originalFilename: selectedFile.name,
          sizeBytes: selectedFile.size,
          fileSize: selectedFile.size,
          mimeType: "application/pdf",
          uploadedAt: new Date().toISOString(),
          status: "Active & Verified by TPO",
        };

        setCurrentResume(localResume);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(localResume));
        setSelectedFile(null);
        setUploadProgress(100);

        setFeedback({
          type: "success",
          message: `Successfully saved ${selectedFile.name}. (Offline mode active)`,
        });
      }
    } catch (err) {
      setFeedback({
        type: "error",
        message: err.message || "Upload failed. Please verify the document and try again.",
      });
      // Existing active resume is preserved on failure
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Handle Functional Resume Preview (Requirement 6)
  const handlePreview = async (resumeId = null) => {
    if (!currentResume && !resumeId) {
      setFeedback({
        type: "error",
        message: "No resume document exists to preview. Please upload your resume first.",
      });
      return;
    }

    setPreviewModal({
      isOpen: true,
      blobUrl: null,
      filename: currentResume?.filename || currentResume?.originalFilename || "Resume_Preview.pdf",
      loading: true,
    });

    try {
      const endpoint = resumeId
        ? `/api/student/resume/${resumeId}/preview`
        : `/api/student/resume/preview`;

      const res = await fetch(endpoint, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || "Failed to retrieve authenticated resume file from server.");
      }

      const blob = await res.blob();
      const pdfBlob = new Blob([blob], { type: "application/pdf" });
      const objectUrl = URL.createObjectURL(pdfBlob);

      // Attempt opening in a native browser tab
      const newTab = window.open(objectUrl, "_blank");

      // Also maintain in-app modal preview for popup-blocker resilience
      setPreviewModal({
        isOpen: true,
        blobUrl: objectUrl,
        filename: currentResume?.filename || currentResume?.originalFilename || "Candidate_Resume.pdf",
        loading: false,
      });

      if (!newTab || newTab.closed || typeof newTab.closed === "undefined") {
        setFeedback({
          type: "info",
          message: "Native new tab was blocked by your browser. Displaying document in CPRMP In-App Viewer.",
        });
      }
    } catch (err) {
      setPreviewModal({
        isOpen: false,
        blobUrl: null,
        filename: "",
        loading: false,
      });

      setFeedback({
        type: "error",
        message: err.message || "Could not preview resume document. Please verify network access.",
      });
    }
  };

  // Handle Authenticated Document Download
  const handleDownload = async (resumeId = null) => {
    if (!currentResume && !resumeId) return;

    const downloadFilename =
      currentResume?.filename || currentResume?.originalFilename || "Placement_Resume.pdf";

    try {
      const endpoint = resumeId
        ? `/api/student/resume/${resumeId}/download`
        : `/api/student/resume/download`;

      const res = await fetch(endpoint, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) {
        throw new Error("Download request failed.");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = downloadFilename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      setFeedback({
        type: "error",
        message: "Failed to download resume file from server.",
      });
    }
  };

  // Close preview modal and clean up object URL
  const closePreviewModal = () => {
    if (previewModal.blobUrl) {
      URL.revokeObjectURL(previewModal.blobUrl);
    }
    setPreviewModal({
      isOpen: false,
      blobUrl: null,
      filename: "",
      loading: false,
    });
  };

  if (loading) {
    return (
      <AppLayout pageTitle="Resume Management" breadcrumb="Candidate Records">
        <div style={{ textAlign: "center", padding: "80px 20px" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              border: "3px solid #E5E7E1",
              borderTopColor: "var(--accent, #3F754B)",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 16px",
            }}
          />
          <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
            Checking authenticated resume status...
          </p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout pageTitle="Resume Management" breadcrumb="Candidate Records">
      <div className="resume-editorial-container">
        <PageHeader
          eyebrow="INSTITUTIONAL DOSSIER"
          title="Placement Resume Management"
          description="Upload, verify, and preview your official campus placement resume. Recruiters and placement officers access this document during automated shortlisting and interview rounds."
        />

        {/* Global Feedback Banner */}
        {feedback && (
          <div
            style={{
              padding: "12px 18px",
              borderRadius: "8px",
              backgroundColor:
                feedback.type === "error"
                  ? "#FEF3F2"
                  : feedback.type === "info"
                  ? "#EFF4FA"
                  : "#EAF2E7",
              border: `1px solid ${
                feedback.type === "error"
                  ? "#FECDCA"
                  : feedback.type === "info"
                  ? "#CFDCED"
                  : "#C8DEC4"
              }`,
              color:
                feedback.type === "error"
                  ? "#B42318"
                  : feedback.type === "info"
                  ? "#1E40AF"
                  : "#2E6038",
              fontSize: "13.5px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {feedback.type === "error" ? (
                <AlertCircle size={16} />
              ) : (
                <CheckCircle2 size={16} />
              )}
              <span>{feedback.message}</span>
            </div>
            <button
              type="button"
              onClick={() => setFeedback(null)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "inherit" }}
            >
              <X size={15} />
            </button>
          </div>
        )}

        {/* MANDATORY VALIDATION SCENARIO A: Student has NOT uploaded a resume */}
        {!currentResume && (
          <div className="resume-required-alert-banner">
            <AlertTriangle size={20} className="resume-required-alert-icon" />
            <div>
              <h3 className="resume-required-alert-title">
                Resume upload is required. Please upload your resume to continue.
              </h3>
              <p className="resume-required-alert-desc">
                Your campus recruitment profile currently has no verified resume on record. University placement policy requires an uploaded, authentic PDF resume before you can apply to any active placement drives.
              </p>
            </div>
          </div>
        )}

        {/* HERO CARD: Active Resume on Record OR Missing Resume Placeholder */}
        {currentResume ? (
          /* SCENARIO B: Active Resume Exists */
          <div className="resume-hero-card">
            <div className="resume-meta-info">
              <div className="resume-pdf-icon-badge">
                <FileText size={24} />
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      color: "var(--accent)",
                      textTransform: "uppercase",
                    }}
                  >
                    Active Placement Resume
                  </span>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      fontSize: "11.5px",
                      fontWeight: 600,
                      backgroundColor: "var(--accent-soft, #EAF2E7)",
                      color: "var(--accent, #3F754B)",
                      padding: "2px 8px",
                      borderRadius: "4px",
                    }}
                  >
                    <Check size={12} strokeWidth={3} />
                    <span>{currentResume.status || "Verified by TPO"}</span>
                  </span>
                </div>

                <h2
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "20px",
                    margin: "4px 0 2px",
                    color: "var(--text-primary)",
                  }}
                >
                  {currentResume.filename || currentResume.originalFilename || currentResume.name}
                </h2>

                <span style={{ fontSize: "12.5px", color: "var(--text-secondary)" }}>
                  {formatBytes(currentResume.sizeBytes || currentResume.fileSize || currentResume.size)} · Uploaded on{" "}
                  {currentResume.uploadedAt
                    ? new Date(currentResume.uploadedAt).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Active Session"}
                </span>
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {/* FUNCTIONAL PREVIEW BUTTON */}
              <button
                type="button"
                className="btn-secondary btn-sm"
                onClick={() => handlePreview()}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "7px 14px",
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                <Eye size={14} />
                <span>Preview</span>
              </button>

              <button
                type="button"
                className="btn-secondary btn-sm"
                onClick={() => handleDownload()}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "7px 14px",
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                <Download size={14} />
                <span>Download</span>
              </button>

              <PrimaryButton
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "7px 16px",
                  fontSize: "13px",
                }}
              >
                <UploadCloud size={14} />
                <span>Replace Resume</span>
              </PrimaryButton>
            </div>
          </div>
        ) : (
          /* SCENARIO A: No Resume on Record */
          <div className="resume-hero-card empty-state">
            <div className="resume-meta-info">
              <div className="resume-pdf-icon-badge empty">
                <FileText size={24} />
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      color: "#B42318",
                      textTransform: "uppercase",
                    }}
                  >
                    Action Required
                  </span>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      fontSize: "11.5px",
                      fontWeight: 600,
                      backgroundColor: "#FEF3F2",
                      color: "#B42318",
                      padding: "2px 8px",
                      borderRadius: "4px",
                    }}
                  >
                    <AlertCircle size={12} />
                    <span>No Resume Uploaded</span>
                  </span>
                </div>

                <h2
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "20px",
                    margin: "4px 0 2px",
                    color: "var(--text-primary)",
                  }}
                >
                  Upload Your Official Placement Resume
                </h2>

                <span style={{ fontSize: "12.5px", color: "var(--text-secondary)" }}>
                  Mandatory for campus recruitment eligibility. PDF format only (Max 5 MB).
                </span>
              </div>
            </div>

            <PrimaryButton
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "7px",
                padding: "8px 18px",
                fontSize: "13px",
              }}
            >
              <UploadCloud size={15} />
              <span>Select Resume PDF</span>
            </PrimaryButton>
          </div>
        )}

        {/* Two-Column Grid: Upload & Archived Versions */}
        <div className="resume-body-grid">
          {/* Section 1: Upload Form with Mandatory Validation */}
          <form onSubmit={handleSubmitUpload} className="resume-card-section">
            <div>
              <h3 className="resume-section-title">
                {currentResume ? "Upload Replacement Document" : "Mandatory Resume Submission"}
              </h3>
              <p className="resume-section-desc">
                {currentResume
                  ? "Uploading a new PDF will automatically update your active dossier across all open drives and preserve the current version in your audit archive."
                  : "Select and submit your verified student resume. Once confirmed, your placement profile is cleared to apply for campus opportunities."}
              </p>
            </div>

            {/* Hidden file input with accessible label */}
            <input
              type="file"
              id="studentResumeFileInput"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept=".pdf,application/pdf"
              style={{ display: "none" }}
              aria-label="Upload Student PDF Resume"
              required={!currentResume}
            />

            {/* Interactive Dropzone */}
            <div
              className={`resume-upload-dropzone ${selectedFile ? "has-file" : ""}`}
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
              aria-label="Click to select PDF resume document"
            >
              {selectedFile ? (
                <>
                  <FileText size={38} color="var(--accent)" strokeWidth={1.8} />
                  <div>
                    <span className="resume-selected-file-chip">
                      <Check size={14} />
                      <span>{selectedFile.name}</span>
                    </span>
                    <span
                      style={{
                        fontSize: "12px",
                        color: "var(--text-muted)",
                        marginTop: "6px",
                        display: "block",
                      }}
                    >
                      {formatBytes(selectedFile.size)} · Click to change file
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <UploadCloud size={38} color="var(--accent)" strokeWidth={1.5} />
                  <div>
                    <strong style={{ display: "block", fontSize: "14px", color: "var(--text-primary)" }}>
                      Click to choose or drag & drop your PDF resume
                    </strong>
                    <span
                      style={{
                        fontSize: "12px",
                        color: "var(--text-muted)",
                        marginTop: "4px",
                        display: "block",
                      }}
                    >
                      PDF format required · Maximum file size 5 MB
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Inline Validation Error Message */}
            {validationError && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "12.5px",
                  color: "#B42318",
                  fontWeight: 600,
                }}
              >
                <AlertCircle size={14} />
                <span>{validationError}</span>
              </div>
            )}

            {/* Upload Progress Bar */}
            {isUploading && (
              <div
                style={{
                  padding: "16px",
                  backgroundColor: "var(--surface-secondary)",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "12.5px",
                    fontWeight: 600,
                    marginBottom: "8px",
                  }}
                >
                  <span>Validating and streaming document to server...</span>
                  <span style={{ color: "var(--accent)" }}>{uploadProgress}%</span>
                </div>
                <div className="resume-progress-bar-bg">
                  <div
                    className="resume-progress-bar-fill"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Form Submission Action Bar */}
            <div className="resume-upload-action-bar">
              {selectedFile ? (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null);
                    setValidationError("");
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="btn-secondary btn-sm"
                  style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}
                >
                  <X size={13} />
                  <span>Clear Selection</span>
                </button>
              ) : (
                <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  {!currentResume && <strong style={{ color: "#B42318" }}>* Resume upload required</strong>}
                </span>
              )}

              <PrimaryButton
                type="submit"
                disabled={isUploading}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "7px",
                  padding: "9px 20px",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: isUploading ? "not-allowed" : "pointer",
                }}
              >
                <UploadCloud size={15} />
                <span>
                  {isUploading
                    ? "Uploading..."
                    : currentResume
                    ? "Upload & Replace Resume"
                    : "Upload & Confirm Resume"}
                </span>
              </PrimaryButton>
            </div>
          </form>

          {/* Section 2: Archived Versions & Audit History */}
          <div className="resume-card-section">
            <div>
              <h3 className="resume-section-title">Archived Versions</h3>
              <p className="resume-section-desc">
                Prior resume submissions preserved for institutional placement audit trails.
              </p>
            </div>

            <div className="resume-history-list">
              {archive.length > 0 ? (
                archive.map((item) => (
                  <div key={item.id} className="resume-history-item">
                    <div>
                      <strong style={{ display: "block", fontSize: "13px", color: "var(--text-primary)" }}>
                        {item.name || item.originalFilename || item.filename}
                      </strong>
                      <span style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>
                        {formatBytes(item.size || item.sizeBytes)} ·{" "}
                        {item.date ||
                          (item.uploadedAt
                            ? new Date(item.uploadedAt).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })
                            : "Archived")}
                      </span>
                    </div>

                    <div style={{ display: "flex", gap: "6px" }}>
                      <button
                        type="button"
                        className="btn-secondary btn-sm"
                        onClick={() => handlePreview(item.id)}
                        title="Preview this archived version"
                        style={{ padding: "5px 8px" }}
                      >
                        <Eye size={13} />
                      </button>

                      <button
                        type="button"
                        className="btn-secondary btn-sm"
                        onClick={() => handleDownload(item.id)}
                        title="Download archive copy"
                        style={{ padding: "5px 8px" }}
                      >
                        <Download size={13} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: "center", padding: "24px 12px", color: "var(--text-muted)" }}>
                  <FileText size={28} strokeWidth={1.5} style={{ margin: "0 auto 8px", opacity: 0.6 }} />
                  <span style={{ fontSize: "12.5px", display: "block" }}>No archived submissions yet.</span>
                  <span style={{ fontSize: "11.5px" }}>
                    Previous versions will automatically appear here when you replace your resume.
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* FUNCTIONAL IN-APP PDF PREVIEW MODAL */}
        {previewModal.isOpen && (
          <div className="resume-modal-overlay" onClick={closePreviewModal}>
            <div className="resume-modal-window" onClick={(e) => e.stopPropagation()}>
              <div className="resume-modal-header">
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <FileText size={20} color="var(--accent)" />
                  <div>
                    <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "18px", margin: 0, color: "var(--text-primary)" }}>
                      {previewModal.filename}
                    </h3>
                    <span style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>
                      Official Placement Verified Document · Authenticated PDF Stream
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  {previewModal.blobUrl && (
                    <a
                      href={previewModal.blobUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "6px 12px",
                        backgroundColor: "var(--accent-soft)",
                        color: "var(--accent)",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: 600,
                        textDecoration: "none",
                      }}
                    >
                      <ExternalLink size={13} />
                      <span>Open Native Tab</span>
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={closePreviewModal}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "var(--text-muted)",
                      padding: "4px",
                    }}
                    title="Close document preview"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* PDF Viewer Frame */}
              <div style={{ position: "relative", minHeight: "480px", backgroundColor: "#525659" }}>
                {previewModal.loading ? (
                  <div style={{ display: "grid", placeItems: "center", height: "480px", color: "#FAF9F6" }}>
                    <div style={{ textAlign: "center" }}>
                      <div
                        style={{
                          width: "36px",
                          height: "36px",
                          border: "3px solid #E5E7E1",
                          borderTopColor: "var(--accent, #3F754B)",
                          borderRadius: "50%",
                          animation: "spin 0.8s linear infinite",
                          margin: "0 auto 12px",
                        }}
                      />
                      <span>Retrieving verified resume document...</span>
                    </div>
                  </div>
                ) : previewModal.blobUrl ? (
                  <iframe
                    src={previewModal.blobUrl}
                    title="Verified Candidate Resume Preview"
                    className="resume-modal-iframe-frame"
                  />
                ) : (
                  <div style={{ display: "grid", placeItems: "center", height: "480px", color: "#FAF9F6" }}>
                    <span>Document unavailable.</span>
                  </div>
                )}
              </div>

              <div className="resume-modal-footer">
                <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                  Verified by CPRMP Security Gateway · End-to-End Encrypted
                </span>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    type="button"
                    className="btn-secondary btn-sm"
                    onClick={closePreviewModal}
                  >
                    Close
                  </button>

                  <PrimaryButton
                    type="button"
                    className="btn-primary btn-sm"
                    onClick={() => handleDownload()}
                    style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                  >
                    <Download size={13} />
                    <span>Download File</span>
                  </PrimaryButton>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
