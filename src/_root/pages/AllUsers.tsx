import Loader from '@/components/shared/Loader';
import UserCard from '@/components/shared/UserCard';
import { useToast } from '@/components/ui/use-toast';
import { useUserContext } from '@/context/AuthContext';
import { useGetUsers } from '@/lib/react-query/queriesAndMutations';


const AllUsers = () => {
  const { toast } = useToast();

  const { data: creators, isLoading, isError: isErrorCreators } = useGetUsers();
  const { user } = useUserContext();
 
   console.log(user)
  
  if (isErrorCreators) {
    toast({ title: "Something went wrong." });
    
    return;
  }

  return (
    <div className="common-container">
      <div className="user-container">
        <h2 className="h3-bold md:h2-bold text-left w-full">すべてのユーザー</h2>
        {isLoading && !creators ? (
          <Loader />
        ) : (
          <ul className="user-grid">
            {creators?.documents.map((creator) => (
            creator?.$id !== user?.id ? (
              <li key={creator?.$id} className="flex-1 min-w-[200px] w-full ">
                <UserCard user={creator} />
              </li>
            ) : null
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AllUsers