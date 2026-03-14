import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Clock, MapPin, User } from "lucide-react";

const SchedulePreview = ({ schedules = [], loading = false }) => {
  const { t } = useTranslation();

  const nextClasses = useMemo(() => {
    if (!schedules.length) return [];

    const now = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDayIndex = now.getDay();
    const currentDay = days[currentDayIndex];
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const isFuture = (s, day, time) => {
      const [sH, sM] = s.time_slot.start_time.split(':').map(Number);
      const sTime = sH * 60 + sM;
      return s.time_slot.day === day && sTime > time;
    };

    // 1. Today's remaining classes
    const todaysClasses = schedules.filter(s => isFuture(s, currentDay, currentTime));
    todaysClasses.sort((a, b) => {
      const [aH, aM] = a.time_slot.start_time.split(':').map(Number);
      const [bH, bM] = b.time_slot.start_time.split(':').map(Number);
      return (aH * 60 + aM) - (bH * 60 + bM);
    });

    let upcoming = [...todaysClasses];

    // 2. If needed, get tomorrow's classes
    if (upcoming.length < 3) {
      const nextDayIndex = (currentDayIndex + 1) % 7;
      const nextDay = days[nextDayIndex];
      const tomorrowsClasses = schedules.filter(s => s.time_slot.day === nextDay);
      tomorrowsClasses.sort((a, b) => {
        const [aH, aM] = a.time_slot.start_time.split(':').map(Number);
        const [bH, bM] = b.time_slot.start_time.split(':').map(Number);
        return (aH * 60 + aM) - (bH * 60 + bM);
      });
      upcoming = [...upcoming, ...tomorrowsClasses];
    }

    return upcoming.slice(0, 4);
  }, [schedules]);

  return (
    <div className="space-y-4">
      {loading ? (
        <div className="space-y-3">
          <div className="h-16 bg-gray-50 rounded-xl animate-pulse"></div>
          <div className="h-16 bg-gray-50 rounded-xl animate-pulse"></div>
        </div>
      ) : nextClasses.length > 0 ? (
        nextClasses.map((item, idx) => (
          <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-indigo-50 transition-colors group">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-bold text-gray-800 group-hover:text-indigo-700">{item.course?.name}</h4>
              <span className="text-xs font-semibold px-2 py-1 bg-white text-indigo-600 rounded-md border border-indigo-100">
                {item.school_class?.name}
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>{item.time_slot?.start_time?.slice(0, 5)} - {item.time_slot?.end_time?.slice(0, 5)}</span>
              </div>
              <div className="flex items-center gap-1">
                <User size={14} />
                <span>{item.teacher?.name}</span>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1 text-xs text-gray-400">
              <MapPin size={14} />
              <span>{item.time_slot?.day}, {item.classroom?.name || 'Room TBD'}</span>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <p>{t('No upcoming classes')}</p>
        </div>
      )}
    </div>
  );
};

export default SchedulePreview;
