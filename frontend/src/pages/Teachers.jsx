import React, { useState, useEffect } from 'react';
import api from '../api';
import { useTranslation } from 'react-i18next';
import { Plus, Edit, Trash2 } from 'lucide-react';
import profAvatar from '../assets/img/profs/1.png';

const Teachers = () => {
  const { t } = useTranslation();
  const [teachers, setTeachers] = useState([]);
  const [formData, setFormData] = useState({ name: '', specialization: '', max_hours: 18, color: '#3b82f6' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await api.get('/teachers');
      setTeachers(response.data);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/teachers/${editingId}`, formData);
      } else {
        await api.post('/teachers', formData);
      }
      setFormData({ name: '', specialization: '', max_hours: 18, color: '#3b82f6' });
      setEditingId(null);
      fetchTeachers();
    } catch (error) {
      console.error('Error saving teacher:', error);
    }
  };

  const handleEdit = (teacher) => {
    setFormData({
      name: teacher.name,
      specialization: teacher.specialization,
      max_hours: teacher.max_hours,
      color: teacher.color
    });
    setEditingId(teacher.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await api.delete(`/teachers/${id}`);
        fetchTeachers();
      } catch (error) {
        console.error('Error deleting teacher:', error);
      }
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">{t('Teachers')}</h2>
      
      <form onSubmit={handleSubmit} className="mb-8 bg-white p-4 rounded shadow flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input 
            type="text" 
            value={formData.name} 
            onChange={(e) => setFormData({...formData, name: e.target.value})} 
            className="mt-1 block w-full border rounded p-2" 
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Specialization</label>
          <input 
            type="text" 
            value={formData.specialization} 
            onChange={(e) => setFormData({...formData, specialization: e.target.value})} 
            className="mt-1 block w-full border rounded p-2" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Max Hours</label>
          <input 
            type="number" 
            value={formData.max_hours} 
            onChange={(e) => setFormData({...formData, max_hours: parseInt(e.target.value)})} 
            className="mt-1 block w-full border rounded p-2" 
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Color</label>
          <input 
            type="color" 
            value={formData.color} 
            onChange={(e) => setFormData({...formData, color: e.target.value})} 
            className="mt-1 block w-10 h-10 border rounded p-1" 
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center">
          <Plus size={16} className="mr-2" /> {editingId ? 'Update' : 'Add'}
        </button>
        {editingId && (
          <button type="button" onClick={() => { setEditingId(null); setFormData({ name: '', specialization: '', max_hours: 18, color: '#3b82f6' }); }} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
            Cancel
          </button>
        )}
      </form>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialization</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Max Hours</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Color</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {teachers.map((teacher) => (
              <tr key={teacher.id}>
                <td className="px-6 py-4 whitespace-nowrap flex items-center">
                  <img src={profAvatar} alt="Avatar" className="w-8 h-8 rounded-full mr-2" />
                  {teacher.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{teacher.specialization}</td>
                <td className="px-6 py-4 whitespace-nowrap">{teacher.max_hours}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="w-6 h-6 rounded-full" style={{ backgroundColor: teacher.color }}></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap flex space-x-2">
                  <button onClick={() => handleEdit(teacher)} className="text-blue-600 hover:text-blue-900"><Edit size={16} /></button>
                  <button onClick={() => handleDelete(teacher.id)} className="text-red-600 hover:text-red-900"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Teachers;
