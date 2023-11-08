import GridPostList from '@/components/shared/GridPostList'
import Loader from '@/components/shared/Loader'
import { useGetCurrentUser } from '@/lib/react-query/queriesAndMutations'
import { Models } from 'appwrite'


const Saved = () => {
  const {data: currentUser} = useGetCurrentUser()

  // 保存済みの投稿を取得
  const savePosts = currentUser?.save.map((savePost: Models.Document)=>({
    // 保存済み投稿のデータ
    ...savePost.post,
    // 投稿者の画像
    creator: {
      imageUrl: currentUser.imageUrl 
    }
  })).reverse()



  return (
    <div className='saved-container'>
      <div className='flex gap-2 w-full max-w-5xl'>
        <img 
          src="/assets/icons/save.svg" 
          alt="edit"
          width={36}
          height={36}
          className='invert-white' 
        />
      <h2 className='h3-bold md:h2-bold text-left w-full'>保存済みポスト</h2>
      </div>
      {!currentUser ? (
        <Loader />
      ): (
        <ul className="w-full flex justify-center max-w-5xl gap-9">
        {savePosts.length === 0 ? (
          <p className="text-light-4">保存済みのポストはありません</p>
      ):(
        <GridPostList posts={savePosts} showStats={false} />
      )}
      </ul>
    )}
    </div>
  )
}

export default Saved