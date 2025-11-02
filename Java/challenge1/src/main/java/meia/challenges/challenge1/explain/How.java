package meia.challenges.challenge1.explain;

import meia.challenges.challenge1.facts.AssessmentFactor;
import meia.challenges.challenge1.facts.Conclusion;
import meia.challenges.challenge1.facts.Fact;
import meia.challenges.challenge1.facts.PatientAirwayAssessment;
import meia.challenges.challenge1.facts.Status;
import meia.challenges.challenge1.utils.CertaintyFactor;

import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

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
    // Header summary with prediction, approach and CF values
    sb.append("Patient ").append(patient.getPatientId()).append(" summary:").append('\n');
    sb.append(indent(1))
      .append("Difficult airway predicted: ")
      .append(patient.isDifficultAirwayPredicted())
      .append('\n');
    String approach = patient.getInitialRecommendedApproach() != null
            ? patient.getInitialRecommendedApproach()
            : patient.getRecommendedApproach();
    if (approach != null) {
      sb.append(indent(1))
        .append("Recommended approach: ")
        .append(approach)
        .append('\n');
    }
    // Mnemonics section with per-letter breakdowns and total combined CF
    sb.append(indent(1)).append("Mnemonics:").append('\n');
    appendMnemonicBlock(sb, "LEMON", patient.getLemonCF(), patient.getLemonFactors());
    appendMnemonicBlock(sb, "MOANS", patient.getMoansCF(), patient.getMoansFactors());
    appendMnemonicBlock(sb, "RODS", patient.getRodsCF(), patient.getRodsFactors());
    appendMnemonicBlock(sb, "SHORT", patient.getShortCF(), patient.getShortFactors());

    double totalCF = combineAll(
            combineAll(patient.getLemonCF(), patient.getMoansCF()),
            combineAll(patient.getRodsCF(), patient.getShortCF())
    );
    sb.append(indent(1)).append("Total = ").append(formatDouble2(totalCF)).append('\n');
    sb.append('\n');
    sb.append("Workflow for patient ").append(patient.getPatientId()).append(':').append('\n');

    int step = 1;
    Set<String> startedEmitted = new HashSet<>();
    for (Fact current : seq) {
      String name = current.getName();
      Status status = current.getStatus();

      // start 
      if ((status == Status.SUCCESSFUL || status == Status.FAILED) && !startedEmitted.contains(name)) {
        sb.append(indent(1))
          .append('[').append(step++).append("] ")
          .append(name)
          .append(" = STARTED")
          .append('\n');
        startedEmitted.add(name);
      }

      if (status == Status.STARTED) {
        startedEmitted.add(name);
      }

      sb.append(indent(1))
        .append('[').append(step++).append("] ")
        .append(name)
        .append(" = ")
        .append(status)
        .append('\n');
    }

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

  private String formatDouble2(double v) {
    return String.format(Locale.ROOT, "%.2f", v);
  }

  private void appendMnemonicBlock(StringBuilder sb,
                   String name,
                   double totalCf,
                   List<AssessmentFactor> factors) {
    sb.append(indent(1))
      .append(name)
      .append(" = ")
      .append(formatDouble2(totalCf))
      .append('\n');

    if (factors == null || factors.isEmpty()) {
      return;
    }

    Map<String, Double> byCode = new HashMap<>();
    for (AssessmentFactor f : factors) {
      if (!f.isPresent()) continue;
      if (f.getCertaintyFactor() <= 0) continue;
      String code = f.getCode() != null ? f.getCode() : "?";
      double prev = byCode.getOrDefault(code, 0.0);
      double combined = prev == 0.0 ? f.getCertaintyFactor() : CertaintyFactor.combine(prev, f.getCertaintyFactor());
      byCode.put(code, combined);
    }

    if (byCode.isEmpty()) {
      return;
    }

    List<Map.Entry<String, Double>> entries = byCode.entrySet().stream()
        .sorted(Map.Entry.comparingByKey())
        .collect(Collectors.toList());
    for (Map.Entry<String, Double> e : entries) {
      sb.append(indent(2))
        .append(e.getKey()).append(" -> ")
        .append(formatDouble2(e.getValue()))
        .append('\n');
    }
  }

  private double combineAll(double a, double b) {
    return CertaintyFactor.combine(a, b);
  }
}
