import React, { useState } from "react";
import { FaRegBell } from "react-icons/fa";
import ModalNotifs from "./ModalNotifs";

export default function NotifsIconCount(props: { count: number }) {
  const [modalNotif, setModalNotif] = useState(false);

  const closeModal = async () => {
    setModalNotif(false);
  };

  return (
    <div className="relative inline-block">
      <FaRegBell
        className="cursor-pointer text-white"
        size={25}
        onClick={() => setModalNotif(true)}
      />
      {props?.count > 0 && (
        <div className="absolute bottom-2.5 left-4 px-1.5 py-0.5 bg-red-500 text-white rounded-full text-xs">
          {props?.count}
        </div>
      )}
      <ModalNotifs
        isOpen={modalNotif}
        closeModal={closeModal}
        title={"Notifications"}
      />
    </div>
  );
}
