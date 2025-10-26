"use client";
import React from "react";
import styles from "./SwitchButton.module.css";
import { Icon, IconName } from "../Icon";

type SwitchButtonProps = {
  textLeft?: string;
  textRight?: string;
  className?: string;
  switched?: boolean;
  onChange?: (switched: boolean) => void;
  switchIconLeft?: IconName;
  switchIconRight?: IconName;
};

export default function SwitchButton({
  textLeft = "Item 1",
  textRight = "Item 2",
  className = "",
  switched = false,
  onChange = () => {},
  switchIconLeft = "prolog",
  switchIconRight = "drools",
}: SwitchButtonProps) {
  const [isSwitched, setIsSwitched] = React.useState(switched);

  const handleClick = () => {
    onChange(!isSwitched);
    setIsSwitched(!isSwitched);
  };

  return (
    <div className={styles.wrapper}>
      <span className={isSwitched ? styles.textInactive : styles.textActive}>
        {textLeft}
      </span>
      <button
        className={`${styles.switchButton} ${className}`}
        type="button"
        onClick={handleClick}
      >
        <div className={isSwitched ? styles.switchRight : styles.switch}>
          <Icon
            fill="white"
            stroke="white"
            iconName={isSwitched ? switchIconRight : switchIconLeft}
            size={16}
          />
        </div>
      </button>
      <span className={isSwitched ? styles.textActive : styles.textInactive}>
        {textRight}
      </span>
    </div>
  );
}
