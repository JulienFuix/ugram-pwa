import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FiX } from "react-icons/fi";
import { BiPencil } from "react-icons/bi";
import { User } from "../../types/User";
import { useDropzone } from "react-dropzone";
import { useUser } from "../../context/UserContext";
import { CgProfile } from "react-icons/cg";

interface ModaleProps {
  changeDisplay: (display: boolean) => void;
  user: User | undefined;
}

export default function ModaleModifyProfil(props: ModaleProps) {
  const router = useRouter();
  const [username, setUsername] = useState<String | any>(props?.user?.username);
  const [name, setName] = useState<String | any>(props?.user?.name);
  const [tel, setTel] = useState<String | any>(props?.user?.phone);
  const [email, setEmail] = useState<String | any>(props?.user?.email);
  const [isDisabledUserName, setIsDisabledUserName] = useState(true);
  const [isDisabledName, setIsDisabledName] = useState(true);
  const [isDisabledTel, setIsDisabledTel] = useState(true);
  const [isDisabledEmail, setIsDisabledEmail] = useState(true);

  const [errorName, setErrorName] = useState(false);
  const [errorUsername, setErrorUsername] = useState(true);
  const [errorEmail, setErrorEmail] = useState(true);
  const [errorPhone, setErrorPhone] = useState(true);

  const [files, setFiles] = useState<Array<File & { preview: string }>>([]);
  const { modifyUser, deleteAccount } = useUser();
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

  useEffect(() => {
    if (username.length < 5 || username.length > 40) setErrorUsername(true);
    else setErrorUsername(false);
  }, [username]);

  useEffect(() => {
    if (name.length < 5 || name.length > 40) setErrorName(true);
    else setErrorName(false);
  }, [name]);

  useEffect(() => {
    const regexEmail =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email && !regexEmail.test(email)) setErrorEmail(true);
    else setErrorEmail(false);
  }, [email]);

  useEffect(() => {
    let regexPhoneNumber =
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    if (tel && tel != "null" && !regexPhoneNumber.test(tel)) setErrorPhone(true);
    else setErrorPhone(false);
  }, [tel]);

  const removeAccount = async () => {
    await deleteAccount(props?.user?.id);
  };
  const handleCloseClick = () => {
    props.changeDisplay(false);
  };

  const ValidateModify = async () => {
    if (errorEmail || errorPhone || errorName || errorUsername) return;
    let res = await modifyUser(
      username,
      name,
      email,
      props?.user?.id,
      files,
      tel
    );
    handleCloseClick();
  };

  const handleButtonClickUserName = () => {
    setIsDisabledUserName(false);
  };
  const handleButtonClickName = () => {
    setIsDisabledName(false);
  };
  const handleButtonClickTel = () => {
    setIsDisabledTel(false);
  };

  const handleButtonClickEmail = () => {
    setIsDisabledEmail(false);
  };

  return (
    <div className="custom-modale-background w-screen h-screen fixed z-50 top-0 left-0 flex justify-center items-center">
      <button
        className="fixed z-51 top-0 right-0 mt-6 mr-6"
        onClick={() => handleCloseClick()}
      >
        <FiX size={35} className="text-white" />
      </button>
      <div>
        <div className="w-full h-[100px] flex items-center justify-center text-center text-xl border-b-[1px] border-neutral-800 text-white bg-[#161616] rounded-t-lg">
          User settings
        </div>

        <form className="w-[350px] lg:w-[550px] bg-[#161616] rounded-b-lg flex flex-wrap flex-col lg:flex-row overflow-y-auto items-center justify-center">
          <div className="bg-[#161616] mt-5 flex items-center justify-center h-[75px] cursor-pointer">
            <div {...getRootProps({})}>
              <input {...getInputProps()} />
              <div className="flex flex-col items-center justify-center">
                {files[0] ? (
                  <img
                    src={files[0].preview}
                    className="rounded-full align-middle border-none w-[75px] h-[75px]"
                  />
                ) : props?.user?.image ? (
                  <img
                    src={props?.user?.image?.url}
                    className="rounded-full align-middle border-none w-[75px] h-[75px]"
                  />
                ) : (
                  <CgProfile
                    className=" text-white rounded-full align-center border-none "
                    size={75}
                  />
                )}
              </div>
            </div>
          </div>
          <div className="w-full h-[75px] flex items-center text-center text space-between lg:justify-center">
            <div className="flex flex-col">
              <input
                id="user-input-username"
                defaultValue={props?.user?.username}
                className="w-[250px] lg:w-[250px] h-[50px]  rounded-lg ml-5 mr-5 p-5 duration-300 "
                disabled={isDisabledUserName}
                type="text"
                placeholder="username"
                onChange={(event) => setUsername(event.target.value)}
              />
              {errorUsername && (
                <p className="text-red-700 my-1">Error on size (5-40)</p>
              )}
            </div>
            <button
              onClick={handleButtonClickUserName}
              type="button"
              id="btn-modify"
              className="h-[50px] w-[50px] text-center flex justify-center items-center border-2 rounded-lg hover:bg-white hover:text-black duration-300 hover:font-semibold"
            >
              <BiPencil color="white" />
            </button>
          </div>
          <div className="w-full h-[75px] flex items-center space-between lg:justify-center text-center text">
            <div className="flex flex-col">
              <input
                id="user-input-username"
                defaultValue={props?.user?.name}
                className="w-[250px] lg:w-[250px] h-[50px]  rounded-lg ml-5 mr-5 p-5 duration-300 "
                disabled={isDisabledName}
                type="text"
                placeholder="name"
                onChange={(event) => setName(event.target.value)}
              />
              {errorName && (
                <p className="text-red-700 py-1">Error on size (5-40)</p>
              )}
            </div>
            <button
              onClick={handleButtonClickName}
              type="button"
              id="btn-modify"
              className="h-[50px] w-[50px] text-center text-white flex justify-center items-center border-2 rounded-lg hover:bg-white hover:text-black duration-300 hover:font-semibold"
            >
              <BiPencil color="white" />
            </button>
          </div>
          <div className="w-full h-[75px] flex items-center space-between lg:justify-center text-center text">
            <div className="flex flex-col">
              <input
                id="user-input-email"
                defaultValue={props?.user?.email}
                className="w-[250px] lg:w-[250px] h-[50px] rounded-lg ml-5 mr-5 p-5 duration-300"
                disabled={isDisabledEmail}
                type="text"
                placeholder="Email"
                onChange={(event) => setEmail(event.target.value)}
              />
              {errorEmail && (
                <p className="text-red-700 py-1">Please enter a email valid</p>
              )}
            </div>
            <button
              onClick={handleButtonClickEmail}
              type="button"
              id="btn-modify"
              className="h-[50px] w-[50px] text-center flex justify-center items-center border-2 rounded-lg hover:bg-white hover:text-black duration-300 hover:font-semibold"
            >
              <BiPencil color="white" />
            </button>
          </div>
          <div className="w-full h-[75px] flex items-center text-center text space-between lg:justify-center">
            <div className="flex flex-col">
              <input
                id="user-input-hone"
                defaultValue={props?.user?.phone}
                className="w-[250px] lg:w-[250px] h-[50px]  rounded-lg ml-5 mr-5 p-5 duration-300 "
                disabled={isDisabledTel}
                type="text"
                placeholder="Phone"
                onChange={(event) => setTel(event.target.value)}
              />
              {errorPhone && (
                <p className="text-red-700 py-1">Please enter a phone valid</p>
              )}
            </div>
            <button
              onClick={handleButtonClickTel}
              type="button"
              id="btn-modify"
              className="h-[50px] w-[50px] text-center flex justify-center items-center border-2 rounded-lg hover:bg-white hover:text-black duration-300 hover:font-semibold"
            >
              <BiPencil color="white" />
            </button>
          </div>
          <div className="w-full h-[75px] flex items-center text-center text space-between lg:justify-center">
            <button
              className="w-[320px] h-[50px] border-2 border-red-600 rounded-xl ml-4 hover:bg-red-600 text-white transition duration-300"
              onClick={removeAccount}
            >
              Delete account
            </button>
          </div>
          <div className="w-full h-[75px] flex items-center space-between lg:justify-center text-center text mb-2">
            <button
              type="button"
              id="btn-modify"
              className="w-[300px] lg:w-[300px] h-[50px] rounded-lg m-5 border-2 text-center text-white hover:bg-white hover:text-black duration-300 hover:font-semibold"
              onClick={ValidateModify}
            >
              Enregister
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
