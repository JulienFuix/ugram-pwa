import React, { useState, useEffect } from "react";
import { FaRegBell } from "react-icons/fa";
import ModalNotifs from "./ModalNotifs";
import { useUser } from "../../context/UserContext";

export default function NotifsIconCount() {
  const [modalNotif, setModalNotif] = useState(false);
  const { notifications } = useUser();
  const [nbUnReadNotifs, setNbUnReadNotifs] = useState(0);

  const closeModal = async () => {
    setModalNotif(false);
  };

    function setNbUnReadNotifsFunc() {
        let count = 0;
        notifications?.map((notif) => {
        if (notif?.viewed === false) {
            count++;
        }
        });
        setNbUnReadNotifs(count);
    }

    useEffect(() => {
            setNbUnReadNotifsFunc();
    }, []);

    useEffect(() => {
        setNbUnReadNotifsFunc();
    }, [notifications]);

  return (
    <div className="relative inline-block">
      <FaRegBell
        className="cursor-pointer text-white"
        size={25}
        onClick={() => setModalNotif(true)}
      />
      {nbUnReadNotifs > 0 && (
        <div className="absolute bottom-2.5 left-4 px-1.5 py-0.5 bg-red-500 text-white rounded-full text-xs">
          {nbUnReadNotifs}
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
