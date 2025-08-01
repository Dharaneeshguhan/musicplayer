package com.example.musicplayer.controller;

import com.example.musicplayer.dto.PlaylistDTO;
import com.example.musicplayer.dto.TrackDTO;
import com.example.musicplayer.model.Playlist;
import com.example.musicplayer.repository.PlaylistRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/playlists")
@CrossOrigin(origins = "http://localhost:5173")
public class PlaylistController {

    private final PlaylistRepository playlistRepository;

    public PlaylistController(PlaylistRepository playlistRepository) {
        this.playlistRepository = playlistRepository;
    }

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<List<PlaylistDTO>> getAllPlaylists() {
        List<Playlist> playlists = playlistRepository.findAll();
        List<PlaylistDTO> playlistDtos = playlists.stream()
                .map(pl -> new PlaylistDTO(
                        pl.getId(),
                        pl.getName(),
                        pl.getTracks().stream()
                                .map(t -> new TrackDTO(t.getId(), t.getTitle(), t.getArtist(), t.getCover(), t.getUrl()))
                                .collect(Collectors.toList())
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(playlistDtos);
    }
}
