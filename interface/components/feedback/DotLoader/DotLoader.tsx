import styles from "./DotLoader.module.css";
import { HTMLAttributes } from "react";

export default function DotLoader({
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={styles.dotLoader} {...props} />;
}
