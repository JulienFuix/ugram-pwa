import { useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useUser } from "../context/UserContext";
import { User } from "../types/User";
import { FollowUnfollowButton } from "./FollowUnfollowButton";
import Modal from "./Profils/ModalFollower";
import ModaleModifyProfil from "./Profils/ModaleModifyProfil";
import ProfilPic from "./Profils/ProfilPic";
import moment from "moment";
import SuggestUser from "./Suggestion/SuggestUser";

export default function Profil(props: {
  user: User;
  getFollower: (id: string) => any;
  post_lenght: number;
  display_follow_button: boolean;
}) {
  const [follower, setFollower] = useState(0);
  const [following, setFollowing] = useState(0);
  const [loading, setLoading] = useState(false);
  const { getFollowingForUser, getFollowForUser, userData } = useUser();

  const [modalFollower, setModalFollower] = useState(false);
  const [modalFollowing, setModalFollowing] = useState(false);
  const [followerData, setFollowerData] = useState([]);
  const [followingData, setFollowingData] = useState([]);
  const [displayModalePost, setDisplayModalePost] = useState(false);

  const [showSuggestions, setShowSuggestions] = useState(false);

  const closeModal = async () => {
    setModalFollower(false);
    setModalFollowing(false);
  };

  const getTheFollowing = async (id: string) => {
    try {
      let res = await getFollowForUser(id);
      if (res?.data) {
        setFollower(res?.data?.total);
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
        setFollowing(res?.data?.total);
        setFollowingData(res?.data?.data);
      }
    } catch (e: any) {
      console.log("error", e);
    }
  };

  const getAllGoodFollow = async (id: string) => {
    await props?.getFollower(id);
    getTheFollowing(props?.user?.id);
    getTheFollower(props?.user?.id);
  };

  useEffect(() => {
    if (props?.user?.id) {
      getTheFollowing(props?.user?.id);
      getTheFollower(props?.user?.id);
    }
  }, [props?.user?.id]);

  const closeModalModifyProfil = () => {
    setDisplayModalePost(false);
  };

  if (!loading) {
    return (
      <div className="flex z-0 flex-col md:flex-row justify-center">
        <div className="flex content-center w-full md:w-52 h-52 justify-center align-center px-auto py-auto">
          <div className="w-52 h-52 flex justify-center items-center">
            <ProfilPic url_photo={props?.user?.image} />
          </div>
        </div>
        <div className="flex flex-wrap justify-start lg:pt-2 pt-2 pb-0 pl-8  pr-8">
          <div className="pt-2 text-start flex-column justify-center align-center content-center w-full ">
            <div className="flex flex-row justify-between content-center align-center">
              <h3 className="text-2xl text-white">{props?.user?.name}</h3>
              {props?.user?.id === userData?.id && (
                <BsThreeDotsVertical
                  className="my-auto text-2xl cursor-pointer text-white"
                  onClick={() => setDisplayModalePost(true)}
                />
              )}
            </div>
            <div className="font-thin	text-sm mt-0 text-slate-400 py-2">
              @{props?.user?.username}
            </div>
            {props?.user?.id === userData?.id && (
              <div className="font-thin	text-sm mt-0 text-slate-400 py-2">
                Created at {moment(props?.user?.createdAt).format("DD/MM/YYYY")}
              </div>
            )}
            <div className="py-2">
              {displayModalePost && (
                <ModaleModifyProfil
                  changeDisplay={closeModalModifyProfil}
                  user={props?.user}
                />
              )}
              {props.display_follow_button && (
                <div
                  className="cursor-pointer"
                  onClick={() => setShowSuggestions(!showSuggestions)}
                >
                  <FollowUnfollowButton
                    id={props?.user?.id}
                    getFollower={getAllGoodFollow}
                  />
                </div>
              )}
            </div>
          </div>
          {
            <SuggestUser
              showSuggestions={showSuggestions}
              id={props?.user?.id}
            />
          }
          <div className="w-full ">
            <div className="flex justify-between">
              <div className="text-center">
                <span className="font-bold block uppercase tracking-wide text-white">
                  {props?.post_lenght}
                </span>
                <span className="text-sm font-thin text-white">
                  Publications
                </span>
              </div>
              <Modal
                getFollower={getAllGoodFollow}
                isOpen={modalFollower}
                closeModal={closeModal}
                data={followerData}
                title={"Followers"}
              />
              <button
                className="text-center"
                onClick={() => setModalFollower(true)}
              >
                <span className=" font-bold block uppercase tracking-wide text-white">
                  {follower}
                </span>
                <span className="text-sm font-thin text-white">Followers</span>
              </button>
              <Modal
                getFollower={getAllGoodFollow}
                isOpen={modalFollowing}
                closeModal={closeModal}
                data={followingData}
                title={"Followings"}
              />
              <button
                className="text-center"
                onClick={() => setModalFollowing(true)}
              >
                <span className=" font-bold block uppercase tracking-wide text-white">
                  {following}
                </span>
                <span className="text-sm font-thin text-white">Followings</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return <p>Loading</p>;
  }
}
