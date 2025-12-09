import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Employee, Department, Project } from '../types';
import { fetchEmployees } from '../api/employees';
import { fetchDepartments } from '../api/departments';
import { fetchProjects } from '../api/projects';

interface AppContextType {
  employees: Employee[];
  departments: Department[];
  projects: Project[];
  loading: boolean;
  refreshEmployees: () => Promise<void>;
  refreshDepartments: () => Promise<void>;
  refreshProjects: () => Promise<void>;
  refreshAll: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshEmployees = async () => {
    try {
      const data = await fetchEmployees();
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const refreshDepartments = async () => {
    try {
      const data = await fetchDepartments();
      setDepartments(data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const refreshProjects = async () => {
    try {
      const data = await fetchProjects();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const refreshAll = async () => {
    setLoading(true);
    await Promise.all([
      refreshEmployees(),
      refreshDepartments(),
      refreshProjects()
    ]);
    setLoading(false);
  };

  useEffect(() => {
    refreshAll();
  }, []);

  return (
    <AppContext.Provider
      value={{
        employees,
        departments,
        projects,
        loading,
        refreshEmployees,
        refreshDepartments,
        refreshProjects,
        refreshAll
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
