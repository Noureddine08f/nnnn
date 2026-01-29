import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, 
  Users, 
  School, 
  BookOpen, 
  Shapes, 
  ClipboardList, 
  Calendar, 
  Menu, 
  X,
  Globe,
  LogOut,
  Settings
} from 'lucide-react';

const Sidebar = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    document.dir = lng === 'ar' ? 'rtl' : 'ltr';
    setIsLangOpen(false);
  };
  
  const navLinks = [
    { to: "/", label: t('Dashboard'), icon: LayoutDashboard },
    { to: "/teachers", label: t('Teachers'), icon: Users },
    { to: "/classrooms", label: t('Classrooms'), icon: School },
    { to: "/courses", label: t('Courses'), icon: BookOpen },
    { to: "/classes", label: t('Classes'), icon: Shapes },
    { to: "/assignments", label: t('Assignments'), icon: ClipboardList },
    { to: "/schedule", label: t('Schedule'), icon: Calendar },
    { to: "/settings", label: t('Settings'), icon: Settings },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 focus:outline-none"
        onClick={toggleSidebar}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`
          fixed top-0 left-0 z-40 h-screen w-64
          bg-white border-r border-gray-100 shadow-xl
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="h-16 flex items-center px-6 border-b border-gray-50 bg-gradient-to-r from-indigo-50 to-white">
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
              INSFP
            </span>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
            {navLinks.map((link) => {
              const active = isActive(link.to);
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className={`
                    flex items-center px-3 py-3 rounded-lg transition-all duration-200 group
                    ${active 
                      ? 'bg-indigo-50 text-indigo-700 font-medium shadow-sm' 
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon 
                    size={20} 
                    className={`
                      ${i18n.language === 'ar' ? 'ml-3' : 'mr-3'}
                      transition-colors
                      ${active ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-600'}
                    `} 
                  />
                  <span>{link.label}</span>
                  {active && (
                    <div className={`
                      absolute w-1 h-8 bg-indigo-600 rounded-full
                      ${i18n.language === 'ar' ? 'left-0' : 'right-0'}
                    `} />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Bottom Section: Language & User */}
          <div className="p-4 bg-gray-50 border-t border-gray-100">
            {/* Language Switcher */}
            <div className="relative mb-4">
              <button 
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="w-full flex items-center justify-between p-2 rounded-lg bg-white border border-gray-200 text-sm hover:bg-gray-50 transition"
              >
                <div className="flex items-center text-gray-600">
                  <Globe size={16} className={i18n.language === 'ar' ? 'ml-2' : 'mr-2'} />
                  <span>
                    {i18n.language === 'en' ? 'English' : i18n.language === 'ar' ? 'العربية' : 'Français'}
                  </span>
                </div>
              </button>
              
              {isLangOpen && (
                <div className="absolute bottom-full mb-2 w-full bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden">
                  <button onClick={() => changeLanguage('en')} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50">English</button>
                  <button onClick={() => changeLanguage('ar')} className="block w-full text-right px-4 py-2 text-sm hover:bg-gray-50">العربية</button>
                  <button onClick={() => changeLanguage('fr')} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50">Français</button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 px-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-xs">
                AD
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">Admin</p>
                <p className="text-xs text-gray-500 truncate">admin@school.com</p>
              </div>
              <button 
                onClick={handleLogout}
                className="text-gray-400 hover:text-red-500 transition-colors"
                title={t('Logout')}
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
