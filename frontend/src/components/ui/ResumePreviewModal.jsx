import React, { useState, useEffect } from "react";
import { X, Download, FileText, ExternalLink, AlertCircle, Loader2 } from "lucide-react";

export default function ResumePreviewModal({ isOpen, onClose, resumeId, candidateName }) {
  const [blobUrl, setBlobUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen || !resumeId) {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
        setBlobUrl(null);
      }
      setError(null);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token");
    fetch(`/api/resumes/${resumeId}/preview`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(async (res) => {
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || `Failed to fetch resume (${res.status})`);
        }
        return res.blob();
      })
      .then((blob) => {
        if (isMounted) {
          const url = URL.createObjectURL(blob);
          setBlobUrl(url);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || "Failed to load resume preview.");
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [isOpen, resumeId]);

  if (!isOpen) return null;

  const handleDownload = () => {
    if (!resumeId) return;
    const token = localStorage.getItem("token");
    fetch(`/api/resumes/${resumeId}/download`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((res) => {
        if (!res.ok) throw new Error("Download failed");
        return res.blob();
      })
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${candidateName || "Candidate"}_Resume.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      })
      .catch((err) => alert(err.message || "Could not download resume"));
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15, 23, 42, 0.65)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "16px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "850px",
          height: "90vh",
          backgroundColor: "#FFFFFF",
          borderRadius: "12px",
          border: "1px solid #E5E7E1",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 24px",
            borderBottom: "1px solid #E5E7E1",
            backgroundColor: "#FAF9F6",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <FileText size={20} color="#3F754B" />
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "#172B24",
                }}
              >
                Resume Preview — {candidateName || "Candidate"}
              </h2>
              <span style={{ fontSize: "12px", color: "#68766D" }}>
                Official Verified Student Document
              </span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {blobUrl && (
              <>
                <button
                  type="button"
                  onClick={handleDownload}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "6px 12px",
                    fontSize: "13px",
                    fontWeight: "500",
                    color: "#3F754B",
                    backgroundColor: "#EAF2E7",
                    border: "1px solid #3F754B",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  <Download size={14} />
                  Download
                </button>
                <a
                  href={blobUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "6px 12px",
                    fontSize: "13px",
                    fontWeight: "500",
                    color: "#172B24",
                    backgroundColor: "#F3F4EF",
                    border: "1px solid #E5E7E1",
                    borderRadius: "6px",
                    textDecoration: "none",
                  }}
                >
                  <ExternalLink size={14} />
                  Full Tab
                </a>
              </>
            )}
            <button
              type="button"
              onClick={onClose}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "6px",
                borderRadius: "6px",
                color: "#68766D",
                display: "grid",
                placeItems: "center",
              }}
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div style={{ flex: 1, backgroundColor: "#F8FAFC", position: "relative" }}>
          {loading && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                color: "#68766D",
              }}
            >
              <Loader2 size={32} className="animate-spin" color="#3F754B" />
              <p style={{ fontSize: "14px" }}>Retrieving authorized resume document...</p>
            </div>
          )}

          {error && (
            <div
              style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                padding: "24px",
                textAlign: "center",
              }}
            >
              <AlertCircle size={40} color="#B93838" />
              <h3 style={{ margin: 0, fontSize: "16px", color: "#172B24" }}>
                Unable to Display Resume
              </h3>
              <p style={{ margin: 0, fontSize: "14px", color: "#68766D", maxWidth: "400px" }}>
                {error}
              </p>
              <button
                type="button"
                onClick={onClose}
                style={{
                  marginTop: "8px",
                  padding: "8px 16px",
                  backgroundColor: "#3F754B",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: "500",
                }}
              >
                Close Window
              </button>
            </div>
          )}

          {!loading && !error && blobUrl && (
            <iframe
              src={blobUrl}
              title={`Resume of ${candidateName}`}
              style={{
                width: "100%",
                height: "100%",
                border: "none",
              }}
            />
          )}

          {!loading && !error && !blobUrl && !resumeId && (
            <div
              style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                color: "#68766D",
              }}
            >
              <FileText size={36} color="#8A948C" />
              <p style={{ fontSize: "14px" }}>No resume attachment available for this candidate.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
