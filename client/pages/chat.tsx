import { useEffect, useState, useRef } from "react";
import Layout from "../src/components/Layout";
import { useChat } from "../src/context/ChatContext";
import { useUser } from "../src/context/UserContext";
import Protected from "../src/hoc/Protected";
import { AllConversation } from "../src/types/AllConversation";
import { Conversation } from "../src/types/Conversation";
import { FiEdit, FiSend, FiArrowLeft, FiInfo } from "react-icons/fi";
import ModaleUser from "../src/components/Chat/ModaleUser";
import ProfilPic from "../src/components/Profils/ProfilPic";
import Router, { useRouter } from "next/router";
import { Message } from "../src/types/Message";
import { AllMessage } from "../src/types/AllMessages";
import { HTTPRequest } from "../src/api/feathers-config";

const s3uri = "https://ufood-dev.s3.amazonaws.com/";

const ChatPage = () => {
    const { userData } = useUser();
    const { getAllConversation, createConversation, sendMessage, setUnReadMessage, unReadMessage, setMessageList, messageList } = useChat();
    const [convList, setConvList] = useState<AllConversation | any>([]);
    const [modalSelectUser, setModalSelectUser] = useState(false);
    const [selectedConv, setSelectedConv] = useState<Conversation>();
    const [message, setMessage] = useState<string>("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const closeModal = () => {
        setModalSelectUser(false);
    };

    const createNewConv = async (receiver_id: string) => {
        const res = await createConversation(receiver_id);
        setSelectedConv(res);
    }

    const checkNewConv = async (receiver_id: string) => {
        const dateObj = convList.data.find((obj: Conversation) => obj.receiver_id === receiver_id);
        if (dateObj) {
            setSelectedConv(dateObj);
            setModalSelectUser(false);
        } else {
            await createNewConv(receiver_id);
            setModalSelectUser(false);
        }
        getConvList();
    };

    const getConvList = async () => {
        const res = await getAllConversation(userData.id);

        setConvList(res);
    }

    const handleMessageChange = (event: any) => {
        setMessage(event.target.value);
    }

    const sendMessageToUser = async () => {
        if (selectedConv) {
            if (message !== "") {
                sendMessage(selectedConv?.id!, message);
                setMessage("");
            }
        }
    }

    const getListOfMessage = async (conv: Conversation) => {
        const pageNumber = 1;
        const pageSize = 1000;
        console.log("id", conv.id);

        const res = await HTTPRequest('find', 'messages', {
            query: {
                conversation_id: conv.id,
                $sort: { createdAt: 1 },
                $skip: (pageNumber - 1) * pageSize, // détermine le nombre d'éléments à sauter pour arriver à la page demandée
                $limit: pageSize // spécifie la taille de chaque page
            }
        });
        console.log("data", res);
        setMessageList(res.data);
    }

    function changeSelectedConv(element: Conversation) {
        setSelectedConv(element)
        getListOfMessage(element);
    }

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messageList]);

    useEffect(() => {
        setUnReadMessage(0);
        getConvList();
    }, [])

    return (
        <Layout>
            <div className="pl-0 md:pl-2">
                <div className="w-full h-[70px] flex flex-row">
                    <div className={`${selectedConv ? "hidden lg:flex" : "w-full"} relative lg:w-[250px] flex h-full text-white flex-row border-r-[1px] border-b-[1px] border-[#202020]`}>
                        <div className="w-full flex h-full justify-center items-center">
                            <h3 className="text-lg font-medium">Conversations</h3>
                        </div>
                        <div className="right-0 absolute lg:w-[50px] w-[70px] h-full flex justify-center items-center cursor-pointer">
                            <button onClick={() => setModalSelectUser(true)}><FiEdit /></button>
                        </div>
                    </div>
                    <div className={`${selectedConv ? "w-full" : "hidden"} lg:w-[calc(100%-250px)] flex h-full border-b-[1px] border-[#202020] flex-row`}>
                        <div className="w-[70px] h-[70px] flex lg:hidden justify-center items-center text-white cursor-pointer" onClick={() => { setSelectedConv(undefined); setMessageList(undefined) }}>
                            <FiArrowLeft size={25} />
                        </div>
                        {selectedConv && <div className="w-full h-full flex flew-row items-center cursor-pointer hover:bg-[#171717]" onClick={() => Router.push("/user/" + `${selectedConv?.receiver_id !== userData?.id ? selectedConv?.receiver_id : selectedConv?.creator_id}`)}>
                            <div className="ml-0 lg:ml-4 w-[30px] h-[30px] flex justify-center items-center">
                                {selectedConv?.receiver_id === userData.id ?
                                    <ProfilPic url_photo={selectedConv?.creator.image?.url ? { url: s3uri + selectedConv?.creator.image.url } : ""} />
                                    :
                                    <ProfilPic url_photo={selectedConv?.receiver.image?.url ? { url: s3uri + selectedConv?.receiver.image.url } : ""} />
                                }
                            </div>
                            <div className="w-full ml-3 flex justify-between items-center h-[50px]">
                                {selectedConv?.receiver_id === userData.id ?
                                    <p className="text-white">{selectedConv?.creator?.username}</p>
                                    :
                                    <p className="text-white">{selectedConv?.receiver?.username}</p>
                                }
                                <div className="w-[70px] h-[70px] flex justify-center items-center text-white cursor-pointer">
                                    <FiInfo size={18} />
                                </div>
                            </div>
                        </div>}
                    </div>
                </div>
                <div className="h-[calc(100vh-140px)] flex flex-row">
                    <div className="hidden lg:block w-[250px] h-full overflow-y-scroll border-r-[1px] border-[#202020]">
                        {convList?.total > 0 && convList?.data?.map((element: Conversation, index: string) =>
                            <div key={index}>
                                <div className="flex h-[70px] flex-row cursor-pointer items-center pl-3 hover:bg-[#171717]" onClick={() => changeSelectedConv(element)}>
                                    <div className="w-[50px] h-[50px] flex justify-center items-center">
                                        {element.receiver_id === userData.id ?
                                            <ProfilPic url_photo={element.creator.image?.url ? { url: s3uri + element.creator.image.url } : ""} />
                                            :
                                            <ProfilPic url_photo={element.receiver.image?.url ? { url: s3uri + element.receiver.image.url } : ""} />
                                        }
                                    </div>
                                    <div className="ml-3 flex justify-start items-center h-[50px]">
                                        {element.receiver_id === userData.id ?
                                            <p className="text-white">{element.creator?.username}</p>
                                            :
                                            <p className="text-white">{element.receiver?.username}</p>
                                        }
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    {selectedConv ? <div className="w-full h-full lg:w-[calc(100%-250px)] flex flex-col relative bg-[#121212]">
                        <div className="w-full h-[calc(100%-60px)] overflow-y-scroll pb-6">
                            {messageList?.map((element: Message, index: number) =>
                                <div key={index}>
                                    <div className={`w-full text-[#303030] flex ${element.sender_id === userData.id ? "justify-end" : "justify-start"}`}>
                                        <div className={`
                                            ${messageList[index - 1]?.sender_id !== element.sender_id ? "mt-7" : "mt-1"}
                                            flex flex-row items-end mx-2`}>
                                            {element.sender_id !== userData.id && <div className="w-[40px] h-[40px] flex justify-center items-center">
                                                <div className={`${messageList[index + 1]?.sender_id === element.sender_id ? "hidden" : "block"} w-[30px] h-[30px]`}>
                                                    {selectedConv?.receiver_id === userData.id ?
                                                        <ProfilPic url_photo={selectedConv?.creator.image?.url ? { url: s3uri + selectedConv?.creator.image.url } : ""} />
                                                        :
                                                        <ProfilPic url_photo={selectedConv?.receiver.image?.url ? { url: s3uri + selectedConv?.receiver.image.url } : ""} />
                                                    }
                                                </div>
                                            </div>}
                                            <div>
                                                <p className={`
                                                    ${messageList[index - 1]?.sender_id === element.sender_id && element.sender_id !== userData.id ? " rounded-tl-none" : " rounded-tl-[20px]"}
                                                    ${messageList[index - 1]?.sender_id === element.sender_id && element.sender_id === userData.id ? " rounded-tr-none" : " rounded-tr-[20px]"}
                                                    ${messageList[index + 1]?.sender_id === element.sender_id && element.sender_id !== userData.id ? " rounded-bl-none" : " rounded-bl-[20px]"}
                                                    ${messageList[index + 1]?.sender_id === element.sender_id && element.sender_id === userData.id ? " rounded-br-none" : " rounded-br-[20px]"}
                                                    ml-2 px-3 py-2 rounded-[20px] text-white max-w-[250px] break-words ${element.sender_id === userData.id ? "bg-[#E22D2D]" : "bg-[#232323]"}`}>
                                                    {element.text}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                        <form
                            className="absolute bottom-0 bg-[#121212] w-full h-[60px] flex flex-row items-center pl-2 border-t-[1px] border-[#202020]"
                            onSubmit={(event) => {
                                event.preventDefault();
                                if (selectedConv?.id && message.length < 251) sendMessageToUser();
                            }}
                        >
                            <input
                                className=" rounded-l-md decoration-transparent focus:outline-none px-[10px] py-[2px] h-[40px] w-full bg-[#202020] border-none text-white"
                                required={true}
                                onChange={handleMessageChange}
                                placeholder="Your message..."
                                value={message}
                            />
                            <div className="h-[40px] pl-2 bg-[#202020] flex items-end py-1 text-[10px] text-white">
                                <p className={`${message.length > 250 ? "text-red-500" : "text-white"}`}>{message.length}</p>
                            </div>
                            <div className="w-[50px] mr-2 h-[40px] flex justify-center items-center cursor-pointer text-white bg-[#202020] rounded-r-md">
                                <button type="submit">
                                    <FiSend size={20} />
                                </button>
                            </div>
                        </form>
                    </div> :
                        <div className="h-full w-full lg:w-[calc(100%-250px)] lg:flex flex-row justify-center items-center text-white">
                            <div className="hidden lg:flex flex-row items-center">
                                <FiArrowLeft size={20} />
                                <p className="font-bold ml-3">Select conversation</p>
                            </div>
                            <div className="flex lg:hidden w-full h-full flex-col">
                                {convList?.total > 0 && convList?.data?.map((element: Conversation, index: string) =>
                                    <div key={index}>
                                        <div className="flex h-[70px] flex-row cursor-pointer items-center pl-3 hover:bg-[#171717]" onClick={() => changeSelectedConv(element)}>
                                            <div className="w-[50px] h-[50px] flex justify-center items-center">
                                                {element.receiver_id === userData.id ?
                                                    <ProfilPic url_photo={element.creator.image?.url ? { url: s3uri + element.creator.image.url } : ""} />
                                                    :
                                                    <ProfilPic url_photo={element.receiver.image?.url ? { url: s3uri + element.receiver.image.url } : ""} />
                                                }
                                            </div>
                                            <div className="ml-3 flex justify-start items-center h-[50px]">
                                                {element.receiver_id === userData.id ?
                                                    <p className="text-white">{element.creator?.username}</p>
                                                    :
                                                    <p className="text-white">{element.receiver?.username}</p>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>}
                </div>
            </div>
            <ModaleUser
                isOpen={modalSelectUser}
                closeModal={closeModal}
                createNewConv={checkNewConv}
            />
        </Layout>
    )
};

export default Protected(ChatPage);
