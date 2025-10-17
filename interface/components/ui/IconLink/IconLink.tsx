import Link from "next/link";
import styles from "./IconLink.module.css";
import { Icon, IconProps } from "../Icon";
import { HTMLAttributeAnchorTarget } from "react";

type IconLinkProps = {
  href: string;
  target?: HTMLAttributeAnchorTarget | undefined;
  className?: string;
} & IconProps;

export default function IconLink({
  href,
  target = "_self",
  className = "",
  ...props
}: IconLinkProps) {
  return (
    <Link
      href={href}
      target={target}
      className={`${styles.iconLink} ${className}`}
    >
      <Icon {...props} />
    </Link>
  );
}
