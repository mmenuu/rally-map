import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import CLOUDS from "vanta/dist/vanta.clouds.min.js";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

const HomePage = () => {
  const vantaRef = useRef(null);
  let vantaEffect = null;

  useEffect(() => {
    AOS.init();
  }, []);

  useEffect(() => {
    vantaEffect = CLOUDS({
      el: vantaRef.current,
      THREE: THREE,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.0,
      minWidth: 200.0,
    });

    return () => {
      if (vantaEffect) {
        vantaEffect.destroy();
      }
    };
  }, []);

  return (
    <div style={{ height: "100vh", width: "100%" }} ref={vantaRef}>
      <main className="h-screen grid justify-center items-center md:grid-cols-12 container mx-auto px-8 gap-x-10 md:place-items-center pb-10 lg:pb-0 min-h-[42.5rem]">
        <div className="md:col-span-6 text-white my-14 lg:my-0">
          <h1
            data-aos="fade-right"
            data-aos-anchor="#example-anchor"
            data-aos-offset="700"
            data-aos-duration="700"
            className="capitalize text-6xl lg:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-600 "
          >
            Rally
          </h1>
          <p
            data-aos="fade-right"
            data-aos-anchor="#example-anchor"
            data-aos-offset="700"
            data-aos-duration="700"
            className="mt-4 mb-10 max-w-lg leading-relaxed text-neutral-100 font-light"
          >
            Create custom itineraries, discover new routes, find interesting
            landmarks, and get directions to your destinations - all in one
            place.
          </p>
          <Link
            data-aos="fade-right"
            data-aos-anchor="#example-anchor"
            data-aos-offset="700"
            data-aos-duration="700"
            to="/map"
            className="inline-block capitalize font-medium text-lg bg-gradient-to-r from-yellow-400 to-pink-600 text-white px-8 py-2 rounded-full hover:from-yellow-500 hover:to-pink-700 hover:ring-2 hover:ring-yellow-400 hover:ring-offset-2 hover:ring-offset-white"
          >
            try it out
          </Link>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
