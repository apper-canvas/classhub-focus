import classesData from "@/services/mockData/classes.json";

let classes = [...classesData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const classService = {
  async getAll() {
    await delay(300);
    return [...classes];
  },

  async getById(id) {
    await delay(200);
    const classData = classes.find(c => c.Id === id);
    if (!classData) {
      throw new Error("Class not found");
    }
    return { ...classData };
  },

  async create(classData) {
    await delay(400);
    const newClass = {
      ...classData,
      Id: Math.max(...classes.map(c => c.Id)) + 1,
    };
    classes.push(newClass);
    return { ...newClass };
  },

  async update(id, classData) {
    await delay(400);
    const index = classes.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error("Class not found");
    }
    const updatedClass = { ...classes[index], ...classData };
    classes[index] = updatedClass;
    return { ...updatedClass };
  },

  async delete(id) {
    await delay(300);
    const index = classes.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error("Class not found");
    }
    classes.splice(index, 1);
    return true;
  },
};