"use client";
import React, { useRef } from "react";
import styles from "./SystemBody.module.css";
import { FactForm, InferenceForm, SubmitButton } from "@/components/form";
import { BasicCard, Button, SwitchButton } from "@/components/ui";

import { GetSystemAddress } from "@/lib";
import Image from "next/image";
import { useDataContext, useNotificationContext } from "@/contexts";
import { Notification } from "@/components/feedback";

export default function SystemBody() {
  const { currentAddress, fullReset, isLoading, isPredictionDone } =
    useDataContext();
  const { pushNotification } = useNotificationContext();

  const formRef = useRef<HTMLFormElement>(null);

  const switchAddress = (switched: boolean) => {
    currentAddress.current = switched
      ? GetSystemAddress("DROLLS")
      : GetSystemAddress("PROLOG");

    pushNotification(
      <Notification
        title="Engine Switched"
        description={`Rule engine changed to ${
          switched ? "DROOLS" : "PROLOG"
        }!`}
        durationInMs={4000}
      />
    );
  };

  const handleSubmit = async () => {
    //Unica maneira de submeter o form a partir de fora ativando o onSubmit
    formRef.current?.dispatchEvent(
      new Event("submit", { bubbles: true, cancelable: true })
    );
  };

  const handleBack = () => {
    fullReset();
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
          {!isPredictionDone ? (
            <SubmitButton
              text="Confirm"
              form="fact-form"
              onClick={handleSubmit}
              loading={isLoading}
            />
          ) : (
            <Button text="Back" onClick={handleBack} />
          )}
        </div>
      </div>
      {!isPredictionDone ? <FactForm ref={formRef} /> : <InferenceForm />}
    </BasicCard>
  );
}
