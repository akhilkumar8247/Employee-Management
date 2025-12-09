import { supabase } from '../supabase/client';
import { Department } from '../types';

export const fetchDepartments = async (): Promise<Department[]> => {
  const { data, error } = await supabase
    .from('departments')
    .select('*')
    .order('name', { ascending: true });

  if (error) throw error;
  return data || [];
};

export const fetchDepartmentById = async (id: string): Promise<Department | null> => {
  const { data, error } = await supabase
    .from('departments')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const getDepartmentStats = async () => {
  const { data: departments, error: deptError } = await supabase
    .from('departments')
    .select('*');

  if (deptError) throw deptError;

  const { data: employees, error: empError } = await supabase
    .from('employees')
    .select('department_id');

  if (empError) throw empError;

  const departmentCounts = departments?.map(dept => {
    const count = employees?.filter(e => e.department_id === dept.id).length || 0;
    return {
      name: dept.name,
      count
    };
  }) || [];

  return {
    totalDepartments: departments?.length || 0,
    departmentCounts
  };
};
