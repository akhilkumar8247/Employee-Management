import { supabase } from '../supabase/client';
import { Employee, EmployeeFormData } from '../types';

export const fetchEmployees = async (): Promise<Employee[]> => {
  const { data, error } = await supabase
    .from('employees')
    .select('*, departments(*)')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const fetchEmployeeById = async (id: string): Promise<Employee | null> => {
  const { data, error } = await supabase
    .from('employees')
    .select('*, departments(*)')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const createEmployee = async (employeeData: EmployeeFormData): Promise<Employee> => {
  const { data, error } = await supabase
    .from('employees')
    .insert([employeeData])
    .select('*, departments(*)')
    .single();

  if (error) throw error;
  return data;
};

export const updateEmployee = async (id: string, employeeData: Partial<EmployeeFormData>): Promise<Employee> => {
  const { data, error } = await supabase
    .from('employees')
    .update(employeeData)
    .eq('id', id)
    .select('*, departments(*)')
    .single();

  if (error) throw error;
  return data;
};

export const deleteEmployee = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('employees')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const getEmployeeStats = async () => {
  const { data: employees, error } = await supabase
    .from('employees')
    .select('status, department_id');

  if (error) throw error;

  const totalEmployees = employees?.length || 0;
  const activeEmployees = employees?.filter(e => e.status === 'active').length || 0;
  const inactiveEmployees = employees?.filter(e => e.status === 'inactive').length || 0;

  return {
    totalEmployees,
    activeEmployees,
    inactiveEmployees
  };
};
