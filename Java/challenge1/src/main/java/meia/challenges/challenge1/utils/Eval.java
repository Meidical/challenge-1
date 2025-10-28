package meia.challenges.challenge1.utils;

import meia.challenges.challenge1.model.Evidence;
import meia.challenges.challenge1.service.DroolsService;
import org.kie.api.runtime.ClassObjectFilter;

import java.util.Collection;

public class Eval {
    public static boolean answer(String ev, String v) {
        Collection<Evidence> evidences = (Collection<Evidence>) DroolsService.KS.getObjects(new ClassObjectFilter(Evidence.class));
        boolean questionFound = false;
        Evidence evidence = null;
        for (Evidence e: evidences) {
            if (e.getEvidence().compareTo(ev) == 0) {
                questionFound = true;
                evidence = e;
                break;
            }
        }
        if (questionFound) {
            if (evidence.getValue().compareTo(v) == 0) {
                DroolsService.agendaEventListener.addLhs(evidence);
                return true;
            } else {
                // Clear LHS conditions set if a condition is false (conjunctive rules)
                DroolsService.agendaEventListener.resetLhs();
                return false;
            }
        } else {
            return false;
        }
    }
}
