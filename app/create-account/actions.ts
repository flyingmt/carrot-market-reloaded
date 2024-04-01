"use server";
import {z} from 'zod';

const passwordRegex = new RegExp(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*?[#?!@$%^&*-]).+$/
);

function checkUsername(username:string) {
    return !username.includes("potato");
}

function checkPasswords({password, confirm_password}: {password: string, confirm_password: string}) {
    return password === confirm_password;
}

const formSchema = z.object({
    username: z.string(
        {
            invalid_type_error: "Username must be a string!",
            required_error: "Username is required!",
        }
    ).min(3, "Way too short!!!").max(10, "That's too long!")
    .toLowerCase()
    .trim()
    .refine(checkUsername, "Username cannot contain the word 'potato'!"),
    email: z.string().email().toLowerCase(),
    password: z.string().min(4).regex(passwordRegex, "Password is too weak!"),
    confirm_password: z.string().min(4),
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

    const result = formSchema.safeParse(data);
    if (!result.success) {
        return result.error.flatten();
    } else {
        console.log(result.data);
    }
}