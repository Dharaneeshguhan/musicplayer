package com.example.musicplayer.controller;

import com.example.musicplayer.model.Track;
import com.example.musicplayer.model.User;
import com.example.musicplayer.repository.TrackRepository;
import com.example.musicplayer.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/favorites")
@CrossOrigin(origins = "http://localhost:5173")
public class FavoriteController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TrackRepository trackRepository;

    @GetMapping
    public ResponseEntity<?> getFavorites(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        return ResponseEntity.ok(user.getFavorites());
    }

    @PostMapping("/{trackId}")
    public ResponseEntity<?> addFavorite(Authentication auth, @PathVariable Long trackId) {
        User user = userRepository.findByEmail(auth.getName()).orElseThrow();
        Track track = trackRepository.findById(trackId).orElseThrow();

        user.getFavorites().add(track);
        userRepository.save(user);
        return ResponseEntity.ok("Added to favorites");
    }

    @DeleteMapping("/{trackId}")
    public ResponseEntity<?> removeFavorite(Authentication auth, @PathVariable Long trackId) {
        User user = userRepository.findByEmail(auth.getName()).orElseThrow();
        Track track = trackRepository.findById(trackId).orElseThrow();

        user.getFavorites().remove(track);
        userRepository.save(user);
        return ResponseEntity.ok("Removed from favorites");
    }
}
