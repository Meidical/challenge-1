"use client";
import React from "react";
import styles from "./Button.module.css";
import { Spinner } from "@/components/feedback";

type ButtonProps = {
  text?: string;
  className?: string;
  loading?: boolean;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export default function Button({
  text = "Button 1",
  className = "",
  loading = false,
  disabled = false,
  onClick,
}: ButtonProps) {
  return (
    <button
      className={`${styles.button} ${className}`}
      style={loading ? { color: "transparent" } : undefined}
      disabled={loading || disabled}
      onClick={onClick}
    >
      {loading && <Spinner fill="whitesmoke" />}
      {text}
    </button>
  );
}
