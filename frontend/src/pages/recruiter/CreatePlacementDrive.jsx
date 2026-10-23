import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  Briefcase,
  Calendar,
  DollarSign,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Save,
  ArrowLeft,
  GraduationCap,
  Sparkles,
  Layers,
  FileCheck,
} from "lucide-react";
import AppLayout from "../../components/ui/AppLayout.jsx";
import { PageHeader } from "../../components/ui/EditorialComponents.jsx";
import { recruiterApi } from "../../api/recruiterApi.js";
import "./CreatePlacementDrive.css";

const DEGREES_OPTIONS = ["MCA", "B.Tech CS", "B.Tech IT", "M.Tech CS", "BCA", "M.Sc CS"];
const DEPARTMENTS_OPTIONS = [
  "Computer Science & Engineering",
  "Information Technology",
  "Data Science & AI",
  "Electronics & Communication",
  "Master of Computer Applications",
];
const GRAD_YEARS_OPTIONS = [2025, 2026, 2027];

export default function CreatePlacementDrive() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    jobType: "Full-time",
    location: "On-site (Bengaluru / Hyderabad)",
    ctcMin: 8,
    ctcMax: 14,
    openings: 10,
    applicationDeadline: "",
    driveDate: "",
    description: "",
    responsibilities: "",
    requiredSkills: "JavaScript, Python, React, Node.js, SQL",
    eligibleDegrees: ["MCA", "B.Tech CS"],
    eligibleDepartments: ["Computer Science & Engineering", "Information Technology"],
    graduationYears: [2026],
    minCGPA: 7.0,
    maxActiveBacklogs: 0,
    rounds: "Online Technical Assessment, Technical Interview Round 1, Leadership & Culture Interview",
    status: "draft",
  });

  useEffect(() => {
    if (isEditMode) {
      setLoading(true);
      recruiterApi
        .getDriveById(id)
        .then((res) => {
          const d = res.drive;
          const criteria = d.criteria || {};
          setFormData({
            title: d.title || "",
            jobType: d.jobType || "Full-time",
            location: d.location || "On-site",
            ctcMin: d.ctcMin != null ? d.ctcMin : "",
            ctcMax: d.ctcMax != null ? d.ctcMax : "",
            openings: d.openings || 1,
            applicationDeadline: d.applicationDeadline
              ? new Date(d.applicationDeadline).toISOString().split("T")[0]
              : "",
            driveDate: d.driveDate ? new Date(d.driveDate).toISOString().split("T")[0] : "",
            description: d.description || "",
            responsibilities: Array.isArray(d.responsibilities)
              ? d.responsibilities.join("\n")
              : d.responsibilities || "",
            requiredSkills: Array.isArray(d.requiredSkills)
              ? d.requiredSkills.join(", ")
              : d.requiredSkills || "",
            eligibleDegrees: d.eligibleDegrees || criteria.allowedDegrees || [],
            eligibleDepartments: d.eligibleDepartments || criteria.allowedDepartments || [],
            graduationYears: d.graduationYears || criteria.graduationYears || [],
            minCGPA: d.minCGPA != null ? d.minCGPA : (criteria.minimumCgpa != null ? criteria.minimumCgpa : 0),
            maxActiveBacklogs: d.maxActiveBacklogs != null ? d.maxActiveBacklogs : (criteria.maximumBacklogs || 0),
            rounds: Array.isArray(d.rounds) ? d.rounds.join(", ") : d.rounds || "",
            status: d.status || "draft",
          });
        })
        .catch((err) => setError(err.message || "Failed to load placement drive details"))
        .finally(() => setLoading(false));
    } else {
      // Default deadline to 14 days from today
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 14);
      setFormData((prev) => ({
        ...prev,
        applicationDeadline: defaultDate.toISOString().split("T")[0],
      }));
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxToggle = (category, value) => {
    setFormData((prev) => {
      const currentList = prev[category] || [];
      const exists = currentList.includes(value);
      const updated = exists ? currentList.filter((item) => item !== value) : [...currentList, value];
      return { ...prev, [category]: updated };
    });
  };

  const handleSubmit = async (e, targetStatus) => {
    if (e) e.preventDefault();

    if (!formData.title.trim()) {
      setError("Please provide a placement drive / job title.");
      return;
    }
    if (!formData.description.trim()) {
      setError("Please enter the job description.");
      return;
    }
    if (!formData.applicationDeadline) {
      setError("Application deadline is mandatory.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const payload = {
        ...formData,
        status: targetStatus || formData.status,
        responsibilities: formData.responsibilities
          ? formData.responsibilities.split("\n").map((r) => r.trim()).filter(Boolean)
          : [],
        requiredSkills: formData.requiredSkills
          ? formData.requiredSkills.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        rounds: formData.rounds
          ? formData.rounds.split(",").map((r) => r.trim()).filter(Boolean)
          : [],
      };

      if (isEditMode) {
        await recruiterApi.updateDrive(id, payload);
        setSuccessMsg("Placement drive updated successfully.");
      } else {
        await recruiterApi.createDrive(payload);
        setSuccessMsg("New placement drive published successfully.");
      }

      setTimeout(() => {
        navigate("/recruiter/drives");
      }, 1000);
    } catch (err) {
      setError(err.message || "Failed to save placement drive");
      setSubmitting(false);
    }
  };

  return (
    <AppLayout
      pageTitle={isEditMode ? "Edit Placement Drive" : "Create Placement Drive"}
      breadcrumb="Recruiter Portal / Drives / Form"
    >
      <div className="create-drive-root">
        <div className="back-nav-row">
          <Link to="/recruiter/drives" className="btn-back-link">
            <ArrowLeft size={14} /> Back to Placement Drives
          </Link>
        </div>

        <PageHeader
          eyebrow="Placement Drive Specification"
          title={isEditMode ? "Edit Placement Drive" : "Create Placement Drive"}
          description="Define opportunity parameters, strict university eligibility rules, and selection rounds for graduating candidates."
        />

        {successMsg && (
          <div className="alert-banner alert-success">
            <CheckCircle2 size={16} />
            <span>{successMsg} Redirecting to drives directory...</span>
          </div>
        )}

        {error && (
          <div className="alert-banner alert-error">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="form-loading-card">
            <div className="loading-spinner" />
            <p>Loading placement drive specifications...</p>
          </div>
        ) : (
          <form className="drive-form" onSubmit={(e) => handleSubmit(e, "published")}>
            {/* Section 1: Job Specification */}
            <div className="form-card-section">
              <div className="section-title-strip">
                <Briefcase size={18} color="#3F754B" />
                <h3>1. Position & Opportunity Information</h3>
              </div>

              <div className="form-grid-2">
                <div className="form-group full-width">
                  <label>Placement Drive / Role Title *</label>
                  <input
                    type="text"
                    name="title"
                    required
                    placeholder="e.g. Software Engineer — Cloud Infrastructure"
                    value={formData.title}
                    onChange={handleChange}
                  />
                  <small className="field-hint">Display title on student portal and applications.</small>
                </div>

                <div className="form-group">
                  <label>Employment Type</label>
                  <select name="jobType" value={formData.jobType} onChange={handleChange}>
                    <option value="Full-time">Full-time Regular</option>
                    <option value="Internship + FTE">6-Month Internship + FTE Conversion</option>
                    <option value="Internship">Summer Internship</option>
                    <option value="Graduate Trainee">Graduate Engineering Trainee</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Work Mode & Location</label>
                  <input
                    type="text"
                    name="location"
                    placeholder="e.g. Bengaluru / Hyderabad (Hybrid)"
                    value={formData.location}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Estimated CTC Range (LPA)</label>
                  <div className="ctc-input-row">
                    <input
                      type="number"
                      step="0.5"
                      min="1"
                      name="ctcMin"
                      placeholder="Min (e.g. 10)"
                      value={formData.ctcMin}
                      onChange={handleChange}
                    />
                    <span>to</span>
                    <input
                      type="number"
                      step="0.5"
                      min="1"
                      name="ctcMax"
                      placeholder="Max (e.g. 16)"
                      value={formData.ctcMax}
                      onChange={handleChange}
                    />
                    <span>LPA</span>
                  </div>
                </div>

                <div className="form-group">
                  <label>Anticipated Openings</label>
                  <input
                    type="number"
                    min="1"
                    name="openings"
                    placeholder="e.g. 15"
                    value={formData.openings}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group full-width">
                  <label>Role Summary & Overview *</label>
                  <textarea
                    rows={4}
                    name="description"
                    required
                    placeholder="Describe the engineering challenge, team mission, and technologies the candidate will develop with..."
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group full-width">
                  <label>Key Responsibilities (One per line)</label>
                  <textarea
                    rows={4}
                    name="responsibilities"
                    placeholder="Design scalable REST & GraphQL microservices&#10;Write unit & integration test suites&#10;Collaborate in agile sprints"
                    value={formData.responsibilities}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Eligibility Rules */}
            <div className="form-card-section">
              <div className="section-title-strip">
                <GraduationCap size={18} color="#3F754B" />
                <h3>2. Institutional Eligibility Criteria</h3>
              </div>
              <p className="section-desc">
                The portal evaluates candidate profiles against these criteria before accepting applications.
              </p>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Minimum Cumulative CGPA (0.0 – 10.0)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    name="minCGPA"
                    placeholder="e.g. 7.5"
                    value={formData.minCGPA}
                    onChange={handleChange}
                  />
                  <small className="field-hint">Students below this CGPA will be restricted from applying.</small>
                </div>

                <div className="form-group">
                  <label>Maximum Permissible Active Backlogs</label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    name="maxActiveBacklogs"
                    value={formData.maxActiveBacklogs}
                    onChange={handleChange}
                  />
                  <small className="field-hint">Set to 0 for zero-backlog policy.</small>
                </div>

                <div className="form-group full-width">
                  <label>Allowed Academic Degrees</label>
                  <div className="checkbox-pills-wrap">
                    {DEGREES_OPTIONS.map((deg) => (
                      <label key={deg} className={`checkbox-pill ${formData.eligibleDegrees.includes(deg) ? "checked" : ""}`}>
                        <input
                          type="checkbox"
                          checked={formData.eligibleDegrees.includes(deg)}
                          onChange={() => handleCheckboxToggle("eligibleDegrees", deg)}
                        />
                        <span>{deg}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group full-width">
                  <label>Allowed Departments / Branches</label>
                  <div className="checkbox-pills-wrap">
                    {DEPARTMENTS_OPTIONS.map((dept) => (
                      <label key={dept} className={`checkbox-pill ${formData.eligibleDepartments.includes(dept) ? "checked" : ""}`}>
                        <input
                          type="checkbox"
                          checked={formData.eligibleDepartments.includes(dept)}
                          onChange={() => handleCheckboxToggle("eligibleDepartments", dept)}
                        />
                        <span>{dept}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group full-width">
                  <label>Graduation Batch (Passing Out Year)</label>
                  <div className="checkbox-pills-wrap">
                    {GRAD_YEARS_OPTIONS.map((yr) => (
                      <label key={yr} className={`checkbox-pill ${formData.graduationYears.includes(yr) ? "checked" : ""}`}>
                        <input
                          type="checkbox"
                          checked={formData.graduationYears.includes(yr)}
                          onChange={() => handleCheckboxToggle("graduationYears", yr)}
                        />
                        <span>Class of {yr}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Recruitment Schedule & Rounds */}
            <div className="form-card-section">
              <div className="section-title-strip">
                <Calendar size={18} color="#3F754B" />
                <h3>3. Recruitment Schedule & Selection Stages</h3>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Application Deadline Date *</label>
                  <input
                    type="date"
                    required
                    name="applicationDeadline"
                    value={formData.applicationDeadline}
                    onChange={handleChange}
                  />
                  <small className="field-hint">Applications will automatically close at 23:59 IST on this date.</small>
                </div>

                <div className="form-group">
                  <label>Anticipated Drive / Assessment Date</label>
                  <input
                    type="date"
                    name="driveDate"
                    value={formData.driveDate}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group full-width">
                  <label>Required Technical Skills (Comma-separated)</label>
                  <input
                    type="text"
                    name="requiredSkills"
                    placeholder="e.g. Java, Python, React, SQL, Cloud Architecture"
                    value={formData.requiredSkills}
                    onChange={handleChange}
                  />
                  <small className="field-hint">Used by the portal for candidate skill matching.</small>
                </div>

                <div className="form-group full-width">
                  <label>Selection Rounds (Comma-separated)</label>
                  <input
                    type="text"
                    name="rounds"
                    placeholder="e.g. Online Assessment, Technical Round 1, Technical Round 2, HR Discussion"
                    value={formData.rounds}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="form-sticky-footer">
              <button
                type="button"
                className="btn-footer-cancel"
                onClick={() => navigate("/recruiter/drives")}
                disabled={submitting}
              >
                Cancel
              </button>

              <div className="footer-right-actions">
                <button
                  type="button"
                  className="btn-footer-draft"
                  disabled={submitting}
                  onClick={(e) => handleSubmit(e, "draft")}
                >
                  <Save size={15} />
                  Save as Draft
                </button>

                <button
                  type="submit"
                  className="btn-footer-publish"
                  disabled={submitting}
                >
                  <CheckCircle2 size={16} />
                  {submitting
                    ? "Processing..."
                    : isEditMode
                    ? "Update & Save Drive"
                    : "Publish Placement Drive"}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </AppLayout>
  );
}
