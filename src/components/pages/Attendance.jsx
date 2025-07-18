import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import AttendanceCalendar from "@/components/organisms/AttendanceCalendar";
import Select from "@/components/atoms/Select";
import { attendanceService } from "@/services/api/attendanceService";
import { classService } from "@/services/api/classService";
import { studentService } from "@/services/api/studentService";
const Attendance = () => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

useEffect(() => {
    if (selectedClass) {
      const studentIds = selectedClass.student_ids_c ? selectedClass.student_ids_c.split(',').map(id => parseInt(id)) : [];
      const classStudents = students.filter(s => 
        studentIds.includes(s.Id)
      );
      setFilteredStudents(classStudents);
    } else {
      setFilteredStudents([]);
    }
  }, [selectedClass, students]);
  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [classData, studentData, attendanceData] = await Promise.all([
        classService.getAll(),
        studentService.getAll(),
        attendanceService.getAll(),
      ]);
      setClasses(classData);
      setStudents(studentData);
      setAttendance(attendanceData);
    } catch (err) {
      setError("Failed to load attendance data");
      console.error("Attendance error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClassSelect = (classId) => {
    const selected = classes.find(c => c.Id === parseInt(classId));
    setSelectedClass(selected);
    setIsEditing(false);
  };

const handleMarkAttendance = async (studentId, date, status) => {
    try {
      const attendanceRecord = {
        student_id_c: studentId,
        class_id_c: selectedClass.Id,
        date_c: date.toISOString().split("T")[0],
        status_c: status,
      };

      const existingIndex = attendance.findIndex(a => 
        a.student_id_c === studentId && 
        a.class_id_c === selectedClass.Id && 
        a.date_c === attendanceRecord.date_c
      );

      if (existingIndex >= 0) {
        const updatedAttendance = [...attendance];
        updatedAttendance[existingIndex] = attendanceRecord;
        setAttendance(updatedAttendance);
        await attendanceService.update(updatedAttendance[existingIndex].Id, attendanceRecord);
      } else {
        const newRecord = await attendanceService.create(attendanceRecord);
        setAttendance([...attendance, newRecord]);
      }

      toast.success("Attendance updated successfully");
    } catch (err) {
      toast.error("Failed to update attendance");
      console.error("Attendance error:", err);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold gradient-text mb-2">
            Attendance
          </h1>
          <p className="text-gray-600">Track student attendance and participation</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Select Class</h3>
          <div className="w-64">
            <Select 
              value={selectedClass?.Id || ""}
              onChange={(e) => handleClassSelect(e.target.value)}
            >
              <option value="">Choose a class...</option>
              {classes.map((classData) => (
<option key={classData.Id} value={classData.Id}>
                  {classData.Name} - {classData.subject_c}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <AttendanceCalendar
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          selectedClass={selectedClass}
          students={filteredStudents}
          attendance={attendance}
          onMarkAttendance={handleMarkAttendance}
          isEditing={isEditing}
          onToggleEdit={() => setIsEditing(!isEditing)}
        />
      </motion.div>
    </div>
  );
};

export default Attendance;