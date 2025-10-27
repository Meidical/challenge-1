package meia.challenges.challenge1.model;

import lombok.Getter;
import lombok.Setter;

@Getter
public class Evidence extends Fact{
    public static final String DIRECT_LARYNGOSCOPY = "Direct Laryngoscopy";
    public static final String FACIAL_MASK_VENTILATION = "Facial Mask Ventilation";
    public static final String SUPRAGLOTTIC_DEVICE = "Supraglottic Device";
    public static final String FIBROSCOPIC_INTUBATION = "Fibroscopic Intubation";
    public static final String EMERGENCY = "Emergency";
    public static final String OTHER_TECHNIQUES = "Seek other anesthetic airway management techniques";
    public static final String AIRWAY_INTUBATION = "Airway with intubation";
    public static final String SUCCESS_INTUBATION = "Success with intubation";
    public static final String PLANNED_SURGERY = "Planned surgery";

    @Setter
    private int evidence;
    @Setter
    private Status status;
    @Setter
    private String value;
    @Setter
    private int nextFactId;

    public Evidence(int id, Status status, String value, int nextFactId) {
        this.evidence = id;
        this.status = status;
        this.value = value;
        this.nextFactId = nextFactId;
    }

    public String toString() {
        return (evidence + " = " + value);
    }

}


