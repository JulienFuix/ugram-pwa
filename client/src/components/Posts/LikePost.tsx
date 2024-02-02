import React, { useEffect, useState } from "react";
import { AiOutlineHeart } from "react-icons/ai";
import { usePublication } from "../../context/PublicationContext";
import { useUser } from "../../context/UserContext";
import  ModaleLike  from "./ModaleLike";

export default function LikePost(props: { post: any }) {
  const { likesPublication, unlikesPublication } = usePublication();
  const [displayModaleLike, setDisplayModaleLike] = useState(false);
  const [like, setLike] = useState(false);
  const [nblike, setnbLike] = useState(0);
  const { userData } = useUser();

  const handleDisplayChange = (newValue: boolean) => {
    setDisplayModaleLike(newValue);
  };

  useEffect(() => {
    setnbLike(props.post.nbLike);
    setLike(props.post.isLiked);
  }, []);

  const handleClick = async () => {
    try {
      if (like == true) {
        await unlikesPublication(props.post.id);
        setnbLike(nblike - 1)
        setLike(!like);
      } else {
        await likesPublication(props.post.id);
        setnbLike(nblike + 1)
        setLike(!like);
      }
    } catch (e: any) {
      console.log("error", e);
    }
  };

  return (
    <div className="flex">
      <button
        onClick={handleClick}
        className="flex flex-row align-center items-center justify-between max-w-fit"
      >
        <AiOutlineHeart
          className={`${like ? "text-red-500" : "text-white"} mr-1`}
          size={22}
        />
      </button>
      <p className="text-white hover:underline hover:cursor-pointer" onClick={() => setDisplayModaleLike(true)}>{nblike}</p>
      {displayModaleLike && <ModaleLike changeDisplay={handleDisplayChange} postData={props?.post} />}
    </div>
  );
}
