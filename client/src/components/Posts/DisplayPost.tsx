import React, { useEffect, useState } from "react";
import { Post } from "../../types/Post";
import UserLink from "./UserLink";
import ModalePost from "./ModalePost";
import { User } from "../../types/User";
import { useUser } from "../../context/UserContext";

export default function DisplayPost(props: { actualizePost: (state: boolean) => any,  post: Post, user_follower: any, user_following: any, getFollower: (id: string) => any, display_follow_button: boolean }) {
  const [displayModalePost, setDisplayModalePost] = useState(false);
  const { FindUserById } = useUser();
  const [user, setUser] = useState<User>();

  const handleDisplayChange = (newValue: boolean) => {
    setDisplayModalePost(newValue);
    props.actualizePost(true);
  };

  const GetUserById = async (id: string) => {
    try {
      let res = await FindUserById(id);
      setUser(res);
    } catch (e: any) {
      console.log("error", e);
    }
  };

  useEffect(() => {
    if (props.post?.user_id && !user) GetUserById(props.post?.user_id);
  }, [props]);

  return (
    <div className="w-[300px] h-[382px] rounded-md p-2">
      <img
        onClick={() => setDisplayModalePost(true)}
        src={props?.post?.image?.url}
        alt="..."
        className="w-[300px] h-[300px] object-scale-down align-middle rounded-md border-none cursor-pointer"
      />
      <div className="w-full h-[72px]">
        <UserLink user={user} post={props.post}/>
      </div>
      {displayModalePost && <ModalePost display_follow_button={props.display_follow_button} getFollower={props.getFollower} user={user} changeDisplay={handleDisplayChange} postData={props?.post} />}
    </div>
  );
}
