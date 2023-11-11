import { useDeletePost, useGetPostById, useGetUserPosts } from '@/lib/react-query/queriesAndMutations';
import Loader from '@/components/shared/Loader';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { multiFormatDateString } from '@/lib/utils';
import { useUserContext } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import PostStats from '@/components/shared/PostStats';
import GridPostList from '@/components/shared/GridPostList';
import { useCreateBucketUrl } from '@/lib/utils';
import { useEffect, useState, useRef } from 'react';


const getContentType = async (url: string) => {
  const response = await fetch(url, { method: 'HEAD' });
  return response.headers.get('Content-Type');
};

const PostDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useUserContext();

  const { data: post, isLoading } = useGetPostById(id);
  const { data: userPosts, isLoading: isUserPostLoading } = useGetUserPosts(post?.creator.$id);
  const { mutate: deletePost } = useDeletePost();
  
  const relatedPosts = userPosts?.documents.filter(
    (userPost) => userPost.$id !== id
  );

  const handleDeletePost = () => {
    deletePost({ postId: id, imageId: post?.imageId });
    navigate(-1);
  };

  // contentTypeとsetContentTypeをuseStateフックで初期化する
  const [contentType, setContentType] = useState<string | null>(null);

  // useEffectフックを使用して、post?.imageIdの値が変更された場合に、fetchContentType関数を呼び出す
  useEffect(() => {
    // fetchContentType関数を定義する
    const fetchContentType = async () => {
      // useCreateBucketUrl関数を使用して、post?.imageIdを元に画像のURLを生成する
      const url = useCreateBucketUrl(post?.imageId);
      // getContentType関数を使用して、画像のContent-Typeを取得する
      const type = await getContentType(url);
      // 取得したContent-Typeを、useStateフックで初期化したcontentTypeに設定する
      setContentType(type);
    };
    // fetchContentType関数を呼び出す
    fetchContentType();
  }, [post?.imageId]);

  const isImage = contentType && contentType.startsWith('image');
  const isVideo = contentType && contentType.startsWith('video');

  return (
    <div className="post_details-container">
      <div className="hidden md:flex max-w-5xl w-full">
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          className="shad-button_ghost">
          <img
            src={"/assets/icons/back.svg"}
            alt="back"
            width={24}
            height={24}
          />
          <p className="small-medium lg:base-medium">Back</p>
        </Button>
      </div>

      {isLoading || !post ? (
        <Loader />
      ) : (
        <div className="post_details-card">
          {isImage ? (
            <img
              src={post?.imageUrl}
              alt="creator"
              className="post_details-img"
            />
          ) : isVideo ? (
            <video ref={videoRef} autoPlay muted controls loop className="post_details-img">
              <source src={useCreateBucketUrl(post?.imageId)} type={contentType}/>
            </video>
          ) : null}
          <div className="post_details-info">
            <div className="flex-between w-full">
              <Link
                to={`/profile/${post?.creator.$id}`}
                className="flex items-center gap-3">
                <img
                  src={
                    post?.creator.imageUrl ||
                    "/assets/icons/profile-placeholder.svg"
                  }
                  alt="creator"
                  className="w-8 h-8 lg:w-12 lg:h-12 rounded-full"
                />
                <div className="flex gap-1 flex-col">
                  <p className="base-medium lg:body-bold text-light-1">
                    {post?.creator.name}
                  </p>
                  <div className="flex-center gap-2 text-light-3">
                    <p className="subtle-semibold lg:small-regular ">
                      {multiFormatDateString(post?.$createdAt)}
                    </p>
                    •
                    <p className="subtle-semibold lg:small-regular">
                      {post?.location}
                    </p>
                  </div>
                </div>
              </Link>

              <div className="flex-center gap-4">
                <Link
                  to={`/update-post/${post?.$id}`}
                  className={`${user.id !== post?.creator.$id && "hidden"}`}>
                  <img
                    src={"/assets/icons/edit.svg"}
                    alt="edit"
                    width={24}
                    height={24}
                  />
                </Link>

                <Button
                  onClick={handleDeletePost}
                  variant="ghost"
                  className={`ost_details-delete_btn ${
                    user.id !== post?.creator.$id && "hidden"
                  }`}>
                  <img
                    src={"/assets/icons/delete.svg"}
                    alt="delete"
                    width={24}
                    height={24}
                  />
                </Button>
              </div>
            </div>

            <hr className="border w-full border-dark-4/80" />

            <div className="flex flex-col flex-1 w-full small-medium lg:base-regular">
              <p>{post?.caption}</p>
              <ul className="flex gap-1 mt-2">
                {post?.tags.map((tag: string, index: string) => (
                  <li
                    key={`${tag}${index}`}
                    className="text-light-3 small-regular">
                    #{tag}
                  </li>
                ))}
              </ul>
            </div>

            <div className="w-full">
              <PostStats post={post} userId={user.id} />
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-5xl">
        <hr className="border w-full border-dark-4/80" />

        <h3 className="body-bold md:h3-bold w-full my-10">
          ユーザーの他の投稿
        </h3>
        {isUserPostLoading || !relatedPosts ? (
          <Loader />
        ) : (
          <GridPostList posts={relatedPosts} />
        )}
      </div>
    </div>
  );
};

export default PostDetails;
