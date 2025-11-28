import React, { useState, useEffect } from 'react';
import api from '../api';
import { useTranslation } from 'react-i18next';
import { Calendar, Download, RefreshCw } from 'lucide-react';
import doneIcon from '../assets/img/icons/done.png';

const Schedule = () => {
  const { t } = useTranslation();
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const response = await api.get('/schedules');
      setSchedules(response.data);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      await api.post('/schedules/generate');
      fetchSchedules();
      alert('Schedule generated successfully!');
    } catch (error) {
      console.error('Error generating schedule:', error);
      alert('Failed to generate schedule.');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    window.print();
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <img src={doneIcon} alt="Schedule" className="w-8 h-8 mr-2" />
          <h2 className="text-2xl font-bold">{t('Schedule')}</h2>
        </div>
        <div className="space-x-2">
          <button 
            onClick={handleGenerate} 
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center disabled:opacity-50"
          >
            <RefreshCw size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} /> 
            {t('Generate Schedule')}
          </button>
          <button 
            onClick={handleExport} 
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 flex items-center"
          >
            <Download size={16} className="mr-2" /> Export PDF
          </button>
        </div>
      </div>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {schedules.map((schedule) => (
              <tr key={schedule.id}>
                <td className="px-6 py-4 whitespace-nowrap">{schedule.time_slot?.day}</td>
                <td className="px-6 py-4 whitespace-nowrap">{schedule.time_slot?.start_time} - {schedule.time_slot?.end_time}</td>
                <td className="px-6 py-4 whitespace-nowrap">{schedule.school_class?.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{schedule.course?.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 rounded text-white text-xs" style={{ backgroundColor: schedule.teacher?.color }}>
                    {schedule.teacher?.name}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{schedule.classroom?.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Schedule;
