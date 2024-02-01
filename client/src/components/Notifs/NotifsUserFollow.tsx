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

    const convertTimeToParis = (date_str: string) => {
        const current_date = new Date();
        const date = new Date(date_str);

        const options: Intl.DateTimeFormatOptions = {
            timeZone: 'Europe/Paris',
            hour: '2-digit',
            minute: '2-digit',
        };
        const parisTime = date.toLocaleString('fr-FR', options);

        if (date.toDateString() === current_date.toDateString()) {
            return parisTime;
        } else {
            const dayOfWeek = date.toLocaleString('fr-FR', { weekday: 'short' });
            const dayOfMonth = date.getDate();
            const abbreviatedDayOfWeek = dayOfWeek.slice(0, 3);
            return `${abbreviatedDayOfWeek} ${dayOfMonth}`;
        }
    }

  useEffect(() => {
    if (props?.notification?.associate_user_id)
      GetUserById(props?.notification?.associate_user_id);
  }, [props?.notification]);

  return (
    <div
        className="flex flex-row justify-between my-5 items-center"
        onClick={() => {
            Router.push("/user/" + `${props?.notification?.associate_user_id}`);
        }}
    >
        <div className="flex flex-row justify-between items-center w-full">
            <div
                className="h-[50px] w-[50px] border-none cursor-pointer"
            >
                <ProfilPic url_photo={image} />
            </div>
            <div
                className="h-[50px] w-full flex flex-row cursor-pointer"
            >
                <div className="text-white px-6 w-full">
                    <div className="flex flex-col">
                        <span className="font-bold">{user?.username}</span>
                        <span className="flex flex-row text-sm justify-between"><span className="line-clamp-1">Follow you</span><span className="text-sm text-gray-400">{convertTimeToParis(props?.notification?.updatedAt.toString())}</span></span>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
