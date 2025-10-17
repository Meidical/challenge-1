import Link from "next/link";
import styles from "./IconLink.module.css";
import { Icon, IconProps } from "../Icon";

export default function BlogLink({ ...props }: IconProps) {
  return (
    <Link
      href="https://luismagalhaes3lm-fyalg.wordpress.com/"
      target="_blank"
      className={styles.iconLink}
    >
      <Icon iconName="globe" {...props} />
    </Link>
  );
}
