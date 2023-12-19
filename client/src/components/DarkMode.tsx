import { useTheme } from "next-themes";
import { MdOutlineLightMode, MdOutlineDarkMode } from 'react-icons/md';

export const RenderThemeChanger = () => {
  const { systemTheme, theme, setTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;

  if (currentTheme === "dark") {
    return (
      <div
        onClick={() => setTheme("light")}
        className="flex flex-row align-middle justify-center items-center"
      >
        <MdOutlineLightMode className="w-10 h-10 text-gray-300 " role="button" />
        <h1 className="pl-2 text-gray-300">Light Mode</h1>
      </div>
    );
  } else {
    return (
      <div
        onClick={() => setTheme("dark")}
        className="flex flex-row align-middle justify-center items-center"
      >
        <MdOutlineDarkMode className="w-10 h-10 text-gray-300" role="button" />
        <h1 className="pl-2 text-gray-300">Dark Mode</h1>
      </div>
    );
  }
};
