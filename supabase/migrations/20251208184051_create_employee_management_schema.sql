/*
  # Employee Management System Schema

  1. New Tables
    - `departments`
      - `id` (uuid, primary key)
      - `name` (text, unique) - Department name
      - `description` (text) - Department description
      - `created_at` (timestamptz) - Creation timestamp
    
    - `employees`
      - `id` (uuid, primary key)
      - `name` (text) - Employee full name
      - `email` (text, unique) - Employee email
      - `phone` (text) - Contact number
      - `dob` (date) - Date of birth
      - `designation` (text) - Job title
      - `department_id` (uuid) - Foreign key to departments
      - `salary` (numeric) - Employee salary
      - `joining_date` (date) - Date of joining
      - `experience` (text) - Years of experience
      - `status` (text) - active/inactive
      - `profile_photo_url` (text) - URL to profile photo
      - `created_at` (timestamptz) - Creation timestamp
    
    - `projects`
      - `id` (uuid, primary key)
      - `name` (text) - Project name
      - `description` (text) - Project description
      - `status` (text) - planning/active/completed
      - `start_date` (date) - Project start date
      - `end_date` (date) - Project end date
      - `department_id` (uuid) - Foreign key to departments
      - `created_at` (timestamptz) - Creation timestamp
    
    - `employee_projects`
      - `id` (uuid, primary key)
      - `employee_id` (uuid) - Foreign key to employees
      - `project_id` (uuid) - Foreign key to projects
      - `role` (text) - Role in project
      - `assigned_at` (timestamptz) - Assignment timestamp

  2. Security
    - Enable RLS on all tables
    - Add policies for public access (for demo purposes)
    
  3. Initial Data
    - Seed some sample departments
*/

-- Create departments table
CREATE TABLE IF NOT EXISTS departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create employees table
CREATE TABLE IF NOT EXISTS employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text DEFAULT '',
  dob date,
  designation text NOT NULL,
  department_id uuid REFERENCES departments(id) ON DELETE SET NULL,
  salary numeric(10, 2) DEFAULT 0,
  joining_date date DEFAULT CURRENT_DATE,
  experience text DEFAULT '0',
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  profile_photo_url text,
  created_at timestamptz DEFAULT now()
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  status text DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'completed')),
  start_date date DEFAULT CURRENT_DATE,
  end_date date,
  department_id uuid REFERENCES departments(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Create employee_projects junction table
CREATE TABLE IF NOT EXISTS employee_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid REFERENCES employees(id) ON DELETE CASCADE,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  role text DEFAULT 'Team Member',
  assigned_at timestamptz DEFAULT now(),
  UNIQUE(employee_id, project_id)
);

-- Enable RLS
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_projects ENABLE ROW LEVEL SECURITY;

-- Create policies for departments
CREATE POLICY "Allow public read access to departments"
  ON departments FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert to departments"
  ON departments FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update to departments"
  ON departments FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete from departments"
  ON departments FOR DELETE
  TO public
  USING (true);

-- Create policies for employees
CREATE POLICY "Allow public read access to employees"
  ON employees FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert to employees"
  ON employees FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update to employees"
  ON employees FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete from employees"
  ON employees FOR DELETE
  TO public
  USING (true);

-- Create policies for projects
CREATE POLICY "Allow public read access to projects"
  ON projects FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert to projects"
  ON projects FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update to projects"
  ON projects FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete from projects"
  ON projects FOR DELETE
  TO public
  USING (true);

-- Create policies for employee_projects
CREATE POLICY "Allow public read access to employee_projects"
  ON employee_projects FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert to employee_projects"
  ON employee_projects FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update to employee_projects"
  ON employee_projects FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete from employee_projects"
  ON employee_projects FOR DELETE
  TO public
  USING (true);

-- Insert sample departments
INSERT INTO departments (name, description) VALUES
  ('Engineering', 'Software development and technical operations'),
  ('Human Resources', 'Employee relations and talent management'),
  ('Marketing', 'Brand promotion and customer engagement'),
  ('Sales', 'Revenue generation and client relations'),
  ('Finance', 'Financial planning and accounting'),
  ('Operations', 'Business operations and logistics')
ON CONFLICT (name) DO NOTHING;