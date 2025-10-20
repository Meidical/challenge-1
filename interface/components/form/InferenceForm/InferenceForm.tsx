"use client";
import React from "react";
import styles from "./InferenceForm.module.css";
import { BasicCard, Button } from "@/components/ui";

export default function InferenceForm() {
  return (
    <BasicCard className={styles.cardFrame}>
      <form className={styles.formFrame} onSubmit={(e) => e.preventDefault()}>
        <div className={styles.systemBar}>
          <h3 className={styles.formText}>DAP - Dificult Airway Predictor</h3>
          <Button text="Back" />
        </div>
        <div className="row gap-md">
          <div className="column gap-md flex">
            <div className={styles.intermediateContainer}></div>
            <div className={styles.conclusionContainer}></div>
          </div>
          <div className={styles.justificationContainer}></div>
        </div>
      </form>
    </BasicCard>
  );
}
