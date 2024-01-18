import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import { FaGoogle, FaLongArrowAltRight } from "react-icons/fa";
import { useAuth } from "../src/context/AuthContext";
import { useUser } from "../src/context/UserContext";

const Login: NextPage = () => {
    const router = useRouter();
    const [warningMessage, setWarningMessage] = useState("");
    const { login } = useAuth();
    const [valueEmail, setvalueEmail] = useState("");
    const [valuePassword, setvaluePassword] = useState("");
	const { GetGoodInfoUser } = useUser()

    const handleEmailValue = (event: any) => {
        setvalueEmail(event.target.value);
    };

    const handlePasswordValue = (event: any) => {
        setvaluePassword(event.target.value);
    };

    const logUser = async () => {
        let res = await login(valueEmail, valuePassword);
		if (res.user) {
			GetGoodInfoUser(res.user)
		}
        if (res === 401) {
            setWarningMessage("User not found.")
        } else {
            setWarningMessage("");
        }
    };

    return (
        <div className="flex flex-row overflow-hidden relative bg-[#121212]">
            <div className="w-[100vw] h-[100vh] flex justify-center items-center overflow-y-scroll">
                <div className="md:w-[460px] w-[300px]">
                    <div className="flex flex-row mb-[50px] items-center justify-center p-5 rounded-lg">
                        <img src="/Ugram-Logo-RougeBlanc.svg" className="w-[300px]"/>
                    </div>
                    <div className="flex flex-col md:flex-row items-start md:items-end justify-between w-[300px] md:w-[540px] mb-[30px]">
                        <h2 className="text-[60px] text-white">Sign In</h2>
                        <div className="flex flex-row md:m-auto">
                            <p className="text-center text-white">You have no account?</p>
                            <a className="text-[#e74c3c] cursor-pointer ml-[5px]" onClick={() => router.push("/register")}>
                                Sign Up
                            </a>
                        </div>
                    </div>
                    <div className="mt-[20px]">
                        <div className="flex items-left">
                            <p className="text-center text-white">Email</p>
                        </div>
                        <input
                            className="rounded-md px-[6px] py-[2px] h-[40px] w-full bg-[#202020] border-none text-white mt-2"
                            required={true}
                            onChange={handleEmailValue}
                        />
                    </div>
                    <div className="mt-[20px]">
                        <div className="flex items-left">
                            <p className="text-center text-white">Password</p>
                        </div>
                        <input
                            className="rounded-md px-[6px] py-[2px] h-[40px] w-full bg-[#202020] border-none text-white mt-2"
                            required={true}
                            type={"password"}
                            onChange={handlePasswordValue}
                        />
                    </div>
                    {warningMessage === "" && <div className="w-full h-[30px] mt-[30px]"></div>}
                    {warningMessage != "" && (
                        <div className="flex items-center px-3 rounded-md border-[1px]  bg-[#FEF1F2]  text-[#9E2827] text-xs w-full h-[30px] mt-[30px]">
                            <AiFillCloseCircle
                                cursor="pointer"
                                color="#F77171"
                                size={18}
                                onClick={() => setWarningMessage("")}
                            ></AiFillCloseCircle>
                            <p className="ml-2">{warningMessage}</p>
                        </div>
                    )}
                    <div className="flex flex-col items-center md:flex-row mt-[30px]">
                        <button
                            onClick={() => logUser()}
                            className="w-[200px] h-[50px] rounded-full hover:scale-105 bg-[#e74c3c] flex flex-row items-center px-[5px] text-[white]"
                        >
                            <a className="w-[150px] flex justify-center text-sm">Sign In</a>
                            <div className="w-[40px] h-[40px] bg-[#c0392b] rounded-full flex justify-center items-center">
                                <FaLongArrowAltRight />
                            </div>
                        </button>
                        <div className="h-[50px] flex items-center w-[150px] md:w-[210px] justify-center">
                            <span className="text-center text-white">Or</span>
                        </div>
                        <div className="flex flex-row">
							<a href={process.env.vars.NEXT_PUBLIC_API_URL + "/oauth/google"}>
                            	<button className="w-[50px] h-[50px] border-[2px] rounded-full border-[#EFEFEF] border-solid flex justify-center items-center">
                                	<FaGoogle  className="text-[#db4a39] text-[25px]" />
                        	    </button>
							</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
