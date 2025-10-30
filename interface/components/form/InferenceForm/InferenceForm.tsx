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
    // resetInstructionData,
    isLoading,
    setIsLoading,
    currentAddress,
    setInstructionData,
    setIsSuccess,
    setIsError,
  } = useDataContext();
  const { pushNotification } = useNotificationContext();

  const requestBody = useRef<InstructionPost>({
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
    requestBody.current.status = isTrue ? "SUCCESSFUL" : "FAILED";
    console.log(requestBody.current);
  };

  async function postData() {
    setIsLoading(true);
    await Delay(500);
    const patientID = "1";
    const url = `${currentAddress.current}/assessment/${patientID}/facts/${instructionData.nextFactId}`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody.current),
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const result = await response.json();

      // resetInstructionData();
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
          {instructionData &&
            `nextFactDescription: ${instructionData.nextFactDescription} was successful?`}
        </span>
        <span className={styles.questionText}>
          {`recommendedApproach: ${
            instructionData && instructionData.recommendedApproach
          } was successful?`}
        </span>
        <span className={styles.radiogroupTitle}>Status of Procedure</span>
        <div className={styles.radiogroup}>
          <RadioButton
            label="Successful"
            className="flex"
            name="question_response"
            onChange={() => setAnswer(true)}
          />
          <RadioButton
            label="Failed"
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
