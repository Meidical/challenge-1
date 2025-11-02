"use client";
import React, { useEffect, useState } from "react";
import styles from "./JustificationContainer.module.css";
import { Notification } from "@/components/feedback";
import { useDataContext, useNotificationContext } from "@/contexts";

export default function JustificationContainer() {
  const { instructionData, currentAddress } = useDataContext();
  const { pushNotification } = useNotificationContext();

  const [justification, setJustification] = useState<string | null>(null);

  async function getData() {
    const patientID = "1";
    const url = `${currentAddress.current}/explain?patientId=${patientID}&id=${instructionData.justificationId}`;
    try {
      const response = await fetch(url, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const result = await response.json();
      setJustification(result.justification);
      console.log(result);
    } catch (error) {
      pushNotification(
        <Notification
          title="Error"
          description={"Error fetching justification data."}
          connotation="Negative"
        />
      );
    }
  }

  useEffect(() => {
    if (instructionData.nextFactId == -1) {
      getData();
    }
  }, [instructionData]);

  return (
    <div className={styles.justificationContainer}>
      <span className={styles.title}>Justification</span>
      <span className={styles.text}>{justification && justification}</span>
    </div>
  );
}
