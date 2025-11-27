import React, { useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const Layout = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    document.dir = lng === 'ar' ? 'rtl' : 'ltr';
  };

  useEffect(() => {
    document.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">{t('Welcome')}</h1>
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <nav className="flex space-x-4 rtl:space-x-reverse">
            <Link to="/" className="text-gray-700 hover:text-blue-600">{t('Dashboard')}</Link>
            <Link to="/teachers" className="text-gray-700 hover:text-blue-600">{t('Teachers')}</Link>
            <Link to="/classrooms" className="text-gray-700 hover:text-blue-600">{t('Classrooms')}</Link>
            <Link to="/courses" className="text-gray-700 hover:text-blue-600">{t('Courses')}</Link>
            <Link to="/classes" className="text-gray-700 hover:text-blue-600">{t('Classes')}</Link>
            <Link to="/assignments" className="text-gray-700 hover:text-blue-600">{t('Assignments')}</Link>
            <Link to="/schedule" className="text-gray-700 hover:text-blue-600">{t('Schedule')}</Link>
          </nav>
          <div className="flex items-center border rounded px-2 py-1">
            <Globe size={16} className="mr-2 rtl:ml-2" />
            <select 
              onChange={(e) => changeLanguage(e.target.value)} 
              value={i18n.language}
              className="bg-transparent outline-none"
            >
              <option value="en">English</option>
              <option value="ar">العربية</option>
              <option value="fr">Français</option>
            </select>
          </div>
        </div>
      </header>
      <main className="flex-grow p-6">
        <Outlet />
      </main>
      <footer className="bg-gray-200 text-center p-4 text-sm text-gray-600">
        &copy; 2025 Academic Scheduler
      </footer>
    </div>
  );
};

export default Layout;
