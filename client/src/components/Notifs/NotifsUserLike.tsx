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

export default function NotifsUserLike(props: {
    notification: Notifications;
    closeModal: () => any;
    isViewed: boolean;
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
        if (props?.notification?.publication_id)
            getPostById(props?.notification?.publication_id);
    }, [props?.notification]);

    return (
        <div
            className={`flex flex-row justify-between my-5 items-center ${props?.isViewed ? "" : "font-bold"}`}
        >
            <div className="flex flex-row justify-between items-center w-full">
                <div
                    className="relative h-[50px] w-[50px] border-none cursor-pointer"
                    onClick={() => {
                        Router.push("/user/" + `${props?.notification?.associate_user_id}`);
                    }}
                >
                    <ProfilPic url_photo={image} />
                    {!props?.isViewed && <div className="h-[50px] w-[50px] top-0 flex items-center justify-end absolute">
                        <div className="rounded-full bg-red-500 w-[7px] h-[7px] mt-10"></div>
                    </div>}
                </div>
                <div
                    className="h-[50px] w-[calc(100%-50px)] flex flex-row cursor-pointer"
                    onClick={() => {
                        Router.push("/post/" + `${props?.notification?.publication_id}`);
                    }}
                >
                    <div className="text-white px-6 w-full">
                        <div className="flex flex-col">
                            <span className="font-bold">{user?.username}</span>
                            <span className="flex flex-row text-sm justify-between"><span className="line-clamp-1">Like your post</span><span className="text-sm text-gray-400">{convertTimeToParis(props?.notification?.updatedAt.toString())}</span></span>
                        </div>
                    </div>
                    <img
                        src={post?.image?.url}
                        className="w-[50px] h-[50px] align-middle rounded-md border-none cursor-pointer"
                    />
                </div>
            </div>
        </div>
    );
}
