"use server"

import { revalidatePath } from "next/cache";
import { ClassSchema, SubjectSchema, TeacherSchema } from "./formValidationSchema";
import { prisma } from "./prisma";
import { parse } from "path";
import { clerkClient } from "@clerk/nextjs/server";

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
        await prisma.teacher.update({
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

export const deleteTeacher = async (currentState: CurrentState, data: FormData) => {
    const id = data.get('id') as string
    try {
        await prisma.teacher.delete({
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