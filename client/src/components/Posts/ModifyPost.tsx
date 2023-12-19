import React, { useState } from "react";
import { FiX } from 'react-icons/fi';
import { usePublication } from '../../context/PublicationContext';

interface ModaleProps {
    changeDisplay: (display: boolean) => void;
    postData: any;
    user: any;
}

export default function ModifyPost(props: ModaleProps) {
    const [valueDescription, setvalueDescription] = useState("");
    const { modifyPost, deletePost } = usePublication();

    const handleCloseClick = () => {
        props.changeDisplay(false);
    };

    const handleDescription = (value: any) => {
        setvalueDescription(value.target.value);
    };

    const modifyDescription = async () => {
        let res = await modifyPost(valueDescription, props.postData.id);
        handleCloseClick();
    }

    const deletePostFunc = async () => {
        let res = await deletePost(props.postData.id);
        handleCloseClick();
    }

    return (
        <div className='w-screen h-screen fixed z-50 top-0 left-0 flex justify-center items-center'>
            <button className="fixed z-51 top-0 right-0 mt-6 mr-6" onClick={() => handleCloseClick()}><FiX className="text-white" color="white" size={35} /></button>
            <div className="w-[350px] lg:w-[950px] bg-[#161616] rounded-lg flex flex-col lg:flex-row overflow-y-auto">
                <div className="flex items-center justify-center">
                    <img
                        src={props?.postData?.image?.url}
                        alt="..."
                        className="w-[350px] h-[350px] lg:w-[500px] lg:h-[500px] object-scale-down align-middle rounded-md border-none cursor-pointer"
                    />
                </div>
                <div className="w-[300px] h-[350px] lg:w-[450px] lg:h-[500px]">
                    <div className="w-full h-[70px] justify-between items-center flex flex-row border-b-[1px] px-4 border-b-[#393737]">
                        <div>
                            <button className="text-white" onClick={() => handleCloseClick()}>Back</button>
                        </div>
                        <div>
                            <p className="text-md text-white">Modify your post</p>
                        </div>
                        <div>
                            <button className="text-white" onClick={() => modifyDescription()}>Update</button>
                        </div>
                    </div>
                    <div className="w-full h-auto flex flex-row">
                        <div className='mt-5 px-4 w-full'>
                            <p className="text-white">Description</p>
                            <textarea className="border-none mt-3 pt-2 w-full h-[200px] pl-3 rounded-lg bg-[#292929] text-white" onChange={handleDescription} placeholder="Description"></textarea>
                        </div>
                    </div>
                    <div className="w-full flex h-[30px] justify-center items-center mt-5">
                        <button className="text-red-500" onClick={() => deletePostFunc()}>Delete post</button>                        
                    </div>
                </div>
            </div>
        </div>
    );
}
