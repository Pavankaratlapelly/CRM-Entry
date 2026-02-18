// // src/HR_CRM/pages/HRLeads.jsx
// import { useEffect, useState } from "react";
// import { useAuth } from "../../auth/AuthContext";
// import useFacebookLeads from "../../socialCRM/hooks/useFacebookLeads";
// import LeadsTable from "../../components/LeadsTable";

// export default function HRLeads() {
//   const { user } = useAuth();
//   const { leads, loading, reload, assignLead } = useFacebookLeads();

//   const [remarkMap, setRemarkMap] = useState({});
//   const [selectedLead, setSelectedLead] = useState(null);

//   useEffect(() => {
//     if (user?.userId) {
//       reload({ assignedToUserId: user.userId });
//     }
//   }, [user]);

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-6">My Assigned Leads</h1>

//       <LeadsTable
//         leads={leads}
//         loading={loading}
//         remarkMap={remarkMap}
//         setRemarkMap={setRemarkMap}
//         setSelectedLead={setSelectedLead}
//         viewOnly={true} // HR cannot change status
//         columns={["assignedTo", "createdAt", "remark", "actions"]}
//       />

//       {/* Details Modal */}
//       {selectedLead && (
//         <div
//           className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
//           onClick={() => setSelectedLead(null)}
//         >
//           <div
//             className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
//             onClick={(e) => e.stopPropagation()}
//           >
//             {/* Modal Header */}
//             <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex items-center justify-between">
//               <h3 className="text-xl font-bold text-white flex items-center gap-2">
//                 Lead Details
//               </h3>
//               <button
//                 onClick={() => setSelectedLead(null)}
//                 className="text-white hover:bg-white/20 rounded-lg p-1 transition-colors"
//               >
//                 ✕
//               </button>
//             </div>

//             {/* Modal Body */}
//             <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)] grid grid-cols-1 md:grid-cols-2 gap-4">
//               {selectedLead.fields && Object.keys(selectedLead.fields).length > 0 ? (
//                 Object.entries(selectedLead.fields).map(([k, v]) => (
//                   <div key={k} className="bg-gray-50 rounded-lg p-4">
//                     <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
//                       {k.replace(/_/g, " ")}
//                     </p>
//                     <p className="text-sm font-medium text-gray-900">{v || "-"}</p>
//                   </div>
//                 ))
//               ) : (
//                 <div className="col-span-2 text-center py-8">
//                   <p className="text-gray-600">No additional form data available</p>
//                 </div>
//               )}

//               {/* Remark input */}
//               <div className="col-span-2">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Remark</label>
//                 <input
//                   type="text"
//                   value={remarkMap[selectedLead.id] ?? selectedLead.remark ?? ""}
//                   onChange={(e) =>
//                     setRemarkMap((prev) => ({ ...prev, [selectedLead.id]: e.target.value }))
//                   }
//                   onBlur={() =>
//                     assignLead(
//                       selectedLead.id,
//                       selectedLead.assignedToUserId,
//                       selectedLead.assignedToUserName,
//                       remarkMap[selectedLead.id]
//                     )
//                   }
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//             </div>

//             {/* Modal Footer */}
//             <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-200">
//               <button
//                 onClick={() => setSelectedLead(null)}
//                 className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }






























// src/HR_CRM/pages/HRLeads.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import useFacebookLeads from "../../socialCRM/hooks/useFacebookLeads";
import * as XLSX from "xlsx";

export default function HRLeads() {
  const { user } = useAuth();
  const { leads, loading, reload, assignLead, changeStatus } = useFacebookLeads();

  const [remarkMap, setRemarkMap] = useState({});
  const [selectedLead, setSelectedLead] = useState(null);
  const [selectedLeadIds, setSelectedLeadIds] = useState([]);

  // Load all leads on mount
  useEffect(() => {
    reload({}); // fetch all leads
  }, []);

  // Filter only assigned leads
  const assignedLeads = leads.filter(l => l.assignedToUserId);

  // Toggle selection of individual leads
  const toggleLeadSelection = (id) => {
    setSelectedLeadIds(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev, id]
    );
  };

  // Select all visible leads
  const selectAllVisible = (checked) => {
    setSelectedLeadIds(checked ? assignedLeads.map(l => l.id) : []);
  };

  // Export leads to Excel
  const exportToExcel = (mode) => {
    if (!assignedLeads || assignedLeads.length === 0) {
      alert("No leads to export");
      return;
    }

    let exportLeads =
      mode === "selected"
        ? assignedLeads.filter(l => selectedLeadIds.includes(l.id))
        : assignedLeads;

    if (!exportLeads.length) {
      alert("No leads match criteria");
      return;
    }

    const rows = exportLeads.map(l => {
      const row = {
        Name: l.name || "",
        Email: l.email || "",
        Phone: l.phone || "",
        Status: l.status || "",
        AssignedTo: l.assignedToUserName || "",
        CreatedAt: new Date(l.createdAt).toLocaleString(),
      };

      if (l.fields) {
        Object.entries(l.fields).forEach(([key, value]) => {
          const label = key.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
          row[label] = value;
        });
      }

      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");

    XLSX.writeFile(
      workbook,
      mode === "selected"
        ? "hr-leads-selected.xlsx"
        : "hr-leads-all.xlsx"
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6">Leads</h1>

      {/* Export Button */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => exportToExcel("all")}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Export All
        </button>
        <button
          onClick={() => exportToExcel("selected")}
          disabled={selectedLeadIds.length === 0}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300"
        >
          Export Selected ({selectedLeadIds.length})
        </button>
      </div>

      {/* Leads Table */}
      <div className="overflow-x-auto bg-white rounded shadow border border-gray-200">
        {loading && (
          <div className="p-16 text-center text-gray-600">
            Loading leads...
          </div>
        )}

        {!loading && assignedLeads.length === 0 && (
          <div className="p-16 text-center text-gray-600">
            No assigned leads found
          </div>
        )}

        {!loading && assignedLeads.length > 0 && (
          <table className="w-full text-sm divide-y divide-gray-200">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedLeadIds.length === assignedLeads.length}
                    onChange={e => selectAllVisible(e.target.checked)}
                    className="w-4 h-4"
                  />
                </th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Phone</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Assigned To</th>
                <th className="px-4 py-3 text-left">Created At</th>
                <th className="px-4 py-3 text-left">Remark</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {assignedLeads.map(l => (
                <tr key={l.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">
                    <input
                      type="checkbox"
                      checked={selectedLeadIds.includes(l.id)}
                      onChange={() => toggleLeadSelection(l.id)}
                      className="w-4 h-4"
                    />
                  </td>
                  <td className="px-4 py-2">{l.name || "-"}</td>
                  <td className="px-4 py-2">{l.email || "-"}</td>
                  <td className="px-4 py-2">{l.phone || "-"}</td>
                  <td className="px-4 py-2">
                    <select
                      value={l.status}
                      onChange={e => changeStatus(l.id, e.target.value)}
                      className={`px-2 py-1 text-xs rounded border`}
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Qualified">Qualified</option>
                      <option value="Lost">Lost</option>
                    </select>
                  </td>
                  <td className="px-4 py-2">{l.assignedToUserName}</td>
                  <td className="px-4 py-2 text-xs text-gray-600">
                    {new Date(l.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={remarkMap[l.id] ?? l.remark ?? ""}
                      onChange={e =>
                        setRemarkMap(prev => ({ ...prev, [l.id]: e.target.value }))
                      }
                      onBlur={() =>
                        assignLead(l.id, l.assignedToUserId, l.assignedToUserName, remarkMap[l.id])
                      }
                      className="px-2 py-1 text-xs border rounded w-full"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => setSelectedLead(l)}
                      className="px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Details Modal */}
      {selectedLead && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedLead(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Lead Details</h3>
              <button onClick={() => setSelectedLead(null)} className="text-white text-xl font-bold">
                ✕
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedLead.fields && Object.keys(selectedLead.fields).length > 0 ? (
                Object.entries(selectedLead.fields).map(([k, v]) => (
                  <div key={k} className="bg-gray-50 p-4 rounded">
                    <p className="text-xs font-semibold text-gray-500 uppercase">{k.replace(/_/g, " ")}</p>
                    <p className="text-sm text-gray-900">{v || "-"}</p>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center py-8 text-gray-600">
                  No additional form data available
                </div>
              )}

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Remark</label>
                <input
                  type="text"
                  value={remarkMap[selectedLead.id] ?? selectedLead.remark ?? ""}
                  onChange={(e) =>
                    setRemarkMap(prev => ({ ...prev, [selectedLead.id]: e.target.value }))
                  }
                  onBlur={() =>
                    assignLead(
                      selectedLead.id,
                      selectedLead.assignedToUserId,
                      selectedLead.assignedToUserName,
                      remarkMap[selectedLead.id]
                    )
                  }
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 flex justify-end border-t border-gray-200">
              <button
                onClick={() => setSelectedLead(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
