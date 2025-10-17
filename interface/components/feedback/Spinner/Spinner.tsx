import { Icon } from "@/components/ui";
import styles from "./Spinner.module.css";

type SpinnerProps = {
  fill?: string;
  size?: number;
};

export default function Spinner({ fill, size = 18 }: SpinnerProps) {
  return (
    <div className={styles.spinner}>
      <Icon
        className={styles.rotate}
        iconName="spinner"
        size={size}
        fill={fill}
      />
    </div>
  );
}
