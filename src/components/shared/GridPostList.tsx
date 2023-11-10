import { useUserContext } from '@/context/AuthContext'
import { Models } from 'appwrite'
import React, { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import PostStats from './PostStats'
import { useCreateBucketUrl } from '@/lib/utils'
import { useGetPostById } from '@/lib/react-query/queriesAndMutations'

type GridPostListProps = {
    posts: Models.Document[];
    showUser?: boolean;
    showStats?: boolean;
}

const getContentType = async (url: string) => {
    const response = await fetch(url, { method: 'HEAD' });
    return response.headers.get('Content-Type');
};

const GridPostList = ({posts, showUser=true, showStats=true }: GridPostListProps) => {
    const { user } = useUserContext()
     
    const [contentTypes, setContentTypes] = useState<Map<string, string | null>>(new Map());
  
    useEffect(() => {
      const fetchContentType = async (imageId: string) => {
        if (!contentTypes.has(imageId)) {
          const type = await getContentType(useCreateBucketUrl(imageId));
          setContentTypes((prevContentTypes) => new Map(prevContentTypes.set(imageId, type)));
        }
      };
      posts.forEach((post) => {
        if (post.imageId) {
          fetchContentType(post.imageId);
        }
      });
    }, [posts]);
  
    // useEffect(() => {
    //   const videos = document.querySelectorAll('video');
    //   videos.forEach((video) => {
    //     const handleMouseEnter = () => {
    //       video.play();
    //     };
    //     const handleMouseLeave = () => {
    //       video.pause();
    //       video.currentTime = 0;
    //     };
    //     video.addEventListener('mouseenter', handleMouseEnter);
    //     video.addEventListener('mouseleave', handleMouseLeave);
  
    //     return () => {
    //       video.removeEventListener('mouseenter', handleMouseEnter);
    //       video.removeEventListener('mouseleave', handleMouseLeave);
    //     };
    //   });
    // }, []);
  
    return (
      <ul className='grid-container'>
        {posts.map((post) => {
          const contentType = contentTypes.get(post.imageId);
          const isImage = contentType && contentType.startsWith('image');
          const isVideo = contentType && contentType.startsWith('video');
          return (
            <li key={post.$id} className='relative min-w-80 h-80'>
              <Link to={`/posts/${post.$id}`} className='grid-post_link'>
                {contentType ? (
                  isImage ? (
                    <img
                      src={post?.imageUrl}
                      alt="post"
                      className='h-full w-full object-cover'
                    />
                  ) : (
                    <video autoPlay muted loop className='h-full w-full object-cover'>
                      <source src={useCreateBucketUrl(post?.imageId)} type={contentType} />
                    </video>
                  )
                ) : null}
              </Link>
              <div className='grid-post_user'>
                {showUser && (
                  <div className='flex items-center justify-start gap-2 flex-1'>
                    <img 
                      src={post.creator.imageUrl}
                      alt="creator"
                      className='h-8 w-8 rounded-full' 
                    />
                    <p className='line-clamp-1'>{post.creator.name}</p>
                  </div>
                )}
                {showStats && <PostStats post={post} userId={user.id}/>}
              </div>
            </li>
          );
        })}
      </ul>
    )
  }
  
  export default GridPostList