package meia.challenges.challenge1.config;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

public class CertaintyFactorConfig {
    private static final String CONFIG_FILE = "certaintyfactor.properties";
    private static final Map<String, Double> certaintyFactors = new HashMap<>();

    static {
        loadConfig();
    }

    private static void loadConfig() {
        Properties props = new Properties();
        try (InputStream input = CertaintyFactorConfig.class.getClassLoader().getResourceAsStream(CONFIG_FILE)) {
            if (input == null) {
                System.err.println("Unable to find " + CONFIG_FILE);
                return;
            }
            props.load(input);

            // Load all properties into the map
            for (String key : props.stringPropertyNames()) {
                try {
                    double value = Double.parseDouble(props.getProperty(key));
                    certaintyFactors.put(key, value);
                } catch (NumberFormatException e) {
                    System.err.println("Invalid certainty factor for key: " + key);
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static double getCertaintyFactor(String parameter) {
        return certaintyFactors.getOrDefault(parameter, 0.0);
    }

    // Reload configuration if needed
    public static void reloadConfig() {
        certaintyFactors.clear();
        loadConfig();
    }
}
