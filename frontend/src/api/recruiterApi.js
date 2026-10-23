// frontend/src/api/recruiterApi.js

function getAuthHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(url, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...getAuthHeader(),
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    const err = new Error(errorMsg);
    err.status = response.status;
    err.data = data;
    throw err;
  }

  return data;
}

export const recruiterApi = {
  // 1. Dashboard
  getDashboard: async () => {
    const res = await request("/api/recruiter/dashboard");
    return res.data;
  },

  // 2. Company Profile
  getCompany: async () => {
    const res = await request("/api/recruiter/company");
    return res.data;
  },

  updateCompany: async (updateData) => {
    const res = await request("/api/recruiter/company", {
      method: "PATCH",
      body: JSON.stringify(updateData),
    });
    return res.data;
  },

  // 3. Placement Drives
  getDrives: async (params = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "" && val !== "all") {
        searchParams.set(key, val);
      }
    });
    const queryString = searchParams.toString();
    const url = `/api/recruiter/drives${queryString ? `?${queryString}` : ""}`;
    const res = await request(url);
    return res.data;
  },

  getDriveById: async (id) => {
    const res = await request(`/api/recruiter/drives/${id}`);
    return res.data;
  },

  createDrive: async (driveData) => {
    const res = await request("/api/recruiter/drives", {
      method: "POST",
      body: JSON.stringify(driveData),
    });
    return res.data;
  },

  updateDrive: async (id, updateData) => {
    const res = await request(`/api/recruiter/drives/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updateData),
    });
    return res.data;
  },

  updateDriveStatus: async (id, status) => {
    const res = await request(`/api/recruiter/drives/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    return res.data;
  },

  // 4. Applicants
  getApplicants: async (params = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "" && val !== "all") {
        searchParams.set(key, val);
      }
    });
    const queryString = searchParams.toString();
    const url = `/api/recruiter/applicants${queryString ? `?${queryString}` : ""}`;
    const res = await request(url);
    return res.data;
  },

  getApplicantById: async (id) => {
    const res = await request(`/api/recruiter/applicants/${id}`);
    return res.data;
  },

  updateApplicantStatus: async (id, { status, note, interviewRound }) => {
    const res = await request(`/api/recruiter/applicants/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status, note, interviewRound }),
    });
    return res.data;
  },

  bulkUpdateApplicantStatus: async ({ applicationIds, status, note }) => {
    const res = await request("/api/recruiter/applicants/bulk-status", {
      method: "POST",
      body: JSON.stringify({ applicationIds, status, note }),
    });
    return res.data;
  },

  // 5. Shortlisting Workspace
  getShortlisting: async (params = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "" && val !== "all") {
        searchParams.set(key, val);
      }
    });
    const queryString = searchParams.toString();
    const url = `/api/recruiter/shortlisting${queryString ? `?${queryString}` : ""}`;
    const res = await request(url);
    return res.data;
  },

  // 6. Recruitment Status & Pipeline
  getRecruitmentStatus: async (params = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "" && val !== "all") {
        searchParams.set(key, val);
      }
    });
    const queryString = searchParams.toString();
    const url = `/api/recruiter/recruitment-status${queryString ? `?${queryString}` : ""}`;
    const res = await request(url);
    return res.data;
  },
};

export default recruiterApi;
