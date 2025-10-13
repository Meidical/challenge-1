package meia.challenges.challenge1.facts;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
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

    // Assessment results
    @Setter
    private boolean difficultAirwayPredicted = false;
    @Setter
    private String recommendedApproach;

    public void addLemonFactor(AssessmentFactor factor) { this.lemonFactors.add(factor); }

    public void addMoansFactor(AssessmentFactor factor) { this.moansFactors.add(factor); }

    public void addRodsFactor(AssessmentFactor factor) { this.rodsFactors.add(factor); }

    public void addShortFactor(AssessmentFactor factor) { this.shortFactors.add(factor); }

    // Method to calculate overall CF based on individual factors
    public void calculateOverallCertaintyFactors() {
        // Implementation would combine individual CFs using certainty theory formulas
    }

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
