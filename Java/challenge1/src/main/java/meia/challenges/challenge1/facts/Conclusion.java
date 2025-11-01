package meia.challenges.challenge1.facts;

import lombok.Getter;
import lombok.Setter;

/**
 * A rule engine conclusion produced by the Drools rules. Contains a
 * single textual description and some well-known constant conclusions.
 */
@Setter
@Getter
public class Conclusion {
    public static final String OTHER_TECHNIQUE = "Other Technique";
    public static final String GENERAL_ANESTHESIA = "General Anesthesia";
    public static final String CANCEL_PROCEDURE = "Cancel Procedure";
    public static final String CRICOTOMY = "Cricotomy";
    public static final String INTUBATION = "Intubation";
    public static final String WAKE_UP_PATIENT = "Wake up Patient";
    public static final String ENDOTRACHEAL_INTUBATION = "Tracheal intubation";

    private String description;

    /**
     * Create a Conclusion with the given description.
     *
     * @param description human readable conclusion text
     */
    public Conclusion(String description) {
        super();
        this.description = description;
    }

    @Override
    public String toString() {
        return "Conclusion: " + description;
    }
}
