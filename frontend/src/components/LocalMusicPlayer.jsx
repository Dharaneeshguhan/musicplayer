import React, { useState, useEffect } from 'react';
import { FiMusic, FiUpload } from 'react-icons/fi';
import MusicPlayer from './MusicPlayer';

const LocalMusicPlayer = ({ onTrackSelect }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioRef, setAudioRef] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    return () => {
      if (audioRef?.src) {
        URL.revokeObjectURL(audioRef.src);
      }
    };
  }, [audioRef]);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setError('');
      setSelectedFile(file);
      setIsPlaying(false);
      setCurrentTime(0);
      
      // Create new audio element
      const audio = new Audio();
      audio.src = URL.createObjectURL(file);
      
      // Set up event listeners
      audio.onloadedmetadata = () => {
        setDuration(audio.duration);
      };
      
      audio.onerror = (e) => {
        setError('Failed to load audio file');
        console.error('Audio error:', e);
      };

      // Track current time
      audio.ontimeupdate = () => {
        setCurrentTime(audio.currentTime);
      };
      
      // Handle ended event
      audio.onended = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };
      
      setAudioRef(audio);
    } catch (error) {
      console.error('Error loading file:', error);
      setError('Failed to load the selected file');
    }
  };

  const handlePlayPause = () => {
    if (!audioRef) return;
    
    if (isPlaying) {
      audioRef.pause();
    } else {
      audioRef.play().catch((error) => {
        setError('Failed to play audio');
        console.error('Play error:', error);
      });
    }
    setIsPlaying(!isPlaying);
  };

  // Update current time when audio is playing
  useEffect(() => {
    if (audioRef) {
      const updateCurrentTime = () => {
        setCurrentTime(audioRef.currentTime);
      };
      
      audioRef.addEventListener('timeupdate', updateCurrentTime);
      
      return () => {
        audioRef.removeEventListener('timeupdate', updateCurrentTime);
      };
    }
  }, [audioRef]);

  // Handle play/pause state changes from MusicPlayer
  useEffect(() => {
    if (audioRef) {
      if (isPlaying) {
        audioRef.play().catch((error) => {
          setError('Failed to play audio');
          console.error('Play error:', error);
        });
      } else {
        audioRef.pause();
      }
    }
  }, [isPlaying, audioRef]);

  const handleSeek = (value) => {
    if (audioRef) {
      audioRef.currentTime = value;
      setCurrentTime(value);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const track = selectedFile ? {
    title: selectedFile.name,
    artist: 'Local File',
    cover: 'https://via.placeholder.com/300x300?text=Local+Music',
    duration: duration
  } : null;

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-red-600">Local Music Player</h2>
        <div className="flex items-center gap-4">
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            className="hidden"
            id="music-file"
          />
          <button
            onClick={() => document.getElementById('music-file').click()}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            <FiUpload className="mr-2" />
            Choose File
          </button>
          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}
        </div>
      </div>

      {selectedFile && (
        <div className="mb-6">
          <div className="bg-red-100 p-4 rounded-lg">
            <div className="text-lg font-semibold mb-2">Selected File:</div>
            <div className="text-gray-600">{selectedFile.name}</div>
            <div className="text-sm text-gray-500">Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</div>
            <div className="mt-2">
              <button
                onClick={handlePlayPause}
                className={`px-4 py-2 rounded ${
                  isPlaying ? 'bg-red-700' : 'bg-red-600'
                } text-white hover:bg-red-700 transition-colors`}
              >
                {isPlaying ? 'Pause' : 'Play'}
              </button>
            </div>
          </div>
        </div>
      )}

      {track && (
        <MusicPlayer
          track={track}
          isPlaying={isPlaying}
          onTogglePlay={handlePlayPause}
          currentTime={currentTime}
          duration={duration}
          onSeek={handleSeek}
          onTrackSelect={onTrackSelect}
          formatTime={formatTime}
          audioRef={audioRef}
          onVolumeChange={(value) => {
            if (audioRef) {
              audioRef.volume = value / 100;
            }
          }}
          onPlay={() => {
            if (!isPlaying) {
              handlePlayPause();
            }
          }}
          onPause={() => {
            if (isPlaying) {
              handlePlayPause();
            }
          }}
        />
      )}
    </div>
  );
};

export default LocalMusicPlayer;
