import PostCard from '@/components/shared/PostCard';
import { useGetRecentPosts } from '@/lib/react-query/queriesAndMutations';
import { Models } from 'appwrite';
import { Loader } from 'lucide-react';
import { useGetUsers } from '@/lib/react-query/queriesAndMutations';
import UserImage from '@/components/shared/UserImage';



const Home = () => {
  const { data: posts, isPending: isPostLoading, isError: isErrorPosts } = useGetRecentPosts()
  const { data: creators, isLoading, isError: isErrorCreators } = useGetUsers();

  return (
    <div className='flex flex-1'>
      <div className='home-container'>
        <div className='home-posts'>
          <div className="flex flex-row lg:space-x-12 space-x-6"> 
            {creators?.documents?.slice().sort(() => Math.random() - 0.5).slice(0, 6).map((creator: Models.Document) => (
              <div className="flex flex-col items-center space-y-2" key={creator.id}>
                <div className="rounded-full overflow-hidden w-14 h-14">
                  <UserImage user={creator} /> 
                </div>
                <div className="text-xs sm:text-xs md:text-xs lg:text-xs xl:text-xs overflow-hidden truncate">
                  {creator.username}
                </div>
              </div>
            ))}
          </div>
          {isPostLoading && !posts ? (
            <Loader />
          ) : (
            <ul className='flex flex-col flex-1 gap-9 w-full'>
              {posts?.documents?.map((post: Models.Document, i) => (
                <PostCard post={post} key={i} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home