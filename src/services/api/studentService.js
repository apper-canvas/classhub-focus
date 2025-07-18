import { toast } from "react-toastify";

export const studentService = {
  async getAll() {
    try {
      const tableName = 'student_c';
      
      const tableFields = [
        { "field": { "Name": "Name" } },
        { "field": { "Name": "first_name_c" } },
        { "field": { "Name": "last_name_c" } },
        { "field": { "Name": "email_c" } },
        { "field": { "Name": "grade_c" } },
        { "field": { "Name": "date_of_birth_c" } },
        { "field": { "Name": "enrollment_date_c" } },
        { "field": { "Name": "status_c" } },
        { "field": { "Name": "Tags" } },
        { "field": { "Name": "Owner" } },
        { "field": { "Name": "CreatedOn" } },
        { "field": { "Name": "CreatedBy" } },
        { "field": { "Name": "ModifiedOn" } },
        { "field": { "Name": "ModifiedBy" } }
      ];
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: tableFields,
        orderBy: [{ "fieldName": "Name", "sorttype": "ASC" }]
      };
      
      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching students:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async getById(id) {
    try {
      const tableName = 'student_c';
      
      const tableFields = [
        { "field": { "Name": "Name" } },
        { "field": { "Name": "first_name_c" } },
        { "field": { "Name": "last_name_c" } },
        { "field": { "Name": "email_c" } },
        { "field": { "Name": "grade_c" } },
        { "field": { "Name": "date_of_birth_c" } },
        { "field": { "Name": "enrollment_date_c" } },
        { "field": { "Name": "status_c" } },
        { "field": { "Name": "Tags" } },
        { "field": { "Name": "Owner" } }
      ];
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: tableFields
      };
      
      const response = await apperClient.getRecordById(tableName, id, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching student with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async create(studentData) {
    try {
      const tableName = 'student_c';
      
      const updateableData = {
        Name: studentData.Name || `${studentData.first_name_c} ${studentData.last_name_c}`,
        first_name_c: studentData.first_name_c,
        last_name_c: studentData.last_name_c,
        email_c: studentData.email_c,
        grade_c: studentData.grade_c,
        date_of_birth_c: studentData.date_of_birth_c,
        enrollment_date_c: studentData.enrollment_date_c,
        status_c: studentData.status_c,
        Tags: studentData.Tags || "",
        Owner: studentData.Owner || ""
      };
      
      const params = {
        records: [updateableData]
      };
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const response = await apperClient.createRecord(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create students ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating student:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
    }
  },

  async update(id, studentData) {
    try {
      const tableName = 'student_c';
      
      const updateableData = {
        Id: id,
        Name: studentData.Name || `${studentData.first_name_c} ${studentData.last_name_c}`,
        first_name_c: studentData.first_name_c,
        last_name_c: studentData.last_name_c,
        email_c: studentData.email_c,
        grade_c: studentData.grade_c,
        date_of_birth_c: studentData.date_of_birth_c,
        enrollment_date_c: studentData.enrollment_date_c,
        status_c: studentData.status_c,
        Tags: studentData.Tags || "",
        Owner: studentData.Owner || ""
      };
      
      const params = {
        records: [updateableData]
      };
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const response = await apperClient.updateRecord(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update students ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating student:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
    }
  },

  async delete(id) {
    try {
      const tableName = 'student_c';
      
      const params = {
        RecordIds: [id]
      };
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const response = await apperClient.deleteRecord(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete students ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting student:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
    }
  }
};