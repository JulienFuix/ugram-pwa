import React, { useEffect, useState } from "react";
import { HTTPRequest } from "../../api/feathers-config";
import { useAuth } from "../../context/AuthContext";
import SuggestUserComponent from "./SuggestUserComponent";

interface User {
  id: number;
  username: string;
  name: string;
  image: string;
}

export default function SuggestUser(props: {
  showSuggestions: boolean;
  id: string;
}) {
  const [data, setData] = useState([]);
  const { isAuthenticated } = useAuth();

  const getAllFamousUser = async (id: string) => {
    try {
      const res = await HTTPRequest("find", "get-famous-user", {
        query: {
          new_follower_id: id,
        },
      });
      setData(res);
    } catch (e: any) {
      console.log("error", e);
    }
  };

  useEffect(() => {
    if (props?.id) {
      if (isAuthenticated != false)
        getAllFamousUser(props?.id);
    }
  }, [props?.id]);

  return (
    <div className="relative">
      {props?.showSuggestions && (
        <div className="flex flex-row bg-white rounded max-w-full overflow-x-auto">
          {data.map((user: User, index) => (
            <SuggestUserComponent userDataProps={user} />
          ))}
        </div>
      )}
    </div>
  );
}
