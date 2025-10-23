package meia.challenges.challenge1.facts;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Fact {
    private int id;
    private String name;
    private String description;
    private Status status;
    private int nextFactId;

    public Fact() {}

    // Full constructor with all fields
    public Fact(int id, String name, String description, Status status, int nextFactId) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.status = status;
        this.nextFactId = nextFactId;
    }

    public Fact(int id, String name, String description, Status status) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.status = status;
    }
}
