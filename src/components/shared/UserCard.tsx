import { Models } from "appwrite";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";




type UserCardProps = {
    user: Models.Document;
    className?: string;
};

const UserCard = ({ user }: UserCardProps) => {
    return (
        <Link to={`/profile/${user.$id}`} className="user-card">
            <img 
                src={user.imageUrl || "/assets/icons/profile-placeholder.svg"} 
                alt="creator"
                className="w-14 h-14 rounded-full" 
            />
            <div className="flex-center flex-col gap-1">
                <p className="base-medium text-light-1 text-center line-clamp-1">
                    {user.name}
                </p>
                <p className="small=medium text-light-3 text-center line-clamp-1">
                   @{user.username}
                </p>
            </div>
            <Button type="button" size="sm" className="shad-button_primary px-5">
                フォロー
            </Button>
        </Link>
    )
}

export default UserCard;