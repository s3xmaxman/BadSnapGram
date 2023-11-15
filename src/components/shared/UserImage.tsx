import { Models } from "appwrite";
import { Link } from "react-router-dom";


type UserImageProps = {
    user: Models.Document;
 };


 const UserImage = ({ user }: UserImageProps) => {
    return (
        <Link to={`/profile/${user.$id}`}>
            <div className="flex flex-col items-center space-y-4">
                <div className="rounded-full overflow-hidden w-14 h-14 border-4 border-[#3121FF] myImage">
                    <img 
                        src={user.imageUrl || "/assets/icons/profile-placeholder.svg" } 
                        alt="creator"
                        className={"w-full h-full object-cover rounded-full"}
                    />
                </div>
            </div>
        </Link> 

    )
 }

 
 export default UserImage
 