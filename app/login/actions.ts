"use server";

export async function handleForm(prevState: any, formData: FormData) {
    await new Promise((resolve) => setTimeout(resolve, 5000));

    return {
      errors: ['Wrong password', 'password is too short'],
    };
  }