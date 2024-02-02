import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FiHome, FiLogOut, FiPlusSquare, FiSettings, FiUsers } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useUser } from "../context/UserContext";
import { User } from "../types/User";
import ProfilNavBar from "./ProfilNavBar";
import ProfilPic from './Profils/ProfilPic';

export default function NavBar(props: { open: boolean }) {
  const { logout } = useAuth();
  const Router = useRouter();
  const {
    userData,
  } = useUser();

  const logOut = async () => {
    await logout();
  };

  const navigate = (path: string) => {
    Router.push(path);
  };

  return (
    <div>
      {/* Computer NavBar */}
      <aside className="fixed z-0 top-0 left-0 w-72 h-screen transition-transform -translate-x-full  md:translate-x-0 bg-[#242424]">
        <div className="h-screen px-3 pt-2 overflow-y-auto bg-[#161616] flex flex-col justify-between">
          <div>
            <div className="flex flex-row my-[10px] items-center p-5 rounded-lg">
                <img src="/Ugram-Logo-RougeBlanc.svg" className="w-[300px]" />
            </div>
            <div>
              <ProfilNavBar />
            </div>
            <div className="flex flex-col justify-between h-3/5">
              <div className="w-full px-2 flex flex-col space-y-2">
                <motion.div
                  className={`group w-full flex flex-row space-x-5 rounded-md cursor-pointer hover:bg-[#101010] px-3 py-2 ${Router.pathname == "/" ? "text-white font-bold" : "text-white"
                    }`}
                  onClick={() => navigate("/")}
                >
                  <FiHome size={25} />
                  <p className="font-roboto self-center">Home</p>
                </motion.div>
                {/* <motion.div
                  className={`group w-full flex flex-row space-x-5 rounded-xl cursor-pointer hover:bg-[#7a797d] px-3 py-2 ${Router.pathname == "/explore"
                      ? "text-white font-bold"
                      : "text-white"
                    }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => navigate("/explore")}
                >
                  <TfiWorld size={25} />
                  <p className="font-roboto self-center">Explore</p>
                </motion.div> */}
                <motion.div
                  className={`group w-full flex flex-row space-x-5 rounded-md cursor-pointer hover:bg-[#101010] px-3 py-2 ${Router.pathname == "/publish"
                      ? "text-white font-bold"
                      : "text-white"
                    }`}
                  onClick={() => navigate("/publish")}
                >
                  <FiPlusSquare size={25} />
                  <p className="font-roboto self-center">Create</p>
                </motion.div>
                <motion.div
                  className={`group w-full flex flex-row space-x-5 rounded-md cursor-pointer hover:bg-[#101010] px-3 py-2 ${Router.pathname == "/settings"
                      ? "text-white font-bold"
                      : "text-white"
                    }`}
                  onClick={() => navigate("/settings")}
                >
                  <FiSettings size={25} />
                  <p className="font-roboto self-center">Settings</p>
                </motion.div>
                <motion.div
                  className={`group w-full flex flex-row space-x-5 rounded-md cursor-pointer hover:bg-[#101010] px-3 py-2 ${Router.pathname == "/userslist"
                      ? "text-white font-bold"
                      : "text-white"
                    }`}
                  onClick={() => navigate("/userslist")}
                >
                  <FiUsers size={25} />
                  <p className="font-roboto self-center">User list</p>
                </motion.div>
              </div>
            </div>
          </div>
          <div className="flex justify-center py-3 border-t-[1px] border-t-[#404040] mt-10">
            <div onClick={() => logOut()} className="group w-full flex flex-row space-x-5 rounded-md cursor-pointer hover:bg-[#101010] px-3 py-2">
              <FiLogOut size={25} color="white" />
              <p className="font-roboto self-center text-white">Logout</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile NavBar */}
      <div className="custom-navbar h-[60px] w-full bottom-0 fixed bg-[#161616] flex justify-center">
        <div className="w-1/5 h-full flex justify-center items-center cursor-pointer">
          <FiHome className={`${Router.pathname == "/" ? "text-white" : "text-[#2F2F2F]"}`} size={25} onClick={() => navigate("/")} />
        </div>
        <div className="w-1/5 h-full flex justify-center items-center cursor-pointer">
          <FiUsers className={`${Router.pathname == "/userslist" ? "text-white" : "text-[#2F2F2F]"}`} size={25} onClick={() => navigate("/userslist")} />
        </div>
        <div className="w-1/5 h-full flex justify-center items-center cursor-pointer">
          <FiPlusSquare className={`${Router.pathname == "/publish" ? "text-white" : "text-[#2F2F2F]"}`} size={35} onClick={() => navigate("/publish")} />
        </div>
        <div className="w-1/5 h-full flex justify-center items-center cursor-pointer">
          <FiSettings className={`${Router.pathname == "/settings" ? "text-white" : "text-[#2F2F2F]"}`} size={25} onClick={() => navigate("/settings")} />
        </div>
        <div className="w-1/5 h-full flex justify-center items-center cursor-pointer" onClick={() => Router.push("/profile")}>
            <div className="w-[30px] h-[30px] flex justify-center items-center">
                <ProfilPic url_photo={userData?.image}/>
            </div>
        </div>
      </div>
    </div>
  );
}