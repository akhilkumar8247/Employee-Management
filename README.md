<<<<<<< HEAD
# Employee Management System

A complete, production-ready Employee Management System built with React, TypeScript, Tailwind CSS, and Supabase.

## Features

### Dashboard
- Overview cards showing total employees, active employees, total projects, and departments
- Interactive charts:
  - Bar chart: Employees by department
  - Pie chart: Employee status distribution
  - Line chart: Monthly hiring trends
  - Bar chart: Project status distribution
- Recent employee activity list

### Employee Management
- **Employee List Page**
  - Search functionality
  - Multi-field filters (designation, department, status)
  - Sortable columns (name, salary, joining date)
  - Pagination (10 items per page)
  - Print table functionality
  - Edit and delete actions
  - Clean bordered table design

- **Add Employee Page**
  - Comprehensive form with all fields
  - Profile photo upload with preview
  - Supabase storage integration
  - Form validation
  - Success notifications

- **Edit Employee Page**
  - Pre-filled form with existing data
  - Update all employee details
  - Photo upload/update
  - Success notifications

### Project Management
- **Projects Page**
  - List all projects with details
  - Add/Edit/Delete operations
  - Assign employees to projects with roles
  - Remove employees from projects
  - View team members per project
  - Interactive pie charts:
    - Project status distribution
    - Projects by department

### To-Do List
- **Notification Bell Pop-up**
  - Click the bell icon in navbar to open today's to-do list
  - View all tasks due today with priority levels
  - Mark tasks as complete/incomplete
  - Delete tasks
  - Add new tasks with priority selection
  - Notification badge shows pending task count
  - Color-coded priorities (high/medium/low)

## Tech Stack

- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS with custom pastel color scheme
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage for profile photos
- **Charts**: Recharts
- **Routing**: React Router v6
- **Animations**: Framer Motion
- **Notifications**: React Hot Toast
- **State Management**: React Context API

## Design

The application features a modern, light pastel color theme with:
- Soft blue and teal gradients
- Clean white cards with subtle shadows
- Smooth animations and transitions
- Fully responsive layout
- Professional sidebar navigation
- Intuitive user interface

## Database Schema

### Tables
1. **departments** - Company departments
2. **employees** - Employee records with full details
3. **projects** - Project information
4. **employee_projects** - Junction table for project assignments
5. **todos** - Daily to-do tasks with priority levels

### Security
- Row Level Security (RLS) enabled on all tables
- Public access policies for demo purposes
- Profile photos stored in public bucket

## Sample Data

The application comes pre-populated with:
- 6 departments
- 10 sample employees
- 6 projects
- Multiple employee-project assignments
- 7 daily to-do items with varying priorities

## Getting Started

The application is ready to use. Simply start the development server and begin managing your workforce!

## File Structure

```
src/
├── api/               # API service functions
├── components/        # Reusable UI components
├── context/           # React Context providers
├── pages/            # Page components
├── supabase/         # Supabase configuration
└── types/            # TypeScript type definitions
```
=======
# Employee-Management
>>>>>>> 89d07f9f43820be05be11385920b4231a43f2ffc
