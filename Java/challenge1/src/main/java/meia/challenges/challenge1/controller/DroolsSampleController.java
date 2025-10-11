package meia.challenges.challenge1.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import meia.challenges.challenge1.model.Participant;
import meia.challenges.challenge1.model.Rate;
import meia.challenges.challenge1.facts.PatientAirwayAssessment;
import meia.challenges.challenge1.facts.AssessmentFactor;
import meia.challenges.challenge1.service.DroolsService;

@RestController()
@RequestMapping("/bankservice")
public class DroolsSampleController {

    @Autowired
    private DroolsService droolsService;

    @PostMapping("/getrate")
    public ResponseEntity<Rate> getRate(@RequestBody Participant request){
        Rate rate = droolsService.getRate(request);
        return new ResponseEntity<>(rate, HttpStatus.OK);
    }

    @PostMapping("/getassessment")
    public ResponseEntity<PatientAirwayAssessment> getRate(@RequestBody PatientAirwayAssessment request){
        PatientAirwayAssessment assessment = droolsService.evaluateAirwayAssessment(request);
        return new ResponseEntity<>(assessment, HttpStatus.OK);
    }

}
