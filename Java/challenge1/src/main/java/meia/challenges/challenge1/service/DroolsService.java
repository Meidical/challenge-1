package meia.challenges.challenge1.service;

import meia.challenges.challenge1.config.TrackingAgendaEventListener;
import meia.challenges.challenge1.explain.How;
import meia.challenges.challenge1.model.*;
import org.kie.api.runtime.ClassObjectFilter;
import org.kie.api.runtime.KieContainer;
import org.kie.api.runtime.KieSession;
import org.kie.api.runtime.rule.Row;
import org.kie.api.runtime.rule.ViewChangedEventListener;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class DroolsService {

    private final KieContainer kieContainer;
    private final Map<String, PatientAirwayAssessment> patientAssessments = new ConcurrentHashMap<>();
    private final Map<String, KieSession> patientSessions = new ConcurrentHashMap<>();
    private static final Logger logger = LoggerFactory.getLogger(DroolsService.class);
    public static Map<Integer, Justification> justifications;
    public static TrackingAgendaEventListener agendaEventListener;
    public static KieSession KS;

    public DroolsService(KieContainer kieContainer) {
        this.kieContainer = kieContainer;
    }

    /**
     * Evaluates airway assessment for a patient using certainty factors.
     * Inserts the assessment and its factors into the patient's Drools session,
     * triggers rule evaluation and returns the (possibly updated) assessment.
     *
     * @param assessment The patient assessment containing factor lists and patient id
     * @return The evaluated PatientAirwayAssessment instance (maybe modified by rules)
     */
    public PatientAirwayAssessment evaluateAirwayAssessment(PatientAirwayAssessment assessment) {
        String patientId = assessment.getPatientId();
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
     * @param updatedEvidence a Fact containing updated values; only non-null properties are applied
     * @return the modified existing Fact if found, otherwise the newly inserted Fact (with id set)
     */
    public Evidence modifyFactById(String patientId, int facId, Evidence updatedEvidence) {
        KieSession kieSession = getOrCreateSession(patientId);
        kieSession.setGlobal("logger", logger);

        // Check if the fact with the given ID already exists
        Collection<?> existingEvidences = kieSession.getObjects(new ClassObjectFilter(Evidence.class));
        for (Object obj : existingEvidences) {
            Evidence evidence = (Evidence) obj;
            if (evidence.getId() == facId) {
                // Modify only the properties that are provided in the payload
                if (updatedEvidence.getEvidence() != null) {
                    evidence.setEvidence(updatedEvidence.getEvidence());
                }
                if (updatedEvidence.getId() != 0) {
                    Object incomingStatus = updatedEvidence.getId();
                    evidence.setId(updatedEvidence.getId());
                }
                if (updatedEvidence.getStatus() != null) {
                    Object incomingStatus = updatedEvidence.getStatus();
                    evidence.setStatus(Status.valueOf(incomingStatus.toString().trim()));
                }
                kieSession.update(kieSession.getFactHandle(evidence), evidence);
                kieSession.fireAllRules();
                return evidence;
            }

        }

        // If we reached here, no matching fact was found
        logger.info("Fact with ID {} not found. Inserting new fact.", facId);
        updatedEvidence.setId(facId);
        kieSession.insert(updatedEvidence);
        kieSession.fireAllRules();
        return updatedEvidence;
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
            DroolsService.justifications = new TreeMap<Integer, Justification>();
            kSession.setGlobal("logger", logger);
            DroolsService.agendaEventListener = new TrackingAgendaEventListener();
            kSession.addEventListener(agendaEventListener);

            // Query listener - now only added once when session is first created
            ViewChangedEventListener listener = new ViewChangedEventListener() {
                @Override
                public void rowInserted(Row row) {
                    Conclusion conclusion = (Conclusion) row.get("$conclusion");
                    logger.info(">>>{}", conclusion.toString());

                    How how = new How(DroolsService.justifications);
                    System.out.println(how.getHowExplanation(conclusion.getId()));

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
    public List<Evidence> getFactsByPatientId(String patientid) {
        KieSession kieSession = getOrCreateSession(patientid);
        Collection<?> raw = kieSession.getObjects(new ClassObjectFilter(Evidence.class));
        return raw.stream()
                .map(o -> (Evidence) o)
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

    /**
     * Inserts a predefined set of domain Facts into the provided KieSession.
     * These facts represent standard airway management options used by the rules.
     *
     * @param session the KieSession where facts will be inserted
     */
    public void insertFact(KieSession session) {
        session.insert(new Evidence(1, Status.NOT_STARTED, Evidence.DIRECT_LARYNGOSCOPY, 0));
        session.insert(new Evidence(2, Status.NOT_STARTED, Evidence.FACIAL_MASK_VENTILATION, 0));
        session.insert(new Evidence(3, Status.NOT_STARTED, Evidence.SUPRAGLOTTIC_DEVICE, 0));
        session.insert(new Evidence(4, Status.NOT_STARTED, Evidence.FIBROSCOPIC_INTUBATION, 0));
        session.insert(new Evidence(5, Status.NOT_STARTED, Evidence.EMERGENCY, 0));
        session.insert(new Evidence(6, Status.NOT_STARTED, Evidence.OTHER_TECHNIQUES, 0));
        session.insert(new Evidence(7, Status.NOT_STARTED, Evidence.AIRWAY_INTUBATION,0));
        session.insert(new Evidence(8, Status.NOT_STARTED, Evidence.SUCCESS_INTUBATION,0));
        session.insert(new Evidence(9, Status.NOT_STARTED, Evidence.PLANNED_SURGERY,0));
    }
}
