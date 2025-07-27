package com.example.musicplayer.controller;

import com.example.musicplayer.model.Playlist;
import com.example.musicplayer.model.Track;
import com.example.musicplayer.model.User;
import com.example.musicplayer.repository.PlaylistRepository;
import com.example.musicplayer.repository.TrackRepository;
import com.example.musicplayer.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/playlists")
@CrossOrigin(origins = "http://localhost:5173")
public class PlaylistController {

    @Autowired
    private PlaylistRepository playlistRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private TrackRepository trackRepo;

    @PostMapping
    public ResponseEntity<?> createPlaylist(Authentication auth, @RequestBody Map<String, Object> body) {
        String name = (String) body.get("name");
        User user = userRepo.findByEmail(auth.getName()).orElseThrow();

        Playlist playlist = new Playlist();
        playlist.setName(name);
        playlist.setUser(user);
        playlistRepo.save(playlist);

        return ResponseEntity.ok("Playlist created");
    }

    @PostMapping("/{playlistId}/add/{trackId}")
    public ResponseEntity<?> addTrack(@PathVariable Long playlistId, @PathVariable Long trackId) {
        Playlist playlist = playlistRepo.findById(playlistId).orElseThrow();
        Track track = trackRepo.findById(trackId).orElseThrow();

        playlist.getTracks().add(track);
        playlistRepo.save(playlist);
        return ResponseEntity.ok("Track added to playlist");
    }

    @GetMapping
    public ResponseEntity<?> getUserPlaylists(Authentication auth) {
        User user = userRepo.findByEmail(auth.getName()).orElseThrow();
        return ResponseEntity.ok(playlistRepo.findByUserId(user.getId()));
    }
}
