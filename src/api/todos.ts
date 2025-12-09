import { supabase } from '../supabase/client';

export interface Todo {
  id: string;
  title: string;
  description: string;
  due_date: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  created_at: string;
}

export const fetchTodaysTodos = async (): Promise<Todo[]> => {
  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await supabase
    .from('todos')
    .select('*')
    .eq('due_date', today)
    .order('priority', { ascending: false })
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data || [];
};

export const fetchAllTodos = async (): Promise<Todo[]> => {
  const { data, error } = await supabase
    .from('todos')
    .select('*')
    .order('priority', { ascending: false })
    .order('due_date', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const createTodo = async (todoData: Omit<Todo, 'id' | 'created_at'>): Promise<Todo> => {
  const { data, error } = await supabase
    .from('todos')
    .insert([todoData])
    .select('*')
    .single();

  if (error) throw error;
  return data;
};

export const updateTodo = async (id: string, updates: Partial<Todo>): Promise<Todo> => {
  const { data, error } = await supabase
    .from('todos')
    .update(updates)
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw error;
  return data;
};

export const toggleTodo = async (id: string, completed: boolean): Promise<Todo> => {
  const { data, error } = await supabase
    .from('todos')
    .update({ completed })
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw error;
  return data;
};

export const deleteTodo = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('todos')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const getTodayStats = async () => {
  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await supabase
    .from('todos')
    .select('completed')
    .eq('due_date', today);

  if (error) throw error;

  const totalTodos = data?.length || 0;
  const completedTodos = data?.filter(t => t.completed).length || 0;

  return {
    totalTodos,
    completedTodos,
    pendingTodos: totalTodos - completedTodos
  };
};
