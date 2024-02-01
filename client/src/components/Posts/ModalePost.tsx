import React, { useState, useEffect, useRef } from "react";
import { FiX } from "react-icons/fi";
import { AiFillDelete } from "react-icons/ai";
import ProfilPic from "../Profils/ProfilPic";
import { CgProfile } from "react-icons/cg";
import { Mention, MentionsInput } from "react-mentions";
import { AllFollowObject } from "../../types/AllFollowObject";
import { HTTPRequest } from "../../api/feathers-config";
import Router from "next/router";
import ModifyPost from "./ModifyPost";
import { FiSend, FiTrash } from "react-icons/fi";
import { AiOutlineForm } from "react-icons/ai";
import { ModalUserList } from "../Profils/ModalUserList";
import { usePublication } from "../../context/PublicationContext";
import { useUser } from "../../context/UserContext";
import UserLink from "./UserLink";
import { get } from "http";

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
    createdAt: Date;
    // add any other properties here
}


export default function ModalePost(props: ModaleProps) {
    const [allUser, setAllUser] = useState<AllFollowObject | any>([]);
    const { createComments, getComments, removeComment, AllComments } = usePublication();
    const { FindUserById } = useUser();
    const [allComments, setallComments] = useState<Comment[]>([]);
    const [isDelete, setIsDelete] = useState(false);
    const { userData } = useUser();
    const [comment, setComment] = useState<string>("");
    const commentEndRef = useRef<HTMLDivElement>(null);

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

    // const handleClickAddComment = async () => {
    //     var inputElement = document.getElementById("content-comment") as HTMLInputElement;
    //     if (inputElement.value != "") {
    //         var inputValue = inputElement.value;
    //         let res = await createComments(props.postData.id, inputValue);
    //         setIsDelete(!isDelete);
    //         inputElement.value = "";
    //     }
    // };

    const deleteComment = async (id: string) => {
        let res = await removeComment(id);
        setIsDelete(!isDelete);
    };

    const getCommentByPublication = async () => {
        let res = await getComments(props.postData.id);
        setallComments(res.reverse());
    };

    const handleDisplayChange = (newValue: boolean) => {
        setDisplayModalePost(newValue);
        handleCloseClick();
    };

    const sendComment = async () => {
        if (comment && props?.postData?.id) {
            await createComments(props.postData.id, comment);
            setIsDelete(!isDelete);
            setComment("");
            scrollToTop();
        }
    }

    const handleCommentChange = (event: any) => {
        setComment(event.target.value);
    }

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

    const scrollToTop = () => {
        commentEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        FindAllUser();
        getCommentByPublication();
    }, []);

    useEffect(() => {
        scrollToTop();
        // getCommentByPublication();
        setallComments(AllComments.reverse());
    }, [AllComments]);

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
            <div className="pt-6 w-[350px] lg:w-[950px] bg-[#161616] rounded-lg flex flex-col lg:flex-row overflow-y-auto">
                <div className="flex flex-col px-6">
                    <div className="flex items-center justify-center">
                        <img
                            src={props?.postData?.image?.url}
                            alt="..."
                            className="w-[350px] lg:w-[500px] object-scale-down align-middle rounded-md border-none cursor-pointer"
                        />
                    </div>
                    <div className="w-full">
                        <div className="w-full h-[72px]">
                            <UserLink user={props?.user} post={props?.postData} />
                        </div>
                        {props?.postData.description !== "" && (
                            <div className="w-full lg:my-5 pb-3 pt-1 h-auto flex items-center justify-between">
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
                        )}
                    </div>
                </div>
                <div className="w-full lg:w-[450px] flex flex-col justify-between lg:border-none border-t-[1px] border-[#202020]">
                    <div className="px-6 scrollbar-hide w-full max-h-64 lg:max-h-96 overflow-y-scroll">
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
                        className="hidden bg-[#121212] w-full h-[60px] lg:flex flex-row items-center pl-2 border-t-[1px] border-[#202020]"
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
                <form
                    className="lg:hidden bg-[#121212] w-full h-[60px] flex flex-row items-center pl-2 border-t-[1px] border-[#202020]"
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
