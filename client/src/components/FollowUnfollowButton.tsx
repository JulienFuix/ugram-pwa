import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { User } from "../types/User";
const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3030";

export const FollowUnfollowButton = (props: {
  id: string | any;
  getFollower: (id: string) => any;
}) => {
  const [following, setFollowing] = useState(false);
  const {
    getFollowingForUser,
    getFollowForUser,
    userData,
    PostFollowForUser,
    PostUnfollowForUser,
  } = useUser();
  const id_user = props?.id;

  const handleClick = async () => {
    if (following === false) {
      await PostFollowForUserUser();
    } else {
      await PostUnfollowForUserUser();
    }
  };

  const getMyFollow = async (id: any) => {
    try {
      let res = await getFollowingForUser(userData?.id);

      res?.data?.data.forEach((element: User) => {
        if (element?.id === id_user) {
          setFollowing(true);
        }
      });
    } catch (e: any) {
      console.log("error", e);
    }
  };

  const PostFollowForUserUser = async () => {
    try {
      let res = await PostFollowForUser(id_user);
      if (res.status === 200) {
        await props?.getFollower(id_user);
        await getFollowingForUser(userData?.id);
        setFollowing(true);
      }
    } catch (e: any) {
      console.log("error", e);
    }
  };

  const PostUnfollowForUserUser = async () => {
    try {
      let res = await PostUnfollowForUser(id_user);
      if (res.status === 200) {
        await props?.getFollower(id_user);
        await getFollowingForUser(userData?.id);
        setFollowing(false);
      }
    } catch (e: any) {
      console.log("error", e);
    }
  };

  useEffect(() => {
    if (props?.id) getMyFollow(props?.id);
  }, [props]);

  if (userData?.id === props?.id) {
    return <div></div>;
  } else if (following) {
    return (
      <button
        onClick={handleClick}
        className={`${"bg-red-500"} text-white py-1 px-3 rounded w-[90px]`}
      >
        {"Unfollow"}
      </button>
    );
  } else {
    return (
      <button
        onClick={handleClick}
        className={`${"bg-green-500"} text-white py-1 px-3 rounded w-[90px]`}
      >
        {"Follow"}
      </button>
    );
  }
};
