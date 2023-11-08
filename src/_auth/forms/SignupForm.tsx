import * as z from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button'
import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod';
import { SignupValidation } from '@/lib/validation';
import { useForm } from 'react-hook-form';
import Loader from '@/components/shared/Loader'
import { createUserAccount } from '@/lib/appwrite/api'
import { useToast } from '@/components/ui/use-toast'
import { useCreateAccount,  useSignInAccount } from '@/lib/react-query/queriesAndMutations'
import { useUserContext } from '@/context/AuthContext'

const SignupForm = () => {
  const { toast } = useToast();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
  const navigate = useNavigate();

  const { mutateAsync: createUserAccount, isPending: isCreatingAccount } = useCreateAccount();
  const { mutateAsync: signInAccount, isPending: isSigningIn } = useSignInAccount();

  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof SignupValidation>) {
    const newUser = await createUserAccount(values); // ユーザーアカウントを作成
    if(!newUser) { 
      toast({title: 'アカウントの作成に失敗しました'}) // アカウント作成失敗時の処理
    }
    const session = await signInAccount({ email: values.email, password: values.password, }); // 認証情報でサインイン
    if(!session) {
      toast({title: 'ログインに失敗しました'}) // ログイン失敗時の処理
    }
    const isLoggedIn = await checkAuthUser(); // ログイン状態を確認
    if(isLoggedIn) {
      form.reset(); 
      navigate('/'); // ログイン成功時の処理  
    } else {
      toast({title: 'ログインに失敗しました'}) // ログイン失敗時の処理
    }
  }

return (
      <Form {...form}>
          <div className='sm:w-420 flex-center flex-col'>
            <img src="/assets/images/logo.svg" alt="logo" />
            <h2 className='h3-bold md:h2-bold pt-5 sm:pt-12'>新しいアカウントを作成</h2>
            <p className='text-light-3 small-medium mb:base-regular mt-2'>
              利用するには登録が必要です
            </p>
              <form 
                onSubmit={form.handleSubmit(onSubmit)} 
                className="flex flex-col gap-5 w-full mt-4"
                >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>name</FormLabel>
                      <FormControl>
                        <Input type='text' className='shad-input' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>username</FormLabel>
                      <FormControl>
                        <Input type='text' className='shad-input' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>email</FormLabel>
                      <FormControl>
                        <Input type='text' className='shad-input' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>password</FormLabel>
                      <FormControl>
                        <Input type='password' className='shad-input' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit"
                  className="shad-button_primary"
                  >
                  { isCreatingAccount ? (
                    <div className='flex-center gap-2'>
                      <Loader />  ロード中
                    </div>
                  ): "アカウントを作成" }
                </Button>
                <p className="text-small-regular text-light-2 text-center mt-2">
                  既にアカウントをお持ちですか？
                  <Link
                    to="/sign-in"
                    className="text-primary-500 text-small-semibold ml-1">
                    ログイン
                  </Link>
                </p>
              </form>
        </div>
    </Form>
   
  )
}

export default SignupForm