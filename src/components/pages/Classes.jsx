import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import Students from "@/components/pages/Students";
import Modal from "@/components/molecules/Modal";
import FormField from "@/components/molecules/FormField";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import { classService } from "@/services/api/classService";
import { studentService } from "@/services/api/studentService";

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    period: "",
    room: "",
    studentIds: [],
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [classData, studentData] = await Promise.all([
        classService.getAll(),
        studentService.getAll(),
      ]);
      setClasses(classData);
      setStudents(studentData);
    } catch (err) {
      setError("Failed to load classes");
      console.error("Classes error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClass = () => {
    setSelectedClass(null);
    setFormData({
      name: "",
      subject: "",
      period: "",
      room: "",
      studentIds: [],
    });
    setShowModal(true);
  };

const handleEditClass = (classData) => {
    setSelectedClass(classData);
    setFormData({
      name: classData.Name,
      subject: classData.subject_c,
      period: classData.period_c,
      room: classData.room_c,
      studentIds: classData.student_ids_c ? classData.student_ids_c.split(',').map(id => parseInt(id)) : [],
    });
    setShowModal(true);
  };

  const handleDeleteClass = async (classId) => {
    if (window.confirm("Are you sure you want to delete this class?")) {
      try {
        await classService.delete(classId);
        setClasses(classes.filter(c => c.Id !== classId));
        toast.success("Class deleted successfully");
      } catch (err) {
        toast.error("Failed to delete class");
        console.error("Delete error:", err);
      }
    }
  };

  const handleSubmitClass = async (e) => {
    e.preventDefault();
    try {
      if (selectedClass) {
        const updatedClass = await classService.update(selectedClass.Id, formData);
        setClasses(classes.map(c => c.Id === selectedClass.Id ? updatedClass : c));
        toast.success("Class updated successfully");
      } else {
        const newClass = await classService.create(formData);
        setClasses([...classes, newClass]);
        toast.success("Class added successfully");
      }
      setShowModal(false);
    } catch (err) {
      toast.error("Failed to save class");
      console.error("Save error:", err);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleStudentToggle = (studentId) => {
    setFormData(prev => ({
      ...prev,
      studentIds: prev.studentIds.includes(studentId)
        ? prev.studentIds.filter(id => id !== studentId)
        : [...prev.studentIds, studentId]
    }));
  };

const getEnrolledStudents = (studentIds) => {
    if (!studentIds || !Array.isArray(studentIds)) return [];
    return students.filter(student => studentIds.includes(student.Id));
  };

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold gradient-text mb-2">
            Classes
          </h1>
          <p className="text-gray-600">Manage your class schedules and enrollment</p>
        </div>
        <Button onClick={handleAddClass}>
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Add Class
        </Button>
      </div>

      {classes.length === 0 && !loading ? (
        <Empty
          title="No classes found"
          description="Get started by creating your first class"
          icon="BookOpen"
          action={handleAddClass}
          actionLabel="Add Class"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((classData, index) => (
            <motion.div
              key={classData.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full">
                <div className="flex items-start justify-between mb-4">
<div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {classData.Name}
                    </h3>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600">
                        Subject: {classData.subject_c}
                      </p>
                      <p className="text-sm text-gray-600">
                        Period: {classData.period_c}
                      </p>
                      <p className="text-sm text-gray-600">
                        Room: {classData.room_c}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditClass(classData)}
                    >
                      <ApperIcon name="Edit" className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClass(classData.Id)}
                    >
                      <ApperIcon name="Trash2" className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
<span className="text-sm font-medium text-gray-700">
                      Enrolled Students
                    </span>
                    <Badge variant="primary">
                      {classData.student_ids_c ? classData.student_ids_c.split(',').length : 0}
                    </Badge>
                  </div>
                  {classData.student_ids_c && (
                    <div className="space-y-2">
                      {getEnrolledStudents(classData.student_ids_c ? classData.student_ids_c.split(',').map(id => parseInt(id)) : []).slice(0, 3).map((student) => (
                        <div key={student.Id} className="flex items-center space-x-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                            <span className="text-white text-xs font-medium">
                              {student.first_name_c?.[0]}{student.last_name_c?.[0]}
                            </span>
                          </div>
                          <span className="text-sm text-gray-600">
                            {student.first_name_c} {student.last_name_c}
                          </span>
                        </div>
                      ))}
                      {classData.student_ids_c && classData.student_ids_c.split(',').length > 3 && (
                        <p className="text-sm text-gray-500">
                          +{classData.student_ids_c.split(',').length - 3} more students
                        </p>
                      )}
                    </div>
                  )}

                  {classData.studentIds?.length > 0 && (
                    <div className="space-y-2">
                      {getEnrolledStudents(classData.studentIds).slice(0, 3).map((student) => (
                        <div key={student.Id} className="flex items-center space-x-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                            <span className="text-white text-xs font-medium">
                              {student.firstName[0]}{student.lastName[0]}
                            </span>
                          </div>
                          <span className="text-sm text-gray-600">
                            {student.firstName} {student.lastName}
                          </span>
                        </div>
                      ))}
                      {classData.studentIds.length > 3 && (
                        <p className="text-sm text-gray-500">
                          +{classData.studentIds.length - 3} more students
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={selectedClass ? "Edit Class" : "Add New Class"}
        size="lg"
      >
        <form onSubmit={handleSubmitClass} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Class Name"
              required
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
            <FormField
              label="Subject"
              required
              value={formData.subject}
              onChange={(e) => handleChange("subject", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Period"
              required
              value={formData.period}
              onChange={(e) => handleChange("period", e.target.value)}
            />
            <FormField
              label="Room"
              required
              value={formData.room}
              onChange={(e) => handleChange("room", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Enrolled Students
            </label>
            <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-lg p-4">
              <div className="space-y-2">
                {students.map((student) => (
                  <label key={student.Id} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.studentIds.includes(student.Id)}
                      onChange={() => handleStudentToggle(student.Id)}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
<div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                        <span className="text-white text-xs font-medium">
                          {student.first_name_c?.[0]}{student.last_name_c?.[0]}
                        </span>
                      </div>
                      <span className="text-sm text-gray-900">
                        {student.first_name_c} {student.last_name_c}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6">
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {selectedClass ? "Update Class" : "Add Class"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Classes;