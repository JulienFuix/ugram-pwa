import React, { useState, useEffect } from "react";
import ProfilPic from "../../src/components/Profils/ProfilPic";
import { useRouter } from "next/router";
import { usePublication } from "../../src/context/PublicationContext";
import { Post } from "../../src/types/Post";
import Layout from "../../src/components/Layout";
import { useUser } from "../../src/context/UserContext";
import { User } from "../../src/types/User";
import { Comment } from "../../src/types/Comment";
import Router from "next/router";
import { AiFillDelete } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { Mention, MentionsInput } from "react-mentions";
import { AllFollowObject } from "../../src/types/AllFollowObject";

export default function PostsPage() {
  const router = useRouter();
  let { id } = router.query as { id: string };
  const { userData, getFollowForUser } = useUser();
  const { getPostsById, getComments, removeComment, createComments } =
    usePublication();
  const [post, setPost] = useState<Post>();
  const { FindUserById } = useUser();
  const [user, setUser] = useState<User | undefined>(undefined);
  const [postId, setPostId] = useState("");
  const [allComments, setallComments] = useState<Comment[]>([]);
  const [isDelete, setIsDelete] = useState(false);
  const [allUser, setAllUser] = useState<AllFollowObject | any>([]);

  const handleClickAddComment = async () => {
    var inputElement = document.getElementById(
      "content-comment"
    ) as HTMLInputElement;
    if (inputElement.value != "") {
      var inputValue = inputElement.value;
      let res = await createComments(postId, inputValue);
      setIsDelete(!isDelete);
      inputElement.value = "";
      getCommentByPublication(postId);
    }
  };

  const getThePost = async (id: string) => {
    try {
      let res = await getPostsById(id);
      if (res) {
        setPost(res);
        setPostId(res?.id);
      }
    } catch (e: any) {
      console.log("error", e);
    }
  };

  const GetUserById = async (id: string) => {
    try {
      let res = await FindUserById(id);
      setUser(res);
    } catch (e: any) {
      console.log("error", e);
    }
  };

  const getCommentByPublication = async (id: string) => {
    let res = await getComments(id);
    setallComments(res);
  };

  useEffect(() => {
    if (post?.user_id) {
      GetUserById(post?.user_id);
    }
  }, [post?.user_id]);

  const deleteComment = async (id: string) => {
    let res = await removeComment(id);
    setIsDelete(!isDelete);
  };

  const UserListFunc = async (query: any, callback: any) => {
    callback(allUser.map((u: any) => ({ id: u.id, display: u.username })));
  };

  const getFollower = async (id: string) => {
    try {
      let res = await getFollowForUser(id);
    } catch (e: any) {
      console.log("error", e);
    }
  };

  useEffect(() => {
    if (id) {
      getCommentByPublication(id);
      getThePost(id);
    }
  }, [id]);

  return (
    <Layout>
      <div className="w-screen h-screen bg-[#161616] flex justify-center pr-[15%]">
        <div className="h-screen bg-[#161616] flex flex-col lg:flex-row">
          <div className="flex items-center justify-between">
            <img
              src={post?.image?.url}
              alt="..."
              className="w-[350px] h-[650px] lg:w-[500px] lg:h-[800px] object-scale-down align-middle rounded-md border-none cursor-pointer"
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="w-[300px] h-[350px] lg:w-[450px] lg:h-[500px">
              {post?.description !== "" && (
                <div className="w-full h-auto flex flex-row mt-1 border-b-[2px] border-b-[#393737] pb-2">
                  <div className="h-[50px] w-[50px] flex justify-center items-center mt-3 ml-2">
                    <ProfilPic url_photo={user?.image} />
                  </div>
                  <div className="h-auto pr-3 py-[20px] ml-2 w-[90%] flex items-center justify-between">
                    <MentionsInput
                      disabled={true}
                      className="text-white"
                      value={post?.description}
                    >
                      <Mention
                        trigger="@"
                        data={UserListFunc}
                        markup="[@__display__](__id__)"
                        displayTransform={(id, display) => `@${display}`}
                      />
                    </MentionsInput>
                    <div className="w-[10%] h-[5px] justify-between items-center flex flex-row"></div>
                  </div>
                </div>
              )}
              <div className="w-full">
                <div className="scrollbar-hide w-full h-[250px] overflow-y-scroll">
                  {allComments?.map((comment, index) => (
                    <div key={index}>
                      <div className="scrollbar-hide w-full min-h-[75px] max-h-[150px] mt-2 flex">
                        <div className="scrollbar-hide h-auto min-w-[150px] max-w-[200px] overflow-x-scroll flex justify-evenly items-center">
                          <div className="h-[50px] w-[50px] flex justify-center items-center mt-3 ml-2">
                            {comment?.user?.image ? (
                              <img
                                src={
                                  "https://ufood-dev.s3.amazonaws.com/" +
                                  comment?.user?.image?.url
                                }
                                className="rounded-full align-center w-full h-full object-cover"
                              />
                            ) : (
                              <CgProfile
                                className="rounded-full w-full h-full text-[#9c9c9c] align-center border-none"
                                size={60}
                              />
                            )}
                          </div>
                          <div
                            onClick={() => {
                              Router.push("/user/" + `${comment?.user?.id}`);
                            }}
                            className="scrollbar-hide text-white h-full flex items-center cursor-pointer justify-start font-bold underline overflow-x-scroll max-w-[100px] ml-3"
                          >
                            {comment?.user?.username}
                          </div>
                        </div>
                        <div className="scrollbar-hide w-full h-auto overflow-scroll p-2 pt-6 text-white">
                          {"  " + comment?.content}
                        </div>
                        {userData?.id == comment?.user?.id ? (
                          <button
                            className="m-2"
                            onClick={() => deleteComment(comment?.id)}
                          >
                            <AiFillDelete
                              className="hover:text-red-500 transition duration-200 text-white"
                              size={20}
                            />
                          </button>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="min-w-[350px] w-full h-[75px] flex justify-evenly items-center">
                  <input
                    id="content-comment"
                    placeholder="Laissez un commentaire..."
                    className="w-[75%] h-[50px] p-3 rounded-full text-black"
                  ></input>
                  <button
                    id="button"
                    type="button"
                    onClick={handleClickAddComment}
                    className="text-white p-2 rounded-full border-2 border-[#4a4a4a] hover:scale-105 transition duration-150"
                  >
                    Envoyer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
