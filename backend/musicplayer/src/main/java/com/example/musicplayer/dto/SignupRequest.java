package com.example.musicplayer.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class SignupRequest {
    private String name;
    private String email;
    private String password;
}

