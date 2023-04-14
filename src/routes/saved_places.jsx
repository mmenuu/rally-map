import React, { useState, useEffect } from "react";

import favoriteServices from "../services/favoriteServices";

export default function SavedPlacesPage() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const getFavorites = async () => {
      const favorites = await favoriteServices.getFavorites();
      setFavorites(favorites);
    };

    getFavorites();
  }, []);

  return (
    <div className="container mt-20 mx-auto max-w-3xl h-screen space-y-8 ">
      <div className="space-y-2">
        <h2 className="text-center text-2xl font-medium mt-8">Favorites</h2>

        {(favorites.length > 0 && (
          <ul className="grid grid-cols-3 gap-4">
            {favorites.map((favorite) => (
              <li
                className="p-4 shadow-sm rounded-xl bg-rose-50 space-y-2 border border-rose-200"
                key={favorite.id}
              >
                <p>{favorite.name}</p>
              </li>
            ))}
          </ul>
        )) || <p className="text-center">No favorites</p>}
      </div>
    </div>
  );
}
