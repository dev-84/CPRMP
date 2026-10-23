// frontend/src/api/adminApi.js

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

export const adminApi = {
  // 1. Dashboard
  getDashboardStats: async () => {
    const res = await request("/api/admin/dashboard/stats");
    return res.data;
  },

  getRecentActivity: async () => {
    const res = await request("/api/admin/dashboard/recent-activity");
    return res.data;
  },

  getUpcomingDrives: async (limit = 5) => {
    const res = await request(`/api/admin/dashboard/upcoming-drives?limit=${limit}`);
    return res.data;
  },

  // 2. Students
  getStudents: async (params = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "" && val !== "all") {
        searchParams.set(key, val);
      }
    });
    const queryString = searchParams.toString();
    const url = `/api/admin/students${queryString ? `?${queryString}` : ""}`;
    const res = await request(url);
    return res.data;
  },

  getStudentById: async (id) => {
    const res = await request(`/api/admin/students/${id}`);
    return res.data;
  },

  updateStudentVerification: async (id, payload) => {
    const res = await request(`/api/admin/students/${id}/verification`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    return res.data;
  },

  // 3. Recruiters
  getRecruiters: async (params = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "" && val !== "all") {
        searchParams.set(key, val);
      }
    });
    const queryString = searchParams.toString();
    const url = `/api/admin/recruiters${queryString ? `?${queryString}` : ""}`;
    const res = await request(url);
    return res.data;
  },

  createRecruiter: async (payload) => {
    const res = await request("/api/admin/recruiters", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return res.data;
  },

  updateRecruiter: async (id, payload) => {
    const res = await request(`/api/admin/recruiters/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    return res.data;
  },

  // 4. Drives
  getDrives: async (params = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "" && val !== "all") {
        searchParams.set(key, val);
      }
    });
    const queryString = searchParams.toString();
    const url = `/api/admin/drives${queryString ? `?${queryString}` : ""}`;
    const res = await request(url);
    return res.data;
  },

  createDrive: async (payload) => {
    const res = await request("/api/admin/drives", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return res.data;
  },

  updateDrive: async (id, payload) => {
    const res = await request(`/api/admin/drives/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    return res.data;
  },

  // 5. Companies
  getCompanies: async () => {
    const res = await request("/api/admin/companies");
    return res.data;
  },
};
