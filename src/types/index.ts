export interface Department {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  dob: string | null;
  designation: string;
  department_id: string | null;
  salary: number;
  joining_date: string;
  experience: string;
  status: 'active' | 'inactive';
  profile_photo_url: string | null;
  created_at: string;
  departments?: Department;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'active' | 'completed';
  start_date: string;
  end_date: string | null;
  department_id: string | null;
  created_at: string;
  departments?: Department;
}

export interface EmployeeProject {
  id: string;
  employee_id: string;
  project_id: string;
  role: string;
  assigned_at: string;
  employees?: Employee;
  projects?: Project;
}

export interface EmployeeFormData {
  name: string;
  email: string;
  phone: string;
  dob: string;
  designation: string;
  department_id: string;
  salary: number;
  joining_date: string;
  experience: string;
  status: 'active' | 'inactive';
  profile_photo_url?: string;
}

export interface ProjectFormData {
  name: string;
  description: string;
  status: 'planning' | 'active' | 'completed';
  start_date: string;
  end_date: string;
  department_id: string;
}
