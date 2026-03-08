import React, { useState, useEffect } from 'react';
import api from '../api';
import { useTranslation } from 'react-i18next';
import { Plus, Edit, Trash2, Clock } from 'lucide-react';

const TimeSlots = () => {
    const { t } = useTranslation();
    const [timeSlots, setTimeSlots] = useState([]);
    const [formData, setFormData] = useState({
        day: 'Sunday',
        start_time: '08:00',
        end_time: '10:00'
    });
    const [editingId, setEditingId] = useState(null);

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    useEffect(() => {
        fetchTimeSlots();
    }, []);

    const fetchTimeSlots = async () => {
        try {
            const response = await api.get('/time-slots');
            setTimeSlots(response.data);
        } catch (error) {
            console.error('Error fetching time slots:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/time-slots/${editingId}`, formData);
            } else {
                await api.post('/time-slots', formData);
            }
            setFormData({ day: 'Sunday', start_time: '08:00', end_time: '10:00' });
            setEditingId(null);
            fetchTimeSlots();
        } catch (error) {
            console.error('Error saving time slot:', error);
        }
    };

    const handleEdit = (slot) => {
        // Format times to HH:mm for input[type="time"]
        const formatTime = (timeStr) => {
            if (!timeStr) return '';
            // Ensure it's in HH:mm format if backend returns HH:mm:ss
            return timeStr.substring(0, 5);
        };

        setFormData({
            day: slot.day,
            start_time: formatTime(slot.start_time),
            end_time: formatTime(slot.end_time)
        });
        setEditingId(slot.id);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this time slot?')) {
            try {
                await api.delete(`/time-slots/${id}`);
                fetchTimeSlots();
            } catch (error) {
                console.error('Error deleting time slot:', error);
            }
        }
    };

    return (
        <div className="p-4">
            <div className="flex items-center mb-4">
                <Clock className="w-6 h-6 mr-2 text-indigo-600" />
                <h2 className="text-2xl font-bold">{t('Time Slots')}</h2>
            </div>

            <form onSubmit={handleSubmit} className="mb-8 bg-white p-4 rounded shadow flex flex-wrap gap-4 items-end">
                <div>
                    <label className="block text-sm font-medium text-gray-700">{t('Day')}</label>
                    <select
                        value={formData.day}
                        onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                        className="mt-1 block w-full border rounded p-2 min-w-[150px]"
                        required
                    >
                        {daysOfWeek.map(day => (
                            <option key={day} value={day}>{t(day)}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">{t('Start Time')}</label>
                    <input
                        type="time"
                        value={formData.start_time}
                        onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                        className="mt-1 block w-full border rounded p-2 min-w-[120px]"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">{t('End Time')}</label>
                    <input
                        type="time"
                        value={formData.end_time}
                        onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                        className="mt-1 block w-full border rounded p-2 min-w-[120px]"
                        required
                    />
                </div>

                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center h-[42px]">
                    <Plus size={16} className="mr-2" /> {editingId ? t('Update') : t('Add')}
                </button>
                {editingId && (
                    <button
                        type="button"
                        onClick={() => {
                            setEditingId(null);
                            setFormData({ day: 'Sunday', start_time: '08:00', end_time: '10:00' });
                        }}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 h-[42px]"
                    >
                        {t('Cancel')}
                    </button>
                )}
            </form>

            <div className="bg-white rounded shadow overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('Day')}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('Start Time')}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('End Time')}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('Actions')}</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {timeSlots.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="px-6 py-8 text-center text-gray-500 italic">
                                    {t('No time slots found. Create some above to help build your schedule.')}
                                </td>
                            </tr>
                        ) : timeSlots.map((slot) => (
                            <tr key={slot.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{t(slot.day)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-600">{slot.start_time.substring(0, 5)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-600">{slot.end_time.substring(0, 5)}</td>
                                <td className="px-6 py-4 whitespace-nowrap flex space-x-3">
                                    <button onClick={() => handleEdit(slot)} className="text-blue-600 hover:text-blue-900 transition"><Edit size={18} /></button>
                                    <button onClick={() => handleDelete(slot.id)} className="text-red-600 hover:text-red-900 transition"><Trash2 size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TimeSlots;
