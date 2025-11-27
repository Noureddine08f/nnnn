import React from 'react';
import { useTranslation } from 'react-i18next';

const Dashboard = () => {
  const { t } = useTranslation();
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">{t('Dashboard')}</h2>
      <p>{t('Welcome')}</p>
    </div>
  );
};

export default Dashboard;
