package meia.challenges.challenge1.explain;

import meia.challenges.challenge1.facts.AssessmentFactor;
import meia.challenges.challenge1.facts.Conclusion;
import meia.challenges.challenge1.facts.Fact;
import meia.challenges.challenge1.facts.PatientAirwayAssessment;

import java.util.Comparator;
import java.util.List;
import java.util.Locale;

/**
 * "How" explanation utility inspired by the base project.
 *
 * This class does not introduce new facts or listeners. It derives a
 * human-readable explanation from the current state of the domain objects
 * already present in this project (PatientAirwayAssessment, AssessmentFactor,
 * and optional LaryngoscopyOutcomeRequest), following the rules' logic.
 */
public class How {

    /**
     * Builds a multi-line explanation describing how the patient's state was
     * determined from the factors and thresholds defined in the rules.
     *
     * @param patient current patient assessment
     * @return explanation string
     */
    public String getHowExplanation(PatientAirwayAssessment patient) {
        return getHowExplanation(patient, null);
    }

    /**
     * Builds a multi-line explanation describing how the patient's state and
     * laryngoscopy outcome were determined.
     *
     * @param patient current patient assessment
     * @param outcome optional laryngoscopy outcome fact (may be null)
     * @return explanation string
     */
  public String getHowExplanation(PatientAirwayAssessment patient, Conclusion conclusion) {
        StringBuilder sb = new StringBuilder();

        if (patient == null) {
            return "No patient assessment to explain.";
        }

        // Header
        sb.append("Explanation for patient: ")
          .append(patient.getPatientId())
          .append('\n');

        // Per-mnemonic breakdown mirroring the rules.drl categories
        appendCategoryExplanation(
                sb,
                "LEMON",
                patient.getLemonFactors(),
                patient.getLemonCF(),
                0.6,
                "Overall LEMON Assessment High"
        );

        appendCategoryExplanation(
                sb,
                "MOANS",
                patient.getMoansFactors(),
                patient.getMoansCF(),
                0.6,
                "Overall MOANS Assessment High"
        );

        appendCategoryExplanation(
                sb,
                "RODS",
                patient.getRodsFactors(),
                patient.getRodsCF(),
                0.5,
                "Overall RODS Assessment High"
        );

        appendCategoryExplanation(
                sb,
                "SHORT",
                patient.getShortFactors(),
                patient.getShortCF(),
                0.6,
                "Overall SHORT Assessment High"
        );

    // Overall airway difficulty and approach
        sb.append('\n');
        if (patient.isDifficultAirwayPredicted()) {
            sb.append("Difficult airway predicted = true\n");
        } else {
            sb.append("Difficult airway predicted = false\n");
        }

        if (patient.getRecommendedApproach() != null) {
            sb.append("Recommended approach: ")
              .append(patient.getRecommendedApproach())
              .append('\n');
        }

    if (patient.getNextFactId() > 0) {
      sb.append("Next step factId: ")
        .append(patient.getNextFactId())
        .append('\n');
    }

    // Final conclusion (if provided by caller)
    if (conclusion != null) {
      sb.append("Conclusion reached: ")
        .append(conclusion.getDescription())
        .append('\n');
    }
        return sb.toString();
    }

  public String getHowExplanation(PatientAirwayAssessment patient, List<Fact> facts, Conclusion conclusion) {
    String base = getHowExplanation(patient, conclusion);
    StringBuilder sb = new StringBuilder(base);
    if (facts != null && !facts.isEmpty()) {
      sb.append('\n').append("Workflow facts:").append('\n');
      facts.stream()
         .sorted(Comparator.comparingInt(Fact::getId))
         .forEach(f -> sb.append(indent(1))
                 .append("[")
                 .append(f.getId())
                 .append("] ")
                 .append(f.getName())
                 .append(" - ")
                 .append(f.getStatus())
                 .append(f.getNextFactId() > 0 ? " (next->" + f.getNextFactId() + ")" : "")
                 .append('\n'));
    }
    return sb.toString();
  }

  public String getFactsOnlyExplanation(PatientAirwayAssessment patient) {
    if (patient == null) {
      return "No patient assessment to explain.";
    }
    List<Fact> seq = patient.getTriggeredFacts();
    if (seq == null || seq.isEmpty()) {
      return "No workflow facts recorded for patient " + patient.getPatientId() + ".";
    }
    StringBuilder sb = new StringBuilder();
    sb.append("Workflow for patient ").append(patient.getPatientId()).append(':').append('\n');
    seq.stream()
       .sorted(Comparator.comparingInt(Fact::getId))
       .forEach(f -> sb.append(indent(1))
           .append('[').append(f.getId()).append("] ")
           .append(f.getName())
           .append(" - ")
           .append(f.getStatus())
           .append(f.getNextFactId() > 0 ? " (next->" + f.getNextFactId() + ")" : "")
           .append('\n'));
    return sb.toString();
  }

    private void appendCategoryExplanation(StringBuilder sb,
                                           String category,
                                           List<AssessmentFactor> factors,
                                           double totalCf,
                                           double threshold,
                                           String thresholdRuleName) {
        sb.append('\n')
          .append(category)
          .append(" assessment:\n");

        if (factors == null || factors.isEmpty()) {
            sb.append(indent(1)).append("No factors provided.\n");
        } else {
            for (AssessmentFactor f : factors) {
                sb.append(indent(1))
                  .append(formatFactorLine(f))
                  .append('\n');
            }
        }

        sb.append(indent(1))
          .append("Combined ")
          .append(category)
          .append(" CF = ")
          .append(formatDouble(totalCf))
          .append('\n');

        if (totalCf > threshold) {
            sb.append(indent(2))
              .append("Threshold exceeded (>")
              .append(formatDouble(threshold))
              .append(") -> triggers rule '")
              .append(thresholdRuleName)
              .append("'.\n");
        } else {
            sb.append(indent(2))
              .append("Threshold not exceeded (<=")
              .append(formatDouble(threshold))
              .append(").\n");
        }
    }

    private String formatFactorLine(AssessmentFactor f) {
        String presence = f.isPresent() ? "present" : "absent";
        String code = f.getCode() != null ? f.getCode() : "?";
        String desc = f.getDescription() != null ? f.getDescription() : "";
        String cf = formatDouble(f.getCertaintyFactor());
        return String.format(Locale.ROOT,
                "[%s - %s] %s (CF=%s, %s)",
                f.getCategory(), code, desc, cf, presence);
    }

    private String indent(int n) {
        return "\t".repeat(Math.max(0, n));
    }

    private String formatDouble(double v) {
        return String.format(Locale.ROOT, "%.3f", v);
    }
}
