import { useRouter } from "next/router";
import React, {
    createContext, useContext,
    useEffect, useState
} from "react";
import app, { HTTPRequest } from "../api/feathers-config";
import { AllMessage } from "../types/AllMessages";
import { Message } from "../types/Message";
import { useUser } from "./UserContext";

interface ChatWrapperInterface {
    children: React.ReactNode;
}

interface ChatContextInterface {
    getAllConversation: (user_id: string) => any;
    createConversation: (receiver_id: string) => any;
    sendMessage: (conversation_id: string, text: string) => any;
    isLoading: boolean;
    unReadMessage: number;
    setUnReadMessage: React.Dispatch<React.SetStateAction<number>>;
    messageList: AllMessage | any;
    setMessageList: React.Dispatch<any>;
}

const ChatContext = createContext({} as ChatContextInterface);

export const ChatWrapper = ({ children }: ChatWrapperInterface) => {
    const { userData } = useUser();
    const [unReadMessage, setUnReadMessage] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [messageList, setMessageList] = useState<Message[]>([]);


    const getAllConversation = async (user_id: string) => {
        try {
            setIsLoading(true);
            let res = await HTTPRequest("find", `conversations`, {

            });
            console.log("conv list", res);
            setIsLoading(false);
            return res;
        } catch (e: any) {
            setIsLoading(false);
            return e.code;
        }
    }

    const createConversation = async (receiver_id: string) => {
        try {
            setIsLoading(true);
            const res = await HTTPRequest("create", "conversations", {
                data: {
                    receiver_id: receiver_id,
                },
            });
            console.log("create conv", res);
            setIsLoading(false);
            return res;
        } catch (e: any) {
            setIsLoading(false);
            return e.code;
        }
    }

    const sendMessage = async (conversation_id: string, text: string) => {
        try {
            setIsLoading(true);
            const res = await HTTPRequest("create", "messages", {
                data: {
                    conversation_id: conversation_id,
                    text: text,
                },
            });
            console.log("send message", res);
            setIsLoading(false);
        } catch (e: any) {
            setIsLoading(false);
            console.log("error send message :",e)
            return e.code;
        }
    }

    function addMessageToConv(message: Message) {
        if (message?.sender_id !== userData?.id) {
            setMessageList((prevMessages: Message[]) => {
                const router = useRouter();

                if (router.pathname !== "/chat") {
                    setUnReadMessage((nb: number) => nb + 1);
                    return prevMessages;
                }
                return prevMessages && prevMessages.length > 0 ? [...prevMessages, message] : [message];
            });
        }
    }

    useEffect(() => {
        app.service('messages').on('created', (message: any) => addMessageToConv(message))
    }, [])

    return (
        <ChatContext.Provider
            value={{
                getAllConversation,
                createConversation,
                sendMessage,
                isLoading,
                setUnReadMessage,
                unReadMessage,
                messageList,
                setMessageList
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export default ChatWrapper;
export function useChat(): ChatContextInterface {
    return useContext(ChatContext);
}
