import React, { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import Router from "next/router";
import { CgProfile } from "react-icons/cg";
import { usePublication } from "../../context/PublicationContext";
import { useUser } from "../../context/UserContext";

interface ModaleProps {
  changeDisplay: (display: boolean) => void;
  postData: any;
}

interface Likes {
  id: string;
  lover: any;
  // add any other properties here
}

export default function ModaleLike(props: ModaleProps) {

  const { getLikesPublication } = usePublication();
  const [displayModaleLike, setDisplayModaleLike] = useState(false);
  const [allLikes, setallLikes] = useState<Likes[]>([]);
  const { userData, notifications } = useUser();

  const handleCloseClick = () => {
    props.changeDisplay(false);
  };

  useEffect(() => {
    const getLikes = async () => {
      const res = await getLikesPublication(props?.postData?.id);
      setallLikes(res.data);
    }
    getLikes();
  }, []);

  useEffect(() => {
    const getLikes = async () => {
        const res = await getLikesPublication(props?.postData?.id);
        setallLikes(res.data);
      }
      getLikes();
  }, [notifications])

  return (
    <div className="custom-modale-background w-screen h-screen fixed z-50 top-0 left-0 flex justify-center items-center">
      <button
        className="fixed z-51 top-0 right-0 mt-6 mr-6"
        onClick={() => handleCloseClick()}
      >
        <FiX className="text-white" color="white" size={35} />
      </button>
      <div className="w-1/3 h-2/3 min-w-[250px] min-h-[400px] bg-[#161616] text-white rounded-xl overflow-hidden">
        <div className="w-full h-[10%] flex items-center justify-center text-xl font-extrabold">Likes</div>
        <div className="h-[90%] w-full flex items-center justify-center">
            <div className="h-[95%] w-[90%] rounded-xl bg-[#161616] shadow-[inset_0px_0px_43px_6px_rgba(0,0,0,0.87)] overflow-y-scroll">
              {allLikes.map( (likes, index) => (
                <div key={index}>
                  <div className="w-full h-[75px] flex items-center pl-3 border-b-2 border-[#343434] hover:underline cursor-pointer">
                    <div className="w-[50px] h-[50px] rounded-full">
                      {likes?.lover?.image ?<img
                        src={"https://ufood-dev.s3.amazonaws.com/" + likes?.lover?.image?.url}
                        className="rounded-full align-center w-full h-full object-cover"
                      /> : <CgProfile className="rounded-full w-full h-full text-[#9c9c9c] align-center border-none" size={60}/>}
                      {/* <ProfilPic url_photo={userData?.image} /> */}
                    </div>
                    <p onClick={() => {
                      Router.push("/user/" + `${likes?.lover?.id}`);
                    }}
                    className="ml-2">{likes?.lover?.username}
                    </p>
                  </div>
                </div>
              ))}
            </div>
        </div>
      </div>
      {displayModaleLike}
    </div>
  );
}
