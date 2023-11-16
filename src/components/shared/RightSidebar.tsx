import { useState, useEffect } from 'react'
import { useGetCurrentUser, useGetPosts} from '@/lib/react-query/queriesAndMutations';
import { Post } from '@/types';
import PostRight from './PostRight';



const RightSidebar = () => {
  const { data: posts } = useGetPosts()
  const [ displayPosts, setDisplayPosts ] = useState<Post[]>([]);
  
  useEffect(() => {
    if (posts) {
      // 全ての投稿を取得
      const allPosts = posts.pages.flatMap(page => [...page.documents]);
  
      // 投稿をランダムに並び替え
      const randomPosts = allPosts.sort(() => Math.random() - 0.5);
  
      // ランダムに選ばれた2つの投稿を取得
      const randomTwoPosts = randomPosts.slice(0, 3);
  
      // 表示する投稿を設定
      setDisplayPosts(randomTwoPosts);
    }
  }, [posts]);
 
  return (
    <nav className="rightsidebar">
      <div className="flex flex-col justify-center w-full">
        <h2 className='text-light-1 h2-bold'>話題のポスト</h2>
          {displayPosts.map((item, index) => (
            <div className='py-6'>
              <PostRight key={`page-${index}`} posts={[item]} showStats={true} showUser ={false}/> 
            </div>
          ))}
      </div>
    </nav>
  ) 
}

export default RightSidebar
