import PostCard from '@/components/shared/PostCard';
import { useGetRecentPosts } from '@/lib/react-query/queriesAndMutations';
import { Models } from 'appwrite';
import { Loader } from 'lucide-react';
import { useGetUsers } from '@/lib/react-query/queriesAndMutations';
import UserImage from '@/components/shared/UserImage';


type UserCardProps = {
  user: Models.Document;
};

const Home = ({ user }: UserCardProps) => {
  const { data: posts, isPending: isPostLoading, isError: isErrorPosts } = useGetRecentPosts()
  const { data: creators, isLoading, isError: isErrorCreators } = useGetUsers();
  

  return (
    <div className='flex flex-1'>
      <div className='home-container'>
        <div className='home-posts'>
        <div className="flex"> 
        {creators?.documents?.map((creator: Models.Document, index: number) => {
            if (index >= 5) {
              return null;
            }
            return (
              <div className="rounded-full overflow-hidden mr-3" key={creator.id}>
                <UserImage user={creator} /> 
              </div>
            );
          })}
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