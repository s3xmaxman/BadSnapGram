import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
import { createPost, createUserAccount, deletePost, deleteSavedPost, getCurrentUser, getInfinitePosts, getPostById, getRecentPosts, getUserById, getUserPosts, getUsers, likePost, savePost, searchPosts, signInAccount, signOutAccount, updatePost, updateUser } from '../appwrite/api'
import { INewPost, INewUser, IUpdatePost, IUpdateUser } from '@/types'
import { QUERY_KEYS } from './queryKeys'

export const useCreateAccount = () => {
    // useMutationを返す
    return useMutation({
        // mutationFnメソッドの処理は、引数として渡されたユーザー情報を使ってcreateUserAccountメソッドを呼び出す
        mutationFn: (user: INewUser) => createUserAccount(user),
    })
}


export const useSignInAccount = () => {
    return useMutation({
        mutationFn: (user: { email: string; password: string}) => signInAccount(user),
    })  
}

export const useSignOutAccount = () => {
    return useMutation({
        mutationFn: signOutAccount
    })
}


export const useCreatePost = () => {
    // クエリクライアントを取得する
    const queryClient = useQueryClient();
  
    // ミューテーションの処理を定義する
    return useMutation({
      // ミューテーション関数
      mutationFn: (post: INewPost) => createPost(post),
      // 成功時の処理
      onSuccess: () => {
        // 最新の投稿を取得するためのクエリを無効にする
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        });
      },
    });
}

export const useGetRecentPosts = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        queryFn: getRecentPosts,
    })
}


export const useLikePost = () => {

    // QueryClientをインポート
    const queryClient = useQueryClient();
  
    // useMutationフックを返す
    return useMutation({
  
      // likePost関数をミューテーションとして定義
      mutationFn: ({
        postId, 
        likesArray 
      }: {
        postId: string;
        likesArray: string[];
      }) => likePost(postId, likesArray),
  
      // ミューテーション成功時の処理
      onSuccess: (data) => {
      
        // GET_POST_BY_IDクエリを無効化
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id], 
        });
  
        // GET_RECENT_POSTSクエリを無効化
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        });
  
        // GET_POSTSクエリを無効化
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_POSTS],
        });
  
        // GET_CURRENT_USERクエリを無効化
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        });
      },
    });  
}; 


export const useSavePost = () => {

    // QueryClientをインポート
    const queryClient = useQueryClient();
  
    // useMutationフックを返す
    return useMutation({
  
      // savePost関数をミューテーションとして定義
      mutationFn: ({ userId, postId }: { userId: string; postId: string }) =>
        savePost(userId, postId),
  
      // ミューテーション成功時の処理
      onSuccess: () => {
  
        // GET_RECENT_POSTSクエリを無効化
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        });
  
        // GET_POSTSクエリを無効化
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_POSTS],
        });
  
        // GET_CURRENT_USERクエリを無効化
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        });
      },
    });
};

export const useDeleteSavedPost = () => {
  const queryClient = useQueryClient();

  // 保存された投稿を削除するためのmutationを実行する
  return useMutation({
    mutationFn: (savedRecordId: string) => deleteSavedPost(savedRecordId),

    // 成功時に実行される処理
    onSuccess: () => {
      // 最新の投稿を取得するクエリを無効化する
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });

      // 全ての投稿を取得するクエリを無効化する
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });

      // 現在のユーザーを取得するクエリを無効化する
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
};

export const useGetCurrentUser = () => {
   return useQuery({
     queryKey: [QUERY_KEYS.GET_CURRENT_USER],
     queryFn: getCurrentUser,
   })
}

export const useGetPostById = (postId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
    queryFn: () => getPostById(postId),
    enabled: !!postId,
  })
}

export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (post: IUpdatePost) => updatePost(post),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id] });
    }
  })
}

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({postId, imageId}: {postId?: string, imageId?: string}) => deletePost(postId, imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_RECENT_POSTS] });
    }
  })
}



export const useGetPosts = () => {
  const initialPageParamValue = 1
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
    queryFn: getInfinitePosts as any,
    // 投稿取得関数を指定 
    getNextPageParam: (lastPage: any) => {
      // 投稿がない場合はnullを返す  
      if (lastPage && lastPage.documents.length === 0) {
        return null;
      }
      // 最後の投稿のIDを次のページのパラメータとして返す
      const lastId = (lastPage.documents[lastPage.documents.length - 1].$id);
      return lastId;
    },
    initialPageParam: initialPageParamValue,
  });
}



export const useSearchPosts = (searchTerm: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm],
    queryFn: () => searchPosts(searchTerm),
    enabled: !!searchTerm ,
  })
}

export const useGetUsers = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USERS],
    queryFn: getUsers
  })
}

export const useGetUserPosts = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_POSTS, userId],
    queryFn: () => getUserPosts(userId),
    enabled: !!userId
  })
}

export const useGetUserById = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId
  })
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (user: IUpdateUser) => updateUser(user),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID, data?.$id],
      });
    },
  });
};