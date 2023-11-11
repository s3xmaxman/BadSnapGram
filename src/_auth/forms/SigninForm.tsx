import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loader from "@/components/shared/Loader";
import { useToast } from "@/components/ui/use-toast";

import { SigninValidation } from "@/lib/validation";
import { useSignInAccount } from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";
import { account } from '@/lib/appwrite/config'

const SigninForm = () => {
  const { toast } = useToast();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
  const navigate = useNavigate();


  const { mutateAsync: signInAccount } = useSignInAccount();

  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });


  async function onSubmit(values: z.infer<typeof SigninValidation>) {
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
            <h2 className='h3-bold md:h2-bold pt-5 sm:pt-12'>アカウントにログイン</h2>
            <p className='text-light-3 small-medium mb:base-regular mt-2'>
              アカウントをお持ちの方は、こちらからログインしてください
            </p>
              <form 
                onSubmit={form.handleSubmit(onSubmit)} 
                className="flex flex-col gap-5 w-full mt-4"
                >
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
                  { isUserLoading ? (
                    <div className='flex-center gap-2'>
                      <Loader />  ロード中
                    </div>
                  ): "アカウントにログイン" }
                </Button>
                <img 
                  // onClick={loginViaGoogle}
                  src="/assets/images/Social button.svg" 
                  alt="google"
                  className='cursor-pointer'  
                />
                <p className="text-small-regular text-light-2 text-center mt-2">
                  アカウントをお持ちでない方はこちらから
                  <Link
                    to="/sign-up"
                    className="text-primary-500 text-small-semibold ml-1">
                    新規登録
                  </Link>
                </p>
              </form>
        </div>
    </Form>
   
  )
}

export default SigninForm