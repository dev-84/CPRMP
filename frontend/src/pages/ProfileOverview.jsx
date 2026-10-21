import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  User,
  GraduationCap,
  Award,
  BookOpen,
  Mail,
  Phone,
  MapPin,
  Edit3,
  FileText,
  ShieldCheck,
  Check,
} from "lucide-react";
import { useAuth } from "../context/useAuth.js";
import AppLayout from "../components/ui/AppLayout.jsx";
import {
  PageHeader,
  PrimaryButton,
  SecondaryButton,
} from "../components/ui/EditorialComponents.jsx";
import "./ProfileOverview.css";

function readSaved(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}

export default function ProfileOverview() {
  const { user } = useAuth();

  const profile = useMemo(() => {
    const stored = readSaved("cprmpStudentProfile", {});
    return {
      name: user?.name || user?.fullName || stored.fullName || stored.name || "Aryan Sharma",
      email: user?.email || stored.email || "aryan.sharma@college.edu",
      phone: stored.phone || "+91 98765 43210",
      rollNo: stored.rollNo || "MCA2024-042",
      institution: stored.institution || user?.collegeName || "University College of Engineering",
      department: stored.department || "Department of Computer Applications",
      degree: stored.degree || user?.course || "Master of Computer Applications (MCA)",
      graduationYear: stored.graduationYear || "2027",
      cgpa: Number(stored.cgpa || 8.84),
      backlogs: Number(stored.backlogs || 0),
      tenthPercent: stored.tenthPercent || "94.2%",
      twelfthPercent: stored.twelfthPercent || "91.8%",
      skills: stored.skills || [
        "Java",
        "Python",
        "Data Structures & Algorithms",
        "React",
        "Node.js",
        "SQL",
        "Docker",
        "Git",
      ],
      address: stored.address || "Hyderabad, Telangana, India",
    };
  }, [user]);

  const initial = profile.name.charAt(0).toUpperCase();

  return (
    <AppLayout pageTitle="Profile Overview" breadcrumb="Candidate Records">
      <div className="profile-editorial-container">
        <PageHeader
          eyebrow="STUDENT PLACEMENT PROFILE"
          title="Candidate Profile Dossier"
          description="Verified academic and contact record. Data in this dossier determines automated eligibility verification across active campus placement drives."
          actions={
            <div style={{ display: "flex", gap: "10px" }}>
              <Link to="/student/edit-profile" className="btn-primary">
                <Edit3 size={15} />
                <span>Edit Profile</span>
              </Link>
              <Link to="/student/resume" className="btn-secondary">
                <FileText size={15} />
                <span>Manage Resume</span>
              </Link>
            </div>
          }
        />

        {/* Hero Card */}
        <div className="profile-hero-card">
          <div className="profile-hero-left">
            <div className="profile-monogram-avatar">{initial}</div>
            <div>
              <h1 className="profile-hero-name">{profile.name}</h1>
              <p className="profile-hero-dept">
                Roll No: <strong>{profile.rollNo}</strong> · {profile.degree} · Class of {profile.graduationYear}
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <div style={{ textAlign: "right" }}>
              <span style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>
                Placement Eligibility
              </span>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--success)", display: "flex", alignItems: "center", gap: "4px" }}>
                <ShieldCheck size={16} />
                <span>Officially Cleared</span>
              </div>
            </div>
          </div>
        </div>

        {/* Two-Column Profile Sections Grid */}
        <div className="profile-sections-grid">
          <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
            {/* 1. Academic Information */}
            <div className="profile-card-block">
              <div>
                <h2 className="profile-subheading">Academic Information & Performance</h2>
                <div className="profile-fields-grid">
                  <div className="field-item">
                    <span className="field-label-text">Degree Program</span>
                    <span className="field-value-text">{profile.degree}</span>
                  </div>
                  <div className="field-item">
                    <span className="field-label-text">Department</span>
                    <span className="field-value-text">{profile.department}</span>
                  </div>
                  <div className="field-item">
                    <span className="field-label-text">Institution</span>
                    <span className="field-value-text">{profile.institution}</span>
                  </div>
                  <div className="field-item">
                    <span className="field-label-text">Graduation Cohort</span>
                    <span className="field-value-text">{profile.graduationYear}</span>
                  </div>
                  <div className="field-item">
                    <span className="field-label-text">Cumulative CGPA</span>
                    <span className="field-value-text" style={{ color: "var(--accent)", fontWeight: 700 }}>
                      {profile.cgpa.toFixed(2)} / 10.0
                    </span>
                  </div>
                  <div className="field-item">
                    <span className="field-label-text">Active Backlogs</span>
                    <span className="field-value-text">{profile.backlogs} Backlogs</span>
                  </div>
                </div>
              </div>

              {/* Academic History Table */}
              <div>
                <h3 style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "10px" }}>
                  Historical Academic Qualifications
                </h3>
                <table className="academic-records-table">
                  <thead>
                    <tr>
                      <th>Qualification</th>
                      <th>Board / Institution</th>
                      <th>Score / Grade</th>
                      <th>Standing</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Secondary Education (Class X)</td>
                      <td>CBSE Board</td>
                      <td>{profile.tenthPercent}</td>
                      <td><span className="editorial-badge badge-success">Completed</span></td>
                    </tr>
                    <tr>
                      <td>Higher Secondary (Class XII)</td>
                      <td>State Board of Intermediate</td>
                      <td>{profile.twelfthPercent}</td>
                      <td><span className="editorial-badge badge-success">Completed</span></td>
                    </tr>
                    <tr>
                      <td>Postgraduate (MCA)</td>
                      <td>{profile.institution}</td>
                      <td>CGPA {profile.cgpa.toFixed(2)}</td>
                      <td><span className="editorial-badge badge-accent">In Progress</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 2. Technical Skills */}
            <div className="profile-card-block">
              <div>
                <h2 className="profile-subheading">Technical Competencies & Skills</h2>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {profile.skills.map((skill, index) => (
                    <span
                      key={index}
                      style={{
                        padding: "6px 14px",
                        backgroundColor: "var(--surface-secondary)",
                        border: "1px solid var(--border)",
                        borderRadius: "6px",
                        fontSize: "13px",
                        fontWeight: 500,
                        color: "var(--text-primary)",
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact & Personal Details */}
          <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
            <div className="profile-card-block">
              <h2 className="profile-subheading">Contact Information</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <Mail size={16} color="var(--text-muted)" />
                  <div>
                    <span className="field-label-text">Official Email</span>
                    <div className="field-value-text">{profile.email}</div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <Phone size={16} color="var(--text-muted)" />
                  <div>
                    <span className="field-label-text">Phone Number</span>
                    <div className="field-value-text">{profile.phone}</div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <MapPin size={16} color="var(--text-muted)" />
                  <div>
                    <span className="field-label-text">Location</span>
                    <div className="field-value-text">{profile.address}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="profile-card-block" style={{ backgroundColor: "var(--surface-secondary)" }}>
              <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "16px", margin: "0 0 8px", color: "var(--text-primary)" }}>
                Need to update marks or CGPA?
              </h3>
              <p style={{ fontSize: "12.5px", color: "var(--text-secondary)", lineHeight: 1.5, margin: "0 0 16px" }}>
                Official grade modifications require verification by the university placement department with your mark sheet.
              </p>
              <Link to="/student/edit-profile" className="btn-secondary btn-sm" style={{ alignSelf: "flex-start" }}>
                Edit Academic Records
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
