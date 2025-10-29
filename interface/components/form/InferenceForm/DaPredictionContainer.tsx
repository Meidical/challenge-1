"use client";
import React from "react";
import styles from "./DaPredictionContainer.module.css";

type DaPredictionContainerProps = {
  isDa: boolean;
};

export default function DaPredictionContainer({
  isDa,
}: DaPredictionContainerProps) {
  return (
    <div
      className={
        isDa
          ? styles.daPredictionContainerPositive
          : styles.daPredictionContainer
      }
    >
      <div className={styles.descriptionText}>Difficult Airway Predicted?</div>
      <div className={styles.isDaText}>{isDa ? "Yes" : "No"}</div>
    </div>
  );
}
