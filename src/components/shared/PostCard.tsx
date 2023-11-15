import { Models } from "appwrite";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { multiFormatDateString } from "@/lib/utils";
import { useUserContext } from "@/context/AuthContext";
import PostStats from "./PostStats";
import { useCreateBucketUrl } from '@/lib/utils';

type PostCardProps = {
  post: Models.Document;
};

const getContentType = async (url: string) => {
  const response = await fetch(url, { method: 'HEAD' });
  return response.headers.get('Content-Type');
};


const PostCard = ({ post }: PostCardProps) => {
  const { user } = useUserContext();

  const [contentType, setContentType] = useState<string | null>(null);

  useEffect(() => {
    const fetchContentType = async () => {
      const type = await getContentType(useCreateBucketUrl(post?.imageId)); // ポストの画像IDを使用してコンテンツのタイプを取得します
      setContentType(type); // 取得したコンテンツのタイプを状態に設定します
    };
    fetchContentType(); // コンテンツのタイプを取得するための関数を実行します
  }, [post?.imageId]);

  const isImage = contentType && contentType.startsWith('image'); // コンテンツのタイプが'image'で始まるかどうかを判定します
  const isVideo = contentType && contentType.startsWith('video'); // コンテンツのタイプが'video'で始まるかどうかを判定します

  const [isFullscreen, setIsFullscreen] = useState(false); // フルスクリーンモードの状態を管理するための状態を作成します
  const videoClass = isFullscreen ? "" : 'post-card_img'; // フルスクリーンモードの状態に基づいてビデオ要素のクラスを設定します

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement !== null); // フルスクリーンモードの変更を検知し、状態を更新します
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange); // フルスクリーンモードの変更を監視するイベントリスナーを追加します

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange); // コンポーネントがアンマウントされる際にイベントリスナーを削除します
    };
  }, []);
 
  

  if (!post.creator) return;

  return (
    <div className="post-card">
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post.creator.$id}`}>
            <img
              src={
                post.creator?.imageUrl ||
                "/assets/icons/profile-placeholder.svg"
              }
              alt="creator"
              className="w-12 lg:h-12 rounded-full"
            />
          </Link>

          <div className="flex flex-col">
            <p className="base-medium lg:body-bold text-light-1">
              {post.creator.name}
            </p>
            <div className="flex-center gap-2 text-light-3">
              <p className="subtle-semibold lg:small-regular ">
                {multiFormatDateString(post.$createdAt)}
              </p>
              •
              <p className="subtle-semibold lg:small-regular">
                {post.location}
              </p>
            </div>
          </div>
        </div>

        <Link
          to={`/update-post/${post.$id}`}
          className={`${user.id !== post.creator.$id && "hidden"}`}>
          <img
            src={"/assets/icons/edit.svg"}
            alt="edit"
            width={20}
            height={20}
          />
        </Link>
      </div>

      <Link to={`/posts/${post.$id}`}>
        <div className="small-medium lg:base-medium py-5">
          <p>{post.caption}</p>
          <ul className="flex gap-1 mt-2">
            {post.tags.map((tag: string, index: string) => (
              <li key={`${tag}${index}`} className="text-light-3 small-regular">
                #{tag}
              </li>
            ))}
          </ul>
        </div>
          {isImage ? (
            <img
              src={useCreateBucketUrl(post?.imageId)}
              alt="post image"
              className="post-card_img"
            />
          ) : isVideo ? (
                <video controls loop autoPlay muted className={videoClass} >
                  <source src={useCreateBucketUrl(post?.imageId)} type={contentType} />
                </video>
          ) : null}  
      </Link>

      <PostStats post={post} userId={user.id} />
    </div>
  );
};

export default PostCard;