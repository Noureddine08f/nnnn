import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Users, GraduationCap, BookOpen, Calendar, Clock, Bell } from "lucide-react";
import api from "../api";

import StatsCard from "../components/StatsCard";
import PerformanceChart from "../components/PerformanceChart";
import AttendanceChart from "../components/AttendanceChart";
import SchedulePreview from "../components/SchedulePreview";
import RecentActivity from "../components/RecentActivity";

const Dashboard = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    teachers: 0,
    classes: 0,
    courses: 0,
    rooms: 0,
    assignments: 0,
  });
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchAll = async () => {
      try {
        const [statsRes, schedulesRes] = await Promise.all([
          api.get("/dashboard/stats"),
          api.get("/schedules"),
        ]);

        if (!cancelled) {
          setStats(statsRes.data);
          setSchedules(schedulesRes.data);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        if (!cancelled) {
          setError("Failed to load dashboard data");
          setLoading(false);
        }
      }
    };

    fetchAll();

    return () => { cancelled = true; };
  }, []);

  if (error) {
    return (
      <div className="text-center p-8 text-red-500 bg-red-50 rounded-lg">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* HEADER SECTION */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">
            {t("Dashboard")}
          </h2>
          <p className="text-gray-500 mt-1">
            {t("Welcome back, Administrator")}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 bg-white border border-gray-200 rounded-full text-gray-500 hover:text-indigo-600 hover:border-indigo-100 transition shadow-sm">
            <Bell size={20} />
          </button>
          <div className="text-sm text-right hidden sm:block">
            <p className="text-gray-900 font-medium">{new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          // Skeletons for Stats Cards
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-pulse h-32"></div>
          ))
        ) : (
          <>
            <StatsCard title={t("Teachers")} value={stats.teachers} icon={<Users />} color="indigo" />
            <StatsCard title={t("Classes")} value={stats.classes} icon={<GraduationCap />} color="purple" />
            <StatsCard title={t("Courses")} value={stats.courses} icon={<BookOpen />} color="blue" />
            <StatsCard title={t("Schedules")} value={stats.assignments} icon={<Calendar />} color="pink" />
          </>
        )}
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT COLUMN (Charts) */}
        <div className="lg:col-span-2 space-y-8">
          <PerformanceChart schedules={schedules} loading={loading} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AttendanceChart schedules={schedules} loading={loading} />
            <RecentActivity />
          </div>
        </div>

        {/* RIGHT COLUMN (Timetable) */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-800">{t("Schedule")}</h3>
              <Clock size={16} className="text-gray-400" />
            </div>
            <SchedulePreview schedules={schedules} loading={loading} />
          </div>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;
