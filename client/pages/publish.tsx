import React, { useEffect, useState } from "react";
import Layout from "../src/components/Layout";
import Protected from "../src/hoc/Protected";
import { useDropzone } from "react-dropzone";
``;
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import {
  AiOutlineReload,
  AiOutlineCloudUpload,
  AiOutlineArrowLeft,
} from "react-icons/ai";
import { usePublication } from "../src/context/PublicationContext";
import { useRouter } from "next/router";
import { MentionsInput, Mention } from "react-mentions";
import { HTTPRequest } from "../src/api/feathers-config";
import { AllFollowObject } from "../src/types/AllFollowObject";

const Publish = () => {
  const router = useRouter();
  const [updateState, setUpdateState] = useState("before");
  const [publishIsLoading, setPublishIsLoading] = useState(true);
  const { createPublications, isLoading } = usePublication();
  const [valueDescription, setvalueDescription] = useState("");
  const [hashtags, setHashtags] = useState<Array<string>>([]);
  const [displayUpload, setDisplayUpload] = useState(true);
  const [files, setFiles] = useState<Array<File & { preview: string }>>([]);
  const [allUser, setAllUser] = useState<AllFollowObject | any>([]);
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
    },
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });

  const FindAllUser = async () => {
    try {
      let res = await HTTPRequest("find", "users");
      setAllUser(res?.data);
    } catch (e: any) {
      console.log("error", e);
    }
  };

  const sliders = files.map((file: any) => (
    <div className="w-[300px] h-[300px] lg:w-[500px] lg:h-[500px] flex justify-center items-center">
      <img
        src={file.preview}
        onLoad={() => {
          URL.revokeObjectURL(file.preview);
        }}
      />
    </div>
  ));

  const handleDescription = (value: any) => {
    setvalueDescription(value.target.value);
  };

  function createHashtagsArray() {
    const array = valueDescription.split(" ");
    let newArray: string[] = [];

    array.map((element: string) => {
      if (element[0] === "#") {
        newArray.push(element);
      }
    });
    setHashtags(newArray);
    setPublishIsLoading(false);
  }

  const renderUserSuggestion = (
    suggestion: any,
    search: any,
    highlightedDisplay: any
  ) => {
    return (
      <div className="px-2 py-1 hover:bg-gray-100 text-black">
        {highlightedDisplay}
      </div>
    );
  };

  const UserListFunc = async (query: any, callback: any) => {
    callback(allUser?.map((u: any) => ({ id: u.id, display: u.username })));
  };

  useEffect(() => {
    FindAllUser();
  }, []);

  const createPub = async () => {
    createHashtagsArray();
    let res = await createPublications(valueDescription, files, hashtags);
  };

  useEffect(() => {
    if (updateState === "after") {
      const timer = setTimeout(() => {
        router.push("/");
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [updateState]);

  useEffect(() => {
    if (isLoading === true && updateState === "before")
      setUpdateState("loading");
    else if (isLoading === false && updateState === "loading")
      setUpdateState("after");
    else setUpdateState("before");
  }, [isLoading]);

  useEffect(() => {
    if (publishIsLoading === false) createPub();
  }, [publishIsLoading]);

  useEffect(() => {
    return () =>
      files.forEach((file: any) => URL.revokeObjectURL(file.preview));
  }, []);

  return (
    <Layout>
      <div className="flex h-calc(100vh-70px) justify-center items-center flex-col">
        {displayUpload && (
          <div className="w-[300px] lg:w-[500px]">
            <div className="w-[300px] lg:w-[500px] h-[70px] flex items-center justify-between">
              <button
                onClick={() => router.push("/")}
                className="py-[5px] flex flex-row items-center bg-[#0b0b0b] rounded-md px-3 text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => setFiles([])}
                className="py-[5px] flex flex-row items-center bg-[#0b0b0b] rounded-md px-3 text-white"
              >
                <AiOutlineReload
                  className="mr-3 text-white"
                  color="white"
                  size={15}
                />{" "}
                Re-Take
              </button>
            </div>
            <div className="w-[300px] h-[300px] lg:w-[500px] lg:h-[500px] bg-[#0b0b0b] rounded-lg cursor-pointer">
              {files.length < 1 && (
                <div className="w-full h-full justify-center items-center flex">
                  <div
                    {...getRootProps({
                      className:
                        "w-[300px] h-[300px] lg:w-[500px] lg:h-[500px] bg-[#0b0b0b] flex justify-center items-center rounded-lg",
                    })}
                  >
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center justify-center">
                      <AiOutlineCloudUpload
                        color={"white"}
                        size={75}
                        className="mb-5"
                      />
                      <div className="flex flex-row">
                        <p className="font-bold mr-2 text-white">
                          Choose a file
                        </p>
                        <p className="bg-red font-light text-white">
                          or drag it here.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {files.length >= 1 && (
                <Carousel className="w-[300px] h-[300px] lg:w-[500px] lg:h-[500px] overflow-y-hidden">
                  {sliders}
                </Carousel>
              )}
            </div>
            <div className="w-[300px] lg:w-[500px] h-[70px] flex items-center justify-center">
              {files.length >= 1 && (
                <button
                  onClick={() => setDisplayUpload(false)}
                  className="py-2 flex flex-row items-center bg-[#0b0b0b] rounded-md px-10 text-white"
                >
                  Next step
                </button>
              )}
              {files.length < 1 && (
                <div className="py-2 flex flex-row items-center bg-[#2d3436] text-[#b2bec3] rounded-md px-10 cursor-not-allowed text-white">
                  Next step
                </div>
              )}
            </div>
            <div className="w-[300px] lg:w-[500px] h-[50px] flex items-center justify-center">
              {files.length < 1 && (
                <p className="text-red-500">Add at least one picture</p>
              )}
            </div>
          </div>
        )}
        {!displayUpload && (
          <div>
            <div className="w-[300px] lg:w-[500px] h-[70px] flex items-center justify-start">
              <button
                onClick={() => router.push("/")}
                className="py-[5px] flex flex-row items-center bg-[#0b0b0b] rounded-md px-3 text-white"
              >
                Cancel
              </button>
            </div>
            <div className="mt-5">
              <p className="text-xl text-white">Description</p>
              <MentionsInput
                value={valueDescription}
                onChange={handleDescription}
                placeholder="Type a message..."
                allowSpaceInQuery={true}
                className="border-none mt-3 w-[300px] lg:w-[500px] h-[200px] rounded-lg bg-[#0b0b0b] text-white"
              >
                <Mention
                  trigger="@"
                  data={UserListFunc}
                  markup="[@__display__](__id__)"
                  displayTransform={(id, display) => `@${display}`}
                  renderSuggestion={renderUserSuggestion}
                />
              </MentionsInput>
            </div>
            <div className="mt-5 w-[300px] lg:w-[500px] h-[70px] flex items-center justify-center">
              <button
                onClick={() => createHashtagsArray()}
                className="flex flex-row justify-center items-center bg-[#0b0b0b] rounded-md w-[130px] h-[40px]"
              >
                {updateState === "before" && (
                  <p className="text-white">Upload</p>
                )}
                {updateState === "loading" && (
                  <svg
                    className="animate-spin h-6 w-6 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25 text-white"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                )}
                {updateState === "after" && (
                  <p className="text-white">Success</p>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Protected(Publish);
