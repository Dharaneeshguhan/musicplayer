import React, { useState } from "react";
import {
  FiPlay, FiPause, FiSkipBack, FiSkipForward, FiRepeat, FiShuffle,
  FiShare2, FiChevronDown, FiHeart, FiPlus, FiList
} from "react-icons/fi";

const MusicPlayer = ({
  track,
  isPlaying,
  onTogglePlay,
  onSkipNext,
  onSkipPrev,
  onToggleShuffle,
  isShuffle,
  onToggleRepeat,
  isRepeat,
  onQueueTrack,
  queue = [],
  onToggleFavorite,
  isFavorite,
  onAddToPlaylist,
  currentTime,
  duration,
  onSeek,
  volume,
  onVolumeChange,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatTime = (seconds = 0) => {
    const mins = Math.floor(seconds / 60) || 0;
    const secs = Math.floor(seconds % 60) || 0;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (!track) return null;

  return (
    <div className={`w-full fixed bottom-0 left-0 text-white z-50 transition-all duration-300 ${isExpanded ? "h-full bg-black" : "h-28 bg-[#121212]"}`}>
      {isExpanded && (
        <div className="flex justify-between items-center p-4">
          <button onClick={() => setIsExpanded(false)} className="text-white">
            <FiChevronDown size={24} />
          </button>
          <span className="text-lg font-semibold">Now Playing</span>
          <span className="w-6" />
        </div>
      )}

      <div
        className={`flex ${isExpanded ? "flex-col items-center justify-center" : "flex-row items-center px-6"} py-2`}
        onClick={!isExpanded ? () => setIsExpanded(true) : undefined}
        style={{cursor: !isExpanded ? "pointer" : "default"}}
      >
        <img
          src={track.cover}
          alt={track.title}
          className={isExpanded ? "w-80 h-80 rounded-lg shadow-lg object-cover" : "w-14 h-14 rounded-md mr-4"}
        />
        <div className={isExpanded ? "mt-7 mb-3 text-center" : "flex-grow"}>
          <h3 className="font-medium text-white">{track.title}</h3>
          <p className="text-sm text-gray-400">{track.artist}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center w-full max-w-xl mx-auto">
        <div className="flex justify-center items-center gap-6 mb-2">
          <button className={`hover:text-white ${isShuffle ? "text-green-400" : "text-gray-400"}`} onClick={e => {e.stopPropagation(); onToggleShuffle();}} title="Shuffle">
            <FiShuffle />
          </button>
          <button className="text-gray-400 hover:text-white" onClick={e=>{e.stopPropagation();onSkipPrev();}} title="Previous">
            <FiSkipBack size={24} />
          </button>
          <button
            onClick={e=>{e.stopPropagation();onTogglePlay();}}
            className="bg-white text-black p-3 rounded-full hover:bg-gray-300"
            title="Play/Pause"
          >
            {isPlaying ? <FiPause size={20} /> : <FiPlay size={20} />}
          </button>
          <button className="text-gray-400 hover:text-white" onClick={e=>{e.stopPropagation();onSkipNext();}} title="Next">
            <FiSkipForward size={24} />
          </button>
          <button className={`hover:text-white ${isRepeat ? "text-purple-500" : "text-gray-400"}`} onClick={e=>{e.stopPropagation();onToggleRepeat();}} title="Repeat">
            <FiRepeat />
          </button>
          {isExpanded && (
            <button className="text-gray-400 hover:text-blue-300 ml-3" title="Queue" onClick={e=>{e.stopPropagation();onQueueTrack(track);}}>
              <FiList />
            </button>
          )}
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 text-xs w-full px-6">
          <span>{formatTime(currentTime)}</span>
          <input
            type="range"
            value={duration ? (currentTime / duration) * 100 : 0}
            onChange={onSeek}
            className="w-full h-1 bg-gray-700 rounded-full appearance-none cursor-pointer"
            min="0"
            max="100"
          />
          <span>{formatTime(duration)}</span>
        </div>
        {/* Volume control, only expanded */}
        {isExpanded && (
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={onVolumeChange}
            className="my-2"
            style={{width: 150}}
          />
        )}

        {/* Actions: Favorite / Playlist / Share */}
        {isExpanded && (
          <div className="mt-4 flex gap-6">
            <button
              onClick={e=>{e.stopPropagation();onToggleFavorite(track.id);}}
              className={`hover:text-red-500 ${isFavorite ? "text-red-500" : "text-gray-300"}`}
              title="Favorite"
            >
              <FiHeart size={20} />
            </button>
            <button
              onClick={e => {e.stopPropagation();onAddToPlaylist();}}
              className="text-gray-300 hover:text-white"
              title="Add to Playlist"
            >
              <FiPlus size={20} />
            </button>
            <button className="text-gray-300 hover:text-white" title="Share">
              <FiShare2 size={20} />
            </button>
          </div>
        )}
        {/* Show queue (expanded) */}
        {isExpanded && queue.length > 0 && (
          <div className="mt-6 w-full max-w-md mx-auto">
            <div className="text-white font-semibold mb-1">Queue</div>
            {queue.map((q, idx) => (
              <div key={q.id + idx} className="text-sm text-gray-200 py-1">
                {q.title} - <span className="text-gray-400">{q.artist}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MusicPlayer;
