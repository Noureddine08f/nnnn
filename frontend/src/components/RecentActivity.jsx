import React, { useState, useEffect } from "react";
import api from "../api";
import { UserPlus, PlusCircle, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";

const RecentActivity = () => {
  const { t } = useTranslation();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teachersRes, classesRes, coursesRes] = await Promise.all([
          api.get("/teachers?limit=5"),
          api.get("/school-classes?limit=5"),
          api.get("/courses?limit=5")
        ]);

        const teachers = teachersRes.data.map(item => ({
          type: 'teacher',
          message: t('New teacher added'),
          detail: item.name,
          date: new Date(item.created_at || Date.now()), // Fallback if created_at is missing/null
          icon: UserPlus,
          color: 'text-blue-500 bg-blue-50'
        }));

        const classes = classesRes.data.map(item => ({
          type: 'class',
          message: t('New class created'),
          detail: item.name,
          date: new Date(item.created_at || Date.now()),
          icon: PlusCircle,
          color: 'text-emerald-500 bg-emerald-50'
        }));

        const courses = coursesRes.data.map(item => ({
          type: 'course',
          message: t('New course available'),
          detail: item.name,
          date: new Date(item.created_at || Date.now()),
          icon: PlusCircle, // Using same icon or different one
          color: 'text-purple-500 bg-purple-50'
        }));

        // Combine and sort by date descending
        const allActivities = [...teachers, ...classes, ...courses]
          .sort((a, b) => b.date - a.date)
          .slice(0, 5); // Take top 5

        setActivities(allActivities);
      } catch (error) {
        console.error("Error fetching activity data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatDate = (date) => {
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
      Math.ceil((date - new Date()) / (1000 * 60 * 60 * 24)),
      'day'
    );
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full min-w-0">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-800">{t('Recent Activity')}</h3>
        <Clock size={16} className="text-gray-400" />
      </div>

      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-gray-100 rounded-lg"></div>
          <div className="h-12 bg-gray-100 rounded-lg"></div>
          <div className="h-12 bg-gray-100 rounded-lg"></div>
        </div>
      ) : activities.length > 0 ? (
        <div className="space-y-4">
          {activities.map((activity, idx) => {
            const Icon = activity.icon;
            return (
              <div key={idx} className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`p-2 rounded-full ${activity.color} shrink-0`}>
                  <Icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {activity.message}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {activity.detail}
                  </p>
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap">
                  {formatDate(activity.date)}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400">
          <p>{t('No recent activity')}</p>
        </div>
      )}
    </div>
  );
};

export default RecentActivity;
