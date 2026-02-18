export default function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">HR Dashboard</h1>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500 text-sm">Total Employees</h3>
          <p className="text-3xl font-bold text-indigo-600 mt-2">120</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500 text-sm">Active Employees</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">110</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500 text-sm">On Leave</h3>
          <p className="text-3xl font-bold text-orange-500 mt-2">10</p>
        </div>
      </div>
    </div>
  );
}
