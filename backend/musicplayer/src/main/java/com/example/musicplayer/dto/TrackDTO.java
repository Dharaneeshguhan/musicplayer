package com.example.musicplayer.dto;

public class TrackDTO {
    private Long id;
    private String title;
    private String artist;
    private String cover;
    private String url;

    // ✅ Constructor matching your usage
    public TrackDTO(Long id, String title, String artist, String cover, String url) {
        this.id = id;
        this.title = title;
        this.artist = artist;
        this.cover = cover;
        this.url = url;
    }

    // ✅ Default constructor (optional but good for frameworks like Jackson)
    public TrackDTO() {}

    // ✅ Getters and Setters
    public Long getId() {
        return id;
    }

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

    public String getCover() {
        return cover;
    }

    public void setCover(String cover) {
        this.cover = cover;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }
}
