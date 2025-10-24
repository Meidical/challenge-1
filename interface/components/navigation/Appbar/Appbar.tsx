"use client";
import React from "react";
import Image from "next/image";
import styles from "./Appbar.module.css";

export default function Appbar() {
  return (
    <nav className={styles.appbar}>
      <Image
        className={styles.logo}
        src="/assets/svgs/logo.svg"
        alt="Meidical Logo"
        width={1941}
        height={465}
      />
    </nav>
  );
}
