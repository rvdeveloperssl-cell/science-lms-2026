// ============================================
// MENU BUTTON COMPONENT
// Floating button to open sidebar
// ============================================

import React from 'react';
import { Menu } from 'lucide-react';

interface MenuButtonProps {
  onClick: () => void;
}

const MenuButton: React.FC<MenuButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed top-4 left-4 z-40 w-12 h-12 bg-blue-700 hover:bg-blue-600 
                 rounded-full flex items-center justify-center shadow-lg 
                 hover:shadow-xl transition-all duration-300 hover:scale-105
                 animate-pulse-glow"
      aria-label="Open Menu"
    >
      <Menu className="w-6 h-6 text-white" />
    </button>
  );
};

export default MenuButton;
