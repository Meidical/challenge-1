"use client";
import React from "react";
import styles from "./Button.module.css";
import { Spinner } from "@/components/feedback";

type ButtonProps = {
  text?: string;
  className?: string;
  loading?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export default function Button({
  text = "Button 1",
  className = "",
  loading = false,
  disabled = false,
  type = "submit",
  onClick,
}: ButtonProps) {
  return (
    <button
      className={`${styles.submitButtonFrame} ${className}`}
      style={loading ? { color: "transparent" } : undefined}
      type={type}
      disabled={loading || disabled}
      onClick={onClick}
    >
      {loading && <Spinner fill="#252525" />}
      {text}
    </button>
  );
}
