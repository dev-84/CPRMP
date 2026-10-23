import React, { useState, useEffect } from "react";
import {
  Building2,
  Globe,
  MapPin,
  Mail,
  Phone,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Save,
  Edit2,
  Users,
  Briefcase,
  ExternalLink,
} from "lucide-react";
import AppLayout from "../../components/ui/AppLayout.jsx";
import { PageHeader } from "../../components/ui/EditorialComponents.jsx";
import { recruiterApi } from "../../api/recruiterApi.js";
import "./CompanyProfile.css";

export default function CompanyProfile() {
  const [company, setCompany] = useState(null);
  const [recruiterInfo, setRecruiterInfo] = useState({});
  const [availableCompanies, setAvailableCompanies] = useState([]);
  const [isAffiliating, setIsAffiliating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form State for editing company
  const [formData, setFormData] = useState({
    description: "",
    website: "",
    headquarters: "",
    contactEmail: "",
    industry: "",
    size: "",
    phone: "",
    jobTitle: "",
    recruiterPhone: "",
  });

  // Affiliation State for selecting or creating company
  const [affiliationData, setAffiliationData] = useState({
    companyId: "",
    tab: "select", // "select" or "register"
    newCompanyName: "",
    newIndustry: "Technology & Software",
    newHeadquarters: "India",
    newWebsite: "",
    jobTitle: "",
    recruiterPhone: "",
  });

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await recruiterApi.getCompany();
      setCompany(res.company);
      setRecruiterInfo(res.recruiterInfo || {});
      if (res.availableCompanies) {
        setAvailableCompanies(res.availableCompanies);
        if (!res.company && res.availableCompanies.length > 0) {
          setAffiliationData((prev) => ({
            ...prev,
            companyId: res.availableCompanies[0]._id,
            jobTitle: res.recruiterInfo?.jobTitle || "Talent Acquisition Partner",
            recruiterPhone: res.recruiterInfo?.phone || "",
          }));
        }
      }

      if (!res.company) {
        setIsAffiliating(true);
      }

      setFormData({
        description: res.company?.description || "",
        website: res.company?.website || "",
        headquarters: res.company?.headquarters || "",
        contactEmail: res.company?.contactEmail || "",
        industry: res.company?.industry || "",
        size: res.company?.size || "500-1000 employees",
        phone: res.company?.phone || "",
        jobTitle: res.recruiterInfo?.jobTitle || "",
        recruiterPhone: res.recruiterInfo?.phone || "",
      });
    } catch (err) {
      setError(err.message || "Failed to load company profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAffiliationSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      setSuccessMsg(null);

      const payload = {
        jobTitle: affiliationData.jobTitle || "Talent Acquisition Partner",
        recruiterPhone: affiliationData.recruiterPhone,
      };

      if (affiliationData.tab === "select") {
        if (!affiliationData.companyId) {
          setError("Please select an authorized partner company from the list.");
          setSaving(false);
          return;
        }
        payload.companyId = affiliationData.companyId;
      } else {
        if (!affiliationData.newCompanyName.trim()) {
          setError("Company Name is required to register an organization.");
          setSaving(false);
          return;
        }
        payload.newCompanyName = affiliationData.newCompanyName.trim();
        payload.industry = affiliationData.newIndustry;
        payload.headquarters = affiliationData.newHeadquarters;
        payload.website = affiliationData.newWebsite;
      }

      const res = await recruiterApi.updateCompany(payload);
      setCompany(res.company);
      setRecruiterInfo(res.recruiterInfo || {});
      if (res.availableCompanies) setAvailableCompanies(res.availableCompanies);
      setIsAffiliating(false);
      setSuccessMsg("Corporate organization affiliated successfully! Recruiter workspace is now fully activated.");
      fetchProfile();
    } catch (err) {
      setError(err.message || "Failed to affiliate company");
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      setSuccessMsg(null);

      // Validate URL if present
      if (formData.website && !formData.website.startsWith("http://") && !formData.website.startsWith("https://")) {
        formData.website = `https://${formData.website}`;
      }

      const res = await recruiterApi.updateCompany(formData);
      setCompany(res.company);
      setRecruiterInfo(res.recruiterInfo || {});
      setSuccessMsg("Company profile and contact records updated successfully.");
      setIsEditing(false);
    } catch (err) {
      setError(err.message || "Failed to update company profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppLayout
      pageTitle="Company Profile"
      breadcrumb="Recruiter Portal / Company"
    >
      <div className="company-profile-root">
        <PageHeader
          eyebrow="Corporate Identity & Governance"
          title="Company Profile"
          description="Manage official institutional information, organizational profile, and recruitment liaison details."
          actions={
            company && !isAffiliating && !isEditing ? (
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  type="button"
                  className="btn-secondary btn-sm"
                  onClick={() => {
                    setIsAffiliating(true);
                    setAffiliationData((prev) => ({
                      ...prev,
                      companyId: company._id || "",
                      jobTitle: recruiterInfo.jobTitle || "",
                      recruiterPhone: recruiterInfo.phone || "",
                    }));
                  }}
                  style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                >
                  <Building2 size={14} /> Change Organization
                </button>
                <button
                  type="button"
                  className="btn-edit-toggle"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit2 size={15} /> Edit Corporate Info
                </button>
              </div>
            ) : null
          }
        />

        {successMsg && (
          <div className="alert-banner alert-success">
            <CheckCircle2 size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        {error && (
          <div className="alert-banner alert-error">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="company-loading-card">
            <div className="loading-spinner" />
            <p>Retrieving authorized company corporate records...</p>
          </div>
        ) : !company || isAffiliating ? (
          /* Corporate Affiliation & Onboarding Card */
          <div className="company-affiliation-card">
            <div className="affiliation-header">
              <div className="affiliation-icon">
                <Building2 size={28} color="#3F754B" />
              </div>
              <div className="affiliation-title-block">
                <h3>{company ? "Change Corporate Affiliation" : "Connect Your Corporate Profile"}</h3>
                <p>
                  {company
                    ? "Link your recruiter account to another verified institutional partner or register a new enterprise."
                    : "Your recruiter account is not yet assigned to an authorized company. Choose an approved partner organization or register your enterprise to immediately unlock placement drives and candidate review."}
                </p>
              </div>
              {company && (
                <button
                  type="button"
                  className="btn-cancel-edit"
                  onClick={() => setIsAffiliating(false)}
                >
                  Cancel
                </button>
              )}
            </div>

            {/* Tab Switcher */}
            <div className="affiliation-tabs">
              <button
                type="button"
                className={`affiliation-tab ${affiliationData.tab === "select" ? "active" : ""}`}
                onClick={() => setAffiliationData({ ...affiliationData, tab: "select" })}
              >
                Select Approved Campus Partner ({availableCompanies.length})
              </button>
              <button
                type="button"
                className={`affiliation-tab ${affiliationData.tab === "register" ? "active" : ""}`}
                onClick={() => setAffiliationData({ ...affiliationData, tab: "register" })}
              >
                Register New Enterprise Entity
              </button>
            </div>

            <form onSubmit={handleAffiliationSubmit} className="affiliation-form">
              {affiliationData.tab === "select" ? (
                <div className="form-group">
                  <label>Approved Corporate Partner *</label>
                  <select
                    value={affiliationData.companyId}
                    onChange={(e) => setAffiliationData({ ...affiliationData, companyId: e.target.value })}
                    required
                    className="affiliation-select"
                  >
                    <option value="">-- Select an Approved Company --</option>
                    {availableCompanies.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name} · {c.industry || "Technology"} ({c.headquarters || "India"})
                      </option>
                    ))}
                  </select>
                  <small className="field-hint">
                    Choose from institutions officially approved for campus recruitment on the CPRMP registry.
                  </small>
                </div>
              ) : (
                <>
                  <div className="form-group">
                    <label>Enterprise Legal Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Amazon Development Centre"
                      value={affiliationData.newCompanyName}
                      onChange={(e) => setAffiliationData({ ...affiliationData, newCompanyName: e.target.value })}
                    />
                  </div>
                  <div className="form-row-2">
                    <div className="form-group">
                      <label>Industry Sector</label>
                      <input
                        type="text"
                        placeholder="e.g. Cloud & AI / FinTech"
                        value={affiliationData.newIndustry}
                        onChange={(e) => setAffiliationData({ ...affiliationData, newIndustry: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Headquarters Location</label>
                      <input
                        type="text"
                        placeholder="e.g. Bangalore / Hyderabad, India"
                        value={affiliationData.newHeadquarters}
                        onChange={(e) => setAffiliationData({ ...affiliationData, newHeadquarters: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Official Corporate Website</label>
                    <input
                      type="text"
                      placeholder="https://company.com"
                      value={affiliationData.newWebsite}
                      onChange={(e) => setAffiliationData({ ...affiliationData, newWebsite: e.target.value })}
                    />
                  </div>
                </>
              )}

              <div className="form-row-2" style={{ marginTop: "12px", borderTop: "1px solid #E5E7E1", paddingTop: "16px" }}>
                <div className="form-group">
                  <label>Your Job Title / Corporate Role</label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Talent Acquisition Specialist"
                    value={affiliationData.jobTitle}
                    onChange={(e) => setAffiliationData({ ...affiliationData, jobTitle: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Direct Liaison Contact Phone</label>
                  <input
                    type="text"
                    placeholder="e.g. +91 98765 43210"
                    value={affiliationData.recruiterPhone}
                    onChange={(e) => setAffiliationData({ ...affiliationData, recruiterPhone: e.target.value })}
                  />
                </div>
              </div>

              <div className="affiliation-form-actions">
                <button type="submit" className="btn-confirm-affiliation" disabled={saving}>
                  <CheckCircle2 size={16} />
                  {saving ? "Confirming Affiliation..." : "Confirm Affiliation & Unlock Recruiter Workspace"}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="company-layout-grid">
            {/* Left Card: Company Badge & Overview */}
            <div className="company-sidebar-card">
              <div className="company-avatar-large">
                {company.name ? company.name.substring(0, 2).toUpperCase() : "CO"}
              </div>

              <h2 className="company-headline">{company.name}</h2>
              <span className="industry-pill">{company.industry || "Technology & Software"}</span>

              <div className="verification-status-pill verified">
                <ShieldCheck size={14} /> University Verified Partner
              </div>

              <div className="company-quick-facts">
                <div className="fact-item">
                  <MapPin size={14} color="#68766D" />
                  <span>{company.headquarters || "India"}</span>
                </div>
                <div className="fact-item">
                  <Globe size={14} color="#68766D" />
                  {company.website ? (
                    <a href={company.website} target="_blank" rel="noreferrer" className="website-link">
                      {company.website.replace(/^https?:\/\//, "")} <ExternalLink size={11} />
                    </a>
                  ) : (
                    <span>Not configured</span>
                  )}
                </div>
                <div className="fact-item">
                  <Mail size={14} color="#68766D" />
                  <span>{company.contactEmail || "N/A"}</span>
                </div>
                <div className="fact-item">
                  <Users size={14} color="#68766D" />
                  <span>{company.size || "Enterprise"}</span>
                </div>
              </div>

              <div className="security-notice-box">
                <small>
                  <strong>Data Integrity Note:</strong> Legal company name changes and tax/legal registration
                  modifications require institutional verification through the Placement Cell.
                </small>
              </div>
            </div>

            {/* Right Card: Detailed Profile Form */}
            <div className="company-main-card">
              <div className="card-header-bar">
                <div>
                  <h3 className="card-heading">Corporate Information</h3>
                  <p className="card-subheading">
                    {isEditing
                      ? "Update public corporate description, liaison details, and recruitment guidelines."
                      : "Information displayed to eligible students during recruitment drives."}
                  </p>
                </div>
                {isEditing && (
                  <button
                    type="button"
                    className="btn-cancel-edit"
                    onClick={() => {
                      setIsEditing(false);
                      setError(null);
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="company-form">
                {/* Read-Only Company Name */}
                <div className="form-group">
                  <label>Legal Corporate Entity</label>
                  <input
                    type="text"
                    value={company.name}
                    disabled
                    className="input-disabled"
                  />
                  <small className="field-hint">
                    Official organization name on campus partnership registry (locked by admin).
                  </small>
                </div>

                {/* Industry & Size */}
                <div className="form-row-2">
                  <div className="form-group">
                    <label>Industry Sector</label>
                    <input
                      type="text"
                      name="industry"
                      value={formData.industry}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="e.g. Cloud Computing & AI Systems"
                      className={!isEditing ? "input-disabled" : ""}
                    />
                  </div>

                  <div className="form-group">
                    <label>Company Size</label>
                    <input
                      type="text"
                      name="size"
                      value={formData.size}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="e.g. 1,000–5,000 employees"
                      className={!isEditing ? "input-disabled" : ""}
                    />
                  </div>
                </div>

                {/* Headquarters & Website */}
                <div className="form-row-2">
                  <div className="form-group">
                    <label>Corporate Headquarters / Location</label>
                    <input
                      type="text"
                      name="headquarters"
                      value={formData.headquarters}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="e.g. Hyderabad / Bengaluru, India"
                      className={!isEditing ? "input-disabled" : ""}
                    />
                  </div>

                  <div className="form-group">
                    <label>Official Website</label>
                    <input
                      type="text"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="https://example.com"
                      className={!isEditing ? "input-disabled" : ""}
                    />
                  </div>
                </div>

                {/* Corporate Email & Corporate Phone */}
                <div className="form-row-2">
                  <div className="form-group">
                    <label>Campus Recruitment Email</label>
                    <input
                      type="email"
                      name="contactEmail"
                      value={formData.contactEmail}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="campus-recruitment@company.com"
                      className={!isEditing ? "input-disabled" : ""}
                    />
                  </div>

                  <div className="form-group">
                    <label>Corporate Contact Phone</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="+91 80 4000 0000"
                      className={!isEditing ? "input-disabled" : ""}
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="form-group">
                  <label>Company Overview & Culture</label>
                  <textarea
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="Provide a comprehensive summary of your organization's mission, engineering culture, and career prospects for graduating students..."
                    className={!isEditing ? "input-disabled" : ""}
                  />
                  <small className="field-hint">
                    This narrative appears on drive announcements and student opportunity view.
                  </small>
                </div>

                {/* Recruiter Liaison Section */}
                <div className="form-section-divider">
                  <h4>Recruiter Account Liaison Details</h4>
                  <p>Designated contact person coordinating campus placements.</p>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label>Your Professional Title</label>
                    <input
                      type="text"
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="e.g. Lead Campus Recruiter — India"
                      className={!isEditing ? "input-disabled" : ""}
                    />
                  </div>

                  <div className="form-group">
                    <label>Your Direct Phone Number</label>
                    <input
                      type="text"
                      name="recruiterPhone"
                      value={formData.recruiterPhone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="+91 98765 43210"
                      className={!isEditing ? "input-disabled" : ""}
                    />
                  </div>
                </div>

                {/* Submit Actions */}
                {isEditing && (
                  <div className="form-action-footer">
                    <button
                      type="button"
                      className="btn-cancel-edit"
                      onClick={() => setIsEditing(false)}
                      disabled={saving}
                    >
                      Cancel Changes
                    </button>
                    <button
                      type="submit"
                      className="btn-save-company"
                      disabled={saving}
                    >
                      <Save size={15} />
                      {saving ? "Saving Changes..." : "Save Corporate Profile"}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
