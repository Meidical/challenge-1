import React from "react";
import styles from "./CheckBox.module.css";

type CheckBoxProps = {
  label: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export default function CheckBox({
  label,
  className,
  ...props
}: CheckBoxProps) {
  return (
    <label className={`${styles.checkBox} ${className}`}>
      {label}
      <input type="checkbox" className={styles.checkBox} {...props} />
      <span className={styles.checkMark}></span>
    </label>
  );
}
