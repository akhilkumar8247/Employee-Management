/*
  # Create To-Do List Table

  1. New Tables
    - `todos`
      - `id` (uuid, primary key)
      - `title` (text) - To-do task title
      - `description` (text) - Detailed description
      - `due_date` (date) - Due date for the task
      - `priority` (text) - low/medium/high
      - `completed` (boolean) - Task completion status
      - `created_at` (timestamptz) - Creation timestamp
  
  2. Security
    - Enable RLS on todos table
    - Add policies for public access
  
  3. Sample Data
    - Insert sample to-do items for today
*/

CREATE TABLE IF NOT EXISTS todos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  due_date date DEFAULT CURRENT_DATE,
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to todos"
  ON todos FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert to todos"
  ON todos FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update to todos"
  ON todos FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete from todos"
  ON todos FOR DELETE
  TO public
  USING (true);

INSERT INTO todos (title, description, due_date, priority, completed) VALUES
  ('Review Employee Performance Reports', 'Complete quarterly performance evaluations for all staff', CURRENT_DATE, 'high', false),
  ('Team Meeting - Project Updates', 'Monthly sync with all department heads', CURRENT_DATE, 'high', false),
  ('Approve Budget Allocations', 'Review and approve Q2 budget requests', CURRENT_DATE, 'medium', false),
  ('Conduct One-on-One Meetings', 'Schedule and complete 5 one-on-one meetings', CURRENT_DATE, 'medium', false),
  ('Update Project Timelines', 'Review and update all active project deadlines', CURRENT_DATE, 'medium', false),
  ('HR Policy Review', 'Review updated HR policies with management team', CURRENT_DATE, 'low', false),
  ('Employee Onboarding Prep', 'Prepare welcome materials for new hire starting tomorrow', CURRENT_DATE, 'low', false)
ON CONFLICT DO NOTHING;