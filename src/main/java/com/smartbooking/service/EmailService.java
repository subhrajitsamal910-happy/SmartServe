package com.smartbooking.service;

import com.smartbooking.entity.Booking;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    private final ObjectProvider<JavaMailSender> mailSenderProvider;

    public EmailService(ObjectProvider<JavaMailSender> mailSenderProvider) {
        this.mailSenderProvider = mailSenderProvider;
    }

    @Async
    public void sendBookingConfirmed(Booking booking) {
        sendBookingEmail(booking, "Booking Confirmed", "Your booking #" + booking.getId() + " for " + booking.getService().getTitle() + " is confirmed.");
    }

    @Async
    public void sendBookingCancelled(Booking booking) {
        sendBookingEmail(booking, "Booking Cancelled", "Your booking #" + booking.getId() + " for " + booking.getService().getTitle() + " was cancelled.");
    }

    private void sendBookingEmail(Booking booking, String subject, String body) {
        JavaMailSender mailSender = mailSenderProvider.getIfAvailable();
        if (mailSender == null) {
            System.out.println("Email skipped for demo environment: JavaMailSender is not configured.");
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("noreply@smartserve.ai");
            message.setTo(booking.getUser().getEmail());
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
        } catch (Exception ex) {
            System.out.println("Email skipped for demo environment: " + ex.getMessage());
        }
    }
}
