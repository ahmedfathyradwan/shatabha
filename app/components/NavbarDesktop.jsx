"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "../styles/navbarDesktop.module.css";

export default function NavbarDesktop() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isScrolled) {
      document.body.classList.add("scrolled");
    } else {
      document.body.classList.remove("scrolled");
    }
  }, [isScrolled]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("userData");
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  const getProfileLink = () => {
    if (!user) return "/auth/login";
    const role = user.role || user.userType;
    if (role === "admin") return "/dashboard";
    if (role === "client") return "/profile/client";
    return "/profile/provider";
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
    } catch (err) {
      console.error(err);
    } finally {
      localStorage.removeItem("userData");
      localStorage.removeItem("registerData");
      setUser(null);
      router.push("/auth/login");
    }
  };

  return (
    <nav className={styles.navbar}>
      {/* اللوجو */}
      <div className={styles.logo}>
        <Image
          src="/images/logo.png"
          alt="Logo"
          width={40}
          height={50}
          className={styles.logoIcon}
        />
      </div>

      {/* اللينكات */}
      <div className={styles.links}>
        <Link href="/home" className={styles.link}>الرئيسية</Link>
        <Link href="/finishChoice" className={styles.link}>التشطيب</Link>
        <Link href="/maintenance" className={styles.link}>الصيانة</Link>
        <Link href="/offersPost" className={styles.link}>العروض</Link>
        <Link href="/about" className={styles.link}>من نحن</Link>
        <Link href="/services" className={styles.link}>تواصل معنا</Link>
      </div>

      {/* زر الحساب أو تسجيل الدخول */}
      <div className={styles.auth}>
        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Link href={getProfileLink()} className={styles.loginBtn}>
              {user.fullName ? user.fullName.split(" ")[0] : "الملف الشخصي"}
            </Link>
            <button
              onClick={handleLogout}
              style={{
                background: "transparent",
                border: "1px solid #ef4444",
                color: "#ef4444",
                padding: "6px 12px",
                borderRadius: "6px",
                cursor: "pointer",
                fontFamily: "inherit"
              }}
            >
              خروج
            </button>
          </div>
        ) : (
          <Link href="/auth/login" className={styles.loginBtn}>
            تسجيل دخول
          </Link>
        )}
      </div>
    </nav>
  );
}
