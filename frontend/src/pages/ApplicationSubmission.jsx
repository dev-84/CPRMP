import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, ShieldCheck, FileText, Check, AlertCircle } from "lucide-react";
import AppLayout from "../components/ui/AppLayout.jsx";
import {
  PageHeader,
  PrimaryButton,
  SecondaryButton,
} from "../components/ui/EditorialComponents.jsx";

export default function ApplicationSubmission() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [declarations, setDeclarations] = useState([true, true, true]);
  const [notice, setNotice] = useState("");

  const allAccepted = declarations.every(Boolean);

  const toggleDeclaration = (index) => {
    setDeclarations((prev) => prev.map((val, i) => (i === index ? !val : val)));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!allAccepted) {
      setNotice("Please accept all institutional declarations before proceeding.");
      return;
    }
    navigate("/student/application-submitted");
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
          description="Review your active credentials, institutional declarations, and confirm submission of your candidacy."
        />

        {notice && (
          <div
            style={{
              padding: "12px 18px",
              borderRadius: "6px",
              backgroundColor: "var(--error-soft)",
              border: "1px solid #f5c2c2",
              color: "var(--error)",
              fontSize: "13.5px",
            }}
          >
            {notice}
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
            <PrimaryButton type="submit" disabled={!allAccepted}>
              Confirm & Submit Candidacy
            </PrimaryButton>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}