import React, { useState, useReducer, useMemo, useCallback } from 'react';
import useFetchPhotos from './useFetchPhotos';
import { favoritesReducer, initialState } from './favoritesReducer';

function App() {
  const { photos, loading, error } = useFetchPhotos();
  const [favorites, dispatch] = useReducer(favoritesReducer, initialState);
  const [searchTerm, setSearchTerm] = useState('');
  const filteredPhotos = useMemo(() => {
    return photos.filter((photo) =>
      photo.author.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [photos, searchTerm]);
  const handleSearch = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const toggleFavorite = (id) => {
    dispatch({ type: 'TOGGLE_FAVORITE', payload: { id } });
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Photo Gallery</h1>
        <div className="mb-10 flex justify-center">
          <input
            type="text"
            placeholder="Search by author name..."
            className="w-full max-w-md p-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredPhotos.map((photo) => (
            <div key={photo.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow border border-gray-100">
              <img 
                src={photo.download_url} 
                alt={photo.author} 
                className="w-full h-56 object-cover" 
                loading="lazy"
              />
              <div className="p-4 flex justify-between items-center">
                <span className="font-semibold text-gray-700 truncate mr-2">{photo.author}</span>
                <button 
                  onClick={() => toggleFavorite(photo.id)}
                  className="focus:outline-none transition-transform active:scale-125"
                  aria-label="Toggle Favorite"
                >
                  <svg 
                    className={`w-7 h-7 ${favorites.includes(photo.id) ? 'text-red-500 fill-current' : 'text-gray-300'}`} 
                    viewBox="0 0 24 24" 
                    stroke="currentColor" 
                    strokeWidth="2"
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
        {filteredPhotos.length === 0 && (
          <p className="text-center text-gray-500 mt-10">No authors found matching "{searchTerm}"</p>
        )}
      </div>
    </div>
  );
}

export default App;