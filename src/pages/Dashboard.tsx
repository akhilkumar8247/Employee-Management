import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Briefcase, FolderKanban, Building2 } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { StatCard } from '../components/Dashboard/StatCard';
import { useApp } from '../context/AppContext';
import { getEmployeeStats } from '../api/employees';
import { getProjectStats } from '../api/projects';
import { getDepartmentStats } from '../api/departments';

const COLORS = ['#60A5FA', '#34D399', '#F472B6', '#FBBF24', '#A78BFA', '#FB923C'];

export const Dashboard = () => {
  const { employees, projects, departments, loading } = useApp();
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    totalProjects: 0,
    activeProjects: 0,
    totalDepartments: 0,
    departmentCounts: []
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [empStats, projStats, deptStats] = await Promise.all([
          getEmployeeStats(),
          getProjectStats(),
          getDepartmentStats()
        ]);

        setStats({
          totalEmployees: empStats.totalEmployees,
          activeEmployees: empStats.activeEmployees,
          totalProjects: projStats.totalProjects,
          activeProjects: projStats.activeProjects,
          totalDepartments: deptStats.totalDepartments,
          departmentCounts: deptStats.departmentCounts
        });
      } catch (error) {
        console.error('Error loading stats:', error);
      }
    };

    if (!loading) {
      loadStats();
    }
  }, [loading, employees, projects, departments]);

  const recentEmployees = employees.slice(0, 5);

  const employeeStatusData = [
    { name: 'Active', value: stats.activeEmployees },
    { name: 'Inactive', value: stats.totalEmployees - stats.activeEmployees }
  ];

  const projectStatusData = projects.reduce((acc, project) => {
    const existing = acc.find(item => item.status === project.status);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ status: project.status, count: 1 });
    }
    return acc;
  }, [] as { status: string; count: number }[]);

  const monthlyHiresData = employees.reduce((acc, emp) => {
    const month = new Date(emp.joining_date).toLocaleDateString('en-US', { month: 'short' });
    const existing = acc.find(item => item.month === month);
    if (existing) {
      existing.hires += 1;
    } else {
      acc.push({ month, hires: 1 });
    }
    return acc;
  }, [] as { month: string; hires: number }[]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's your overview</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Employees"
          value={stats.totalEmployees}
          icon={Users}
          color="blue"
          index={0}
        />
        <StatCard
          title="Active Employees"
          value={stats.activeEmployees}
          icon={Briefcase}
          color="green"
          index={1}
        />
        <StatCard
          title="Total Projects"
          value={stats.totalProjects}
          icon={FolderKanban}
          color="pink"
          index={2}
        />
        <StatCard
          title="Departments"
          value={stats.totalDepartments}
          icon={Building2}
          color="amber"
          index={3}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Employees by Department</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.departmentCounts}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="count" fill="#60A5FA" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Employee Status Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={employeeStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {employeeStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Monthly Hiring Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyHiresData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="hires"
                stroke="#34D399"
                strokeWidth={2}
                dot={{ fill: '#34D399', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Project Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={projectStatusData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="status" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="count" fill="#F472B6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      >
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Employees</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-blue-50">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Name</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Email</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Designation</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Department</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentEmployees.map((employee, index) => (
                <motion.tr
                  key={employee.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.9 + index * 0.05 }}
                  className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors"
                >
                  <td className="py-3 px-4 text-sm text-gray-800">{employee.name}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{employee.email}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{employee.designation}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {employee.departments?.name || 'N/A'}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        employee.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {employee.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};
