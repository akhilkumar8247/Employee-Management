import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, UserPlus, FolderKanban } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/employees', icon: Users, label: 'Employees' },
  { path: '/add-employee', icon: UserPlus, label: 'Add Employee' },
  { path: '/projects', icon: FolderKanban, label: 'Projects' },
];

export const Sidebar = () => {
  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-64 bg-gradient-to-b from-blue-50 to-teal-50 border-r border-blue-100 min-h-screen p-4"
    >
      <nav className="space-y-2">
        {navItems.map((item, index) => (
          <motion.div
            key={item.path}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-white text-blue-600 shadow-md'
                    : 'text-gray-600 hover:bg-white/50 hover:text-blue-600'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          </motion.div>
        ))}
      </nav>
    </motion.aside>
  );
};
