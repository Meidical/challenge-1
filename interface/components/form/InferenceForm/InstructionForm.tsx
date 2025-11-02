"use client";
import React, { useRef } from "react";
import styles from "./InstructionForm.module.css";

import { SubmitButton, RadioButton } from "@/components/form";
import { useDataContext, useNotificationContext } from "@/contexts";
import { InstructionPost, InstructionResponse } from "@/types";
import { Delay } from "@/utils";
import { Notification } from "@/components/feedback";

export default function InstructionForm() {
  const {
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
    status: null,
  });

  const setAnswer = (isTrue: boolean) => {
    requestBody.current.status = isTrue ? "SUCCESSFUL" : "FAILED";
    // console.log(requestBody.current);
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
    <form className={styles.form} onSubmit={(e) => submitForm(e)}>
      <div className="column gap-micro">
        <span className={styles.radiogroupTitle}>Recommended Approach</span>
        {instructionData && instructionData.nextFactDescription && (
          <span className={styles.questionText}>
            {`${instructionData.nextFactDescription} was successful?`}
          </span>
        )}
        {instructionData && instructionData.recommendedApproach && (
          <span className={styles.questionText}>
            {`${instructionData.recommendedApproach}.`}
          </span>
        )}
      </div>

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
  );
}
