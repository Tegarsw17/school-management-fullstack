"use server"

import { revalidatePath } from "next/cache";
import { ClassSchema, ExamSchema, StudentSchema, SubjectSchema, TeacherSchema } from "./formValidationSchema";
import { prisma } from "./prisma";
import { parse } from "path";
import { clerkClient } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";

type CurrentState = {
    success: boolean;
    error: boolean;
}
export const createSubject = async (currentState: CurrentState, data: SubjectSchema) => {
    console.log(data.name + " in the server action");
    try {
        await prisma.subject.create({
            data: {
                name: data.name,
                teachers: {
                    connect: data.teachers.map((teacherId) => ({ id: teacherId })),
                }
            }
        })

        // revalidatePath('/list/subjects')
        return { success: true, error: false }
    } catch (error) {
        console.log(error);
        return { success: false, error: true }
    }
}

export const updateSubject = async (currentState: CurrentState, data: SubjectSchema) => {
    console.log(data.name + " in the server action");
    try {
        await prisma.subject.update({
            where: {
                id: data.id
            },
            data: {
                name: data.name,
                teachers: {
                    set: data.teachers.map((teacherId) => ({ id: teacherId }))
                }
            }
        })

        // revalidatePath('/list/subjects')
        return { success: true, error: false }
    } catch (error) {
        console.log(error);
        return { success: false, error: true }
    }
}

export const deleteSubject = async (currentState: CurrentState, data: FormData) => {
    const id = data.get('id') as string
    try {
        await prisma.subject.delete({
            where: {
                id: parseInt(id)
            }
        })

        // revalidatePath('/list/subjects')
        return { success: true, error: false }
    } catch (error) {
        console.log(error);
        return { success: false, error: true }
    }
}

export const createClass = async (currentState: CurrentState, data: ClassSchema) => {
    console.log(data.name + " in the server action");
    try {
        await prisma.class.create({
            data
        })

        // revalidatePath('/list/subjects')
        return { success: true, error: false }
    } catch (error) {
        console.log(error);
        return { success: false, error: true }
    }
}

export const updateClass = async (currentState: CurrentState, data: ClassSchema) => {
    console.log(data.name + " in the server action");
    try {
        await prisma.class.update({
            where: {
                id: data.id
            },
            data
        })

        // revalidatePath('/list/subjects')
        return { success: true, error: false }
    } catch (error) {
        console.log(error);
        return { success: false, error: true }
    }
}

export const deleteClass = async (currentState: CurrentState, data: FormData) => {
    const id = data.get('id') as string
    try {
        await prisma.class.delete({
            where: {
                id: parseInt(id)
            }
        })

        // revalidatePath('/list/subjects')
        return { success: true, error: false }
    } catch (error) {
        console.log(error);
        return { success: false, error: true }
    }
}

export const createTeacher = async (currentState: CurrentState, data: TeacherSchema) => {
    console.log(data.name + " in the server action");
    try {
        const clerk = await clerkClient();
        const user = await clerk.users.createUser({
            username: data.username,
            password: data.password,
            firstName: data.name,
            lastName: data.surname,
            publicMetadata: { role: "teacher" }
        })

        await prisma.teacher.create({
            data: {
                id: user.id,
                username: data.username,
                name: data.name,
                surname: data.surname,
                email: data.email,
                phone: data.phone,
                address: data.address,
                img: data.img,
                bloodType: data.bloodType,
                birthday: data.birthday,
                sex: data.sex,
                subjects: {
                    connect: data.subjects?.map((subjectId: string) => ({ id: parseInt(subjectId) }))
                }
            }
        })

        // revalidatePath('/list/subjects')
        return { success: true, error: false }
    } catch (error) {
        console.log(error);
        return { success: false, error: true }
    }
}

export const updateTeacher = async (currentState: CurrentState, data: TeacherSchema) => {
    console.log(data.name + " in the server action");
    try {
        if (!data.id) {
            return { success: false, error: true }
        }
        const clerk = await clerkClient();
        const user = await clerk.users.updateUser(data.id, {
            username: data.username,
            ...(data.password !== "" && { password: data.password }),
            firstName: data.name,
            lastName: data.surname,
            publicMetadata: { role: "teacher" }
        })

        await prisma.teacher.update({
            where: {
                id: data.id
            },
            data: {
                ...(data.password !== "" && { password: data.password }),
                username: data.username,
                name: data.name,
                surname: data.surname,
                email: data.email,
                phone: data.phone,
                address: data.address,
                img: data.img,
                bloodType: data.bloodType,
                birthday: data.birthday,
                sex: data.sex,
                subjects: {
                    set: data.subjects?.map((subjectId: string) => ({ id: parseInt(subjectId) }))
                }
            }
        })

        // revalidatePath('/list/subjects')
        return { success: true, error: false }
    } catch (error) {
        console.log(error);
        return { success: false, error: true }
    }
}

export const deleteTeacher = async (currentState: CurrentState, data: FormData) => {
    const id = data.get('id') as string
    try {
        const clerk = await clerkClient();
        await clerk.users.deleteUser(id);
        await prisma.teacher.delete({
            where: {
                id: id
            }
        })

        // revalidatePath('/list/subjects')
        return { success: true, error: false }
    } catch (error) {
        console.log(error);
        return { success: false, error: true }
    }
}


export const createStudent = async (currentState: CurrentState, data: StudentSchema) => {
    console.log(data.name + " in the server action");

    try {
        const classItem = await prisma.class.findFirst({
            where: {
                id: data.classId
            },
            include: { _count: { select: { students: true } } }
        })

        if (classItem && classItem.capacity === classItem._count.students) {
            return { success: false, error: true }
        }

        const clerk = await clerkClient();
        const user = await clerk.users.createUser({
            username: data.username,
            password: data.password,
            firstName: data.name,
            lastName: data.surname,
            publicMetadata: { role: "student" }
        })

        await prisma.student.create({
            data: {
                id: user.id,
                username: data.username,
                name: data.name,
                surname: data.surname,
                email: data.email,
                phone: data.phone,
                address: data.address,
                img: data.img,
                bloodType: data.bloodType,
                birthday: data.birthday,
                sex: data.sex,
                gradeId: data.gradeId,
                classId: data.classId,
                parentId: data.parentId
            }
        })

        // revalidatePath('/list/subjects')
        return { success: true, error: false }
    } catch (error) {
        console.log(error);
        return { success: false, error: true }
    }
}

export const updateStudent = async (currentState: CurrentState, data: StudentSchema) => {
    console.log(data.name + " in the server action");
    try {
        if (!data.id) {
            return { success: false, error: true }
        }
        const clerk = await clerkClient();
        const user = await clerk.users.updateUser(data.id, {
            username: data.username,
            ...(data.password !== "" && { password: data.password }),
            firstName: data.name,
            lastName: data.surname,
            publicMetadata: { role: "student" }
        })

        await prisma.student.update({
            where: {
                id: data.id
            },
            data: {
                ...(data.password !== "" && { password: data.password }),
                username: data.username,
                name: data.name,
                surname: data.surname,
                email: data.email,
                phone: data.phone,
                address: data.address,
                img: data.img,
                bloodType: data.bloodType,
                birthday: data.birthday,
                sex: data.sex,
                gradeId: data.gradeId,
                classId: data.classId,
                parentId: data.parentId
            }
        })

        // revalidatePath('/list/subjects')
        return { success: true, error: false }
    } catch (error) {
        console.log(error);
        return { success: false, error: true }
    }
}

export const deleteStudent = async (currentState: CurrentState, data: FormData) => {
    const id = data.get('id') as string
    try {
        const clerk = await clerkClient();
        await clerk.users.deleteUser(id);
        await prisma.student.delete({
            where: {
                id: id
            }
        })

        // revalidatePath('/list/subjects')
        return { success: true, error: false }
    } catch (error) {
        console.log(error);
        return { success: false, error: true }
    }
}

export const createExam = async (
    currentState: CurrentState,
    data: ExamSchema
) => {
    // const { userId, sessionClaims } = auth();
    // const role = (sessionClaims?.metadata as { role?: string })?.role;

    try {
        // if (role === "teacher") {
        //   const teacherLesson = await prisma.lesson.findFirst({
        //     where: {
        //       teacherId: userId!,
        //       id: data.lessonId,
        //     },
        //   });

        //   if (!teacherLesson) {
        //     return { success: false, error: true };
        //   }
        // }

        await prisma.exam.create({
            data: {
                title: data.title,
                startTime: data.startTime,
                endTime: data.endTime,
                lessonId: data.lessonId,
            },
        });

        // revalidatePath("/list/subjects");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};

export const updateExam = async (
    currentState: CurrentState,
    data: ExamSchema
) => {
    // const { userId, sessionClaims } = auth();
    // const role = (sessionClaims?.metadata as { role?: string })?.role;

    try {
        // if (role === "teacher") {
        //   const teacherLesson = await prisma.lesson.findFirst({
        //     where: {
        //       teacherId: userId!,
        //       id: data.lessonId,
        //     },
        //   });

        //   if (!teacherLesson) {
        //     return { success: false, error: true };
        //   }
        // }

        await prisma.exam.update({
            where: {
                id: data.id,
            },
            data: {
                title: data.title,
                startTime: data.startTime,
                endTime: data.endTime,
                lessonId: data.lessonId,
            },
        });

        // revalidatePath("/list/subjects");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};

export const deleteExam = async (
    currentState: CurrentState,
    data: FormData
) => {
    const id = data.get("id") as string;

    // const { userId, sessionClaims } = auth();
    // const role = (sessionClaims?.metadata as { role?: string })?.role;

    try {
        await prisma.exam.delete({
            where: {
                id: parseInt(id),
                // ...(role === "teacher" ? { lesson: { teacherId: userId! } } : {}),
            },
        });

        // revalidatePath("/list/subjects");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};