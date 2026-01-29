import React from "react";
import { useNavigate } from "react-router-dom";

const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border">
      <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button 
          onClick={() => navigate('/teachers')}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-3 rounded-lg"
        >
          + Add Teacher
        </button>
        <button 
          onClick={() => navigate('/classes')}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-3 rounded-lg"
        >
          + Add Class
        </button>
        <button 
          onClick={() => navigate('/courses')}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-3 rounded-lg"
        >
          + Add Course
        </button>
        <button 
          onClick={() => navigate('/schedule')}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-3 rounded-lg"
        >
          + New Schedule
        </button>
      </div>
    </div>
  );
};

export default QuickActions;