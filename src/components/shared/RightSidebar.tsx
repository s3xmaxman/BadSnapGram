import React, { useState, useEffect } from 'react'
import { useUserContext } from '@/context/AuthContext';
import GridPostList from '@/components/shared/GridPostList'
import { useGetCurrentUser, useGetPosts} from '@/lib/react-query/queriesAndMutations';
import { Post } from '@/types';
import PostRight from './PostRight';



const RightSidebar = () => {
  const { data: currentUser} = useGetCurrentUser()
  const { data: posts } = useGetPosts()
  const [ displayPosts, setDisplayPosts ] = useState<Post[]>([]);
  
  useEffect(() => {
    if (posts) {
      // 全ての投稿を取得
      const allPosts = posts.pages.flatMap(page => [...page.documents]);
  
      // 投稿をランダムに並び替え
      const randomPosts = allPosts.sort(() => Math.random() - 0.5);
  
      // ランダムに選ばれた2つの投稿を取得
      const randomTwoPosts = randomPosts.slice(0, 2);
  
      // 表示する投稿を設定
      setDisplayPosts(randomTwoPosts);
    }
  }, [posts]);
 
   

 
  return (
    <nav className="hidden md:flex px-6 py-10 flex-col items-center justify-start min-w-[350px] bg-dark-1">
      <img 
        src={currentUser?.imageUrl} 
        alt="" 
        className="h-20 w-20 rounded-full flex-center mb-4"
      />
      <h1 className='h3-bold md:h2-bold w-full mb-2 flex-center'>{currentUser?.name}</h1>
      <p className='text-light-3 flex-center'>@{currentUser?.username}</p>
      <div className="flex flex-col justify-center w-full py-4">
        <p className='text-light-1'>おすすめ</p>
          {displayPosts.map((item, index) => (
            <div className='py-2'>
            <PostRight key={`page-${index}`} posts={[item]} showStats={false} showUser ={false}/> 
            </div>
          ))}
      </div>
    </nav>
  ) 
}

export default RightSidebar
