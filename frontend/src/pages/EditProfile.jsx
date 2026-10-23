import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  AlertCircle,
  X,
  UploadCloud,
  Trash2,
  Plus,
  FileText,
  ExternalLink,
  Eye,
  GraduationCap,
  User,
  Briefcase,
  Award,
  Globe,
  MapPin,
  Phone,
  Mail,
  Building2,
  Sparkles,
  Check,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";
import { useAuth } from "../context/useAuth.js";
import AppLayout from "../components/ui/AppLayout.jsx";
import {
  PageHeader,
  PrimaryButton,
  SecondaryButton,
} from "../components/ui/EditorialComponents.jsx";
import "./EditProfile.css";

// Helper for local storage retrieval
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

const PREDEFINED_LOCATIONS = [
  "Bengaluru",
  "Hyderabad",
  "Pune",
  "Gurugram",
  "Noida",
  "Mumbai",
  "Chennai",
  "Delhi NCR",
];

export default function EditProfile() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  // Active section tab for jump navigation
  const [activeTab, setActiveTab] = useState("all");

  // Form State
  const [formData, setFormData] = useState(null);
  const [initialSnapshot, setInitialSnapshot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [errors, setErrors] = useState({});
  const [uploadingQualId, setUploadingQualId] = useState(null);

  // New item inputs
  const [newSkillInputs, setNewSkillInputs] = useState({});
  const [newCustomCity, setNewCustomCity] = useState("");
  const fileInputRefs = useRef({});

  // Fetch student profile on mount
  const fetchProfile = useCallback(async () => {
    setLoading(true);
    let loaded = null;

    if (token) {
      try {
        const res = await fetch("/api/student/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const json = await res.json();
          if (json.data?.profile) {
            loaded = json.data.profile;
          }
        }
      } catch {
        // Fallback silently to cache
      }
    }

    const cached = readSaved("cprmpStudentProfile", {});

    const degreeVal =
      loaded?.degree || cached.degree || user?.course || "Master of Computer Applications (MCA)";
    const cgpaVal = Number(loaded?.cgpa ?? (cached.cgpa || 8.84));
    const gradYearVal = Number(loaded?.graduationYear || cached.graduationYear || 2027);

    const rawQualifications =
      loaded?.qualifications && loaded.qualifications.length > 0
        ? loaded.qualifications
        : cached.qualifications && cached.qualifications.length > 0
        ? cached.qualifications
        : [];

    const mergedQualifications = mergeQualificationsWithDefaults(
      rawQualifications,
      degreeVal,
      cgpaVal,
      gradYearVal
    );

    const initial = {
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
      currentSemester: Number(loaded?.currentSemester || cached.currentSemester || 3),
      graduationYear: gradYearVal,
      cgpa: cgpaVal,
      backlogCount: Number(loaded?.backlogCount ?? (cached.backlogs || 0)),
      historicalBacklogs: Number(loaded?.historicalBacklogs ?? 0),
      phone: loaded?.phone || cached.phone || "+91 98765 43210",
      alternatePhone: loaded?.alternatePhone || cached.alternatePhone || "+91 87654 32109",
      personalEmail:
        loaded?.personalEmail ||
        cached.personalEmail ||
        "aryan.sharma.dev@gmail.com",
      institutionalEmail:
        user?.email || cached.email || "aryan.sharma@college.edu",
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
          : cached.categorizedSkills && cached.categorizedSkills.length > 0
          ? cached.categorizedSkills
          : DEFAULT_CATEGORIZED_SKILLS,
      skills:
        loaded?.skills && loaded.skills.length > 0
          ? loaded.skills
          : cached.skills && Array.isArray(cached.skills)
          ? cached.skills
          : DEFAULT_CATEGORIZED_SKILLS.flatMap((c) => c.skills),
      projects:
        loaded?.projects && loaded.projects.length > 0
          ? loaded.projects
          : cached.projects && cached.projects.length > 0
          ? cached.projects
          : DEFAULT_PROJECTS,
      certifications:
        loaded?.certifications && loaded.certifications.length > 0
          ? loaded.certifications
          : cached.certifications && cached.certifications.length > 0
          ? cached.certifications
          : DEFAULT_CERTIFICATIONS,
    };

    setFormData(initial);
    setInitialSnapshot(JSON.stringify(initial));
    setLoading(false);
  }, [token, user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Check for unsaved changes
  const isDirty = useMemo(() => {
    if (!formData || !initialSnapshot) return false;
    return JSON.stringify(formData) !== initialSnapshot;
  }, [formData, initialSnapshot]);

  // Candidate Monogram Initials
  const initials = useMemo(() => {
    if (!formData?.fullName) return "AS";
    const parts = formData.fullName.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }, [formData?.fullName]);

  // Simple field updates
  const handleFieldChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Address updates
  const handleAddressChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [key]: value,
      },
    }));
  };

  // Social Links updates
  const handleSocialChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [key]: value,
      },
    }));
  };

  // --------------------------------------------------------------------------
  // QUALIFICATIONS MANAGEMENT
  // --------------------------------------------------------------------------
  const handleQualChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.qualifications];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, qualifications: updated };
    });
  };

  const handleAddQualification = () => {
    const newId = `qual-custom-${Date.now()}`;
    const newQual = {
      id: newId,
      level: "diploma",
      title: "Polytechnic / Diploma / Additional Credential",
      schoolOrCollege: "",
      boardOrUniversity: "",
      streamOrSpecialization: "",
      passingYear: new Date().getFullYear(),
      scoreType: "percentage",
      score: 85.0,
      maxScore: 100,
      status: "completed",
      activeBacklogs: 0,
      historicalBacklogs: 0,
      marksheetUrl: "",
      marksheetFilename: "",
      verificationStatus: "pending",
    };

    setFormData((prev) => ({
      ...prev,
      qualifications: [...prev.qualifications, newQual],
    }));
  };

  const handleDeleteQualification = (id) => {
    setFormData((prev) => ({
      ...prev,
      qualifications: prev.qualifications.filter((q) => q.id !== id),
    }));
  };

  // Upload marksheet directly from editor
  const handleMarksheetUpload = async (qualId, file) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setFeedback({
        type: "error",
        message: "File exceeds 5MB maximum allowed limit.",
      });
      return;
    }

    setUploadingQualId(qualId);
    setFeedback(null);

    try {
      if (token) {
        const bodyFormData = new FormData();
        bodyFormData.append("marksheet", file);

        const res = await fetch(`/api/student/profile/marksheet/${qualId}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: bodyFormData,
        });

        if (res.ok) {
          const json = await res.json();
          const updatedQuals = json.data?.profile?.qualifications;
          if (updatedQuals) {
            setFormData((prev) => ({
              ...prev,
              qualifications: mergeQualificationsWithDefaults(
                updatedQuals,
                prev.degree,
                prev.cgpa,
                prev.graduationYear
              ),
            }));
          }
          setFeedback({
            type: "success",
            message: `Marksheet uploaded successfully for ${qualId.toUpperCase()}!`,
          });
        } else {
          throw new Error("Server rejected marksheet upload");
        }
      } else {
        // Local simulation if offline
        setFormData((prev) => ({
          ...prev,
          qualifications: prev.qualifications.map((q) =>
            q.id === qualId
              ? {
                  ...q,
                  marksheetFilename: file.name,
                  verificationStatus: "pending",
                }
              : q
          ),
        }));
        setFeedback({
          type: "success",
          message: `Marksheet stored locally: ${file.name}`,
        });
      }
    } catch {
      setFeedback({
        type: "error",
        message: "Failed to upload marksheet. Please try again.",
      });
    } finally {
      setUploadingQualId(null);
    }
  };

  // --------------------------------------------------------------------------
  // SKILLS MANAGEMENT
  // --------------------------------------------------------------------------
  const handleRemoveSkill = (categoryIndex, skillToRemove) => {
    setFormData((prev) => {
      const updatedCategories = prev.categorizedSkills.map((cat, idx) => {
        if (idx !== categoryIndex) return cat;
        return {
          ...cat,
          skills: cat.skills.filter((s) => s !== skillToRemove),
        };
      });

      const flatSkills = updatedCategories.flatMap((c) => c.skills);
      return {
        ...prev,
        categorizedSkills: updatedCategories,
        skills: flatSkills,
      };
    });
  };

  const handleAddSkillToCategory = (categoryIndex) => {
    const skillText = (newSkillInputs[categoryIndex] || "").trim();
    if (!skillText) return;

    setFormData((prev) => {
      const updatedCategories = prev.categorizedSkills.map((cat, idx) => {
        if (idx !== categoryIndex) return cat;
        if (cat.skills.includes(skillText)) return cat;
        return {
          ...cat,
          skills: [...cat.skills, skillText],
        };
      });

      const flatSkills = updatedCategories.flatMap((c) => c.skills);
      return {
        ...prev,
        categorizedSkills: updatedCategories,
        skills: flatSkills,
      };
    });

    setNewSkillInputs((prev) => ({ ...prev, [categoryIndex]: "" }));
  };

  // --------------------------------------------------------------------------
  // PROJECTS MANAGEMENT
  // --------------------------------------------------------------------------
  const handleAddProject = () => {
    const newProj = {
      id: `proj-${Date.now()}`,
      title: "New Technical Project",
      category: "Personal Project",
      description: "Brief summary of technical architecture, contributions, and problem solved.",
      technologies: ["React", "Node.js"],
      startDate: "Jan 2026",
      endDate: "Mar 2026",
      role: "Lead Developer",
      githubUrl: "",
      liveUrl: "",
    };

    setFormData((prev) => ({
      ...prev,
      projects: [newProj, ...prev.projects],
    }));
  };

  const handleProjectChange = (index, field, value) => {
    setFormData((prev) => {
      const projs = [...prev.projects];
      projs[index] = { ...projs[index], [field]: value };
      return { ...prev, projects: projs };
    });
  };

  const handleDeleteProject = (id) => {
    setFormData((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
    }));
  };

  // --------------------------------------------------------------------------
  // CERTIFICATIONS MANAGEMENT
  // --------------------------------------------------------------------------
  const handleAddCertification = () => {
    const newCert = {
      id: `cert-${Date.now()}`,
      name: "New Professional Certification",
      issuingOrganization: "Issuing Authority / Cloud Provider",
      issueDate: "2025",
      expirationDate: "Never Expires",
      credentialId: "",
      credentialUrl: "",
      verificationStatus: "verified",
    };

    setFormData((prev) => ({
      ...prev,
      certifications: [newCert, ...prev.certifications],
    }));
  };

  const handleCertChange = (index, field, value) => {
    setFormData((prev) => {
      const certs = [...prev.certifications];
      certs[index] = { ...certs[index], [field]: value };
      return { ...prev, certifications: certs };
    });
  };

  const handleDeleteCert = (id) => {
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((c) => c.id !== id),
    }));
  };

  // --------------------------------------------------------------------------
  // PREFERRED LOCATIONS
  // --------------------------------------------------------------------------
  const toggleLocation = (loc) => {
    setFormData((prev) => {
      const currentLocs = prev.address?.preferredLocations || [];
      const updated = currentLocs.includes(loc)
        ? currentLocs.filter((l) => l !== loc)
        : [...currentLocs, loc];

      return {
        ...prev,
        address: {
          ...prev.address,
          preferredLocations: updated,
        },
      };
    });
  };

  const addCustomCity = (e) => {
    e.preventDefault();
    const city = newCustomCity.trim();
    if (!city) return;

    setFormData((prev) => {
      const currentLocs = prev.address?.preferredLocations || [];
      if (currentLocs.includes(city)) return prev;
      return {
        ...prev,
        address: {
          ...prev.address,
          preferredLocations: [...currentLocs, city],
        },
      };
    });

    setNewCustomCity("");
  };

  // --------------------------------------------------------------------------
  // FORM VALIDATION & SUBMISSION
  // --------------------------------------------------------------------------
  const validate = () => {
    const errs = {};
    if (!formData.fullName?.trim()) errs.fullName = "Full name is required.";
    if (!formData.studentId?.trim()) errs.studentId = "College roll number is required.";
    if (!formData.phone?.trim()) errs.phone = "Phone number is required.";
    if (!formData.degree?.trim()) errs.degree = "Degree program is required.";
    if (!formData.department?.trim()) errs.department = "Department is required.";

    const cgpaNum = parseFloat(formData.cgpa);
    if (isNaN(cgpaNum) || cgpaNum < 0 || cgpaNum > 10) {
      errs.cgpa = "CGPA must be a valid number between 0.0 and 10.0.";
    }

    const backlogsNum = parseInt(formData.backlogCount, 10);
    if (isNaN(backlogsNum) || backlogsNum < 0) {
      errs.backlogCount = "Active backlogs must be a non-negative integer.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!validate()) {
      setFeedback({
        type: "error",
        message: "Please correct the highlighted form errors before saving.",
      });
      window.scrollTo({ top: 120, behavior: "smooth" });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    // Sanitize payload matching allowed profile fields
    const sanitizedQualifications = formData.qualifications.map((q) => ({
      ...q,
      score:
        q.score !== "" && !isNaN(Number(q.score))
          ? Number(q.score)
          : undefined,
      passingYear:
        q.passingYear !== "" && !isNaN(Number(q.passingYear))
          ? parseInt(q.passingYear, 10)
          : undefined,
      currentSemester:
        q.currentSemester !== "" && !isNaN(Number(q.currentSemester))
          ? parseInt(q.currentSemester, 10)
          : undefined,
      activeBacklogs: parseInt(q.activeBacklogs || 0, 10),
      historicalBacklogs: parseInt(q.historicalBacklogs || 0, 10),
    }));

    const profileToSave = {
      fullName: formData.fullName.trim(),
      firstName: formData.firstName || formData.fullName.split(" ")[0] || "Aryan",
      middleName: formData.middleName || "",
      lastName: formData.lastName || formData.fullName.split(" ").slice(1).join(" ") || "Sharma",
      studentId: formData.studentId.trim(),
      prn: formData.prn || "2023MCA042",
      collegeName: formData.collegeName || "University College of Engineering",
      department: formData.department.trim(),
      degree: formData.degree.trim(),
      graduationYear: parseInt(formData.graduationYear || 2027, 10),
      currentSemester: parseInt(formData.currentSemester || 3, 10),
      cgpa: parseFloat(formData.cgpa),
      backlogCount: parseInt(formData.backlogCount || 0, 10),
      phone: formData.phone.trim(),
      personalEmail: formData.personalEmail || "",
      alternatePhone: formData.alternatePhone || "",
      address: formData.address,
      socialLinks: formData.socialLinks,
      qualifications: sanitizedQualifications,
      categorizedSkills: formData.categorizedSkills,
      skills: formData.skills,
      projects: formData.projects,
      certifications: formData.certifications,
    };

    try {
      // 1. Update local storage immediately
      localStorage.setItem("cprmpStudentProfile", JSON.stringify(profileToSave));

      // 2. Call backend PUT /api/student/profile
      if (token) {
        const res = await fetch("/api/student/profile", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(profileToSave),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || "Failed to save profile to server");
        }
      }

      setInitialSnapshot(JSON.stringify(profileToSave));
      setFeedback({
        type: "success",
        message: "Student dossier updated and synchronized successfully! Eligibility status refreshed.",
      });

      // Smooth scroll to top for confirmation feedback
      window.scrollTo({ top: 80, behavior: "smooth" });
    } catch (err) {
      setFeedback({
        type: "error",
        message: err.message || "Failed to update profile. Saved to local cache.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDiscardChanges = () => {
    if (!initialSnapshot) return;
    setFormData(JSON.parse(initialSnapshot));
    setFeedback({
      type: "info",
      message: "Unsaved modifications discarded. Reverted to verified snapshot.",
    });
  };

  if (loading || !formData) {
    return (
      <AppLayout pageTitle="Edit Profile" breadcrumb="Candidate Records">
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
            Loading candidate dossier records...
          </p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout pageTitle="Edit Profile" breadcrumb="Candidate Records">
      <div className="edit-profile-editorial-container">
        {/* Top Header & Sticky Navigation Bar */}
        <div className="edit-top-nav-bar">
          <Link to="/student/profile" className="edit-back-link">
            <ArrowLeft size={14} />
            <span>Return to Profile Overview</span>
          </Link>

          <div className="edit-actions-cluster">
            <div
              className={`edit-save-status-indicator ${isDirty ? "dirty" : "synced"}`}
            >
              {isDirty ? (
                <>
                  <AlertCircle size={13} color="#B56E09" />
                  <span>Unsaved Modifications</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={13} color="#3F754B" />
                  <span>Dossier Synchronized</span>
                </>
              )}
            </div>

            {isDirty && (
              <button
                type="button"
                onClick={handleDiscardChanges}
                className="btn-secondary"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 12px",
                  fontSize: "12.5px",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                <RotateCcw size={13} />
                <span>Discard</span>
              </button>
            )}

            <PrimaryButton
              onClick={handleSubmit}
              disabled={isSubmitting}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "7px",
                padding: "8px 18px",
                fontSize: "13px",
              }}
            >
              <Save size={14} />
              <span>{isSubmitting ? "Synchronizing..." : "Save Dossier"}</span>
            </PrimaryButton>
          </div>
        </div>

        <PageHeader
          eyebrow="ACADEMIC & PROFESSIONAL DOSSIER"
          title="Edit Candidate Information & Records"
          description="Update your verified university identity, academic performance ladder, technical taxonomy, projects, and geographic preferences. All changes synchronize instantly across campus placement eligibility checks."
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

        {/* Section Navigation Tabs */}
        <nav className="edit-tabs-nav-bar" aria-label="Editor Section Tabs">
          {[
            { id: "all", label: "All Sections" },
            { id: "identity", label: "1. Identity & Degree", icon: User },
            { id: "academics", label: "2. Qualifications Ladder", icon: GraduationCap },
            { id: "contact", label: "3. Contact & Address", icon: MapPin },
            { id: "skills", label: "4. Skills Taxonomy", icon: Sparkles },
            { id: "projects", label: "5. Projects Portfolio", icon: Briefcase },
            { id: "certifications", label: "6. Certifications", icon: Award },
            { id: "social", label: "7. Professional Links", icon: Globe },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                className={`edit-tab-btn ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {Icon && <Icon size={14} />}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          {/* SECTION 1: Identity & Academic Standing */}
          {(activeTab === "all" || activeTab === "identity") && (
            <section className="edit-section-card" id="section-identity">
              <div className="edit-section-header">
                <div className="edit-section-title-wrap">
                  <div className="edit-section-icon-badge">
                    <User size={18} />
                  </div>
                  <div>
                    <h2 className="edit-section-title">Candidate Identity & University Enrollment</h2>
                    <p className="edit-section-desc">
                      Legal student identity, enrollment roll number, and degree program credentials.
                    </p>
                  </div>
                </div>
              </div>

              {/* Monogram Candidate Preview Box */}
              <div className="edit-candidate-preview-box">
                <div className="edit-preview-avatar">{initials}</div>
                <div className="edit-preview-info">
                  <span className="edit-preview-name">{formData.fullName || "Student Name"}</span>
                  <span className="edit-preview-meta">
                    {formData.degree} · Roll No: <strong>{formData.studentId}</strong> · PRN:{" "}
                    <strong>{formData.prn}</strong>
                  </span>
                  <span className="edit-preview-meta">
                    {formData.department} · {formData.collegeName}
                  </span>
                </div>
              </div>

              <div className="edit-form-grid-three">
                <div className="edit-form-field">
                  <label className="edit-field-label">
                    <span>Full Legal Name</span>
                    <span className="edit-field-required-asterisk">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => handleFieldChange("fullName", e.target.value)}
                    className="edit-field-input"
                    placeholder="e.g. Aryan Sharma"
                  />
                  {errors.fullName && <span className="edit-field-error-text">{errors.fullName}</span>}
                </div>

                <div className="edit-form-field">
                  <label className="edit-field-label">
                    <span>College Roll Number (Student ID)</span>
                    <span className="edit-field-required-asterisk">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.studentId}
                    onChange={(e) => handleFieldChange("studentId", e.target.value)}
                    className="edit-field-input"
                    placeholder="e.g. MCA2024-042"
                  />
                  {errors.studentId && <span className="edit-field-error-text">{errors.studentId}</span>}
                </div>

                <div className="edit-form-field">
                  <label className="edit-field-label">
                    <span>University PRN / Enrollment Number</span>
                  </label>
                  <input
                    type="text"
                    value={formData.prn}
                    onChange={(e) => handleFieldChange("prn", e.target.value)}
                    className="edit-field-input"
                    placeholder="e.g. 2023MCA042"
                  />
                </div>
              </div>

              <div className="edit-form-grid-two">
                <div className="edit-form-field">
                  <label className="edit-field-label">
                    <span>Affiliated College / Institution</span>
                    <span className="edit-field-required-asterisk">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.collegeName}
                    onChange={(e) => handleFieldChange("collegeName", e.target.value)}
                    className="edit-field-input"
                  />
                </div>

                <div className="edit-form-field">
                  <label className="edit-field-label">
                    <span>Academic Department</span>
                    <span className="edit-field-required-asterisk">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.department}
                    onChange={(e) => handleFieldChange("department", e.target.value)}
                    className="edit-field-input"
                    placeholder="e.g. Department of Computer Applications"
                  />
                  {errors.department && <span className="edit-field-error-text">{errors.department}</span>}
                </div>
              </div>

              <div className="edit-form-grid-four">
                <div className="edit-form-field">
                  <label className="edit-field-label">
                    <span>Current Degree Program</span>
                    <span className="edit-field-required-asterisk">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.degree}
                    onChange={(e) => handleFieldChange("degree", e.target.value)}
                    className="edit-field-input"
                    placeholder="e.g. MCA"
                  />
                  {errors.degree && <span className="edit-field-error-text">{errors.degree}</span>}
                </div>

                <div className="edit-form-field">
                  <label className="edit-field-label">
                    <span>Current Semester</span>
                  </label>
                  <select
                    value={formData.currentSemester}
                    onChange={(e) => handleFieldChange("currentSemester", e.target.value)}
                    className="edit-field-select"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((sem) => (
                      <option key={sem} value={sem}>
                        Semester {sem}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="edit-form-field">
                  <label className="edit-field-label">
                    <span>Graduation Cohort</span>
                  </label>
                  <select
                    value={formData.graduationYear}
                    onChange={(e) => handleFieldChange("graduationYear", e.target.value)}
                    className="edit-field-select"
                  >
                    {[2024, 2025, 2026, 2027, 2028, 2029, 2030].map((yr) => (
                      <option key={yr} value={yr}>
                        Class of {yr}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="edit-form-field">
                  <label className="edit-field-label">
                    <span>Cumulative CGPA (0-10)</span>
                    <span className="edit-field-required-asterisk">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    required
                    value={formData.cgpa}
                    onChange={(e) => handleFieldChange("cgpa", e.target.value)}
                    className="edit-field-input"
                  />
                  {errors.cgpa && <span className="edit-field-error-text">{errors.cgpa}</span>}
                </div>
              </div>

              <div className="edit-form-grid-two">
                <div className="edit-form-field">
                  <label className="edit-field-label">
                    <span>Active Uncleared Backlogs</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={formData.backlogCount}
                    onChange={(e) => handleFieldChange("backlogCount", e.target.value)}
                    className="edit-field-input"
                  />
                  <span className="edit-field-hint">
                    Used to compute deterministic eligibility for recruitment drives.
                  </span>
                  {errors.backlogCount && (
                    <span className="edit-field-error-text">{errors.backlogCount}</span>
                  )}
                </div>

                <div className="edit-form-field">
                  <label className="edit-field-label">
                    <span>Historical Cleared Backlogs</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={formData.historicalBacklogs}
                    onChange={(e) => handleFieldChange("historicalBacklogs", e.target.value)}
                    className="edit-field-input"
                  />
                  <span className="edit-field-hint">
                    Past backlogs successfully cleared in previous semester re-examinations.
                  </span>
                </div>
              </div>
            </section>
          )}

          {/* SECTION 2: Qualifications Ladder (10th, 12th, UG, PG) */}
          {(activeTab === "all" || activeTab === "academics") && (
            <section className="edit-section-card" id="section-academics">
              <div className="edit-section-header">
                <div className="edit-section-title-wrap">
                  <div className="edit-section-icon-badge">
                    <GraduationCap size={18} />
                  </div>
                  <div>
                    <h2 className="edit-section-title">Academic Qualifications & Performance Ladder</h2>
                    <p className="edit-section-desc">
                      Mandatory academic records across Class 10th, Class 12th, Undergraduate, and Postgraduate credentials.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddQualification}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "7px 14px",
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

              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {formData.qualifications.map((qual, qIndex) => {
                  const isCurrent = qual.status === "in_progress" || qual.level === "pg";
                  const isStandard = ["qual-10th", "qual-12th", "qual-ug", "qual-pg"].includes(qual.id);
                  const isUploadingThis = uploadingQualId === qual.id;

                  return (
                    <article
                      key={qual.id || qIndex}
                      className={`edit-qual-card ${isCurrent ? "is-current" : ""}`}
                    >
                      <div className="edit-qual-card-header">
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <span className="edit-qual-level-pill">
                            {qual.level?.toUpperCase() || "QUAL"}
                          </span>
                          <strong style={{ fontSize: "15px", color: "var(--text-primary)" }}>
                            {qual.title || `Qualification Level: ${qual.level}`}
                          </strong>
                          {isCurrent && (
                            <span
                              style={{
                                fontSize: "11px",
                                fontWeight: 600,
                                color: "var(--accent)",
                                backgroundColor: "var(--accent-soft)",
                                padding: "2px 8px",
                                borderRadius: "4px",
                              }}
                            >
                              Current Degree Program
                            </span>
                          )}
                        </div>

                        {!isStandard && (
                          <button
                            type="button"
                            onClick={() => handleDeleteQualification(qual.id)}
                            className="edit-delete-card-btn"
                          >
                            <Trash2 size={13} />
                            <span>Remove</span>
                          </button>
                        )}
                      </div>

                      <div className="edit-form-grid-three">
                        <div className="edit-form-field">
                          <label className="edit-field-label">Degree / Certificate Title</label>
                          <input
                            type="text"
                            value={qual.title || ""}
                            onChange={(e) => handleQualChange(qIndex, "title", e.target.value)}
                            className="edit-field-input"
                          />
                        </div>

                        <div className="edit-form-field">
                          <label className="edit-field-label">Qualification Level</label>
                          <select
                            value={qual.level || "ug"}
                            onChange={(e) => handleQualChange(qIndex, "level", e.target.value)}
                            className="edit-field-select"
                          >
                            <option value="10th">Class 10th (Secondary)</option>
                            <option value="12th">Class 12th (Higher Secondary)</option>
                            <option value="ug">Undergraduate Degree (UG)</option>
                            <option value="pg">Postgraduate Degree (PG)</option>
                            <option value="diploma">Polytechnic / Diploma</option>
                            <option value="other">Other Credential</option>
                          </select>
                        </div>

                        <div className="edit-form-field">
                          <label className="edit-field-label">Completion / Passing Year</label>
                          <input
                            type="number"
                            min="1990"
                            max="2035"
                            value={qual.passingYear || ""}
                            onChange={(e) => handleQualChange(qIndex, "passingYear", e.target.value)}
                            className="edit-field-input"
                          />
                        </div>
                      </div>

                      <div className="edit-form-grid-two">
                        <div className="edit-form-field">
                          <label className="edit-field-label">School / College / Department</label>
                          <input
                            type="text"
                            value={qual.schoolOrCollege || ""}
                            onChange={(e) => handleQualChange(qIndex, "schoolOrCollege", e.target.value)}
                            className="edit-field-input"
                            placeholder="e.g. St. Xavier's High School / University College"
                          />
                        </div>

                        <div className="edit-form-field">
                          <label className="edit-field-label">Board / University</label>
                          <input
                            type="text"
                            value={qual.boardOrUniversity || ""}
                            onChange={(e) => handleQualChange(qIndex, "boardOrUniversity", e.target.value)}
                            className="edit-field-input"
                            placeholder="e.g. CBSE / State Board / Central University"
                          />
                        </div>
                      </div>

                      <div className="edit-form-grid-three">
                        <div className="edit-form-field">
                          <label className="edit-field-label">Stream / Specialization</label>
                          <input
                            type="text"
                            value={qual.streamOrSpecialization || ""}
                            onChange={(e) => handleQualChange(qIndex, "streamOrSpecialization", e.target.value)}
                            className="edit-field-input"
                            placeholder="e.g. Science (PCM) / Computer Science"
                          />
                        </div>

                        <div className="edit-form-field">
                          <label className="edit-field-label">Evaluation Metric</label>
                          <select
                            value={qual.scoreType || "percentage"}
                            onChange={(e) => handleQualChange(qIndex, "scoreType", e.target.value)}
                            className="edit-field-select"
                          >
                            <option value="percentage">Percentage (%)</option>
                            <option value="cgpa">CGPA (Scale 10.0)</option>
                          </select>
                        </div>

                        <div className="edit-form-field">
                          <label className="edit-field-label">
                            <span>Score / Grade Obtained</span>
                            <span className="edit-field-required-asterisk">*</span>
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={qual.score ?? ""}
                            onChange={(e) => handleQualChange(qIndex, "score", e.target.value)}
                            className="edit-field-input"
                            placeholder={qual.scoreType === "cgpa" ? "e.g. 8.84" : "e.g. 94.2"}
                          />
                        </div>
                      </div>

                      <div className="edit-form-grid-three">
                        <div className="edit-form-field">
                          <label className="edit-field-label">Academic Status</label>
                          <select
                            value={qual.status || "completed"}
                            onChange={(e) => handleQualChange(qIndex, "status", e.target.value)}
                            className="edit-field-select"
                          >
                            <option value="completed">Completed / Graduated</option>
                            <option value="in_progress">In Progress (Ongoing)</option>
                          </select>
                        </div>

                        <div className="edit-form-field">
                          <label className="edit-field-label">Active Backlogs</label>
                          <input
                            type="number"
                            min="0"
                            value={qual.activeBacklogs || 0}
                            onChange={(e) => handleQualChange(qIndex, "activeBacklogs", e.target.value)}
                            className="edit-field-input"
                          />
                        </div>

                        <div className="edit-form-field">
                          <label className="edit-field-label">Historical Backlogs</label>
                          <input
                            type="number"
                            min="0"
                            value={qual.historicalBacklogs || 0}
                            onChange={(e) => handleQualChange(qIndex, "historicalBacklogs", e.target.value)}
                            className="edit-field-input"
                          />
                        </div>
                      </div>

                      {/* Marksheet File Upload Row */}
                      <div className="edit-marksheet-section">
                        <div className="edit-marksheet-meta">
                          <FileText size={18} color="var(--accent, #3F754B)" />
                          <div>
                            <div style={{ fontWeight: 600 }}>
                              {qual.marksheetFilename || "Official Marksheet Document Not Uploaded"}
                            </div>
                            <div style={{ fontSize: "11.5px", color: "var(--text-secondary)" }}>
                              {qual.marksheetFilename
                                ? `Verification: ${
                                    qual.verificationStatus === "verified"
                                      ? "Officially Cleared"
                                      : "Pending TPO Audit"
                                  }`
                                : "Upload PDF or image scan (Max 5MB) for institutional audit."}
                            </div>
                          </div>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          {qual.marksheetFilename && (
                            <a
                              href={`/api/student/profile/marksheet/${qual.id || qual.level}`}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "5px",
                                padding: "6px 12px",
                                backgroundColor: "var(--surface)",
                                border: "1px solid var(--border)",
                                borderRadius: "5px",
                                fontSize: "12px",
                                color: "var(--text-primary)",
                                textDecoration: "none",
                                fontWeight: 500,
                              }}
                            >
                              <Eye size={13} />
                              <span>Preview</span>
                            </a>
                          )}

                          <input
                            type="file"
                            accept=".pdf,.png,.jpg,.jpeg"
                            style={{ display: "none" }}
                            ref={(el) => (fileInputRefs.current[qual.id] = el)}
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                handleMarksheetUpload(qual.id, e.target.files[0]);
                              }
                            }}
                          />

                          <button
                            type="button"
                            disabled={isUploadingThis}
                            onClick={() => fileInputRefs.current[qual.id]?.click()}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "6px",
                              padding: "6px 14px",
                              backgroundColor: "var(--surface)",
                              border: "1px solid var(--border)",
                              borderRadius: "5px",
                              fontSize: "12px",
                              fontWeight: 600,
                              color: "var(--accent, #3F754B)",
                              cursor: isUploadingThis ? "not-allowed" : "pointer",
                            }}
                          >
                            <UploadCloud size={14} />
                            <span>
                              {isUploadingThis
                                ? "Uploading..."
                                : qual.marksheetFilename
                                ? "Replace Marksheet"
                                : "Upload Marksheet"}
                            </span>
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          )}

          {/* SECTION 3: Contact & Address Details */}
          {(activeTab === "all" || activeTab === "contact") && (
            <section className="edit-section-card" id="section-contact">
              <div className="edit-section-header">
                <div className="edit-section-title-wrap">
                  <div className="edit-section-icon-badge">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <h2 className="edit-section-title">Contact Information & Residential Location</h2>
                    <p className="edit-section-desc">
                      Official recruitment communication channels, residential address, and placement mobility.
                    </p>
                  </div>
                </div>
              </div>

              <div className="edit-form-grid-two">
                <div className="edit-form-field">
                  <label className="edit-field-label">
                    <span>Official College Email</span>
                  </label>
                  <input
                    type="email"
                    value={formData.institutionalEmail}
                    disabled
                    className="edit-field-input"
                  />
                  <span className="edit-field-hint">
                    Managed by the University Placement Cell. Non-editable.
                  </span>
                </div>

                <div className="edit-form-field">
                  <label className="edit-field-label">
                    <span>Personal Alternate Email</span>
                  </label>
                  <input
                    type="email"
                    value={formData.personalEmail}
                    onChange={(e) => handleFieldChange("personalEmail", e.target.value)}
                    className="edit-field-input"
                    placeholder="e.g. aryan.sharma.dev@gmail.com"
                  />
                </div>
              </div>

              <div className="edit-form-grid-two">
                <div className="edit-form-field">
                  <label className="edit-field-label">
                    <span>Primary Contact Phone</span>
                    <span className="edit-field-required-asterisk">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => handleFieldChange("phone", e.target.value)}
                    className="edit-field-input"
                    placeholder="+91 98765 43210"
                  />
                  {errors.phone && <span className="edit-field-error-text">{errors.phone}</span>}
                </div>

                <div className="edit-form-field">
                  <label className="edit-field-label">
                    <span>Alternate Emergency Phone</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.alternatePhone}
                    onChange={(e) => handleFieldChange("alternatePhone", e.target.value)}
                    className="edit-field-input"
                    placeholder="+91 87654 32109"
                  />
                </div>
              </div>

              <div className="edit-form-grid-two">
                <div className="edit-form-field">
                  <label className="edit-field-label">Current Campus / Hostel Address</label>
                  <input
                    type="text"
                    value={formData.address?.currentAddress || ""}
                    onChange={(e) => handleAddressChange("currentAddress", e.target.value)}
                    className="edit-field-input"
                    placeholder="e.g. Room 304, Campus Graduate Hostel, Hyderabad"
                  />
                </div>

                <div className="edit-form-field">
                  <label className="edit-field-label">Permanent Residential Address</label>
                  <input
                    type="text"
                    value={formData.address?.permanentAddress || ""}
                    onChange={(e) => handleAddressChange("permanentAddress", e.target.value)}
                    className="edit-field-input"
                    placeholder="e.g. Plot 42, Green Avenue, Jubilee Hills, Hyderabad"
                  />
                </div>
              </div>

              <div className="edit-form-grid-four">
                <div className="edit-form-field">
                  <label className="edit-field-label">City</label>
                  <input
                    type="text"
                    value={formData.address?.city || ""}
                    onChange={(e) => handleAddressChange("city", e.target.value)}
                    className="edit-field-input"
                  />
                </div>

                <div className="edit-form-field">
                  <label className="edit-field-label">State</label>
                  <input
                    type="text"
                    value={formData.address?.state || ""}
                    onChange={(e) => handleAddressChange("state", e.target.value)}
                    className="edit-field-input"
                  />
                </div>

                <div className="edit-form-field">
                  <label className="edit-field-label">Country</label>
                  <input
                    type="text"
                    value={formData.address?.country || "India"}
                    onChange={(e) => handleAddressChange("country", e.target.value)}
                    className="edit-field-input"
                  />
                </div>

                <div className="edit-form-field">
                  <label className="edit-field-label">PIN / Postal Code</label>
                  <input
                    type="text"
                    value={formData.address?.postalCode || ""}
                    onChange={(e) => handleAddressChange("postalCode", e.target.value)}
                    className="edit-field-input"
                  />
                </div>
              </div>

              {/* Placement Relocation & Preferred Cities */}
              <div style={{ paddingTop: "12px", borderTop: "1px solid var(--border)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                  <input
                    type="checkbox"
                    id="willingToRelocateCheck"
                    checked={formData.address?.willingToRelocate ?? true}
                    onChange={(e) => handleAddressChange("willingToRelocate", e.target.checked)}
                    style={{ width: "16px", height: "16px", cursor: "pointer", accentColor: "var(--accent)" }}
                  />
                  <label htmlFor="willingToRelocateCheck" style={{ fontSize: "13.5px", fontWeight: 600, color: "var(--text-primary)", cursor: "pointer" }}>
                    Candidate is willing to relocate across India for full-time campus placement
                  </label>
                </div>

                <div>
                  <label className="edit-field-label">Preferred Placement Locations</label>
                  <div className="edit-locations-tags-pool">
                    {PREDEFINED_LOCATIONS.map((city) => {
                      const isSelected = (formData.address?.preferredLocations || []).includes(city);
                      return (
                        <button
                          key={city}
                          type="button"
                          className={`edit-location-chip ${isSelected ? "selected" : ""}`}
                          onClick={() => toggleLocation(city)}
                        >
                          {isSelected && <Check size={12} />}
                          <span>{city}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div style={{ display: "flex", gap: "8px", marginTop: "12px", maxWidth: "340px" }}>
                    <input
                      type="text"
                      placeholder="Add other custom city..."
                      value={newCustomCity}
                      onChange={(e) => setNewCustomCity(e.target.value)}
                      className="edit-field-input"
                      style={{ padding: "6px 10px", fontSize: "12.5px" }}
                    />
                    <button
                      type="button"
                      onClick={addCustomCity}
                      style={{
                        padding: "6px 14px",
                        backgroundColor: "var(--accent-soft)",
                        color: "var(--accent)",
                        border: "1px solid #C8DEC4",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: 600,
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                      }}
                    >
                      + Add City
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* SECTION 4: Skills Matrix & Categorization */}
          {(activeTab === "all" || activeTab === "skills") && (
            <section className="edit-section-card" id="section-skills">
              <div className="edit-section-header">
                <div className="edit-section-title-wrap">
                  <div className="edit-section-icon-badge">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <h2 className="edit-section-title">Technical Skills Taxonomy & Categorization</h2>
                    <p className="edit-section-desc">
                      Organized domain competencies indexed by AI resume matching and criteria engines.
                    </p>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {formData.categorizedSkills.map((domain, catIndex) => (
                  <div key={domain.category || catIndex} className="edit-skills-domain-block">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <h4 className="edit-skills-domain-title">{domain.category}</h4>
                      <span style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>
                        {domain.skills.length} competencies listed
                      </span>
                    </div>

                    <div className="edit-skills-chips-wrap">
                      {domain.skills.map((skill) => (
                        <span key={skill} className="edit-skill-chip">
                          <span>{skill}</span>
                          <button
                            type="button"
                            className="edit-skill-chip-remove"
                            onClick={() => handleRemoveSkill(catIndex, skill)}
                            title={`Remove ${skill}`}
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>

                    <div className="edit-add-skill-inline">
                      <input
                        type="text"
                        placeholder={`Add ${domain.category} skill...`}
                        value={newSkillInputs[catIndex] || ""}
                        onChange={(e) =>
                          setNewSkillInputs((prev) => ({
                            ...prev,
                            [catIndex]: e.target.value,
                          }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddSkillToCategory(catIndex);
                          }
                        }}
                        className="edit-field-input"
                        style={{ padding: "6px 10px", fontSize: "12.5px" }}
                      />
                      <button
                        type="button"
                        onClick={() => handleAddSkillToCategory(catIndex)}
                        style={{
                          padding: "6px 12px",
                          backgroundColor: "var(--accent-soft)",
                          color: "var(--accent)",
                          border: "1px solid #C8DEC4",
                          borderRadius: "6px",
                          fontSize: "12px",
                          fontWeight: 600,
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                        }}
                      >
                        + Add
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* SECTION 5: Projects & Technical Portfolio */}
          {(activeTab === "all" || activeTab === "projects") && (
            <section className="edit-section-card" id="section-projects">
              <div className="edit-section-header">
                <div className="edit-section-title-wrap">
                  <div className="edit-section-icon-badge">
                    <Briefcase size={18} />
                  </div>
                  <div>
                    <h2 className="edit-section-title">Industry Projects & Academic Portfolio</h2>
                    <p className="edit-section-desc">
                      Highlight real-world implementations, software architectures, and active repositories.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddProject}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "7px 14px",
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
                  <span>Add Project</span>
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {formData.projects.map((proj, pIndex) => (
                  <div key={proj.id || pIndex} className="edit-project-item-card">
                    <div className="edit-card-actions-header">
                      <span className="edit-card-index-title">
                        {proj.title || `Project #${pIndex + 1}`}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleDeleteProject(proj.id)}
                        className="edit-delete-card-btn"
                      >
                        <Trash2 size={13} />
                        <span>Delete Project</span>
                      </button>
                    </div>

                    <div className="edit-form-grid-three">
                      <div className="edit-form-field">
                        <label className="edit-field-label">Project Title</label>
                        <input
                          type="text"
                          value={proj.title}
                          onChange={(e) => handleProjectChange(pIndex, "title", e.target.value)}
                          className="edit-field-input"
                        />
                      </div>

                      <div className="edit-form-field">
                        <label className="edit-field-label">Project Category</label>
                        <select
                          value={proj.category || "Major Academic Project"}
                          onChange={(e) => handleProjectChange(pIndex, "category", e.target.value)}
                          className="edit-field-select"
                        >
                          <option value="Major Academic Project">Major Academic Project</option>
                          <option value="Capstone Project">Capstone Project</option>
                          <option value="Personal Project">Personal Project</option>
                          <option value="Open Source Contribution">Open Source Contribution</option>
                        </select>
                      </div>

                      <div className="edit-form-field">
                        <label className="edit-field-label">Student Role</label>
                        <input
                          type="text"
                          value={proj.role || "Lead Developer"}
                          onChange={(e) => handleProjectChange(pIndex, "role", e.target.value)}
                          className="edit-field-input"
                        />
                      </div>
                    </div>

                    <div className="edit-form-grid-two">
                      <div className="edit-form-field">
                        <label className="edit-field-label">Timeline / Start & End</label>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <input
                            type="text"
                            placeholder="e.g. Aug 2026"
                            value={proj.startDate || ""}
                            onChange={(e) => handleProjectChange(pIndex, "startDate", e.target.value)}
                            className="edit-field-input"
                          />
                          <span style={{ alignSelf: "center", color: "var(--text-muted)" }}>to</span>
                          <input
                            type="text"
                            placeholder="e.g. Oct 2026 / Present"
                            value={proj.endDate || ""}
                            onChange={(e) => handleProjectChange(pIndex, "endDate", e.target.value)}
                            className="edit-field-input"
                          />
                        </div>
                      </div>

                      <div className="edit-form-field">
                        <label className="edit-field-label">Tech Stack (comma-separated)</label>
                        <input
                          type="text"
                          value={Array.isArray(proj.technologies) ? proj.technologies.join(", ") : ""}
                          onChange={(e) => {
                            const arr = e.target.value.split(",").map((t) => t.trim()).filter(Boolean);
                            handleProjectChange(pIndex, "technologies", arr);
                          }}
                          className="edit-field-input"
                          placeholder="e.g. React, Node.js, Express, MongoDB"
                        />
                      </div>
                    </div>

                    <div className="edit-form-field">
                      <label className="edit-field-label">Project Summary & Contributions</label>
                      <textarea
                        rows={3}
                        value={proj.description || ""}
                        onChange={(e) => handleProjectChange(pIndex, "description", e.target.value)}
                        className="edit-field-textarea"
                      />
                    </div>

                    <div className="edit-form-grid-two">
                      <div className="edit-form-field">
                        <label className="edit-field-label">GitHub Repository URL</label>
                        <input
                          type="url"
                          value={proj.githubUrl || ""}
                          onChange={(e) => handleProjectChange(pIndex, "githubUrl", e.target.value)}
                          className="edit-field-input"
                          placeholder="https://github.com/username/project"
                        />
                      </div>

                      <div className="edit-form-field">
                        <label className="edit-field-label">Live Deployment Demo URL</label>
                        <input
                          type="url"
                          value={proj.liveUrl || ""}
                          onChange={(e) => handleProjectChange(pIndex, "liveUrl", e.target.value)}
                          className="edit-field-input"
                          placeholder="https://my-app.vercel.app"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* SECTION 6: Certifications & Verified Credentials */}
          {(activeTab === "all" || activeTab === "certifications") && (
            <section className="edit-section-card" id="section-certifications">
              <div className="edit-section-header">
                <div className="edit-section-title-wrap">
                  <div className="edit-section-icon-badge">
                    <Award size={18} />
                  </div>
                  <div>
                    <h2 className="edit-section-title">Certifications & Professional Credentials</h2>
                    <p className="edit-section-desc">
                      Industry recognized badges, cloud certifications, and technical accreditations.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddCertification}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "7px 14px",
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
                  <span>Add Certification</span>
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                {formData.certifications.map((cert, cIndex) => (
                  <div key={cert.id || cIndex} className="edit-cert-item-card">
                    <div className="edit-card-actions-header">
                      <span className="edit-card-index-title">
                        {cert.name || `Certification #${cIndex + 1}`}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleDeleteCert(cert.id)}
                        className="edit-delete-card-btn"
                      >
                        <Trash2 size={13} />
                        <span>Delete Certification</span>
                      </button>
                    </div>

                    <div className="edit-form-grid-two">
                      <div className="edit-form-field">
                        <label className="edit-field-label">Certificate Title</label>
                        <input
                          type="text"
                          value={cert.name}
                          onChange={(e) => handleCertChange(cIndex, "name", e.target.value)}
                          className="edit-field-input"
                          placeholder="e.g. AWS Certified Solutions Architect"
                        />
                      </div>

                      <div className="edit-form-field">
                        <label className="edit-field-label">Issuing Organization</label>
                        <input
                          type="text"
                          value={cert.issuingOrganization}
                          onChange={(e) => handleCertChange(cIndex, "issuingOrganization", e.target.value)}
                          className="edit-field-input"
                          placeholder="e.g. Amazon Web Services / Oracle"
                        />
                      </div>
                    </div>

                    <div className="edit-form-grid-three">
                      <div className="edit-form-field">
                        <label className="edit-field-label">Issue Date</label>
                        <input
                          type="text"
                          value={cert.issueDate || ""}
                          onChange={(e) => handleCertChange(cIndex, "issueDate", e.target.value)}
                          className="edit-field-input"
                          placeholder="e.g. Feb 2025"
                        />
                      </div>

                      <div className="edit-form-field">
                        <label className="edit-field-label">Expiration Date</label>
                        <input
                          type="text"
                          value={cert.expirationDate || ""}
                          onChange={(e) => handleCertChange(cIndex, "expirationDate", e.target.value)}
                          className="edit-field-input"
                          placeholder="e.g. Feb 2028 or Never Expires"
                        />
                      </div>

                      <div className="edit-form-field">
                        <label className="edit-field-label">Credential ID</label>
                        <input
                          type="text"
                          value={cert.credentialId || ""}
                          onChange={(e) => handleCertChange(cIndex, "credentialId", e.target.value)}
                          className="edit-field-input"
                          placeholder="e.g. AWS-SAA-839210"
                        />
                      </div>
                    </div>

                    <div className="edit-form-field">
                      <label className="edit-field-label">Public Verification Link</label>
                      <input
                        type="url"
                        value={cert.credentialUrl || ""}
                        onChange={(e) => handleCertChange(cIndex, "credentialUrl", e.target.value)}
                        className="edit-field-input"
                        placeholder="https://www.credly.com/badges/..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* SECTION 7: Social & Professional Links */}
          {(activeTab === "all" || activeTab === "social") && (
            <section className="edit-section-card" id="section-social">
              <div className="edit-section-header">
                <div className="edit-section-title-wrap">
                  <div className="edit-section-icon-badge">
                    <Globe size={18} />
                  </div>
                  <div>
                    <h2 className="edit-section-title">Web & Professional Profiles</h2>
                    <p className="edit-section-desc">
                      Direct recruiter access to your GitHub code repositories, LinkedIn presence, and online portfolio.
                    </p>
                  </div>
                </div>
              </div>

              <div className="edit-form-grid-two">
                <div className="edit-form-field">
                  <label className="edit-field-label">LinkedIn Profile URL</label>
                  <input
                    type="url"
                    value={formData.socialLinks?.linkedin || ""}
                    onChange={(e) => handleSocialChange("linkedin", e.target.value)}
                    className="edit-field-input"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>

                <div className="edit-form-field">
                  <label className="edit-field-label">GitHub Profile URL</label>
                  <input
                    type="url"
                    value={formData.socialLinks?.github || ""}
                    onChange={(e) => handleSocialChange("github", e.target.value)}
                    className="edit-field-input"
                    placeholder="https://github.com/username"
                  />
                </div>
              </div>

              <div className="edit-form-grid-two">
                <div className="edit-form-field">
                  <label className="edit-field-label">Personal Portfolio / Website</label>
                  <input
                    type="url"
                    value={formData.socialLinks?.portfolio || ""}
                    onChange={(e) => handleSocialChange("portfolio", e.target.value)}
                    className="edit-field-input"
                    placeholder="https://yourdomain.dev"
                  />
                </div>

                <div className="edit-form-field">
                  <label className="edit-field-label">Other Profile (LeetCode / Kaggle / X)</label>
                  <input
                    type="url"
                    value={formData.socialLinks?.other || ""}
                    onChange={(e) => handleSocialChange("other", e.target.value)}
                    className="edit-field-input"
                    placeholder="https://leetcode.com/username"
                  />
                </div>
              </div>
            </section>
          )}

          {/* Sticky Bottom Action Dock */}
          <div className="edit-bottom-action-dock">
            <Link to="/student/profile" className="btn-secondary" style={{ padding: "8px 16px" }}>
              Back to Overview
            </Link>

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              {isDirty && (
                <button
                  type="button"
                  onClick={handleDiscardChanges}
                  className="btn-secondary"
                  style={{ padding: "8px 16px" }}
                >
                  Discard Changes
                </button>
              )}

              <PrimaryButton
                type="submit"
                disabled={isSubmitting}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "9px 22px",
                  fontSize: "13.5px",
                }}
              >
                <Save size={15} />
                <span>{isSubmitting ? "Synchronizing Dossier..." : "Save & Synchronize Profile"}</span>
              </PrimaryButton>
            </div>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
