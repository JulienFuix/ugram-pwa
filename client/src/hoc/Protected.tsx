import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export function Protected<T>(WrappedComponent: React.ComponentType<T>) {
  const Auth = (props: any) => {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
      if (!isLoading) {
        if (!isAuthenticated) router.push("/login");
        else if ((router.asPath === "/login" || router.asPath === "/register") && isAuthenticated) {
          router.push("/");
        }
        else setLoaded(true);
      }
    }, [isLoading]);

    if (isLoading) {
      return (
        <div className="h-screen w-screen flex flex-col items-center justify-center">
          <svg className="animate-spin h-[30px] w-[30px] text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-5 font-bold">Loading</p>
        </div>
      );
    }
    return loaded && <WrappedComponent {...props} />;
  };

  return Auth;
}

export default Protected;
