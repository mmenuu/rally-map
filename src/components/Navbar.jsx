import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white w-full flex justify-between items-center mx-auto px-8 h-16">
      <div className="inline-flex items-center space-x-8">
        <Link to="/">
          <div className="hidden md:block">Rally</div>
          <div className="block md:hidden">R</div>
        </Link>

        <div className="inline-flex items-center max-w-full">
          <div className="flex items-center flex-grow-0 flex-shrink pl-2 relative w-60 border rounded-full px-1  py-1">
            <input
              type="text"
              placeholder="Start your search"
              className="block flex-grow pl-2 flex-shrink overflow-hidden outline-none"
            />
            <div className="flex items-center justify-center relative h-8 w-8 rounded-full">
              <svg
                viewBox="0 0 32 32"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                role="presentation"
                focusable="false"
                className="text-gray-500"
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
      <div className="flex-initial">
        <div className="flex justify-end items-center relative">
          <div className="flex mr-4 items-center">
            <Link
              to="/map"
              className="inline-block py-2 px-4 bg-green-400 text-white rounded-full border border-opacity-0 hover:border-opacity-100 border-green-600 hover:text-green-600 hover:bg-white transition duration-200"
            >
              <span className="flex items-center relative cursor-pointer whitespace-nowrap">
                Start New Trip
              </span>
            </Link>
          </div>
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
                  <div className="py-2">
                    <button
                      onClick={() => {
                        navigate("/profile");
                      }}
                      className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </button>
                    <button
                      onClick={() => {
                        navigate("/saved-places");
                      }}
                      className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Saved Places
                    </button>
                    <button
                      onClick={logout}
                      className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
