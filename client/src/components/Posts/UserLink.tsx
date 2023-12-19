import React from "react";
import LikePost from "./LikePost";
import CommentPost from "./CommentPost";
import ProfilPic from '../Profils/ProfilPic';
import { Post } from "../../types/Post";
import { User } from "../../types/User";

export default function UserLink(props: { user: User | any, post: Post }) {
  return (
    <div className="flex flex-row justify-around align-center items-center w-full py-4">
     <div className="w-10 h-10 flex items-center justify-center"><ProfilPic url_photo={props?.user?.image}/></div>
      <p className="text-white">{props?.user?.username}</p>
      <div>
        <LikePost post={props.post}/>
      </div>
      <div>
        <CommentPost post={props.post}/>
      </div>
    </div>
  );
}
