import { useState, useEffect } from 'react';
import { Bell, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { TodoModal } from './TodoModal';
import { getTodayStats } from '../../api/todos';

export const Navbar = () => {
  const [isTodoModalOpen, setIsTodoModalOpen] = useState(false);
  const [pendingTodos, setPendingTodos] = useState(0);

  useEffect(() => {
    loadTodoStats();
  }, []);

  const loadTodoStats = async () => {
    try {
      const stats = await getTodayStats();
      setPendingTodos(stats.pendingTodos);
    } catch (error) {
      console.error('Error loading todo stats:', error);
    }
  };

  const handleTodoModalClose = () => {
    setIsTodoModalOpen(false);
    loadTodoStats();
  };

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white border-b border-blue-100 px-6 py-4 shadow-sm"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-teal-500 bg-clip-text text-transparent">
              Employee Management System
            </h1>
            <p className="text-sm text-gray-500 mt-1">Manage your workforce efficiently</p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsTodoModalOpen(true)}
              className="relative p-2 hover:bg-blue-50 rounded-full transition-colors"
              title="Today's To-Do List"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              {pendingTodos > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-0 right-0 w-5 h-5 bg-rose-400 rounded-full flex items-center justify-center text-white text-xs font-bold"
                >
                  {pendingTodos > 9 ? '9+' : pendingTodos}
                </motion.span>
              )}
            </button>

            <div className="flex items-center gap-3 pl-4 border-l border-blue-100">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-700">Admin User</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-teal-400 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </motion.nav>

      <TodoModal isOpen={isTodoModalOpen} onClose={handleTodoModalClose} />
    </>
  );
};
