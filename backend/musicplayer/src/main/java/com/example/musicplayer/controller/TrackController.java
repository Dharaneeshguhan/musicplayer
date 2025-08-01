package com.example.musicplayer.controller;

import com.example.musicplayer.model.Track;
import com.example.musicplayer.repository.TrackRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tracks")
@CrossOrigin(origins = "http://localhost:5173")
public class TrackController {

    private final TrackRepository trackRepository;

    public TrackController(TrackRepository trackRepository) {
        this.trackRepository = trackRepository;
    }

    @GetMapping
    public List<Track> getAllTracks() {
        // Since this might be public API, consider if you want to expose full Track or a DTO
        return trackRepository.findAll();
    }
}
