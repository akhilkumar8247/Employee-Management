import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Circle, Trash2, Plus } from 'lucide-react';
import { fetchTodaysTodos, toggleTodo, deleteTodo, createTodo } from '../../api/todos';
import { Todo } from '../../api/todos';
import toast from 'react-hot-toast';

interface TodoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRIORITY_COLORS: Record<string, string> = {
  high: '#EF4444',
  medium: '#F59E0B',
  low: '#10B981'
};

export const TodoModal = ({ isOpen, onClose }: TodoModalProps) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoPriority, setNewTodoPriority] = useState<'low' | 'medium' | 'high'>('medium');

  useEffect(() => {
    if (isOpen) {
      loadTodos();
    }
  }, [isOpen]);

  const loadTodos = async () => {
    try {
      setLoading(true);
      const data = await fetchTodaysTodos();
      setTodos(data);
    } catch (error) {
      toast.error('Failed to load to-dos');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTodo = async (id: string, completed: boolean) => {
    try {
      await toggleTodo(id, !completed);
      setTodos(todos.map(t => t.id === id ? { ...t, completed: !completed } : t));
      toast.success(completed ? 'To-do marked as pending' : 'To-do completed!');
    } catch (error) {
      toast.error('Failed to update to-do');
      console.error(error);
    }
  };

  const handleDeleteTodo = async (id: string, title: string) => {
    if (window.confirm(`Delete "${title}"?`)) {
      try {
        await deleteTodo(id);
        setTodos(todos.filter(t => t.id !== id));
        toast.success('To-do deleted');
      } catch (error) {
        toast.error('Failed to delete to-do');
        console.error(error);
      }
    }
  };

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      const newTodo = await createTodo({
        title: newTodoTitle,
        description: '',
        due_date: today,
        priority: newTodoPriority,
        completed: false
      });
      setTodos([newTodo, ...todos]);
      setNewTodoTitle('');
      setNewTodoPriority('medium');
      toast.success('To-do added!');
    } catch (error) {
      toast.error('Failed to add to-do');
      console.error(error);
    }
  };

  const completedCount = todos.filter(t => t.completed).length;
  const pendingCount = todos.filter(t => !t.completed).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-20 right-6 z-50 bg-white rounded-xl shadow-2xl w-96 max-h-[80vh] overflow-hidden flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-teal-50">
              <div>
                <h2 className="text-lg font-bold text-gray-800">Today's To-Do List</h2>
                <p className="text-xs text-gray-500 mt-1">
                  {pendingCount} pending · {completedCount} completed
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
              </div>
            ) : (
              <>
                <div className="overflow-y-auto flex-1 p-4 space-y-2">
                  {todos.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500 text-sm">No tasks for today!</p>
                    </div>
                  ) : (
                    todos.map((todo, index) => (
                      <motion.div
                        key={todo.id}
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
                          todo.completed
                            ? 'bg-gray-50 border-gray-100'
                            : 'bg-white border-gray-200 hover:border-blue-200'
                        }`}
                      >
                        <button
                          onClick={() => handleToggleTodo(todo.id, todo.completed)}
                          className="mt-0.5 flex-shrink-0 transition-colors"
                        >
                          {todo.completed ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <Circle className="w-5 h-5 text-gray-300 hover:text-blue-500" />
                          )}
                        </button>

                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm font-medium break-words ${
                              todo.completed
                                ? 'text-gray-500 line-through'
                                : 'text-gray-800'
                            }`}
                          >
                            {todo.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className="text-xs px-2 py-0.5 rounded-full text-white"
                              style={{ backgroundColor: PRIORITY_COLORS[todo.priority] }}
                            >
                              {todo.priority}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteTodo(todo.id, todo.title)}
                          className="flex-shrink-0 p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))
                  )}
                </div>

                <div className="border-t border-gray-100 p-4 bg-gray-50">
                  <form onSubmit={handleAddTodo} className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newTodoTitle}
                        onChange={(e) => setNewTodoTitle(e.target.value)}
                        placeholder="Add new task..."
                        className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        type="submit"
                        disabled={!newTodoTitle.trim()}
                        className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <select
                      value={newTodoPriority}
                      onChange={(e) => setNewTodoPriority(e.target.value as 'low' | 'medium' | 'high')}
                      className="w-full px-3 py-1 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                    </select>
                  </form>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
