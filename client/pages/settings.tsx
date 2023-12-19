import Layout from "../src/components/Layout";
import { RenderThemeChanger } from "../src/components/DarkMode";
import { FiLogOut } from "react-icons/fi";
import Protected from "../src/hoc/Protected";
import { useAuth } from "../src/context/AuthContext";

const SettingsPage = () => {
    const { logout } = useAuth();

    const logOut = async () => {
        await logout();
    };
    
    return (
        <Layout>
            <div className="h-[calc(100vh-130px)] md:h-[calc(100vh-70px)]">
                <h1 className="text-2xl font-bold pt-4 pl-8 text-white">Settings</h1>
                <div className="flex justify-center py-3 border-t-2 border-t-[#545252] mt-10">
                    <div onClick={() => logOut()} className="group w-full flex flex-row space-x-5 rounded-xl cursor-pointer hover:bg-[#7a797d] px-3 py-2">
                    <FiLogOut size={25} color="white" />
                    <p className="font-roboto self-center text-white">Logout</p>
                    </div>
                </div>
            </div>
        </Layout>
    )
};

export default Protected(SettingsPage);
