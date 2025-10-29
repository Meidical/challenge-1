"use client";
import React, { useEffect, useState } from "react";
import styles from "./Footer.module.css";
import Image from "next/image";
import { ExternalLink, GithubLink } from "@/components/ui";
import { DotLoader } from "@/components/feedback";
import BlogLink from "@/components/ui/IconLink/BlogLink";

export default function Footer() {
  const [updateText, setUpdatetext] = useState<string | null>(null);

  const getUpdate = async () => {
    const lastCommitUrl =
      "https://api.github.com/repos/Meidical/challenge-1/commits?per_page=1";

    try {
      const response = await fetch(lastCommitUrl);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const result = await response.json();
      const date = new Date(result[0].commit.author.date);

      const updateText = `Last updated on ${date.toUTCString()}`;

      setUpdatetext(updateText);
    } catch (error: unknown) {
      console.error(error);
      setUpdatetext("Update date Unavailable");
    }
  };

  useEffect(() => {
    getUpdate();
  }, []);

  return (
    <footer className={styles.footer}>
      <div className="gap-micro column relative">
        <p className={styles.copyrightText}>
          © 2025 Meidical. All Rights Reserved
        </p>
        {updateText ? (
          <p className={styles.lastUpdateDateText}>{updateText}</p>
        ) : (
          <div className={`${styles.loaderFrame} relative`}>
            {"0"}
            <DotLoader />
          </div>
        )}
      </div>
      <div className={styles.socialsFrame}>
        <BlogLink size={24} />
        <GithubLink size={24} />
      </div>
    </footer>
  );
}
