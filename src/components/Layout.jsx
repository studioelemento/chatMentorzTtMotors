import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Users, MessageSquare, Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export default function Layout() {
  const { isDark, toggleTheme } = useTheme();

  const navItems = [
    { name: 'Admin Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'User Dashboard', path: '/user', icon: Users },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-dark-900 overflow-hidden transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-64 glass-panel m-4 flex flex-col">
        <div className="p-6 border-b border-gray-200 dark:border-dark-700 flex items-center gap-3 transition-colors">
          <div className="w-10 h-10 rounded-lg bg-whatsapp/10 dark:bg-whatsapp/20 flex items-center justify-center">
            <MessageSquare className="text-whatsapp w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-gray-900 dark:text-gray-100 leading-tight">Titanium Motors</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Admin Panel</p>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-whatsapp/10 text-whatsapp font-medium shadow-sm shadow-whatsapp/5'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-700/50 hover:text-gray-900 dark:hover:text-gray-200'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-dark-700 transition-colors">
          <button 
            onClick={toggleTheme} 
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-700/50 hover:text-gray-900 dark:hover:text-gray-200 transition-all duration-200"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
