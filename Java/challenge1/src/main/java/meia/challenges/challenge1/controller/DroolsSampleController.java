package meia.challenges.challenge1.controller;

import meia.challenges.challenge1.explain.How;
import meia.challenges.challenge1.facts.Fact;
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

    @GetMapping("/assessment/patients/{patientid}")
    public ResponseEntity<PatientAirwayAssessment> getPatient(@PathVariable String patientid) {
        PatientAirwayAssessment patient = droolsService.getPatientById(patientid);
        if (patient == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return new ResponseEntity<>(patients, HttpStatus.OK);
    }

    @GetMapping("/assessment/{patientid}/facts")
    public  ResponseEntity<List<Fact>> getFacts(@PathVariable String patientid) {
        List<Fact> facts = droolsService.getFactsByPatientId(patientid);
        return new ResponseEntity<>(facts, HttpStatus.OK);
    }


    /*@PostMapping("/assessment/{patientid}/insertfact")
    public ResponseEntity<Fact> insertFact(@PathVariable String patientid) {
        droolsService.insertFact(patientid);
        return new ResponseEntity<>(HttpStatus.OK);
    }*/
        }
        List<Fact> facts = droolsService.getFactsByPatientId(patientid);
        String explanation = new How().getHowExplanation(patient, facts, null);
        return ResponseEntity.ok(explanation);
    }
}
