"use server";

import bcrypt from 'bcrypt';
import { PASSWORD_MIN_LENGTH, PASSWORD_REGEX } from '@/lib/constatns';
import db from '@/lib/db';
import {z} from 'zod';
import getSession from '@/lib/session';
import { redirect } from 'next/navigation';

const checkEmailExists = async (email: string) => {
  const user = await db.user.findUnique({
    where : {
        email,
    },
    select : {
        id: true,
    },
  });

  return Boolean(user);
}

const formSchema = z.object({
  email: z.string().email().toLowerCase()
    .refine(checkEmailExists, "Email does not exist!"),
  password: z.string().min(PASSWORD_MIN_LENGTH).regex(PASSWORD_REGEX, "Password is too weak!"),
});

export async function login(prevState: any, formData: FormData) {
  const data = {
    email: formData.get('email'),
    password: formData.get('password'),
  };

  const result = await formSchema.safeParseAsync(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    // if the user is found, check password hash
    const user = await db.user.findUnique({
      where: {
        email: result.data.email
      },
      select: {
        id: true,
        password: true
      }
    });

    const ok = await bcrypt.compare(result.data.password, user!.password ?? "xxx");
    
    if (ok) {
      const session = await getSession();
      session.id = user!.id;

      redirect("/profile");
    } else {
      return {
        fieldErrors: {
          password: ["Invalid password!"],
          email: [],
        }        
      };
    }

    // redirect "/profile"
  }
}