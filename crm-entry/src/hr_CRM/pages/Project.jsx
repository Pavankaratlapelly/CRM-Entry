import { useEffect, useState } from "react";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../api/hr.api";

export default function Project() {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    projectName: "",
    duration: "",
    status: "",
    managerId: "",
    departmentId: "",
  });
  const [editingId, setEditingId] = useState(null);

  /* ================= LOAD PROJECTS ================= */
  const loadProjects = async () => {
    try {
      const res = await getProjects();
      setProjects(res.data);
    } catch (error) {
      console.error("Error loading projects:", error);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  /* ================= HANDLE INPUT ================= */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      managerId: Number(formData.managerId),
      departmentId: Number(formData.departmentId),
    };

    try {
      if (editingId) {
        await updateProject(editingId, payload);
      } else {
        await createProject(payload);
      }

      setFormData({
        projectName: "",
        duration: "",
        status: "",
        managerId: "",
        departmentId: "",
      });
      setEditingId(null);
      loadProjects();
    } catch (error) {
      console.error("Error saving project:", error);
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (project) => {
    setFormData({
      projectName: project.projectName,
      duration: project.duration,
      status: project.status,
      managerId: project.managerId,
      departmentId: project.departmentId,
    });
    setEditingId(project.id);
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    try {
      await deleteProject(id);
      loadProjects();
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Project Management</h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded-xl p-6 mb-8 max-w-xl"
      >
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="projectName"
            placeholder="Project Name"
            value={formData.projectName}
            onChange={handleChange}
            className="border p-3 rounded-lg"
            required
          />

          <input
            type="text"
            name="duration"
            placeholder="Duration"
            value={formData.duration}
            onChange={handleChange}
            className="border p-3 rounded-lg"
            required
          />

          <input
            type="text"
            name="status"
            placeholder="Status"
            value={formData.status}
            onChange={handleChange}
            className="border p-3 rounded-lg"
            required
          />

          <input
            type="number"
            name="managerId"
            placeholder="Manager ID"
            value={formData.managerId}
            onChange={handleChange}
            className="border p-3 rounded-lg"
            required
          />

          <input
            type="number"
            name="departmentId"
            placeholder="Department ID"
            value={formData.departmentId}
            onChange={handleChange}
            className="border p-3 rounded-lg"
            required
          />
        </div>

        <button
          type="submit"
          className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg"
        >
          {editingId ? "Update Project" : "Add Project"}
        </button>
      </form>

      {/* Table */}
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Project List</h2>

        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Duration</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Manager</th>
              <th className="p-3 border">Department</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id}>
                <td className="p-3 border">{project.projectName}</td>
                <td className="p-3 border">{project.duration}</td>
                <td className="p-3 border">{project.status}</td>
                <td className="p-3 border">{project.managerId}</td>
                <td className="p-3 border">{project.departmentId}</td>
                <td className="p-3 border space-x-2">
                  <button
                    onClick={() => handleEdit(project)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
