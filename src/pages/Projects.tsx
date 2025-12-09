import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, UserPlus, Users } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useApp } from '../context/AppContext';
import { createProject, updateProject, deleteProject, assignEmployeeToProject, fetchProjectEmployees, removeEmployeeFromProject } from '../api/projects';
import { ProjectModal } from '../components/Projects/ProjectModal';
import { AssignEmployeeModal } from '../components/Projects/AssignEmployeeModal';
import { Project, EmployeeProject } from '../types';
import toast from 'react-hot-toast';

const STATUS_COLORS: Record<string, string> = {
  planning: '#FBBF24',
  active: '#34D399',
  completed: '#60A5FA'
};

const DEPT_COLORS = ['#60A5FA', '#34D399', '#F472B6', '#FBBF24', '#A78BFA', '#FB923C'];

export const Projects = () => {
  const { projects, refreshProjects, departments } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedProjectForAssign, setSelectedProjectForAssign] = useState<string>('');
  const [projectEmployees, setProjectEmployees] = useState<Record<string, EmployeeProject[]>>({});

  useEffect(() => {
    loadProjectEmployees();
  }, [projects]);

  const loadProjectEmployees = async () => {
    const employeeData: Record<string, EmployeeProject[]> = {};
    for (const project of projects) {
      const employees = await fetchProjectEmployees(project.id);
      employeeData[project.id] = employees;
    }
    setProjectEmployees(employeeData);
  };

  const handleAddProject = async (data: any) => {
    try {
      await createProject(data);
      await refreshProjects();
      toast.success('Project created successfully!');
    } catch (error) {
      toast.error('Failed to create project');
      console.error(error);
    }
  };

  const handleEditProject = async (data: any) => {
    if (!selectedProject) return;
    try {
      await updateProject(selectedProject.id, data);
      await refreshProjects();
      toast.success('Project updated successfully!');
    } catch (error) {
      toast.error('Failed to update project');
      console.error(error);
    }
  };

  const handleDeleteProject = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await deleteProject(id);
        await refreshProjects();
        toast.success('Project deleted successfully');
      } catch (error) {
        toast.error('Failed to delete project');
        console.error(error);
      }
    }
  };

  const handleAssignEmployee = async (employeeId: string, role: string) => {
    try {
      await assignEmployeeToProject(employeeId, selectedProjectForAssign, role);
      await loadProjectEmployees();
      toast.success('Employee assigned successfully!');
    } catch (error) {
      toast.error('Failed to assign employee');
      console.error(error);
    }
  };

  const handleRemoveEmployee = async (assignmentId: string) => {
    if (window.confirm('Remove this employee from the project?')) {
      try {
        await removeEmployeeFromProject(assignmentId);
        await loadProjectEmployees();
        toast.success('Employee removed successfully');
      } catch (error) {
        toast.error('Failed to remove employee');
        console.error(error);
      }
    }
  };

  const openEditModal = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setSelectedProject(null);
    setIsModalOpen(true);
  };

  const openAssignModal = (projectId: string) => {
    setSelectedProjectForAssign(projectId);
    setIsAssignModalOpen(true);
  };

  const statusData = projects.reduce((acc, project) => {
    const existing = acc.find(item => item.name === project.status);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: project.status, value: 1 });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  const departmentData = departments.map(dept => {
    const count = projects.filter(p => p.department_id === dept.id).length;
    return { name: dept.name, value: count };
  }).filter(item => item.value > 0);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Projects</h1>
          <p className="text-gray-600 mt-1">Manage projects and team assignments</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-lg hover:from-blue-600 hover:to-teal-600 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Project
        </button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Project Status Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Projects by Department</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={departmentData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {departmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={DEPT_COLORS[index % DEPT_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 + index * 0.05 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-gray-800">{project.name}</h3>
                  <span
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: `${STATUS_COLORS[project.status]}20`,
                      color: STATUS_COLORS[project.status]
                    }}
                  >
                    {project.status}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{project.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Department</p>
                    <p className="font-medium text-gray-800">
                      {project.departments?.name || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Start Date</p>
                    <p className="font-medium text-gray-800">
                      {new Date(project.start_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">End Date</p>
                    <p className="font-medium text-gray-800">
                      {project.end_date ? new Date(project.end_date).toLocaleDateString() : 'Ongoing'}
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Team Members ({projectEmployees[project.id]?.length || 0})
                    </h4>
                    <button
                      onClick={() => openAssignModal(project.id)}
                      className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <UserPlus className="w-3 h-3" />
                      Assign
                    </button>
                  </div>

                  {projectEmployees[project.id]?.length > 0 && (
                    <div className="space-y-2">
                      {projectEmployees[project.id].map(assignment => (
                        <div
                          key={assignment.id}
                          className="flex items-center justify-between bg-blue-50 px-3 py-2 rounded-lg"
                        >
                          <div>
                            <p className="text-sm font-medium text-gray-800">
                              {assignment.employees?.name}
                            </p>
                            <p className="text-xs text-gray-600">{assignment.role}</p>
                          </div>
                          <button
                            onClick={() => handleRemoveEmployee(assignment.id)}
                            className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => openEditModal(project)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteProject(project.id, project.name)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {projects.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
            <p className="text-gray-500">No projects yet. Create your first project!</p>
          </div>
        )}
      </motion.div>

      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProject(null);
        }}
        onSave={selectedProject ? handleEditProject : handleAddProject}
        project={selectedProject}
      />

      <AssignEmployeeModal
        isOpen={isAssignModalOpen}
        onClose={() => {
          setIsAssignModalOpen(false);
          setSelectedProjectForAssign('');
        }}
        onAssign={handleAssignEmployee}
        projectId={selectedProjectForAssign}
      />
    </div>
  );
};
