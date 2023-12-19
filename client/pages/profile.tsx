import { motion } from "framer-motion";
import { useEffect, useState } from 'react';
import { FiCamera } from "react-icons/fi";
import Layout from "../src/components/Layout";
import DisplayPost from "../src/components/Posts/DisplayPost";
import Profil from "../src/components/Profil";
import ModaleModifyProfil from "../src/components/Profils/ModaleModifyProfil";
import { useUser } from "../src/context/UserContext";
import { Post } from "../src/types/Post";
import Protected from "../src/hoc/Protected";

const containerMotion = {
  hidden: { opacity: 1, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delayChildren: 0.9,
      staggerChildren: 0.9
    }
  }
};

const itemMotion = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
};

const ProfilePage = () => {
  const [listPublication, setPublication] = useState([]);
  const { userData, nbFollower, nbFollowing, nbPublication, FindAllPostById } = useUser();
  const { getFollowForUser, getFollowingForUser } = useUser();
  const [follower, setFollower] = useState(0);
  const [following, setFollowing] = useState(0);

  const actualizePost = (state: boolean) => {
    if (state === true) {
      const timer = setTimeout(() => {
        findPost();
      }, 400);
      return () => clearTimeout(timer);
    }
  }

  const findPost = async () => {
    let res = await FindAllPostById(userData?.id);
    setPublication(res?.data);
  };

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

  useEffect(() => {
    findPost();
  }, []);

  return (
    <Layout>
      <Profil getFollower={getFollower} user={userData} post_lenght={listPublication?.length} display_follow_button={false} />
      <div className="pl-[5%] pt-[5%] mt-10 md:mt-0">
        <h1 className="text-2xl font-bold text-white">Publications</h1>
      </div>

      <div className="w-full p-[5%]">
        <motion.ul
          className="w-full grid-list"
          variants={containerMotion}
          initial="hidden"
          animate="visible"
        >
          {listPublication?.length > 0 && listPublication?.map((element: Post, index: number) => <motion.li key={index} variants={itemMotion}>
            <div className="flex max-h-fit justify-center">
              <DisplayPost actualizePost={actualizePost} display_follow_button={false} getFollower={getFollower} post={element} user_follower={follower} user_following={following}  />
            </div>
          </motion.li>)}
          {listPublication?.length <= 0 &&
            <div className="flex flex-col justify-center align-center content-center items-center min-h-[300px]">
              <div className="flex flex-col justify-center align-center content-center pt-4">
                <div className="rounded-full border-2 border-white">
                  <FiCamera className="m-4 text-3xl font-black text-white" color="white"/>
                </div>
              </div>
              <p className="text-3xl font-bold pt-8 text-white">No Posts Yet</p>
            </div>
          }
        </motion.ul>
      </div>
    </Layout>
  );
};

export default Protected(ProfilePage);