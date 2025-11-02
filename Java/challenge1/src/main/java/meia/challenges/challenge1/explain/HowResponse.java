package meia.challenges.challenge1.explain;

/**
 * DTO to wrap the "how" explanation as JSON.
 */
public class HowResponse {
    private String justification;

    public HowResponse() {
    }

    public HowResponse(String justification) {
        this.justification = justification;
    }

    public String getJustification() {
        return justification;
    }

    public void setJustification(String justification) {
        this.justification = justification;
    }
}
