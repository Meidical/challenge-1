"use client";
import React from "react";
import styles from "./SubmitButton.module.css";
import { Spinner } from "@/components/feedback";

type SubmitButtonProps = {
  text?: string;
  className?: string;
  loading?: boolean;
  disabled?: boolean;
};

export default function SubmitButton({
  text = "Submit",
  className = "",
  loading = false,
  disabled = false,
}: SubmitButtonProps) {
  return (
    <button
      className={`${styles.submitButtonFrame} ${className}`}
      style={loading ? { color: "transparent" } : undefined}
      type="submit"
      disabled={loading || disabled}
    >
      {loading && <Spinner fill="#252525" />}
      {text}
    </button>
  );
}
