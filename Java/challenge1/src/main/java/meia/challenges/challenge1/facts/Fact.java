package meia.challenges.challenge1.facts;

import lombok.Getter;

@Getter
public class Fact {
    static private int lastId = 0;
    private final int id;

    public Fact() {
        Fact.lastId ++;
        this.id = lastId;
    }
}
