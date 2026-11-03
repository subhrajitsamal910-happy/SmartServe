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
        // Seed core demo data only once
        if (userRepository.count() > 0) {
            return;
        }

        // --- Core demo accounts ---
        User admin = userRepository.save(new User("Admin User", "admin@smartserve.ai", passwordEncoder.encode("admin123"), UserRole.ROLE_ADMIN));
        User priya = userRepository.save(new User("Priya Mehta", "user@smartserve.ai", passwordEncoder.encode("password123"), UserRole.ROLE_USER));
        User rohan = userRepository.save(new User("Rohan Gupta", "rohan@smartserve.ai", passwordEncoder.encode("password123"), UserRole.ROLE_USER));

        // --- Core providers & services ---
        ServiceProvider cleanCo = providerRepository.save(new ServiceProvider("Sparkle Home Care", "clean@sparkle.example", "9876543210"));
        ServiceProvider repairCo = providerRepository.save(new ServiceProvider("Urban Fix Experts", "fix@urban.example", "9876501234"));
        ServiceProvider learnCo = providerRepository.save(new ServiceProvider("Bright Minds Tutors", "learn@bright.example", "9876512345"));

        ServiceEntity cleaning = serviceRepository.save(new ServiceEntity("Deep Home Cleaning", "Complete home cleaning with kitchen, bathroom, and sanitization support.", ServiceCategory.HOME_CLEANING, cleanCo, 1299.0));
        ServiceEntity electrical = serviceRepository.save(new ServiceEntity("Electrical Repair", "Certified technician visit for fan, switchboard, wiring, and power issues.", ServiceCategory.ELECTRICAL, repairCo, 899.0));
        ServiceEntity plumbing = serviceRepository.save(new ServiceEntity("Plumbing Maintenance", "Leak repair, tap replacement, drainage checks, and preventive maintenance.", ServiceCategory.PLUMBING, repairCo, 799.0));
        ServiceEntity tutoring = serviceRepository.save(new ServiceEntity("Math Tutoring", "One-on-one tutoring for school students with personalized learning plans.", ServiceCategory.TUTORING, learnCo, 499.0));
        ServiceEntity painting = serviceRepository.save(new ServiceEntity("Wall Painting Refresh", "Single-room painting with material consultation and clean finishing.", ServiceCategory.PAINTING, cleanCo, 2499.0));

        // --- Core bookings & ratings ---
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

        // --- Additional dummy data for testing (only added once) ---
        // Extra users
        User alice = userRepository.save(new User("Alice Wonderland", "alice@example.com", passwordEncoder.encode("alice123"), UserRole.ROLE_USER));
        User bob = userRepository.save(new User("Bob Builder", "bob@example.com", passwordEncoder.encode("bob123"), UserRole.ROLE_USER));
        User carol = userRepository.save(new User("Carol Singer", "carol@example.com", passwordEncoder.encode("carol123"), UserRole.ROLE_USER));
        User dave = userRepository.save(new User("Dave Engineer", "dave@example.com", passwordEncoder.encode("dave123"), UserRole.ROLE_USER));

        // Extra providers
        ServiceProvider pestCo = providerRepository.save(new ServiceProvider("Eco Pest Control", "pest@eco.example", "9876523456"));
        ServiceProvider gardenCo = providerRepository.save(new ServiceProvider("Green Thumb Gardens", "garden@green.example", "9876534567"));

        // Extra services
        ServiceEntity pest = serviceRepository.save(new ServiceEntity("Home Pest Control", "One‑hour inspection and treatment for common household pests.", ServiceCategory.HOME_CLEANING, pestCo, 599.0));
        ServiceEntity gardening = serviceRepository.save(new ServiceEntity("Garden Maintenance", "Weekly lawn mowing, weeding, and plant care.", ServiceCategory.HOME_CLEANING, gardenCo, 799.0));
        ServiceEntity painting2 = serviceRepository.save(new ServiceEntity("Full House Painting", "Complete interior painting for up to 3 rooms.", ServiceCategory.PAINTING, cleanCo, 7499.0));
        ServiceEntity tutoring2 = serviceRepository.save(new ServiceEntity("Physics Tutoring", "Advanced high‑school physics sessions.", ServiceCategory.TUTORING, learnCo, 599.0));

        // Extra bookings (some confirmed, some flagged to test fraud/risk)
        bookingRepository.save(new Booking(alice, pest, BookingStatus.CONFIRMED));
        bookingRepository.save(new Booking(bob, gardening, BookingStatus.CONFIRMED));
        bookingRepository.save(new Booking(carol, painting2, BookingStatus.CONFIRMED));
        bookingRepository.save(new Booking(dave, tutoring2, BookingStatus.CONFIRMED));
        // A flagged booking to exercise risk scoring
        bookingRepository.save(new Booking(alice, cleaning, BookingStatus.FLAGGED));

        // Extra ratings
        ratingRepository.save(new Rating(alice, pest, 4, "Effective treatment, minor odor."));
        ratingRepository.save(new Rating(bob, gardening, 5, "Garden looks fantastic!"));
        ratingRepository.save(new Rating(carol, painting2, 3, "Good work but minor streaks."));
        ratingRepository.save(new Rating(dave, tutoring2, 5, "Clear explanations, helped me ace the exam."));
    }
}
