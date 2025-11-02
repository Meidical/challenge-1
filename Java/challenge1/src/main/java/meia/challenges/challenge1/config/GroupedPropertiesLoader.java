package meia.challenges.challenge1.config;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

public class GroupedPropertiesLoader {
    private final Properties properties;

    public GroupedPropertiesLoader(String resourcePath) {
        properties = new Properties();
        try (InputStream input = getInputStream(resourcePath)) {
            if (input == null) {
                throw new IllegalStateException("Properties resource not found: " + resourcePath);
            }
            properties.load(input);
        } catch (IOException e) {
            throw new IllegalStateException("Failed to load properties: " + resourcePath, e);
        }
    }

    private InputStream getInputStream(String path) throws IOException {
        // Try classpath first (works for src/main/resources and packaged jar)
        InputStream in = Thread.currentThread().getContextClassLoader().getResourceAsStream(path);
        if (in != null) {
            return in;
        }
        in = GroupedPropertiesLoader.class.getClassLoader().getResourceAsStream(path);
        if (in != null) {
            return in;
        }
        // Fallback to filesystem path
        return new FileInputStream(path);
    }

    // Get single value by group and key, e.g. getValue("lemon", "l")
    public double getValue(String group, String key) {
        String name = group + "." + key;
        String raw = properties.getProperty(name);
        if (raw == null || raw.isBlank()) {
            throw new IllegalStateException("Missing property: " + name);
        }
        try {
            return Double.parseDouble(raw);
        } catch (NumberFormatException e) {
            throw new IllegalStateException("Invalid numeric value for property: " + name + " -> '" + raw + "'", e);
        }
    }


    // Get all keys/values for a group/prefix, e.g. getGroup("lemon")
    public Map<String, String> getGroup(String group) {
        Map<String, String> groupValues = new HashMap<>();
        String prefix = group + ".";
        for (String name : properties.stringPropertyNames()) {
            if (name.startsWith(prefix)) {
                groupValues.put(name.substring(prefix.length()), properties.getProperty(name));
            }
        }
        return groupValues;
    }
}
