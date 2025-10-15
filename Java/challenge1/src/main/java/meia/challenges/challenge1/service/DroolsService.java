package meia.challenges.challenge1.service;

import meia.challenges.challenge1.facts.LaryngoscopyOutcomeRequest;
import org.kie.api.runtime.KieContainer;
import org.kie.api.runtime.KieSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import meia.challenges.challenge1.facts.PatientAirwayAssessment;
import meia.challenges.challenge1.facts.AssessmentFactor;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class DroolsService {

    @Autowired
    private KieContainer kieContainer;
    private final Map<String, PatientAirwayAssessment> patientAssessments = new ConcurrentHashMap<>();
    private final Map<String, LaryngoscopyOutcomeRequest> laryngoscopyAssessments = new ConcurrentHashMap<>();
    private final Map<String, KieSession> patientSessions = new ConcurrentHashMap<>();

    public LaryngoscopyOutcomeRequest setLaryngoscopyOutcomeRequest(LaryngoscopyOutcomeRequest assessment) {
        String patientId = assessment.getPatientId();
        laryngoscopyAssessments.put(patientId, assessment);
        KieSession kieSession = getOrCreateSession(patientId);

        try {
            kieSession.insert(assessment);

            // Also insert the corresponding PatientAirwayAssessment
            PatientAirwayAssessment patientAssessment = patientAssessments.get(patientId);
            if (patientAssessment != null) {
                kieSession.insert(patientAssessment);
            }
            kieSession.fireAllRules();
            return assessment;
        } finally {
            disposeSession(patientId);
        }
    }

    /**
     * Evaluates airway assessment for a patient using certainty factors
     * @param assessment The patient assessment with individual factors
     * @return The evaluated assessment with overall certainty factors
     */
    public PatientAirwayAssessment evaluateAirwayAssessment(PatientAirwayAssessment assessment) {
        String patientId = assessment.getPatientId();
        patientAssessments.put(patientId, assessment);
        KieSession kieSession = getOrCreateSession(patientId);

        try {
            kieSession.insert(assessment);

            // Insert all the individual factors
            for (AssessmentFactor factor : assessment.getLemonFactors()) {
                kieSession.insert(factor);
            }

            for (AssessmentFactor factor : assessment.getMoansFactors()) {
                kieSession.insert(factor);
            }

            for (AssessmentFactor factor : assessment.getRodsFactors()) {
                kieSession.insert(factor);
            }

            for (AssessmentFactor factor : assessment.getShortFactors()) {
                kieSession.insert(factor);
            }

            // Fire all rules
            kieSession.fireAllRules();

            return assessment;
        } finally {
            disposeSession(patientId);
        }
    }

    /**
     * Gets an existing session or creates a new one for a patient
     */
    private KieSession getOrCreateSession(String patientId) {
        return patientSessions.computeIfAbsent(patientId, id -> kieContainer.newKieSession());
    }

    /**
     * Disposes a patient's session when no longer needed
     */
    public void disposeSession(String patientId) {
        KieSession session = patientSessions.remove(patientId);
        if (session != null) {
            session.dispose();
        }
    }

}
