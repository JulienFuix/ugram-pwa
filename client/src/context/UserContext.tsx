import axios from "axios";
import { useRouter } from "next/router";
import React, { createContext, useContext, useEffect, useState } from "react";
import app, { HTTPRequest } from "../api/feathers-config";
import { AllPostObject } from "../types/AllPostObject";
import { AllFollowObject } from "../types/AllFollowObject";
import { Follow } from "../types/Follow";
import { FollowObject } from "../types/FollowObject";
import { User } from "../types/User";
import { useAuth } from "./AuthContext";
const url = process.env.NEXT_PUBLIC_API_URL;
import { AllNotifications } from "../types/AllNotifications";
import { Notifications } from "../types/Notifications";

interface UserWrapperInterface {
  children: React.ReactNode;
}
interface UserContextInterface {
  modifyUser: (
    username: string,
    name: string,
    email: string,
    id: string | any,
    files: any,
    phone: string
  ) => any;
  userData: User;
  nbPublication: Number;
  nbFollower: Number;
  nbFollowing: Number;
  GetAllUsers: () => AllFollowObject | any;
  FindUserById: (id: string) => User | any;
  FindAllPostById: (id: string) => AllPostObject | any;
  getFollowForUser: (id: string) => FollowObject | any;
  getFollowingForUser: (id: string) => FollowObject | any;
  PostUnfollowForUser: (id: string) => Follow | any;
  PostFollowForUser: (id: string) => Follow | any;
  GetGoodInfoUser: (currentUser: User) => any;
  post: AllPostObject;
  deleteAccount: (id: any) => any;
  findAllNotifications: () => AllNotifications | any;
  nbNotifs: number;
  notifications: Array<Notifications>;
  patchNotifications: (id: string) => any;
}

const UserContext = createContext({} as UserContextInterface);

export const UserWrapper = ({ children }: UserWrapperInterface) => {
  const router = useRouter();
  const { currentUser, logout, setCurrentUser, setIsLoadingAuth } = useAuth();
  const [err, setErr] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<User | any>(undefined);
  const [nbPublication, setNbPublication] = useState(0);
  const [nbFollower, setNbFollower] = useState(0);
  const [nbFollowing, setNbFollowing] = useState(0);
  const [post, setAllPost] = useState<AllPostObject | any>();
  const [nbNotifs, setNbNotifs] = useState(0);
  const [notifications, setNotifications] = useState<Array<Notifications>>([]);

  const FindUserById = async (id: string) => {
    try {
      let res = await HTTPRequest("get", "users", {
        _id: id,
      });
      if (id === userData?.id) {
        setUserData(res);
      }
      return res;
    } catch (e: any) {
      console.log("error", e);
    }
  };

  const FindAllPostById = async (id: any) => {
    try {
      let res = await HTTPRequest("find", "publications", {
        query: {
          user_id: id,
        },
      });
      if (id === userData?.id) {
        setNbPublication(res?.total);
        setAllPost(res);
      }
      return res;
    } catch (e: any) {
      console.log("error", e);
    }
  };

  const GetAllUsers = async () => {
    try {
      let res = await HTTPRequest("find", "users");
      return res;
    } catch (e: any) {
      console.log("error", e);
    }
  };

  const getFollowForUser = async (id: String) => {
    var config = {
      method: "get",
      url: `${url}/get-followed-users?user_id=${id}`,
      headers: {
        Authorization: axios.defaults.headers.common["Authorization"],
      },
    };
    try {
      let res = await axios(config);
      if (id === userData?.id) {
        if (res?.data) {
          setNbFollower(res?.data?.total);
        }
      }
      return res;
    } catch (e: any) {
      console.log("error", e);
    }
  };

  const getFollowingForUser = async (id: String) => {
    var config = {
      method: "get",
      url: `${url}/get-following-users?user_id=${id}`,
      headers: {
        Authorization: axios.defaults.headers.common["Authorization"],
      },
    };
    try {
      let res = await axios(config);
      if (id === userData?.id) {
        if (res?.data) {
          setNbFollowing(res?.data?.total);
        }
      }
      return res;
    } catch (e: any) {
      console.log("error", e);
    }
  };

  const PostUnfollowForUser = async (id: string) => {
    var config = {
      method: "post",
      url: `${url}/unfollow-user`,
      headers: {
        Authorization: axios.defaults.headers.common["Authorization"],
      },
      data: {
        user_id: id,
      },
    };
    try {
      let res = await axios(config);
      return res;
    } catch (e: any) {
      console.log("error", e);
    }
  };

  const PostFollowForUser = async (id: string) => {
    var config = {
      method: "post",
      url: `${url}/follow-user`,
      headers: {
        Authorization: axios.defaults.headers.common["Authorization"],
      },
      data: {
        user_id: id,
      },
    };
    try {
      let res = await axios(config);
      return res;
    } catch (e: any) {
      console.log("error", e);
    }
  };

  const deleteAccount = async (id: any) => {
    try {
      var config = {
        method: "delete",
        headers: {
          "Content-Type": "application/json",
        },
        url: `${url}/users/${id}`,
      };

      axios(config).then(async function (response) {
        setUserData(undefined);
        router.push("/login");
      });
    } catch (e: any) {
      console.log("error", e);
      setIsLoading(false);
    }
  };

  const modifyUser = async (
    username: string,
    name: string,
    email: string,
    id: string | any,
    files: any,
    phone: string
  ) => {
    try {
      setIsLoading(true);
      var formdata = new FormData();
      formdata.append("username", username);
      formdata.append("email", email);
      formdata.append("name", name);
      formdata.append("phone", phone);
      if (files) formdata.append("file", files?.[0]);

      var config = {
        method: "patch",
        maxBodyLength: Infinity,
        url: `${url}/users/${id}`,
        data: formdata,
      };

      axios(config).then(function (response) {
        setUserData(response.data);
        setIsLoading(false);
      });
    } catch (e: any) {
      setIsLoading(false);
    }
  };

  const GetGoodInfoUser = async (user: User) => {
    // @ts-ignore
    setUserData(user);
    // @ts-ignore
    getFollowForUser(user?.id);
    // @ts-ignore
    getFollowingForUser(user?.id);
    // @ts-ignore
    FindAllPostById(user?.id);
  };

  const findAllNotifications = async () => {
    try {
      let res = await HTTPRequest("find", "notifications");
      let cpt = 0;
      let notifs: Array<Notifications> = [];
      res?.data.forEach((element: Notifications) => {
        if (element?.receiver_id === currentUser?.id)
          if (element?.viewed === false) {
            cpt++;
            notifs.push(element);
            console.log("element notif", element);
          }
      });
      setNotifications(notifs.reverse());
      setNbNotifs(cpt);
      return res;
    } catch (e: any) {
      console.log("error", e);
    }
  };

  const patchNotifications = async (id: string) => {
    try {
      let res = await HTTPRequest("patch", "notifications", {
        _id: id,
        data: { viewed: true },
      });
      findAllNotifications();
      return res;
    } catch (e: any) {
      console.log("error", e);
    }
  };

  useEffect(() => {
    if (currentUser != undefined) {
      // @ts-ignore
      setUserData(currentUser);
      // @ts-ignore
      GetGoodInfoUser(currentUser);
      findAllNotifications();
    }
  }, [currentUser]);

  useEffect(() => {
    autoLogin();
  }, []);

  useEffect(() => {
    if (currentUser != undefined) {
      findAllNotifications();
    }
  }, []);

  useEffect(() => {
    console.log("notifications", notifications);
  }, [nbNotifs])

  const autoLogin = async () => {
    try {
      setIsLoadingAuth(true);
      let res = await app.reAuthenticate();
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + res.accessToken;
      setCurrentUser(res?.user);
      setIsLoadingAuth(false);
      await GetGoodInfoUser(res?.user);
    } catch (e: any) {
      setIsLoadingAuth(false);
    }
  };

  return (
    <UserContext.Provider
      value={{
        modifyUser,
        userData,
        nbFollower,
        nbFollowing,
        nbPublication,
        getFollowForUser,
        GetAllUsers,
        getFollowingForUser,
        FindUserById,
        FindAllPostById,
        PostUnfollowForUser,
        PostFollowForUser,
        GetGoodInfoUser,
        post,
        deleteAccount,
        findAllNotifications,
        nbNotifs,
        notifications,
        patchNotifications,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserWrapper;
export function useUser(): UserContextInterface {
  return useContext(UserContext);
}
