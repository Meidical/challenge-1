package meia.challenges.challenge1.service;

import org.kie.api.runtime.KieContainer;
import org.kie.api.runtime.KieSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import meia.challenges.challenge1.facts.PatientAirwayAssessment;
import meia.challenges.challenge1.facts.AssessmentFactor;

@Service
public class DroolsService {

    @Autowired
    private KieContainer kieContainer;

    /**
     * Evaluates airway assessment for a patient using certainty factors
     * @param assessment The patient assessment with individual factors
     * @return The evaluated assessment with overall certainty factors
     */
    public PatientAirwayAssessment evaluateAirwayAssessment(PatientAirwayAssessment assessment) {
        KieSession kieSession = kieContainer.newKieSession();
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
            kieSession.dispose();
        }
    }

}
