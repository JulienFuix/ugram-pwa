import { FollowUnfollowButton } from "../FollowUnfollowButton";
import ProfilPic from "../Profils/ProfilPic";
import React, { useEffect, useState } from "react";
import { HTTPRequest } from "../../api/feathers-config";
import Router from "next/router";
import { User } from "../../types/User";

export default function SuggestUserComponent(props: { userDataProps: any }) {
  const [userData, setUserData] = useState<User>();

  const getUniqueUser = async (id: string) => {
    try {
      const res = await HTTPRequest("get", "users", {
        _id: id,
      });
      setUserData(res);
    } catch (e: any) {
      console.log("error", e);
    }
  };

  useEffect(() => {
    if (props?.userDataProps?.id) {
      getUniqueUser(props?.userDataProps?.id);
    }
  }, [props?.userDataProps?.id]);

  return (
    <div className="flex flex-col align-center justify-center items-center mb-3 border-black border-2 p-4 m-4 rounded curser-pointer">
      <div
        className="flex flex-col align-center justify-center items-center curser-pointer"
        onClick={() => {
          Router.push("/user/" + `${userData?.id}`);
        }}
      >
        <div className="flex max-w-24 w-24 max-h-24 h-24 align-center justify-center items-center">
          <ProfilPic url_photo={userData?.image} />
        </div>
        <div className="flex flex-col justify-center items-center align-center pb-4 ">
          <a className="font-medium text-center text-gray-800 hover:text-gray-600">
            {userData?.username}
          </a>
          <p className="text-sm text-gray-500 text-center">
            Suggestion pour vous
          </p>
        </div>
      </div>
      <FollowUnfollowButton id={userData?.id} getFollower={() => {}} />
    </div>
  );
}
