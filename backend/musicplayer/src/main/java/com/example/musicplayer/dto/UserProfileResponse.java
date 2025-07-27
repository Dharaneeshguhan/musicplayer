package com.example.musicplayer.dto;

import com.example.musicplayer.model.User;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@AllArgsConstructor
public class UserProfileResponse {
    private String name;
    private String email;
    private LocalDate joinedAt;
    private int favorites;
    private int playlists;

    public UserProfileResponse(User user) {
        this.name = user.getName();
        this.email = user.getEmail();
        this.joinedAt = user.getJoinedAt();
        this.favorites = user.getFavorites().size(); // ✅ Count the set size
        this.playlists = user.getPlaylists().size(); // ✅ Same for playlists
    }
}
