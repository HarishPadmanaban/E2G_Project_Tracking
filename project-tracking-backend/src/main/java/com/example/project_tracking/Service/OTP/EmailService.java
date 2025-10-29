package com.example.project_tracking.Service.OTP;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendOtpEmail(String to, String otp) {
        String subject = "Password Reset Request – Your One-Time Password (OTP)";
        String message = String.format("""
                Dear User,
                
                We received a request to reset your password.
                Please use the following One-Time Password (OTP) to proceed:
                
                OTP: %s
                
                This OTP is valid for the next 10 minutes.
                Do not share it with anyone.
                
                Regards,
                Support Team
                """, otp);

        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setFrom("cse251038@saranathan.ac.in");
        mailMessage.setTo(to);
        mailMessage.setSubject(subject);
        mailMessage.setText(message);

        mailSender.send(mailMessage);
        System.out.println("✅ OTP email sent successfully to " + to);
    }
}

