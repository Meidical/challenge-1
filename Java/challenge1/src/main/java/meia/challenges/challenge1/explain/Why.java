package meia.challenges.challenge1.explain;

import meia.challenges.challenge1.facts.Fact;
import meia.challenges.challenge1.facts.PatientAirwayAssessment;

import java.util.List;
import java.util.Objects;

public class Why {

    /**
     * Returns a single WHY explanation for the specified fact id in the patient's triggered sequence.
     */
    public String getWhyForFact(PatientAirwayAssessment patient, int factId) {
        if (patient == null) return "No patient provided.";
        List<Fact> seq = patient.getTriggeredFacts();
        if (seq == null || seq.isEmpty()) return "No workflow facts recorded for patient " + patient.getPatientId() + ".";

        Fact current = null; int idx = -1;
        for (int i = 0; i < seq.size(); i++) {
            if (seq.get(i).getId() == factId) { current = seq.get(i); idx = i; break; }
        }
        if (current == null) {
            return "Fact " + factId + " not found in patient's workflow history.";
        }

        // Find the driver (previous fact that pointed to this one)
        Fact driver = null;
        for (int j = idx - 1; j >= 0; j--) {
            Fact prev = seq.get(j);
            if (prev.getNextFactId() == current.getId()) { driver = prev; break; }
        }

        StringBuilder why = new StringBuilder();
        if (driver != null) {
            why.append("Started because '")
               .append(driver.getName())
               .append("' was ")
               .append(Objects.toString(driver.getStatus(), "SET"))
               .append('.');
            if (driver.getNextFactDescription() != null && !driver.getNextFactDescription().isEmpty()) {
                why.append(" Next step defined: ")
                   .append(driver.getNextFactDescription())
                   .append('.');
            }
        } else {
            if (!patient.isDifficultAirwayPredicted()) {
                why.append("Initial default approach (no difficult airway predicted).");
            } else {
                why.append("Initial approach chosen for predicted difficult airway.");
            }
        }

        if (current.getNextFactId() == 0 && current.getNextFactDescription() != null && !current.getNextFactDescription().isEmpty()) {
            if (why.length() > 0) why.append(' ');
            why.append("Leads to Conclusion: ")
               .append(current.getNextFactDescription())
               .append('.');
        }

        return why.toString();
    }
}
