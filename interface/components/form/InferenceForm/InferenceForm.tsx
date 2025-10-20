"use client";
import React, { useMemo, useState } from "react";
import styles from "./InferenceForm.module.css";
import { BasicCard, Button } from "@/components/ui";
import { useRouter } from "next/navigation";

export default function InferenceForm() {
  const router = useRouter();
  type Answer = "yes" | "no" | null;
  type Step = "q1" | "q2" | "q3Vent" | "qEmergency";

  const [answers, setAnswers] = useState<{ q1: Answer; q2: Answer; q3Vent: Answer; qEmergency: Answer }>({
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
    if (answers.q1 !== "yes") return "Procedimento: Laringoscopia";
    if (answers.q2 === "yes") return "Procedimento: Fibroscopia intubação";
    return "Procedimento: SUPRAGLÓTICO";
  }, [answers.q1, answers.q2]);

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
        setFinalOutcome(q3Vent === "yes" ? "Tente entubar o paciente." : "Tentar acordar o paciente.");
        break;
      }
      case "qEmergency": {
        const qEmergency = value;
        setAnswers((prev) => ({ ...prev, qEmergency }));
        setFinalOutcome(qEmergency === "yes" ? "Técnica Invasiva (Cricotirotomia)." : "Acordar o paciente.");
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
        router.back();
        break;
      case "q2":
        setStep("q1");
        setAnswers({ q1: answers.q1, q2: null, q3Vent: null, qEmergency: null });
        setIntermediateNote(null);
        break;
      case "q3Vent":
        setStep("q2");
        setAnswers((prev) => ({ ...prev, q2: answers.q2, q3Vent: null }));
        break;
      case "qEmergency":
        setStep("q2");
        setAnswers((prev) => ({ ...prev, q2: answers.q2, qEmergency: null }));
        setIntermediateNote("Oxigenar e ventilar.");
        break;
    }
  };

  return (
    <BasicCard className={styles.cardFrame}>
      <form className={styles.formFrame} onSubmit={(e) => e.preventDefault()}>
        <div className={styles.systemBar}>
          <h3 className={styles.formText}>DAP - Dificult Airway Predictor</h3>
          <Button text="Back" type="button" onClick={handleBack} />
        </div>

        <div className={`${styles.qaContainer} row gap-md`}>
          {/* Left: Percentages placeholders */}
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

          {/* Right: Single question view and final result */}
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

                {currentAnswer ? (
                  <div className={styles.answerMeta}>
                    Resposta: {currentAnswer === "yes" ? "Sim" : "Não"}
                  </div>
                ) : null}
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
        </div>
      </form>
    </BasicCard>
  );
}
