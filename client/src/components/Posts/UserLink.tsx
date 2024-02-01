import React from "react";
import LikePost from "./LikePost";
import CommentPost from "./CommentPost";
import ProfilPic from '../Profils/ProfilPic';
import { Post } from "../../types/Post";
import { User } from "../../types/User";

export default function UserLink(props: { user: User | any, post: Post }) {
  return (
    <div className="flex flex-row justify-between align-center items-center w-full py-4">
        <div className="w-[40px] h-[40px] flex items-center justify-center">
            <ProfilPic url_photo={props?.user?.image}/>
        </div>
        <div className="w-[calc(100%-115px)]">
            <p className="text-white ml-3 font-light">{props?.user?.username}</p>
        </div>
        <div className="flex flex-row w-[75px]">
            <div>
                <LikePost post={props.post}/>
            </div>
            <div className="ml-3">
                <CommentPost post={props.post}/>
            </div>
        </div>
    </div>
  );
}
