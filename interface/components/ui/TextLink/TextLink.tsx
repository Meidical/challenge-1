import Link from "next/link";
import styles from "./TextLink.module.css";

type TextLinkProps = {
  text: string;
  href: string;
};

export default function TextLink({ text, href }: TextLinkProps) {
  return (
    <Link className={styles.link} href={href}>
      {text}
    </Link>
  );
}
