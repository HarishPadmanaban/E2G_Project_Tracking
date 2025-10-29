package com.example.project_tracking.Controller.OTP;


import com.example.project_tracking.Service.OTP.EmailService;
import com.example.project_tracking.Service.OTP.OtpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/otp")
public class OtpController {

    @Autowired
    private OtpService otpService;

    @Autowired
    private EmailService emailService;

    @PostMapping("/generate")
    public ResponseEntity<?> generateOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        // Need to validate the user has the same email after then otp must be sent(Get the employee Id to validate this)
        String otp = otpService.generateOtp(email);
        emailService.sendOtpEmail(email, otp);
        return ResponseEntity.ok("OTP sent successfully");
    }

    @PostMapping("/validate")
    public ResponseEntity<?> validateOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String enteredOtp = request.get("otp");

        boolean isValid = otpService.validateOtp(email, enteredOtp);
        return isValid ? ResponseEntity.ok("✅ OTP validated successfully!") : new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }
}

