"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import HomeIcon from "./icons/HomeIcon";
import UserIcon from "./icons/UserIcon";
import MenuIcon from "./icons/MenuIcon";
import SideMenu from "./SideMenu";
import styles from "../styles/navbarMobile.module.css";

export default function NavbarMobile() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [profileLink, setProfileLink] = useState("/auth/login");

  useEffect(() => {
    setMounted(true);

    // تحديد رابط ملف المستخدم حسب نوع الحساب
    try {
      const userDataRaw = localStorage.getItem("userData");
      if (userDataRaw) {
        const userData = JSON.parse(userDataRaw);
        if (userData && userData.id) {
          const role = userData.role || userData.userType;
          let link;

          if (role === 'client') {
            link = `/profile/client/${userData.id}`;
          } else if (role === 'serviceProvider') {
            link = `/profile/provider/${userData.id}`;
          } else if (role === 'admin') {
            link = '/dashboard';
          } else {
            link = '/home';
          }

          setProfileLink(link);
        } else {
          setProfileLink("/auth/login");
        }
      } else {
        setProfileLink("/auth/login");
      }
    } catch (err) {
      console.error("Error loading user data:", err);
      setProfileLink("/auth/login");
    }
  }, []);

  const isProfileActive =
    pathname.startsWith("/profile/client") ||
    pathname.startsWith("/profile/provider") ||
    pathname.startsWith("/dashboard");

  const isActive = (path) => pathname === path;

  if (!mounted) return null;

  return (
    <>
      <nav className={styles.navbar}>
        {/* زر القائمة */}
        <button
          type="button"
          onClick={() => setIsMenuOpen(true)}
          className={`${styles.button} ${isMenuOpen ? styles.activeTab : ""}`}
          suppressHydrationWarning
        >
          <MenuIcon className={`${styles.icon} ${isMenuOpen ? styles.activeIcon : ""}`} />
        </button>

        {/* زر الصفحة الرئيسية */}
        <Link
          href="/home"
          className={`${styles.button} ${isActive("/home") ? styles.activeTab : ""}`}
        >
          <HomeIcon className={`${styles.icon} ${isActive("/home") ? styles.activeIcon : ""}`} />
        </Link>

        {/* زر صفحة المستخدم */}
        <button
          type="button"
          onClick={() => router.push(profileLink)}
          className={`${styles.button} ${isProfileActive ? styles.activeTab : ""}`}
        >
          <UserIcon className={`${styles.icon} ${isProfileActive ? styles.activeIcon : ""}`} />
        </button>
      </nav>

      {/* القائمة الجانبية */}
      {isMenuOpen && <SideMenu onClose={() => setIsMenuOpen(false)} />}
    </>
  );
}
