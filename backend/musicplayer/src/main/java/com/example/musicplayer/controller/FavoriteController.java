package com.example.musicplayer.controller;

import com.example.musicplayer.dto.TrackDTO;
import com.example.musicplayer.model.Track;
import com.example.musicplayer.model.User;
import com.example.musicplayer.repository.TrackRepository;
import com.example.musicplayer.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/favorites")
@CrossOrigin(origins = "http://localhost:5173")
public class FavoriteController {

    private final UserRepository userRepository;
    private final TrackRepository trackRepository;

    public FavoriteController(UserRepository userRepository, TrackRepository trackRepository) {
        this.userRepository = userRepository;
        this.trackRepository = trackRepository;
    }

    @GetMapping
    @Transactional(readOnly = true)
    public List<TrackDTO> getFavorites(Authentication authentication) {
        User user = getUserFromAuth(authentication);
        return user.getFavorites().stream()
                .map(t -> new TrackDTO(t.getId(), t.getTitle(), t.getArtist(), t.getCover(), t.getUrl()))
                .collect(Collectors.toList());
    }

    @PostMapping("/{trackId}")
    public ResponseEntity<String> addFavorite(Authentication authentication, @PathVariable Long trackId) {
        User user = getUserFromAuth(authentication);
        Track track = trackRepository.findById(trackId)
                .orElseThrow(() -> new RuntimeException("Track not found"));

        user.getFavorites().add(track);
        userRepository.save(user);
        return ResponseEntity.ok("Added to favorites");
    }

    @DeleteMapping("/{trackId}")
    public ResponseEntity<String> removeFavorite(Authentication authentication, @PathVariable Long trackId) {
        User user = getUserFromAuth(authentication);
        Track track = trackRepository.findById(trackId)
                .orElseThrow(() -> new RuntimeException("Track not found"));

        user.getFavorites().remove(track);
        userRepository.save(user);
        return ResponseEntity.ok("Removed from favorites");
    }

    private User getUserFromAuth(Authentication authentication) {
        if (authentication == null || authentication.getPrincipal() == null) {
            throw new RuntimeException("Unauthorized");
        }

        String email;
        if (authentication.getPrincipal() instanceof User user) {
            return user;
        } else if (authentication.getPrincipal() instanceof String str) {
            email = str;
        } else {
            throw new RuntimeException("Unauthorized");
        }

        return userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
