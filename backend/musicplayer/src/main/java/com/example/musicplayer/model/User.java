package com.example.musicplayer.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users") // avoid naming conflict with reserved words
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    private LocalDateTime createdAt;

    private LocalDate joinedAt;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "user_favorites",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "track_id")
    )
    @JsonIgnore // prevent infinite recursion during JSON serialization
    private Set<Track> favorites = new HashSet<>();

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JsonIgnore
    private Set<Playlist> playlists = new HashSet<>();

    // Constructors
    public User() {}

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void addFavorite(Long trackId) {
        Track track = new Track(trackId);
        favorites.add(track);
    }

    public void removeFavorite(Long trackId) {
        favorites.removeIf(track -> track.getId().equals(trackId));
    }

    public void createPlaylist(String name) {
        Playlist playlist = new Playlist(name, this);
        playlists.add(playlist);
    }

    public void addTrackToPlaylist(Long playlistId, Long trackId) {
        Playlist playlist = playlists.stream()
                .filter(p -> p.getId().equals(playlistId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Playlist not found"));
        Track track = new Track(trackId);
        playlist.addTrack(track);
    }

    public Long getId() {
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDate getJoinedAt() {
        return joinedAt;
    }

    public void setJoinedAt(LocalDate joinedAt) {
        this.joinedAt = joinedAt;
    }

    public Set<Track> getFavorites() {
        return favorites;
    }

    public void setFavorites(Set<Track> favorites) {
        this.favorites = favorites;
    }

    public Set<Playlist> getPlaylists() {
        return playlists;
    }

    public void setPlaylists(Set<Playlist> playlists) {
        this.playlists = playlists;
    }
}
