import { Models } from "appwrite";
import { Link } from "react-router-dom";


type UserImageProps = {
    user: Models.Document;
 };
 
 const UserImage = ({ user }: UserImageProps) => {
    return (
        <Link to={`/profile/${user.$id}`}>
            <div className="rounded-full overflow-hidden sm:mr-3 lg:mr-10">
            <img 
                src={user.imageUrl || "/assets/icons/profile-placeholder.svg"} 
                alt="creator"
                className="w-14 h-14 rounded-full" 
                style={{ border: '2px solid #877EFF' }}
            />
            </div>
        </Link>
    )
 }
 
   
 export default UserImage;
 