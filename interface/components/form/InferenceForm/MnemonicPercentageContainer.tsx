"use client";
import React from "react";
import styles from "./MnemonicPercentageContainer.module.css";

type MnemonicPercentageContainerProps = {
  title?: string;
  description?: string;
  percentage?: number;
};

export default function MnemonicPercentageContainer({
  title = "Title",
  description = "Description",
  percentage = 0,
}: MnemonicPercentageContainerProps) {
  return (
    <div
      className={
        percentage != 0
          ? styles.mnemonicContainerHighlighted
          : styles.mnemonicContainer
      }
    >
      <div className={styles.topContainer}>
        <div className={styles.header}>
          <div className={styles.mnemonicText}>{title}</div>
          <div className={styles.descriptionText}>{description}</div>
        </div>
        <div className={styles.percentageText}>{percentage}%</div>
      </div>

      <div className={styles.progressBarContainer}>
        <div
          className={styles.progressBar}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
