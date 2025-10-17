"use client";
import React from "react";
import styles from "./FactForm.module.css";
import { MultilineInput, SubmitButton, TextInput } from "@/components/form";
import { BasicCard } from "@/components/ui";
import { delay } from "@/utils/delay";

import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SwitchButton } from "@/components/ui/SwitchButton";
import { CheckBox } from "../CheckBox";

const schema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(50, "Name can't be longer than 50 letters"),
  email: z.email("Invalid Email").optional().or(z.literal("")),
  message: z
    .string()
    .min(1, "Message is required")
    .max(320, "Message can't be longer than 320 letters"),
});

type FormData = z.infer<typeof schema>;

export default function FactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
      isSubmitting,
      isSubmitted,
      isSubmitSuccessful,
      isValid,
    },
  } = useForm<FormData>({ resolver: zodResolver(schema), mode: "onChange" });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    await delay(500);
    try {
      console.log(data);
      reset();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <BasicCard className={styles.cardFrame}>
      <form className={styles.formFrame} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.systemBar}>
          <h3 className={styles.formText}>DAP - Dificult Airway Predictor</h3>
          <div className="row gap-md">
            <SwitchButton textLeft="Prolog" textRight="Drools" />
            <SubmitButton
              text="Confirm"
              loading={isSubmitting}
              disabled={isSubmitted && !isValid}
            />
          </div>
        </div>

        <div
          className={`${styles.checkBoxRow} ${isSubmitSuccessful && "hidden"}`}
        >
          <div className={styles.checkBoxListContainer}>
            <span className={styles.mnemonicText}>LEMON</span>
            <div className={styles.checkBoxList}>
              <CheckBox label="Look Externaly" />
              <CheckBox label="Evaluate the 3-3-2 Rule" />
              <CheckBox label="Mallampati Score" />
              <CheckBox label="Obstruction/Obesity" />
              <CheckBox label="Neck Mobility" />
            </div>
          </div>

          <div className={styles.checkBoxListContainer}>
            <span className={styles.mnemonicText}>MOANS</span>
            <div className={styles.checkBoxList}>
              <CheckBox label="Mask Seal" />
              <CheckBox label="Obstruction" />
              <CheckBox label="Age > 55" />
              <CheckBox label="No Teeth" />
              <CheckBox label="Stiff" />
            </div>
          </div>

          <div className={styles.checkBoxListContainer}>
            <span className={styles.mnemonicText}>RODS</span>
            <div className={styles.checkBoxList}>
              <CheckBox label="Restricted Mouth Opening" />
              <CheckBox label="Obstruction" />
              <CheckBox label="Disrupted or Distorted Airway" />
              <CheckBox label="Stiff Lungs or Cervical Spine" />
            </div>
          </div>

          <div className={styles.checkBoxListContainer}>
            <span className={styles.mnemonicText}>SHORT</span>
            <div className={styles.checkBoxList}>
              <CheckBox label="Surgery" />
              <CheckBox label="Hematoma" />
              <CheckBox label="Obesity" />
              <CheckBox label="Radiation Distortion" />
              <CheckBox label="Tumor" />
            </div>
          </div>
          {/* <TextInput
            {...register("name")}
            label="Name"
            placeholder="Your Name"
            {...(isSubmitted && { error: errors.name?.message })}
          />
          <TextInput
            {...register("email")}
            label="Email (optional)"
            placeholder="name@domain.com"
            {...(isSubmitted && { error: errors.email?.message })}
          />
          <MultilineInput
            {...register("message")}
            placeholder="Your Message"
            label="Message"
            rows={5}
            maxLength={320}
            {...(isSubmitted && { error: errors.message?.message })}
          /> */}
        </div>
      </form>
    </BasicCard>
  );
}
