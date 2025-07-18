import React from "react";
import { motion } from "framer-motion";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const GradeGrid = ({ 
  students, 
  assignments, 
  grades, 
  onGradeChange, 
  onSaveGrades, 
  selectedClass,
  isEditing,
  onToggleEdit
}) => {
  const getGrade = (studentId, assignmentId) => {
    const grade = grades.find(g => g.studentId === studentId && g.assignmentId === assignmentId);
    return grade ? grade.score : "";
  };

  const getGradeLetter = (score, maxScore) => {
    if (!score || !maxScore) return "";
    const percentage = (score / maxScore) * 100;
    if (percentage >= 90) return "A";
    if (percentage >= 80) return "B";
    if (percentage >= 70) return "C";
    if (percentage >= 60) return "D";
    return "F";
  };

  const getGradeColor = (score, maxScore) => {
    if (!score || !maxScore) return "";
    const percentage = (score / maxScore) * 100;
    if (percentage >= 90) return "grade-a";
    if (percentage >= 80) return "grade-b";
    if (percentage >= 70) return "grade-c";
    if (percentage >= 60) return "grade-d";
    return "grade-f";
  };

  const calculateStudentAverage = (studentId) => {
    const studentGrades = grades.filter(g => g.studentId === studentId);
    if (studentGrades.length === 0) return 0;
    
    const totalPoints = studentGrades.reduce((sum, grade) => {
      const assignment = assignments.find(a => a.Id === grade.assignmentId);
      return sum + (grade.score / assignment.maxScore) * 100;
    }, 0);
    
    return Math.round(totalPoints / studentGrades.length);
  };

  if (!selectedClass) {
    return (
      <div className="bg-white rounded-xl shadow-card p-8 text-center">
        <ApperIcon name="BookOpen" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Class</h3>
        <p className="text-gray-500">Choose a class to view and manage grades</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-card overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">
            Grade Book - {selectedClass.name}
          </h3>
          <div className="flex items-center space-x-3">
            <Button
              variant={isEditing ? "secondary" : "primary"}
              onClick={onToggleEdit}
            >
              <ApperIcon name={isEditing ? "X" : "Edit"} className="h-4 w-4 mr-2" />
              {isEditing ? "Cancel" : "Edit Grades"}
            </Button>
            {isEditing && (
              <Button onClick={onSaveGrades}>
                <ApperIcon name="Save" className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50">
                Student
              </th>
              {assignments.map((assignment) => (
                <th
                  key={assignment.Id}
                  className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]"
                >
                  <div>
                    <div className="font-semibold">{assignment.name}</div>
                    <div className="text-gray-400">/{assignment.maxScore}</div>
                  </div>
                </th>
              ))}
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Average
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.map((student, index) => (
              <motion.tr
                key={student.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="hover:bg-gray-50"
              >
                <td className="px-6 py-4 whitespace-nowrap sticky left-0 bg-white">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {student.firstName[0]}{student.lastName[0]}
                        </span>
                      </div>
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">
                        {student.firstName} {student.lastName}
                      </div>
                    </div>
                  </div>
                </td>
                {assignments.map((assignment) => {
                  const score = getGrade(student.Id, assignment.Id);
                  const gradeLetter = getGradeLetter(score, assignment.maxScore);
                  const gradeColor = getGradeColor(score, assignment.maxScore);
                  
                  return (
                    <td key={assignment.Id} className="px-4 py-4 text-center">
                      {isEditing ? (
                        <Input
                          type="number"
                          min="0"
                          max={assignment.maxScore}
                          value={score}
                          onChange={(e) => onGradeChange(student.Id, assignment.Id, e.target.value)}
                          className="w-20 text-center"
                        />
                      ) : (
                        <div className="flex flex-col items-center">
                          <div className={`px-3 py-1 rounded-full text-white text-sm font-medium ${gradeColor}`}>
                            {score || "-"}
                          </div>
                          {gradeLetter && (
                            <div className="text-xs text-gray-500 mt-1">
                              {gradeLetter}
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                  );
                })}
                <td className="px-4 py-4 text-center">
                  <div className="text-lg font-bold gradient-text">
                    {calculateStudentAverage(student.Id)}%
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GradeGrid;