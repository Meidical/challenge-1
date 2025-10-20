package meia.challenges.challenge1.facts;

public class CertaintyFactor {
    private String parameterName;
    private double value;

    public CertaintyFactor(String parameterName, double value) {
        this.parameterName = parameterName;
        this.value = value;
    }

    // Getters and setters
    public String getParameterName() {
        return parameterName;
    }

    public void setParameterName(String parameterName) {
        this.parameterName = parameterName;
    }

    public double getValue() {
        return value;
    }

    public void setValue(double value) {
        this.value = value;
    }

    @Override
    public String toString() {
        return "CertaintyFactor{" +
                "parameterName='" + parameterName + '\'' +
                ", value=" + value +
                '}';
    }
}
