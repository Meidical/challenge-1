import Link from "next/link";
import styles from "./ExternalLink.module.css";

type ExternalLinkProps = {
  text: string;
  href: string;
};

export default function ExternalLink({ text, href }: ExternalLinkProps) {
  return (
    <Link className={styles.externalLink} href={href} target="_blank">
      {text}
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6.4244 6.00844C6.4244 5.4515 6.87533 5 7.4316 5H15.9778C15.9776 5 15.9779 5 15.9778 5H15.9928C16.5491 5 17 5.4515 17 6.00844V14.5802C17 15.1372 16.5491 15.5886 15.9928 15.5886C15.4365 15.5886 14.9856 15.1372 14.9856 14.5802V8.42821L6.7194 16.7046C6.32607 17.0985 5.68834 17.0985 5.29501 16.7046C4.90166 16.3108 4.90166 15.6722 5.29501 15.2784L13.5464 7.01689H7.4316C6.87533 7.01689 6.4244 6.5654 6.4244 6.00844Z"
          fill="white"
        />
      </svg>
    </Link>
  );
}
