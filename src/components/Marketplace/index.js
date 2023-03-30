import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../state/context/GlobalContext";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import Post from "../Post";
import Header from "../Header";

const Marketplace = () => {
  const { user } = useContext(GlobalContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    const userPostsCollection = collection(db, "posts");
    const q = query(userPostsCollection, orderBy("createdAt", "desc"));
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
        <div className="grid w-full max-w-screen-lg grid-cols-1 gap-6 mx-auto mt-20">
          <div className="flex flex-col w-full space-y-5 border-t-2 ">
            {/* My Profile section */}
            <div className="w-full py-8 bg-gradient-to-r from-purple-500 to-indigo-500">
              <div className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                  <h2 className="text-3xl font-extrabold text-white">
                    Perspective NFT Marketplace
                  </h2>
                  <p className="mt-4 text-lg text-purple-100">
                    explore the art of the future
                  </p>
                </div>
              </div>
            </div>
            {/* Where every nft goes here */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Marketplace;
