"use client";
import React, { useRef } from "react";
import styles from "./SystemBody.module.css";
import { FactForm, InferenceForm, SubmitButton } from "@/components/form";
import { BasicCard, Button, SwitchButton } from "@/components/ui";

import { GetSystemAddress } from "@/lib";
import Image from "next/image";
import delay from "@/utils/delay";

export default function SystemBody() {
  const [isFirstFase, setIsFirstFase] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);

  const systemAddress = useRef(GetSystemAddress("PROLOG"));

  const formRef = React.useRef<HTMLFormElement>(null);

  const switchAddress = (switched: boolean) => {
    systemAddress.current = switched
      ? GetSystemAddress("DROLLS")
      : GetSystemAddress("PROLOG");
  };

  const handleSubmit = async () => {
    //Unica maneira de submeter o form a partir de fora ativando o onSubmit
    formRef.current?.dispatchEvent(
      new Event("submit", { bubbles: true, cancelable: true })
    );
    setIsLoading(true);
    await delay(2000);
    setIsFirstFase(false);
    setIsLoading(false);
  };

  const handleBack = () => {
    setIsFirstFase(true);
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
          {isFirstFase ? (
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
      {isFirstFase ? <FactForm ref={formRef} /> : <InferenceForm />}
    </BasicCard>
  );
}
