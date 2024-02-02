import React, { createContext, useState, useContext, useEffect } from "react";
import { User } from "../../types/User";
import { FollowUnfollowButton } from "../FollowUnfollowButton";
import Router from "next/router";
import ProfilPic from "./ProfilPic";
import { useUser } from "../../context/UserContext";
import SuggestUser from "../Suggestion/SuggestUser";

export const ModalUserList = (props: {
  user: User;
  getFollower: (id: string) => any;
  closeModal: () => any;
}) => {
  const { FindUserById } = useUser();
  const [image, setImage] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const GetUserById = async (id: string) => {
    try {
      let res = await FindUserById(id);
      setImage(res?.image);
    } catch (e: any) {
      console.log("error", e);
    }
  };

  useEffect(() => {
    if (props?.user?.id) {
      GetUserById(props?.user?.id);
    }
  }, [props?.user?.id]);

  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-between m-5 items-center content-center cursor-pointer">
        <div
          className="flex flex-row justify-between items-center content-center cursor-pointer"
          onClick={() => {
            Router.push("/user/" + `${props?.user?.id}`);
            props?.closeModal();
          }}
        >
          <div className="rounded-full h-12 w-12 align-middle border-none">
            <ProfilPic url_photo={image} />
          </div>
          <div className="w-[200px]"><p className="text-[#9c9c9c] pl-4">{props?.user?.username}</p></div>
        </div>
        <div
          className="cursor-pointer"
          onClick={() => setShowSuggestions(!showSuggestions)}
        >
          <FollowUnfollowButton
            id={props?.user?.id}
            getFollower={props?.getFollower}
          />
        </div>
      </div>
      {<SuggestUser showSuggestions={showSuggestions} id={props?.user?.id} />}
    </div>
  );
};
