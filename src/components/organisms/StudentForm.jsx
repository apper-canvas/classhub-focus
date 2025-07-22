import React, { useState, useEffect } from "react";
import FormField from "@/components/molecules/FormField";
import Button from "@/components/atoms/Button";
import { format } from "date-fns";

const StudentForm = ({ student, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    first_name_c: "",
    last_name_c: "",
    email_c: "",
    grade_c: "",
    date_of_birth_c: "",
    enrollment_date_c: "",
    status_c: "active",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (student) {
      setFormData({
        first_name_c: student.first_name_c || "",
        last_name_c: student.last_name_c || "",
        email_c: student.email_c || "",
        grade_c: student.grade_c || "",
        date_of_birth_c: student.date_of_birth_c ? format(new Date(student.date_of_birth_c), "yyyy-MM-dd") : "",
        enrollment_date_c: student.enrollment_date_c ? format(new Date(student.enrollment_date_c), "yyyy-MM-dd") : "",
        status_c: student.status_c || "active",
      });
    }
  }, [student]);

const validateForm = () => {
    const newErrors = {};
    
    if (!formData.first_name_c.trim()) newErrors.first_name_c = "First name is required";
    if (!formData.last_name_c.trim()) newErrors.last_name_c = "Last name is required";
    if (!formData.email_c.trim()) newErrors.email_c = "Email is required";
    if (!formData.grade_c.trim()) newErrors.grade_c = "Grade is required";
    if (!formData.date_of_birth_c) newErrors.date_of_birth_c = "Date of birth is required";
    if (!formData.enrollment_date_c) newErrors.enrollment_date_c = "Enrollment date is required";

    if (formData.email_c && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email_c)) {
      newErrors.email_c = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const gradeOptions = [
    { value: "", label: "Select Grade" },
    { value: "K", label: "Kindergarten" },
    { value: "1", label: "1st Grade" },
    { value: "2", label: "2nd Grade" },
    { value: "3", label: "3rd Grade" },
    { value: "4", label: "4th Grade" },
    { value: "5", label: "5th Grade" },
    { value: "6", label: "6th Grade" },
    { value: "7", label: "7th Grade" },
    { value: "8", label: "8th Grade" },
    { value: "9", label: "9th Grade" },
    { value: "10", label: "10th Grade" },
    { value: "11", label: "11th Grade" },
    { value: "12", label: "12th Grade" },
  ];

const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "pending", label: "Pending" },
  ];
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<FormField
          label="First Name"
          required
          value={formData.first_name_c}
          onChange={(e) => handleChange("first_name_c", e.target.value)}
          error={errors.first_name_c}
        />
        <FormField
          label="Last Name"
          required
          value={formData.last_name_c}
          onChange={(e) => handleChange("last_name_c", e.target.value)}
          error={errors.last_name_c}
        />
      </div>

<FormField
        label="Email"
        type="email"
        required
        value={formData.email_c}
        onChange={(e) => handleChange("email_c", e.target.value)}
        error={errors.email_c}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<FormField
          label="Grade"
          type="select"
          required
          value={formData.grade_c}
          onChange={(e) => handleChange("grade_c", e.target.value)}
          options={gradeOptions}
          error={errors.grade_c}
        />
        <FormField
          label="Status"
          type="select"
          required
          value={formData.status_c}
          onChange={(e) => handleChange("status_c", e.target.value)}
          options={statusOptions}
          error={errors.status_c}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<FormField
          label="Date of Birth"
          type="date"
          required
          value={formData.date_of_birth_c}
          onChange={(e) => handleChange("date_of_birth_c", e.target.value)}
          error={errors.date_of_birth_c}
        />
        <FormField
          label="Enrollment Date"
          type="date"
          required
          value={formData.enrollment_date_c}
          onChange={(e) => handleChange("enrollment_date_c", e.target.value)}
          error={errors.enrollment_date_c}
        />
      </div>

      <div className="flex justify-end space-x-3 pt-6">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {student ? "Update Student" : "Add Student"}
        </Button>
      </div>
    </form>
  );
};

export default StudentForm;