import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import StudentTable from "@/components/organisms/StudentTable";
import StudentForm from "@/components/organisms/StudentForm";
import Modal from "@/components/molecules/Modal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { studentService } from "@/services/api/studentService";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    filterAndSortStudents();
  }, [students, searchTerm, sortBy, sortOrder]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await studentService.getAll();
      setStudents(data);
    } catch (err) {
      setError("Failed to load students");
      console.error("Students error:", err);
    } finally {
      setLoading(false);
    }
  };

const filterAndSortStudents = () => {
    let filtered = students.filter(student =>
      `${student.first_name_c || ''} ${student.last_name_c || ''}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      student.email_c?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.grade_c?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case "name":
          aValue = `${a.first_name_c || ''} ${a.last_name_c || ''}`.toLowerCase();
          bValue = `${b.first_name_c || ''} ${b.last_name_c || ''}`.toLowerCase();
          break;
        case "email":
          aValue = a.email_c?.toLowerCase() || "";
          bValue = b.email_c?.toLowerCase() || "";
          break;
        case "grade":
          aValue = a.grade_c || "";
          bValue = b.grade_c || "";
          break;
        case "enrollmentDate":
          aValue = new Date(a.enrollment_date_c || 0);
          bValue = new Date(b.enrollment_date_c || 0);
          break;
        case "status":
          aValue = a.status_c || "";
          bValue = b.status_c || "";
          break;
        default:
          aValue = a[sortBy] || "";
          bValue = b[sortBy] || "";
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredStudents(filtered);
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const handleAddStudent = () => {
    setSelectedStudent(null);
    setShowModal(true);
  };

  const handleEditStudent = (student) => {
    setSelectedStudent(student);
    setShowModal(true);
  };

  const handleDeleteStudent = async (studentId) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await studentService.delete(studentId);
        setStudents(students.filter(s => s.Id !== studentId));
        toast.success("Student deleted successfully");
      } catch (err) {
        toast.error("Failed to delete student");
        console.error("Delete error:", err);
      }
    }
  };

const handleSubmitStudent = async (formData) => {
    try {
      if (selectedStudent) {
        const updatedStudent = await studentService.update(selectedStudent.Id, formData);
        if (updatedStudent) {
          const updatedStudents = students.map(s => s.Id === selectedStudent.Id ? updatedStudent : s);
          setStudents(updatedStudents);
          toast.success("Student updated successfully");
        }
      } else {
        const newStudent = await studentService.create(formData);
        if (newStudent) {
          const newStudents = [...students, newStudent];
          setStudents(newStudents);
          toast.success("Student added successfully");
        }
      }
      setShowModal(false);
    } catch (err) {
      toast.error("Failed to save student");
      console.error("Save error:", err);
    }
  };

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadStudents} />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold gradient-text mb-2">
            Students
          </h1>
          <p className="text-gray-600">Manage your student roster</p>
        </div>
        <Button onClick={handleAddStudent}>
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Add Student
        </Button>
      </div>

      {filteredStudents.length === 0 && !loading ? (
        <Empty
          title="No students found"
          description="Get started by adding your first student to the system"
          icon="Users"
          action={handleAddStudent}
          actionLabel="Add Student"
        />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <StudentTable
            students={filteredStudents}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
            onEdit={handleEditStudent}
            onDelete={handleDeleteStudent}
          />
        </motion.div>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={selectedStudent ? "Edit Student" : "Add New Student"}
        size="lg"
      >
        <StudentForm
          student={selectedStudent}
          onSubmit={handleSubmitStudent}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </div>
  );
};

export default Students;