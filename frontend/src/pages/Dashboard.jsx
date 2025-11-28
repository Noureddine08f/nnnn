import React from 'react';
import { useTranslation } from 'react-i18next';

import heroImg from '../assets/img/hero-img.png';

const Dashboard = () => {
  const { t } = useTranslation();
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">{t('Dashboard')}</h2>
      <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
        <img src={heroImg} alt="Hero" className="w-full max-w-2xl mb-6 rounded-lg" />
        <p className="text-xl text-gray-700">{t('Welcome')}</p>
      </div>
    </div>
  );
};

export default Dashboard;
