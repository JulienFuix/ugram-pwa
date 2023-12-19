import { url } from "inspector";
import { useEffect, useState } from "react";
import { CgProfile } from "react-icons/cg";

export default function ProfilPic(props: { url_photo: any }) {
    if (props?.url_photo) {
        return (
            <img
                src={props?.url_photo?.url}
                className="rounded-full align-center w-full h-full object-cover"
            />
        );
    } else {
        return (
            <CgProfile className="rounded-full w-full h-full text-[#9c9c9c] align-center border-none" size={60}/>
        );
    }
}
