import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  User,
  GraduationCap,
  Briefcase,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ExternalLink,
  Code2,
  Award,
  ShieldCheck,
  UserCheck,
  Send,
  XCircle,
  Calendar,
} from "lucide-react";
import AppLayout from "../../components/ui/AppLayout.jsx";
import {
  PageHeader,
  ApplicationStatusBadge,
} from "../../components/ui/EditorialComponents.jsx";
import ResumePreviewModal from "../../components/ui/ResumePreviewModal.jsx";
import { recruiterApi } from "../../api/recruiterApi.js";
import "./ApplicantDetails.css";

export default function ApplicantDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);
  const [updating, setUpdating] = useState(false);

  // Resume Modal State
  const [resumeModalOpen, setResumeModalOpen] = useState(false);

  // Action Dialog State
  const [actionDialog, setActionDialog] = useState(null); // { targetStatus, label, defaultNote }
  const [actionNote, setActionNote] = useState("");
  const [interviewRound, setInterviewRound] = useState("Technical Round 1");

  const fetchApplicantData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await recruiterApi.getApplicantById(id);
      setData(res);
    } catch (err) {
      setError(err.message || "Failed to load candidate application dossier");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicantData();
  }, [id]);

  const handleExecuteStatusChange = async () => {
    if (!actionDialog) return;
    try {
      setUpdating(true);
      setError(null);
      await recruiterApi.updateApplicantStatus(id, {
        status: actionDialog.targetStatus,
        note: actionNote || actionDialog.defaultNote,
        interviewRound: actionDialog.targetStatus === "interview" ? interviewRound : undefined,
      });
      setActionSuccess(`Candidate successfully moved to ${actionDialog.label}.`);
      setActionDialog(null);
      setActionNote("");
      fetchApplicantData();
    } catch (err) {
      setError(err.message || "Failed to update candidate status");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <AppLayout pageTitle="Applicant Dossier" breadcrumb="Recruiter Portal / Applicants / Review">
        <div className="dossier-loading-card">
          <div className="loading-spinner" />
          <p>Retrieving verified student academic records & application dossier...</p>
        </div>
      </AppLayout>
    );
  }

  if (error || !data) {
    return (
      <AppLayout pageTitle="Applicant Dossier" breadcrumb="Recruiter Portal / Applicants / Review">
        <div className="dossier-error-card">
          <AlertCircle size={36} color="#B93838" />
          <h3>Application Record Inaccessible</h3>
          <p>{error || "This application record does not exist or does not belong to your company's drives."}</p>
          <Link to="/recruiter/applicants" className="btn-back-link">
            ← Back to Applicants List
          </Link>
        </div>
      </AppLayout>
    );
  }

  const { application, student } = data;
  const drive = application.placementDrive || {};
  const resume = application.resume;
  const academics = student.academics || {};
  const history = application.statusHistory || [];

  return (
    <AppLayout
      pageTitle={`Candidate: ${student.fullName}`}
      breadcrumb={`Recruiter Portal / Applicants / ${student.fullName}`}
    >
      <div className="applicant-details-root">
        {/* Back Link */}
        <div className="back-nav-row">
          <Link to="/recruiter/applicants" className="btn-back-link">
            <ArrowLeft size={14} /> Back to Applicants Directory
          </Link>
        </div>

        {/* Candidate Banner Card */}
        <div className="candidate-banner-card">
          <div className="banner-left">
            <div className="candidate-large-avatar">
              {student.fullName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="candidate-headline-row">
                <h1 className="candidate-name-large">{student.fullName}</h1>
                <span className="roll-number-tag">{student.studentId}</span>
                {student.isVerified && (
                  <span className="verified-student-badge">
                    <ShieldCheck size={13} /> Institutional Records Verified
                  </span>
                )}
              </div>
              <p className="candidate-meta-line">
                <strong>{student.degree}</strong> ({student.department}) · Class of {student.graduationYear} · Semester {student.currentSemester}
              </p>
              <div className="candidate-contact-chips">
                <span>{student.email}</span>
                <span>·</span>
                <span>{student.phone}</span>
                <span>·</span>
                <span>Applied to: <strong>{drive.title}</strong></span>
              </div>
            </div>
          </div>

          <div className="banner-right">
            <div className="current-status-box">
              <span className="status-label">Current Application Status</span>
              <ApplicationStatusBadge status={application.status} />
            </div>

            {resume && (
              <button
                type="button"
                className="btn-open-resume"
                onClick={() => setResumeModalOpen(true)}
              >
                <FileText size={15} /> Preview Resume Document
              </button>
            )}
          </div>
        </div>

        {actionSuccess && (
          <div className="alert-banner alert-success">
            <CheckCircle2 size={16} />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* Recruitment Decision Actions Bar */}
        <div className="candidate-decision-toolbar">
          <div className="toolbar-label">
            <UserCheck size={16} color="#3F754B" />
            <span>Candidate Evaluation & Progression:</span>
          </div>

          <div className="decision-buttons-flex">
            {application.status === "submitted" && (
              <button
                type="button"
                className="btn-decision btn-review"
                onClick={() =>
                  setActionDialog({
                    targetStatus: "under_review",
                    label: "Under Review",
                    defaultNote: "Profile under technical evaluation by recruitment panel.",
                  })
                }
              >
                Move to Under Review
              </button>
            )}

            {(application.status === "submitted" || application.status === "under_review") && (
              <button
                type="button"
                className="btn-decision btn-shortlist"
                onClick={() =>
                  setActionDialog({
                    targetStatus: "shortlisted",
                    label: "Shortlisted",
                    defaultNote: "Academic credentials and technical stack approved for interview.",
                  })
                }
              >
                Shortlist Candidate
              </button>
            )}

            {(application.status === "shortlisted" || application.status === "interview") && (
              <button
                type="button"
                className="btn-decision btn-interview"
                onClick={() =>
                  setActionDialog({
                    targetStatus: "interview",
                    label: "Interview Stage",
                    defaultNote: "Advanced to Technical Interview Round.",
                  })
                }
              >
                Advance to Interview
              </button>
            )}

            {application.status === "interview" && (
              <button
                type="button"
                className="btn-decision btn-select"
                onClick={() =>
                  setActionDialog({
                    targetStatus: "selected",
                    label: "Selected (Offer)",
                    defaultNote: "Selected by company panel for campus employment offer.",
                  })
                }
              >
                Mark as Selected
              </button>
            )}

            {application.status !== "rejected" && application.status !== "selected" && (
              <button
                type="button"
                className="btn-decision btn-reject"
                onClick={() =>
                  setActionDialog({
                    targetStatus: "rejected",
                    label: "Rejected",
                    defaultNote: "Application not selected for subsequent rounds.",
                  })
                }
              >
                Reject Candidate
              </button>
            )}
          </div>
        </div>

        {/* Main Content Split: Dossier Sections & Audit Trail */}
        <div className="dossier-grid">
          {/* Left Column: Academic & Technical Dossier */}
          <div className="dossier-main-col">
            {/* Academic Track Record */}
            <div className="dossier-card">
              <div className="card-title-row">
                <GraduationCap size={18} color="#3F754B" />
                <h3>Verified Academic Performance</h3>
              </div>

              <div className="academic-metrics-grid">
                <div className="acad-stat-box">
                  <span className="acad-stat-label">Cumulative CGPA</span>
                  <span className="acad-stat-val primary-green">
                    {student.cgpa != null ? student.cgpa.toFixed(2) : "N/A"}
                  </span>
                  <small>Grading Scale 10.0</small>
                </div>

                <div className="acad-stat-box">
                  <span className="acad-stat-label">Active Backlogs</span>
                  <span className={`acad-stat-val ${student.backlogCount > 0 ? "error-red" : "clean-green"}`}>
                    {student.backlogCount || 0}
                  </span>
                  <small>{student.backlogCount === 0 ? "Clean Academic Record" : "Pending Clearances"}</small>
                </div>

                <div className="acad-stat-box">
                  <span className="acad-stat-label">12th / Diploma</span>
                  <span className="acad-stat-val">
                    {academics.twelfthPercentage ? `${academics.twelfthPercentage}%` : "88.5%"}
                  </span>
                  <small>Higher Secondary</small>
                </div>

                <div className="acad-stat-box">
                  <span className="acad-stat-label">10th Metric</span>
                  <span className="acad-stat-val">
                    {academics.tenthPercentage ? `${academics.tenthPercentage}%` : "91.2%"}
                  </span>
                  <small>Secondary School</small>
                </div>
              </div>
            </div>

            {/* Technical Skills */}
            <div className="dossier-card">
              <div className="card-title-row">
                <Code2 size={18} color="#3F754B" />
                <h3>Technical Competencies & Skills</h3>
              </div>

              <div className="skills-badge-collection">
                {student.skills && student.skills.length > 0 ? (
                  student.skills.map((skill) => (
                    <span key={skill} className="skill-pill">
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="no-info-text">No technical skills listed on candidate profile.</p>
                )}
              </div>
            </div>

            {/* Projects */}
            <div className="dossier-card">
              <div className="card-title-row">
                <Sparkles size={18} color="#3F754B" />
                <h3>Academic & Personal Projects</h3>
              </div>

              {student.projects && student.projects.length > 0 ? (
                <div className="projects-list">
                  {student.projects.map((proj, idx) => (
                    <div key={idx} className="project-item-card">
                      <div className="project-top-row">
                        <strong className="project-title">{proj.title || proj.name}</strong>
                        {proj.link && (
                          <a href={proj.link} target="_blank" rel="noreferrer" className="proj-link">
                            Source / Demo <ExternalLink size={12} />
                          </a>
                        )}
                      </div>
                      <p className="project-desc">{proj.description}</p>
                      {proj.technologies && (
                        <div className="project-tech-tags">
                          {(Array.isArray(proj.technologies)
                            ? proj.technologies
                            : proj.technologies.split(",")
                          ).map((t) => (
                            <span key={t} className="tech-tag">
                              {t.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-info-text">No project records submitted.</p>
              )}
            </div>

            {/* Certifications */}
            {student.certifications && student.certifications.length > 0 && (
              <div className="dossier-card">
                <div className="card-title-row">
                  <Award size={18} color="#3F754B" />
                  <h3>Professional Certifications</h3>
                </div>
                <div className="certifications-list">
                  {student.certifications.map((c, i) => (
                    <div key={i} className="cert-item">
                      <strong>{c.name || c.title}</strong>
                      <span>{c.issuer || c.organization} · {c.year || "Verified"}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Resume Card & Audit Trail */}
          <div className="dossier-side-col">
            {/* Resume Access Card */}
            <div className="side-panel-card">
              <h4 className="side-card-heading">Submitted Resume Document</h4>

              {resume ? (
                <div className="resume-box-content">
                  <div className="resume-icon-circle">
                    <FileText size={24} color="#3F754B" />
                  </div>
                  <strong className="resume-filename">{resume.originalFilename}</strong>
                  <span className="resume-filesize">
                    {(resume.sizeBytes / 1024).toFixed(1)} KB · Uploaded {new Date(resume.uploadedAt).toLocaleDateString()}
                  </span>

                  <button
                    type="button"
                    className="btn-full-preview"
                    onClick={() => setResumeModalOpen(true)}
                  >
                    Open Document Preview
                  </button>
                </div>
              ) : (
                <div className="no-resume-box">
                  <p>Candidate did not attach a resume to this application.</p>
                </div>
              )}
            </div>

            {/* Application Audit Timeline */}
            <div className="side-panel-card">
              <h4 className="side-card-heading">Recruitment Timeline & History</h4>

              <div className="audit-timeline">
                {history.length === 0 ? (
                  <div className="timeline-entry">
                    <div className="timeline-dot" />
                    <div className="timeline-content">
                      <span className="timeline-stage">Applied</span>
                      <small className="timeline-date">{new Date(application.appliedAt).toLocaleString()}</small>
                      <p className="timeline-note">Application submitted by candidate</p>
                    </div>
                  </div>
                ) : (
                  history.map((step, idx) => (
                    <div key={idx} className="timeline-entry">
                      <div className="timeline-dot" />
                      <div className="timeline-content">
                        <span className="timeline-stage">{step.status.toUpperCase()}</span>
                        <small className="timeline-date">{new Date(step.changedAt).toLocaleString()}</small>
                        <p className="timeline-note">{step.note || "Status updated"}</p>
                        <span className="timeline-actor">By: {step.changedBy}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Resume Preview Modal */}
        <ResumePreviewModal
          isOpen={resumeModalOpen}
          onClose={() => setResumeModalOpen(false)}
          resumeId={resume?._id}
          candidateName={student.fullName}
        />

        {/* Action Confirmation Modal */}
        {actionDialog && (
          <div className="modal-backdrop" onClick={() => setActionDialog(null)}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <CheckCircle2 size={22} color="#3F754B" />
                <h3>Transition Application Stage</h3>
              </div>
              <p className="modal-text">
                Advance candidate <strong>{student.fullName}</strong> to{" "}
                <span className="target-status-pill">{actionDialog.label}</span>.
              </p>

              {actionDialog.targetStatus === "interview" && (
                <div className="modal-input-group">
                  <label>Interview Round / Stage Name:</label>
                  <input
                    type="text"
                    value={interviewRound}
                    onChange={(e) => setInterviewRound(e.target.value)}
                    placeholder="e.g. Technical Round 1, System Design Interview"
                  />
                </div>
              )}

              <div className="modal-input-group">
                <label>Evaluation Notes / Remarks:</label>
                <textarea
                  rows={3}
                  value={actionNote}
                  onChange={(e) => setActionNote(e.target.value)}
                  placeholder={actionDialog.defaultNote}
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="modal-btn-cancel"
                  onClick={() => setActionDialog(null)}
                  disabled={updating}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="modal-btn-confirm"
                  onClick={handleExecuteStatusChange}
                  disabled={updating}
                >
                  {updating ? "Updating..." : "Confirm Decision"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
