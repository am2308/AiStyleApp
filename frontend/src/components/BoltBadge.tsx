import React from 'react';
import { motion } from 'framer-motion';

interface BoltBadgeProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
}

const BoltBadge: React.FC<BoltBadgeProps> = ({ 
  position = 'bottom-right',
  className = ''
}) => {
  // Position classes
  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4'
  };

  return (
    <motion.a
      href="https://bolt.new"
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed ${positionClasses[position]} z-50 flex items-center space-x-2 px-3 py-2 bg-black/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-black transition-all ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13 10V3L4 14H11V21L20 10H13Z" fill="#FFFFFF" />
      </svg>
      <span className="text-white text-sm font-medium">Built with Bolt.new</span>
    </motion.a>
  );
};

export default BoltBadge;
