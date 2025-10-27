package meia.challenges.challenge1.facts;

/**
 * A rule engine conclusion produced by the Drools rules. Contains a
 * single textual description and some well-known constant conclusions.
 */
public class Conclusion extends Fact{
    public static final String OTHER_TECNIQUE = "Other Technique";
    public static final String GENERAL_ANESTHESIA = "General Anesthesia";
    public static final String CANCEL_PROCEDURE = "Cancel Procedure";
    public static final String CRICOTHOMY = "Cricothyrotomy";
    public static final String INTUBATION = "Intubation";
    public static final String WAKE_UP_PACIENT = "Wake up Pacient";


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

    /**
     * @return the conclusion description
     */
    public String getDescription() {
        return description;
    }

    /**
     * Set the conclusion description.
     *
     * @param description new description text
     */
    public void setDescription(String description) {
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


