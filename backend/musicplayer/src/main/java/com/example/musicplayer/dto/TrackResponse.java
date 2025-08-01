package com.example.musicplayer.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TrackResponse {
    private Long id;
    private String title;
    private String artist;
    private String album;
    private Integer year;
    private Integer duration; // in seconds
    private String cover; // album art URL
    private String audioSrc; // audio source URL
}
