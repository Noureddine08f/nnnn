import React, { useState, useEffect } from 'react';
import api from '../api';
import { useTranslation } from 'react-i18next';
import { Plus, Edit, Trash2 } from 'lucide-react';
import classeIcon from '../assets/img/icons/classe.png';

const Classes = () => {
  const { t } = useTranslation();
  const [classes, setClasses] = useState([]);
  const [formData, setFormData] = useState({ name: '', grade_level: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await api.get('/school-classes');
      setClasses(response.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/school-classes/${editingId}`, formData);
      } else {
        await api.post('/school-classes', formData);
      }
      setFormData({ name: '', grade_level: '' });
      setEditingId(null);
      fetchClasses();
    } catch (error) {
      console.error('Error saving class:', error);
    }
  };

  const handleEdit = (cls) => {
    setFormData({
      name: cls.name,
      grade_level: cls.grade_level
    });
    setEditingId(cls.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await api.delete(`/school-classes/${id}`);
        fetchClasses();
      } catch (error) {
        console.error('Error deleting class:', error);
      }
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center mb-4">
        <img src={classeIcon} alt="Classes" className="w-8 h-8 mr-2" />
        <h2 className="text-2xl font-bold">{t('Classes')}</h2>
      </div>
      
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
          <label className="block text-sm font-medium text-gray-700">Grade Level</label>
          <input 
            type="text" 
            value={formData.grade_level} 
            onChange={(e) => setFormData({...formData, grade_level: e.target.value})} 
            className="mt-1 block w-full border rounded p-2" 
            required 
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center">
          <Plus size={16} className="mr-2" /> {editingId ? 'Update' : 'Add'}
        </button>
        {editingId && (
          <button type="button" onClick={() => { setEditingId(null); setFormData({ name: '', grade_level: '' }); }} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
            Cancel
          </button>
        )}
      </form>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade Level</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {classes.map((cls) => (
              <tr key={cls.id}>
                <td className="px-6 py-4 whitespace-nowrap">{cls.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{cls.grade_level}</td>
                <td className="px-6 py-4 whitespace-nowrap flex space-x-2">
                  <button onClick={() => handleEdit(cls)} className="text-blue-600 hover:text-blue-900"><Edit size={16} /></button>
                  <button onClick={() => handleDelete(cls.id)} className="text-red-600 hover:text-red-900"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Classes;
