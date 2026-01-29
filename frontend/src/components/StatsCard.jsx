import React from "react";

const StatsCard = ({ title, value, icon, color = "indigo" }) => {
  const colorClasses = {
    indigo: "bg-indigo-50 text-indigo-600",
    purple: "bg-purple-50 text-purple-600",
    blue: "bg-blue-50 text-blue-600",
    pink: "bg-pink-50 text-pink-600",
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center hover:shadow-md transition-shadow duration-300">
      <div className={`p-4 rounded-xl ${colorClasses[color] || colorClasses.indigo} rounded-2xl mr-4`}>
        <div className="text-2xl">{icon}</div>
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      </div>
    </div>
  );
};

export default StatsCard;
