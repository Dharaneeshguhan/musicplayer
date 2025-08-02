import React from 'react';
import { FiPlay, FiPause, FiHeart, FiTrash2 } from 'react-icons/fi';

const FavoritesPage = ({ favorites, playTrack, currentTrack, onToggleFavorite }) => (
    <section>
      <h2 className="mb-5 text-xl font-semibold text-red-600">Favorite Tracks</h2>
      {favorites.length === 0 ? (
        <div className="text-gray-400 text-center text-lg py-10">No favorite tracks.</div>
      ) : (
        <ul>
          {favorites.map(track => (
            <li
              key={track.id}
              className="flex items-center justify-between cursor-pointer rounded px-2 py-2 hover:bg-red-50"
            >
              <div
                className="flex items-center flex-grow"
                onClick={() => playTrack(track)}
                tabIndex={0}
                onKeyPress={e => e.key === "Enter" && playTrack(track)}
                role="button"
              >
                <img src={track.cover || ""} alt={track.title} className="mr-3 w-10 h-10 rounded object-cover" />
                <div>
                  <div className="font-medium">{track.title}</div>
                  <div className="text-xs text-gray-500">{track.artist}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => onToggleFavorite(track.id)}
                  aria-label="Toggle Favorite"
                  className="text-red-600 hover:text-red-500"
                >
                  <FiHeart className={`w-5 h-5 ${currentTrack?.id === track.id ? 'text-red-500' : 'text-gray-400'}`} />
                </button>
                <button
                  onClick={() => window.confirm('Are you sure you want to remove this track from favorites?') && onToggleFavorite(track.id)}
                  aria-label="Remove Favorite"
                  className="text-red-600 hover:text-red-500"
                  title="Remove from favorites"
                >
                  <FiTrash2 className="w-5 h-5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
  export default FavoritesPage;