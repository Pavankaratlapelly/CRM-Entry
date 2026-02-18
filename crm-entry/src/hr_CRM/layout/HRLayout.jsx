import { NavLink, Outlet } from "react-router-dom";

const linkClass = ({ isActive }) =>
  `block px-4 py-2 rounded-lg transition-all ${
    isActive
      ? "bg-indigo-600 text-white"
      : "text-gray-600 hover:bg-gray-200"
  }`;

export default function HRLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-5">
        <h2 className="text-xl font-bold mb-6 text-gray-800">HR CRM</h2>

        <nav className="space-y-3">
          <NavLink to="/crm/hr/dashboard" className={linkClass}>
            Dashboard
          </NavLink>

          <NavLink to="/crm/hr/employees" className={linkClass}>
            Employees
          </NavLink>

          <NavLink to="/crm/hr/branch" className={linkClass}>
            Branch
          </NavLink>
          
          <NavLink to="/crm/hr/project" className={linkClass}>
            Project
          </NavLink>

          <NavLink to="/crm/hr/leads" className={linkClass}>
          Leads
          </NavLink>
          <NavLink to="/crm/hr/departments" className={linkClass}>
            Departments
          </NavLink>


          <NavLink to="/crm/hr/attendence" className={linkClass}>
            Attendence
          </NavLink>

          <NavLink to="/crm/hr/payroll" className={linkClass}>
            Payroll
          </NavLink>
        </nav>
      </aside>

      {/* Page Content */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
