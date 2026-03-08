import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Sidebar from './components/Sidebar';

const Layout = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
    document.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
  }, [i18n.language, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Positioned Fixed */}
      <Sidebar />

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${i18n.language === 'ar' ? 'md:mr-64' : 'md:ml-64'}`}>
        <main className="grow p-6 md:p-8 overflow-x-hidden">
          <Outlet />
        </main>
        
        {/* Footer */}
        <footer className="bg-white border-t border-gray-100 text-center p-4 text-sm text-gray-500">
          &copy; 2025 INSFP Web Scheduler
        </footer>
      </div>
    </div>
  );
};

export default Layout;
