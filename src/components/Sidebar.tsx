// ============================================
// SIDEBAR NAVIGATION COMPONENT
// Slide-in menu with all navigation options
// ============================================

import React from 'react';
import { 
  X, Home, User, BookOpen, Video, Calendar, FileText, 
  LogIn, LayoutDashboard, UserCog, Phone, GraduationCap,
  ShoppingBag, ClipboardList
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string) => void;
  currentPage: string;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  requiresAuth?: boolean;
  requiresAdmin?: boolean;
}

const menuItems: MenuItem[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'about', label: 'About Teacher', icon: User },
  { id: 'grades', label: 'Grade-wise Classes', icon: GraduationCap },
  { id: 'store', label: 'All Classes', icon: ShoppingBag },
  { id: 'videos', label: 'Recorded Video Lessons', icon: Video },
  { id: 'schedule', label: 'Live Class Schedule', icon: Calendar },
  { id: 'notes', label: 'Notes & Past Papers', icon: FileText },
  { id: 'login', label: 'Student Login / Register', icon: LogIn },
  { id: 'dashboard', label: 'Student Dashboard', icon: LayoutDashboard, requiresAuth: true },
  { id: 'my-classes', label: 'My Classes', icon: BookOpen, requiresAuth: true },
  { id: 'teacher-panel', label: 'Teacher Panel', icon: UserCog, requiresAdmin: true },
  { id: 'admin', label: 'Admin Dashboard', icon: ClipboardList, requiresAdmin: true },
  { id: 'contact', label: 'Contact Page', icon: Phone },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onNavigate, currentPage }) => {
  const { currentUser, isAdmin } = useAuth();

  const handleNavigation = (pageId: string) => {
    onNavigate(pageId);
    onClose();
  };

  const filteredMenuItems = menuItems.filter(item => {
    if (item.requiresAdmin && !isAdmin) return false;
    if (item.requiresAuth && !currentUser && !isAdmin) return false;
    if (item.id === 'login' && (currentUser || isAdmin)) return false;
    return true;
  });

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={`fixed top-0 left-0 h-full w-72 bg-gradient-to-b from-blue-800 to-blue-900 z-50 
                    transform transition-transform duration-300 ease-in-out shadow-2xl
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-blue-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-blue-800 font-bold text-lg">SK</span>
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">Science with Kalana</h3>
              <p className="text-blue-300 text-xs">Learning Management System</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100%-140px)]">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                           ${isActive 
                             ? 'bg-white/20 text-white font-medium' 
                             : 'text-white/80 hover:text-white hover:bg-white/10'}`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 bg-amber-400 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>
        
        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-blue-700 bg-blue-900/50">
          {currentUser ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {currentUser.fullName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{currentUser.fullName}</p>
                <p className="text-blue-300 text-xs">{currentUser.id}</p>
              </div>
            </div>
          ) : isAdmin ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                <UserCog className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white text-sm font-medium">Admin User</p>
                <p className="text-blue-300 text-xs">Full Access</p>
              </div>
            </div>
          ) : (
            <p className="text-blue-300 text-xs text-center">Please login to access your account</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
