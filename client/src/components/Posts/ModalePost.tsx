import React, { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import { AiFillDelete } from "react-icons/ai";
import ProfilPic from "../Profils/ProfilPic";
import { CgProfile } from "react-icons/cg";
import { Mention, MentionsInput } from "react-mentions";
import { AllFollowObject } from "../../types/AllFollowObject";
import { HTTPRequest } from "../../api/feathers-config";
import Router from "next/router";
import ModifyPost from "./ModifyPost";
import { AiOutlineForm } from "react-icons/ai";
import { ModalUserList } from "../Profils/ModalUserList";
import { usePublication } from "../../context/PublicationContext";
import { useUser } from "../../context/UserContext";

interface ModaleProps {
  changeDisplay: (display: boolean) => void;
  postData: any;
  user: any;
  getFollower: (id: string) => any;
  display_follow_button: boolean;
}

interface Comment {
  id: string;
  content: string;
  user: any;
  // add any other properties here
}


export default function ModalePost(props: ModaleProps) {
  const [allUser, setAllUser] = useState<AllFollowObject | any>([]);
  const { createComments, getComments, removeComment } = usePublication();
  const { FindUserById } = useUser();
  const [allComments, setallComments] = useState<Comment[]>([]);
  const [isDelete, setIsDelete] = useState(false);
  const { userData } = useUser();

  const FindAllUser = async () => {
    try {
      let res = await HTTPRequest("find", "users");
      setAllUser(res?.data);
    } catch (e: any) {
      console.log("error", e);
    }
  };

  const UserListFunc = async (query: any, callback: any) => {
    callback(allUser.map((u: any) => ({ id: u.id, display: u.username })));
  };

  const [displayModalePost, setDisplayModalePost] = useState(false);

  const handleCloseClick = () => {
    props.changeDisplay(false);
  };

  const handleClickAddComment = async () => {
    var inputElement = document.getElementById("content-comment") as HTMLInputElement;
    if(inputElement.value != "") {
      var inputValue = inputElement.value;
      let res = await createComments(props.postData.id, inputValue);
      setIsDelete(!isDelete);
      inputElement.value = "";
    }
  };

  const deleteComment = async (id: string) => {
    let res = await removeComment(id);
    setIsDelete(!isDelete);
  };

  const getCommentByPublication = async () => {
    let res = await getComments(props.postData.id);
    setallComments(res);
  };

  const handleDisplayChange = (newValue: boolean) => {
    setDisplayModalePost(newValue);
    handleCloseClick();
  };

  useEffect(() => {
    FindAllUser();
    getCommentByPublication();
  }, []);

  useEffect(() => {
    getCommentByPublication();
  }, [isDelete]);

  return (
    <div className="custom-modale-background w-screen h-screen fixed z-50 top-0 left-0 flex justify-center items-center">
      <button
        className="fixed z-51 top-0 right-0 mt-6 mr-6"
        onClick={() => handleCloseClick()}
      >
        <FiX className="text-white" color="white" size={35} />
      </button>
      <div className="w-[350px] lg:w-[950px] bg-[#161616] rounded-lg flex flex-col lg:flex-row overflow-y-auto">
        <div className="flex items-center justify-center">
          <img
            src={props?.postData?.image?.url}
            alt="..."
            className="w-[350px] h-[350px] lg:w-[500px] lg:h-[500px] object-scale-down align-middle rounded-md border-none cursor-pointer px-6"
          />
        </div>
        <div className="w-[300px] h-[350px] lg:w-[450px] lg:h-[500px]">
            <ModalUserList
              user={props.user}
              getFollower={props.getFollower}
              closeModal={() => {}}
            />
          {props?.postData.description !== "" && (
            <div className="w-full h-auto flex flex-row mt-1 border-t-[2px] border-t-[#393737] pb-2">
              <div className="h-[50px] w-[50px] flex justify-center items-center mt-3 ml-2">
                <ProfilPic url_photo={props?.user?.image} />
              </div>
              <div className="h-auto pr-3 py-[20px] ml-2 w-[90%] flex items-center justify-between">
                <MentionsInput
                  disabled={true}
                  className="text-white"
                  value={props?.postData.description}
                >
                  <Mention
                    trigger="@"
                    data={UserListFunc}
                    markup="[@__display__](__id__)"
                    displayTransform={(id, display) => `@${display}`}
                  />
                </MentionsInput>
              <div className="w-[10%] h-[5px] justify-between items-center flex flex-row">
            {Router.asPath === "/profile" && (
              <div>
                <button
                  onClick={() => setDisplayModalePost(true)}
                  className="mr-4 text-white"
                >
                  <AiOutlineForm size={25} />
                </button>
              </div>
            )}
          </div>
              </div>
            </div>
          )}
          <div className="w-full">
            <div className="scrollbar-hide w-full h-[250px] overflow-y-scroll">
              {allComments.map( (comment, index) => (
                <div key={index}>
                  <div className="scrollbar-hide w-full min-h-[75px] max-h-[150px] mt-2 flex">
                    <div className="scrollbar-hide h-auto min-w-[150px] max-w-[200px] overflow-x-scroll flex justify-evenly items-center">
                    <div className="h-[50px] w-[50px] flex justify-center items-center mt-3 ml-2">
                      {comment?.user?.image ?<img
                      src={"https://ufood-dev.s3.amazonaws.com/" + comment?.user?.image?.url}
                      className="rounded-full align-center w-full h-full object-cover"
                    /> : <CgProfile className="rounded-full w-full h-full text-[#9c9c9c] align-center border-none" size={60}/>}
                    </div>
                      <div onClick={() => {
                        Router.push("/user/" + `${comment?.user?.id}`);
                      }}
                      className="scrollbar-hide text-white h-full flex items-center cursor-pointer justify-start font-bold overflow-x-scroll max-w-[100px] ml-3 text-base md:text-sm sm:text-xs">{comment?.user?.username}
                      </div>
                    </div>
                    <div className="scrollbar-hide w-full h-auto overflow-scroll p-2 pt-6 text-white">{"  " + comment?.content}
                    </div>
                    {userData?.id == comment?.user?.id ? <button className="m-2" onClick={() => deleteComment(comment?.id)}><AiFillDelete className="hover:text-red-500 transition duration-200" size={20}/></button> : null}
                  </div>
                </div>
              ))}

            </div>
            <div className="min-w-[350px] w-full h-[75px] flex justify-evenly items-center border-t-[#393737] border-t-[2px]">
              <input id="content-comment" placeholder="Laissez un commentaire..." className="w-[75%] h-[50px] p-3 rounded-full text-white bg-black bg-opacity-40"></input>
              <button id="button" type="button" onClick={handleClickAddComment} className="text-white p-2 rounded-full border-2 border-[#4a4a4a] hover:scale-105 transition duration-150">Envoyer</button>
            </div>
          </div>
        </div>
      </div>
      {displayModalePost && (
        <ModifyPost
          user={props?.user}
          changeDisplay={handleDisplayChange}
          postData={props?.postData}
        />
      )}
    </div>
  );
}
