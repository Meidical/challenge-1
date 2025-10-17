import { HTMLAttributes, ReactNode } from "react";
import styles from "./GlassContainer.module.css";

type GlassContainerProps = {
  children?: ReactNode;
  className?: string;
} & HTMLAttributes<HTMLDivElement>;

export default function GlassContainer({
  children,
  className = "",
  ...props
}: GlassContainerProps) {
  return (
    <div className={`${styles.glassContainer} ${className}`} {...props}>
      {children}
    </div>
  );
}
