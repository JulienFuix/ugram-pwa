import React, { useState, useEffect } from "react";
import { FaRegBell } from "react-icons/fa";
import ModalNotifs from "./ModalNotifs";
import { useUser } from "../../context/UserContext";
import { User } from "../../types/User";
import { FollowUnfollowButton } from "../FollowUnfollowButton";
import Router from "next/router";
import ProfilPic from "../Profils/ProfilPic";
import { Notifications } from "../../types/Notifications";
import { Post } from "../../types/Post";
import { usePublication } from "../../context/PublicationContext";

export default function NotifsUserComments(props: {
  notification: Notifications;
  closeModal: () => any;
}) {
  const { FindUserById, patchNotifications } = useUser();
  const [image, setImage] = useState("");
  const [user, setUser] = useState<User>();
  const [post, setPost] = useState<Post>();
  const { getPostsById } = usePublication();

  const GetUserById = async (id: string) => {
    try {
      let res = await FindUserById(id);
      setImage(res?.image);
      setUser(res);
    } catch (e: any) {
      console.log("error", e);
    }
  };

  const getPostById = async (id: string) => {
    try {
      let res = await getPostsById(id);
      if (res) {
        setPost(res);
      }
    } catch (e: any) {
      console.log("error", e);
    }
  };

  const NotifsRead = async (id: string) => {
    try {
      let res = await patchNotifications(id);
    } catch (e: any) {
      console.log("error", e);
    }
  };

  useEffect(() => {
    if (props?.notification?.associate_user_id)
      GetUserById(props?.notification?.associate_user_id);
    if (props?.notification?.publication_id)
      getPostById(props?.notification?.publication_id);
  }, [props?.notification]);

  return (
    <div
      className="flex flex-row justify-between m-5 items-center content-center"
      onClick={() => {
        NotifsRead(props?.notification?.id), props?.closeModal();
      }}
    >
      <div className="flex flex-row justify-between items-center content-center">
        <div
          className="h-12 w-12 align-middle border-none cursor-pointer"
          onClick={() => {
            Router.push("/user/" + `${props?.notification?.associate_user_id}`);
          }}
        >
          <ProfilPic url_photo={image} />
        </div>
      </div>
      <div
        className="flex cursor-pointer flex-row justify-between m-5 items-center"
        onClick={() => {
          Router.push("/post/" + `${props?.notification?.publication_id}`);
        }}
      >
        <div className="flex flex-col">
          <p className="text-[#9c9c9c] pl-4">
            {user?.username}
            {" comment on your post"}
          </p>
        </div>
        <div className="rounded-full m-h-6 m-w-4 align-middle border-none">
          <img
            src={post?.image?.url}
            className="align-center object-cover max-h-16 max-w-16"
          />
        </div>
      </div>
    </div>
  );
}
