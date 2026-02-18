import axios from "axios";

// /* =====================================================
//    AXIOS INSTANCE
// ===================================================== */

const api = axios.create({
  baseURL: "http://89.116.20.215:9095/api", // 🔥 Swagger backend base
  headers: {
    "Content-Type": "application/json",
  },
});




/* ================= EMPLOYEE ================= */

// GET /api/Employee
export const getEmployees = () => {
  return api.get("/Employee");
};

// POST /api/Employee
export const createEmployee = (data) => {
  return api.post("/Employee", data);
};

// PUT /api/Employee/{id}
export const updateEmployee = (id, data) => {
  return api.put(`/Employee/${id}`, data);
};

// DELETE /api/Employee/{id}
export const deleteEmployee = (id) => {
  return api.delete(`/Employee/${id}`);
};


/* ================= ATTENDANCE ================= */

/* ================= BRANCH ================= */

// GET /api/Branch
export const getBranches = () => {
  return api.get("/Branch");
};

// POST /api/Branch
export const createBranch = (data) => {
  return api.post("/Branch", data);
};

// PUT /api/Branch/{id}
export const updateBranch = (id, data) => {
  return api.put(`/Branch/${id}`, data);
};

// DELETE /api/Branch/{id}
export const deleteBranch = (id) => {
  return api.delete(`/Branch/${id}`);
};


/* ================= PROJECT ================= */

// GET /api/Project
export const getProjects = () => {
  return api.get("/Project");
};

// POST /api/Project
export const createProject = (data) => {
  return api.post("/Project", data);
};

// PUT /api/Project/{id}
export const updateProject = (id, data) => {
  return api.put(`/Project/${id}`, data);
};

// DELETE /api/Project/{id}
export const deleteProject = (id) => {
  return api.delete(`/Project/${id}`);
};



export default api;
