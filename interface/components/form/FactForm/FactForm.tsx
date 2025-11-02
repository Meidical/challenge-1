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

  const requestBody = useRef(structuredClone(DEFAULT_PAYLOAD));

  const changeFactor = (
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
    console.log("request: ", requestBody.current);
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
      console.log("response: ", result);

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
            onChange={(e) => changeFactor("LEMON", "L", e.target.checked)}
          />
          <CheckBox
            label="Evaluate the 3-3-2 Rule"
            onChange={(e) => changeFactor("LEMON", "E", e.target.checked)}
          />
          <CheckBox
            label="Mallampati Score"
            onChange={(e) => changeFactor("LEMON", "M", e.target.checked)}
          />
          <CheckBox
            label="Obstruction or Obesity"
            onChange={(e) => changeFactor("LEMON", "O", e.target.checked)}
          />
          <CheckBox
            label="Neck Mobility"
            onChange={(e) => changeFactor("LEMON", "N", e.target.checked)}
          />
        </CheckBoxContainer>

        <CheckBoxContainer
          title="MOANS"
          description="Difficulty when using oxygen mask"
        >
          <CheckBox
            label="Mask Seal"
            onChange={(e) => changeFactor("MOANS", "M", e.target.checked)}
          />
          <CheckBox
            label="Obstruction"
            onChange={(e) => changeFactor("MOANS", "O", e.target.checked)}
          />
          <CheckBox
            label="Age > 55"
            onChange={(e) => changeFactor("MOANS", "A", e.target.checked)}
          />
          <CheckBox
            label="No Teeth"
            onChange={(e) => changeFactor("MOANS", "N", e.target.checked)}
          />
          <CheckBox
            label="Stiff"
            onChange={(e) => changeFactor("MOANS", "S", e.target.checked)}
          />
        </CheckBoxContainer>

        <CheckBoxContainer
          title="RODS"
          description="Difficulty when using supraglottic device"
        >
          <CheckBox
            label="Restricted Mouth Opening"
            onChange={(e) => changeFactor("RODS", "R", e.target.checked)}
          />
          <CheckBox
            label="Obstruction"
            onChange={(e) => changeFactor("RODS", "O", e.target.checked)}
          />
          <CheckBox
            label="Disrupted or Distorted Airway"
            onChange={(e) => changeFactor("RODS", "D", e.target.checked)}
          />
          <CheckBox
            label="Stiff Lungs or Cervical Spine"
            onChange={(e) => changeFactor("RODS", "S", e.target.checked)}
          />
        </CheckBoxContainer>

        <CheckBoxContainer
          title="SHORT"
          description="Difficulty when executing a cricothyrotomy"
        >
          <CheckBox
            label="Surgery"
            onChange={(e) => changeFactor("SHORT", "S", e.target.checked)}
          />
          <CheckBox
            label="Hematoma"
            onChange={(e) => changeFactor("SHORT", "H", e.target.checked)}
          />
          <CheckBox
            label="Obesity"
            onChange={(e) => changeFactor("SHORT", "O", e.target.checked)}
          />
          <CheckBox
            label="Radiation Distortion"
            onChange={(e) => changeFactor("SHORT", "R", e.target.checked)}
          />
          <CheckBox
            label="Tumor"
            onChange={(e) => changeFactor("SHORT", "T", e.target.checked)}
          />
        </CheckBoxContainer>
      </div>
    </form>
  );
}
