import React from "react";
import styles from "./Input.module.css";

type TextInputProps = {
  label: string;
  placeholder: string;
  className?: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export default function TextInput({
  label,
  placeholder,
  className = "",
  error,
  ...props
}: TextInputProps) {
  return (
    <div className={`${styles.inputFrame} ${className}`}>
      <label className={styles.labelText}>{label}</label>
      <input
        type="text"
        className={error ? styles.invalidInput : styles.textInput}
        placeholder={placeholder}
        {...props}
      />
      {error && <div className={styles.errorText}>{error}</div>}
    </div>
  );
}
