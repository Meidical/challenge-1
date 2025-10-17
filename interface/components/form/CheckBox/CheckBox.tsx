import React from "react";
import styles from "./CheckBox.module.css";

type CheckBoxProps = {
  label: string;
  className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export default function CheckBox({
  label,
  className = "",
  ...props
}: CheckBoxProps) {
  return (
    <label className={styles.checkBoxFrame}>
      {label}
      <input type="checkbox" className={styles.checkBox} {...props} />
      <span className={styles.checkMark}></span>
    </label>
  );
}
