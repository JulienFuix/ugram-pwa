import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Protected from "../src/hoc/Protected";
import Layout from "../src/components/Layout";
import { RenderThemeChanger } from "../src/components/DarkMode";
import { useUser } from "../src/context/UserContext";
import { User } from "../src/types/User";
import { FollowUnfollowButton } from "../src/components/FollowUnfollowButton";
import { ModalUserList } from "../src/components/Profils/ModalUserList";
import ProfilPic from "../src/components/Profils/ProfilPic";

const AllUserList = () => {
  const { GetAllUsers } = useUser();
  const Router = useRouter();
  const [allUsers, setAllUsers] = useState<Array<User> | any>([]);
  const { getFollowForUser, userData } = useUser();

  const AllUserList = async () => {
    let res = await GetAllUsers();
    setAllUsers(res?.data);
  };

  const getFollower = async (id: string) => {
    try {
      let res = await getFollowForUser(id);
    } catch (e: any) {
      console.log("error", e);
    }
  };

  useEffect(() => {
    AllUserList();
  }, []);

  return (
    <Layout>
        <h1 className="text-2xl font-bold pt-4 pl-8 text-white">All Users</h1>
        <div className='flex h-calc(100vh-70px) w-full mt-10 justify-center'>
            <div className="flex-col flex">
                {allUsers?.length > 0 ? (
                allUsers?.map((user: User, index: any) => {
                    return (
                    <ModalUserList
                        key={index}
                        user={user}
                        getFollower={getFollower}
                        closeModal={() => {}}
                    />
                    );
                })
                ) : (
                    <p className="text-white">No users</p>
                )}
            </div>
        </div>
    </Layout>
  );
};

export default Protected(AllUserList);
