"use client";
import React, { useRef } from "react";
import styles from "./InferenceForm.module.css";
import MnemonicPercentageContainer from "./MnemonicPercentageContainer";

import { SubmitButton, RadioButton } from "@/components/form";
import { useDataContext, useNotificationContext } from "@/contexts";
import {
  InstructionPost,
  InstructionResponse,
  PrevisionResponse,
} from "@/types";
import DaPredictionContainer from "./DaPredictionContainer";
import JustificationContainer from "./JustificationContainer";
import { Delay } from "@/utils";
import { Notification } from "@/components/feedback";

export default function InferenceForm() {
  const {
    data,
    instructionData,
    isLoading,
    setIsLoading,
    currentAddress,
    setInstructionData,
    setIsSuccess,
    setIsError,
  } = useDataContext();
  const { pushNotification } = useNotificationContext();

  const requestBody = useRef<InstructionPost>({
    nextFactId: instructionData.nextFactId,
    status: null,
  });

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

  const setAnswer = (isTrue: boolean) => {
    requestBody.current.status = isTrue ? "SUCCESSFULL" : "FAILED";
    console.log(requestBody.current);
  };

  async function postData() {
    // resetInstructionData ?
    setIsLoading(true);
    await Delay(500);
    const url = `${currentAddress.current}/assessment`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify("requestBody.current"),
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const result = await response.json();

      setInstructionData(result as InstructionResponse);
      console.log(result);

      setIsLoading(false);
      setIsSuccess(true);
    } catch (error) {
      setIsLoading(false);
      setIsError(true);
      pushNotification(
        <Notification
          title="Error"
          description={error.message + "."}
          connotation="Negative"
        />
      );
    }
  }

  const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    postData();
  };

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
        <JustificationContainer text={"Justification not provided."} />
        <DaPredictionContainer isDa={data.difficultAirwayPredicted} />
      </div>
      <form className={styles.rightContainer} onSubmit={(e) => submitForm(e)}>
        <span className={styles.questionText}>
          {`${instructionData.nextFactDescription} was successful?`}
        </span>
        <span className={styles.questionText}>
          {instructionData.recommendedApproach}
        </span>
        <div className={styles.radiogroup}>
          <RadioButton
            label="Yes"
            className="flex"
            name="question_response"
            onChange={() => setAnswer(true)}
          />
          <RadioButton
            label="No"
            className="flex"
            name="question_response"
            onChange={() => setAnswer(false)}
          />
        </div>
        <SubmitButton text="Continue" loading={isLoading} />
      </form>
    </div>
  );
}
