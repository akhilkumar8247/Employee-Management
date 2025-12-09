import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, ArrowUpDown, Printer, Edit, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { deleteEmployee } from '../api/employees';
import toast from 'react-hot-toast';

export const EmployeeList = () => {
  const navigate = useNavigate();
  const { employees, departments, refreshEmployees } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDesignation, setFilterDesignation] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortField, setSortField] = useState<'name' | 'joining_date' | 'salary'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const uniqueDesignations = Array.from(new Set(employees.map(e => e.designation)));

  const filteredAndSortedEmployees = useMemo(() => {
    let filtered = employees.filter(emp => {
      const matchesSearch =
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDesignation = !filterDesignation || emp.designation === filterDesignation;
      const matchesDepartment = !filterDepartment || emp.department_id === filterDepartment;
      const matchesStatus = !filterStatus || emp.status === filterStatus;

      return matchesSearch && matchesDesignation && matchesDepartment && matchesStatus;
    });

    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === 'salary') {
        aValue = Number(aValue);
        bValue = Number(bValue);
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [employees, searchTerm, filterDesignation, filterDepartment, filterStatus, sortField, sortOrder]);

  const totalPages = Math.ceil(filteredAndSortedEmployees.length / itemsPerPage);
  const paginatedEmployees = filteredAndSortedEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field: 'name' | 'joining_date' | 'salary') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await deleteEmployee(id);
        await refreshEmployees();
        toast.success('Employee deleted successfully');
      } catch (error) {
        toast.error('Failed to delete employee');
        console.error(error);
      }
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '', 'width=800,height=600');
    if (!printWindow) return;

    const tableHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Employee List</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #60A5FA; color: white; }
            tr:nth-child(even) { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h1>Employee List</h1>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Designation</th>
                <th>Department</th>
                <th>Salary</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${filteredAndSortedEmployees
                .map(
                  emp => `
                <tr>
                  <td>${emp.name}</td>
                  <td>${emp.email}</td>
                  <td>${emp.phone}</td>
                  <td>${emp.designation}</td>
                  <td>${emp.departments?.name || 'N/A'}</td>
                  <td>$${Number(emp.salary).toLocaleString()}</td>
                  <td>${emp.status}</td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    printWindow.document.write(tableHTML);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Employee List</h1>
          <p className="text-gray-600 mt-1">Manage and view all employees</p>
        </div>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Printer className="w-4 h-4" />
          Print Table
        </button>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={filterDesignation}
            onChange={e => setFilterDesignation(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Designations</option>
            {uniqueDesignations.map(designation => (
              <option key={designation} value={designation}>
                {designation}
              </option>
            ))}
          </select>

          <select
            value={filterDepartment}
            onChange={e => setFilterDepartment(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Departments</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <button
            onClick={() => {
              setSearchTerm('');
              setFilterDesignation('');
              setFilterDepartment('');
              setFilterStatus('');
            }}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Filter className="w-4 h-4" />
            Clear Filters
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200">
            <thead className="bg-blue-50">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 border-b border-gray-200">
                  Photo
                </th>
                <th
                  className="text-left py-3 px-4 text-sm font-semibold text-gray-700 border-b border-gray-200 cursor-pointer hover:bg-blue-100"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-2">
                    Name
                    <ArrowUpDown className="w-4 h-4" />
                  </div>
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 border-b border-gray-200">
                  Email
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 border-b border-gray-200">
                  Phone
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 border-b border-gray-200">
                  Designation
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 border-b border-gray-200">
                  Department
                </th>
                <th
                  className="text-left py-3 px-4 text-sm font-semibold text-gray-700 border-b border-gray-200 cursor-pointer hover:bg-blue-100"
                  onClick={() => handleSort('salary')}
                >
                  <div className="flex items-center gap-2">
                    Salary
                    <ArrowUpDown className="w-4 h-4" />
                  </div>
                </th>
                <th
                  className="text-left py-3 px-4 text-sm font-semibold text-gray-700 border-b border-gray-200 cursor-pointer hover:bg-blue-100"
                  onClick={() => handleSort('joining_date')}
                >
                  <div className="flex items-center gap-2">
                    Joining Date
                    <ArrowUpDown className="w-4 h-4" />
                  </div>
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 border-b border-gray-200">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 border-b border-gray-200">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedEmployees.map((employee, index) => (
                <motion.tr
                  key={employee.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors"
                >
                  <td className="py-3 px-4 border-r border-gray-100">
                    {employee.profile_photo_url ? (
                      <img
                        src={employee.profile_photo_url}
                        alt={employee.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-teal-400 flex items-center justify-center text-white font-semibold">
                        {employee.name.charAt(0)}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-800 font-medium border-r border-gray-100">
                    {employee.name}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 border-r border-gray-100">
                    {employee.email}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 border-r border-gray-100">
                    {employee.phone}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 border-r border-gray-100">
                    {employee.designation}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 border-r border-gray-100">
                    {employee.departments?.name || 'N/A'}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 border-r border-gray-100">
                    ${Number(employee.salary).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 border-r border-gray-100">
                    {new Date(employee.joining_date).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 border-r border-gray-100">
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
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/edit-employee/${employee.id}`)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(employee.id, employee.name)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-600">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, filteredAndSortedEmployees.length)} of{' '}
            {filteredAndSortedEmployees.length} employees
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    currentPage === page
                      ? 'bg-blue-500 text-white'
                      : 'border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
