package com.example.musicplayer.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;

@Entity
public class Track {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String artist;

    private String url; // The audio source url

    private String cover; // Cover image url

    @ManyToMany(mappedBy = "favorites", fetch = FetchType.LAZY)
    @JsonIgnore
    private Set<User> usersWhoFavorited = new HashSet<>();

    // Constructors
    public Track() {}

    public Track(Long id, String title, String artist, String url, String cover) {
        this.id = id;
        this.title = title;
        this.artist = artist;
        this.url = url;
        this.cover = cover;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    // ... (other getters and setters omitted for brevity)
    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getArtist() {
        return artist;
    }

    public void setArtist(String artist) {
        this.artist = artist;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getCover() {
        return cover;
    }

    public void setCover(String cover) {
        this.cover = cover;
    }

    public Set<User> getFavoredByUsers() {
        return favoredByUsers;
    }

    public void setFavoredByUsers(Set<User> favoredByUsers) {
        this.favoredByUsers = favoredByUsers;
    }
}
