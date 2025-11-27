import React, { useState, useEffect } from 'react';
import api from '../api';
import { useTranslation } from 'react-i18next';
import { Plus, Edit, Trash2 } from 'lucide-react';

const Assignments = () => {
  const { t } = useTranslation();
  const [assignments, setAssignments] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [classes, setClasses] = useState([]);
  const [formData, setFormData] = useState({ teacher_id: '', course_id: '', school_class_id: '', hours_per_week: 2 });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchAssignments();
    fetchDropdowns();
  }, []);

  const fetchDropdowns = async () => {
    try {
      const [tRes, cRes, scRes] = await Promise.all([
        api.get('/teachers'),
        api.get('/courses'),
        api.get('/school-classes')
      ]);
      setTeachers(tRes.data);
      setCourses(cRes.data);
      setClasses(scRes.data);
    } catch (error) {
      console.error('Error fetching dropdowns:', error);
    }
  };

  const fetchAssignments = async () => {
    try {
      const response = await api.get('/assignments');
      setAssignments(response.data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/assignments/${editingId}`, formData);
      } else {
        await api.post('/assignments', formData);
      }
      setFormData({ teacher_id: '', course_id: '', school_class_id: '', hours_per_week: 2 });
      setEditingId(null);
      fetchAssignments();
    } catch (error) {
      console.error('Error saving assignment:', error);
    }
  };

  const handleEdit = (assignment) => {
    setFormData({
      teacher_id: assignment.teacher_id,
      course_id: assignment.course_id,
      school_class_id: assignment.school_class_id,
      hours_per_week: assignment.hours_per_week
    });
    setEditingId(assignment.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await api.delete(`/assignments/${id}`);
        fetchAssignments();
      } catch (error) {
        console.error('Error deleting assignment:', error);
      }
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">{t('Assignments')}</h2>
      
      <form onSubmit={handleSubmit} className="mb-8 bg-white p-4 rounded shadow flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700">Teacher</label>
          <select 
            value={formData.teacher_id} 
            onChange={(e) => setFormData({...formData, teacher_id: e.target.value})} 
            className="mt-1 block w-full border rounded p-2" 
            required
          >
            <option value="">Select Teacher</option>
            {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Course</label>
          <select 
            value={formData.course_id} 
            onChange={(e) => setFormData({...formData, course_id: e.target.value})} 
            className="mt-1 block w-full border rounded p-2" 
            required
          >
            <option value="">Select Course</option>
            {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Class</label>
          <select 
            value={formData.school_class_id} 
            onChange={(e) => setFormData({...formData, school_class_id: e.target.value})} 
            className="mt-1 block w-full border rounded p-2" 
            required
          >
            <option value="">Select Class</option>
            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Hours/Week</label>
          <input 
            type="number" 
            value={formData.hours_per_week} 
            onChange={(e) => setFormData({...formData, hours_per_week: parseInt(e.target.value)})} 
            className="mt-1 block w-full border rounded p-2" 
            required 
            min="1"
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center">
          <Plus size={16} className="mr-2" /> {editingId ? 'Update' : 'Add'}
        </button>
        {editingId && (
          <button type="button" onClick={() => { setEditingId(null); setFormData({ teacher_id: '', course_id: '', school_class_id: '', hours_per_week: 2 }); }} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
            Cancel
          </button>
        )}
      </form>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {assignments.map((assignment) => (
              <tr key={assignment.id}>
                <td className="px-6 py-4 whitespace-nowrap">{assignment.teacher?.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{assignment.course?.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{assignment.school_class?.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{assignment.hours_per_week}</td>
                <td className="px-6 py-4 whitespace-nowrap flex space-x-2">
                  <button onClick={() => handleEdit(assignment)} className="text-blue-600 hover:text-blue-900"><Edit size={16} /></button>
                  <button onClick={() => handleDelete(assignment.id)} className="text-red-600 hover:text-red-900"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Assignments;
