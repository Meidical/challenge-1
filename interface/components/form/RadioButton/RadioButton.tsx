import React from "react";
import styles from "./RadioButton.module.css";

type RadioButtonProps = {
  label: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export default function RadioButton({
  label,
  className,
  ...props
}: RadioButtonProps) {
  return (
    <label className={`${styles.radioButton} ${className}`}>
      {label}
      <input type="radio" className={styles.radioButton} {...props} />
      <span className={styles.checkMark}></span>
    </label>
  );
}
