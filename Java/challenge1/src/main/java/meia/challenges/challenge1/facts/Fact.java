package meia.challenges.challenge1.facts;

import lombok.Getter;
import lombok.Setter;

/**
 * Domain object representing a rule engine Fact.
 * A Fact models an actionable item in the airway assessment domain with
 * an id, name, description, processing status and an optional nextFactId.
 */
@Getter
@Setter
public class Fact {
    private int id;
    private String name;
    private String description;
    private Status status;
    private int nextFactId;

    /**
     * Default constructor for frameworks and serialization.
     */
    public Fact() {}

    /**
     * Full constructor to create a Fact with all fields.
     *
     * @param id the numeric identifier for the fact
     * @param name short name/title of the fact
     * @param description longer description of the fact
     * @param status the current processing Status for the fact
     * @param nextFactId optional id for a following fact/action (0 if none)
     */
    public Fact(int id, String name, String description, Status status, int nextFactId) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.status = status;
        this.nextFactId = nextFactId;
    }

    /**
     * Convenience constructor without nextFactId.
     *
     * @param id the numeric identifier for the fact
     * @param name short name/title of the fact
     * @param description longer description of the fact
     * @param status the current processing Status for the fact
     */
    public Fact(int id, String name, String description, Status status) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.status = status;
    }
}
