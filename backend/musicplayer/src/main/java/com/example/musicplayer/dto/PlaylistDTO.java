package com.example.musicplayer.dto;

import java.util.List;

public class PlaylistDTO {
    private Long id;
    private String name;
    private List<TrackDTO> tracks;

    // ✅ Default constructor (required for Jackson)
    public PlaylistDTO() {
    }

    public PlaylistDTO(Long id, String name, List<TrackDTO> tracks) {
        this.id = id;
        this.name = name;
        this.tracks = tracks;
    }

    // ✅ Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<TrackDTO> getTracks() {
        return tracks;
    }

    public void setTracks(List<TrackDTO> tracks) {
        this.tracks = tracks;
    }
}
