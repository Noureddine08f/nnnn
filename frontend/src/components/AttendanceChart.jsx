import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../api';
import { useTranslation } from 'react-i18next';

const AttendanceChart = () => {
    const { t } = useTranslation();
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                const response = await api.get('/schedules');
                const schedules = response.data;

                // Initialize days
                const daysMap = {
                    'Sunday': 0, 'Monday': 0, 'Tuesday': 0, 'Wednesday': 0,
                    'Thursday': 0, 'Friday': 0, 'Saturday': 0
                };

                // Fixed order for chart
                const dayOrder = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

                schedules.forEach(schedule => {
                    if (schedule.time_slot && schedule.time_slot.day) {
                        const day = schedule.time_slot.day;
                        if (daysMap[day] !== undefined) {
                            daysMap[day]++;
                        }
                    }
                });

                const chartData = dayOrder.map(day => ({
                    day: day.substring(0, 3), // Mon, Tue...
                    sessions: daysMap[day]
                }));

                setData(chartData);

            } catch (error) {
                console.error("Error fetching schedules for chart:", error);
            }
        };

        fetchSchedules();
    }, []);

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full min-w-0">
            <h3 className="text-lg font-bold text-gray-800 mb-4">{t('Weekly Sessions')}</h3>
            <div className="h-64 w-full" style={{ minHeight: '16rem' }}>
                {data.length > 0 && (
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
