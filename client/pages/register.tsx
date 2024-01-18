import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import { FaGoogle, FaLongArrowAltRight } from "react-icons/fa";
import { useAuth } from "../src/context/AuthContext";

const Register: NextPage = () => {
    const router = useRouter();
    const { register } = useAuth();
    const [valueEmail, setvalueEmail] = useState("");
    const [valuePassword, setvaluePassword] = useState("");
    const [valuePasswordConfirm, setvaluePasswordConfirm] = useState("");
    const [valueUsername, setvalueUsername] = useState("");
    const [valueName, setvalueName] = useState("");
    const [warningMessage, setWarningMessage] = useState("");

    const [errorName, setErrorName] = useState(false);
    const [errorUsername, setErrorUsername] = useState(false);
    const [errorEmail, setErrorEmail] = useState(false);

    useEffect(() => {
        if (
            (valueUsername && valueUsername.length < 5) ||
            valueUsername.length > 40
        )
            setWarningMessage("Error on username size (5-40).");
        else setWarningMessage("");
    }, [valueUsername]);

    useEffect(() => {
        if ((valueName && valueName.length < 5) || valueName.length > 40)
            setWarningMessage("Error on name size (5-40).");
        else setWarningMessage("");
    }, [valueName]);

    useEffect(() => {
        const regexEmail =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (valueEmail && !regexEmail.test(valueEmail)) setWarningMessage("Please enter valid email");
        else setWarningMessage("");
    }, [valueEmail]);

    const handleEmailValue = (event: any) => {
        setvalueEmail(event.target.value);
    };

    const handlePasswordValue = (event: any) => {
        setvaluePassword(event.target.value);
    };

    const handlePasswordConfirmValue = (event: any) => {
        setvaluePasswordConfirm(event.target.value);
    };

    const handleUsernameValue = (event: any) => {
        setvalueUsername(event.target.value);
    };

    const handleNameValue = (event: any) => {
        setvalueName(event.target.value);
    };

    const createUser = async () => {
        if (
            valueEmail === "" ||
            valueUsername === "" ||
            valueName === "" ||
            valuePassword === ""
        ) {
            setWarningMessage("Some values are empty.");
        } else {
            if (valuePassword === valuePasswordConfirm && warningMessage === "") {
                let res = await register(
                    valueEmail,
                    valuePassword,
                    valueUsername,
                    valueName
                );
                if (res === 401) {
                    setWarningMessage("Bad identification.");
                } else {
                    setWarningMessage("");
                }
            } else {
                setWarningMessage("Password are not same.");
            }
        }
    };

    return (
        <div className="flex flex-row overflow-hidden relative bg-[#121212]">
            <div className="w-full overflow-y-scroll pb-8 lg:h-[100vh] lg:overflow-y-hidden flex justify-center">
                <div className="md:w-[460px] w-[300px]">
                    <div className="flex flex-row my-[30px] items-center p-5 rounded-lg justify-center">
                        <img src="/Ugram-Logo-RougeBlanc.svg" className="w-[300px]" />
                    </div>
                    <div className="flex flex-col md:flex-row items-start md:items-end justify-between w-[300px] md:w-[540px] mb-[30px]">
                        <h2 className="text-[60px] text-white">Sign Up</h2>
                        <div className="flex flex-row md:m-auto">
                            <p className="text-center text-white">Already member?</p>
                            <a
                                className="text-[#e74c3c] cursor-pointer ml-[5px]"
                                onClick={() => router.push("/login")}
                            >
                                Sign In
                            </a>
                        </div>
                    </div>
                    <div className="mt-[20px] mx-[5px]">
                        <div className="flex items-left">
                            <p className="text-center text-white">Email</p>
                        </div>
                        <input
                            className="rounded-md px-[6px] py-[2px] h-[40px] w-full bg-[#202020] border-none text-white mt-2"
                            required={true}
                            onChange={handleEmailValue}
                        />
                    </div>
                    <div className="flex flex-row justify-between">
                        <div className="mt-[20px] mx-[5px]">
                            <div className="w-full flex items-left">
                                <p className="text-center text-white">Username</p>
                            </div>
                            <input
                                className="rounded-md px-[6px] py-[2px] h-[40px] w-full bg-[#202020] border-none text-white mt-2"
                                required={true}
                                onChange={handleUsernameValue}
                            />
                        </div>
                        <div className="mt-[20px] mx-[5px]">
                            <div className="w-full flex items-left">
                                <p className="text-center text-white">Name</p>
                            </div>
                            <input
                                className="rounded-md px-[6px] py-[2px] h-[40px] w-full bg-[#202020] border-none text-white mt-2"
                                required={true}
                                onChange={handleNameValue}
                            />
                        </div>
                    </div>
                    <div className="flex flex-row justify-between">
                        <div className="mt-[20px] mx-[5px]">
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
                        <div className="mt-[20px] mx-[5px]">
                            <div className="flex items-left">
                                <p className="text-center text-white">Re-Type Password</p>
                            </div>
                            <input
                                className="rounded-md px-[6px] py-[2px] h-[40px] w-full bg-[#202020] border-none text-white mt-2"
                                type={"password"}
                                required={true}
                                onChange={handlePasswordConfirmValue}
                            />
                        </div>
                    </div>
                    {warningMessage === "" && (
                        <div className="w-full h-[30px] mt-[30px]"></div>
                    )}
                    {warningMessage != "" && (
                        <div className="flex items-center px-3 rounded-md border-[1px]  bg-[#FEF1F2]  text-[#9E2827] text-xs w-full h-[30px] mt-[30px]">
                            <AiFillCloseCircle
                                color="#F77171"
                                size={18}
                                onClick={() => setWarningMessage("")}
                            ></AiFillCloseCircle>
                            <p className="ml-2">{warningMessage}</p>
                        </div>
                    )}
                    <div className="flex flex-col items-center md:flex-row mt-[30px]">
                        <button
                            onClick={() => createUser()}
                            className="w-[200px] h-[50px] rounded-full hover:scale-105 bg-[#e74c3c] flex flex-row items-center px-[5px] text-[white]"
                        >
                            <a className="w-[150px] flex justify-center text-sm">Sign Up</a>
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
                                    <FaGoogle className="text-[#db4a39] text-[25px]" />
                                </button>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
