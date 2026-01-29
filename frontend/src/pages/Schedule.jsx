import React, { useState, useEffect, useMemo } from 'react';
import api from '../api';
import { useTranslation } from 'react-i18next';
import { Download, RefreshCw, Filter, Calendar, Trash2 } from 'lucide-react';
import { Table, Select, Card, Button, message, Typography, Space, Empty, Tag, Modal } from 'antd';
import doneIcon from '../assets/img/icons/done.png';

const { Option } = Select;
const { Title } = Typography;
const { confirm } = Modal;

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const Schedule = () => {
  const { t } = useTranslation();
  const [schedules, setSchedules] = useState([]);
  const [workDays, setWorkDays] = useState(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);
  const [loading, setLoading] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  useEffect(() => {
    fetchSchedules();
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/settings');
      if (response.data && response.data.work_days) {
        setWorkDays(JSON.parse(response.data.work_days));
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const fetchSchedules = async () => {
    try {
      const response = await api.get('/schedules');
      setSchedules(response.data);
    } catch (error) {
      console.error('Error fetching schedules:', error);
      message.error(t('Failed to fetch schedules'));
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      await api.post('/schedules/generate');
      fetchSchedules();
      message.success(t('Schedule generated successfully!'));
    } catch (error) {
      console.error('Error generating schedule:', error);
      message.error(t('Failed to generate schedule.'));
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    confirm({
      title: t('Are you sure you want to clear the schedule?'),
      content: t('This action cannot be undone.'),
      okText: t('Yes, Clear All'),
      okType: 'danger',
      cancelText: t('Cancel'),
      onOk: async () => {
        try {
          await api.delete('/schedules/clear');
          setSchedules([]);
          message.success(t('Schedule cleared successfully!'));
        } catch (error) {
          console.error('Error clearing schedule:', error);
          // Show more specific error message if available
          const errorMsg = error.response?.data?.message || error.message || t('Failed to clear schedule.');
          message.error(`${t('Failed to clear schedule:')} ${errorMsg}`);
        }
      },
    });
  };

  const handleExport = () => {
    window.print();
  };

  // Extract unique classes and teachers for filters
  const uniqueClasses = useMemo(() => {
    const classes = schedules.map(s => s.school_class?.name).filter(Boolean);
    return [...new Set(classes)].sort();
  }, [schedules]);

  const uniqueTeachers = useMemo(() => {
    const teachers = schedules.map(s => s.teacher?.name).filter(Boolean);
    return [...new Set(teachers)].sort();
  }, [schedules]);

  // Transform data for the table
  const tableData = useMemo(() => {
    // Filter data first
    let filtered = schedules;
    if (selectedClass) {
      filtered = filtered.filter(s => s.school_class?.name === selectedClass);
    }
    if (selectedTeacher) {
      filtered = filtered.filter(s => s.teacher?.name === selectedTeacher);
    }

    if (filtered.length === 0) return [];

    // Get unique time slots
    const timeSlotsMap = new Map();
    filtered.forEach(s => {
      if (s.time_slot) {
        const key = `${s.time_slot.start_time}-${s.time_slot.end_time}`;
        if (!timeSlotsMap.has(key)) {
          timeSlotsMap.set(key, { start: s.time_slot.start_time, end: s.time_slot.end_time });
        }
      }
    });

    const timeSlots = Array.from(timeSlotsMap.values());

    // Sort time slots
    timeSlots.sort((a, b) => a.start.localeCompare(b.start));

    // Create rows
    return timeSlots.map((slot, index) => {
      const row = {
        key: index,
        time: `${slot.start} - ${slot.end}`,
        slotStart: slot.start, // for sorting/checking
      };



      workDays.forEach(day => {
        const entry = filtered.find(s =>
          s.time_slot?.day === day &&
          s.time_slot?.start_time === slot.start
        );
        row[day] = entry;
      });

      return row;
    });
  }, [schedules, selectedClass, selectedTeacher, workDays]);

  // Define Columns with RowSpan Logic
  const columns = useMemo(() => {
    const baseColumns = [
      {
        title: t('Time'),
        dataIndex: 'time',
        key: 'time',
        width: 120,
        fixed: 'left',
        align: 'center',
        render: (text) => <span className="font-bold text-gray-600">{text}</span>
      }
    ];

    const dayColumns = workDays.map(day => ({
      title: t(day),
      dataIndex: day,
      key: day,
      align: 'center',
      onCell: (record, rowIndex) => {
        const currentEntry = record[day];
        if (!currentEntry) return {};

        // Check previous row for merge
        if (rowIndex > 0) {
          const prevRow = tableData[rowIndex - 1];
          const prevEntry = prevRow[day];
          if (prevEntry &&
            prevEntry.course?.name === currentEntry.course?.name &&
            prevEntry.teacher?.name === currentEntry.teacher?.name &&
            prevEntry.school_class?.name === currentEntry.school_class?.name &&
            prevEntry.classroom?.name === currentEntry.classroom?.name
          ) {
            return { rowSpan: 0 };
          }
        }

        // Count consecutive rows for merge
        let span = 1;
        for (let i = rowIndex + 1; i < tableData.length; i++) {
          const nextRow = tableData[i];
          const nextEntry = nextRow[day];
          if (nextEntry &&
            nextEntry.course?.name === currentEntry.course?.name &&
            nextEntry.teacher?.name === currentEntry.teacher?.name &&
            nextEntry.school_class?.name === currentEntry.school_class?.name &&
            nextEntry.classroom?.name === currentEntry.classroom?.name
          ) {
            span++;
          } else {
            break;
          }
        }

        return { rowSpan: span };
      },
      render: (entry) => {
        if (!entry) return null;

        // Determine background color
        // Use teacher color if available, else a default pastel color
        const bgColor = entry.teacher?.color ? `${entry.teacher.color}20` : '#e6f7ff';
        const borderColor = entry.teacher?.color || '#1890ff';

        return (
          <div className="flex flex-col items-center justify-center p-3 rounded-lg h-full transition-all hover:shadow-md cursor-pointer"
            style={{
              backgroundColor: bgColor,
              borderLeft: `4px solid ${borderColor}`,
              minHeight: '80px'
            }}>
            <div className="font-bold text-sm text-gray-800 text-center leading-tight mb-1">{entry.course?.name}</div>
            <div className="flex flex-wrap justify-center gap-1 mb-1">
              <Tag color="blue" className="m-0 text-[10px]">{entry.school_class?.name}</Tag>
            </div>
            <div className="text-xs text-gray-600 font-medium">{entry.teacher?.name}</div>
            <div className="text-xs text-gray-500 flex items-center mt-1">
              <span className="bg-white px-1 rounded border border-gray-200">{entry.classroom?.name}</span>
            </div>
          </div>
        );
      }
    }));

    return [...baseColumns, ...dayColumns];
  }, [tableData, t]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center">
          <img src={doneIcon} alt="Schedule" className="w-10 h-10 mr-3" />
          <div>
            <h2 className="text-3xl font-bold text-gray-800">{t('Schedule')}</h2>
            <p className="text-gray-500 text-sm">View and manage weekly timetables</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            type="primary"
            onClick={handleGenerate}
            loading={loading}
            icon={<RefreshCw size={16} />}
            className="bg-green-600 hover:bg-green-700 border-none h-10"
          >
            {t('Generate Schedule')}
          </Button>
          <Button
            danger
            onClick={handleClear}
            icon={<Trash2 size={16} />}
            className="h-10"
          >
            {t('Clear Schedule')}
          </Button>
          <Button
            onClick={handleExport}
            icon={<Download size={16} />}
            className="h-10"
          >
            Export PDF
          </Button>
        </div>
      </div>

      <Card className="shadow-md rounded-xl border-0 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex items-center gap-2 text-gray-600 font-medium">
            <Filter size={18} />
            <span>Filters:</span>
          </div>
          <Select
            placeholder="Select Class"
            allowClear
            className="w-full md:w-48"
            onChange={setSelectedClass}
            value={selectedClass}
          >
            {uniqueClasses.map(c => <Option key={c} value={c}>{c}</Option>)}
          </Select>
          <Select
            placeholder="Select Teacher"
            allowClear
            className="w-full md:w-48"
            onChange={setSelectedTeacher}
            value={selectedTeacher}
          >
            {uniqueTeachers.map(tc => <Option key={tc} value={tc}>{tc}</Option>)}
          </Select>

          {(selectedClass || selectedTeacher) && (
            <Button type="link" onClick={() => { setSelectedClass(null); setSelectedTeacher(null); }}>
              Clear Filters
            </Button>
          )}
        </div>
      </Card>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {tableData.length > 0 ? (
          <Table
            columns={columns}
            dataSource={tableData}
            pagination={false}
            bordered
            scroll={{ x: 1000 }}
            rowClassName="hover:bg-gray-50"
            className="schedule-table"
          />
        ) : (
          <div className="p-12 text-center">
            <Empty description={
              <span className="text-gray-500">
                {schedules.length === 0 ? "No schedules found. Generate one to get started." : "No schedules match your filters."}
              </span>
            } />
          </div>
        )}
      </div>

      <style>{`
        .schedule-table .ant-table-thead > tr > th {
            background-color: #f9fafb;
            color: #374151;
            font-weight: 600;
        }
        .schedule-table .ant-table-cell {
            vertical-align: top;
            padding: 8px !important;
        }
      `}</style>
    </div>
  );
};

export default Schedule;
