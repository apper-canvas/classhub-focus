import { toast } from "react-toastify";

export const classService = {
  async getAll() {
    try {
      const tableName = 'class_c';
      
      const tableFields = [
        { "field": { "Name": "Name" } },
        { "field": { "Name": "subject_c" } },
        { "field": { "Name": "period_c" } },
        { "field": { "Name": "room_c" } },
        { "field": { "Name": "student_ids_c" } },
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
        console.error("Error fetching classes:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async getById(id) {
    try {
      const tableName = 'class_c';
      
      const tableFields = [
        { "field": { "Name": "Name" } },
        { "field": { "Name": "subject_c" } },
        { "field": { "Name": "period_c" } },
        { "field": { "Name": "room_c" } },
        { "field": { "Name": "student_ids_c" } },
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
        console.error(`Error fetching class with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async create(classData) {
    try {
      const tableName = 'class_c';
      
      const updateableData = {
        Name: classData.Name || classData.name,
        subject_c: classData.subject_c || classData.subject,
        period_c: classData.period_c || classData.period,
        room_c: classData.room_c || classData.room,
        student_ids_c: Array.isArray(classData.studentIds) ? classData.studentIds.join(',') : classData.student_ids_c || "",
        Tags: classData.Tags || "",
        Owner: classData.Owner || ""
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
          console.error(`Failed to create classes ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
        console.error("Error creating class:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
    }
  },

  async update(id, classData) {
    try {
      const tableName = 'class_c';
      
      const updateableData = {
        Id: id,
        Name: classData.Name || classData.name,
        subject_c: classData.subject_c || classData.subject,
        period_c: classData.period_c || classData.period,
        room_c: classData.room_c || classData.room,
        student_ids_c: Array.isArray(classData.studentIds) ? classData.studentIds.join(',') : classData.student_ids_c || "",
        Tags: classData.Tags || "",
        Owner: classData.Owner || ""
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
          console.error(`Failed to update classes ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
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
        console.error("Error updating class:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
    }
  },

  async delete(id) {
    try {
      const tableName = 'class_c';
      
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
          console.error(`Failed to delete classes ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting class:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
    }
  }
};