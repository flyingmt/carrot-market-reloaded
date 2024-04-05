"use server";

import bcrypt from 'bcrypt';
import { PASSWORD_MIN_LENGTH, PASSWORD_REGEX } from '@/lib/constatns';
import db from '@/lib/db';
import {z} from 'zod';
import { redirect } from 'next/navigation';
import getSession from '@/lib/session';


function checkPasswords({password, confirm_password}: {password: string, confirm_password: string}) {
    return password === confirm_password;
}

const formSchema = z.object({
    username: z.string(
        {
            invalid_type_error: "Username must be a string!",
            required_error: "Username is required!",
        }
    )
        .toLowerCase()
        .trim(),
    email: z.string().email().toLowerCase(),
    password: z.string().min(PASSWORD_MIN_LENGTH).regex(PASSWORD_REGEX, "Password is too weak!"),
    confirm_password: z.string().min(PASSWORD_MIN_LENGTH),
}).superRefine(async ({username}, ctx) => {
    const user = await db.user.findUnique({
        where: {
            username,
        },
        select: {
            id: true,
        },
    });
    if (user) {
        ctx.addIssue({
            code: 'custom',
            message: "This username is alread taken",
            path: ["username"],
            fatal: true,
        });
        return z.NEVER;
    }
}).superRefine(async ({email}, ctx) => {
    const user = await db.user.findUnique({
        where: {
            email,
        },
        select: {
            id: true,
        },
    });
    if (user) {
        ctx.addIssue({
            code: 'custom',
            message: "This email is alread taken",
            path: ["email"],
            fatal: true,
        });
        return z.NEVER;
    }
}).refine(checkPasswords, {
    message: "Passwords do not match!",
    path: ["confirm_password"],
});

export async function createAccount(prevState: any, formData:FormData) {
    const data = {
        username: formData.get('username'),
        email: formData.get('email'),
        password: formData.get('password'),
        confirm_password: formData.get('confirm_password'),
    };

    const result = await formSchema.safeParseAsync(data);
    if (!result.success) {
        return result.error.flatten();
    } else {
        const hashedPassword = await bcrypt.hash(result.data.password, 12);
        const user = await db.user.create({
            data: {
                username: result.data.username,
                email: result.data.email,
                password: hashedPassword,
            },
            select: {
                id: true,
            },
        });
        
        const session = await getSession();
       
        session.id = user.id;
        await session.save();

        redirect("/profile");
    }
}