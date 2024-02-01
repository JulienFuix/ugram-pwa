import React, { useEffect, useState } from "react";
import { BsChat } from "react-icons/bs"

export default function CommentPost(props: { post: any }) {
  const [nbcomment, setnbcomment] = useState(0);

  useEffect(() => {
    setnbcomment(props?.post.nbComment);
  }, [props]);

  return (
    <div className="flex text-white flex-row align-center items-center justify-between max-w-fit">
    <BsChat className="mr-1 text-white" size={17}/>
    <p>{nbcomment}</p>
    </div>
  );
}
