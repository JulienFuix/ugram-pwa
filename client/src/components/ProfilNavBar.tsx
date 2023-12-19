import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import Modal from "./Profils/ModalFollower";
import ProfilPic from "./Profils/ProfilPic";

export default function ProfilNavBar() {
  const router = useRouter();
  const {
    userData,
    nbFollower,
    nbFollowing,
    nbPublication,
    getFollowingForUser,
    getFollowForUser,
  } = useUser();

  const [modalFollower, setModalFollower] = useState(false);
  const [modalFollowing, setModalFollowing] = useState(false);
  const [followerData, setFollowerData] = useState([]);
  const [followingData, setFollowingData] = useState([]);

  const closeModal = async () => {
    setModalFollower(false);
    setModalFollowing(false);
  };

  const getTheFollowing = async (id: string) => {
    try {
      let res = await getFollowForUser(id);
      if (res?.data) {
        setFollowerData(res?.data?.data);
      }
    } catch (e: any) {
      console.log("error", e);
    }
  };

  const getTheFollower = async (id: string) => {
    try {
      let res = await getFollowingForUser(id);
      if (res?.data) {
        setFollowingData(res?.data?.data);
      }
    } catch (e: any) {
      console.log("error", e);
    }
  };

  useEffect(() => {
    if (userData?.id) {
      getTheFollowing(userData?.id);
      getTheFollower(userData?.id);
    }
  }, [userData?.id]);

  return (
    <div className="relative mx-3">
      <div className="flex flex-col justify-center">
        <div
          className="flex flex-col content-center align-center justify-center  cursor-pointer"
          onClick={() => router.push("/profile")}
        >
          <div className="flex items-center justify-center w-full">
            <div className="flex w-[75px] h-[75px] content-center items-center justify-center">
              <ProfilPic url_photo={userData?.image} />
            </div>
          </div>
          <div className="pt-2 text-center flex-column justify-center align-center content-center w-full">
            <h3 className="text-md text-white">{userData?.name}</h3>
            <div className="font-thin	text-sm mt-0 text-slate-400">
              @{userData?.username}
            </div>
          </div>
        </div>
        <div className="w-full text-center mb-2">
          <div className="flex justify-center lg:pt-2 pt-2 pb-0">
            <div className="p-3 text-center">
              <span className=" font-bold block uppercase tracking-wide text-white">
                {nbPublication}
              </span>
              <span className="text-sm text-white">Publications</span>
            </div>
            <Modal
              getFollower={getFollowForUser}
              isOpen={modalFollower}
              closeModal={closeModal}
              data={followerData}
              title={"Followers"}
            />
            <button
              className="p-3 text-center"
              onClick={() => setModalFollower(true)}
            >
              <span className=" font-bold block uppercase tracking-wide text-white">
                {nbFollower}
              </span>
              <span className="text-sm text-white">Followers</span>
            </button>
            <Modal
              getFollower={getFollowingForUser}
              isOpen={modalFollowing}
              closeModal={closeModal}
              data={followingData}
              title={"Followings"}
            />
            <button
              className="p-3 text-center"
              onClick={() => setModalFollowing(true)}
            >
              <span className=" font-bold block uppercase tracking-wide text-white">
                {nbFollowing}
              </span>
              <span className="text-sm text-white">Following</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
