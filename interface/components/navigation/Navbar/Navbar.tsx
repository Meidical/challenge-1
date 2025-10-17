"use client";
import React from "react";
import Image from "next/image";
import styles from "./Navbar.module.css";

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <Image
        className={styles.logo}
        src="/assets/svgs/logo.svg"
        alt="Meidical Logo"
        width={512}
        height={113}
      />
    </nav>
  );
}
