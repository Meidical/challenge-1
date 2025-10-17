import React from "react";
import styles from "./Input.module.css";

type MultilineInputProps = {
  label: string;
  className?: string;
  placeholder: string;
  error?: string;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export default function MultilineInput({
  label,
  className = "",
  placeholder,
  error,
  maxLength,
  ...props
}: MultilineInputProps) {
  return (
    <div className={`${styles.inputFrame} ${className}`}>
      <label className={styles.labelText}>{label}</label>
      <textarea
        className={error ? styles.invalidInput : styles.textInput}
        name={label.toLowerCase()}
        placeholder={`${placeholder}${
          maxLength && ` (max: ${maxLength} letters)`
        }`}
        maxLength={maxLength}
        {...props}
      />
      {error && <div className={styles.errorText}>{error}</div>}
    </div>
  );
}
