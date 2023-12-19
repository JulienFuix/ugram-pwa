import React, { useEffect, Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { User } from "../../types/User";
import { FiX } from "react-icons/fi";
import { ModalUserList } from "../Profils/ModalUserList";
import { useUser } from "../../context/UserContext";
import ProfilPic from "../Profils/ProfilPic";
import { useChat } from "../../context/ChatContext";
import { AllConversation } from "../../types/AllConversation";

type ModalProps = {
    isOpen: boolean;
    closeModal: () => void;
    createNewConv: (receiver_id: string) => void;
};

function ModaleUser({ isOpen, closeModal, createNewConv }: ModalProps) {
    const { GetAllUsers, userData } = useUser();
    const { createConversation } = useChat();
    const [allUsers, setAllUsers] = useState<Array<User> | any>([]);

    const AllUserList = async () => {
        let res = await GetAllUsers();
        setAllUsers(res?.data);
    };

    useEffect(() => {
        userData.id;
        AllUserList();
    }, []);

    return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog
                as="div"
                className="fixed inset-0 z-10 overflow-y-auto"
                onClose={closeModal}
            >
                <div className="min-h-screen px-4 flex justify-center items-center">
                    <Dialog.Overlay className="fixed inset-0 bg-black opacity-60" />
                    <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden bg-[#121212] text-left align-middle transition-all transform shadow-xl rounded-2xl">
                        <div className="flex justify-between items-center">
                            <h3 className="text-2xl font-medium text-white">Nouveau message</h3>
                            <button onClick={closeModal} >
                                <FiX className="text-white" color="white" size={35} />
                            </button>
                        </div>
                        <div className="w-full h-[400px] overflow-scroll mt-8">
                            {allUsers?.length > 0 ? (
                                allUsers?.map((user: User, index: any) =>
                                    <div key={index}>
                                        {userData.id !== user.id && <div className="flex flex-row mt-3 cursor-pointer" onClick={() => createNewConv(user.id)}>
                                            <div className="w-[50px] h-[50px] flex justify-center items-center">
                                                <ProfilPic url_photo={user.image}/>
                                            </div>
                                            <div className="ml-3 flex justify-start items-center h-[50px]">
                                                <p className="text-white">{user.username}</p>
                                            </div>
                                        </div>}
                                    </div>
                                )
                            ) : (
                                <p>No users</p>
                            )}
                        </div>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}

export default ModaleUser;
