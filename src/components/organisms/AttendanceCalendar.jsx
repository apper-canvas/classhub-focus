import React, { useState } from "react";
import { motion } from "framer-motion";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isWeekend } from "date-fns";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const AttendanceCalendar = ({ 
  selectedDate, 
  onDateSelect, 
  selectedClass, 
  students, 
  attendance, 
  onMarkAttendance,
  isEditing,
  onToggleEdit
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getAttendanceForDate = (date) => {
    return attendance.filter(a => isSameDay(new Date(a.date), date));
  };

  const getAttendanceStatus = (studentId, date) => {
    const record = attendance.find(a => 
      a.studentId === studentId && isSameDay(new Date(a.date), date)
    );
    return record ? record.status : null;
  };

  const getAttendanceStats = (date) => {
    const dayAttendance = getAttendanceForDate(date);
    const present = dayAttendance.filter(a => a.status === "present").length;
    const absent = dayAttendance.filter(a => a.status === "absent").length;
    const late = dayAttendance.filter(a => a.status === "late").length;
    const excused = dayAttendance.filter(a => a.status === "excused").length;
    
    return { present, absent, late, excused, total: dayAttendance.length };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "present": return "bg-green-500";
      case "absent": return "bg-red-500";
      case "late": return "bg-yellow-500";
      case "excused": return "bg-blue-500";
      default: return "bg-gray-300";
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "present": return <Badge variant="success">Present</Badge>;
      case "absent": return <Badge variant="error">Absent</Badge>;
      case "late": return <Badge variant="warning">Late</Badge>;
      case "excused": return <Badge variant="info">Excused</Badge>;
      default: return <Badge variant="default">Not Marked</Badge>;
    }
  };

  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  if (!selectedClass) {
    return (
      <div className="bg-white rounded-xl shadow-card p-8 text-center">
        <ApperIcon name="Calendar" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Class</h3>
        <p className="text-gray-500">Choose a class to view and manage attendance</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="bg-white rounded-xl shadow-card p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Attendance Calendar - {selectedClass.name}
          </h3>
          <div className="flex items-center space-x-3">
            <Button
              variant={isEditing ? "secondary" : "primary"}
              onClick={onToggleEdit}
            >
              <ApperIcon name={isEditing ? "X" : "Edit"} className="h-4 w-4 mr-2" />
              {isEditing ? "Cancel" : "Mark Attendance"}
            </Button>
          </div>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => navigateMonth(-1)}>
            <ApperIcon name="ChevronLeft" className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-semibold text-gray-900">
            {format(currentMonth, "MMMM yyyy")}
          </h2>
          <Button variant="ghost" onClick={() => navigateMonth(1)}>
            <ApperIcon name="ChevronRight" className="h-4 w-4" />
          </Button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((day) => {
            const stats = getAttendanceStats(day);
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const isWeekendDay = isWeekend(day);
            
            return (
              <motion.button
                key={day.toString()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onDateSelect(day)}
                className={`
                  p-2 text-sm rounded-lg transition-all duration-200
                  ${isSelected 
                    ? "bg-primary text-white shadow-lg" 
                    : isWeekendDay 
                      ? "bg-gray-100 text-gray-400" 
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                  }
                `}
              >
                <div className="font-medium">{format(day, "d")}</div>
                {stats.total > 0 && (
                  <div className="flex justify-center mt-1">
                    <div className={`w-2 h-2 rounded-full ${
                      stats.present === students.length ? "bg-green-500" :
                      stats.absent > 0 ? "bg-red-500" :
                      stats.late > 0 ? "bg-yellow-500" : "bg-gray-300"
                    }`} />
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Daily Attendance */}
      {selectedDate && (
        <div className="bg-white rounded-xl shadow-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Attendance for {format(selectedDate, "MMMM d, yyyy")}
            </h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Present</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Absent</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>Late</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Excused</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {students.map((student) => {
              const status = getAttendanceStatus(student.Id, selectedDate);
              
              return (
                <div
                  key={student.Id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <span className="text-white font-medium">
                        {student.firstName[0]}{student.lastName[0]}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {student.firstName} {student.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {student.Id}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {getStatusBadge(status)}
                    {isEditing && (
                      <div className="flex items-center space-x-2">
                        {["present", "absent", "late", "excused"].map((statusOption) => (
                          <Button
                            key={statusOption}
                            variant={status === statusOption ? "primary" : "outline"}
                            size="sm"
                            onClick={() => onMarkAttendance(student.Id, selectedDate, statusOption)}
                            className={`${getStatusColor(statusOption)} ${
                              status === statusOption ? "text-white" : ""
                            }`}
                          >
                            {statusOption.charAt(0).toUpperCase() + statusOption.slice(1)}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceCalendar;