import axios from "axios";
import { useRouter } from "next/router";
import { createContext, useContext, useState } from "react";
import app, { HTTPRequest } from "../api/feathers-config";
import { User } from "../types/User";

interface AuthWrapperInterface {
  children: {};
}
interface AuthContextInterface {
  login: (email: string, password: string) => any;
  register: (
    email: string,
    password: string,
    username: string,
    name: string
  ) => any;
  logout: () => any;
  oauth: (accessToken: string) => any;
  currentUser: undefined | User;
  isAuthenticated: boolean;
  isLoading: boolean;
  setCurrentUser: any;
  setIsLoadingAuth: any;
}

const AuthContext = createContext({} as AuthContextInterface);

export const AuthWrapper = ({ children }: AuthWrapperInterface) => {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<undefined | User>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (email: string, password: string) => {
      console.log("uri", process.env.vars.NEXT_PUBLIC_API_URL)
    try {
      setIsLoading(true);
      let res = await app.authenticate({
        email: email,
        password: password,
        strategy: "local",
      });
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + res.accessToken;
      setCurrentUser(res?.user);
      console.log("token", res.accessToken);
      console.log("id", res);
      setIsLoading(false);
      router.push("/");
      return res;
    } catch (e: any) {
      setIsLoading(false);
      return e.code;
    }
  };

  const register = async (
    email: string,
    password: string,
    username: string,
    name: string
  ) => {
    try {
      setIsLoading(true);
      await HTTPRequest("create", "users", {
        data: {
          email: email,
          password: password,
          username: username,
          name: name,
          mode: "local",
        },
      });
      setIsLoading(false);
      router.push("/login");
    } catch (e: any) {
      setIsLoading(false);
      return e.code;
    }
  };

  const oauth = async (accessToken: string) => {
    try {
      setIsLoading(true);
      let res = await app.authenticate({
        accessToken,
        strategy: "jwt",
      });
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + res.accessToken;
      setCurrentUser(res?.user);
      setIsLoading(false);
      router.push("/");
      return res;
    } catch (e: any) {
      setIsLoading(false);
      return e.code;
    }
  };

  const logout = async () => {
    setIsLoading(true);
    let res = await app.logout();
    setCurrentUser(undefined);
    setIsLoading(false);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        register,
        setCurrentUser,
        logout,
        isAuthenticated: currentUser ? true : false,
        setIsLoadingAuth: setIsLoading,
        isLoading,
        oauth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthWrapper;

export function useAuth(): AuthContextInterface {
  return useContext(AuthContext);
}
