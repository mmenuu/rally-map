import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
import * as THREE from "three";
import CLOUDS from "vanta/dist/vanta.clouds.min.js";
import AOS from "aos";
import "aos/dist/aos.css";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();

  const { login, user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/map");
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let formValid = true;

    // Basic validation
    if (formData.username.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        username: "Username is required",
      }));
      formValid = false;
    }

    if (formData.password.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "Password is required",
      }));
      formValid = false;
    }

    if (formValid) {
      login(formData);
    }
  };

  const vantaRef = useRef(null);
  let vantaEffect = null;

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

  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <div style={{ height: "100vh", width: "100%" }} ref={vantaRef}>
      <div
        className="flex flex-col items-center justify-center h-screen"
        data-aos="fade-right"
        data-aos-offset="300"
        data-aos-easing="ease-in-sine"
      >
        <div className="p-10 shadow-lg bg-opacity-20 backdrop-blur-lg rounded-xl drop-shadow-lg bg-white">
          <h1 className="text-3xl font-bold mb-4">Login</h1>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="username"
                className="block text-neutral-900 font-medium mb-1"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`w-full outline-none p-2 rounded-lg ${
                  errors.username ? "border-red-500" : ""
                }`}
                placeholder="Enter your username"
                autoComplete="off"
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-neutral-900 font-medium mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full outline-none  p-2 rounded-lg ${
                  errors.password ? "border-red-500" : ""
                }`}
                placeholder="Enter your password"
                autoComplete="off"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                className="w-full rounded-3xl bg-gray-900 px-6 py-2 text-xl font-medium uppercase text-white hover:bg-gray-800 transition duration-200 hover:ring-2 hover:ring-gray-900 hover:ring-offset-2 hover:ring-offset-white"
              >
                Login
              </button>
            </div>
          </form>

          <div className="mt-4">
            <p className="text-center font-light">
              Don't have an Account?{" "}
              <Link to="/register" className="text-white hover:underline">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
