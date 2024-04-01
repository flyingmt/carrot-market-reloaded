"use server";

export async function smsVerification(prevState: any, formData: FormData) {
  const data = {
    phone: formData.get('phone'),
    verification: formData.get('verification'),
  };

  console.log(data);
}