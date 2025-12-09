import { supabase } from '../supabase/client';
import { Project, ProjectFormData, EmployeeProject } from '../types';

export const fetchProjects = async (): Promise<Project[]> => {
  const { data, error } = await supabase
    .from('projects')
    .select('*, departments(*)')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const fetchProjectById = async (id: string): Promise<Project | null> => {
  const { data, error } = await supabase
    .from('projects')
    .select('*, departments(*)')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const createProject = async (projectData: ProjectFormData): Promise<Project> => {
  const { data, error } = await supabase
    .from('projects')
    .insert([projectData])
    .select('*, departments(*)')
    .single();

  if (error) throw error;
  return data;
};

export const updateProject = async (id: string, projectData: Partial<ProjectFormData>): Promise<Project> => {
  const { data, error } = await supabase
    .from('projects')
    .update(projectData)
    .eq('id', id)
    .select('*, departments(*)')
    .single();

  if (error) throw error;
  return data;
};

export const deleteProject = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const assignEmployeeToProject = async (
  employeeId: string,
  projectId: string,
  role: string
): Promise<EmployeeProject> => {
  const { data, error } = await supabase
    .from('employee_projects')
    .insert([{ employee_id: employeeId, project_id: projectId, role }])
    .select('*')
    .single();

  if (error) throw error;
  return data;
};

export const removeEmployeeFromProject = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('employee_projects')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const fetchProjectEmployees = async (projectId: string) => {
  const { data, error } = await supabase
    .from('employee_projects')
    .select('*, employees(*), projects(*)')
    .eq('project_id', projectId);

  if (error) throw error;
  return data || [];
};

export const getProjectStats = async () => {
  const { data: projects, error } = await supabase
    .from('projects')
    .select('status');

  if (error) throw error;

  const totalProjects = projects?.length || 0;
  const activeProjects = projects?.filter(p => p.status === 'active').length || 0;
  const completedProjects = projects?.filter(p => p.status === 'completed').length || 0;
  const planningProjects = projects?.filter(p => p.status === 'planning').length || 0;

  return {
    totalProjects,
    activeProjects,
    completedProjects,
    planningProjects
  };
};
