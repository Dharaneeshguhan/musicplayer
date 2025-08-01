import React, { useState } from 'react';
import axios from 'axios';

const PlaylistManager = ({ tracks, onPlaylistCreated, onTrackAdded }) => {
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const [selectedTrackId, setSelectedTrackId] = useState(null);
  const [error, setError] = useState('');

  const createPlaylist = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/playlists', {
        name: newPlaylistName
      });
      
      if (response.data) {
        onPlaylistCreated();
        setNewPlaylistName('');
        setError('');
      }
    } catch (err) {
      setError('Failed to create playlist');
    }
  };

  const addTrackToPlaylist = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/playlists/${selectedPlaylistId}/add/${selectedTrackId}`
      );
      
      if (response.data) {
        onTrackAdded();
        setSelectedPlaylistId(null);
        setSelectedTrackId(null);
        setError('');
      }
    } catch (err) {
      setError('Failed to add track to playlist');
    }
  };

  return (
    <div className="space-y-6">
      {/* Create Playlist Section */}
      <div className="p-4 bg-white rounded shadow">
        <h3 className="font-semibold text-indigo-700 mb-3">Create New Playlist</h3>
        <div className="space-y-4">
          <div>
            <input
              type="text"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              placeholder="Enter playlist name"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            onClick={createPlaylist}
            className="w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            disabled={!newPlaylistName.trim()}
          >
            Create Playlist
          </button>
        </div>
      </div>

      {/* Add Track to Playlist Section */}
      <div className="p-4 bg-white rounded shadow">
        <h3 className="font-semibold text-indigo-700 mb-3">Add Track to Playlist</h3>
        <div className="space-y-4">
          <div>
            <select
              value={selectedPlaylistId}
              onChange={(e) => setSelectedPlaylistId(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select a playlist</option>
              {tracks.map((track) => (
                <option key={track.id} value={track.id}>
                  {track.title} - {track.artist}
                </option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={selectedTrackId}
              onChange={(e) => setSelectedTrackId(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select a track</option>
              {tracks.map((track) => (
                <option key={track.id} value={track.id}>
                  {track.title} - {track.artist}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={addTrackToPlaylist}
            className="w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            disabled={!selectedPlaylistId || !selectedTrackId}
          >
            Add Track
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded">
          {error}
        </div>
      )}
    </div>
  );
};

export default PlaylistManager;
