import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import GradeGrid from "@/components/organisms/GradeGrid";
import Modal from "@/components/molecules/Modal";
import FormField from "@/components/molecules/FormField";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { classService } from "@/services/api/classService";
import { studentService } from "@/services/api/studentService";
import { assignmentService } from "@/services/api/assignmentService";
import { gradeService } from "@/services/api/gradeService";

const Grades = () => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedClass, setSelectedClass] = useState(null);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [assignmentForm, setAssignmentForm] = useState({
    name: "",
    maxScore: "",
    dueDate: "",
    category: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      const classStudents = students.filter(s => 
        selectedClass.studentIds?.includes(s.Id)
      );
      const classAssignments = assignments.filter(a => 
        a.classId === selectedClass.Id
      );
      setFilteredStudents(classStudents);
      setFilteredAssignments(classAssignments);
    } else {
      setFilteredStudents([]);
      setFilteredAssignments([]);
    }
  }, [selectedClass, students, assignments]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [classData, studentData, assignmentData, gradeData] = await Promise.all([
        classService.getAll(),
        studentService.getAll(),
        assignmentService.getAll(),
        gradeService.getAll(),
      ]);
      setClasses(classData);
      setStudents(studentData);
      setAssignments(assignmentData);
      setGrades(gradeData);
    } catch (err) {
      setError("Failed to load grades data");
      console.error("Grades error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClassSelect = (classId) => {
    const selected = classes.find(c => c.Id === parseInt(classId));
    setSelectedClass(selected);
    setIsEditing(false);
  };

  const handleGradeChange = (studentId, assignmentId, score) => {
    const numScore = parseFloat(score) || 0;
    const assignment = assignments.find(a => a.Id === assignmentId);
    
    if (assignment && numScore > assignment.maxScore) {
      toast.error(`Score cannot exceed ${assignment.maxScore} points`);
      return;
    }

    const existingGradeIndex = grades.findIndex(g => 
      g.studentId === studentId && g.assignmentId === assignmentId
    );

    if (existingGradeIndex >= 0) {
      const updatedGrades = [...grades];
      updatedGrades[existingGradeIndex] = {
        ...updatedGrades[existingGradeIndex],
        score: numScore,
      };
      setGrades(updatedGrades);
    } else {
      const newGrade = {
        studentId,
        assignmentId,
        score: numScore,
        submittedDate: new Date().toISOString(),
      };
      setGrades([...grades, newGrade]);
    }
  };

  const handleSaveGrades = async () => {
    try {
      await gradeService.updateAll(grades);
      toast.success("Grades saved successfully");
      setIsEditing(false);
    } catch (err) {
      toast.error("Failed to save grades");
      console.error("Save error:", err);
    }
  };

  const handleAddAssignment = async (e) => {
    e.preventDefault();
    try {
      const newAssignment = await assignmentService.create({
        ...assignmentForm,
        classId: selectedClass.Id,
        maxScore: parseFloat(assignmentForm.maxScore),
      });
      setAssignments([...assignments, newAssignment]);
      setShowAssignmentModal(false);
      setAssignmentForm({
        name: "",
        maxScore: "",
        dueDate: "",
        category: "",
      });
      toast.success("Assignment added successfully");
    } catch (err) {
      toast.error("Failed to add assignment");
      console.error("Assignment error:", err);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold gradient-text mb-2">
            Grades
          </h1>
          <p className="text-gray-600">Manage student grades and assignments</p>
        </div>
        <div className="flex items-center space-x-3">
          {selectedClass && (
            <Button 
              onClick={() => setShowAssignmentModal(true)}
              variant="secondary"
            >
              <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
              Add Assignment
            </Button>
          )}
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
                  {classData.name} - {classData.subject}
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
        <GradeGrid
          students={filteredStudents}
          assignments={filteredAssignments}
          grades={grades}
          onGradeChange={handleGradeChange}
          onSaveGrades={handleSaveGrades}
          selectedClass={selectedClass}
          isEditing={isEditing}
          onToggleEdit={() => setIsEditing(!isEditing)}
        />
      </motion.div>

      <Modal
        isOpen={showAssignmentModal}
        onClose={() => setShowAssignmentModal(false)}
        title="Add New Assignment"
        size="md"
      >
        <form onSubmit={handleAddAssignment} className="space-y-6">
          <FormField
            label="Assignment Name"
            required
            value={assignmentForm.name}
            onChange={(e) => setAssignmentForm({...assignmentForm, name: e.target.value})}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Max Score"
              type="number"
              required
              value={assignmentForm.maxScore}
              onChange={(e) => setAssignmentForm({...assignmentForm, maxScore: e.target.value})}
            />
            <FormField
              label="Due Date"
              type="date"
              required
              value={assignmentForm.dueDate}
              onChange={(e) => setAssignmentForm({...assignmentForm, dueDate: e.target.value})}
            />
          </div>

          <FormField
            label="Category"
            type="select"
            required
            value={assignmentForm.category}
            onChange={(e) => setAssignmentForm({...assignmentForm, category: e.target.value})}
            options={[
              { value: "", label: "Select Category" },
              { value: "homework", label: "Homework" },
              { value: "quiz", label: "Quiz" },
              { value: "test", label: "Test" },
              { value: "project", label: "Project" },
              { value: "participation", label: "Participation" },
            ]}
          />

          <div className="flex justify-end space-x-3 pt-6">
            <Button type="button" variant="secondary" onClick={() => setShowAssignmentModal(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Add Assignment
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Grades;