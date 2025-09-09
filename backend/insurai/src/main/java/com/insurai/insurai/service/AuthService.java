package com.insurai.insurai.service;

import java.util.Optional;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.insurai.insurai.model.User;
import com.insurai.insurai.model.UserCategory;
import com.insurai.insurai.repository.UserRepository;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User registerUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Default role if not provided
        if (user.getCategory() == null) {
            user.setCategory(UserCategory.USER);
        }

        return userRepository.save(user);
    }

    public Optional<User> loginUser(String email, String rawPassword, UserCategory category) {
        Optional<User> user = userRepository.findByEmailAndCategory(email, category);

        if (user.isPresent() && passwordEncoder.matches(rawPassword, user.get().getPassword())) {
            return user;
        }
        return Optional.empty();
    }
}
