import type { NextPage } from "next";
import { useEffect } from "react";
import { useAuth } from "../src/context/AuthContext";

const Oauth: NextPage = () => {
	const {oauth} = useAuth();

	useEffect(() => {
		const access_token: any = window.location.href.split("#access_token=")[1];
		oauth(access_token)
	},[])
  

    return (
        <div>
            
        </div>
    );
};

export default Oauth;
