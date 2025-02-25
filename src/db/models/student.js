// Імпортуємо "функцію model" та "клас Schema" з бібліотеки "mongoose".
import { model, Schema } from 'mongoose';

// Створюємо схему для колекції "students"
const studentsSchema = new Schema(
  {
    name: { type: String, required: true }, // Ім'я студента
    age: { type: Number, required: true }, // Вік студента
    gender: { type: String, required: true, enum: ['male', 'female', 'other'] }, // Стать студента
    avgMark: { type: Number, required: true }, // Середній бал студента
    onDuty: { type: Boolean, required: true, default: false }, // Призначення студента
  },
  {
    timestamps: true, // Додавання полів "createdAt" та "updatedAt"
    versionKey: false, // Вимкнення версіонування
  },
);

// Створюємо модель "students" на основі схеми "studentsSchema"
// StudentsCollection - клас, який дає методи для роботи з колекцією "students": save(), find(), findOne(), findById(), update(), delete() та інші
export const StudentsCollection = model('students', studentsSchema);
