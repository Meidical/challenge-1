"use client";
import React, { useMemo, useState } from "react";
import styles from "./InferenceForm.module.css";
import MnemonicPercentageContainer from "./MnemonicPercentageContainer";

import { SubmitButton, RadioButton } from "@/components/form";
import { useDataContext } from "@/contexts";
import { PrevisionResponse } from "@/types";

export default function InferenceForm() {
  const { data } = useDataContext();

  const LEMON_PERCENT: number = (data as PrevisionResponse).lemonCF * 100;
  const MOANS_PERCENT: number = (data as PrevisionResponse).moansCF * 100;
  const RODS_PERCENT: number = (data as PrevisionResponse).rodsCF * 100;
  const SHORT_PERCENT: number = (data as PrevisionResponse).shortCF * 100;

  //##########################################################
  type Answer = "yes" | "no" | null;
  type Step = "q1" | "q2" | "q3Vent" | "qEmergency";

  const [answers, setAnswers] = useState<{
    q1: Answer;
    q2: Answer;
    q3Vent: Answer;
    qEmergency: Answer;
  }>({
    q1: null,
    q2: null,
    q3Vent: null,
    qEmergency: null,
  });
  const [step, setStep] = useState<Step>("q1");
  const [finalOutcome, setFinalOutcome] = useState<string | null>(null);
  const [intermediateNote, setIntermediateNote] = useState<string | null>(null);

  const questionLabel = useMemo(() => {
    switch (step) {
      case "q1":
        return "Laringoscopia foi difícil?";
      case "q2":
        return "Possível entubar?";
      case "q3Vent":
        return "Foi possível ventilar?";
      case "qEmergency":
        return "É uma emergência?";
    }
  }, [step]);

  const procedureLabel = useMemo(() => {
    switch (step) {
      case "q1":
        return "Procedimento: Laringoscopia";
      case "q2":
        return "Procedimento: SUPRAGLÓTICO";
      case "q3Vent":
        return "Procedimento: Fibroscopia intubação";
      case "qEmergency":
        return "Procedimento: SUPRAGLÓTICO";
    }
  }, [step]);

  const stepsOrder: Step[] = useMemo(() => {
    if (answers.q1 !== "yes") return ["q1"]; // ends after q1 if 'no'
    if (answers.q2 === null) return ["q1", "q2"]; // haven't decided yet
    if (answers.q2 === "yes") return ["q1", "q2", "q3Vent"]; // ventilation path
    return ["q1", "q2", "qEmergency"]; // emergency path
  }, [answers.q1, answers.q2]);

  const stepIndex = stepsOrder.indexOf(step);
  const currentAnswer = answers[step];

  const handleAnswer = (value: Exclude<Answer, null>) => {
    if (finalOutcome) return;

    switch (step) {
      case "q1": {
        const q1 = value;
        setAnswers({ q1, q2: null, q3Vent: null, qEmergency: null });
        setIntermediateNote(null);
        if (q1 === "no") {
          setFinalOutcome("Sequência concluída.");
          setStep("q1");
        } else {
          setStep("q2");
        }
        break;
      }
      case "q2": {
        const q2 = value;
        setAnswers((prev) => ({ ...prev, q2, q3Vent: null, qEmergency: null }));
        if (q2 === "no") {
          setIntermediateNote("Oxigenar e ventilar.");
          setStep("qEmergency");
        } else {
          setIntermediateNote(null);
          setStep("q3Vent");
        }
        break;
      }
      case "q3Vent": {
        const q3Vent = value;
        setAnswers((prev) => ({ ...prev, q3Vent }));
        setFinalOutcome(
          q3Vent === "yes"
            ? "Tente entubar o paciente."
            : "Tentar acordar o paciente."
        );
        break;
      }
      case "qEmergency": {
        const qEmergency = value;
        setAnswers((prev) => ({ ...prev, qEmergency }));
        setFinalOutcome(
          qEmergency === "yes"
            ? "Técnica Invasiva (Cricotirotomia)."
            : "Acordar o paciente."
        );
        break;
      }
    }
  };

  const handleBack = () => {
    if (finalOutcome) {
      setFinalOutcome(null);
      // Return to last step based on current answers
      if (answers.q1 !== "yes") {
        setStep("q1");
      } else if (answers.q2 === "yes") {
        setStep("q3Vent");
      } else {
        setStep("qEmergency");
      }
      return;
    }

    switch (step) {
      case "q1":
        break;
      case "q2":
        setStep("q1");
        setAnswers({
          q1: answers.q1,
          q2: null,
          q3Vent: null,
          qEmergency: null,
        });
        setIntermediateNote(null);
        break;
      case "q3Vent":
        setStep("q2");
        setAnswers((prev) => ({ ...prev, q2: answers.q2, q3Vent: null }));
        break;
      case "qEmergency":
        setStep("q2");
        setAnswers((prev) => ({ ...prev, q2: answers.q2, qEmergency: null }));
        setIntermediateNote(null);
        break;
    }
  };

  //##########################################################
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
      <form
        className={styles.rightContainer}
        onSubmit={(e) => e.preventDefault()}
      >
        <span className={styles.questionText}>
          Did the entubation went well?
        </span>
        <div className={styles.radiogroup}>
          <RadioButton label="Yes" className="flex" name="question_response" />
          <RadioButton label="No" className="flex" name="question_response" />
        </div>
        <SubmitButton text="Continue" />
      </form>
      {/* <div className={`${styles.qaContainer} row gap-md`}>
        <div className={`${styles.qaColumn} ${styles.questionsCol}`}>
          <div className={styles.questionItem}>
            <span className={styles.questionIndex}>LEMON</span>
            <span className={styles.questionText}>—%</span>
          </div>
          <div className={styles.questionItem}>
            <span className={styles.questionIndex}>MOANS</span>
            <span className={styles.questionText}>—%</span>
          </div>
          <div className={styles.questionItem}>
            <span className={styles.questionIndex}>RODS</span>
            <span className={styles.questionText}>—%</span>
          </div>
          <div className={styles.questionItem}>
            <span className={styles.questionIndex}>SHORT</span>
            <span className={styles.questionText}>—%</span>
          </div>
        </div>

        <div className={`${styles.qaColumn} ${styles.answersCol}`}>
          {!finalOutcome ? (
            <>
              <div className={styles.procedureTitle}>{procedureLabel}</div>
              <div className={styles.questionHeader}>
                <div className={styles.questionText}>{questionLabel}</div>
              </div>
              {intermediateNote && (
                <div className={styles.infoPanel}>
                  <div className={styles.panelTitle}>Indicação</div>
                  <div>{intermediateNote}</div>
                </div>
              )}
              <div
                className={styles.radioGroupCentered}
                role="radiogroup"
                aria-label={`Resposta da pergunta ${stepIndex + 1}`}
              >
                <label className={styles.radioOption}>
                  <input
                    type="radio"
                    name={`q-${step}`}
                    value="yes"
                    checked={currentAnswer === "yes"}
                    onChange={() => handleAnswer("yes")}
                  />
                  <span>Sim</span>
                </label>
                <label className={styles.radioOption}>
                  <input
                    type="radio"
                    name={`q-${step}`}
                    value="no"
                    checked={currentAnswer === "no"}
                    onChange={() => handleAnswer("no")}
                  />
                  <span>Não</span>
                </label>
              </div>
            </>
          ) : (
            <>
              <div className={styles.procedureTitle}>Resultado</div>
              <div className={styles.resultPanel}>
                <div className={styles.resultText}>{finalOutcome}</div>
              </div>
            </>
          )}
        </div>
      </div> */}
    </div>
  );
}
