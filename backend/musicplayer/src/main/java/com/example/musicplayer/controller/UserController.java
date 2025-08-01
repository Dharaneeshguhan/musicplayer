package com.example.musicplayer.controller;

import com.example.musicplayer.dto.PlaylistDTO;
import com.example.musicplayer.dto.TrackDTO;
import com.example.musicplayer.model.User;
import com.example.musicplayer.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserRepository userRepository;
    
    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/check-user")
    @Transactional(readOnly = true)
    public ResponseEntity<String> checkUser(String email) {
        System.out.println("UserController checkUser - Checking email: " + email);
        boolean exists = userRepository.existsByEmailIgnoreCase(email);
        System.out.println("UserController checkUser - User exists: " + exists);
        return ResponseEntity.ok("User exists: " + exists);
    }

    private User getUserFromPrincipal(Principal principal) {
        String email = principal.getName();
        System.out.println("UserController - Getting user for email: " + email);
        
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> {
                    System.out.println("UserController - User not found for email: " + email);
                    return new RuntimeException("User not found for email: " + email);
                });
                
        System.out.println("UserController - User found: " + user.getEmail());
        return user;
    }

    @GetMapping("/favorites")
    @Transactional(readOnly = true)
    public ResponseEntity<List<TrackDTO>> getFavorites(Principal principal) {
        User user = getUserFromPrincipal(principal);
        List<TrackDTO> favorites = user.getFavorites()
                .stream()
                .map(t -> new TrackDTO(t.getId(), t.getTitle(), t.getArtist(), t.getCover(), t.getUrl()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(favorites);
    }

    @GetMapping("/playlists")
    @Transactional(readOnly = true)
    public ResponseEntity<List<PlaylistDTO>> getPlaylists(Principal principal) {
        User user = getUserFromPrincipal(principal);
        List<PlaylistDTO> playlists = user.getPlaylists().stream()
                .map(pl -> new PlaylistDTO(pl.getId(), pl.getName(), pl.getTracks()
                        .stream()
                        .map(t -> new TrackDTO(t.getId(), t.getTitle(), t.getArtist(), t.getCover(), t.getUrl()))
                        .collect(Collectors.toList())))
                .collect(Collectors.toList());
        return ResponseEntity.ok(playlists);
    }

    @PostMapping("/favorites")
    @Transactional
    public ResponseEntity<Void> addFavorite(@RequestBody Long trackId, Principal principal) {
        User user = getUserFromPrincipal(principal);
        user.addFavorite(trackId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/favorites/{trackId}")
    @Transactional
    public ResponseEntity<Void> removeFavorite(@PathVariable Long trackId, Principal principal) {
        User user = getUserFromPrincipal(principal);
        user.removeFavorite(trackId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/playlists")
    @Transactional
    public ResponseEntity<Void> createPlaylist(@RequestBody String playlistName, Principal principal) {
        User user = getUserFromPrincipal(principal);
        user.createPlaylist(playlistName);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/playlists/{playlistId}/tracks")
    @Transactional
    public ResponseEntity<Void> addTrackToPlaylist(@PathVariable Long playlistId,
                                                   @RequestBody Long trackId,
                                                   Principal principal) {
        User user = getUserFromPrincipal(principal);
        user.addTrackToPlaylist(playlistId, trackId);
        return ResponseEntity.ok().build();
    }

}
