import studentsData from "@/services/mockData/students.json";

let students = [...studentsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const studentService = {
  async getAll() {
    await delay(300);
    return [...students];
  },

  async getById(id) {
    await delay(200);
    const student = students.find(s => s.Id === id);
    if (!student) {
      throw new Error("Student not found");
    }
    return { ...student };
  },

async create(studentData) {
    await delay(400);
    const newStudent = {
      ...studentData,
      Id: Math.max(...students.map(s => s.Id), 0) + 1,
    };
    students.push(newStudent);
    return { ...newStudent };
  },

  async update(id, studentData) {
    await delay(400);
    const index = students.findIndex(s => s.Id === id);
    if (index === -1) {
      throw new Error("Student not found");
    }
    const updatedStudent = { ...students[index], ...studentData };
    students[index] = updatedStudent;
    return { ...updatedStudent };
  },

  async delete(id) {
    await delay(300);
    const index = students.findIndex(s => s.Id === id);
    if (index === -1) {
      throw new Error("Student not found");
    }
    students.splice(index, 1);
    return true;
  },
};