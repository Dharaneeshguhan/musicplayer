package com.example.musicplayer.repository;
import com.example.musicplayer.model.Track;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface TrackRepository extends JpaRepository<Track, Long> {
    Optional<Track> findById(Long id);
    boolean existsById(Long id);
}