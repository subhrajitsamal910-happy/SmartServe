package com.smartbooking.service;

import com.smartbooking.dto.PaymentResultDto;
import com.smartbooking.entity.ServiceEntity;
import com.smartbooking.entity.User;
import com.smartbooking.model.PaymentStatus;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class PaymentService {
    @Value("${stripe.secret-key:}")
    private String stripeSecretKey;

    public PaymentResultDto process(User user, ServiceEntity service, int riskScore) {
        if (riskScore >= 90) {
            return new PaymentResultDto(PaymentStatus.FAILED, null, "Payment held because fraud risk is very high.");
        }

        if (stripeSecretKey != null && !stripeSecretKey.isBlank()) {
            try {
                Stripe.apiKey = stripeSecretKey;
                PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount((long) (service.getPrice() * 100))
                    .setCurrency("inr")
                    .setDescription("SmartServe booking payment for " + service.getTitle())
                    .putMetadata("userEmail", user.getEmail())
                    .build();

                PaymentIntent intent = PaymentIntent.create(params);
                return new PaymentResultDto(PaymentStatus.SUCCESS, intent.getId(), "Stripe test payment intent created.");
            } catch (StripeException ex) {
                return new PaymentResultDto(PaymentStatus.FAILED, null, "Stripe payment failed: " + ex.getMessage());
            }
        }

        String transactionId = "SIM-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        return new PaymentResultDto(PaymentStatus.SUCCESS, transactionId, "Simulated payment successful for " + service.getTitle() + ".");
    }
}
