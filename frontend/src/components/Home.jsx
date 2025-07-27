import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  FiUser,
  FiSettings,
  FiLogOut,
  FiMusic,
  FiHome,
  FiHeart,
  FiChevronDown,
  FiSearch,
  FiPlay,
  FiPause,
} from "react-icons/fi";
import MusicPlayer from "./MusicPlayer";

const API_BASE = "http://localhost:8080/api"; // Adjust your backend URL and port if needed

// Helper functions for API calls
async function fetchFavoritesFromBackend() {
  const res = await fetch(`${API_BASE}/favorites`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch favorites");
  return res.json(); // Expecting array of tracks
}

async function addFavoriteToBackend(trackId) {
  const res = await fetch(`${API_BASE}/favorites/${trackId}`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to add favorite");
  return res.text();
}

async function removeFavoriteFromBackend(trackId) {
  const res = await fetch(`${API_BASE}/favorites/${trackId}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to remove favorite");
  return res.text();
}

async function fetchPlaylistsFromBackend() {
  const res = await fetch(`${API_BASE}/playlists`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch playlists");
  return res.json(); // Expecting array of playlists with tracks
}

async function createPlaylistBackend(name) {
  const res = await fetch(`${API_BASE}/playlists`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error("Failed to create playlist");
  return res.text();
}

async function addTrackToPlaylistBackend(playlistId, trackId) {
  const res = await fetch(`${API_BASE}/playlists/${playlistId}/add/${trackId}`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to add track to playlist");
  return res.text();
}

// Temporary static tracks list, ideally fetched from backend in a real app
const mockTracks = [
  {
    id: 1,
    title: "Summer Vibes",
    artist: "Chill Wave",
    cover:
      "https://www.hdwallpapers.in/download/all_characters_in_stranger_things_hd_stranger_things-2560x1440.jpg",
    audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    id: 2,
    title: "Midnight City",
    artist: "Electric Dreams",
    cover: "https://source.unsplash.com/random/100x100/?music,night",
    audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  {
    id: 3,
    title: "Morning Coffee",
    artist: "Acoustic Mornings",
    cover: "https://source.unsplash.com/random/100x100/?music,morning",
    audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  },
];

const Home = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [allTracks, setAllTracks] = useState([]);
  const [recentTracks, setRecentTracks] = useState([]);
  const [activeNav, setActiveNav] = useState("home");
  const [favorites, setFavorites] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [queue, setQueue] = useState([]);
  const [volume, setVolume] = useState(0.7);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef(null);

  // Load initial data: tracks (mock), favorites, playlists
  useEffect(() => {
    setAllTracks(mockTracks);
    setRecentTracks(mockTracks);

    fetchFavoritesFromBackend()
      .then(setFavorites)
      .catch((e) => console.error("Error loading favorites:", e));

    fetchPlaylistsFromBackend()
      .then(setPlaylists)
      .catch((e) => console.error("Error loading playlists:", e));
  }, []);

  // Set default currentTrack when allTracks available
  useEffect(() => {
    if (!currentTrack && allTracks.length > 0) {
      setCurrentTrack(allTracks[0]);
      setCurrentIndex(0);
    }
  }, [allTracks, currentTrack]);

  // Audio element event listeners for time/progress updates
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / (audio.duration || 1)) * 100);
    };
    const updateDuration = () => setDuration(audio.duration || 0);

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("durationchange", updateDuration);
    audio.addEventListener("loadedmetadata", updateDuration);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("durationchange", updateDuration);
      audio.removeEventListener("loadedmetadata", updateDuration);
    };
  }, []);

  // Play/pause control when currentTrack or isPlaying changes
  useEffect(() => {
    if (!audioRef.current) return;
    if (currentTrack && isPlaying) {
      audioRef.current.src = currentTrack.audioSrc;
      audioRef.current
        .play()
        .catch(() => {
          setIsPlaying(false);
        });
    } else if (currentTrack && !isPlaying) {
      audioRef.current.pause();
    }
  }, [currentTrack, isPlaying]);

  // Set audio volume when changed
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // Pause audio and cleanup on unmount & tab hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  // Main player handlers (memoized)
  const playTrack = useCallback(
    (track, index = null) => {
      setCurrentTrack(track);
      setCurrentIndex(index ?? allTracks.findIndex((t) => t.id === track.id));
      setIsPlaying(true);
    },
    [allTracks]
  );

  const playNext = useCallback(() => {
    if (queue.length > 0) {
      const next = queue[0];
      setQueue((q) => q.slice(1));
      playTrack(next, allTracks.findIndex((t) => t.id === next.id));
    } else if (isShuffle) {
      const rand = Math.floor(Math.random() * allTracks.length);
      playTrack(allTracks[rand], rand);
    } else {
      const nextIndex = (currentIndex + 1) % allTracks.length;
      playTrack(allTracks[nextIndex], nextIndex);
    }
  }, [queue, isShuffle, currentIndex, allTracks, playTrack]);

  const playPrev = useCallback(() => {
    if (isShuffle) {
      const rand = Math.floor(Math.random() * allTracks.length);
      playTrack(allTracks[rand], rand);
    } else {
      const prevIndex = (currentIndex - 1 + allTracks.length) % allTracks.length;
      playTrack(allTracks[prevIndex], prevIndex);
    }
  }, [isShuffle, currentIndex, allTracks, playTrack]);

  const toggleShuffle = () => setIsShuffle((v) => !v);
  const toggleRepeat = () => setIsRepeat((v) => !v);
  const addToQueue = (track) => setQueue((q) => [...q, track]);
  const isCurrentTrackFavorite = !!favorites.find((f) => f.id === currentTrack?.id);

  // Toggle favorite by calling backend
  const handleToggleFavorite = async () => {
    if (!currentTrack) return;
    try {
      if (isCurrentTrackFavorite) {
        await removeFavoriteFromBackend(currentTrack.id);
      } else {
        await addFavoriteToBackend(currentTrack.id);
      }
      const updatedFavorites = await fetchFavoritesFromBackend();
      setFavorites(updatedFavorites);
    } catch (err) {
      console.error(err);
      alert("Failed to toggle favorite");
    }
  };

  // Add to playlist logic including create + add track
  const handleAddToPlaylist = async () => {
    if (!currentTrack) return;
    const name = prompt("Enter playlist name");
    if (!name) return;

    try {
      let pl = playlists.find((p) => p.name.toLowerCase() === name.toLowerCase());
      if (!pl) {
        await createPlaylistBackend(name);
        const updatedPlaylists = await fetchPlaylistsFromBackend();
        setPlaylists(updatedPlaylists);
        pl = updatedPlaylists.find((p) => p.name.toLowerCase() === name.toLowerCase());
      }
      if (pl) {
        await addTrackToPlaylistBackend(pl.id, currentTrack.id);
        const updatedPlaylists = await fetchPlaylistsFromBackend();
        setPlaylists(updatedPlaylists);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to add to playlist");
    }
  };

  // UI handlers
  const toggleDropdown = () => setDropdownOpen((d) => !d);
  const logout = () => alert("Logged out");
  const togglePlayPause = () => setIsPlaying((p) => !p);
  const handleSeek = (e) => {
    const percent = parseFloat(e.target.value);
    const time = (percent / 100) * duration;
    if (audioRef.current) audioRef.current.currentTime = time;
    setProgress(percent);
  };
  const handleVolume = (e) => setVolume(parseFloat(e.target.value));
  const handleNavClick = (navItem) => setActiveNav(navItem);

  // Play next song when current ends
  useEffect(() => {
    if (!audioRef.current) return;

    const handler = () => {
      if (isRepeat) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      } else {
        playNext();
      }
    };

    audioRef.current.addEventListener("ended", handler);
    return () => audioRef.current.removeEventListener("ended", handler);
  }, [isRepeat, playNext]);

  // Render loading if track unavailable yet
  if (!currentTrack) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Loading Music Player...
      </div>
    );
  }

  // ---------------- RENDER ----------------
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 to-indigo-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-xl p-5 hidden md:flex flex-col justify-between fixed h-full">
        <div>
          <h2 className="text-2xl font-bold text-indigo-600 mb-8 flex items-center">
            <span className="mr-2">🎵</span> MusicWave
          </h2>
          <div className="relative mb-6">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <nav className="flex flex-col gap-1">
            {[
              { label: "Home", icon: <FiHome />, value: "home" },
              { label: "My Playlist", icon: <FiMusic />, value: "playlist" },
              { label: "Favorites", icon: <FiHeart />, value: "favorites" },
              { label: "Settings", icon: <FiSettings />, value: "settings" },
            ].map(({ label, icon, value }) => (
              <a
                key={value}
                href="#"
                className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                  activeNav === value
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => handleNavClick(value)}
              >
                {icon}
                <span className="font-medium">{label}</span>
              </a>
            ))}
          </nav>
        </div>
        <div className="mb-4 text-xs text-gray-500">
          <div className="text-gray-400 mb-2">© 2025 MusicWave</div>
          <div>v2.4.1</div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:ml-64 pb-44 overflow-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            {activeNav === "home" && "Welcome back 🎧"}
            {activeNav === "playlist" && "Your Playlists 🎶"}
            {activeNav === "favorites" && "Favorite Tracks ❤"}
            {activeNav === "settings" && "Settings ⚙"}
          </h1>

          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center gap-2 px-4 py-2 bg-white shadow rounded-full hover:shadow-md transition-all duration-300"
            >
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                <FiUser />
              </div>
              <span className="text-sm font-medium">Username</span>
              <FiChevronDown
                className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-xl z-10 overflow-hidden animate-fadeIn">
                <a
                  href="/profile"
                  className="block px-4 py-3 text-sm hover:bg-gray-50 transition flex items-center gap-2"
                >
                  <FiUser size={14} /> Profile
                </a>
                <a
                  href="#"
                  className="block px-4 py-3 text-sm hover:bg-gray-50 transition flex items-center gap-2"
                >
                  <FiSettings size={14} /> Settings
                </a>
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-gray-50 transition flex items-center gap-2"
                >
                  <FiLogOut size={14} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Views based on activeNav */}
        {activeNav === "home" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {/* Recently Played */}
            <div className="bg-white p-5 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
              <h3 className="text-lg font-semibold text-indigo-600 mb-2 flex items-center gap-2">
                🎧 Recently Played
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Your recent tracks will appear here.
              </p>
              <div className="space-y-3">
                {recentTracks.map((track, idx) => (
                  <div
                    key={track.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition"
                    onClick={() => playTrack(track, idx)}
                  >
                    <img
                      src={track.cover}
                      alt={track.title}
                      className="w-10 h-10 rounded-md object-cover"
                    />
                    <div>
                      <div className="font-medium text-sm">{track.title}</div>
                      <div className="text-xs text-gray-500">{track.artist}</div>
                    </div>
                    {currentTrack?.id === track.id && (
                      <div className="ml-auto text-indigo-600">
                        {isPlaying ? <FiPause /> : <FiPlay />}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Playlists */}
            <div className="bg-white p-5 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-auto max-h-[600px]">
              <h3 className="text-lg font-semibold text-green-600 mb-2 flex items-center gap-2">
                📁 Your Playlists
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                View or edit your playlists here.
              </p>
              <div className="space-y-3">
                {(playlists || []).map((playlist, index) => (
                  <div
                    key={playlist.id || playlist.name + index}
                    className="flex flex-col gap-1 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition"
                  >
                    <div className="flex items-center mb-1">
                      <div className="w-8 h-8 rounded-md bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center text-green-600 mr-3">
                        <FiMusic size={16} />
                      </div>
                      <div className="font-medium text-sm">{playlist.name}</div>
                    </div>
                    {(playlist.tracks || []).map((song) => (
                      <div
                        key={song.id}
                        className="flex items-center gap-2 ml-8 hover:underline cursor-pointer"
                        onClick={() => playTrack(song)}
                      >
                        <img
                          src={song.coverImage || song.cover || ""}
                          className="w-7 h-7 rounded object-cover"
                          alt=""
                        />
                        <span>{song.title}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Discover */}
            <div className="bg-white p-5 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
              <h3 className="text-lg font-semibold text-purple-600 mb-2 flex items-center gap-2">
                🔥 Discover Music
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Trending songs and artists for you.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {["Pop Hits", "Indie Mix", "Jazz Lounge", "Rock Classics"].map(
                  (genre, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 hover:shadow-md transition cursor-pointer"
                    >
                      <div className="font-medium text-sm">{genre}</div>
                      <div className="text-xs text-purple-500 mt-1">Explore</div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        )}

        {activeNav === "favorites" && (
          <div>
            <h3 className="font-semibold text-lg mb-2 text-pink-600">
              Your Favorite Songs
            </h3>
            <div>
              {favorites.length > 0 ? (
                favorites.map((track) => (
                  <div
                    key={track.id}
                    className="flex items-center gap-3 p-2 hover:bg-gray-50 cursor-pointer"
                    onClick={() => playTrack(track)}
                  >
                    <img
                      src={track.coverImage || track.cover || ""}
                      alt={track.title}
                      className="w-10 h-10 rounded-md object-cover"
                    />
                    <div>
                      <div className="font-medium text-sm">{track.title}</div>
                      <div className="text-xs text-gray-500">{track.artist}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="pt-4 pb-8 text-gray-400">Nothing in favorites.</div>
              )}
            </div>
          </div>
        )}

        {activeNav === "playlist" && (
          <div>
            <h3 className="font-semibold text-lg mb-2 text-green-600">
              Your Playlists
            </h3>
            {(playlists && playlists.length > 0) ? (
              playlists.map((pl, idx) => (
                <div key={pl.id || pl.name + idx} className="mb-6">
                  <div className="font-bold text-base mb-1">{pl.name}</div>
                  {(pl.tracks && pl.tracks.length > 0) ? (
                    pl.tracks.map((song) => (
                      <div
                        key={song.id}
                        className="flex items-center gap-2 mt-2 cursor-pointer hover:bg-gray-50 rounded px-2"
                        onClick={() => playTrack(song)}
                      >
                        <img
                          src={song.coverImage || song.cover || ""}
                          className="w-8 h-8 rounded-md"
                          alt=""
                        />
                        <span>
                          {song.title} -{" "}
                          <span className="text-gray-500">{song.artist}</span>
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="ml-8 text-gray-400 text-xs py-2">Empty playlist</div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-gray-400 py-4">No playlists found. Add by song player.</div>
            )}
          </div>
        )}

        {activeNav === "settings" && <div>Settings view (demo stub)</div>}

        {/* ------- MUSIC PLAYER always at bottom ------- */}
        <MusicPlayer
          track={currentTrack}
          isPlaying={isPlaying}
          onTogglePlay={togglePlayPause}
          onSkipNext={playNext}
          onSkipPrev={playPrev}
          onToggleShuffle={toggleShuffle}
          isShuffle={isShuffle}
          onToggleRepeat={toggleRepeat}
          isRepeat={isRepeat}
          onQueueTrack={addToQueue}
          queue={queue}
          onToggleFavorite={handleToggleFavorite}
          isFavorite={isCurrentTrackFavorite}
          onAddToPlaylist={handleAddToPlaylist}
          currentTime={currentTime}
          duration={duration}
          onSeek={handleSeek}
          volume={volume}
          onVolumeChange={handleVolume}
        />
        <audio ref={audioRef} />
      </main>
    </div>
  );
};

export default Home;
