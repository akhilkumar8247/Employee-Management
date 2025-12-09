import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  index: number;
}

export const StatCard = ({ title, value, icon: Icon, color, index }: StatCardProps) => {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: index * 0.1 }}
      className={`bg-white rounded-xl p-6 shadow-sm border border-${color}-100 hover:shadow-md transition-shadow`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
        </div>
        <div className={`p-4 bg-${color}-100 rounded-lg`}>
          <Icon className={`w-8 h-8 text-${color}-600`} />
        </div>
      </div>
    </motion.div>
  );
};
