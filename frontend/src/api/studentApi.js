// frontend/src/api/studentApi.js

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
    err.code = data.code;
    throw err;
  }

  return data;
}

export const studentApi = {
  // 1. Dashboard
  getDashboard: async () => {
    const res = await request("/api/student/dashboard");
    return res.data;
  },

  // 2. Profile
  getProfile: async () => {
    const res = await request("/api/student/profile");
    return res.data?.profile || res.data;
  },

  updateProfile: async (profileData) => {
    const res = await request("/api/student/profile", {
      method: "PATCH",
      body: JSON.stringify(profileData),
    });
    return res.data?.profile || res.data;
  },

  uploadMarksheet: async (qualId, file) => {
    const formData = new FormData();
    formData.append("marksheet", file);

    const res = await fetch(`/api/student/profile/marksheet/${qualId}`, {
      method: "POST",
      headers: {
        ...getAuthHeader(),
      },
      body: formData,
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || "Failed to upload marksheet");
    }
    return data.data?.profile || data.data;
  },

  getMarksheetPreviewUrl: (qualId) => {
    return `/api/student/profile/marksheet/${qualId}`;
  },

  // 3. Placement Drives
  getDrives: async (params = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "" && val !== "all") {
        searchParams.set(key, val);
      }
    });
    const qs = searchParams.toString();
    const url = `/api/student/drives${qs ? `?${qs}` : ""}`;
    const res = await request(url);
    return res.data;
  },

  getDriveById: async (driveId) => {
    const res = await request(`/api/student/drives/${driveId}`);
    return res.data;
  },

  applyToDrive: async (driveId) => {
    const res = await request(`/api/student/drives/${driveId}/apply`, {
      method: "POST",
      body: JSON.stringify({ driveId }),
    });
    return res.data;
  },

  // 4. Applications
  getApplications: async () => {
    const res = await request("/api/student/applications");
    return res.data;
  },

  getApplicationById: async (applicationId) => {
    const res = await request(`/api/student/applications/${applicationId}`);
    return res.data;
  },

  // 5. AI Placement Matching
  getAIMatching: async () => {
    const res = await request("/api/student/ai-matching");
    return res.data;
  },

  // 6. Placement History
  getPlacementHistory: async () => {
    const res = await request("/api/student/placement-history");
    return res.data;
  },

  // 7. Resume Management
  getResumeStatus: async () => {
    const res = await request("/api/student/resume");
    return res.data;
  },

  uploadResume: async (file) => {
    const formData = new FormData();
    formData.append("resume", file);

    const res = await fetch("/api/student/resume", {
      method: "POST",
      headers: {
        ...getAuthHeader(),
      },
      body: formData,
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || "Failed to upload resume");
    }
    return data.data;
  },

  deleteResume: async (id) => {
    const res = await request(`/api/student/resume/${id}`, {
      method: "DELETE",
    });
    return res.data;
  },
};
