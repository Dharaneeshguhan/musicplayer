import React, { useEffect, useState, useRef, useCallback } from "react";
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
  FiUpload,
} from "react-icons/fi";
import MusicPlayer from "./MusicPlayer";
import FavoritesPage from "./FavoritesPage";
import ProfilePage from "./Profile";
import SettingsPage from "./SettingsPage";
import LocalMusicPlayer from "./LocalMusicPlayer";
import axios from "axios";

const API_BASE = "http://localhost:8080/api";

const Home = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [user, setUser] = useState({});
  const [recentTracks, setRecentTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [queue, setQueue] = useState([]);
  const [queueIndex, setQueueIndex] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const audioRef = useRef(null);

  const formatTime = (time) => {
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleQueueTrack = (track) => {
    setQueue(prev => [...prev, track]);
    setQueueIndex(prev => prev + 1);
  };

  const handleToggleFavorite = async (trackId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const isCurrentlyFavorite = favorites.some(f => f.id === trackId);
      const url = `${API_BASE}/favorites/${trackId}`;

      if (isCurrentlyFavorite) {
        await axios.delete(url, { headers });
      } else {
        await axios.post(url, {}, { headers });
      }

      // Always fetch updated list from backend to ensure consistency
      const updatedFavorites = await fetchWithDetailedError(`${API_BASE}/favorites`);
      setFavorites(updatedFavorites);
    } catch (err) {
      setErrorMsg(err.message || "Error updating favorites");
      console.error("Favorite toggle failed:", err);
    }
  };

  const fetchWithDetailedError = async (url, options = {}) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Validate token first
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const userEmail = decodedToken.sub?.toLowerCase();
      
      console.log('Fetching data with token:', token.substring(0, 20) + '...');
      console.log('User email:', userEmail);
      
      // Add proper headers
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      
      const config = {
        ...options,
        headers: {
          ...headers,
          ...options.headers
        }
      };
      
      const method = options.method || 'GET';
      const data = options.data;

      // Use axios method based on HTTP method
      const axiosMethod = {
        GET: axios.get,
        POST: axios.post,
        PUT: axios.put,
        DELETE: axios.delete
      }[method];

      if (!axiosMethod) {
        throw new Error(`Unsupported HTTP method: ${method}`);
      }

      // Log the request details
      console.log('Making request to:', url);
      console.log('Method:', method);
      console.log('Headers:', config.headers);
      console.log('Data:', data);

      const response = await axiosMethod(url, data ? { ...config, data } : config);
      
      if (response.status !== 200) {
        console.error('API Response:', response.data);
        throw new Error(`Failed to fetch data: ${response.data?.message || 'Unknown error'}`);
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching data:', {
        error: error.response?.data || error.message,
        status: error.response?.status,
        config: error.config
      });
      throw error;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    // Validate token first and extract email
    let userEmail;
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      userEmail = decodedToken.sub?.toLowerCase();
      console.log('Validated token for user:', userEmail);
    } catch (err) {
      console.error('Invalid token:', err);
      window.location.href = '/login';
      return;
    }

    // If we got here, token is valid and we have userEmail
    if (!userEmail) {
      console.error('No user email found in token');
      window.location.href = '/login';
      return;
    }

    // Check if user exists in database
    fetchWithDetailedError(`${API_BASE}/user/check-user?email=${userEmail}`)
      .then(response => {
        console.log('User check response:', response);
        if (response.includes('true')) {
          // User exists, proceed with fetching data
            return Promise.all([
              fetchWithDetailedError(`${API_BASE}/tracks`)
            ]);
          } else {
            console.error('User does not exist in database');
            setErrorMsg('User not found in database');
            return Promise.reject(new Error('User not found'));
          }
        })
        .then(([tracks]) => {
          setRecentTracks(tracks);
        })
      .catch((err) => {
        console.error('Error:', err);
        setErrorMsg(err.message);
      });
  }, []);

  const handleTrackClick = (track) => {
    setCurrentTrack(track);
    setQueue(recentTracks);
    setQueueIndex(recentTracks.findIndex((t) => t.id === track.id));
    setIsPlaying(true);
  };

  const togglePlay = () => setIsPlaying((prev) => !prev);
  const toggleShuffle = () => setIsShuffle((prev) => !prev);
  const toggleRepeat = () => setIsRepeat((prev) => !prev);

  const playNext = useCallback(() => {
    if (queue.length === 0) return;
    let nextIndex = isShuffle ? Math.floor(Math.random() * queue.length) : queueIndex + 1;
    if (nextIndex >= queue.length) nextIndex = 0;
    setQueueIndex(nextIndex);
    setCurrentTrack(queue[nextIndex]);
    setIsPlaying(true);
  }, [isShuffle, queue, queueIndex]);

  const playPrevious = () => {
    let prevIndex = queueIndex - 1;
    if (prevIndex < 0) prevIndex = queue.length - 1;
    setQueueIndex(prevIndex);
    setCurrentTrack(queue[prevIndex]);
    setIsPlaying(true);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onEnded = () => {
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play();
      } else {
        playNext();
      }
    };
    audio.addEventListener("ended", onEnded);
    return () => audio.removeEventListener("ended", onEnded);
  }, [isRepeat, playNext]);

  const filteredTracks = recentTracks.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );


  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const handleSeek = (value) => {
    if (audioRef.current) {
      audioRef.current.currentTime = (value / 100) * audioRef.current.duration;
    }
  };

  const handleVolumeChange = (value) => {
    if (audioRef.current) {
      audioRef.current.volume = value / 100;
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 to-indigo-50 font-sans">
      <aside className="w-64 bg-white p-6 border-r shadow-md">
        <h2 className="text-3xl font-bold text-indigo-600 mb-8">🎵 Y Cave</h2>
        <nav className="space-y-6 text-gray-700">
          <button onClick={() => setActiveTab("home")} className="flex items-center gap-3 hover:text-indigo-600">
            <FiHome /> Home
          </button>
          <button onClick={() => setActiveTab("favorites")} className="flex items-center gap-3 hover:text-indigo-600">
            <FiHeart /> Favorites
          </button>

          <button onClick={() => setActiveTab("localmusic")} className="flex items-center gap-3 hover:text-indigo-600">
            <FiUpload /> Local Music
          </button>
        </nav>
        <div className="mt-10">
          <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-indigo-600">
            <FiUser className="text-lg" />
            {user.name}
            <FiChevronDown className={`${dropdownOpen ? "rotate-180" : ""} transition-transform`} />
          </button>
          {dropdownOpen && (
            <div className="mt-2 space-y-2 ml-6 text-sm">
              <button onClick={() => setActiveTab("profile")} className="block text-left hover:text-indigo-600">
                <FiUser className="inline mr-1" /> Profile
              </button>
              <button onClick={() => setActiveTab("settings")} className="block text-left hover:text-indigo-600">
                <FiSettings className="inline mr-1" /> Settings
              </button>
              <button onClick={logout} className="block text-left hover:text-red-600">
                <FiLogOut className="inline mr-1" /> Logout
              </button>
            </div>
          )}
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by title or artist"
            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {activeTab === "home" && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Recently Played</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredTracks.map((track) => (
                <div
                  key={track.id}
                  className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition"
                  onClick={() => handleTrackClick(track)}
                >
                  <img
                    src={track.albumCover || "https://via.placeholder.com/150"}
                    alt={track.title}
                    className="w-full h-32 object-cover rounded"
                  />
                  <div className="mt-2 font-semibold text-lg truncate">{track.title}</div>
                  <div className="text-sm text-gray-600 truncate">{track.artist}</div>
                </div>
              ))}
            </div>
          </div>
        )}



        {activeTab === "localmusic" && (
          <LocalMusicPlayer onTrackSelect={handleTrackClick} />
        )}
        {activeTab === "profile" && <ProfilePage user={user} />}
        {activeTab === "settings" && <SettingsPage />}
      </main>

      {currentTrack && (
        <MusicPlayer
          ref={audioRef}
          track={currentTrack}
          isPlaying={isPlaying}
          onTogglePlay={() => setIsPlaying(!isPlaying)}
          onSkipNext={playNext}
          onSkipPrev={playPrevious}
          onToggleShuffle={toggleShuffle}
          onToggleRepeat={toggleRepeat}
          isShuffle={isShuffle}
          isRepeat={isRepeat}
          queue={queue}
          onQueueTrack={handleQueueTrack}
          onToggleFavorite={handleToggleFavorite}
          isFavorite={Array.isArray(favorites) && favorites.some(f => f.id === currentTrack?.id)}
          currentTime={audioRef.current?.currentTime || 0}
          duration={audioRef.current?.duration || 0}
          onSeek={handleSeek}
          volume={audioRef.current?.volume || 1}
          onVolumeChange={handleVolumeChange}
          queueIndex={queueIndex}
          onTrackSelect={(track, index) => {
            setCurrentTrack(track);
            setQueueIndex(index);
            setIsPlaying(true);
          }}
          formatTime={formatTime}
        />
      )}

      {errorMsg && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded shadow">
          {errorMsg}
        </div>
      )}
    </div>
  );
};

export default Home;