import React, { useState, useEffect, useRef } from "react";
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
import { FiSend, FiTrash } from "react-icons/fi";
import UserLink from '../../src/components/Posts/UserLink';

export default function PostsPage() {
    const router = useRouter();
    let { id } = router.query as { id: string };
    const { userData, getFollowForUser } = useUser();
    const { getPostsById, getComments, removeComment, createComments, AllComments } =
        usePublication();
    const [post, setPost] = useState<Post>();
    const { FindUserById } = useUser();
    const [user, setUser] = useState<User | undefined>(undefined);
    const [postId, setPostId] = useState("");
    const [allComments, setallComments] = useState<Comment[]>([]);
    const [isDelete, setIsDelete] = useState(false);
    const [allUser, setAllUser] = useState<AllFollowObject | any>([]);
    const [comment, setComment] = useState<string>("");
    const commentEndRef = useRef<HTMLDivElement>(null);

    const getThePost = async (id: string) => {
        try {
            let res = await getPostsById(id);
            if (res) {
                setPost(res);
                setPostId(res?.id);
                console.log("POST", res);
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

    const sendComment = async () => {
        if (comment && post?.id) {
            await createComments(post?.id, comment);
            setIsDelete(!isDelete);
            setComment("");
            scrollToTop();
        }
    }

    const handleCommentChange = (event: any) => {
        setComment(event.target.value);
    };

    const scrollToTop = () => {
        commentEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToTop();
        setallComments(AllComments.reverse());
    }, [AllComments]);

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
        if (id) {
            getCommentByPublication(id);
            getThePost(id);
        }
    }, [id]);

    return (
        <Layout>
            <div className="w-screen bg-[#161616] flex justify-center lg:pr-[15%]">
                <div className="h-full flex flex-col">
                    <div className="flex items-center justify-center lg:mt-5">
                        <img
                            src={post?.image?.url}
                            alt="..."
                            className="w-full lg:w-[500px] object-scale-down align-middle lg:rounded-md border-none cursor-pointer"
                        />
                    </div>
                    <div className="px-6 w-full">
                        <div className="w-full h-[72px]">
                            {(user && post) && <UserLink user={user} post={post} />}
                        </div>
                        {post?.description !== "" && (
                            <div className="w-full lg:my-5 pb-3 pt-1 h-auto flex items-center justify-between">
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
                            </div>
                        )}
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="w-full lg:w-[450px]">
                            <div className="w-full relative">
                                <div className="px-6 scrollbar-hide w-full h-[250px] overflow-y-scroll">
                                    <div ref={commentEndRef} />
                                    {allComments?.map((comment, index) => (
                                        <div key={index}>
                                            <div className="scrollbar-hide w-full h-[65px] mt-2 mb-4 flex">
                                                <div className="h-auto w-[40px] mr-6 flex justify-center items-start mt-3">
                                                    {comment?.user?.image ? <img
                                                        src={"https://ufood-dev.s3.amazonaws.com/" + comment?.user?.image?.url}
                                                        className="rounded-full align-center w-[40px] h-[40px] object-cover"
                                                    /> : <CgProfile className="rounded-full w-[40px] h-[40px] text-[#9c9c9c] align-center border-none" size={60} />}
                                                </div>
                                                <div className="flex flex-col pt-2 h-auto w-[calc(100%-94px)]">
                                                    <div onClick={() => {
                                                        Router.push("/user/" + `${comment?.user?.id}`);
                                                    }}
                                                        className="scrollbar-hide text-white cursor-pointer">
                                                        <span className="font-bold">{comment?.user?.username}</span>
                                                        <span className="ml-3 text-xs text-gray-400">{convertTimeToParis(comment?.createdAt.toString())}</span>
                                                    </div>
                                                    <div className="w-full">
                                                        <div className="text-white text-sm">{"  " + comment?.content}</div>
                                                    </div>
                                                </div>
                                                <div className="w-[30px] h-full flex justify-center items-start mt-6">
                                                    {userData?.id == comment?.user?.id ? <button onClick={() => deleteComment(comment?.id)}><FiTrash className="hover:text-red-500 text-white transition duration-200" size={17} /></button> : null}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <form
                                    className="absolute w-full bg-[#121212] h-[60px] flex flex-row items-center pl-2 border-t-[1px] border-[#202020]"
                                    onSubmit={(event) => {
                                        event.preventDefault();
                                        if (comment.length < 251) sendComment();
                                    }}
                                >
                                    <input
                                        className=" rounded-l-md decoration-transparent focus:outline-none px-[10px] py-[2px] h-[40px] w-full bg-[#202020] border-none text-white"
                                        required={true}
                                        onChange={handleCommentChange}
                                        placeholder="Your message..."
                                        value={comment}
                                    />
                                    <div className="h-[40px] pl-2 bg-[#202020] flex items-end py-1 text-[10px] text-white">
                                        <p className={`${comment.length > 250 ? "text-red-500" : "text-white"}`}>{comment.length}</p>
                                    </div>
                                    <div className="w-[50px] mr-2 h-[40px] flex justify-center items-center cursor-pointer text-white bg-[#202020] rounded-r-md">
                                        <button type="submit">
                                            <FiSend size={20} />
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
