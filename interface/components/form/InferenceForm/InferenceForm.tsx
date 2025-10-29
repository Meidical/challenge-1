"use client";
import React from "react";
import styles from "./InferenceForm.module.css";
import MnemonicPercentageContainer from "./MnemonicPercentageContainer";

import { SubmitButton, RadioButton } from "@/components/form";
import { useDataContext } from "@/contexts";
import { PrevisionResponse } from "@/types";
import DaPredictionContainer from "./DaPredictionContainer";
import JustificationContainer from "./JustificationContainer";

export default function InferenceForm() {
  const { data, instructionData } = useDataContext();

  const LEMON_PERCENT: number = Math.floor(
    (data as PrevisionResponse).lemonCF * 100
  );
  const MOANS_PERCENT: number = Math.floor(
    (data as PrevisionResponse).moansCF * 100
  );
  const RODS_PERCENT: number = Math.floor(
    (data as PrevisionResponse).rodsCF * 100
  );
  const SHORT_PERCENT: number = Math.floor(
    (data as PrevisionResponse).shortCF * 100
  );

  return (
    <div className={styles.form}>
      <div className={styles.leftContainer}>
        <MnemonicPercentageContainer
          title="LEMON"
          description="Difficulty when doing laryngoscopy"
          percentage={LEMON_PERCENT}
        />
        <MnemonicPercentageContainer
          title="MOANS"
          description="Difficulty when using oxygen mask"
          percentage={MOANS_PERCENT}
        />
        <MnemonicPercentageContainer
          title="RODS"
          description="Difficulty when using supraglottic device"
          percentage={RODS_PERCENT}
        />
        <MnemonicPercentageContainer
          title="SHORT"
          description="Difficulty when executing a cricothyrotomy"
          percentage={SHORT_PERCENT}
        />
      </div>
      <div className={styles.centerContainer}>
        <JustificationContainer text={"helllo, this is a description."} />
        <DaPredictionContainer isDa={data.difficultAirwayPredicted} />
      </div>
      <form
        className={styles.rightContainer}
        onSubmit={(e) => e.preventDefault()}
      >
        <span className={styles.questionText}>
          {`${instructionData.nextFactDescription} was successful?`}
        </span>
        <span className={styles.questionText}>
          {instructionData.recommendedApproach}
        </span>
        <div className={styles.radiogroup}>
          <RadioButton label="Yes" className="flex" name="question_response" />
          <RadioButton label="No" className="flex" name="question_response" />
        </div>
        <SubmitButton text="Continue" />
      </form>
    </div>
  );
}
