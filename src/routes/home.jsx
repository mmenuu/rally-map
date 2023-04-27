import React from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col md:flex-row h-screen w-full  relative">
      <div className="md:w-1/2 flex items-center justify-center">
        <div className="p-10">
          <h1 className="text-5xl font-bold mb-2">Welcome to Rally</h1>
          <p className="text-2xl mb-6">
            Rally is a roadtrip planning app that allows you to create and share
            roadtrips with your friends.
          </p>
          <button
            onClick={() => navigate("/map")}
            className="bg-black text-white text-xl px-6 py-2 rounded-lg uppercase cursor-pointer"
          >
            Try it out
          </button>
        </div>
      </div>
      <div className="md:w-1/2 h-[70vh] top-[50%] translate-y-[-50%] absolute right-0 rounded-l-3xl overflow-hidden shadow-2xl">
        <img
          src="https://media.wired.com/photos/59269cd37034dc5f91bec0f1/191:100/w_1280,c_limit/GoogleMapTA.jpg"
          className="w-full h-full object-cover"
          alt="Can You Write"
        />
        <div className="absolute inset-0 bg-black opacity-25"></div>
      </div>
    </div>
  );
}
