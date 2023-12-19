import React, { useState } from "react";
import Search from "./Search";
import { FiSend } from "react-icons/fi";
import { useRouter } from "next/router";
import { AiOutlineSearch } from "react-icons/ai";
import { FiX } from "react-icons/fi";
import NotifsIconCount from "./Notifs/NotifsIconCount";
import { useUser } from "../context/UserContext";
import { useChat } from "../context/ChatContext";

export default function TopBar(props: { setOpen: any; open: boolean }) {
  const router = useRouter();
  const { nbNotifs } = useUser();
  const { unReadMessage } = useChat();
  const [displaySearchBar, setDisplaySearchBar] = useState(false);
  const [modalNotif, setModalNotifs] = useState(false);

  function changeSearchBarState() {
    if (displaySearchBar === false) {
      setDisplaySearchBar(true);
    } else {
      setDisplaySearchBar(false);
    }
  }

  const closeModal = async () => {
    setModalNotifs(false);
  };

  const navigate = (path: string) => {
    router.push(path);
  };

  return (
    <nav className="fixed top-0 w-full bg-[#161616] h-[70px] md:h-[70px]">
      <div className="flex items-start justify-between h-auto min-h-full px-5">
        <div className="w-[30px] h-[70px] flex justify-center items-center">
          {!displaySearchBar && (
            <AiOutlineSearch
              className="block md:hidden cursor-pointer text-white"
              size={30}
              onClick={() => changeSearchBarState()}
            />
          )}
          {displaySearchBar && (
            <FiX
              className="block md:hidden cursor-pointer text-white"
              size={30}
              onClick={() => changeSearchBarState()}
            />
          )}
        </div>
        <div
          className="flex md:hidden h-[70px] justify-center items-center"
          onClick={() => navigate("/")}
        >
          <img src="/Ugram-Logo-RougeBlanc.svg" className="w-[100px]" />
        </div>
        <div className="h-auto min-h-[70px] bg-[#161616] px-5 hidden md:flex justify-start">
          <div className="w-full">
            <Search />
          </div>
        </div>
        <div className="flex flex-row w-32 justify-around">
          <div className="w-[30px] h-[70px] flex justify-center items-center">
            <NotifsIconCount count={nbNotifs} />
          </div>
          <div className="w-[30px] h-[70px] flex justify-center items-center relative">
            <FiSend className="cursor-pointer text-white" size={25} onClick={() => navigate("/chat")} />
            {unReadMessage > 0 && (
                <div className="absolute bottom-2.5 left-4 px-1.5 py-0.5 bg-red-500 text-white rounded-full text-xs">
                {unReadMessage}
            </div>
            )}
          </div>
        </div>
      </div>
      {displaySearchBar && (
        <div className="h-auto min-h-[70px] bg-[#161616] px-5 flex md:hidden items-center">
          <div className="w-full">
            <Search />
          </div>
        </div>
      )}
    </nav>
  );
}
