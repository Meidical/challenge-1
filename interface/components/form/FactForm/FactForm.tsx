"use client";
import React, { useRef } from "react";
import styles from "./FactForm.module.css";
import { SubmitButton, CheckBox } from "@/components/form";
import { BasicCard } from "@/components/ui";

import { SwitchButton } from "@/components/ui";
import { Factor, FactorCategory } from "@/types";
import { GetSystemAddress } from "@/lib";
import Image from "next/image";
import CheckBoxContainer from "./CheckBoxContainer";

export default function FactForm() {
  const [isLoading, setIsLoading] = React.useState(false);
  const systemAddress = useRef(GetSystemAddress("PROLOG"));
  const requestBody = useRef({
    lemonFactors: [],
    moansFactors: [],
    rodsFactors: [],
    shortFactors: [],
  });

  const addToFactors = (
    category: FactorCategory,
    code: string,
    isPresent: boolean
  ) => {
    const factor: Factor = { category, code, isPresent };

    if (category === "LEMON") {
      requestBody.current.lemonFactors.push(factor);
      return;
    }

    if (category === "MOANS") {
      requestBody.current.moansFactors.push(factor);
      return;
    }

    if (category === "RODS") {
      requestBody.current.rodsFactors.push(factor);
      return;
    }

    if (category === "SHORT") {
      requestBody.current.shortFactors.push(factor);
      return;
    }
  };

  const switchAddress = (switched: boolean) => {
    systemAddress.current = switched
      ? GetSystemAddress("DROLLS")
      : GetSystemAddress("PROLOG");
  };

  const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({ ...requestBody.current });
    console.log(systemAddress.current);
  };

  return (
    <BasicCard className={styles.card}>
      <div className={styles.systemBar}>
        <Image
          className={styles.logo}
          src="/assets/svgs/dap-logo-abreviated.svg"
          alt="Dap Logo"
          width={1131}
          height={740}
        />
        <div className="row gap-md">
          <SwitchButton
            textLeft="Prolog"
            textRight="Drools"
            onChange={(switched) => switchAddress(switched)}
          />
          <SubmitButton
            text="Confirm"
            form="fact-form"
            onClick={() => setIsLoading(true)}
            loading={isLoading}
          />
        </div>
      </div>

      <form
        className={styles.form}
        id="fact-form"
        onSubmit={(e) => submitForm(e)}
      >
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
    </BasicCard>
  );
}
