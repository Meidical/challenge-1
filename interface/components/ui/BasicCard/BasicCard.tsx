import { HTMLAttributes, ReactNode } from "react";
import styles from "./BasicCard.module.css";

type BasicCardProps = {
  children?: ReactNode;
  className?: string;
} & HTMLAttributes<HTMLDivElement>;

export default function BasicCard({
  children,
  className = "",
  ...props
}: BasicCardProps) {
  return (
    <div className={`${styles.basicCard} ${className}`} {...props}>
      {children}
    </div>
  );
}
