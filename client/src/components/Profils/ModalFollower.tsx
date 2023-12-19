import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { User } from "../../types/User";
import { AiOutlineClose } from "react-icons/ai";
import { ModalUserList } from "./ModalUserList";

type ModalProps = {
  isOpen: boolean;
  closeModal: () => void;
  data: Array<User>;
  title: String;
  getFollower: (id: string) => any;
};

function Modal({ isOpen, closeModal, data, title, getFollower }: ModalProps) {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={closeModal}
      >
        <div className="min-h-screen px-4 text-center">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-60" />
          <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-medium text-black">{title}</h3>
              <button
                className="text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700"
                onClick={closeModal}
              >
                <AiOutlineClose size={24} />
              </button>
            </div>
            <div className="mt-4">
              {data.length > 0 &&
                data?.map((element: User, index: number) => (
                  <ModalUserList
                    user={element}
                    key={index}
                    getFollower={getFollower}
                    closeModal={closeModal}
                  />
                ))}
              {data.length <= 0 && (
                <p className="text-center text-black text-bold">No {title}</p>
              )}
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default Modal;
