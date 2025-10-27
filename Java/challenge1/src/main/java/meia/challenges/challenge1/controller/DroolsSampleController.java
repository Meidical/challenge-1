package meia.challenges.challenge1.controller;

import meia.challenges.challenge1.explain.How;
import meia.challenges.challenge1.facts.Evidence;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import meia.challenges.challenge1.facts.PatientAirwayAssessment;
import meia.challenges.challenge1.service.DroolsService;

import java.util.List;

@RestController()
@RequestMapping("/api")
public class DroolsSampleController {

    @Autowired
    private DroolsService droolsService;

    @PostMapping("/assessment")
    public ResponseEntity<PatientAirwayAssessment> getRate(@RequestBody PatientAirwayAssessment request){
        PatientAirwayAssessment assessment = droolsService.evaluateAirwayAssessment(request);
        return new ResponseEntity<>(assessment, HttpStatus.OK);
    }

    @GetMapping("/assessment/patients")
    public  ResponseEntity<List<PatientAirwayAssessment>> getPatients() {
        List<PatientAirwayAssessment> patients = droolsService.getPatients();
        return new ResponseEntity<>(patients, HttpStatus.OK);
    }

    @GetMapping("/assessment/patients/{patientid}")
    public ResponseEntity<PatientAirwayAssessment> getPatient(@PathVariable String patientid) {
        PatientAirwayAssessment patient = droolsService.getPatientById(patientid);
        if (patient == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return new ResponseEntity<>(patient, HttpStatus.OK);
    }

    @GetMapping("/assessment/{patientid}/evidences")
    public  ResponseEntity<List<Evidence>> getFacts(@PathVariable String patientid) {
        List<Evidence> evidences = droolsService.getFactsByPatientId(patientid);
        return new ResponseEntity<>(evidences, HttpStatus.OK);
    }

    @PostMapping("/assessment/{patientid}/evidences/{id}")
    public ResponseEntity<Evidence> modifyFactById(@PathVariable String patientid, @PathVariable int id, @RequestBody Evidence updatedEvidence) {
        Evidence evidence = droolsService.modifyFactById(patientid, id, updatedEvidence);
        return new ResponseEntity<>(evidence, HttpStatus.OK);
    }

    /*@PostMapping("/assessment/{patientid}/insertfact")
    public ResponseEntity<Fact> insertFact(@PathVariable String patientid) {
        droolsService.insertFact(patientid);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/assessment/{patientid}/how")
    public ResponseEntity<String> getHow(@PathVariable String patientid) {
        PatientAirwayAssessment patient = droolsService.getPatientById(patientid);
        if (patient == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        List<Evidence> evidences = droolsService.getFactsByPatientId(patientid);
        String explanation = new How().getHowExplanation(patient, evidences, null);
        return ResponseEntity.ok(explanation);
    }

     */
}
