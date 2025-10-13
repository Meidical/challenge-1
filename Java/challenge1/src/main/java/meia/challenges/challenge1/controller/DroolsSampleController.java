package meia.challenges.challenge1.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import meia.challenges.challenge1.facts.PatientAirwayAssessment;
import meia.challenges.challenge1.service.DroolsService;

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

}
