"use client";
import React from "react";
import styles from "./ConclusionContainer.module.css";

type ConclusionContainerProps = {
  text?: string;
};

export default function ConclusionContainer({
  text,
}: ConclusionContainerProps) {
  return (
    <div className={styles.container}>
      <span className={styles.title}>Conclusion</span>
      <span className={styles.text}>{text}</span>
      {/* <span className={styles.conclusion}>End of Procedure</span> */}
    </div>
  );
}
