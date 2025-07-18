import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import StatCard from "@/components/molecules/StatCard";
import Card from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { studentService } from "@/services/api/studentService";
import { classService } from "@/services/api/classService";
import { attendanceService } from "@/services/api/attendanceService";
import { gradeService } from "@/services/api/gradeService";
import { format, isToday } from "date-fns";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalClasses: 0,
    avgGrade: 0,
    attendanceRate: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [todayAttendance, setTodayAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [students, classes, grades, attendance] = await Promise.all([
        studentService.getAll(),
        classService.getAll(),
        gradeService.getAll(),
        attendanceService.getAll(),
      ]);

      // Calculate stats
      const totalStudents = students.length;
      const totalClasses = classes.length;
      
      // Calculate average grade
      const avgGrade = grades.length > 0 
        ? Math.round(grades.reduce((sum, grade) => sum + grade.score, 0) / grades.length)
        : 0;

      // Calculate attendance rate
      const todayAttendanceRecords = attendance.filter(record => 
        isToday(new Date(record.date))
      );
      const presentToday = todayAttendanceRecords.filter(record => 
        record.status === "present"
      ).length;
      const attendanceRate = todayAttendanceRecords.length > 0
        ? Math.round((presentToday / todayAttendanceRecords.length) * 100)
        : 0;

      setStats({
        totalStudents,
        totalClasses,
        avgGrade,
        attendanceRate,
      });

      // Recent activity
      const recentGrades = grades
        .sort((a, b) => new Date(b.submittedDate) - new Date(a.submittedDate))
        .slice(0, 5)
        .map(grade => {
          const student = students.find(s => s.Id === grade.studentId);
          return {
            type: "grade",
            message: `${student?.firstName} ${student?.lastName} received a grade`,
            time: grade.submittedDate,
            icon: "FileText",
          };
        });

      setRecentActivity(recentGrades);
      setTodayAttendance(todayAttendanceRecords);
    } catch (err) {
      setError("Failed to load dashboard data");
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold gradient-text mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome back! Here's what's happening in your classes today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatCard
            title="Total Students"
            value={stats.totalStudents}
            icon="Users"
            trend={5}
            color="primary"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatCard
            title="Active Classes"
            value={stats.totalClasses}
            icon="BookOpen"
            trend={2}
            color="secondary"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StatCard
            title="Average Grade"
            value={`${stats.avgGrade}%`}
            icon="TrendingUp"
            trend={3}
            color="success"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <StatCard
            title="Attendance Rate"
            value={`${stats.attendanceRate}%`}
            icon="Calendar"
            trend={1}
            color="warning"
          />
        </motion.div>
      </div>

      {/* Recent Activity and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              <ApperIcon name="Clock" className="h-5 w-5 text-gray-400" />
            </div>
            
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary bg-opacity-10 rounded-full flex items-center justify-center">
                      <ApperIcon name={activity.icon} className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(activity.time), "MMM d, h:mm a")}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <ApperIcon name="Activity" className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No recent activity</p>
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Today's Attendance</h3>
              <ApperIcon name="Users" className="h-5 w-5 text-gray-400" />
            </div>
            
            <div className="space-y-4">
              {todayAttendance.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {todayAttendance.filter(a => a.status === "present").length}
                    </div>
                    <div className="text-sm text-green-600">Present</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">
                      {todayAttendance.filter(a => a.status === "absent").length}
                    </div>
                    <div className="text-sm text-red-600">Absent</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">
                      {todayAttendance.filter(a => a.status === "late").length}
                    </div>
                    <div className="text-sm text-yellow-600">Late</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {todayAttendance.filter(a => a.status === "excused").length}
                    </div>
                    <div className="text-sm text-blue-600">Excused</div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <ApperIcon name="Calendar" className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No attendance recorded today</p>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;