import * as z from "zod"


export const SignupValidation = z.object({
    name: z.string().min(2, { message: "ネームは2文字以上必要です" }),
    username: z.string().min(2, { message: "ユーザー名は2文字以上必要です" }),
    email: z.string().email( { message: "有効なメールアドレスを入力してください" }),
    password: z.string().min(8, { message: "パスワードは8文字以上必要です" })

})


export const SigninValidation = z.object({
    email: z.string().email( { message: "有効なメールアドレスを入力してください" }),
    password: z.string().min(8, { message: "パスワードは8文字以上必要です" })

})


export const PostValidation = z.object({

    caption: z.string().min(5, { message: "5文字以上入力してください。" }).max(2200, { message: "2200文字以内にしてください" }),
    file: z.custom<File[]>(),
    location: z.string().min(1, { message: "場所を入力してください" }).max(1000, { message: "1000文字以内にしてください" }),
    tags: z.string(),
   
})

export const ProfileValidation = z.object({
    file: z.custom<File[]>(),
    name: z.string().min(2, { message: "ネームは2文字以上必要です" }),
    username: z.string().min(2, { message: "ユーザー名は2文字以上必要です"}),
    email: z.string().email(),
    bio: z.string(),
  });

