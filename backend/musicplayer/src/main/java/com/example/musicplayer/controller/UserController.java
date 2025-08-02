package com.example.musicplayer.controller;

import com.example.musicplayer.dto.PlaylistDTO;
import com.example.musicplayer.dto.TrackDTO;
import com.example.musicplayer.model.User;
import com.example.musicplayer.model.Track;
import com.example.musicplayer.repository.UserRepository;
import com.example.musicplayer.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.security.Principal;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserRepository userRepository;
    private final UserService userService;
    
    public UserController(UserRepository userRepository, UserService userService) {
        this.userRepository = userRepository;
        this.userService = userService;
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
    public ResponseEntity<Void> toggleFavorite(@RequestBody Map<String, Long> requestBody, Principal principal) {
        User user = getUserFromPrincipal(principal);
        Long trackId = requestBody.get("trackId");
        
        if (trackId == null) {
            return ResponseEntity.badRequest().body(null);
        }
        
        try {
            // Check if track is already a favorite
            boolean isFavorite = user.getFavorites().stream()
                .anyMatch(t -> t.getId().equals(trackId));
            
            if (isFavorite) {
                userService.removeFavorite(user, trackId);
            } else {
                userService.addFavorite(user, trackId);
            }
            
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/favorites")
    public ResponseEntity<List<Track>> getFavorites(Principal principal) {
        User user = getUserFromPrincipal(principal);
        return ResponseEntity.ok(new ArrayList<>(user.getFavorites()));
    }

    @PostMapping("/playlists")
    public ResponseEntity<Void> createPlaylist(@RequestBody String playlistName, Principal principal) {
        User user = getUserFromPrincipal(principal);
        userService.createPlaylist(user, playlistName);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/playlists/{playlistId}/tracks")
    public ResponseEntity<Void> addTrackToPlaylist(@PathVariable Long playlistId,
                                                   @RequestBody Long trackId,
                                                   Principal principal) {
        User user = getUserFromPrincipal(principal);
        userService.addTrackToPlaylist(user, playlistId, trackId);
        return ResponseEntity.ok().build();
    }

}
