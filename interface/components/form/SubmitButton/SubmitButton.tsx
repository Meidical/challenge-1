"use client";
import React from "react";
import styles from "./SubmitButton.module.css";
import { Spinner } from "@/components/feedback";

type SubmitButtonProps = {
  text?: string;
  className?: string;
  loading?: boolean;
  disabled?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function SubmitButton({
  text = "Submit",
  className = "",
  loading = false,
  disabled = false,
  ...props
}: SubmitButtonProps) {
  return (
    <button
      className={`${styles.submitButton} ${className}`}
      style={loading ? { color: "transparent" } : undefined}
      type="submit"
      disabled={loading || disabled}
      {...props}
    >
      {loading && <Spinner fill="#252525" />}
      {text}
    </button>
  );
}
