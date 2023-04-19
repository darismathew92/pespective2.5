import React, { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../../state/context/GlobalContext';
import { collection, doc, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import Post from '../Post';
import Header from '../Header';

const UserProfile = () => {
  const { user } = useContext(GlobalContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    const userPostsCollection = collection(db, 'posts');
    const q = query(userPostsCollection, orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userPosts = snapshot.docs
        .map((doc) => doc.data())
        .filter((post) => post.username === user.username);
      setPosts(userPosts);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [user]);

  if (!user) return <div>Please log in to view your profile.</div>;

  return (
    <>
      <Header />
      <div className="w-full h-full bg-[#FAFAFA]">
    <div className="grid w-full grid-cols-1 gap-6 mx-auto mt-20">
      <div className="flex flex-col w-full space-y-5 border-t-2 ">
        {/* My Profile section */}
        <div className="w-full py-8 bg-gradient-to-r from-purple-500 to-indigo-500">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-white">
                {user.displayName || user.username}
              </h2>
              <p className="mt-4 text-lg text-purple-100">
                posts by, {user.displayName || user.username}
              </p>
            </div>
          </div>
        </div>

        <section className="grid grid-cols-2 gap-4 p-4">
          
          {loading ? (
            <div>Loading...</div>
          ) : posts.length > 0 ? (
            posts.map((post) => <Post key={post.id} {...post} />)
          ) : (
            <div>No posts found.</div>
          )}
        </section>
      </div>
    </div>
  </div>

    </>
  );
};

export default UserProfile;
