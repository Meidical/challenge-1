"use client";
import React from "react";
import styles from "./CheckBoxContainer.module.css";

type CheckBoxContainerProps = {
  title?: string;
  description?: string;
  children?: React.ReactNode;
};

export default function CheckBoxContainer({
  title = "Title",
  description = "Description",
  children,
}: CheckBoxContainerProps) {
  return (
    <div className={styles.checkBoxContainer}>
      <div className={styles.headerContainer}>
        <div className={styles.header}>
          <span className={styles.mnemonicText}>{title}</span>
          <span className={styles.descriptionText}>{description}</span>
        </div>
        <div className="divisor" />
      </div>
      <div className={styles.checkBoxList}>{children}</div>
    </div>
  );
}
