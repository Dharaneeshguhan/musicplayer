package com.example.musicplayer.controller;

import com.example.musicplayer.dto.UserProfileResponse;
import com.example.musicplayer.model.User;
import com.example.musicplayer.repository.UserRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:5173")
public class ProfileController {

    private final UserRepository userRepository;

    public ProfileController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/profile")
    @Transactional(readOnly = true)
    public UserProfileResponse profile(Principal principal) {
        System.out.println("Profile request for user: " + principal.getName());

        // Use case-insensitive email lookup
        User user = userRepository.findByEmailIgnoreCase(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new UserProfileResponse(user);
    }
}
