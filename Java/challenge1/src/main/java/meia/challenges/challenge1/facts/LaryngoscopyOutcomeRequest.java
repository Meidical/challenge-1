package meia.challenges.challenge1.facts;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LaryngoscopyOutcomeRequest {
    private String patientId;
    private boolean successful;
}
