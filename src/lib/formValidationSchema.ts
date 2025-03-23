import { z } from "zod";

export const subjectSchema = z.object({
    id: z.coerce.number().optional(),
    name: z
        .string()
        .min(1, { message: 'Subject name is required' }),
    teachers: z.array(z.string()),
});

export type SubjectSchema = z.infer<typeof subjectSchema>;

export const classSchema = z.object({
    id: z.coerce.number().optional(),
    name: z
        .string()
        .min(1, { message: 'Class name is required' }),
    capacity: z.coerce.number().min(1, { message: 'Capacity is required' }),
    gradeId: z.coerce.number().min(1, { message: 'Grade is required' }),
    supervisorId: z.coerce.string().optional(),
});

export type ClassSchema = z.infer<typeof classSchema>;

export const teacherSchema = z.object({
    id: z.string().optional(),
    username: z
        .string()
        .min(3, { message: 'Username mustbe atleast 3 character long!' })
        .max(20, { message: 'Username mustbe atleast 3 character long!' }),
    email: z.string().email({ message: 'Invalid email address' }).optional().or(z.literal('')),
    password: z
        .string()
        .min(8, { message: 'Password must be at least 8 character long!' }).optional().or(z.literal("")),
    name: z.string().min(1, { message: 'Name is required' }),
    surname: z.string().min(1, { message: 'Surname is required' }),
    phone: z.string().optional(),
    address: z.string(),
    img: z.string().optional(),
    bloodType: z.string().min(1, { message: 'Blood type is required' }),
    birthday: z.coerce.date({ message: 'Birthday is required' }),
    sex: z.enum(['MALE', 'FEMALE'], { message: 'Sex is required' }),
    subjects: z.array(z.string()).optional(),
});

export type TeacherSchema = z.infer<typeof teacherSchema>;

export const studentSchema = z.object({
    id: z.string().optional(),
    username: z
        .string()
        .min(3, { message: 'Username mustbe atleast 3 character long!' })
        .max(20, { message: 'Username mustbe atleast 3 character long!' }),
    email: z.string().email({ message: 'Invalid email address' }).optional().or(z.literal('')),
    password: z
        .string()
        .min(8, { message: 'Password must be at least 8 character long!' }).optional().or(z.literal("")),
    name: z.string().min(1, { message: 'Name is required' }),
    surname: z.string().min(1, { message: 'Surname is required' }),
    phone: z.string().optional(),
    address: z.string(),
    img: z.string().optional(),
    bloodType: z.string().min(1, { message: 'Blood type is required' }),
    birthday: z.coerce.date({ message: 'Birthday is required' }),
    sex: z.enum(['MALE', 'FEMALE'], { message: 'Sex is required' }),
    gradeId: z.coerce.number().min(1, { message: 'Grade is required' }),
    classId: z.coerce.number().min(1, { message: 'Class is required' }),
    parentId: z.string().min(1, { message: 'Parent is required' }),

});

export type StudentSchema = z.infer<typeof studentSchema>;

export const examSchema = z.object({
    id: z.coerce.number().optional(),
    title: z.string().min(1, { message: "Title name is required!" }),
    startTime: z.coerce.date({ message: "Start time is required!" }),
    endTime: z.coerce.date({ message: "End time is required!" }),
    lessonId: z.coerce.number({ message: "Lesson is required!" }),
});

export type ExamSchema = z.infer<typeof examSchema>;