import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FiCamera } from "react-icons/fi";
import Layout from "../../src/components/Layout";
import DisplayPost from "../../src/components/Posts/DisplayPost";
import Profil from "../../src/components/Profil";
import { useUser } from "../../src/context/UserContext";
import { AllPostObject } from "../../src/types/AllPostObject";
import { Post } from "../../src/types/Post";
import { User } from "../../src/types/User";

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

const UserPage = () => {
  const router = useRouter();
  let { id } = router.query as { id: string };
  const [user, setUser] = useState<User | any>();
  const [post, setPost] = useState<AllPostObject | any>([]);
  const [loading, setLoading] = useState(false);
  const { FindUserById, FindAllPostById } = useUser();
  const { getFollowForUser, getFollowingForUser } = useUser();
  const [follower, setFollower] = useState(0);
  const [following, setFollowing] = useState(0);

  const actualizePost = (state: boolean) => {
    if (state === true) {
      const timer = setTimeout(() => {
        GetAllPost(id);
      }, 400);
      return () => clearTimeout(timer);
    }
  }

  const GetUserById = async (id: string) => {
    try {
      let res = await FindUserById(id);
      setUser(res);
    } catch (e: any) {
      console.log("error", e);
    }
  };

  const GetAllPost = async (user_id: string) => {
    try {
      let res = await FindAllPostById(user_id);
      setPost(res);
      setLoading(false);
    } catch (e: any) {
      console.log("error", e);
    }
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
    if (id) {
      GetUserById(id);
      GetAllPost(id);
      getFollower(id);
      getTheFollowing(id);
    }
  }, [id]);

  if (!loading) {
    return (
      <Layout>
        <div className="h-screen">
          <Profil user={user} getFollower={getFollower} post_lenght={post?.total} display_follow_button={true} />
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
              {post?.total > 0 && post?.data?.map((element: Post, index: string) => <motion.li key={index} variants={itemMotion}>
                <div className="flex max-h-fit">
                  <DisplayPost actualizePost={actualizePost} display_follow_button={true} getFollower={getFollower} post={element} user_follower={follower} user_following={following} />
                </div>
              </motion.li>)}
              {post?.total <= 0 &&
                <div className="flex flex-col justify-center align-center content-center items-center min-h-[300px]">
                  <div className="flex flex-col justify-center align-center content-center pt-4">
                    <div className="rounded-full border-2 border-white">
                      <FiCamera className="m-4 text-3xl font-black text-white" color="white" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold pt-8 text-white">No Posts Yet</p>
                </div>
              }
            </motion.ul>
          </div>
        </div>
      </Layout>
    );
  } else {
    return <p>Loading</p>;
  }
};

export default UserPage;
