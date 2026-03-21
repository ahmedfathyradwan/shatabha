"use client";

import { usePathname } from "next/navigation";
import NavbarMobile from "./NavbarMobile";
import NavbarDesktop from "./NavbarDesktop";

const AppWrapper = ({ children }) => {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/auth");

  return (
    <div className="mainContainer">
      {children}
      {!isAuthPage && (
        <>
          <div className="mobNav">
            <NavbarMobile />
          </div>
          <div className="desktopNav">
            <NavbarDesktop />
          </div>
        </>
      )}
    </div>
  );
};

export default AppWrapper;
