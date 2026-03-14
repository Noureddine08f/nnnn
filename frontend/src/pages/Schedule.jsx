import React, { useState, useEffect, useMemo } from "react";
import api from "../api";
import { useTranslation } from "react-i18next";
import { Download, RefreshCw, Filter, Calendar, Trash2 } from "lucide-react";
import {
  Table,
  Select,
  Card,
  Button,
  message,
  Typography,
  Space,
  Empty,
  Tag,
  Modal,
} from "antd";
import doneIcon from "../assets/img/icons/done.png";

const { Option } = Select;
const { Title } = Typography;
const { confirm } = Modal;

//const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const Schedule = () => {
  const { t } = useTranslation();
  const user = JSON.parse(localStorage.getItem('user')) || { role: 'student' };
  const isAdmin = user.role === 'admin';
  const [schedules, setSchedules] = useState([]);
  const [workDays, setWorkDays] = useState([
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
  ]);
  const [loading, setLoading] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  useEffect(() => {
    fetchSchedules();
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get("/settings");
      if (response.data && response.data.work_days) {
        setWorkDays(JSON.parse(response.data.work_days));
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  const fetchSchedules = async () => {
    try {
      const response = await api.get("/schedules");
      setSchedules(response.data);
    } catch (error) {
      console.error("Error fetching schedules:", error);
      message.error(t("Failed to fetch schedules"));
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const response = await api.post("/schedules/generate");
      await fetchSchedules();
      if (response.data?.warning) {
        message.warning(response.data.warning, 8);
      } else {
        message.success(t("Schedule generated successfully!"));
      }
    } catch (error) {
      console.error("Error generating schedule:", error);
      const errorMsg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message;

      message.error(`${t("Failed to generate schedule")}: ${errorMsg}`, 10);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    confirm({
      title: t("Are you sure you want to clear the schedule?"),
      content: t("This action cannot be undone."),
      okText: t("Yes, Clear All"),
      okType: "danger",
      cancelText: t("Cancel"),
      onOk: async () => {
        try {
          await api.delete("/schedules/clear");
          setSchedules([]);
          message.success(t("Schedule cleared successfully!"));
        } catch (error) {
          console.error("Error clearing schedule:", error);
          // Show more specific error message if available
          const errorMsg =
            error.response?.data?.message ||
            error.message ||
            t("Failed to clear schedule.");
          message.error(`${t("Failed to clear schedule:")} ${errorMsg}`);
        }
      },
    });
  };

  const handleExportExcel = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedClass) params.append("class_name", selectedClass);
      if (selectedTeacher) params.append("teacher_name", selectedTeacher);

      const response = await api.get(`/schedules/export/excel?${params.toString()}`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "schedule.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error exporting Excel:", error);
      message.error(t("Failed to export Excel"));
    }
  };

  const handleExportPdf = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedClass) params.append("class_name", selectedClass);
      if (selectedTeacher) params.append("teacher_name", selectedTeacher);

      const response = await api.get(`/schedules/export/pdf?${params.toString()}`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "schedule.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error exporting PDF:", error);
      message.error(t("Failed to export PDF"));
    }
  };

  // Extract unique classes and teachers for filters
  const uniqueClasses = useMemo(() => {
    const classes = schedules.map((s) => s.school_class?.name).filter(Boolean);
    return [...new Set(classes)].sort();
  }, [schedules]);

  const uniqueTeachers = useMemo(() => {
    const teachers = schedules.map((s) => s.teacher?.name).filter(Boolean);
    return [...new Set(teachers)].sort();
  }, [schedules]);

  // Transform data for the table
  const tableData = useMemo(() => {
    // Filter data first
    let filtered = schedules;
    if (selectedClass) {
      filtered = filtered.filter((s) => s.school_class?.name === selectedClass);
    }
    if (selectedTeacher) {
      filtered = filtered.filter((s) => s.teacher?.name === selectedTeacher);
    }

    if (filtered.length === 0) return [];

    // Group by Teacher Map
    const teacherMap = new Map();

    filtered.forEach((s) => {
      const teacherName = s.teacher?.name || 'Unknown Teacher';
      if (!teacherMap.has(teacherName)) {
        teacherMap.set(teacherName, {
          key: teacherName,
          teacher: s.teacher,
          schedules: []
        });
      }
      teacherMap.get(teacherName).schedules.push(s);
    });

    const rows = Array.from(teacherMap.values()).map(teacherData => {
      const row = {
        key: teacherData.key,
        teacher: teacherData.teacher
      };

      workDays.forEach(day => {
        // Get all schedules for this teacher on this day
        const daySchedules = teacherData.schedules.filter(s => s.time_slot?.day === day);

        // Sort them by start time
        daySchedules.sort((a, b) => {
          const timeA = a.time_slot?.start_time || '';
          const timeB = b.time_slot?.start_time || '';
          return timeA.localeCompare(timeB);
        });

        row[day] = daySchedules;
      });

      return row;
    });

    // Sort rows by teacher name alphabetically
    rows.sort((a, b) => (a.teacher?.name || '').localeCompare(b.teacher?.name || ''));

    return rows;
  }, [schedules, selectedClass, selectedTeacher, workDays]);

  // Define Columns for the Resource Timeline View
  const columns = useMemo(() => {
    const baseColumns = [
      {
        title: t("Teacher"),
        dataIndex: "teacher",
        key: "teacher",
        width: 200,
        fixed: "left",
        // backgroundColor matches Header for sticky column style in Ant Design (usually white or slight grey)
        render: (teacher) => (
          <div className="flex items-center gap-3 py-2">
            <div className="flex flex-col">
              <span className="font-semibold text-gray-800 text-sm">{teacher?.name || 'Unknown'}</span>
            </div>
          </div>
        ),
      },
    ];

    const dayColumns = workDays.map((day) => ({
      title: t(day),
      dataIndex: day,
      key: day,
      width: 250,
      render: (daySchedules) => {
        if (!daySchedules || daySchedules.length === 0) return null;

        return (
          <div className="flex flex-col gap-2 min-h-[60px]">
            {daySchedules.map((entry, idx) => {
              // Subtle pastel background tint and strong border using the teacher's color
              const bgColor = entry.teacher?.color ? `${entry.teacher.color}15` : "#f0fdf4";
              const borderColor = entry.teacher?.color || "#22c55e";
              const startTime = entry.time_slot?.start_time ? entry.time_slot.start_time.substring(0, 5) : '';
              const endTime = entry.time_slot?.end_time ? entry.time_slot.end_time.substring(0, 5) : '';
              const timeStr = startTime && endTime ? `${startTime} - ${endTime}` : '';

              return (
                <div
                  key={idx}
                  className="flex flex-col p-2 rounded-md shadow-sm border border-gray-100 transition-all hover:shadow-md cursor-pointer"
                  style={{
                    backgroundColor: bgColor,
                    borderLeft: `4px solid ${borderColor}`,
                  }}
                >
                  <div className="text-[11px] font-semibold text-gray-600 mb-1 tracking-wide">{timeStr}</div>
                  <div className="font-bold text-[13px] text-gray-800 leading-tight mb-2">
                    {entry.course?.name}
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <Tag color="blue" className="m-0 text-[10px] border-0 px-1.5 py-0.5 font-medium">
                      {entry.school_class?.name}
                    </Tag>
                    <span className="text-[10px] font-medium text-gray-500 bg-white/70 px-1.5 py-0.5 rounded shadow-sm border border-black/5">
                      {entry.classroom?.name}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        );
      },
    }));

    return [...baseColumns, ...dayColumns];
  }, [workDays, t]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center">
          <img src={doneIcon} alt="Schedule" className="w-10 h-10 mr-3" />
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              {t("Schedule")}
            </h2>
            <p className="text-gray-500 text-sm">
              {t("View and manage weekly timetables")}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          {isAdmin && (
            <>
              <Button
                type="primary"
                onClick={handleGenerate}
                loading={loading}
                icon={<RefreshCw size={16} />}
                className="bg-green-600 hover:bg-green-700 border-none h-10"
              >
                {t("Generate Schedule")}
              </Button>
              <Button
                danger
                onClick={handleClear}
                icon={<Trash2 size={16} />}
                className="h-10"
              >
                {t("Clear Schedule")}
              </Button>
            </>
          )}
          <Button
            onClick={handleExportExcel}
            icon={<Download size={16} />}
            className="h-10 bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
          >
            {t("Excel")}
          </Button>
          <Button
            onClick={handleExportPdf}
            icon={<Download size={16} />}
            className="h-10 bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
          >
            {t("PDF")}
          </Button>
        </div>
      </div>

      {isAdmin && (
        <Card className="shadow-md rounded-xl border-0 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex items-center gap-2 text-gray-600 font-medium">
              <Filter size={18} />
              <span>{t("Filters")}:</span>
            </div>
            <Select
              placeholder={t("Select Class")}
              allowClear
              className="w-full md:w-48"
              onChange={setSelectedClass}
              value={selectedClass}
            >
              {uniqueClasses.map((c) => (
                <Option key={c} value={c}>
                  {c}
                </Option>
              ))}
            </Select>
            <Select
              placeholder={t("Select Teacher")}
              allowClear
              className="w-full md:w-48"
              onChange={setSelectedTeacher}
              value={selectedTeacher}
            >
              {uniqueTeachers.map((tc) => (
                <Option key={tc} value={tc}>
                  {tc}
                </Option>
              ))}
            </Select>

            {(selectedClass || selectedTeacher) && (
              <Button
                type="link"
                onClick={() => {
                  setSelectedClass(null);
                  setSelectedTeacher(null);
                }}
              >
                {t("Clear Filters")}
              </Button>
            )}
          </div>
        </Card>
      )}

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
            <Empty
              description={
                <span className="text-gray-500">
                  {schedules.length === 0
                    ? t("No schedules found. Generate one to get started.")
                    : t("No schedules match your filters.")}
                </span>
              }
            />
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
