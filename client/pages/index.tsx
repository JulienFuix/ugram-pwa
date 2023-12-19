import { useState, useEffect } from "react";
import Link from "next/link";
import Layout from "../src/components/Layout";
import Protected from "../src/hoc/Protected";
import { FiCamera } from "react-icons/fi";
import DisplayPost from "../src/components/Posts/DisplayPost";
import { Post } from "../src/types/Post";
import { motion } from "framer-motion";
import { AllPostObject } from "../src/types/AllPostObject";
import { useUser } from "../src/context/UserContext";
import { usePublication } from "../src/context/PublicationContext";
import { useAuth } from "../src/context/AuthContext";

const containerMotion = {
  hidden: { opacity: 1, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delayChildren: 0.9,
      staggerChildren: 0.9,
    },
  },
};

const itemMotion = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

const IndexPage = () => {
  const [post, setPost] = useState<AllPostObject | any>([]);
  const { getFollowForUser, getFollowingForUser } = useUser();
  const { getAllPublication } = usePublication();
  const [follower, setFollower] = useState(0);
  const [following, setFollowing] = useState(0);
  const { isAuthenticated } = useAuth();

  const getFollower = async (id: string) => {
    try {
      let res = await getFollowForUser(id);
      if (res?.data) {
        setFollower(res?.data?.total);
      }
    } catch (e: any) {
      console.log("error", e);
    }
  };

  const getTheFollowing = async (id: string) => {
    try {
      let res = await getFollowingForUser(id);
      if (res?.data) {
        setFollowing(res?.data?.total);
      }
    } catch (e: any) {
      console.log("error", e);
    }
  };

  const getAllPublicationFromAll = async () => {
    try {
      let res = await getAllPublication();
      if (res?.data) {
        setPost(res);
      }
    } catch (e: any) {
      console.log("error", e);
    }
  };

  const actualizePost = (state: boolean) => {
    if (state === true) {
      const timer = setTimeout(() => {
        getAllPublicationFromAll();
      }, 400);
      return () => clearTimeout(timer);
    }
  }

  useEffect(() => {
    if (isAuthenticated != false)
      getAllPublicationFromAll();
  }, []);

  return (
    <Layout>
      <h1 className="text-2xl font-bold pt-4 pl-8 text-white">All Publications</h1>
      <div className='flex h-calc(100vh-70px) w-full md:w-[calc(w-screen-280px)] px-10 pt-[1%] overscroll-y-auto mt-10'>
        <motion.ul
          className="w-full grid-list"
          variants={containerMotion}
          initial="hidden"
          animate="visible"
        >
          {post?.total > 0 &&
            post?.data?.map((element: Post, index: string) => (
              <motion.li key={index} variants={itemMotion}>
                <div className="flex max-h-fit justify-center">
                  <DisplayPost
                    actualizePost={actualizePost}
                    display_follow_button={true}
                    getFollower={getFollower}
                    post={element}
                    user_follower={follower}
                    user_following={following}
                  />
                </div>
              </motion.li>
            ))}
          {post?.total <= 0 && (
            <div className="flex flex-col justify-center content-center items-center min-h-[500px]">
              <div className="flex flex-col justify-center content-center pt-4">
                <div className="rounded-full border-2 border-white">
                  <FiCamera className="text-white m-4 text-3xl font-black" />
                </div>
              </div>
              <p className="text-3xl font-bold pt-8 text-white">No Posts Yet</p>
            </div>
          )}
        </motion.ul>
      </div>
    </Layout>
  );
};

export default Protected(IndexPage);
