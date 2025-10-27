package meia.challenges.challenge1.model;

/**
 * Simple holder for a named certainty factor value used by rules and configuration.
 */
public class CertaintyFactor {
    private String parameterName;
    private double value;

    /**
     * Create a named certainty factor.
     *
     * @param parameterName name/key of the parameter
     * @param value numeric CF value (typically in range [-1.0, 1.0])
     */
    public CertaintyFactor(String parameterName, double value) {
        this.parameterName = parameterName;
        this.value = value;
    }

    // Getters and setters
    /**
     * @return the parameter name
     */
    public String getParameterName() {
        return parameterName;
    }

    /**
     * Set the parameter name.
     *
     * @param parameterName new parameter name
     */
    public void setParameterName(String parameterName) {
        this.parameterName = parameterName;
    }

    /**
     * @return the numeric CF value
     */
    public double getValue() {
        return value;
    }

    /**
     * Set the CF value.
     *
     * @param value the new numeric certainty factor
     */
    public void setValue(double value) {
        this.value = value;
    }

    /**
     * Human-friendly string representation for logging.
     *
     * @return string representation
     */
    @Override
    public String toString() {
        return "CertaintyFactor{" +
                "parameterName='" + parameterName + '\'' +
                ", value=" + value +
                '}';
    }
}
