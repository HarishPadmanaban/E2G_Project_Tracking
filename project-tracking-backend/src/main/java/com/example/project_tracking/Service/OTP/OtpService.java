package com.example.project_tracking.Service.OTP;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class OtpService {

    private static final int OTP_VALID_DURATION = 10; // in minutes

    // Store OTP and expiration time temporarily (in-memory)
    private final Map<String, OtpData> otpStorage = new HashMap<>();

    public String generateOtp(String email) {
        String otp = String.format("%06d", new Random().nextInt(999999));
        otpStorage.put(email, new OtpData(otp, LocalDateTime.now().plusMinutes(OTP_VALID_DURATION)));
        return otp;
    }

    public boolean validateOtp(String email, String enteredOtp) {
        OtpData otpData = otpStorage.get(email);

        if (otpData == null) return false;
        if (otpData.getExpiryTime().isBefore(LocalDateTime.now())) {
            otpStorage.remove(email); // remove expired OTP
            return false;
        }

        boolean isValid = otpData.getOtp().equals(enteredOtp);
        if (isValid) otpStorage.remove(email); // OTP used → remove
        return isValid;
    }

    private static class OtpData {
        private final String otp;
        private final LocalDateTime expiryTime;

        public OtpData(String otp, LocalDateTime expiryTime) {
            this.otp = otp;
            this.expiryTime = expiryTime;
        }

        public String getOtp() {
            return otp;
        }

        public LocalDateTime getExpiryTime() {
            return expiryTime;
        }
    }
}

