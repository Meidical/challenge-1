"use client";
import React from "react";
import styles from "./JustificationContainer.module.css";

type JustificationContainerProps = {
  text?: string;
};

export default function JustificationContainer({
  text = "",
}: JustificationContainerProps) {
  return (
    <div className={styles.justificationContainer}>
      <span className={styles.title}>Justification</span>
      <span className={styles.text}>{text}</span>
    </div>
  );
}
