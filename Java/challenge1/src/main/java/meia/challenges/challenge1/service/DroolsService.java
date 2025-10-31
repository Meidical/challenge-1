package meia.challenges.challenge1.service;

import meia.challenges.challenge1.facts.*;
import org.kie.api.runtime.ClassObjectFilter;
import org.kie.api.runtime.KieContainer;
import org.kie.api.runtime.KieSession;
import org.kie.api.runtime.rule.Row;
import org.kie.api.runtime.rule.ViewChangedEventListener;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class DroolsService {

    @Autowired
    private KieContainer kieContainer;
    private final Map<String, PatientAirwayAssessment> patientAssessments = new ConcurrentHashMap<>();
    private final Map<String, KieSession> patientSessions = new ConcurrentHashMap<>();
    private static final Logger logger = LoggerFactory.getLogger(DroolsService.class);

    /**
     * Evaluates airway assessment for a patient using certainty factors.
     * Inserts the assessment and its factors into the patient's Drools session,
     * triggers rule evaluation and returns the (possibly updated) assessment.
     *
     * @param assessment The patient assessment containing factor lists and patient id
     * @return The evaluated PatientAirwayAssessment instance (may be modified by rules)
     */
    public PatientAirwayAssessment evaluateAirwayAssessment(PatientAirwayAssessment assessment) {
        String patientId = assessment.getPatientId();
        disposeSession(patientId);
        patientAssessments.put(patientId, assessment);
        KieSession kieSession = getOrCreateSession(patientId);
        kieSession.setGlobal("logger", logger);

        // Insert predefined facts if not already present
        insertFact(kieSession);

        kieSession.insert(assessment);

        // Insert all the individual factors
        for (AssessmentFactor factor : assessment.getLemonFactors()) {
            kieSession.insert(factor);
        }

        for (AssessmentFactor factor : assessment.getMoansFactors()) {
            kieSession.insert(factor);
        }

        for (AssessmentFactor factor : assessment.getRodsFactors()) {
            kieSession.insert(factor);
        }

        for (AssessmentFactor factor : assessment.getShortFactors()) {
            kieSession.insert(factor);
        }

        // Fire all rules
        kieSession.fireAllRules();

        return assessment;
    }

    /**
     * Modify an existing Fact (by its id) in the patient's KIE session or insert it if not found.
     * Only non-null fields from {@code updatedFact} are applied to the existing Fact.
     * After modification or insertion, rules are fired.
     *
     * @param patientId the id of the patient owning the KIE session
     * @param facId     the id of the fact to modify (or assign to the new fact when inserting)
     * @param updatedFact a Fact containing updated values; only non-null properties are applied
     * @return the modified existing Fact if found, otherwise the newly inserted Fact (with id set)
     */
    public Fact modifyFactById(String patientId, int facId, Fact updatedFact) {
        KieSession kieSession = getOrCreateSession(patientId);
        kieSession.setGlobal("logger", logger);

        // Check if the fact with the given ID already exists
        Collection<?> existingFacts = kieSession.getObjects(new ClassObjectFilter(Fact.class));
        for (Object obj : existingFacts) {
            Fact fact = (Fact) obj;
            if (fact.getId() == facId) {
                // Modify only the properties that are provided in the payload
                if (updatedFact.getName() != null) {
                    fact.setName(updatedFact.getName());
                }
                if (updatedFact.getDescription() != null) {
                    fact.setDescription(updatedFact.getDescription());
                }
                if (updatedFact.getStatus() != null) {
                    Object incomingStatus = updatedFact.getStatus();
                    fact.setStatus(Status.valueOf(incomingStatus.toString().trim()));
                }
                kieSession.update(kieSession.getFactHandle(fact), fact);
                kieSession.fireAllRules();
                return fact;
            }

        }

        // If we reached here, no matching fact was found
        logger.info("Fact with ID {} not found. Inserting new fact.", facId);
        updatedFact.setId(facId);
        kieSession.insert(updatedFact);
        kieSession.fireAllRules();
        return updatedFact;
    }


    /**
     * Gets an existing KieSession for the given patient id or creates a new one if absent.
     * When a new session is created, it is initialized with a logger global and a
     * live query listener that halts the session as soon as a conclusion is produced.
     *
     * @param patientId the patient identifier used as session key
     * @return a KieSession associated with the patient
     */
    private KieSession getOrCreateSession(String patientId) {
        return patientSessions.computeIfAbsent(patientId, id -> {
            KieSession kSession = kieContainer.newKieSession();
            kSession.setGlobal("logger", logger);

            // Query listener - now only added once when session is first created
            ViewChangedEventListener listener = new ViewChangedEventListener() {
                @Override
                public void rowInserted(Row row) {
                    Conclusion conclusion = (Conclusion) row.get("$conclusion");
                    logger.info(">>>{}", conclusion.toString());
                    // stop inference engine as soon as a conclusion is reached
                    kSession.halt();
                }

                @Override
                public void rowDeleted(Row row) {
                }

                @Override
                public void rowUpdated(Row row) {
                }
            };

            kSession.openLiveQuery("Conclusions", null, listener);
            return kSession;
        });
    }


    /**
     * Disposes the KieSession associated with the given patient id, if present.
     * This frees Drools resources for that patient.
     *
     * @param patientId the id of the patient whose session should be disposed
     */
    public void disposeSession(String patientId) {
        KieSession session = patientSessions.remove(patientId);
        if (session != null) {
            session.dispose();
        }
    }

    /**
     * Retrieves all Facts currently present in the patient's KieSession.
     *
     * @param patientid the id of the patient whose facts to return
     * @return a list of Fact instances from the patient's session (empty list if none)
     */
    public List<Fact> getFactsByPatientId(String patientid) {
        KieSession kieSession = getOrCreateSession(patientid);
        Collection<?> raw = kieSession.getObjects(new ClassObjectFilter(Fact.class));
        return raw.stream()
                .map(o -> (Fact) o)
                .collect(Collectors.toList());
    }

    /**
     * Returns a copy of all patient assessments currently held in memory.
     *
     * @return list of PatientAirwayAssessment objects (may be empty)
     */
    public List<PatientAirwayAssessment> getPatients() {
        return new ArrayList<>(patientAssessments.values());
    }

    /**
     * Returns the PatientAirwayAssessment for the given patient id if present.
     *
     * @param patientid the id of the patient to look up
     * @return the PatientAirwayAssessment or null if not found
     */
    public PatientAirwayAssessment getPatientById(String patientid) {
        PatientAirwayAssessment assessment = patientAssessments.get(patientid);
        if (assessment == null) {
            logger.info("Patient with id {} not found", patientid);
            return null;
        } else {
            return assessment;
        }
    }


    public Fact getFactById(String patientid, int id) {
        KieSession kieSession = getOrCreateSession(patientid);
        Collection<?> raw = kieSession.getObjects(new ClassObjectFilter(Fact.class));
        for (Object o : raw) {
            Fact fact = (Fact) o;
            if (fact.getId() == id) {
                return fact;
            }
        }
        return null;
    }


    /**
     * Inserts a predefined set of domain Facts into the provided KieSession.
     * These facts represent standard airway management options used by the rules.
     *
     * @param session the KieSession where facts will be inserted
     */
    public void insertFact(KieSession session) {

        session.insert(new Fact(1, "Direct Laryngoscopy", "Direct Laryngoscopy", Status.NOT_STARTED, 0, ""));
        session.insert(new Fact(2, "Facial Mask Ventilation", "Facial Mask Ventilation", Status.NOT_STARTED, 0, ""));
        session.insert(new Fact(3, "Supraglottic Device", "Supraglottic Device", Status.NOT_STARTED, 0, ""));
        session.insert(new Fact(4, "Fibroscopic Intubation", "Fibroscopic Intubation", Status.NOT_STARTED, 0, ""));
        session.insert(new Fact(5, "Emergency", "Emergency", Status.NOT_STARTED,0, ""));
        session.insert(new Fact(6, "Seek other anesthetic airway management techniques", "Seek other anesthetic airway management techniques", Status.NOT_STARTED,0, ""));
        session.insert(new Fact(7, "Airway with intubation", "Airway with intubation", Status.NOT_STARTED,0,""));
        session.insert(new Fact(8, "Success with intubation", "Success with intubation", Status.NOT_STARTED,0,""));
        session.insert(new Fact(9, "Planned surgery", "Planned surgery", Status.NOT_STARTED,0,""));
    }
}
