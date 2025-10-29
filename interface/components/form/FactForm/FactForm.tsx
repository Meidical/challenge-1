"use client";
import React, { useRef } from "react";
import styles from "./FactForm.module.css";
import { CheckBox } from "@/components/form";

import {
  FactorCategory,
  InstructionResponse,
  PrevisionResponse,
} from "@/types";
import CheckBoxContainer from "./CheckBoxContainer";
import { useDataContext, useNotificationContext } from "@/contexts";
import { Delay } from "@/utils";

import DEFAULT_PAYLOAD from "@/test/payload-v2.json";
import { Notification } from "@/components/feedback";

export default function FactForm({ ref }: { ref: React.Ref<HTMLFormElement> }) {
  const {
    currentAddress,
    resetData,
    setIsLoading,
    setIsSuccess,
    setIsError,
    setIsPredictionDone,
    setData,
    setInstructionData,
  } = useDataContext();

  const { pushNotification } = useNotificationContext();

  const requestBody = useRef<any>(DEFAULT_PAYLOAD);

  const addToFactors = (
    category: FactorCategory,
    code: string,
    present: boolean
  ) => {
    if (category === "LEMON") {
      requestBody.current.lemonFactors.find(
        (element) => element.code == code
      ).present = present;
      return;
    }

    if (category === "MOANS") {
      requestBody.current.moansFactors.find(
        (element) => element.code == code
      ).present = present;
      return;
    }

    if (category === "RODS") {
      requestBody.current.rodsFactors.find(
        (element) => element.code == code
      ).present = present;
      return;
    }

    if (category === "SHORT") {
      requestBody.current.shortFactors.find(
        (element) => element.code == code
      ).present = present;
      return;
    }
  };

  async function postData() {
    resetData();
    setIsLoading(true);
    await Delay(1000);
    const url = `${currentAddress.current}/assessment`;
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

      setData(result as PrevisionResponse);
      setInstructionData(result as InstructionResponse);
      console.log(result);

      setIsLoading(false);
      setIsSuccess(true);
      setIsPredictionDone(true);
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
    <form className={styles.form} ref={ref} onSubmit={(e) => submitForm(e)}>
      <div className={styles.checkBoxRow}>
        <CheckBoxContainer
          title="LEMON"
          description="Difficulty when doing laryngoscopy"
        >
          <CheckBox
            label="Look Externaly"
            onChange={(e) => addToFactors("LEMON", "L", e.target.checked)}
          />
          <CheckBox
            label="Evaluate the 3-3-2 Rule"
            onChange={(e) => addToFactors("LEMON", "E", e.target.checked)}
          />
          <CheckBox
            label="Mallampati Score"
            onChange={(e) => addToFactors("LEMON", "M", e.target.checked)}
          />
          <CheckBox
            label="Obstruction or Obesity"
            onChange={(e) => addToFactors("LEMON", "O", e.target.checked)}
          />
          <CheckBox
            label="Neck Mobility"
            onChange={(e) => addToFactors("LEMON", "N", e.target.checked)}
          />
        </CheckBoxContainer>

        <CheckBoxContainer
          title="MOANS"
          description="Difficulty when using oxygen mask"
        >
          <CheckBox
            label="Mask Seal"
            onChange={(e) => addToFactors("MOANS", "M", e.target.checked)}
          />
          <CheckBox
            label="Obstruction"
            onChange={(e) => addToFactors("MOANS", "O", e.target.checked)}
          />
          <CheckBox
            label="Age > 55"
            onChange={(e) => addToFactors("MOANS", "A", e.target.checked)}
          />
          <CheckBox
            label="No Teeth"
            onChange={(e) => addToFactors("MOANS", "N", e.target.checked)}
          />
          <CheckBox
            label="Stiff"
            onChange={(e) => addToFactors("MOANS", "S", e.target.checked)}
          />
        </CheckBoxContainer>

        <CheckBoxContainer
          title="RODS"
          description="Difficulty when using supraglottic device"
        >
          <CheckBox
            label="Restricted Mouth Opening"
            onChange={(e) => addToFactors("RODS", "R", e.target.checked)}
          />
          <CheckBox
            label="Obstruction"
            onChange={(e) => addToFactors("RODS", "O", e.target.checked)}
          />
          <CheckBox
            label="Disrupted or Distorted Airway"
            onChange={(e) => addToFactors("RODS", "D", e.target.checked)}
          />
          <CheckBox
            label="Stiff Lungs or Cervical Spine"
            onChange={(e) => addToFactors("RODS", "S", e.target.checked)}
          />
        </CheckBoxContainer>

        <CheckBoxContainer
          title="SHORT"
          description="Difficulty when executing a cricothyrotomy"
        >
          <CheckBox
            label="Surgery"
            onChange={(e) => addToFactors("SHORT", "S", e.target.checked)}
          />
          <CheckBox
            label="Hematoma"
            onChange={(e) => addToFactors("SHORT", "H", e.target.checked)}
          />
          <CheckBox
            label="Obesity"
            onChange={(e) => addToFactors("SHORT", "O", e.target.checked)}
          />
          <CheckBox
            label="Radiation Distortion"
            onChange={(e) => addToFactors("SHORT", "R", e.target.checked)}
          />
          <CheckBox
            label="Tumor"
            onChange={(e) => addToFactors("SHORT", "T", e.target.checked)}
          />
        </CheckBoxContainer>
      </div>
    </form>
  );
}
