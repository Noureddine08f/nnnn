import React, { useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import logo from './assets/img/logo.png';
import profIcon from './assets/img/icons/prof.png';
import classeIcon from './assets/img/icons/classe.png';
import filiereIcon from './assets/img/icons/filiere.png';
import notifIcon from './assets/img/icons/notif.png';

const Layout = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    document.dir = lng === 'ar' ? 'rtl' : 'ltr';
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
    document.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
  }, [i18n.language, navigate]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="h-10 mr-4" />
        </div>
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <nav className="flex space-x-4 rtl:space-x-reverse items-center">
            <Link to="/" className="text-gray-700 hover:text-blue-600 flex items-center">
              {t('Dashboard')}
            </Link>
            <Link to="/teachers" className="text-gray-700 hover:text-blue-600 flex items-center">
              <img src={profIcon} alt="Teachers" className="w-5 h-5 mr-1" />
              {t('Teachers')}
            </Link>
            <Link to="/classrooms" className="text-gray-700 hover:text-blue-600 flex items-center">
              <img src={classeIcon} alt="Classrooms" className="w-5 h-5 mr-1" />
              {t('Classrooms')}
            </Link>
            <Link to="/courses" className="text-gray-700 hover:text-blue-600 flex items-center">
              <img src={filiereIcon} alt="Courses" className="w-5 h-5 mr-1" />
              {t('Courses')}
            </Link>
            <Link to="/classes" className="text-gray-700 hover:text-blue-600 flex items-center">
              <img src={classeIcon} alt="Classes" className="w-5 h-5 mr-1" />
              {t('Classes')}
            </Link>
            <Link to="/assignments" className="text-gray-700 hover:text-blue-600 flex items-center">
              {t('Assignments')}
            </Link>
            <Link to="/schedule" className="text-gray-700 hover:text-blue-600 flex items-center">
              {t('Schedule')}
            </Link>
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
          <button className="p-1 rounded-full hover:bg-gray-100">
            <img src={notifIcon} alt="Notifications" className="w-6 h-6" />
          </button>
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
