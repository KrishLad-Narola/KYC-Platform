import React from 'react';
import { NavLink, useNavigate } from 'react-router';
import { 
  LayoutDashboard, 
  FileText, 
  BarChart3, 
  Settings, 
  Shield, 
  ScrollText,
  Building2,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout(); 
      navigate('/auth/login'); 
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/documents', icon: FileText, label: 'Documents' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/audit-logs', icon: ScrollText, label: 'Audit Logs' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  if (isAdmin) {
    navItems.push({ path: '/admin', icon: Shield, label: 'Admin Panel' });
  }

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-700">
        <Building2 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
        <span className="ml-3 text-xl font-bold text-gray-900 dark:text-white">
          KYC Manager
        </span>
      </div>

      {/* Organization Info */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="text-sm text-gray-600 dark:text-gray-400">Organization</div>
        <div className="font-medium text-gray-900 dark:text-white truncate">
          {user?.organization?.name || 'Demo Corp'}
        </div>
        <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
          {user?.organization?.plan?.toUpperCase() || 'PRO'} Plan
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`
            }
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700 space-y-3">

        {/* User Info */}
        <div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Logged in as</div>
          <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {user?.email}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {user?.role === 'admin' ? 'Administrator' : 'Organization User'}
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg 
          text-red-600 bg-red-50 hover:bg-red-100 
          dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 
          transition-colors"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </button>
      </div>
    </aside>
  );
};