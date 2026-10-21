import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Calendar,
  Building2,
  FileCheck,
  ShieldCheck,
  Check,
} from "lucide-react";
import AppLayout from "../components/ui/AppLayout.jsx";
import {
  ApplicationStatusBadge,
  CompanyLogo,
} from "../components/ui/EditorialComponents.jsx";
import "./ApplicationTracking.css";

const STAGES = [
  {
    number: 1,
    title: "Application Submitted & Institutional Verification",
    status: "completed",
    description: "Eligibility criteria audited against university registrar records. Academic transcripts and active backlogs verified.",
    date: "26 Oct 2026, 14:32 IST",
    reference: "TPO Clearance Reg: #VERIF-MCA-8849",
  },
  {
    number: 2,
    title: "Recruiter Screening & ATS Dossier Review",
    status: "completed",
    description: "The Talent Acquisition team has evaluated the submitted profile against technical prerequisites.",
    date: "29 Oct 2026, 11:20 IST",
    reference: "Shortlist Queue Evaluation Passed",
  },
  {
    number: 3,
    title: "Online Cognitive & Technical Assessment",
    status: "current",
    description: "90-minute proctored programming assessment covering algorithms, system design, and database queries.",
    date: "Scheduled: 02 Nov 2026, 10:00 AM IST",
    reference: "Assessment Platform: Codility Core",
  },
  {
    number: 4,
    title: "Technical Interview — Architecture & Problem Solving",
    status: "upcoming",
    description: "Live interactive whiteboard session with Senior Engineering Leads.",
    date: "Tentative: 06–07 Nov 2026",
    reference: "Virtual via Microsoft Teams",
  },
  {
    number: 5,
    title: "Final Techno-Managerial Review & Offer Letter",
    status: "upcoming",
    description: "Leadership fit assessment, compensation overview, and formal LOI issuance.",
    date: "Tentative: 10 Nov 2026",
    reference: "Final institutional stage",
  },
];

const AUDIT_EVENTS = [
  {
    timestamp: "26 Oct 2026 15:10:00",
    title: "TPO Institutional Clearance Approved",
    description: "University Placement Officer validated active registration and verified credentials.",
  },
  {
    timestamp: "26 Oct 2026 14:32:15",
    title: "Automated CGPA & Backlog Verification",
    description: "Candidate CGPA 8.84 satisfies the drive minimum threshold of 8.00.",
  },
  {
    timestamp: "26 Oct 2026 14:32:04",
    title: "Application Docket Created",
    description: "Official campus placement docket submitted for recruitment review.",
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

export default function ApplicationTracking() {
  const { id } = useParams();

  const applications = useMemo(() => {
    return readSaved("cprmp_applications", []);
  }, []);

  const application = useMemo(() => {
    return (
      applications.find((a) => a.id === id || a.driveId === id) || {
        company: "Microsoft IDC",
        role: "Software Engineer — Cloud & AI Infrastructure",
        appliedDate: "26 Oct 2026",
        status: "Shortlisted",
      }
    );
  }, [applications, id]);

  return (
    <AppLayout pageTitle="Application Progression" breadcrumb="My Applications">
      <div className="tracking-editorial-layout">
        <Link
          to="/student/applications"
          className="section-action-link"
          style={{ alignSelf: "flex-start", marginBottom: "-12px" }}
        >
          <ArrowLeft size={14} />
          <span>Back to Applications</span>
        </Link>

        {/* Hero Card */}
        <div className="tracking-hero-card">
          <div className="tracking-header-row">
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <CompanyLogo name={application.company} />
              <div>
                <div style={{ fontSize: "13.5px", color: "var(--text-secondary)", fontWeight: 600 }}>
                  {application.company} · Application Docket #{id || "APP-8849"}
                </div>
                <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "26px", margin: "4px 0 0", color: "var(--text-primary)" }}>
                  {application.role}
                </h1>
              </div>
            </div>

            <div>
              <ApplicationStatusBadge status={application.status || "Shortlisted"} />
            </div>
          </div>

          <div className="tracking-meta-grid">
            <div>
              <span style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>
                Submission Date
              </span>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", marginTop: "4px" }}>
                {application.appliedDate || "26 Oct 2026"}
              </div>
            </div>
            <div>
              <span style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>
                Verification Standing
              </span>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--success)", marginTop: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
                <Check size={14} />
                <span>Verified by TPO</span>
              </div>
            </div>
            <div>
              <span style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>
                Next Critical Milestone
              </span>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", marginTop: "4px" }}>
                Codility Coding Assessment (02 Nov)
              </div>
            </div>
          </div>
        </div>

        {/* Two-Column Tracking Body */}
        <div className="tracking-body-grid">
          {/* Progression Timeline */}
          <div className="tracking-stages-card">
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "20px", margin: "0 0 24px", color: "var(--text-primary)" }}>
              Recruitment Evaluation Stages
            </h2>

            <div>
              {STAGES.map((stage) => {
                const isCompleted = stage.status === "completed";
                const isCurrent = stage.status === "current";

                return (
                  <div key={stage.number} className="tracking-stage-item">
                    <div
                      className={`stage-bullet ${isCompleted ? "completed" : ""} ${
                        isCurrent ? "current" : ""
                      }`}
                    >
                      {isCompleted ? <Check size={16} /> : stage.number}
                    </div>

                    <div className="stage-details-content">
                      <div className="stage-title-row">
                        <span className="stage-name">{stage.title}</span>
                        <span
                          style={{
                            fontSize: "11.5px",
                            fontWeight: 600,
                            color: isCompleted ? "var(--success)" : isCurrent ? "var(--accent)" : "var(--text-muted)",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                          }}
                        >
                          {stage.status}
                        </span>
                      </div>

                      <p className="stage-desc">{stage.description}</p>

                      <div className="stage-footer-meta">
                        <span>{stage.date}</span>
                        <span>·</span>
                        <span>{stage.reference}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Audit Verification Trail */}
          <div className="audit-events-card">
            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "18px", margin: "0 0 16px", color: "var(--text-primary)" }}>
              Institutional Audit Trail
            </h3>
            <p style={{ fontSize: "12.5px", color: "var(--text-secondary)", margin: "0 0 16px", lineHeight: 1.5 }}>
              Immutable audit entries created by the college placement office.
            </p>

            <div>
              {AUDIT_EVENTS.map((event, idx) => (
                <div key={idx} className="audit-event-item">
                  <div className="audit-timestamp">{event.timestamp}</div>
                  <div className="audit-title">{event.title}</div>
                  <div className="audit-desc">{event.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
