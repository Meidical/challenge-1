package meia.challenges.challenge1.utils;

import meia.challenges.challenge1.facts.Fact;
import meia.challenges.challenge1.facts.Status;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public final class FactParserUtils {
    private static final Logger logger = LoggerFactory.getLogger(FactParserUtils.class);

    private FactParserUtils() {}

    /**
     * Convert a flat map of properties for group "fact" (keys like "1.name", "2.priority")
     * into a list of Fact objects. Invalid fact definitions are skipped with a warning.
     */
    public static List<Fact> parseFacts(Map<String, String> flat) {
        Map<String, Map<String, String>> byId = new LinkedHashMap<>();
        for (Map.Entry<String, String> e : flat.entrySet()) {
            String key = e.getKey();
            int dot = key.indexOf('.');
            if (dot < 0) {
                logger.warn("Invalid fact property key (missing id): {}", key);
                continue;
            }
            String idKey = key.substring(0, dot);
            String field = key.substring(dot + 1);
            byId.computeIfAbsent(idKey, k -> new HashMap<>()).put(field, e.getValue());
        }

        List<Fact> facts = new ArrayList<>();
        for (Map.Entry<String, Map<String, String>> entry : byId.entrySet()) {
            String idKey = entry.getKey();
            Map<String, String> values = entry.getValue();
            try {
                int id = Integer.parseInt(values.getOrDefault("id", idKey).trim());
                String name = values.getOrDefault("name", "").trim();
                String description = values.getOrDefault("description", "").trim();
                Status status = Status.valueOf(values.getOrDefault("status", "NOT_STARTED").trim());
                int nextFactId = Integer.parseInt(values.getOrDefault("nextfactid", "0").trim());
                String nextFactDescription = values.getOrDefault("nextfactdescription", "").trim();

                Fact fact = new Fact(id, name, description, status, nextFactId, nextFactDescription);
                facts.add(fact);
            } catch (Exception ex) {
                logger.warn("Skipping fact {} due to error: {}", idKey, ex.getMessage());
            }
        }
        return facts;
    }
}
