package meia.challenges.challenge1.facts;

public class Conclusion {
    public static final String OTHER_TECNIQUE = "Other Technique";
    public static final String GENERAL_ANESTHESIA = "General Anesthesia";
    public static final String CANCEL_PROCEDURE = "Cancel Procedure";
    public static final String CRICOTHOMY = "Cricothyrotomy";
    public static final String INTUBATION = "Intubation";
    public static final String WAKE_UP_PACIENT = "Wake up Pacient";


    private String description;

    public Conclusion(String description) {
        super();
        this.description = description;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String toString() {
        return "Diagnosis: " + description;
    }
}
