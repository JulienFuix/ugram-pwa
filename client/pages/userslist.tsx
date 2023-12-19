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
      <div className="w-full h-[85vh] flex items-start mt-10 justify-center p-10">
        <div className="w-[100%] min-w-[300px] h-[full] max-h-[700px] rounded-xl p-2 flex flex-col shadow-[inset_0px_-22px_38px_-4px_rgba(0,0,0,0.82)]">
          <div className="w-full h-[25px] p-4 flex items-center justify-center text-white text-lg font-bold border-b-2 drop-shadow-2xl">
            User list
          </div>
          <div className="w-full h-full overflow-scroll">
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
              <p>No users</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Protected(AllUserList);
