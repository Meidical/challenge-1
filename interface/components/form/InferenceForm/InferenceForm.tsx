"use client";
import React from "react";
import styles from "./InferenceForm.module.css";
import MnemonicPercentageContainer from "./MnemonicPercentageContainer";

import { useDataContext } from "@/contexts";
import { PrevisionResponse } from "@/types";
import DaPredictionContainer from "./DaPredictionContainer";
import JustificationContainer from "./JustificationContainer";
import InstructionForm from "./InstructionForm";
import ConclusionContainer from "./ConclusionContainer";

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
        <DaPredictionContainer isDa={data.difficultAirwayPredicted} />
        {instructionData && instructionData.nextFactId !== -1 ? (
          <InstructionForm />
        ) : (
          <ConclusionContainer text={instructionData.nextFactDescription} />
        )}
      </div>
      <JustificationContainer />
    </div>
  );
}
