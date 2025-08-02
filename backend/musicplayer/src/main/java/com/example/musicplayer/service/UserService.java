package com.example.musicplayer.service;

import com.example.musicplayer.model.User;
import com.example.musicplayer.model.Track;
import com.example.musicplayer.repository.TrackRepository;
import com.example.musicplayer.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TrackRepository trackRepository;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
        return user;
    }

    @Transactional
    public void addFavorite(User user, Long trackId) {
        Track track = trackRepository.findById(trackId)
                .orElseThrow(() -> new RuntimeException("Track not found with ID: " + trackId));
        user.addFavorite(track);
    }

    @Transactional
    public void removeFavorite(User user, Long trackId) {
        Track track = trackRepository.findById(trackId)
                .orElseThrow(() -> new RuntimeException("Track not found with ID: " + trackId));
        user.removeFavorite(track);
    }

    @Transactional
    public void createPlaylist(User user, String playlistName) {
        user.createPlaylist(playlistName);
    }

    @Transactional
    public void addTrackToPlaylist(User user, Long playlistId, Long trackId) {
        var playlist = user.getPlaylists().stream()
                .filter(p -> p.getId().equals(playlistId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Playlist not found with ID: " + playlistId));
        var track = trackRepository.findById(trackId)
                .orElseThrow(() -> new RuntimeException("Track not found with ID: " + trackId));
        user.addTrackToPlaylist(playlist, track);
    }
}
