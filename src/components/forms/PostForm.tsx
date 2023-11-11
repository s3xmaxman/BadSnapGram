import * as z from "zod";
import { Models } from "appwrite";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "../ui/textarea";
import FileUploader from "../shared/FileUploader";
import { PostValidation } from "@/lib/validation";
import { useUserContext } from "@/context/AuthContext";
import { useToast } from "../ui/use-toast";
import { useCreatePost, useUpdatePost } from "@/lib/react-query/queriesAndMutations";
import Loader from "../shared/Loader";


type PostFormProps = {
    post?: Models.Document;
    action: 'Create' | 'Update'
} 


const PostForm = ({ post, action }: PostFormProps) => {

    const { mutateAsync: createPost, isPending: isLoadingCreate } = useCreatePost();
    const { mutateAsync: updatePost, isPending: isLoadingUpdate } = useUpdatePost();
    const { user } = useUserContext();
    const { toast } = useToast();
    const navigate = useNavigate();


    
  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
        caption: post ? post?.caption : "",
        file:[],
        location: post ? post?.location : "",
        tags: post ? post?.tags.join(",") : "",
    },
  })

 
  async function  onSubmit(values: z.infer<typeof PostValidation>) {
    if(post && action === 'Update') {
        const updatedPost = await updatePost({
            ...values,
            postId: post.$id,
            imageUrl: post?.imageUrl,
            imageId: post?.imageId,
        })

        if(!updatedPost) {
            toast({title: '更新に失敗しました'})
        }
        return navigate(`/posts/${post.$id}`);
    }

    const newPost = await createPost({
        ...values,
        userId: user.id, 
    })
    
    if(!newPost) {
        toast({title: '投稿に失敗しました'})
    }
    navigate('/');
  }

  return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-9 w-full max-w-5xl">
                <FormField
                    control={form.control}
                    name="caption"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className="shad-form_label">キャプション</FormLabel>
                        <FormControl>
                        <Textarea className="shad-textarea custom-scrollbar" {...field} />
                        </FormControl>
                        <FormMessage className="shad-form_message"/>
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="file"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className="shad-form_label">写真を追加</FormLabel>
                        <FormControl>
                         <FileUploader
                            filedChange={field.onChange}
                            mediaUrl={post?.imageUrl}
                         />
                        </FormControl>
                        <FormMessage className="shad-form_message"/>
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className="shad-form_label">ロケーションを追加</FormLabel>
                        <FormControl>
                        <Input type="text" className="shad-input" {...field} />
                        </FormControl>
                        <FormMessage className="shad-form_message"/>
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className="shad-form_label">タグを追加</FormLabel>
                        <FormControl>
                        <Input 
                            type="text" 
                            className="shad-input"
                            placeholder="アート, 音楽, 映画"
                            {...field} 
                        />
                        </FormControl>
                        <FormMessage className="shad-form_message"/>
                    </FormItem>
                    )}
                />
                <div className="flex gap-4 items-center justify-end">
                    <Button type="button" className="shad-button_dark_4" >キャンセル</Button>
                    <Button 
                        type="submit" 
                        className="shad-button_primary whitespace-nowrap"
                        disabled={isLoadingCreate || isLoadingUpdate}
                    >
                    {(isLoadingCreate || isLoadingUpdate) && <Loader />}
                    {action==='Create' ? 'ポストを投稿' : 'ポストを更新'}
                    </Button>
                </div>
            </form>
        </Form>
   ) 
}

export default PostForm