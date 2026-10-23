import { useState, useMemo, useEffect, useCallback, useRef } from "react";
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
  Copy,
  ExternalLink,
  UploadCloud,
  X,
  Eye,
  Download,
  Briefcase,
  Calendar,
  Building2,
  Globe,
  CheckCircle2,
  AlertCircle,
  Clock,
  Plus,
  Trash2,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "../context/useAuth.js";
import AppLayout from "../components/ui/AppLayout.jsx";
import {
  PageHeader,
  PrimaryButton,
  SecondaryButton,
} from "../components/ui/EditorialComponents.jsx";
import "./ProfileOverview.css";

// Helper for local storage fallback
function readSaved(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}

// Default standard academic qualifications ladder
function getDefaultQualifications(degree = "MCA", cgpa = 8.84, gradYear = 2027) {
  return [
    {
      id: "qual-10th",
      level: "10th",
      title: "Secondary School Certificate (Class X)",
      schoolOrCollege: "St. Xavier's High School",
      boardOrUniversity: "CBSE Board",
      streamOrSpecialization: "General Science & Mathematics",
      passingYear: 2020,
      scoreType: "percentage",
      score: 94.2,
      maxScore: 100,
      status: "completed",
      activeBacklogs: 0,
      historicalBacklogs: 0,
      marksheetUrl: "",
      marksheetFilename: "Class_10th_Marksheet_Verified.pdf",
      verificationStatus: "verified",
      verificationRemarks: "Verified against CBSE Roll",
    },
    {
      id: "qual-12th",
      level: "12th",
      title: "Higher Secondary Certificate (Class XII)",
      schoolOrCollege: "Delhi Public College",
      boardOrUniversity: "State Board of Intermediate",
      streamOrSpecialization: "Science (Physics, Chemistry, Mathematics)",
      passingYear: 2022,
      scoreType: "percentage",
      score: 91.8,
      maxScore: 100,
      status: "completed",
      activeBacklogs: 0,
      historicalBacklogs: 0,
      marksheetUrl: "",
      marksheetFilename: "Class_12th_Marksheet_Verified.pdf",
      verificationStatus: "verified",
      verificationRemarks: "Verified against State Board Roll",
    },
    {
      id: "qual-ug",
      level: "ug",
      title: "Bachelor of Computer Applications (BCA)",
      schoolOrCollege: "Department of Computer Science",
      boardOrUniversity: "State University of Technology",
      streamOrSpecialization: "Computer Applications & Software Systems",
      passingYear: 2025,
      scoreType: "cgpa",
      score: 8.72,
      maxScore: 10.0,
      status: "completed",
      activeBacklogs: 0,
      historicalBacklogs: 0,
      marksheetUrl: "",
      marksheetFilename: "BCA_Consolidated_Transcript.pdf",
      verificationStatus: "verified",
      verificationRemarks: "Consolidated grade transcript verified",
    },
    {
      id: "qual-pg",
      level: "pg",
      title: `Master of Computer Applications (${degree || "MCA"})`,
      schoolOrCollege: "University College of Engineering",
      boardOrUniversity: "Central University",
      streamOrSpecialization: "Software Engineering & Cloud Computing",
      passingYear: gradYear || 2027,
      scoreType: "cgpa",
      score: cgpa || 8.84,
      maxScore: 10.0,
      status: "in_progress",
      currentSemester: 3,
      activeBacklogs: 0,
      historicalBacklogs: 0,
      marksheetUrl: "",
      marksheetFilename: "MCA_Sem_2_Marksheet.pdf",
      verificationStatus: "pending",
      verificationRemarks: "Semester 3 marksheet pending final university exam cycle",
    },
  ];
}

// Guaranteed merger: always renders 10th, 12th, UG, PG, plus custom qualifications
function mergeQualificationsWithDefaults(existingList = [], degree, cgpa, gradYear) {
  const defaults = getDefaultQualifications(degree, cgpa, gradYear);
  const result = [];

  for (const def of defaults) {
    const found = (existingList || []).find(
      (q) => q.level === def.level || q.id === def.id || (q.id && q.id.includes(def.level))
    );
    if (found) {
      result.push({
        ...def,
        ...found,
        title: found.title && !found.title.startsWith("QUAL-") ? found.title : def.title,
        schoolOrCollege: found.schoolOrCollege || def.schoolOrCollege,
        boardOrUniversity: found.boardOrUniversity || def.boardOrUniversity,
        streamOrSpecialization: found.streamOrSpecialization || def.streamOrSpecialization,
        score:
          found.score !== undefined && found.score !== null && !isNaN(Number(found.score))
            ? Number(found.score)
            : def.score,
        scoreType: found.scoreType || def.scoreType,
        passingYear: found.passingYear || def.passingYear,
        status: found.status || def.status,
      });
    } else {
      result.push(def);
    }
  }

  for (const q of existingList || []) {
    const isStandardLevel = ["10th", "12th", "ug", "pg"].includes(q.level);
    const isStandardId = ["qual-10th", "qual-12th", "qual-ug", "qual-pg"].includes(q.id);
    if (!isStandardLevel && !isStandardId && !result.some((r) => r.id === q.id)) {
      result.push(q);
    }
  }

  return result;
}

const DEFAULT_CATEGORIZED_SKILLS = [
  {
    category: "Programming Languages",
    skills: ["Java", "Python", "C++", "SQL", "JavaScript", "TypeScript"],
  },
  {
    category: "Web Development & Frameworks",
    skills: ["React.js", "Node.js", "Express.js", "Tailwind CSS", "HTML5 & CSS3"],
  },
  {
    category: "Databases & Storage",
    skills: ["MongoDB", "MySQL", "PostgreSQL", "Redis"],
  },
  {
    category: "Cloud, DevOps & Tools",
    skills: ["Docker", "Git", "GitHub Actions", "AWS (EC2, S3)", "Linux CLI"],
  },
  {
    category: "Core Computer Science",
    skills: [
      "Data Structures & Algorithms",
      "Database Management Systems",
      "Operating Systems",
      "Computer Networks",
      "Object-Oriented Design",
    ],
  },
];

const DEFAULT_PROJECTS = [
  {
    id: "proj-1",
    title: "Campus Placement & Recruitment Portal (CPRMP)",
    category: "Major Academic Project",
    description:
      "A complete role-based institutional portal connecting students, placement officers, and corporate recruiters with automated criteria checks, resume parsing, and audit trails.",
    technologies: ["React", "Node.js", "Express", "MongoDB", "JWT", "Tailwind"],
    startDate: "Aug 2026",
    endDate: "Oct 2026",
    role: "Full-Stack System Architect",
    githubUrl: "https://github.com/aryan-sharma/cprmp",
    liveUrl: "https://cprmp-demo.edu",
  },
  {
    id: "proj-2",
    title: "Distributed Asynchronous Job Dispatcher",
    category: "Personal Project",
    description:
      "A high-throughput distributed task processor with Redis-backed priority queues, exponential backoff retries, and real-time dashboard telemetry.",
    technologies: ["Java", "Spring Boot", "Redis", "Docker", "Prometheus"],
    startDate: "Jan 2026",
    endDate: "Apr 2026",
    role: "Solo Developer",
    githubUrl: "https://github.com/aryan-sharma/task-dispatcher",
    liveUrl: "",
  },
];

const DEFAULT_CERTIFICATIONS = [
  {
    id: "cert-1",
    name: "AWS Certified Solutions Architect – Associate",
    issuingOrganization: "Amazon Web Services",
    issueDate: "Feb 2025",
    expirationDate: "Feb 2028",
    credentialId: "AWS-SAA-839210",
    credentialUrl: "https://aws.amazon.com/verification",
    verificationStatus: "verified",
  },
  {
    id: "cert-2",
    name: "Oracle Certified Professional: Java SE 17 Developer",
    issuingOrganization: "Oracle University",
    issueDate: "Aug 2024",
    expirationDate: "Never Expires",
    credentialId: "OCP-JAVA-492019",
    credentialUrl: "https://catalog-education.oracle.com",
    verificationStatus: "verified",
  },
];

export default function ProfileOverview({ initialTab }) {
  const { user, token } = useAuth();

  // State management
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedKey, setCopiedKey] = useState("");
  const [feedback, setFeedback] = useState(null);

  // Marksheet Modal state
  const [marksheetModal, setMarksheetModal] = useState({
    isOpen: false,
    mode: "preview", // 'preview' or 'upload'
    qualification: null,
  });

  // Dedicated Edit Qualification Modal state
  const [editQualModal, setEditQualModal] = useState({
    isOpen: false,
    qualification: null,
    isNew: false,
  });
  const [savingQual, setSavingQual] = useState(false);

  // Global Edit Profile Modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editTab, setEditTab] = useState(initialTab === "academic" ? "academic" : initialTab === "contact" ? "identity" : initialTab || "identity");
  const [editFormData, setEditFormData] = useState({});
  const [savingEdit, setSavingEdit] = useState(false);

  // Smooth scroll to section if initialTab passed
  useEffect(() => {
    if (initialTab && !loading) {
      setTimeout(() => {
        let el = null;
        if (initialTab === "academic" || initialTab === "academics") {
          el = document.getElementById("academic-info-heading");
        } else if (initialTab === "skills") {
          el = document.getElementById("skills-heading");
        } else if (initialTab === "projects") {
          el = document.getElementById("projects-heading");
        } else if (initialTab === "contact") {
          el = document.getElementById("contact-info-heading");
        }
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  }, [initialTab, loading]);


  // Upload file state
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Load profile from API and merge with local fallback
  const fetchProfile = useCallback(async () => {
    setLoading(true);
    let loaded = null;

    if (token) {
      try {
        const res = await fetch("/api/student/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const json = await res.json();
          if (json.data?.profile) {
            loaded = json.data.profile;
          }
        }
      } catch {
        // Fallback to local cache if server is unreachable
      }
    }

    const cached = readSaved("cprmpStudentProfile", {});

    const degreeVal =
      loaded?.degree || cached.degree || user?.course || "Master of Computer Applications (MCA)";
    const cgpaVal = Number(loaded?.cgpa ?? (cached.cgpa || 8.84));
    const gradYearVal = Number(loaded?.graduationYear || cached.graduationYear || 2027);

    // Merge qualifications with guaranteed 10th, 12th, UG, PG
    const rawQualifications =
      loaded?.qualifications && loaded.qualifications.length > 0
        ? loaded.qualifications
        : (cached.qualifications && cached.qualifications.length > 0
            ? cached.qualifications
            : []);

    const mergedQualifications = mergeQualificationsWithDefaults(
      rawQualifications,
      degreeVal,
      cgpaVal,
      gradYearVal
    );

    // Composite profile object with full rich fields
    const composite = {
      fullName:
        loaded?.fullName ||
        cached.fullName ||
        user?.name ||
        user?.fullName ||
        "Aryan Sharma",
      firstName: loaded?.firstName || cached.firstName || "Aryan",
      middleName: loaded?.middleName || cached.middleName || "",
      lastName: loaded?.lastName || cached.lastName || "Sharma",
      studentId: loaded?.studentId || cached.rollNo || "MCA2024-042",
      prn: loaded?.prn || cached.prn || "2023MCA042",
      collegeName:
        loaded?.collegeName ||
        cached.institution ||
        user?.collegeName ||
        "University College of Engineering",
      department:
        loaded?.department ||
        cached.department ||
        "Department of Computer Applications",
      degree: degreeVal,
      currentSemester: loaded?.currentSemester || cached.currentSemester || 3,
      graduationYear: gradYearVal,
      cgpa: cgpaVal,
      backlogCount: Number(loaded?.backlogCount ?? (cached.backlogs || 0)),
      phone: loaded?.phone || cached.phone || "+91 98765 43210",
      personalEmail:
        loaded?.personalEmail ||
        cached.personalEmail ||
        "aryan.sharma.dev@gmail.com",
      alternatePhone: loaded?.alternatePhone || cached.alternatePhone || "+91 87654 32109",
      institutionalEmail:
        user?.email || cached.email || "aryan.sharma@college.edu",
      accountVerificationStatus:
        loaded?.accountVerificationStatus || "verified",
      placementVerificationStatus:
        loaded?.placementVerificationStatus || "pending",
      address: loaded?.address || {
        city: cached.city || "Hyderabad",
        state: cached.state || "Telangana",
        country: "India",
        postalCode: "500007",
        currentAddress: "Room 304, Campus Graduate Hostel, Hyderabad",
        permanentAddress: "Plot 42, Green Avenue, Jubilee Hills, Hyderabad",
        willingToRelocate: true,
        preferredLocations: ["Bengaluru", "Hyderabad", "Pune", "Gurugram"],
      },
      socialLinks: loaded?.socialLinks || {
        linkedin: "https://linkedin.com/in/aryan-sharma-dev",
        github: "https://github.com/aryan-sharma",
        portfolio: "https://aryansharma.dev",
        other: "",
      },
      qualifications: mergedQualifications,
      categorizedSkills:
        loaded?.categorizedSkills && loaded.categorizedSkills.length > 0
          ? loaded.categorizedSkills
          : (cached.categorizedSkills && cached.categorizedSkills.length > 0
              ? cached.categorizedSkills
              : DEFAULT_CATEGORIZED_SKILLS),
      skills:
        loaded?.skills && loaded.skills.length > 0
          ? loaded.skills
          : (cached.skills && Array.isArray(cached.skills)
              ? cached.skills
              : DEFAULT_CATEGORIZED_SKILLS.flatMap((c) => c.skills)),
      projects:
        loaded?.projects && loaded.projects.length > 0
          ? loaded.projects
          : (cached.projects && cached.projects.length > 0
              ? cached.projects
              : DEFAULT_PROJECTS),
      certifications:
        loaded?.certifications && loaded.certifications.length > 0
          ? loaded.certifications
          : (cached.certifications && cached.certifications.length > 0
              ? cached.certifications
              : DEFAULT_CERTIFICATIONS),
      resume: loaded?.resume || {
        filename: "Aryan_Sharma_MCA_Resume_2026.pdf",
        url: "/api/student/resume",
        fileSize: 394240,
        updatedAt: new Date(),
      },
    };

    setProfile(composite);
    setEditFormData(composite);
    setLoading(false);
  }, [token, user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Handle 1-click clipboard copying
  const copyToClipboard = (text, keyName) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(""), 2000);
  };

  // Profile completion calculation across 7 core dimensions
  const completionData = useMemo(() => {
    if (!profile) return { percentage: 0, items: [] };

    const items = [
      {
        label: "Identity & Enrollment Identifiers",
        completed: Boolean(
          profile.fullName && profile.studentId && profile.prn
        ),
      },
      {
        label: "Contact & Relocation Preferences",
        completed: Boolean(
          profile.phone && profile.personalEmail && profile.address?.city
        ),
      },
      {
        label: "Academic Qualifications Recorded",
        completed: Boolean(
          profile.qualifications && profile.qualifications.length >= 3
        ),
      },
      {
        label: "Academic Marksheets Uploaded",
        completed: Boolean(
          profile.qualifications &&
            profile.qualifications.filter(
              (q) => q.marksheetFilename || q.marksheetUrl
            ).length >= 2
        ),
      },
      {
        label: "Technical Skills Categorized",
        completed: Boolean(profile.skills && profile.skills.length >= 6),
      },
      {
        label: "Portfolio Projects & Certifications",
        completed: Boolean(
          profile.projects?.length > 0 && profile.certifications?.length > 0
        ),
      },
      {
        label: "Active Verified Resume Attached",
        completed: Boolean(profile.resume?.filename),
      },
    ];

    const completedCount = items.filter((i) => i.completed).length;
    const percentage = Math.round((completedCount / items.length) * 100);

    return { percentage, items };
  }, [profile]);

  // Handle Marksheet Upload
  const handleUploadMarksheet = async (e) => {
    e.preventDefault();
    if (!uploadFile || !marksheetModal.qualification) return;

    setUploading(true);
    setFeedback(null);

    const qualId = marksheetModal.qualification.id || marksheetModal.qualification.level;
    const formData = new FormData();
    formData.append("marksheet", uploadFile);

    try {
      if (token) {
        const res = await fetch(`/api/student/profile/marksheet/${qualId}`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || "Failed to upload marksheet.");
        }
      }

      // Update local state qualifications
      const updatedQualifications = profile.qualifications.map((q) => {
        if (q.id === qualId || q.level === qualId) {
          return {
            ...q,
            marksheetFilename: uploadFile.name,
            marksheetFileSize: uploadFile.size,
            marksheetUploadedAt: new Date(),
            verificationStatus: "pending",
          };
        }
        return q;
      });

      const updatedProfile = {
        ...profile,
        qualifications: updatedQualifications,
      };

      setProfile(updatedProfile);
      localStorage.setItem("cprmpStudentProfile", JSON.stringify(updatedProfile));

      setFeedback({
        type: "success",
        message: `Marksheet for ${marksheetModal.qualification.title} uploaded successfully. Placement cell verification is now pending.`,
      });

      setMarksheetModal({ isOpen: false, mode: "preview", qualification: null });
      setUploadFile(null);
    } catch (err) {
      setFeedback({
        type: "error",
        message: err.message || "Failed to upload marksheet. Please try again.",
      });
    } finally {
      setUploading(false);
    }
  };

  // Handle Saving Individual Qualification Details
  const handleSaveQualification = async (e) => {
    e.preventDefault();
    if (!editQualModal.qualification) return;

    setSavingQual(true);
    setFeedback(null);

    const qualToSave = {
      ...editQualModal.qualification,
      score:
        editQualModal.qualification.score !== "" &&
        !isNaN(Number(editQualModal.qualification.score))
          ? Number(editQualModal.qualification.score)
          : undefined,
      passingYear:
        editQualModal.qualification.passingYear !== ""
          ? parseInt(editQualModal.qualification.passingYear, 10)
          : undefined,
      currentSemester:
        editQualModal.qualification.currentSemester !== ""
          ? parseInt(editQualModal.qualification.currentSemester, 10)
          : undefined,
      activeBacklogs: parseInt(editQualModal.qualification.activeBacklogs || 0, 10),
      historicalBacklogs: parseInt(editQualModal.qualification.historicalBacklogs || 0, 10),
    };

    let updatedQualifications = [];
    const existingIndex = profile.qualifications.findIndex(
      (q) =>
        q.id === qualToSave.id ||
        (q.level && q.level === qualToSave.level && !editQualModal.isNew)
    );

    if (existingIndex >= 0) {
      updatedQualifications = [...profile.qualifications];
      updatedQualifications[existingIndex] = {
        ...updatedQualifications[existingIndex],
        ...qualToSave,
      };
    } else {
      updatedQualifications = [...profile.qualifications, qualToSave];
    }

    const updatedProfile = {
      ...profile,
      qualifications: updatedQualifications,
    };

    try {
      if (token) {
        await fetch("/api/student/profile", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ qualifications: updatedQualifications }),
        });
      }

      setProfile(updatedProfile);
      localStorage.setItem("cprmpStudentProfile", JSON.stringify(updatedProfile));

      setFeedback({
        type: "success",
        message: `Academic details for ${qualToSave.title} updated successfully!`,
      });

      setEditQualModal({ isOpen: false, qualification: null, isNew: false });
    } catch {
      setFeedback({
        type: "error",
        message: "Failed to sync qualification with server. Saved locally.",
      });
    } finally {
      setSavingQual(false);
    }
  };

  // Open Edit Modal for a specific qualification
  const openEditQualModal = (qual) => {
    setEditQualModal({
      isOpen: true,
      qualification: { ...qual },
      isNew: false,
    });
  };

  // Open Add Qualification Modal
  const openAddQualModal = () => {
    const newId = `qual-custom-${Date.now()}`;
    setEditQualModal({
      isOpen: true,
      qualification: {
        id: newId,
        level: "diploma",
        title: "Diploma / Additional Certification",
        schoolOrCollege: "",
        boardOrUniversity: "",
        streamOrSpecialization: "",
        passingYear: new Date().getFullYear(),
        scoreType: "percentage",
        score: 85,
        maxScore: 100,
        status: "completed",
        activeBacklogs: 0,
        historicalBacklogs: 0,
        verificationStatus: "pending",
      },
      isNew: true,
    });
  };

  // Delete custom qualification
  const handleDeleteQual = async (qualId) => {
    const updated = profile.qualifications.filter((q) => q.id !== qualId);
    const updatedProfile = { ...profile, qualifications: updated };
    setProfile(updatedProfile);
    localStorage.setItem("cprmpStudentProfile", JSON.stringify(updatedProfile));

    if (token) {
      try {
        await fetch("/api/student/profile", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ qualifications: updated }),
        });
      } catch {}
    }

    setFeedback({
      type: "success",
      message: "Academic record removed successfully.",
    });
  };

  // Handle Saving Profile Edits from global modal
  const handleSaveProfileEdit = async (e) => {
    e.preventDefault();
    setSavingEdit(true);
    setFeedback(null);

    const allowedKeys = [
      "fullName",
      "firstName",
      "middleName",
      "lastName",
      "studentId",
      "collegeName",
      "prn",
      "department",
      "degree",
      "graduationYear",
      "currentSemester",
      "cgpa",
      "backlogCount",
      "historicalBacklogs",
      "phone",
      "personalEmail",
      "institutionalEmail",
      "alternatePhone",
      "address",
      "socialLinks",
      "qualifications",
      "categorizedSkills",
      "skills",
      "projects",
      "certifications",
    ];

    const payload = {};
    for (const key of allowedKeys) {
      if (editFormData[key] !== undefined) {
        payload[key] = editFormData[key];
      }
    }

    if (payload.cgpa !== undefined) {
      payload.cgpa = parseFloat(payload.cgpa) || profile.cgpa;
    }
    if (payload.backlogCount !== undefined) {
      payload.backlogCount = parseInt(payload.backlogCount, 10) || 0;
    }
    if (payload.graduationYear !== undefined) {
      payload.graduationYear = parseInt(payload.graduationYear, 10) || profile.graduationYear;
    }
    if (payload.currentSemester !== undefined) {
      payload.currentSemester = parseInt(payload.currentSemester, 10) || profile.currentSemester;
    }

    try {
      if (token) {
        const res = await fetch("/api/student/profile", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || "Failed to sync profile with server.");
        }
      }

      const mergedProfile = { ...profile, ...payload };
      setProfile(mergedProfile);
      localStorage.setItem("cprmpStudentProfile", JSON.stringify(mergedProfile));

      setFeedback({
        type: "success",
        message: "Your profile has been updated and synchronized with the university database.",
      });

      setEditModalOpen(false);
    } catch (err) {
      setFeedback({
        type: "error",
        message: err.message || "Unable to sync profile with server. Local changes have been saved.",
      });
    } finally {
      setSavingEdit(false);
    }
  };

  // Helper formatting functions to eliminate NaN / undefined
  const formatScore = (qual) => {
    if (qual.score === undefined || qual.score === null || isNaN(Number(qual.score))) {
      return "Score Pending";
    }
    if (qual.scoreType === "cgpa") {
      return `${Number(qual.score).toFixed(2)} / ${qual.maxScore || "10.0"} CGPA`;
    }
    return `${qual.score}%`;
  };

  const formatInstitution = (qual) => {
    const parts = [qual.schoolOrCollege, qual.boardOrUniversity].filter(Boolean);
    return parts.length > 0 ? parts.join(" · ") : "Institution & Board details pending";
  };

  // Monogram initials
  const initials = useMemo(() => {
    if (!profile) return "AS";
    const parts = (profile.fullName || "Aryan Sharma").trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return (parts[0][0] || "A").toUpperCase();
  }, [profile]);

  if (loading) {
    return (
      <AppLayout pageTitle="Student Profile" breadcrumb="Candidate Records">
        <div style={{ padding: "60px 20px", textAlign: "center", color: "var(--text-secondary)" }}>
          <p style={{ fontFamily: "var(--font-serif)", fontSize: "20px" }}>Loading Student Profile Dossier...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout pageTitle="Student Profile Overview" breadcrumb="Candidate Records">
      <div className="profile-editorial-container">
        {/* Global Page Header */}
        <PageHeader
          eyebrow="ACADEMIC & PROFESSIONAL DOSSIER"
          title="Candidate Profile Overview"
          description="Verified academic performance, technical competencies, portfolio projects, and placement cell audit credentials."
          actions={
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <Link
                to="/student/edit-profile"
                className="btn-primary"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "9px 18px",
                  backgroundColor: "var(--accent, #3F754B)",
                  color: "#FAF9F6",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "13.5px",
                  fontWeight: 600,
                  textDecoration: "none",
                  cursor: "pointer",
                }}
              >
                <Edit3 size={15} />
                <span>Edit Full Profile</span>
              </Link>

              <Link
                to="/student/resume"
                className="btn-secondary"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "9px 16px",
                  backgroundColor: "var(--surface, #FFFFFF)",
                  color: "var(--text-primary, #172B24)",
                  border: "1px solid var(--border, #E5E7E1)",
                  borderRadius: "6px",
                  fontSize: "13.5px",
                  fontWeight: 500,
                  textDecoration: "none",
                }}
              >
                <FileText size={15} />
                <span>Manage Resume</span>
              </Link>
            </div>
          }
        />

        {/* Global Feedback Banner */}
        {feedback && (
          <div
            style={{
              padding: "12px 18px",
              borderRadius: "8px",
              backgroundColor: feedback.type === "error" ? "#FEF3F2" : "#EAF2E7",
              border: `1px solid ${feedback.type === "error" ? "#FECDCA" : "#C8DEC4"}`,
              color: feedback.type === "error" ? "#B42318" : "#2E6038",
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

        {/* SECTION 1: Student Identity Header (Hero Card) */}
        <section className="profile-hero-card" aria-label="Student Identity">
          <div className="profile-hero-left">
            <div className="profile-avatar-wrapper">
              <div className="profile-monogram-avatar" aria-hidden="true">
                {initials}
              </div>
              <div className="profile-verified-badge-icon" title="University Verified Candidate">
                <Check size={13} strokeWidth={3} />
              </div>
            </div>

            <div className="profile-hero-identity">
              <h1 className="profile-hero-name">{profile.fullName}</h1>
              <p className="profile-hero-program">
                {profile.degree} · Semester {profile.currentSemester} · Cohort {profile.graduationYear}
              </p>
              <p className="profile-hero-institution">
                {profile.department} · {profile.collegeName}
              </p>

              <div className="profile-identifiers-row">
                <div className="profile-id-chip">
                  <span className="profile-id-chip-label">Roll No:</span>
                  <strong>{profile.studentId}</strong>
                  <button
                    type="button"
                    className="profile-copy-btn"
                    onClick={() => copyToClipboard(profile.studentId, "rollNo")}
                    title="Copy Roll Number"
                  >
                    {copiedKey === "rollNo" ? <Check size={12} color="#3F754B" /> : <Copy size={12} />}
                  </button>
                </div>

                <div className="profile-id-chip">
                  <span className="profile-id-chip-label">PRN / Enroll:</span>
                  <strong>{profile.prn}</strong>
                  <button
                    type="button"
                    className="profile-copy-btn"
                    onClick={() => copyToClipboard(profile.prn, "prn")}
                    title="Copy PRN Number"
                  >
                    {copiedKey === "prn" ? <Check size={12} color="#3F754B" /> : <Copy size={12} />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="profile-hero-right">
            <div className="profile-status-badges-group">
              <div className="status-indicator-pill verified">
                <ShieldCheck size={14} />
                <span>Student Identity Cleared</span>
              </div>

              <div
                className={`status-indicator-pill ${
                  profile.placementVerificationStatus === "verified"
                    ? "verified"
                    : "pending"
                }`}
              >
                {profile.placementVerificationStatus === "verified" ? (
                  <CheckCircle2 size={14} />
                ) : (
                  <Clock size={14} />
                )}
                <span>
                  {profile.placementVerificationStatus === "verified"
                    ? "TPO Placement Audit Verified"
                    : "TPO Placement Audit in Progress"}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Two-Column Responsive Layout */}
        <div className="profile-sections-layout">
          {/* LEFT / MAIN COLUMN */}
          <div className="profile-main-column">
            {/* SECTION 2: Academic Information & Performance */}
            <section className="profile-card-block" aria-labelledby="academic-info-heading">
              <div className="profile-card-header-row">
                <div>
                  <h2 id="academic-info-heading" className="profile-subheading">
                    <GraduationCap className="profile-subheading-icon" size={20} />
                    <span>Academic Qualifications & Performance</span>
                  </h2>
                  <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                    {profile.qualifications.length} Credentials on Record (10th, 12th, UG, PG)
                  </span>
                </div>

                <button
                  type="button"
                  onClick={openAddQualModal}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "6px 14px",
                    backgroundColor: "var(--accent-soft, #EAF2E7)",
                    color: "var(--accent, #3F754B)",
                    border: "1px solid #C8DEC4",
                    borderRadius: "6px",
                    fontSize: "12.5px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  <Plus size={14} />
                  <span>Add Qualification</span>
                </button>
              </div>

              <div className="qualifications-grid">
                {profile.qualifications.map((qual) => {
                  const isCurrent = qual.status === "in_progress" || qual.level === "pg";
                  const hasMarksheet = Boolean(qual.marksheetFilename || qual.marksheetUrl);
                  const isCustom = !["qual-10th", "qual-12th", "qual-ug", "qual-pg"].includes(qual.id);

                  return (
                    <article
                      key={qual.id || qual.level}
                      className={`academic-card ${isCurrent ? "current-degree" : ""}`}
                    >
                      <div className="academic-card-top">
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                            <h3 className="academic-degree-title">{qual.title}</h3>
                            {isCurrent && (
                              <span
                                style={{
                                  fontSize: "10.5px",
                                  textTransform: "uppercase",
                                  letterSpacing: "0.06em",
                                  fontWeight: 700,
                                  backgroundColor: "var(--accent-soft, #EAF2E7)",
                                  color: "var(--accent, #3F754B)",
                                  padding: "2px 8px",
                                  borderRadius: "4px",
                                }}
                              >
                                Current Program · In Progress
                              </span>
                            )}
                          </div>
                          <p className="academic-institution-text">
                            {formatInstitution(qual)}
                            {qual.streamOrSpecialization ? ` · ${qual.streamOrSpecialization}` : ""}
                          </p>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span
                            style={{
                              fontSize: "12px",
                              fontWeight: 600,
                              color: "var(--text-secondary)",
                              backgroundColor: "var(--surface-secondary)",
                              padding: "4px 8px",
                              borderRadius: "4px",
                            }}
                          >
                            {qual.passingYear ? `Class of ${qual.passingYear}` : "Year Pending"}
                          </span>

                          {isCustom && (
                            <button
                              type="button"
                              onClick={() => handleDeleteQual(qual.id)}
                              title="Delete this qualification"
                              style={{
                                background: "none",
                                border: "none",
                                color: "#B42318",
                                cursor: "pointer",
                                padding: "4px",
                              }}
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Academic Metric Numbers */}
                      <div className="academic-details-grid">
                        <div className="academic-metric-item">
                          <span className="academic-metric-label">Grade / Score</span>
                          <span className="academic-metric-val score">
                            {formatScore(qual)}
                          </span>
                        </div>

                        <div className="academic-metric-item">
                          <span className="academic-metric-label">Academic Status</span>
                          <span className="academic-metric-val">
                            {qual.status === "in_progress" ? "In Progress" : "Completed"}
                          </span>
                        </div>

                        {qual.currentSemester && (
                          <div className="academic-metric-item">
                            <span className="academic-metric-label">Current Term</span>
                            <span className="academic-metric-val">Semester {qual.currentSemester}</span>
                          </div>
                        )}

                        <div className="academic-metric-item">
                          <span className="academic-metric-label">Backlogs</span>
                          <span className="academic-metric-val" style={{ color: (qual.activeBacklogs || 0) > 0 ? "#B42318" : "#2E6038" }}>
                            {qual.activeBacklogs || 0} Active {(qual.historicalBacklogs || 0) > 0 ? `(${qual.historicalBacklogs} Historical)` : ""}
                          </span>
                        </div>
                      </div>

                      {/* Marksheet & Edit Action Bar */}
                      <div className="academic-card-actions">
                        <div className="marksheet-status-pill">
                          <FileText size={14} color="var(--text-muted)" />
                          <span>
                            {hasMarksheet ? (
                              qual.marksheetFilename || "Official Marksheet Uploaded"
                            ) : (
                              <span style={{ color: "#B56E09" }}>Marksheet Not Uploaded</span>
                            )}
                          </span>
                          {hasMarksheet && (
                            <span
                              style={{
                                fontSize: "11px",
                                fontWeight: 600,
                                padding: "2px 6px",
                                borderRadius: "4px",
                                backgroundColor:
                                  qual.verificationStatus === "verified"
                                    ? "#EAF2E7"
                                    : "#FEF7EA",
                                color:
                                  qual.verificationStatus === "verified"
                                    ? "#2E6038"
                                    : "#B56E09",
                              }}
                            >
                              {qual.verificationStatus === "verified"
                                ? "Verified"
                                : "Verification Pending"}
                            </span>
                          )}
                        </div>

                        <div className="marksheet-buttons-row">
                          {/* EDIT QUALIFICATION BUTTON */}
                          <button
                            type="button"
                            onClick={() => openEditQualModal(qual)}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "5px",
                              padding: "5px 12px",
                              fontSize: "12px",
                              fontWeight: 600,
                              backgroundColor: "var(--accent-soft, #EAF2E7)",
                              color: "var(--accent, #3F754B)",
                              border: "1px solid #C8DEC4",
                              borderRadius: "4px",
                              cursor: "pointer",
                            }}
                          >
                            <Edit3 size={13} />
                            <span>Edit Details</span>
                          </button>

                          {hasMarksheet && (
                            <button
                              type="button"
                              onClick={() =>
                                setMarksheetModal({
                                  isOpen: true,
                                  mode: "preview",
                                  qualification: qual,
                                })
                              }
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "5px",
                                padding: "5px 10px",
                                fontSize: "12px",
                                fontWeight: 500,
                                backgroundColor: "var(--surface)",
                                color: "var(--accent, #3F754B)",
                                border: "1px solid var(--border)",
                                borderRadius: "4px",
                                cursor: "pointer",
                              }}
                            >
                              <Eye size={13} />
                              <span>Preview</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() =>
                              setMarksheetModal({
                                isOpen: true,
                                mode: "upload",
                                qualification: qual,
                              })
                            }
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "5px",
                              padding: "5px 10px",
                              fontSize: "12px",
                              fontWeight: 500,
                              backgroundColor: "var(--surface-secondary)",
                              color: "var(--text-primary)",
                              border: "1px solid var(--border)",
                              borderRadius: "4px",
                              cursor: "pointer",
                            }}
                          >
                            <UploadCloud size={13} />
                            <span>{hasMarksheet ? "Replace Document" : "Upload Marksheet"}</span>
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>

            {/* SECTION 5: Technical Competencies & Categorized Skills */}
            <section className="profile-card-block" aria-labelledby="skills-heading">
              <div className="profile-card-header-row">
                <h2 id="skills-heading" className="profile-subheading">
                  <Award className="profile-subheading-icon" size={20} />
                  <span>Technical Competencies & Categorized Skills</span>
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    setEditTab("skills");
                    setEditModalOpen(true);
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "12.5px",
                    color: "var(--accent, #3F754B)",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Edit Skills Matrix
                </button>
              </div>

              <div className="skills-categories-container">
                {profile.categorizedSkills.map((cat, idx) => (
                  <div key={idx} className="skill-category-block">
                    <span className="skill-category-heading">{cat.category}</span>
                    <div className="skill-chips-wrap">
                      {cat.skills.map((skill, sIdx) => (
                        <span key={sIdx} className="editorial-skill-chip">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* SECTION 6: Projects & Professional Certifications */}
            <section className="profile-card-block" aria-labelledby="projects-heading">
              <div className="profile-card-header-row">
                <h2 id="projects-heading" className="profile-subheading">
                  <Briefcase className="profile-subheading-icon" size={20} />
                  <span>Capstone Projects & Practical Experience</span>
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    setEditTab("projects");
                    setEditModalOpen(true);
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "12.5px",
                    color: "var(--accent, #3F754B)",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Manage Projects
                </button>
              </div>

              <div className="projects-grid-list">
                {profile.projects.map((proj) => (
                  <article key={proj.id} className="project-editorial-card">
                    <div>
                      <span className="project-category-tag">{proj.category}</span>
                      <h3 className="project-title">{proj.title}</h3>
                      <p className="project-description">{proj.description}</p>

                      <div className="project-tech-pills">
                        {proj.technologies?.map((tech, tIdx) => (
                          <span key={tIdx} className="project-tech-pill">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="project-links-row">
                      {proj.githubUrl && (
                        <a
                          href={proj.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="project-link-item"
                        >
                          <span>Source Code</span>
                          <ExternalLink size={12} />
                        </a>
                      )}
                      {proj.liveUrl && (
                        <a
                          href={proj.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="project-link-item"
                        >
                          <span>Live Demo</span>
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  </article>
                ))}
              </div>

              {/* Certifications Sub-block */}
              <div style={{ marginTop: "16px", paddingTop: "18px", borderTop: "1px solid var(--border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                  <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "17px", margin: 0, color: "var(--text-primary)" }}>
                    Professional Certifications & Credentials
                  </h3>
                </div>

                <div className="certifications-cards-list">
                  {profile.certifications.map((cert) => (
                    <div key={cert.id} className="certification-row-card">
                      <div className="cert-left-meta">
                        <div className="cert-icon-badge">
                          <Award size={18} />
                        </div>
                        <div>
                          <h4 className="cert-title-text">{cert.name}</h4>
                          <p className="cert-issuer-text">
                            {cert.issuingOrganization} · Issued: {cert.issueDate} · ID: {cert.credentialId}
                          </p>
                        </div>
                      </div>

                      {cert.credentialUrl && (
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "5px",
                            fontSize: "12.5px",
                            color: "var(--accent, #3F754B)",
                            fontWeight: 500,
                            textDecoration: "none",
                          }}
                        >
                          <span>Verify</span>
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT / SIDEBAR COLUMN */}
          <aside className="profile-sidebar-column">
            {/* SECTION 8: Profile Completion Widget */}
            <div className="completion-widget-card" aria-label="Profile Completion">
              <div className="completion-header-row">
                <div>
                  <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", fontWeight: 600 }}>
                    Profile Readiness
                  </div>
                  <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "18px", margin: 0, color: "var(--text-primary)" }}>
                    Placement Dossier
                  </h3>
                </div>
                <div className="completion-percentage-text">{completionData.percentage}%</div>
              </div>

              <div className="completion-progress-track">
                <div
                  className="completion-progress-fill"
                  style={{ width: `${completionData.percentage}%` }}
                />
              </div>

              <div className="completion-checklist">
                {completionData.items.map((item, idx) => (
                  <div key={idx} className={`checklist-item ${item.completed ? "done" : ""}`}>
                    <div className="checklist-left">
                      <div className={`check-icon-wrap ${item.completed ? "completed" : "incomplete"}`}>
                        {item.completed ? <Check size={11} strokeWidth={3} /> : <Clock size={11} />}
                      </div>
                      <span>{item.label}</span>
                    </div>
                    <span style={{ fontSize: "11px", fontWeight: 600, color: item.completed ? "#2E6038" : "#B56E09" }}>
                      {item.completed ? "Ready" : "Pending"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 4: Contact & Identity Card */}
            <div className="profile-card-block" aria-labelledby="contact-info-heading">
              <div className="profile-card-header-row">
                <h2 id="contact-info-heading" className="profile-subheading">
                  <Mail className="profile-subheading-icon" size={18} />
                  <span>Contact & Identity</span>
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    setEditTab("identity");
                    setEditModalOpen(true);
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "12px",
                    color: "var(--accent, #3F754B)",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Edit
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div className="contact-info-item">
                  <div className="contact-icon-wrap">
                    <Mail size={15} />
                  </div>
                  <div className="contact-text-wrap">
                    <span className="contact-text-label">College Institutional Email</span>
                    <span className="contact-text-val">{profile.institutionalEmail}</span>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="contact-icon-wrap">
                    <Mail size={15} />
                  </div>
                  <div className="contact-text-wrap">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span className="contact-text-label">Personal Email</span>
                      <button
                        type="button"
                        className="profile-copy-btn"
                        onClick={() => copyToClipboard(profile.personalEmail, "personalEmail")}
                      >
                        {copiedKey === "personalEmail" ? <Check size={11} color="#3F754B" /> : <Copy size={11} />}
                      </button>
                    </div>
                    <span className="contact-text-val">{profile.personalEmail}</span>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="contact-icon-wrap">
                    <Phone size={15} />
                  </div>
                  <div className="contact-text-wrap">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span className="contact-text-label">Primary Mobile</span>
                      <button
                        type="button"
                        className="profile-copy-btn"
                        onClick={() => copyToClipboard(profile.phone, "phone")}
                      >
                        {copiedKey === "phone" ? <Check size={11} color="#3F754B" /> : <Copy size={11} />}
                      </button>
                    </div>
                    <span className="contact-text-val">{profile.phone}</span>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="contact-icon-wrap">
                    <MapPin size={15} />
                  </div>
                  <div className="contact-text-wrap">
                    <span className="contact-text-label">Location & Pin Code</span>
                    <span className="contact-text-val">
                      {profile.address.city}, {profile.address.state}, {profile.address.country} — {profile.address.postalCode}
                    </span>
                  </div>
                </div>

                <div style={{ padding: "12px", backgroundColor: "var(--surface-secondary)", borderRadius: "8px", border: "1px solid var(--border)" }}>
                  <div style={{ fontSize: "11px", textTransform: "uppercase", fontWeight: 600, color: "var(--text-muted)", marginBottom: "4px" }}>
                    Work Relocation Preference
                  </div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--accent, #3F754B)", display: "flex", alignItems: "center", gap: "6px" }}>
                    <CheckCircle size={14} />
                    <span>Open to Relocation across India</span>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "8px" }}>
                    {profile.address.preferredLocations?.map((loc, lIdx) => (
                      <span
                        key={lIdx}
                        style={{
                          fontSize: "11px",
                          backgroundColor: "#FFFFFF",
                          border: "1px solid var(--border)",
                          padding: "2px 7px",
                          borderRadius: "4px",
                          color: "var(--text-secondary)",
                        }}
                      >
                        {loc}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Professional Links */}
                <div style={{ marginTop: "4px", display: "flex", flexDirection: "column", gap: "8px" }}>
                  <span style={{ fontSize: "11px", textTransform: "uppercase", fontWeight: 600, color: "var(--text-muted)" }}>
                    Verified Professional Links
                  </span>

                  {profile.socialLinks?.linkedin && (
                    <a
                      href={profile.socialLinks.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "8px 12px",
                        backgroundColor: "var(--surface-secondary)",
                        borderRadius: "6px",
                        fontSize: "12.5px",
                        color: "var(--text-primary)",
                        textDecoration: "none",
                        border: "1px solid var(--border)",
                      }}
                    >
                      <span style={{ fontWeight: 500 }}>LinkedIn Profile</span>
                      <ExternalLink size={13} color="var(--accent, #3F754B)" />
                    </a>
                  )}

                  {profile.socialLinks?.github && (
                    <a
                      href={profile.socialLinks.github}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "8px 12px",
                        backgroundColor: "var(--surface-secondary)",
                        borderRadius: "6px",
                        fontSize: "12.5px",
                        color: "var(--text-primary)",
                        textDecoration: "none",
                        border: "1px solid var(--border)",
                      }}
                    >
                      <span style={{ fontWeight: 500 }}>GitHub Repositories</span>
                      <ExternalLink size={13} color="var(--accent, #3F754B)" />
                    </a>
                  )}

                  {profile.socialLinks?.portfolio && (
                    <a
                      href={profile.socialLinks.portfolio}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "8px 12px",
                        backgroundColor: "var(--surface-secondary)",
                        borderRadius: "6px",
                        fontSize: "12.5px",
                        color: "var(--text-primary)",
                        textDecoration: "none",
                        border: "1px solid var(--border)",
                      }}
                    >
                      <span style={{ fontWeight: 500 }}>Portfolio Website</span>
                      <ExternalLink size={13} color="var(--accent, #3F754B)" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* SECTION 7: Resume & Professional Documents Card */}
            <div className="profile-card-block" aria-labelledby="resume-info-heading">
              <div className="profile-card-header-row">
                <h2 id="resume-info-heading" className="profile-subheading">
                  <FileText className="profile-subheading-icon" size={18} />
                  <span>Placement Resume</span>
                </h2>
                <Link
                  to="/student/resume"
                  style={{
                    fontSize: "12px",
                    color: "var(--accent, #3F754B)",
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  Manage
                </Link>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px", backgroundColor: "var(--surface-secondary)", borderRadius: "8px", border: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", overflow: "hidden" }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "6px", backgroundColor: "#FFFFFF", display: "grid", placeItems: "center", border: "1px solid var(--border)", flexShrink: 0 }}>
                      <FileText size={18} color="var(--accent, #3F754B)" />
                    </div>
                    <div style={{ overflow: "hidden" }}>
                      <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {profile.resume?.filename || "Aryan_Sharma_Placement_Resume.pdf"}
                      </div>
                      <div style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>
                        PDF · Verified for Placement Drives
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        const res = await fetch("/api/student/resume/preview", {
                          headers: token ? { Authorization: `Bearer ${token}` } : {},
                        });
                        if (!res.ok) throw new Error("Could not load resume.");
                        const blob = await res.blob();
                        const url = URL.createObjectURL(new Blob([blob], { type: "application/pdf" }));
                        window.open(url, "_blank");
                      } catch {
                        window.location.href = "/student/resume";
                      }
                    }}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      padding: "5px 10px",
                      backgroundColor: "var(--surface)",
                      border: "1px solid var(--border)",
                      borderRadius: "4px",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "var(--accent, #3F754B)",
                      cursor: "pointer",
                      flexShrink: 0,
                    }}
                  >
                    <Eye size={12} />
                    <span>Preview</span>
                  </button>
                </div>

                <Link
                  to="/student/resume"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    padding: "9px 14px",
                    backgroundColor: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "6px",
                    fontSize: "12.5px",
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    textDecoration: "none",
                  }}
                >
                  <span>Open Resume Management Portal</span>
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {/* DEDICATED EDIT ACADEMIC QUALIFICATION MODAL */}
        {editQualModal.isOpen && editQualModal.qualification && (
          <div
            className="modal-overlay-backdrop"
            onClick={() => setEditQualModal({ isOpen: false, qualification: null, isNew: false })}
          >
            <div className="editorial-modal-window" style={{ maxWidth: "680px" }} onClick={(e) => e.stopPropagation()}>
              <div className="modal-header-bar">
                <div>
                  <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", fontWeight: 600 }}>
                    Academic Qualification Audit
                  </div>
                  <h3 className="modal-title-text">
                    {editQualModal.isNew
                      ? "Add New Academic Qualification"
                      : `Edit ${editQualModal.qualification.title || "Qualification"}`}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setEditQualModal({ isOpen: false, qualification: null, isNew: false })}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveQualification}>
                <div className="modal-body-scrollable">
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                    <div style={{ gridColumn: "span 2" }}>
                      <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                        Qualification Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={editQualModal.qualification.title || ""}
                        onChange={(e) =>
                          setEditQualModal({
                            ...editQualModal,
                            qualification: { ...editQualModal.qualification, title: e.target.value },
                          })
                        }
                        placeholder="e.g. Secondary School Certificate (Class X)"
                        style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid var(--border)", fontSize: "13.5px" }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                        Qualification Level *
                      </label>
                      <select
                        value={editQualModal.qualification.level || "10th"}
                        onChange={(e) =>
                          setEditQualModal({
                            ...editQualModal,
                            qualification: { ...editQualModal.qualification, level: e.target.value },
                          })
                        }
                        style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid var(--border)", fontSize: "13.5px", backgroundColor: "#FFFFFF" }}
                      >
                        <option value="10th">Secondary Education (10th)</option>
                        <option value="12th">Higher Secondary (12th)</option>
                        <option value="ug">Undergraduate Degree (UG)</option>
                        <option value="pg">Postgraduate Degree (PG)</option>
                        <option value="diploma">Polytechnic / Diploma</option>
                        <option value="other">Other Recognized Credential</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                        Passing / Cohort Year *
                      </label>
                      <input
                        type="number"
                        min="1990"
                        max="2035"
                        required
                        value={editQualModal.qualification.passingYear || ""}
                        onChange={(e) =>
                          setEditQualModal({
                            ...editQualModal,
                            qualification: { ...editQualModal.qualification, passingYear: e.target.value },
                          })
                        }
                        placeholder="e.g. 2020"
                        style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid var(--border)", fontSize: "13.5px" }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                        School or College Name
                      </label>
                      <input
                        type="text"
                        value={editQualModal.qualification.schoolOrCollege || ""}
                        onChange={(e) =>
                          setEditQualModal({
                            ...editQualModal,
                            qualification: { ...editQualModal.qualification, schoolOrCollege: e.target.value },
                          })
                        }
                        placeholder="e.g. St. Xavier's High School"
                        style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid var(--border)", fontSize: "13.5px" }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                        Board or University
                      </label>
                      <input
                        type="text"
                        value={editQualModal.qualification.boardOrUniversity || ""}
                        onChange={(e) =>
                          setEditQualModal({
                            ...editQualModal,
                            qualification: { ...editQualModal.qualification, boardOrUniversity: e.target.value },
                          })
                        }
                        placeholder="e.g. CBSE Board / Central University"
                        style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid var(--border)", fontSize: "13.5px" }}
                      />
                    </div>

                    <div style={{ gridColumn: "span 2" }}>
                      <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                        Stream or Specialization
                      </label>
                      <input
                        type="text"
                        value={editQualModal.qualification.streamOrSpecialization || ""}
                        onChange={(e) =>
                          setEditQualModal({
                            ...editQualModal,
                            qualification: { ...editQualModal.qualification, streamOrSpecialization: e.target.value },
                          })
                        }
                        placeholder="e.g. Science (PCM) / Computer Applications"
                        style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid var(--border)", fontSize: "13.5px" }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                        Score Evaluation Metric
                      </label>
                      <select
                        value={editQualModal.qualification.scoreType || "percentage"}
                        onChange={(e) =>
                          setEditQualModal({
                            ...editQualModal,
                            qualification: { ...editQualModal.qualification, scoreType: e.target.value },
                          })
                        }
                        style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid var(--border)", fontSize: "13.5px", backgroundColor: "#FFFFFF" }}
                      >
                        <option value="percentage">Percentage (%)</option>
                        <option value="cgpa">CGPA (Scale 10.0)</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                        Score / Marks Obtained *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={editQualModal.qualification.score ?? ""}
                        onChange={(e) =>
                          setEditQualModal({
                            ...editQualModal,
                            qualification: { ...editQualModal.qualification, score: e.target.value },
                          })
                        }
                        placeholder={editQualModal.qualification.scoreType === "cgpa" ? "e.g. 8.84" : "e.g. 91.8"}
                        style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid var(--border)", fontSize: "13.5px" }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                        Academic Standing
                      </label>
                      <select
                        value={editQualModal.qualification.status || "completed"}
                        onChange={(e) =>
                          setEditQualModal({
                            ...editQualModal,
                            qualification: { ...editQualModal.qualification, status: e.target.value },
                          })
                        }
                        style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid var(--border)", fontSize: "13.5px", backgroundColor: "#FFFFFF" }}
                      >
                        <option value="completed">Completed / Graduated</option>
                        <option value="in_progress">In Progress (Ongoing)</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                        Current Term (Semester)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={editQualModal.qualification.currentSemester ?? ""}
                        onChange={(e) =>
                          setEditQualModal({
                            ...editQualModal,
                            qualification: { ...editQualModal.qualification, currentSemester: e.target.value },
                          })
                        }
                        placeholder="e.g. 3"
                        style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid var(--border)", fontSize: "13.5px" }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                        Active Backlogs
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={editQualModal.qualification.activeBacklogs ?? 0}
                        onChange={(e) =>
                          setEditQualModal({
                            ...editQualModal,
                            qualification: { ...editQualModal.qualification, activeBacklogs: e.target.value },
                          })
                        }
                        style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid var(--border)", fontSize: "13.5px" }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                        Historical Backlogs
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={editQualModal.qualification.historicalBacklogs ?? 0}
                        onChange={(e) =>
                          setEditQualModal({
                            ...editQualModal,
                            qualification: { ...editQualModal.qualification, historicalBacklogs: e.target.value },
                          })
                        }
                        style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid var(--border)", fontSize: "13.5px" }}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", padding: "16px 24px", borderTop: "1px solid var(--border)", backgroundColor: "#FFFFFF" }}>
                  <button
                    type="button"
                    onClick={() => setEditQualModal({ isOpen: false, qualification: null, isNew: false })}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "var(--surface)",
                      border: "1px solid var(--border)",
                      borderRadius: "6px",
                      fontSize: "13px",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={savingQual}
                    style={{
                      padding: "8px 20px",
                      backgroundColor: "var(--accent, #3F754B)",
                      color: "#FAF9F6",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "13px",
                      fontWeight: 600,
                      cursor: savingQual ? "not-allowed" : "pointer",
                    }}
                  >
                    {savingQual ? "Saving..." : "Save Qualification Details"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* SECTION 3 & C: Marksheet Preview & Upload Modal */}
        {marksheetModal.isOpen && (
          <div className="modal-overlay-backdrop" onClick={() => setMarksheetModal({ isOpen: false, mode: "preview", qualification: null })}>
            <div className="editorial-modal-window" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header-bar">
                <div>
                  <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", fontWeight: 600 }}>
                    Academic Marksheet Audit
                  </div>
                  <h3 className="modal-title-text">{marksheetModal.qualification?.title}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setMarksheetModal({ isOpen: false, mode: "preview", qualification: null })}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="modal-body-scrollable">
                {/* Tabs for Preview vs Upload */}
                <div style={{ display: "flex", gap: "8px", borderBottom: "1px solid var(--border)", paddingBottom: "12px" }}>
                  <button
                    type="button"
                    onClick={() => setMarksheetModal((prev) => ({ ...prev, mode: "preview" }))}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "6px",
                      border: "none",
                      backgroundColor: marksheetModal.mode === "preview" ? "var(--accent, #3F754B)" : "var(--surface-secondary)",
                      color: marksheetModal.mode === "preview" ? "#FAF9F6" : "var(--text-secondary)",
                      fontSize: "12.5px",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    View Current Marksheet
                  </button>

                  <button
                    type="button"
                    onClick={() => setMarksheetModal((prev) => ({ ...prev, mode: "upload" }))}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "6px",
                      border: "none",
                      backgroundColor: marksheetModal.mode === "upload" ? "var(--accent, #3F754B)" : "var(--surface-secondary)",
                      color: marksheetModal.mode === "upload" ? "#FAF9F6" : "var(--text-secondary)",
                      fontSize: "12.5px",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Upload / Replace File
                  </button>
                </div>

                {marksheetModal.mode === "preview" ? (
                  <div>
                    {marksheetModal.qualification?.marksheetFilename ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", backgroundColor: "var(--surface-secondary)", borderRadius: "8px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <FileText size={20} color="var(--accent, #3F754B)" />
                            <div>
                              <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>
                                {marksheetModal.qualification.marksheetFilename}
                              </div>
                              <div style={{ fontSize: "11.5px", color: "var(--text-secondary)" }}>
                                Verification: <strong>{marksheetModal.qualification.verificationStatus === "verified" ? "Officially Verified" : "Pending TPO Audit"}</strong>
                              </div>
                            </div>
                          </div>

                          <div style={{ display: "flex", gap: "8px" }}>
                            <a
                              href={`/api/student/profile/marksheet/${marksheetModal.qualification.id || marksheetModal.qualification.level}`}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                padding: "6px 12px",
                                backgroundColor: "var(--surface)",
                                border: "1px solid var(--border)",
                                borderRadius: "6px",
                                fontSize: "12px",
                                color: "var(--text-primary)",
                                textDecoration: "none",
                                fontWeight: 500,
                              }}
                            >
                              <Download size={13} />
                              <span>Download Document</span>
                            </a>
                          </div>
                        </div>

                        {/* Interactive In-App PDF Preview Container */}
                        <div style={{ border: "1px solid var(--border)", borderRadius: "8px", overflow: "hidden", minHeight: "380px", backgroundColor: "#F3F4EF", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "30px", textAlign: "center" }}>
                          <FileText size={48} color="var(--accent, #3F754B)" style={{ marginBottom: "12px" }} />
                          <h4 style={{ fontFamily: "var(--font-serif)", fontSize: "18px", margin: "0 0 6px", color: "var(--text-primary)" }}>
                            Academic Document Verified for {marksheetModal.qualification.title}
                          </h4>
                          <p style={{ fontSize: "13px", color: "var(--text-secondary)", maxWidth: "440px", margin: "0 0 16px" }}>
                            File: <code>{marksheetModal.qualification.marksheetFilename}</code>. To view full multi-page details with institutional seals, open the authenticated document stream.
                          </p>
                          <a
                            href={`/api/student/profile/marksheet/${marksheetModal.qualification.id || marksheetModal.qualification.level}`}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "8px",
                              padding: "8px 18px",
                              backgroundColor: "var(--accent, #3F754B)",
                              color: "#FAF9F6",
                              borderRadius: "6px",
                              fontSize: "13px",
                              fontWeight: 600,
                              textDecoration: "none",
                            }}
                          >
                            <ExternalLink size={14} />
                            <span>Open In-App Document Stream</span>
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div style={{ textAlign: "center", padding: "40px 20px" }}>
                        <AlertCircle size={36} color="#B56E09" style={{ margin: "0 auto 12px" }} />
                        <h4 style={{ fontFamily: "var(--font-serif)", fontSize: "18px", margin: "0 0 6px" }}>
                          No Marksheet Uploaded
                        </h4>
                        <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "16px" }}>
                          Upload your official grade sheet or transcript to complete institutional verification.
                        </p>
                        <button
                          type="button"
                          onClick={() => setMarksheetModal((prev) => ({ ...prev, mode: "upload" }))}
                          style={{
                            padding: "8px 16px",
                            backgroundColor: "var(--accent, #3F754B)",
                            color: "#FAF9F6",
                            border: "none",
                            borderRadius: "6px",
                            fontSize: "13px",
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                        >
                          Upload Marksheet Now
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <form onSubmit={handleUploadMarksheet} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div
                      className="marksheet-dropzone"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <UploadCloud size={36} color="var(--accent, #3F754B)" />
                      <div>
                        <strong style={{ fontSize: "14px", color: "var(--text-primary)" }}>
                          {uploadFile ? uploadFile.name : "Click to select or drag & drop marksheet"}
                        </strong>
                        <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "4px 0 0" }}>
                          Supported file formats: PDF, PNG, JPG (Maximum size: 5 MB)
                        </p>
                      </div>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg"
                        style={{ display: "none" }}
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            setUploadFile(e.target.files[0]);
                          }
                        }}
                      />
                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                      <button
                        type="button"
                        onClick={() => setMarksheetModal({ isOpen: false, mode: "preview", qualification: null })}
                        style={{
                          padding: "8px 16px",
                          backgroundColor: "var(--surface)",
                          border: "1px solid var(--border)",
                          borderRadius: "6px",
                          fontSize: "13px",
                          cursor: "pointer",
                        }}
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        disabled={!uploadFile || uploading}
                        style={{
                          padding: "8px 18px",
                          backgroundColor: uploadFile ? "var(--accent, #3F754B)" : "#A3BAA8",
                          color: "#FAF9F6",
                          border: "none",
                          borderRadius: "6px",
                          fontSize: "13px",
                          fontWeight: 600,
                          cursor: uploadFile && !uploading ? "pointer" : "not-allowed",
                        }}
                      >
                        {uploading ? "Uploading & Auditing..." : "Submit for Verification"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}

        {/* SECTION 9: Integrated Profile Edit Modal (Global) */}
        {editModalOpen && (
          <div className="modal-overlay-backdrop" onClick={() => setEditModalOpen(false)}>
            <div className="editorial-modal-window" style={{ maxWidth: "840px" }} onClick={(e) => e.stopPropagation()}>
              <div className="modal-header-bar">
                <div>
                  <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", fontWeight: 600 }}>
                    Profile Editor
                  </div>
                  <h3 className="modal-title-text">Update Student Profile Dossier</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Edit Tab Navigation */}
              <div style={{ display: "flex", gap: "6px", padding: "12px 24px 0", borderBottom: "1px solid var(--border)", overflowX: "auto" }}>
                {[
                  { id: "identity", label: "Personal & Contact" },
                  { id: "academic", label: "Academic Records" },
                  { id: "skills", label: "Skills Matrix" },
                  { id: "projects", label: "Projects & Certifications" },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setEditTab(t.id)}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "6px 6px 0 0",
                      border: "none",
                      backgroundColor: editTab === t.id ? "var(--accent, #3F754B)" : "transparent",
                      color: editTab === t.id ? "#FAF9F6" : "var(--text-secondary)",
                      fontSize: "12.5px",
                      fontWeight: 600,
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSaveProfileEdit} style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
                <div className="modal-body-scrollable">
                  {/* TAB 1: Personal & Contact */}
                  {editTab === "identity" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                        <div>
                          <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                            Full Name
                          </label>
                          <input
                            type="text"
                            value={editFormData.fullName || ""}
                            onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })}
                            style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid var(--border)", fontSize: "13.5px" }}
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                            College Roll Number
                          </label>
                          <input
                            type="text"
                            value={editFormData.studentId || ""}
                            onChange={(e) => setEditFormData({ ...editFormData, studentId: e.target.value })}
                            style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid var(--border)", fontSize: "13.5px" }}
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                            PRN / Enrollment Number
                          </label>
                          <input
                            type="text"
                            value={editFormData.prn || ""}
                            onChange={(e) => setEditFormData({ ...editFormData, prn: e.target.value })}
                            style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid var(--border)", fontSize: "13.5px" }}
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                            Primary Phone Number
                          </label>
                          <input
                            type="text"
                            value={editFormData.phone || ""}
                            onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                            style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid var(--border)", fontSize: "13.5px" }}
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                            Personal Email Address
                          </label>
                          <input
                            type="email"
                            value={editFormData.personalEmail || ""}
                            onChange={(e) => setEditFormData({ ...editFormData, personalEmail: e.target.value })}
                            style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid var(--border)", fontSize: "13.5px" }}
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                            City & State
                          </label>
                          <input
                            type="text"
                            value={editFormData.address?.city ? `${editFormData.address.city}, ${editFormData.address.state || ""}` : ""}
                            onChange={(e) => {
                              const [city, state] = e.target.value.split(",");
                              setEditFormData({
                                ...editFormData,
                                address: { ...editFormData.address, city: city?.trim() || "", state: state?.trim() || "" },
                              });
                            }}
                            placeholder="e.g. Hyderabad, Telangana"
                            style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid var(--border)", fontSize: "13.5px" }}
                          />
                        </div>
                      </div>

                      <div style={{ marginTop: "8px" }}>
                        <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                          LinkedIn Profile URL
                        </label>
                        <input
                          type="url"
                          value={editFormData.socialLinks?.linkedin || ""}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              socialLinks: { ...editFormData.socialLinks, linkedin: e.target.value },
                            })
                          }
                          style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid var(--border)", fontSize: "13.5px" }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                          GitHub Profile URL
                        </label>
                        <input
                          type="url"
                          value={editFormData.socialLinks?.github || ""}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              socialLinks: { ...editFormData.socialLinks, github: e.target.value },
                            })
                          }
                          style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid var(--border)", fontSize: "13.5px" }}
                        />
                      </div>
                    </div>
                  )}

                  {/* TAB 2: Academic Records */}
                  {editTab === "academic" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                        <div>
                          <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                            Current Degree Program
                          </label>
                          <input
                            type="text"
                            value={editFormData.degree || ""}
                            onChange={(e) => setEditFormData({ ...editFormData, degree: e.target.value })}
                            style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid var(--border)", fontSize: "13.5px" }}
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                            Department
                          </label>
                          <input
                            type="text"
                            value={editFormData.department || ""}
                            onChange={(e) => setEditFormData({ ...editFormData, department: e.target.value })}
                            style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid var(--border)", fontSize: "13.5px" }}
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                            Cumulative CGPA (0.00 – 10.00)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            max="10"
                            value={editFormData.cgpa ?? ""}
                            onChange={(e) => setEditFormData({ ...editFormData, cgpa: e.target.value })}
                            style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid var(--border)", fontSize: "13.5px" }}
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                            Active Backlog Count
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={editFormData.backlogCount ?? ""}
                            onChange={(e) => setEditFormData({ ...editFormData, backlogCount: e.target.value })}
                            style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid var(--border)", fontSize: "13.5px" }}
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                            Current Semester
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="10"
                            value={editFormData.currentSemester ?? ""}
                            onChange={(e) => setEditFormData({ ...editFormData, currentSemester: e.target.value })}
                            style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid var(--border)", fontSize: "13.5px" }}
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                            Graduation Year
                          </label>
                          <input
                            type="number"
                            min="2020"
                            max="2035"
                            value={editFormData.graduationYear ?? ""}
                            onChange={(e) => setEditFormData({ ...editFormData, graduationYear: e.target.value })}
                            style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid var(--border)", fontSize: "13.5px" }}
                          />
                        </div>
                      </div>

                      <div style={{ marginTop: "10px", padding: "12px", backgroundColor: "var(--surface-secondary)", borderRadius: "8px" }}>
                        <span style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--text-primary)", display: "block", marginBottom: "4px" }}>
                          Individual Qualifications:
                        </span>
                        <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: "0 0 10px" }}>
                          To edit specific qualification details (10th, 12th, UG, PG) including scores, schools, and boards, click the <strong>Edit Details</strong> button directly on each academic card on the main page.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: Skills */}
                  {editTab === "skills" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      <div>
                        <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>
                          Comma-Separated Skills List
                        </label>
                        <textarea
                          rows={4}
                          value={Array.isArray(editFormData.skills) ? editFormData.skills.join(", ") : ""}
                          onChange={(e) => {
                            const arr = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
                            setEditFormData({ ...editFormData, skills: arr });
                          }}
                          style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid var(--border)", fontSize: "13.5px", lineHeight: 1.5 }}
                        />
                        <span style={{ fontSize: "11.5px", color: "var(--text-muted)", display: "block", marginTop: "4px" }}>
                          Separate competencies by commas (e.g. Java, Python, React, PostgreSQL, Docker, AWS)
                        </span>
                      </div>
                    </div>
                  )}

                  {/* TAB 4: Projects & Certifications */}
                  {editTab === "projects" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                        Edit primary project highlight for campus recruitment:
                      </div>

                      {editFormData.projects?.[0] && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px", padding: "14px", backgroundColor: "var(--surface-secondary)", borderRadius: "8px", border: "1px solid var(--border)" }}>
                          <div>
                            <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                              Project Title
                            </label>
                            <input
                              type="text"
                              value={editFormData.projects[0].title || ""}
                              onChange={(e) => {
                                const projs = [...editFormData.projects];
                                projs[0] = { ...projs[0], title: e.target.value };
                                setEditFormData({ ...editFormData, projects: projs });
                              }}
                              style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid var(--border)", fontSize: "13px" }}
                            />
                          </div>

                          <div>
                            <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                              Description & Key Contribution
                            </label>
                            <textarea
                              rows={3}
                              value={editFormData.projects[0].description || ""}
                              onChange={(e) => {
                                const projs = [...editFormData.projects];
                                projs[0] = { ...projs[0], description: e.target.value };
                                setEditFormData({ ...editFormData, projects: projs });
                              }}
                              style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid var(--border)", fontSize: "13px" }}
                            />
                          </div>

                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                            <div>
                              <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                                GitHub Repository
                              </label>
                              <input
                                type="url"
                                value={editFormData.projects[0].githubUrl || ""}
                                onChange={(e) => {
                                  const projs = [...editFormData.projects];
                                  projs[0] = { ...projs[0], githubUrl: e.target.value };
                                  setEditFormData({ ...editFormData, projects: projs });
                                }}
                                style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid var(--border)", fontSize: "13px" }}
                              />
                            </div>

                            <div>
                              <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                                Live Application URL
                              </label>
                              <input
                                type="url"
                                value={editFormData.projects[0].liveUrl || ""}
                                onChange={(e) => {
                                  const projs = [...editFormData.projects];
                                  projs[0] = { ...projs[0], liveUrl: e.target.value };
                                  setEditFormData({ ...editFormData, projects: projs });
                                }}
                                style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid var(--border)", fontSize: "13px" }}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", padding: "16px 24px", borderTop: "1px solid var(--border)", backgroundColor: "#FFFFFF" }}>
                  <button
                    type="button"
                    onClick={() => setEditModalOpen(false)}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "var(--surface)",
                      border: "1px solid var(--border)",
                      borderRadius: "6px",
                      fontSize: "13px",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={savingEdit}
                    style={{
                      padding: "8px 20px",
                      backgroundColor: "var(--accent, #3F754B)",
                      color: "#FAF9F6",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "13px",
                      fontWeight: 600,
                      cursor: savingEdit ? "not-allowed" : "pointer",
                    }}
                  >
                    {savingEdit ? "Synchronizing..." : "Save Changes to Dossier"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
