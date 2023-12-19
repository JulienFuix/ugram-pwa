import React, { useState, useEffect } from "react";
import { FaRegBell } from "react-icons/fa";
import ModalNotifs from "./ModalNotifs";
import { useUser } from "../../context/UserContext";
import { User } from "../../types/User";
import { FollowUnfollowButton } from "../FollowUnfollowButton";
import Router from "next/router";
import ProfilPic from "../Profils/ProfilPic";
import { Notifications } from "../../types/Notifications";

export default function NotifsUserFollow(props: {
  notification: Notifications;
  closeModal: () => any;
}) {
  const { FindUserById, patchNotifications } = useUser();
  const [image, setImage] = useState("");
  const [user, setUser] = useState<User>();

  const GetUserById = async (id: string) => {
    try {
      let res = await FindUserById(id);
      setImage(res?.image);
      setUser(res);
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
  }, [props?.notification]);

  return (
    <div
      className="flex flex-row justify-between m-5 items-center content-center cursor-pointer"
      onClick={() => {
        NotifsRead(props?.notification?.id), props?.closeModal();
        Router.push("/user/" + `${props?.notification?.associate_user_id}`);
      }}
    >
      <div className="flex flex-row justify-between items-center content-center">
        <div className="h-12 w-12 align-middle border-none">
          <ProfilPic url_photo={image} />
        </div>
        <div className="flex flex-col">
          <p className="text-[#9c9c9c] pl-4">
            {user?.username}
            {" follow you"}
          </p>
        </div>
      </div>
    </div>
  );
}
