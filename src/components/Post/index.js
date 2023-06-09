import { uuidv4 } from '@firebase/util';
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import Image from 'next/image';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import {  BsEmojiSmile, BsThreeDots } from 'react-icons/bs';
import { FaRegComment } from 'react-icons/fa';
import { auth, db } from '../../lib/firebase';
import { GlobalContext } from '../../state/context/GlobalContext';


const Post = ({ id, username, image, caption, likesCount}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [visibleComments, setVisibleComments] = useState(3);
  const { user } = useContext(GlobalContext);
  const [menuVisible, setMenuVisible] = useState(false);


  const handleMenuToggle = () => {
    setMenuVisible(!menuVisible);
  };

  const handleEditPost = () => {
    console.log('Edit Post:', id);
    // Implement post editing functionality here
  };

  const handleRemovePost = async () => {
    if (username !== user.username) {
      alert('You can only delete your own post');
      console.log(username,user.username)
    }
    else{
    if(confirm('Are you sure you want to delete this post?')) {
    try {
      await deleteDoc(doc(db, 'posts', id));
      console.log('Post removed successfully');
    } 
  catch (error) {
      console.error('Error removing post:', error);
    }
  }
}
};

  const handleSeeMoreComments = () => {
    setVisibleComments(visibleComments + 3);
  };

  const handleLikePost = async () => {
    const postLike = {
      postId: id,
      userId: auth.currentUser.uid,
      username,
    };

    const likeRef = doc(db, `likes/${id}_${auth.currentUser.uid}`);
    const postRef = doc(db, `posts/${id}`);

    let updatedLikesCount;

    if (isLiked) {
      await deleteDoc(likeRef);
      if (likesCount) {
        updatedLikesCount = likesCount - 1;
      } else {
        updatedLikesCount = 0;
      }
      await updateDoc(postRef, {
        likesCount: updatedLikesCount,
      });
    } else {
      await setDoc(likeRef, postLike);
      if (likesCount) {
        updatedLikesCount = likesCount + 1;
      } else {
        updatedLikesCount = 1;
      }
      await updateDoc(postRef, {
        likesCount: updatedLikesCount,
      });
    }
  };

  useEffect(() => {
    const likesRef = collection(db, 'likes');
    const likesQuery = query(
      likesRef,
      where('postId', '==', id),
      where('userId', '==', auth.currentUser.uid)
    );

    const unsubscribeLike = onSnapshot(likesQuery, (snapshot) => {
      const like = snapshot.docs.map((doc) => doc.data());
      if (like.length !== 0) {
        setIsLiked(true);
      } else {
        setIsLiked(false);
      }
    });

    const commentsRef = collection(db, `posts/${id}/comments`);
    const commentsQuery = query(commentsRef, orderBy('createdAt', 'desc'));

    const unsubscribeComments = onSnapshot(commentsQuery, (snapshot) => {
      const comments = snapshot.docs.map((doc) => doc.data());
      setComments(comments);
    });

    return () => {
      unsubscribeLike();
      unsubscribeComments();
    };
  }, [id]);

  const comment = useRef(null);

  const handlePostComment = async (e) => {
    e.preventDefault();
    
    // Check if the comment is empty or only contains spaces
    if (!comment.current.value.trim()) {
      return; // Do not post the comment
    }
  
    // Comment functionality
    const commentData = {
      id: uuidv4(),
      username: user.username,
      comment: comment.current.value,
      createdAt: serverTimestamp(),
    };
    comment.current.value = '';
    const commentRef = doc(db, `posts/${id}/comments/${commentData.id}`);
    await setDoc(commentRef, commentData);
  };
  

  return (
    <div className="flex flex-col w-full border border-gray-200">
      <div className="flex items-center justify-between w-full p-2 ">
        <div className="flex items-center justify-center space-x-2">
           <img
            src="https://firebasestorage.googleapis.com/v0/b/perspective2-2f35d.appspot.com/o/avatar.png?alt=media&token=f9a957e1-6452-4d47-8c86-2812394ecb65"
            alt="avatar"
            className="w-15 h-10 rounded-full"
          />
          <div>{username}</div>
        </div>
      {/* ed */}
      <div className="relative w-4 select-none">
          <BsThreeDots
            className="text-lg cursor-pointer"
            onClick={handleMenuToggle}
          />
          {menuVisible && (
            <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-md w-32 z-10">
              <div
                className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                onClick={handleEditPost}
              >
                Edit Post
              </div>
              <div
                className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                onClick={handleRemovePost}
              >
                Remove Post
              </div>
            </div>
          )}
        </div>

      </div>
      <div className="relative flex items-center justify-center bg-black aspect-square">
        <Image
          src={image}
          layout="fill"
          alt={caption}
          className="object-contain"
        />
      </div>
      <div className="flex justify-between p-2 text-lg">
        <div className="flex space-x-2">
          <div onClick={handleLikePost}>
            {isLiked ? (
              <AiFillHeart
                size={25}
                className="text-red-500 cursor-pointer hover:text-red-500/50"
              />
            ) : (
              <AiOutlineHeart
                size={25}
                className="text-black cursor-pointer hover:text-black/50"
              />
            )}
          </div>
          <div>
            <FaRegComment
              size={22}
              className="text-black cursor-pointer hover:text-black/50"
            />
          </div>
        </div>
        <div>
       
        </div>
      </div>
      <div className="px-2">
        {likesCount ? `${likesCount} likes` : 'Be the first to like'}
      </div>
      <div className="px-2">{caption}</div>
      {/* comment */}
      <div className="p-2">
        <div className="flex flex-col space-y-1">
          {comments.slice(0, visibleComments).map((commentData) => (
            <div key={commentData.id} className="flex space-x-2">
              <div className="font-medium">{commentData.username}</div>
              <div>{commentData.comment}</div>
            </div>
          ))}
        </div>
        {comments.length > visibleComments && (
          <div
            className="mt-2 text-sm font-semibold text-blue-600 cursor-pointer"
            onClick={handleSeeMoreComments}
          >
            See more
          </div>
        )}
      </div>
      
      <div className="px-2">3 hours ago</div>
      <div className="flex items-center px-2 py-4 mt-1 space-x-3 border-t border-gray-200">
        <div>
          <BsEmojiSmile className="text-xl" />
        </div>
        <form onSubmit={handlePostComment} className="flex w-full px-2">
          <div className="w-full">
            <input
              type="text"
              name={`comment ${id}`}
              id={`comment ${id}`}
              className="w-full bg-white outline-none"
              placeholder="Add a comment..."
              ref={comment}
            />
          </div>
          <div>
            <button className="text-sm font-semibold text-blue-600">
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Post;
