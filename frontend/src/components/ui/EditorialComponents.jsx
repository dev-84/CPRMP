import { Link } from "react-router-dom";
import {
  Building2,
  Calendar,
  MapPin,
  DollarSign,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  XCircle,
  HelpCircle,
  Search,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import "./EditorialComponents.css";

/* 1. Page Header */
export function PageHeader({ eyebrow, title, description, actions, children }) {
  return (
    <div className="editorial-page-header">
      <div>
        {eyebrow && <div className="page-header-eyebrow">{eyebrow}</div>}
        <h1 className="page-header-title">{title}</h1>
        {description && <p className="page-header-description">{description}</p>}
        {children}
      </div>
      {actions && <div className="page-header-actions">{actions}</div>}
    </div>
  );
}

/* 2. Section Header */
export function SectionHeader({ title, subtitle, actionText, actionLink, onAction }) {
  return (
    <div className="editorial-section-header">
      <div>
        <h2 className="section-title">{title}</h2>
        {subtitle && <p className="section-subtitle">{subtitle}</p>}
      </div>
      {actionText && (
        actionLink ? (
          <Link to={actionLink} className="section-action-link">
            <span>{actionText}</span>
            <ChevronRight size={14} />
          </Link>
        ) : (
          <button type="button" onClick={onAction} className="section-action-link" style={{ background: "none", border: "none", cursor: "pointer" }}>
            <span>{actionText}</span>
            <ChevronRight size={14} />
          </button>
        )
      )}
    </div>
  );
}

/* 3. Metric Row & Metric Items */
export function MetricRow({ children }) {
  return <div className="editorial-metric-row">{children}</div>;
}

export function MetricItem({ label, value, detail, icon: IconComponent }) {
  return (
    <div className="editorial-metric-item">
      <div className="metric-item-top">
        <span className="metric-label">{label}</span>
        {IconComponent && (
          <span className="metric-icon-wrap">
            <IconComponent size={16} strokeWidth={1.8} />
          </span>
        )}
      </div>
      <div>
        <div className="metric-value">{value}</div>
        {detail && <div className="metric-secondary-info">{detail}</div>}
      </div>
    </div>
  );
}

/* 4. Company Logo */
export function CompanyLogo({ name, logo }) {
  const initial = (logo || name || "C").charAt(0).toUpperCase();
  return (
    <div className="company-logo-badge" title={name} aria-hidden="true">
      {initial}
    </div>
  );
}

/* 5. Application Status Badge */
export function ApplicationStatusBadge({ status }) {
  const norm = String(status || "").toLowerCase();

  let badgeType = "neutral";
  let Icon = HelpCircle;

  if (norm.includes("select") || norm.includes("offer") || norm.includes("accepted")) {
    badgeType = "success";
    Icon = CheckCircle2;
  } else if (norm.includes("shortlist") || norm.includes("eligible")) {
    badgeType = "accent";
    Icon = CheckCircle2;
  } else if (norm.includes("review") || norm.includes("progress") || norm.includes("pending")) {
    badgeType = "warning";
    Icon = Clock;
  } else if (norm.includes("interview") || norm.includes("assessment")) {
    badgeType = "info";
    Icon = Calendar;
  } else if (norm.includes("reject") || norm.includes("withdrawn") || norm.includes("closed") || norm.includes("superseded")) {
    badgeType = "neutral";
    Icon = XCircle;
  }

  return (
    <span className={`editorial-badge badge-${badgeType}`}>
      <span className="badge-dot" />
      <span>{status}</span>
    </span>
  );
}

/* 6. Placement Drive Card */
export function PlacementDriveCard({
  drive,
  onApply,
  onViewDetails,
  hasApplied = false,
  isEligible = true,
}) {
  const driveId = drive.id || drive._id;
  const company = drive.company || drive.companyName || "Organization";
  const role = drive.role || drive.jobTitle || drive.title || "Software Engineer";
  const location = drive.location || "On Campus / Hybrid";
  const ctc = drive.ctc || drive.salary || (drive.package ? `₹${drive.package} LPA` : "Standard Tier");
  const deadline = drive.deadline || "Open until filled";
  const skills = drive.skills || ["Computer Science", "Algorithms", "Problem Solving"];

  return (
    <div className="editorial-drive-card">
      <div>
        <div className="drive-card-header">
          <CompanyLogo name={company} logo={drive.logo} />
          <div className="drive-card-title-group">
            <div className="drive-card-company">{company}</div>
            <h3 className="drive-card-role">{role}</h3>
          </div>
          <ApplicationStatusBadge status={hasApplied ? "Applied" : (drive.status || (isEligible ? "Eligible" : "Not Eligible"))} />
        </div>

        <div className="drive-card-meta">
          <div className="meta-item">
            <DollarSign size={13} color="var(--accent)" />
            <span>CTC: <strong>{ctc}</strong></span>
          </div>
          <div className="meta-item">
            <MapPin size={13} color="var(--text-muted)" />
            <span>{location}</span>
          </div>
          <div className="meta-item">
            <Calendar size={13} color="var(--text-muted)" />
            <span>Deadline: {deadline}</span>
          </div>
        </div>

        {Array.isArray(skills) && skills.length > 0 && (
          <div className="drive-card-skills">
            {skills.slice(0, 4).map((skill, index) => (
              <span key={index} className="skill-tag">
                {skill}
              </span>
            ))}
            {skills.length > 4 && (
              <span className="skill-tag">+{skills.length - 4} more</span>
            )}
          </div>
        )}
      </div>

      <div className="drive-card-footer">
        <Link
          to={`/student/drive-details/${driveId}`}
          className="btn-secondary btn-sm"
          onClick={() => onViewDetails && onViewDetails(drive)}
        >
          View Details
        </Link>

        {hasApplied ? (
          <span style={{ fontSize: "12px", color: "var(--accent)", fontWeight: 600 }}>
            Application Submitted
          </span>
        ) : (
          <button
            type="button"
            className="btn-primary btn-sm"
            onClick={() => onApply && onApply(drive)}
            disabled={!isEligible}
          >
            Apply Now
          </button>
        )}
      </div>
    </div>
  );
}

/* 7. Profile Completion Widget */
export function ProfileCompletion({
  percentage = 85,
  name = "Candidate",
  course = "MCA",
  college = "Campus Directorate",
  onComplete,
}) {
  return (
    <div className="editorial-profile-widget">
      <div className="widget-progress-track">
        <div className="widget-progress-header">
          <span className="widget-progress-title">Profile Strength & Readiness</span>
          <span className="widget-progress-pct">{percentage}% Complete</span>
        </div>
        <div className="progress-bar-bg">
          <div
            className="progress-bar-fill"
            style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
          />
        </div>
        <div className="widget-note">
          Keep your academic transcripts, CGPA, and resume up-to-date to ensure automated eligibility verification.
        </div>
      </div>

      <Link
        to="/student/edit-profile"
        className="btn-secondary btn-sm"
        style={{ flexShrink: 0 }}
      >
        Complete Profile
      </Link>
    </div>
  );
}

/* 8. Search Input */
export function SearchInput({ value, onChange, placeholder = "Search..." }) {
  return (
    <div style={{ position: "relative", minWidth: "240px" }}>
      <Search
        size={14}
        style={{
          position: "absolute",
          left: "10px",
          top: "50%",
          transform: "translateY(-50%)",
          color: "var(--text-muted)",
        }}
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="field-input"
        style={{ paddingLeft: "32px", width: "100%", fontSize: "13px" }}
      />
    </div>
  );
}

/* 9. Filter Bar */
export function FilterBar({ filters, activeFilter, onSelect, rightElement }) {
  return (
    <div className="editorial-filter-bar">
      <div className="filter-tags-group">
        {filters.map((filter) => (
          <button
            key={filter.id || filter}
            type="button"
            className={`filter-tag-btn ${
              (filter.id || filter) === activeFilter ? "active" : ""
            }`}
            onClick={() => onSelect(filter.id || filter)}
          >
            {filter.label || filter}
          </button>
        ))}
      </div>
      {rightElement && <div>{rightElement}</div>}
    </div>
  );
}

/* 10. Data Table */
export function DataTable({ headers, children }) {
  return (
    <div className="editorial-table-container">
      <table className="editorial-table">
        <thead>
          <tr>
            {headers.map((head, i) => (
              <th key={i}>{head}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

/* 11. Empty State */
export function EmptyState({ title = "No records found", description = "There are currently no items matching your criteria.", action }) {
  return (
    <div className="editorial-state-box">
      <Building2 size={32} className="state-icon" strokeWidth={1.5} />
      <h3 className="state-title">{title}</h3>
      <p className="state-description">{description}</p>
      {action && <div style={{ marginTop: "12px" }}>{action}</div>}
    </div>
  );
}

/* 12. Loading State */
export function LoadingState({ message = "Loading placement records..." }) {
  return (
    <div className="editorial-state-box">
      <div style={{ width: "24px", height: "24px", border: "2px solid var(--border)", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <p className="state-description" style={{ marginTop: "8px" }}>{message}</p>
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/* 13. Error State */
export function ErrorState({ title = "Something went wrong", description, onRetry }) {
  return (
    <div className="editorial-state-box" style={{ borderColor: "#f7caca" }}>
      <AlertCircle size={32} style={{ color: "var(--error)" }} strokeWidth={1.5} />
      <h3 className="state-title" style={{ color: "var(--error)" }}>{title}</h3>
      {description && <p className="state-description">{description}</p>}
      {onRetry && (
        <button type="button" className="btn-secondary btn-sm" onClick={onRetry} style={{ marginTop: "12px" }}>
          Try Again
        </button>
      )}
    </div>
  );
}

/* 14. Form Field */
export function FormField({ label, required, error, hint, children }) {
  return (
    <div className="editorial-form-field">
      {label && (
        <label className="field-label">
          {label}
          {required && <span className="field-label-required">*</span>}
        </label>
      )}
      {children}
      {hint && !error && <span className="field-hint">{hint}</span>}
      {error && <span className="field-error-message">{error}</span>}
    </div>
  );
}

/* 15. Buttons */
export function PrimaryButton({ children, ...props }) {
  return (
    <button type="button" className="btn-primary" {...props}>
      {children}
    </button>
  );
}

export function SecondaryButton({ children, ...props }) {
  return (
    <button type="button" className="btn-secondary" {...props}>
      {children}
    </button>
  );
}

/* 16. Application Timeline */
export function ApplicationTimeline({ steps }) {
  return (
    <div className="editorial-timeline">
      {steps.map((step, idx) => {
        const isDone = step.status === "completed" || step.completed;
        const isCurrent = step.status === "current" || step.current;
        return (
          <div
            key={idx}
            className={`timeline-step ${isDone ? "completed" : ""} ${
              isCurrent ? "current" : ""
            }`}
          >
            <div className="timeline-marker" />
            <div className="timeline-content-title">{step.title}</div>
            {step.description && (
              <div className="timeline-content-desc">{step.description}</div>
            )}
            {step.time && (
              <div className="timeline-content-time">{step.time}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* 17. Confirm Dialog */
export function ConfirmDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isDestructive = false,
}) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(23, 43, 36, 0.4)",
        display: "grid",
        placeItems: "center",
        zIndex: 100,
        padding: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "8px",
          maxWidth: "440px",
          width: "100%",
          padding: "24px",
          boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
        }}
      >
        <h3
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "20px",
            margin: "0 0 10px",
            color: isDestructive ? "var(--error)" : "var(--text-primary)",
          }}
        >
          {title}
        </h3>
        <p style={{ fontSize: "13.5px", color: "var(--text-secondary)", margin: "0 0 24px", lineHeight: 1.5 }}>
          {message}
        </p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <button type="button" className="btn-secondary btn-sm" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button
            type="button"
            className="btn-primary btn-sm"
            style={isDestructive ? { backgroundColor: "var(--error)", borderColor: "var(--error)" } : {}}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
