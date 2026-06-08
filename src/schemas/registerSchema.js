import { z } from "zod";

export const registerSchema = z.object({
  fullName: z.string().min(3, "الاسم قصير جداً"),

  email: z
    .string()
    .email("بريد إلكتروني غير صحيح"),

  phone: z
    .string()
    .length(11, "رقم الهاتف يجب أن يكون 11 رقم"),

  nationalId: z
    .string()
    .length(14, "الرقم القومي يجب أن يكون 14 رقم"),

  profession: z.string().min(2),

  governorate: z.string().min(2),

  password: z
    .string()
    .min(8, "كلمة المرور 8 أحرف على الأقل"),
});