package meia.challenges.challenge1.facts;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
/**
 * Represents a collection of assessment factors and computed certainty factors
 * for a single patient's airway assessment. The class holds factor lists for
 * mnemonic groups (LEMON, MOANS, RODS, SHORT) and overall computed CFs used
 * by the rules engine.
 */
public class PatientAirwayAssessment {
    // Getters and setters
    // Patient basic info
    private String patientId;
    @Setter
    private int age;
    @Setter
    private double bmi;

    // Certainty factors for overall assessments (range: -1.0 to 1.0)
    @Setter
    private double lemonCF = 0.0;  // Difficult laryngoscopy
    @Setter
    private double moansCF = 0.0;  // Difficult mask ventilation
    @Setter
    private double rodsCF = 0.0;   // Difficult supraglottic device use
    @Setter
    private double shortCF = 0.0;  // Difficult cricothyrotomy

    // Individual assessment factors with certainty values
    private final List<AssessmentFactor> lemonFactors = new ArrayList<>();
    private final List<AssessmentFactor> moansFactors = new ArrayList<>();
    private final List<AssessmentFactor> rodsFactors = new ArrayList<>();
    private final List<AssessmentFactor> shortFactors = new ArrayList<>();

    private final List<Fact> triggeredFacts = new ArrayList<>();

    // Assessment results
    @Setter
    private boolean difficultAirwayPredicted = false;
    @Setter
    private String recommendedApproach;
    @Setter
    private int nextFactId;
    @Setter
    private String nextFactDescription;

    private String initialRecommendedApproach;

    /**
     * Add a factor to the LEMON category list.
     *
     * @param factor the AssessmentFactor to add
     */
    public void addLemonFactor(AssessmentFactor factor) { this.lemonFactors.add(factor); }

    /**
     * Add a factor to the MOANS category list.
     *
     * @param factor the AssessmentFactor to add
     */
    public void addMoansFactor(AssessmentFactor factor) { this.moansFactors.add(factor); }

    /**
     * Add a factor to the RODS category list.
     *
     * @param factor the AssessmentFactor to add
     */
    public void addRodsFactor(AssessmentFactor factor) { this.rodsFactors.add(factor); }

    /**
     * Add a factor to the SHORT category list.
     *
     * @param factor the AssessmentFactor to add
     */
    public void addShortFactor(AssessmentFactor factor) { this.shortFactors.add(factor); }

    public void addTriggeredFact(Fact fact) {
        if (fact == null) return;
        for (Fact f : triggeredFacts) {
            if (f.getId() == fact.getId()) {
                return; // already recorded
            }
        }
        this.triggeredFacts.add(fact);
    }
    
    /**
     * Custom setter to capture the first recommended approach assigned by rules.
     */
    public void setRecommendedApproach(String recommendedApproach) {
        this.recommendedApproach = recommendedApproach;
        if (this.initialRecommendedApproach == null) {
            this.initialRecommendedApproach = recommendedApproach;
        }
    }

    /**
     * Calculate or update the overall certainty factors (LEMON, MOANS, RODS, SHORT)
     * from the contained individual AssessmentFactor certainty values.
     *
     * Note: the implementation is intentionally left as a placeholder because
     * rule evaluation typically happens inside the Drools rules in this project.
     */
    public void calculateOverallCertaintyFactors() {
        // Implementation would combine individual CFs using certainty theory formulas
    }

    /**
     * Human-friendly representation used in logs and debugging.
     *
     * @return string summary of the assessment
     */
    @Override
    public String toString() {
        return "PatientAirwayAssessment{" +
                "patientId='" + patientId + '\'' +
                ", LEMON CF=" + lemonCF +
                ", MOANS CF=" + moansCF +
                ", RODS CF=" + rodsCF +
                ", SHORT CF=" + shortCF +
                ", difficultAirway=" + difficultAirwayPredicted +
                ", recommendedApproach='" + recommendedApproach + '\'' +
                '}';
    }
}
