package meia.challenges.challenge1.utils;

public class CertaintyFactor {

    /**
     * Combines two certainty factors using the certainty theory combination rule
     * @param cf1 First certainty factor (-1.0 to 1.0)
     * @param cf2 Second certainty factor (-1.0 to 1.0)
     * @return Combined certainty factor
     */
    public static double combine(double cf1, double cf2) {
        // Both positive
        if (cf1 >= 0 && cf2 >= 0) {
            return cf1 + cf2 * (1 - cf1);
        }
        // Both negative
        else if (cf1 < 0 && cf2 < 0) {
            return cf1 + cf2 * (1 + cf1);
        }
        // Mixed signs
        else {
            return (cf1 + cf2) / (1 - Math.min(Math.abs(cf1), Math.abs(cf2)));
        }
    }

    /**
     * Converts a linguistic certainty value to a numeric CF value
     * @param certaintyLevel The linguistic level (e.g., "high", "medium", "low")
     * @return Numeric CF value between -1.0 and 1.0
     */
    public static double linguisticToCF(String certaintyLevel) {
        return switch (certaintyLevel.toLowerCase()) {
            case "definitely" -> 1.0;
            case "almost certainly" -> 0.8;
            case "probably" -> 0.6;
            case "possibly" -> 0.4;
            case "maybe" -> 0.2;
            case "unknown" -> 0.0;
            case "unlikely" -> -0.2;
            case "probably not" -> -0.4;
            case "almost certainly not" -> -0.8;
            case "definitely not" -> -1.0;
            default -> 0.0;
        };
    }
}
