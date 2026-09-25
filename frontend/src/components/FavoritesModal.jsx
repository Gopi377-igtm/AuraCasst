import React from 'react';
import { Star, X, MapPin, Trash2, StarOff } from 'lucide-react';

export default function FavoritesModal({
  isOpen,
  onClose,
  favorites = [],
  onSelectFavorite,
  onDeleteFavorite
}) {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="glass-card w-full max-w-lg rounded-3xl p-6 sm:p-7 border border-white/20 shadow-2xl relative"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Star className="w-5 h-5 fill-amber-400/20" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">
                Favorite Cities
              </h3>
              <p className="text-xs text-slate-400">Saved securely in MongoDB Atlas</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="max-h-80 overflow-y-auto divide-y divide-white/5 space-y-1 pr-1">
          {favorites && favorites.length > 0 ? (
            favorites.map((fav) => (
              <div
                key={fav._id}
                className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/10 transition-colors group"
              >
                <div
                  onClick={() => {
                    onSelectFavorite({
                      name: fav.name,
                      country: fav.country,
                      latitude: fav.latitude,
                      longitude: fav.longitude
                    });
                    onClose();
                  }}
                  className="flex items-center gap-3 cursor-pointer flex-grow"
                >
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-105 transition-transform">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors">
                      {fav.name}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {fav.country || 'Global'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onDeleteFavorite(fav._id)}
                  title="Delete from MongoDB"
                  className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-slate-400 text-sm">
              <StarOff className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="font-medium">No favorite locations saved yet.</p>
              <p className="text-xs text-slate-500 mt-1">
                Click the star icon next to any city to save it to MongoDB Atlas.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
