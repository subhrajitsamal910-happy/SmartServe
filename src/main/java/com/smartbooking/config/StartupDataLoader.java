package com.smartbooking.config;

import com.smartbooking.entity.Booking;
import com.smartbooking.entity.Rating;
import com.smartbooking.entity.ServiceEntity;
import com.smartbooking.entity.ServiceProvider;
import com.smartbooking.entity.User;
import com.smartbooking.model.BookingStatus;
import com.smartbooking.model.ServiceCategory;
import com.smartbooking.model.UserRole;
import com.smartbooking.repository.BookingRepository;
import com.smartbooking.repository.ProviderRepository;
import com.smartbooking.repository.RatingRepository;
import com.smartbooking.repository.ServiceRepository;
import com.smartbooking.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class StartupDataLoader implements CommandLineRunner {
    private final UserRepository userRepository;
    private final ProviderRepository providerRepository;
    private final ServiceRepository serviceRepository;
    private final BookingRepository bookingRepository;
    private final RatingRepository ratingRepository;
    private final PasswordEncoder passwordEncoder;

    public StartupDataLoader(UserRepository userRepository, ProviderRepository providerRepository, ServiceRepository serviceRepository, BookingRepository bookingRepository, RatingRepository ratingRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.providerRepository = providerRepository;
        this.serviceRepository = serviceRepository;
        this.bookingRepository = bookingRepository;
        this.ratingRepository = ratingRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return;
        }

        User admin = userRepository.save(new User("Admin User", "admin@smartserve.ai", passwordEncoder.encode("admin123"), UserRole.ROLE_ADMIN));
        User priya = userRepository.save(new User("Priya Mehta", "user@smartserve.ai", passwordEncoder.encode("password123"), UserRole.ROLE_USER));
        User rohan = userRepository.save(new User("Rohan Gupta", "rohan@smartserve.ai", passwordEncoder.encode("password123"), UserRole.ROLE_USER));

        ServiceProvider cleanCo = providerRepository.save(new ServiceProvider("Sparkle Home Care", "clean@sparkle.example", "9876543210"));
        ServiceProvider repairCo = providerRepository.save(new ServiceProvider("Urban Fix Experts", "fix@urban.example", "9876501234"));
        ServiceProvider learnCo = providerRepository.save(new ServiceProvider("Bright Minds Tutors", "learn@bright.example", "9876512345"));

        ServiceEntity cleaning = serviceRepository.save(new ServiceEntity("Deep Home Cleaning", "Complete home cleaning with kitchen, bathroom, and sanitization support.", ServiceCategory.HOME_CLEANING, cleanCo, 1299.0));
        ServiceEntity electrical = serviceRepository.save(new ServiceEntity("Electrical Repair", "Certified technician visit for fan, switchboard, wiring, and power issues.", ServiceCategory.ELECTRICAL, repairCo, 899.0));
        ServiceEntity plumbing = serviceRepository.save(new ServiceEntity("Plumbing Maintenance", "Leak repair, tap replacement, drainage checks, and preventive maintenance.", ServiceCategory.PLUMBING, repairCo, 799.0));
        ServiceEntity tutoring = serviceRepository.save(new ServiceEntity("Math Tutoring", "One-on-one tutoring for school students with personalized learning plans.", ServiceCategory.TUTORING, learnCo, 499.0));
        ServiceEntity painting = serviceRepository.save(new ServiceEntity("Wall Painting Refresh", "Single-room painting with material consultation and clean finishing.", ServiceCategory.PAINTING, cleanCo, 2499.0));

        bookingRepository.save(new Booking(admin, electrical, BookingStatus.CONFIRMED));
        bookingRepository.save(new Booking(priya, cleaning, BookingStatus.CONFIRMED));
        bookingRepository.save(new Booking(priya, cleaning, BookingStatus.CONFIRMED));
        bookingRepository.save(new Booking(rohan, plumbing, BookingStatus.CONFIRMED));
        bookingRepository.save(new Booking(rohan, tutoring, BookingStatus.CONFIRMED));

        ratingRepository.save(new Rating(priya, cleaning, 5, "Excellent cleaning and very punctual."));
        ratingRepository.save(new Rating(priya, plumbing, 4, "Good repair quality and clear pricing."));
        ratingRepository.save(new Rating(rohan, tutoring, 5, "Helpful tutoring with strong explanations."));
        ratingRepository.save(new Rating(admin, electrical, 4, "Resolved the issue quickly."));
        ratingRepository.save(new Rating(rohan, painting, 4, "Clean finishing and polite staff."));
    }
}
