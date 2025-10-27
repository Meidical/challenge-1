package meia.challenges.challenge1.facts;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class AssessmentFactor {
    // Getters and setters
    private String category;     // LEMON, MOANS, RODS, or SHORT
    private String code;         // The letter in the mnemonic (e.g., "L" for Look externally)
    private String description;  // Description of the factor
    private double certaintyFactor; // CF value between -1.0 and 1.0
    private boolean present;     // Whether this factor is present in the patient

    // Constructor
    public AssessmentFactor(String category, String code, String description, double certaintyFactor, boolean present) {
        this.category = category;
        this.code = code;
        this.description = description;
        this.certaintyFactor = certaintyFactor;
        this.present = present;
    }

    @Override
    public String toString() {
        return "AssessmentFactor{" +
                "category='" + category + '\'' +
                ", code='" + code + '\'' +
                ", description='" + description + '\'' +
                ", CF=" + certaintyFactor +
                ", present=" + present +
                '}';
    }
}
