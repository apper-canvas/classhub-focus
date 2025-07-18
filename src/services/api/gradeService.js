import { toast } from "react-toastify";

export const gradeService = {
  async getAll() {
    try {
      const tableName = 'grade_c';
      
      const tableFields = [
        { "field": { "Name": "Name" } },
        { "field": { "Name": "score_c" } },
        { "field": { "Name": "submitted_date_c" } },
        { "field": { "Name": "student_id_c" } },
        { "field": { "Name": "assignment_id_c" } },
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
        orderBy: [{ "fieldName": "submitted_date_c", "sorttype": "DESC" }]
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
        console.error("Error fetching grades:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async getById(id) {
    try {
      const tableName = 'grade_c';
      
      const tableFields = [
        { "field": { "Name": "Name" } },
        { "field": { "Name": "score_c" } },
        { "field": { "Name": "submitted_date_c" } },
        { "field": { "Name": "student_id_c" } },
        { "field": { "Name": "assignment_id_c" } },
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
        console.error(`Error fetching grade with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async create(gradeData) {
    try {
      const tableName = 'grade_c';
      
      const updateableData = {
        Name: gradeData.Name || `Grade for ${gradeData.student_id_c || gradeData.studentId}`,
        score_c: parseFloat(gradeData.score_c || gradeData.score),
        submitted_date_c: gradeData.submitted_date_c || gradeData.submittedDate,
        student_id_c: parseInt(gradeData.student_id_c || gradeData.studentId),
        assignment_id_c: parseInt(gradeData.assignment_id_c || gradeData.assignmentId),
        Tags: gradeData.Tags || "",
        Owner: gradeData.Owner || ""
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
          console.error(`Failed to create grades ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
        console.error("Error creating grade:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
    }
  },

  async update(id, gradeData) {
    try {
      const tableName = 'grade_c';
      
      const updateableData = {
        Id: id,
        Name: gradeData.Name || `Grade for ${gradeData.student_id_c || gradeData.studentId}`,
        score_c: parseFloat(gradeData.score_c || gradeData.score),
        submitted_date_c: gradeData.submitted_date_c || gradeData.submittedDate,
        student_id_c: parseInt(gradeData.student_id_c || gradeData.studentId),
        assignment_id_c: parseInt(gradeData.assignment_id_c || gradeData.assignmentId),
        Tags: gradeData.Tags || "",
        Owner: gradeData.Owner || ""
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
          console.error(`Failed to update grades ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
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
        console.error("Error updating grade:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
    }
  },

  async updateAll(gradesList) {
    try {
      const tableName = 'grade_c';
      
      const updateableRecords = gradesList.map(grade => ({
        Id: grade.Id,
        Name: grade.Name || `Grade for ${grade.student_id_c || grade.studentId}`,
        score_c: parseFloat(grade.score_c || grade.score),
        submitted_date_c: grade.submitted_date_c || grade.submittedDate,
        student_id_c: parseInt(grade.student_id_c || grade.studentId),
        assignment_id_c: parseInt(grade.assignment_id_c || grade.assignmentId),
        Tags: grade.Tags || "",
        Owner: grade.Owner || ""
      }));
      
      const params = {
        records: updateableRecords
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
        return false;
      }
      
      return true;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating grades:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  },

  async delete(id) {
    try {
      const tableName = 'grade_c';
      
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
          console.error(`Failed to delete grades ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting grade:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
    }
  }
};