import React from "react";
import styles from "./CheckBox.module.css";

type CheckBoxProps = {
  label: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export default function CheckBox({ label, ...props }: CheckBoxProps) {
  return (
    <label className={styles.checkBoxFrame}>
      {label}
      <input type="checkbox" className={styles.checkBox} {...props} />
      <span className={styles.checkMark}></span>
    </label>
  );
}
