import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next';

const AttendanceChart = ({ schedules = [], loading = false }) => {
    const { t } = useTranslation();

    const data = useMemo(() => {
        if (!schedules.length) return [];

        const daysMap = {
            'Sunday': 0, 'Monday': 0, 'Tuesday': 0, 'Wednesday': 0,
            'Thursday': 0, 'Friday': 0, 'Saturday': 0
        };

        const dayOrder = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        schedules.forEach(schedule => {
            if (schedule.time_slot && schedule.time_slot.day) {
                const day = schedule.time_slot.day;
                if (daysMap[day] !== undefined) {
                    daysMap[day]++;
                }
            }
        });

        return dayOrder.map(day => ({
            day: day.substring(0, 3),
            sessions: daysMap[day]
        }));
    }, [schedules]);

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full min-w-0">
            <h3 className="text-lg font-bold text-gray-800 mb-4">{t('Weekly Sessions')}</h3>
            <div className="h-64 w-full" style={{ minHeight: '16rem' }}>
                {loading ? (
                    <div className="h-full bg-gray-50 rounded-xl animate-pulse"></div>
                ) : data.length > 0 && (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} barSize={20}>
                            <XAxis
                                dataKey="day"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#9ca3af', fontSize: 12 }}
                            />
                            <Tooltip
                                cursor={{ fill: '#f3f4f6' }}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Bar
                                dataKey="sessions"
                                name={t('Sessions')}
                                fill="#8b5cf6"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
};

export default AttendanceChart;
