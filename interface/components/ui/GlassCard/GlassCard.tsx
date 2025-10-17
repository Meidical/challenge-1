import { HTMLAttributes, ReactNode } from "react";
import styles from "./GlassCard.module.css";

type GlassCardProps = {
  children?: ReactNode;
  className?: string;
} & HTMLAttributes<HTMLDivElement>;

export default function GlassCard({
  children,
  className = "",
  ...props
}: GlassCardProps) {
  return (
    <div className={`${styles.glassCard} ${className}`} {...props}>
      {children}
    </div>
  );
}
