import { INewPost, INewUser, IUpdatePost, IUpdateUser } from "@/types";

import { ID, Query } from "appwrite";
import { appwriteConfig, account, databases, storage, avatars } from "./config";

export async function createUserAccount(user: INewUser) {
    try {
        // 新しいアカウントを作成する
        const newAccount = await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.name
        )

        // もし新しいアカウントが存在しない場合は、エラーをスローする
        if (!newAccount) throw Error

        // アバターのURLを取得する
        const avatarUrl = avatars.getInitials(user.name)

        // ユーザーをデータベースに保存する
        const newUser = await saveUserToDB({
            accountId: newAccount.$id,
            name: newAccount.name,
            email: newAccount.email,
            username: user.username,
            imageUrl: avatarUrl
        })

        // 新しいユーザーオブジェクトを返す
        return newUser;
    } catch (error) {
        // エラーが発生した場合は、エラーメッセージをコンソールに出力し、エラーオブジェクトを返す
        console.log(error);
        return error
    }
}

export async function saveUserToDB (user: {
    accountId: string;
    email: string;
    name: string;
    imageUrl: URL;
    username?: string;
}) {
    try {
        // ユーザーをデータベースに保存する
        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            user
        )
        return newUser
    } catch (error) {
        console.log(error);
        return error
    }
    
}

export async function signInAccount(user: {
    email: string;
    password: string;
}) {
    try {
        // account.createEmailSessionメソッドを使用して、
        // ユーザーアカウントのログインセッションを作成する
        const session = await account.createEmailSession(
            user.email,
            user.password
        )
        return session
    } catch (error) {
        console.log(error);
        return error
    }
}

export async function getCurrentUser() {
    try {
        // 現在のアカウントを取得する
        const currentAccount = await account.get();
        // アカウントが存在しない場合はエラーを投げる
        if (!currentAccount) throw Error;
        // 現在のユーザーを取得するために、appwriteConfigで指定されたデータベースとユーザーコレクションに対してクエリを実行する
        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal("accountId", currentAccount.$id)]
        );
        // ユーザーが存在しない場合はエラーを投げる
        if (!currentUser) throw Error;
        // 最初のドキュメントを返す
        return currentUser.documents[0];
    } catch (error) {
        // エラーが発生した場合は、エラーメッセージをコンソールに出力する
        console.log(error);
    }
}

export async function signOutAccount() {
    try {
        const session = await account.deleteSession("current"); // "current" セッションを削除
        return session; // 削除されたセッションを返す
    } catch (error) {
        console.log(error); // エラーが発生した場合はログにエラーメッセージを出力
    }
}



export async function uploadFile(file: File) {
    try {
        const uploadedFile = await storage.createFile(
            appwriteConfig.storageId,
            ID.unique(),
            file
        )
        return uploadedFile // アップロードされたファイルを返す
    } catch (error) {
        console.log(error); // エラーが発生した場合は、エラーメッセージをコンソールに出力
    }
}

export function getFilePreview(fileId: string) {
    try {
      const fileUrl = storage.getFilePreview(
        appwriteConfig.storageId,  
        fileId,
        2000, // プレビューの幅(2000px)
        2000, // プレビューの高さ(2000px) 
        "top", // トリミングの基準位置(上部)
        100 // プレビューの画質(100)
      )
      return fileUrl; // プレビューURLを返す
    } catch (error) {
      console.log(error);
    }
}


 
export async function deleteFile(fileId: string) {
    try {
      await storage.deleteFile(appwriteConfig.storageId, fileId);

      return {status: "success"};
    } catch (error) {
      console.log(error);
    }
}


export async function getRecentPosts() {
    const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        [Query.orderDesc("$createdAt"), Query.limit(20)],
    )

    if(!posts) throw Error

    return posts;
}

export async function createPost(post: INewPost) {
    try {
  
      // ファイルをアップロードする
      const uploadedFile = await uploadFile(post.file[0]);
  
      // ファイルがアップロードされなかった場合はエラー
      if (!uploadedFile) throw Error;
  
  
      // アップロードされたファイルのプレビューURLを取得する  
      const fileUrl = getFilePreview(uploadedFile.$id);
      // プレビューURLが取得できなかった場合、ファイルを削除してエラー
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }
  
  
      // タグをスペースで分割して配列にする
      const tags = post.tags?.replace(/ /g, "").split(",") || [];
  
  
      // 新しい投稿ドキュメントをデータベースに作成する
      const newPost = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        ID.unique(),
        {
          creator: post.userId,
          caption: post.caption,
          imageUrl: fileUrl,
          imageId: uploadedFile.$id,
          location: post.location,
          tags: tags,
        }
      );
  
      // ドキュメントの作成に失敗した場合、ファイルを削除してエラー
      if (!newPost) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }
  
      // 作成した投稿ドキュメントを返す
      return newPost;
      
    } catch (error) {
      console.log(error);
    }
}

export async function likePost(postId: string, likesArray: string[]) {
    // 投稿のいいねを更新する
    try {
      const updatePost = await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        postId,
        {
          likes: likesArray
        }
      )
  
      // 更新に失敗した場合はエラーをスローする
      if(!updatePost) throw Error
  
      // 更新に成功した場合は更新された投稿を返す
      return updatePost
    } catch (error) {
      // エラーが発生した場合はログに記録する
      console.log(error);        
    }
}


export async function savePost(userId: string, postId: string) {

    // Appwriteのデータベースにドキュメントを作成して保存する
    try {
      const updatedPost = await databases.createDocument(
        appwriteConfig.databaseId, 
        appwriteConfig.savesCollectionId,
        ID.unique(), 
        {
          // ユーザーIDを設定
          user: userId,
          // 投稿IDを設定  
          post: postId,  
        }
      );
      
      // ドキュメントの作成に失敗した場合はエラーをスロー
      if (!updatedPost) throw Error;
    
      // 作成したドキュメントを返却
      return updatedPost;
  
    } catch (error) {
      // エラーが発生した場合はコンソールに出力
      console.log(error);
    }
}


export async function deleteSavedPost(savedRecordId: string){

    // Appwriteのデータベースからドキュメントを削除する
    try {
  
      // ドキュメントの削除を実行
      const statusCode = await databases.deleteDocument(
        appwriteConfig.databaseId,
        appwriteConfig.savesCollectionId, 
        savedRecordId // 削除対象のドキュメントID
      );
      
      // 削除に失敗した場合はエラーを投げる
      if (!statusCode) throw Error;
  
      // 正常終了した場合はステータスを返却
      return { status: "Ok" };
  
    } catch (error) {
     
      // エラーが発生した場合はコンソールに出力 
      console.log(error);
    
    }
}

export async function getPostById(postId?: string) {
  if (!postId) throw Error;

  try {
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    )
    return post
  } catch (error) {
    console.log(error);
  }
}


export async function updatePost(post: IUpdatePost) {

  // ファイル更新があるかチェック
  const hasFileToUpdate = post.file.length > 0;

  try {

    // 現在の画像情報を取得
    let image = {
      imageUrl:post.imageUrl,
      imageId:post.imageId,
    }

    // ファイル更新がある場合
    if(hasFileToUpdate){

      // 新しいファイルをアップロード
      const uploadedFile = await uploadFile(post.file[0])

      // アップロード失敗したら例外投げる
      if(!uploadedFile) throw Error;

      // ファイルのプレビューURLを取得
      const fileUrl = getFilePreview(uploadedFile.$id)

      // プレビューURLがない場合、ファイル削除して例外投げる
      if(!fileUrl) {
        deleteFile(uploadedFile.$id);
        throw Error 
      }

      // 画像情報を更新
      image = {
        ...image, 
        imageUrl: fileUrl,
        imageId:uploadedFile.$id
      }

    }

    // タグを配列に変換
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    // ポストを更新
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId, 
      appwriteConfig.postCollectionId, 
      post.postId, 
      {
        caption: post.caption,
        imageUrl: image.imageUrl, 
        imageId: image.imageId,
        location: post.location,
        tags: tags,  
      }
    )

    // 更新失敗したらファイル削除して例外投げる
    if(!updatedPost) {
      await deleteFile(post.imageId);
      throw Error
    }

    // 更新したポストを返す
    return updatedPost;

  } catch (error) {
    console.log(error);
  }

}

export async function deletePost(postId?: string, imageId?: string) {
  if(!postId || !imageId) throw Error;

  try {
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    )
    
    return {status: "ok"}
  } catch (error) {
    console.log(error);
  }
}


export async function getInfinitePosts({ pageParam }: { pageParam: number }) {
  const queries: any[] = [Query.orderDesc("$updatedAt"), Query.limit(9)];

  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString()));
  }

  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      queries
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}

export async function searchPosts(searchTerm: string) {

  try {

    // キャプションに検索ワードを含む投稿を検索するクエリを作成
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.search("caption", searchTerm)]  
    );
    
    // 投稿がない場合はエラーを投げる
    if (!posts) throw Error;
    
    // 検索結果の投稿を返す
    return posts;

  } catch (error) {

    // エラーが発生した場合はログに出力
    console.log(error);

  }

}


export async function getUsers() {
  try {
    // ユーザーコレクションから、作成日時の降順で10件のユーザーを取得するクエリ
    const users = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [
        Query.orderDesc("$createdAt"), // 作成日時の降順
        Query.limit(10) // 10件に制限
      ]
    );
    // ユーザーが取得できなければエラー
    if(!users) throw Error;
    // 取得したユーザーを返す  
    return users;

  } catch (error) {
    console.log(error); 
  }
}

export async function getUserPosts(userId: string) {
  if (!userId) return;  // ユーザーIDが存在しない場合は処理を終了する 

  try {
     // データベースから投稿を取得する 
    const post = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
       // "creator" フィールドが指定されたユーザーIDと等しい条件
       // "$createdAt" フィールドで降順にソートする条件  
      [Query.equal("creator", userId), Query.orderDesc("$createdAt")]
    );
    
    // 投稿が存在しない場合はエラーをスローする 
    if (!post) throw Error;

    return post;
  } catch (error) {
    console.log(error);
  }
}

export async function getUserById(userId: string) {
  try {
    const user = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId
    )
    if(!user) throw Error;
    return user;
  } catch (error) {
    console.log(error);
  }
}


export async function updateUser(user: IUpdateUser) {

  // 画像がアップロードされているか
  const hasFileToUpdate = user.file.length > 0;

  try {
    let image = {
      imageUrl: user.imageUrl,  // 現在の画像URL
      imageId: user.imageId, // 現在の画像ID
    };

    // 画像がアップロードされていたら
    if (hasFileToUpdate) {
      // アップロードしてファイル情報を取得
      const uploadedFile = await uploadFile(user.file[0]);
      if (!uploadedFile) throw Error;

      // 画像のプレビューURLを取得
      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        // 失敗していたらアップロードしたファイルを削除
        await deleteFile(uploadedFile.$id);  
        throw Error;
      }

      // 画像を更新
      image = { 
        ...image, 
        imageUrl: fileUrl, 
        imageId: uploadedFile.$id 
      };

    }
    
    // ユーザー情報をアップデート
    const updatedUser = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      user.userId,
      {
        name: user.name,
        bio: user.bio,
        imageUrl: image.imageUrl,  
        imageId: image.imageId,
      }
    );

    // アップデート失敗時の処理
    if (!updatedUser) {

      if (hasFileToUpdate) {
        await deleteFile(image.imageId);
      }

      throw Error;
    }

    // 古い画像を削除
    if (user.imageId && hasFileToUpdate) {
      await deleteFile(user.imageId);
    }

    return updatedUser;

  } catch (error) {
    console.log(error);
  }

}