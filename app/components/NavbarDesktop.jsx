"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "../styles/navbarDesktop.module.css";

export default function NavbarDesktop() {
  const [isScrolled, setIsScrolled] = useState(false);

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

      {/* زرار تسجيل */}
      <div className={styles.auth}>
        <Link href="/auth/login" className={styles.loginBtn}>
          تسجيل دخول
        </Link>
      </div>

    </nav>
  );
}