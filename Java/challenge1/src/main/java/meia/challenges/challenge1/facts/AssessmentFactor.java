package meia.challenges.challenge1.facts;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
/**
 * Represents a single assessment factor used in airway assessment mnemonics
 * (e.g., LEMON, MOANS, RODS, SHORT). Contains a category, code, description,
 * a certainty factor (CF) between -1.0 and 1.0 and whether the factor is present.
 */
public class AssessmentFactor {
    // Getters and setters
    private String category;     // LEMON, MOANS, RODS, or SHORT
    private String code;         // The letter in the mnemonic (e.g., "L" for Look externally)
    private String description;  // Description of the factor
    private double certaintyFactor; // CF value between -1.0 and 1.0
    private boolean present;     // Whether this factor is present in the patient

    /**
     * Create a new AssessmentFactor.
     *
     * @param category mnemonic category name (LEMON, MOANS, etc.)
     * @param code short code/letter representing the factor
     * @param description explanatory text for the factor
     * @param certaintyFactor certainty factor value in [-1.0, 1.0]
     * @param present whether this factor was observed/present
     */
    public AssessmentFactor(String category, String code, String description, double certaintyFactor, boolean present) {
        this.category = category;
        this.code = code;
        this.description = description;
        this.certaintyFactor = certaintyFactor;
        this.present = present;
    }

    /**
     * Human-friendly string representation for logging and debugging.
     *
     * @return string containing field values
     */
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
