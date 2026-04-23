package com.smartbooking.service;

import com.smartbooking.config.JwtTokenProvider;
import com.smartbooking.dto.AuthResponseDto;
import com.smartbooking.dto.RegisterRequestDto;
import com.smartbooking.dto.UserResponseDto;
import com.smartbooking.entity.RefreshToken;
import com.smartbooking.entity.User;
import com.smartbooking.exception.DuplicateResourceException;
import com.smartbooking.exception.ResourceNotFoundException;
import com.smartbooking.model.UserRole;
import com.smartbooking.repository.RefreshTokenRepository;
import com.smartbooking.repository.UserRepository;
import java.time.LocalDateTime;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthService(UserRepository userRepository, RefreshTokenRepository refreshTokenRepository, PasswordEncoder passwordEncoder, JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    public UserResponseDto register(RegisterRequestDto request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email is already registered.");
        }

        User user = new User(
            request.getName(),
            request.getEmail().toLowerCase(),
            passwordEncoder.encode(request.getPassword()),
            UserRole.ROLE_USER
        );
        User saved = userRepository.save(user);
        return new UserResponseDto(saved.getId(), saved.getName(), saved.getEmail(), saved.getRole());
    }

    @Transactional
    public AuthResponseDto login(String email, String password) {
        User user = userRepository.findByEmail(email.toLowerCase())
            .orElseThrow(() -> new ResourceNotFoundException("Email or password is invalid."));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new IllegalArgumentException("Email or password is invalid.");
        }

        String token = jwtTokenProvider.generateAccessToken(user);
        String refreshTokenValue = jwtTokenProvider.generateRefreshToken(user);
        LocalDateTime refreshExpiry = LocalDateTime.now().plusSeconds(jwtTokenProvider.getRefreshExpirationMs() / 1000);
        refreshTokenRepository.save(new RefreshToken(refreshTokenValue, user, refreshExpiry));
        return new AuthResponseDto(token, refreshTokenValue, user.getId(), user.getName(), user.getEmail(), user.getRole());
    }

    @Transactional
    public AuthResponseDto refresh(String refreshTokenValue) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(refreshTokenValue)
            .orElseThrow(() -> new ResourceNotFoundException("Refresh token is invalid."));

        if (refreshToken.isRevoked() || refreshToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Refresh token expired or revoked.");
        }

        User user = refreshToken.getUser();
        String accessToken = jwtTokenProvider.generateAccessToken(user);
        String rotatedRefreshToken = jwtTokenProvider.generateRefreshToken(user);

        refreshToken.setRevoked(true);
        refreshTokenRepository.save(refreshToken);

        LocalDateTime refreshExpiry = LocalDateTime.now().plusSeconds(jwtTokenProvider.getRefreshExpirationMs() / 1000);
        refreshTokenRepository.save(new RefreshToken(rotatedRefreshToken, user, refreshExpiry));

        return new AuthResponseDto(accessToken, rotatedRefreshToken, user.getId(), user.getName(), user.getEmail(), user.getRole());
    }

    @Transactional
    public void logout(Long userId) {
        refreshTokenRepository.findByUserIdAndRevokedFalse(userId).forEach(token -> token.setRevoked(true));
    }
}
