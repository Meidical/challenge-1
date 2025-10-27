package meia.challenges.challenge1.model;

import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

public class Justification {
    private final String rule;
    @Getter
    private List<Fact> lhs;
    @Getter
    private Fact conclusion;

    public Justification(String rule, List<Fact> lhs, Fact conclusion) {
        this.rule = rule;
        this.lhs = new ArrayList<Fact>(lhs);
        this.conclusion = conclusion;
    }

    public String getRuleName() {
        return this.rule;
    }

}
