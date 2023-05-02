import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { LRUCache } from "lru-cache";

const cache = new LRUCache({
  max: 100, // maximum number of items to store in the cache
  maxAge: 1000 * 60 * 10, // maximum age of an item in the cache (in milliseconds)
});

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);

  const { user, logout } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    async function fetchData() {
      if (searchQuery.length > 0) {
        if (cache.has(searchQuery)) {
          const cachedResults = cache.get(searchQuery);
          setResults(cachedResults);
        } else {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/roadtrips?search=${searchQuery}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          const data = await response.json();
          setResults(data);
          cache.set(searchQuery, data);
        }
      }
    }
    fetchData();
  }, [searchQuery]);

  return (
    <div>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white w-full flex justify-between items-center px-8 h-16">
        <div className="inline-flex items-center space-x-8">
          <Link to="/">
            <div className="hidden md:block text-xl font-medium text-blue-500">
              Rally
            </div>
            <div className="block md:hidden">R</div>
          </Link>

          <div className="hidden md:inline-flex items-center">
            <div className="flex items-center flex-grow-0 flex-shrink pl-2 relative w-60 border rounded-full px-1  py-1 border-blue-300">
              <input
                type="text"
                placeholder="Start your search"
                className="block flex-grow pl-2 flex-shrink overflow-hidden outline-none bg-transparent text-sm text-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              <div className="flex items-center justify-center relative h-8 w-8 rounded-full">
                <svg
                  viewBox="0 0 32 32"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  role="presentation"
                  focusable="false"
                  className="text-blue-300"
                  style={{
                    display: "block",
                    fill: "none",
                    height: 12,
                    width: 12,
                    stroke: "currentcolor",
                    strokeWidth: "5.33333",
                    overflow: "visible",
                  }}
                >
                  <g fill="none">
                    <path d="m13 24c6.0751322 0 11-4.9248678 11-11 0-6.07513225-4.9248678-11-11-11-6.07513225 0-11 4.92486775-11 11 0 6.0751322 4.92486775 11 11 11zm8-3 9 9" />
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end items-center relative">
          <Link
            to="/map"
            className="hidden md:inline-block py-2 mr-4 px-4 bg-green-400 text-white rounded-full border border-opacity-0 hover:border-opacity-100 border-green-600 hover:text-green-600 hover:bg-white transition duration-200"
          >
            <span className="flex items-center relative cursor-pointer whitespace-nowrap">
              Start New Trip
            </span>
          </Link>
          <div className="block">
            <div className="inline relative group">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center relative px-2 border rounded-full hover:shadow-lg"
              >
                <div className="pl-1">
                  <svg
                    viewBox="0 0 32 32"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    role="presentation"
                    focusable="false"
                    style={{
                      display: "block",
                      fill: "none",
                      height: 16,
                      width: 16,
                      stroke: "currentcolor",
                      strokeWidth: 3,
                      overflow: "visible",
                    }}
                  >
                    <g fill="none" fillRule="nonzero">
                      <path d="m2 16h28" />
                      <path d="m2 24h28" />
                      <path d="m2 8h28" />
                    </g>
                  </svg>
                </div>
                <div className="block flex-grow-0 flex-shrink-0 h-10 w-12 pl-5">
                  <svg
                    viewBox="0 0 32 32"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    role="presentation"
                    focusable="false"
                    style={{
                      display: "block",
                      height: "100%",
                      width: "100%",
                      fill: "currentcolor",
                    }}
                  >
                    <path d="m16 .7c-8.437 0-15.3 6.863-15.3 15.3s6.863 15.3 15.3 15.3 15.3-6.863 15.3-15.3-6.863-15.3-15.3-15.3zm0 28c-4.021 0-7.605-1.884-9.933-4.81a12.425 12.425 0 0 1 6.451-4.4 6.507 6.507 0 0 1 -3.018-5.49c0-3.584 2.916-6.5 6.5-6.5s6.5 2.916 6.5 6.5a6.513 6.513 0 0 1 -3.019 5.491 12.42 12.42 0 0 1 6.452 4.4c-2.328 2.925-5.912 4.809-9.933 4.809z" />
                  </svg>
                </div>
              </button>

              {isMenuOpen && (
                <div
                  onMouseLeave={() => {
                    setIsMenuOpen(false);
                  }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-lg border shadow-lg overflow-hidden z-10 transition duration-200"
                >
                  <Link
                    to="/map"
                    className="block md:hidden w-full px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                  >
                    Start New Trip
                  </Link>
                  <Link
                    to="/profile"
                    className="block w-full px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/saved-places"
                    className="block w-full px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                  >
                    Saved Places
                  </Link>
                  <Link
                    to="/magazines"
                    className="block w-full px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                  >
                    Magazines
                  </Link>
                  <Link
                    onClick={logout}
                    className="block w-full px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 border-t-[1px]"
                  >
                    Logout
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      {searchQuery.length > 0 && (
        <div className="fixed top-16 flex flex-col bg-white w-[400px] h-screen z-50">
          <p className="px-4 py-4 border-b border-neutral-200 text-right text-neutral-400">
            {results.length} result{results.length > 1 && "s"} for "
            {searchQuery}"
          </p>
          {results.length > 0 && (
            <ul>
              {results.map((result) => (
                <li key={result.id}>
                  <div className="flex items-center justify-between px-4 py-4 border-b border-neutral-200">
                    {result.title && (
                      <Link to={`roadtrip/${result.id}`}>
                        <h1 className="hover:underline">{result.title}</h1>
                      </Link>
                    )}
                    {result.name && <h1>{result.name}</h1>}
                    {result.author && <p>{result.author}</p>}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
