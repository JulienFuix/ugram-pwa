import { useState, useEffect } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import Router from "next/router";
import { HTTPRequest } from "../api/feathers-config";
import { User } from "../types/User";
import { Post } from "../types/Post";
import { useAuth } from "../context/AuthContext";

export interface SearchOject {
  total: number;
  limit: number;
  skip: number;
  data: [];
}

export default function Search() {
  const [value, setValue] = useState("");
  const [tempData, setTempData] = useState<Array<User> | any>([]);
  const { isAuthenticated } = useAuth();

  const onSearch = (searchTerm: string) => {
    setValue(searchTerm);
  };

  const GetSearch = async (value: string) => {
    try {
      let res = await HTTPRequest("find", "search", {
        query: {
          $title: value,
        },
      });
      setTempData(res);
    } catch (e: any) {
      console.log("error", e);
    }
  };

  useEffect(() => {
    if (isAuthenticated != false)
      GetSearch(value);
  }, [value]);

  return (
    <div className="flex flex-col">
        <div className="h-[70px] md:flex justify-center items-center">
            <div className="flex flex-col rounded-full bg-[#0b0b0b]">
                <div className="justify-center items-center rounded-full">
                    <div className="relative rounded-full">
                        <div className="flex flex-row h-12 pl-4  justify-around content-center">
                        <div onClick={() => onSearch(value)}>
                            <AiOutlineSearch
                            size={12}
                            color="white"
                            className="justify-center align-center content-center h-12 w-12 pr-4 cursor-pointer"
                            onClick={() => [setValue(""), Router.push("search")]}
                            />
                        </div>
                        <input
                            type="text"
                            className="px-2 outline-none bg-[#0b0b0b] text-white w-[90%] rounded-full"
                            placeholder="Search anything..."
                            color="white"
                            value={value}
                            onChange={(event) => setValue(event.target.value)}
                        />
                        </div>
                    </div>
                </div>
            </div>
        </div>
      {value != "" &&
      (tempData?.users?.data?.length > 0 ||
        tempData?.publicationsDescription?.data?.length > 0) ? (
        <ul className="p-2 border-t-[1px] border-t-[#252525]">
          {tempData?.users?.data?.map((suggestion: User) => {
            return (
              <li
                key={suggestion.id}
                className="ml-3 cursor-pointer p-2 text-white flex flex-row"
                onClick={() => {
                  setValue("");
                  Router.push("/user/" + `${suggestion?.id}`);
                }}
              >
                {suggestion.username}
              </li>
            );
          })}
          {tempData?.publicationsDescription?.data?.map((suggestion: Post) => {
            return (
              <li
                key={suggestion.id}
                className="cursor-pointer p-2 text-white flex flex-row"
                onClick={() => {
                  setValue("");
                  Router.push("/post/" + `${suggestion?.id}`);
                }}
              >
                {suggestion.description}
              </li>
            );
          })}
        </ul>
      ) : (
        value && (
          <ul className="p-2 border-t-[1px] border-t-[#252525]">
            <li className="cursor-pointer p-2 text-white flex flex-row">
              No result found for "{value}"
            </li>
          </ul>
        )
      )}
    </div>
  );
}
