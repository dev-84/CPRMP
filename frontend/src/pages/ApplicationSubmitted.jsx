import { Link } from "react-router-dom";
import { CheckCircle2, FileText, ArrowRight, Briefcase } from "lucide-react";
import AppLayout from "../components/ui/AppLayout.jsx";
import {
  PageHeader,
  PrimaryButton,
  SecondaryButton,
} from "../components/ui/EditorialComponents.jsx";

export default function ApplicationSubmitted() {
  return (
    <AppLayout pageTitle="Application Submitted" breadcrumb="Confirmation">
      <div style={{ maxWidth: "680px", margin: "40px auto", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "24px" }}>
        <div style={{ width: "64px", height: "64px", borderRadius: "50%", backgroundColor: "var(--success-soft)", display: "grid", placeItems: "center", color: "var(--success)" }}>
          <CheckCircle2 size={36} />
        </div>

        <div>
          <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent)" }}>
            TRANSMISSION ATTESTED
          </span>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "32px", margin: "8px 0 12px", color: "var(--text-primary)" }}>
            Application Successfully Submitted
          </h1>
          <p style={{ fontSize: "14.5px", color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
            Your candidacy has been officially transmitted to the corporate recruiter and sealed in the university placement ledger.
          </p>
        </div>

        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "8px", padding: "24px", width: "100%", textAlign: "left", display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
            <span style={{ color: "var(--text-muted)" }}>Placement Cycle:</span>
            <strong style={{ color: "var(--text-primary)" }}>Academic Year 2026–2027</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
            <span style={{ color: "var(--text-muted)" }}>Eligibility Standing:</span>
            <strong style={{ color: "var(--success)" }}>Verified by University Registrar</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
            <span style={{ color: "var(--text-muted)" }}>Next Milestone:</span>
            <strong style={{ color: "var(--text-primary)" }}>Recruiter Resume & ATS Evaluation</strong>
          </div>
        </div>

        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <Link to="/student/applications" className="btn-primary">
            <span>View in My Applications</span>
            <ArrowRight size={14} />
          </Link>
          <Link to="/student/placement-drives" className="btn-secondary">
            <span>Browse Other Drives</span>
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}
