package com.example.musicplayer.repository;

import com.example.musicplayer.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmailIgnoreCase(String email);         // for login & profile
    boolean existsByEmailIgnoreCase(String email);              // for register
}
