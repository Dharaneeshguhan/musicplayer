package com.example.musicplayer.dto;

import com.example.musicplayer.model.User;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

public class UserProfileResponse {
    private String name;
    private String email;
    private LocalDate joinedAt;
    private List<TrackDTO> favorites;
    private List<PlaylistDTO> playlists;

    public UserProfileResponse(User user) {
        this.name = user.getName();
        this.email = user.getEmail();
        this.joinedAt = user.getJoinedAt();
        this.favorites = user.getFavorites().stream()
                .map(t -> new TrackDTO(t.getId(), t.getTitle(), t.getArtist(), t.getCover(), t.getUrl()))
                .collect(Collectors.toList());
        this.playlists = user.getPlaylists().stream()
                .map(pl -> new PlaylistDTO(
                        pl.getId(),
                        pl.getName(),
                        pl.getTracks().stream()
                                .map(t -> new TrackDTO(t.getId(), t.getTitle(), t.getArtist(), t.getCover(), t.getUrl()))
                                .collect(Collectors.toList())
                ))
                .collect(Collectors.toList());
    }

    // Getters
}
