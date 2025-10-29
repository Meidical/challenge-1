import { Key, useEffect, useState } from "react";
import styles from "./Notification.module.css";

type Connotation = "Positive" | "Neutral" | "Negative";

type NotificationProps = {
  title?: string;
  description?: string;
  connotation?: Connotation;
  durationInMs?: number;
  key?: Key;
};

export default function Notification({
  title,
  description,
  connotation = "Neutral",
  durationInMs = 3000,
  key,
}: NotificationProps) {
  const [visible, setVisible] = useState(true);
  const GetConnotationStyle = () => {
    if (connotation == "Neutral") return styles.neutral;
    if (connotation == "Negative") return styles.negative;
    return styles.positive;
  };

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), durationInMs);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`${styles.notification} ${GetConnotationStyle()}`}
      key={key}
    >
      {title && <span className={styles.title}>{title}</span>}
      {description && <span className={styles.description}>{description}</span>}
    </div>
  );
}
