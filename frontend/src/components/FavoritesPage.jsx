const FavoritesPage = ({ favorites, playTrack, currentTrack, toggleFavorite }) => (
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
              <button
                onClick={() => toggleFavorite(track.id)}
                aria-label="Toggle Favorite"
                className="ml-4 text-red-600"
              >
                {currentTrack?.id === track.id ? <FiPause /> : <FiPlay />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
  export default FavoritesPage;