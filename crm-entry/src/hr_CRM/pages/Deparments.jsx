import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "http://89.116.20.215:9095/api";

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedBranchId, setSelectedBranchId] = useState("");
  const [form, setForm] = useState({
    departmentName: "",
    branchId: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    fetchBranches();
  }, []);

  useEffect(() => {
    if (selectedBranchId) {
      fetchDepartments(selectedBranchId);
      setForm({ ...form, branchId: selectedBranchId });
    } else {
      setDepartments([]);
      setForm({ ...form, branchId: "" });
    }
  }, [selectedBranchId]);

  const fetchBranches = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/Branch`);
      // Only Active branches
      const activeBranches = res.data.filter(
        (b) => b.status.toLowerCase() === "active"
      );
      setBranches(activeBranches);
    } catch (error) {
      console.error("Branch fetch error:", error);
    }
  };

  const fetchDepartments = async (branchId) => {
    try {
      const res = await axios.get(`${BASE_URL}/Department`);
      // Filter departments by selected branch
      const branchDepartments = res.data.filter(
        (d) => d.branchId === Number(branchId)
      );
      setDepartments(branchDepartments);
    } catch (error) {
      console.error("Department fetch error:", error);
    }
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.departmentName || !form.branchId) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      if (editingId !== null) {
        await axios.put(`${BASE_URL}/Department/${editingId}`, {
          departmentName: form.departmentName,
          branchId: Number(form.branchId),
        });
        alert("Department Updated Successfully ✅");
      } else {
        // Verify if department already exists for the same branch
        const res = await axios.get(`${BASE_URL}/Department`);
        const exists = res.data.some(
          (d) =>
            d.departmentName.toLowerCase() ===
              form.departmentName.toLowerCase() &&
            d.branchId === Number(form.branchId)
        );
        if (exists) {
          alert("Department already exists for this branch ❌");
          setLoading(false);
          return;
        }

        await axios.post(`${BASE_URL}/Department`, {
          departmentName: form.departmentName,
          branchId: Number(form.branchId),
        });
        alert("Department Added Successfully ✅");
      }

      setForm({ ...form, departmentName: "" });
      setEditingId(null);
      fetchDepartments(selectedBranchId);
    } catch (error) {
      console.error("Save error:", error.response?.data || error);
      alert("Operation failed. Check console.");
    } finally {
      setLoading(false);
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (dept) => {
    setForm({
      departmentName: dept.departmentName,
      branchId: dept.branchId,
    });
    setEditingId(dept.departmentId);
    setSelectedBranchId(dept.branchId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete?")) return;

    try {
      await axios.delete(`${BASE_URL}/Department/${id}`);
      fetchDepartments(selectedBranchId);
      alert("Deleted Successfully 🗑️");
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-8">

      {/* ================= HEADER ================= */}
      <h1 className="text-4xl font-extrabold text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-10">
        Department Management
      </h1>

      {/* ================= FORM CARD ================= */}
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-3xl p-8 mb-10 border border-gray-200">

        <form
          onSubmit={handleSubmit}
          className="grid md:grid-cols-3 gap-6 items-center"
        >
          {/* Branch Selection */}
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Select Branch</label>
            <select
              value={selectedBranchId}
              onChange={(e) => setSelectedBranchId(e.target.value)}
              className="border p-4 rounded-xl focus:ring-4 focus:ring-purple-300 outline-none transition"
              required
            >
              <option value="">Select Branch</option>
              {branches.map((branch) => (
                <option key={branch.branchId} value={branch.branchId}>
                  {branch.branchName} ({branch.location})
                </option>
              ))}
            </select>
          </div>

          {/* Department Name */}
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Department Name</label>
            <input
              type="text"
              placeholder="Enter Department Name"
              value={form.departmentName}
              onChange={(e) =>
                setForm({ ...form, departmentName: e.target.value })
              }
              className="border p-4 rounded-xl focus:ring-4 focus:ring-indigo-300 outline-none transition"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className={`rounded-xl px-6 py-4 text-white font-semibold transition-all duration-300 shadow-lg
                ${
                  editingId !== null
                    ? "bg-gradient-to-r from-yellow-500 to-orange-500 hover:scale-105"
                    : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-105"
                }
                disabled:opacity-50`}
            >
              {editingId !== null ? "Update Department" : "Add Department"}
            </button>
          </div>
        </form>
      </div>

      {/* ================= TABLE CARD ================= */}
      <div className="max-w-6xl mx-auto bg-white shadow-2xl rounded-3xl p-8 border border-gray-200">
        {departments.length === 0 ? (
          <p className="text-center text-gray-400 py-10 text-lg">
            No Departments Found for selected branch
          </p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-gray-600 text-lg">
                <th className="py-4">ID</th>
                <th>Name</th>
                <th>Branch</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((dept) => {
                const branch = branches.find(b => b.branchId === dept.branchId);
                return (
                  <tr
                    key={dept.departmentId}
                    className="border-b hover:bg-indigo-50 transition duration-200"
                  >
                    <td className="py-4 font-medium">{dept.departmentId}</td>
                    <td className="font-semibold text-indigo-700">{dept.departmentName}</td>
                    <td>
                      <span className="px-4 py-1 rounded-full text-sm bg-purple-100 text-purple-700">
                        {branch ? branch.branchName : "N/A"}
                      </span>
                    </td>
                    <td className="text-center space-x-3">
                      <button
                        onClick={() => handleEdit(dept)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition shadow-md"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(dept.departmentId)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition shadow-md"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
