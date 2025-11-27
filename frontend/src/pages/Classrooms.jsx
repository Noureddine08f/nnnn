import React, { useState, useEffect } from 'react';
import api from '../api';
import { useTranslation } from 'react-i18next';
import { Plus, Edit, Trash2 } from 'lucide-react';

const Classrooms = () => {
  const { t } = useTranslation();
  const [classrooms, setClassrooms] = useState([]);
  const [formData, setFormData] = useState({ name: '', capacity: 30, type: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const fetchClassrooms = async () => {
    try {
      const response = await api.get('/classrooms');
      setClassrooms(response.data);
    } catch (error) {
      console.error('Error fetching classrooms:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/classrooms/${editingId}`, formData);
      } else {
        await api.post('/classrooms', formData);
      }
      setFormData({ name: '', capacity: 30, type: '' });
      setEditingId(null);
      fetchClassrooms();
    } catch (error) {
      console.error('Error saving classroom:', error);
    }
  };

  const handleEdit = (classroom) => {
    setFormData({
      name: classroom.name,
      capacity: classroom.capacity,
      type: classroom.type || ''
    });
    setEditingId(classroom.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await api.delete(`/classrooms/${id}`);
        fetchClassrooms();
      } catch (error) {
        console.error('Error deleting classroom:', error);
      }
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">{t('Classrooms')}</h2>
      
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
          <label className="block text-sm font-medium text-gray-700">Capacity</label>
          <input 
            type="number" 
            value={formData.capacity} 
            onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value)})} 
            className="mt-1 block w-full border rounded p-2" 
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Type</label>
          <input 
            type="text" 
            value={formData.type} 
            onChange={(e) => setFormData({...formData, type: e.target.value})} 
            className="mt-1 block w-full border rounded p-2" 
            placeholder="e.g. Lab, Lecture Hall"
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center">
          <Plus size={16} className="mr-2" /> {editingId ? 'Update' : 'Add'}
        </button>
        {editingId && (
          <button type="button" onClick={() => { setEditingId(null); setFormData({ name: '', capacity: 30, type: '' }); }} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
            Cancel
          </button>
        )}
      </form>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {classrooms.map((classroom) => (
              <tr key={classroom.id}>
                <td className="px-6 py-4 whitespace-nowrap">{classroom.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{classroom.capacity}</td>
                <td className="px-6 py-4 whitespace-nowrap">{classroom.type}</td>
                <td className="px-6 py-4 whitespace-nowrap flex space-x-2">
                  <button onClick={() => handleEdit(classroom)} className="text-blue-600 hover:text-blue-900"><Edit size={16} /></button>
                  <button onClick={() => handleDelete(classroom.id)} className="text-red-600 hover:text-red-900"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Classrooms;
