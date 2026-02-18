import api from "./hr.api";

// ================= BRANCH API =================

export const getBranches = () => api.get("/Branch");

export const createBranch = (data) => api.post("/Branch", data);

export const updateBranch = (branchId, data) =>
  api.put(`/Branch/${branchId}`, data);

export const deleteBranch = (branchId) => api.delete(`/Branch/${branchId}`);
