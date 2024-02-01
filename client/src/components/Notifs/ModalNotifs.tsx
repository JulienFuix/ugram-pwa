import React, { useEffect } from "react";
import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { AiOutlineClose } from "react-icons/ai";
import NotifsUserComments from "./NotifsUserComments";
import NotifsUserFollow from "./NotifsUserFollow";
import NotifsUserLike from "./NotifsUserLike";
import { useUser } from "../../context/UserContext";
import { Notifications } from "../../types/Notifications";

type ModalProps = {
  isOpen: boolean;
  closeModal: () => void;
  title: String;
};

function ModalNotifs({ isOpen, closeModal, title }: ModalProps) {
  const { notifications, patchNotifications } = useUser();

  function patchAllNotifs() {
    console.log("NOTIFS", notifications);
    notifications?.map((element: Notifications, index: number) => {
        if (element?.viewed === false)
            patchNotifications(element.id);
    });
  }

  useEffect(() => {
    if (isOpen)
        patchAllNotifs();
  }, [isOpen]);

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={closeModal}
      >
        <div className="min-h-screen px-4 text-center">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-60" />
          <div className="inline-block h-2/3 w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-[#161616] shadow-xl rounded-lg">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-medium text-white">{title}</h3>
              <div
                className=" cursor-pointer text-white focus:outline-none focus:text-gray-700"
                onClick={closeModal}
              >
                <AiOutlineClose size={24} />
              </div>
            </div>
            <div className="mt-4 h-[600px] overflow-y-scroll scrollbar-hide">
              {notifications?.length > 0 &&
                notifications?.map((element: Notifications, index: number) => {
                  if (element?.type === "FOLLOW") {
                    return <NotifsUserFollow key={index} notification={element} closeModal={closeModal}/>;
                  }
                  if (element?.type === "LIKE") {
                    return <NotifsUserLike key={index} notification={element} closeModal={closeModal}/>;
                  }
                  if (element?.type === "COMMENT") {
                    return <NotifsUserComments key={index} notification={element} closeModal={closeModal}/>;
                  }
                })}
              {notifications.length <= 0 && (
                <p className="text-center text-black text-bold">
                  No Notifications
                </p>
              )}
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default ModalNotifs;
