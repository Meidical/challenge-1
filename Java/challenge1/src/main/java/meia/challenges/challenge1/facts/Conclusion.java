package meia.challenges.challenge1.facts;

import lombok.Getter;
import lombok.Setter;

/**
 * A rule engine conclusion produced by the Drools rules. Contains a
 * single textual description and some well-known constant conclusions.
 */
@Setter
@Getter
public class Conclusion extends Fact{
    public static final String OTHER_TECNIQUE = "Other Technique";
    public static final String GENERAL_ANESTHESIA = "General Anesthesia";
    public static final String CANCEL_PROCEDURE = "Cancel Procedure";
    public static final String CRICOTHOMY = "Cricothyrotomy";
    public static final String INTUBATION = "Intubation";
    public static final String WAKE_UP_PACIENT = "Wake up Pacient";


    /**
     * -- GETTER --
     *
     *
     * -- SETTER --
     *  Set the conclusion description.
     *
     */
    private String description;

    /**
     * Create a Conclusion with the given description.
     *
     * @param description human-readable conclusion text
     */
    public Conclusion(String description) {
        super();
        this.description = description;
    }

}

    /*
     * String form used in logs/debug output.
     *
     * @return a short diagnostic string
    public String toString() {
        return "Diagnosis: " + description;
    }
     */


