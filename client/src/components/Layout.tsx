import { useState, useEffect } from "react";
import NavBar from "./NavBar";
import TopBar from "./TopBar";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 640) {
        setOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div>
      <div className="z-10">
        <TopBar setOpen={setOpen} open={open} />
      </div>
      <div className="z-10">
        <NavBar open={open} />
      </div>
      <div className="bg-[#121212] h-[calc(h-screen-70px)] md:ml-[280px] mt-[70px] overscroll-y-auto">{children}</div>
    </div>
  );
}
