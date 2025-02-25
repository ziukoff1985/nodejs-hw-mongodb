// Імпортуємо модель "StudentsCollection" з файлу "db/modelsstudent.js"
import { StudentsCollection } from '../db/models/student.js';

// Функція для отримання всіх студентів
// Якщо студентів НЕ знайдено, то повертається пустий масив
export const getAllStudents = async () => {
  const students = await StudentsCollection.find();
  return students; // Повертаємо документи всіх студентів
};

// Функція для отримання одного студента по ID
// Приймає ID студента
// Якщо студент НЕ знайдений, то повертається null
export const getStudentById = async (studentId) => {
  const student = await StudentsCollection.findById(studentId);
  return student; // Повертаємо документи студента
};
