import React, { useState, useEffect } from 'react';
import api from '../api';
import { useTranslation } from 'react-i18next';
import { Settings as SettingsIcon, Save, Plus, Trash2, Calendar } from 'lucide-react';

const Settings = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [workDays, setWorkDays] = useState(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);
  const [holidays, setHolidays] = useState([]);
  const [newHoliday, setNewHoliday] = useState('');

  const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/settings');
      // Parse settings from simple key-value response
      // Assuming response.data is { work_days: "[\"Monday\"...]", holidays: "[\"2025-01-01\"...]" }
      if (response.data) {
          if (response.data.work_days) setWorkDays(JSON.parse(response.data.work_days));
          if (response.data.holidays) setHolidays(JSON.parse(response.data.holidays));
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      // Fallback or specific error handling
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.post('/settings', {
        work_days: workDays,
        holidays: holidays
      });
      alert(t('Settings saved successfully!'));
    } catch (error) {
      console.error('Error saving settings:', error);
      alert(t('Failed to save settings.'));
    } finally {
      setLoading(false);
    }
  };

  const toggleDay = (day) => {
    if (workDays.includes(day)) {
      setWorkDays(workDays.filter(d => d !== day));
    } else {
      setWorkDays([...workDays, day]);
    }
  };

  const addHoliday = () => {
    if (newHoliday && !holidays.some(h => h.date === newHoliday)) {
      // Storing as object { date: 'YYYY-MM-DD', name: 'Optional' } or just string
      // Let's use simple object for potential future expansion
      setHolidays([...holidays, { date: newHoliday, name: '' }]);
      setNewHoliday('');
    }
  };

  const removeHoliday = (date) => {
    setHolidays(holidays.filter(h => h.date !== date));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <SettingsIcon className="w-8 h-8 mr-3 text-gray-700" />
        <h2 className="text-3xl font-bold text-gray-800">{t('Settings')}</h2>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4 border-b pb-2">{t('Work Days')}</h3>
        <p className="text-gray-500 mb-4">{t('Select the days when the school is open.')}</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {allDays.map(day => (
            <label key={day} className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
              <input 
                type="checkbox" 
                checked={workDays.includes(day)} 
                onChange={() => toggleDay(day)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-gray-700 font-medium">{t(day)}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4 border-b pb-2">{t('Holidays')}</h3>
        <p className="text-gray-500 mb-4">{t('Add specific dates when the school is closed.')}</p>

        <div className="flex gap-2 mb-4">
          <input 
            type="date" 
            value={newHoliday} 
            onChange={(e) => setNewHoliday(e.target.value)} 
            className="border rounded-lg p-2 flex-grow"
          />
          <button 
            onClick={addHoliday}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
          >
            <Plus size={18} className="mr-1" /> {t('Add Holiday')}
          </button>
        </div>

        <div className="space-y-2">
            {holidays.length === 0 && <p className="text-gray-400 italic">{t('No holidays added.')}</p>}
            {holidays.map((h, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex items-center">
                        <Calendar size={18} className="text-gray-400 mr-2" />
                        <span className="font-medium text-gray-700">{h.date}</span>
                    </div>
                    <button 
                        onClick={() => removeHoliday(h.date)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button 
            onClick={handleSave} 
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 shadow-lg flex items-center text-lg font-medium disabled:opacity-50"
        >
            <Save size={20} className="mr-2" />
            {loading ? t('Saving...') : t('Save Settings')}
        </button>
      </div>
    </div>
  );
};

export default Settings;
